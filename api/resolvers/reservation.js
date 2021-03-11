import { Op } from 'sequelize';
import moment from 'moment';
import { ValidationError } from 'apollo-server-errors';

// Mean time (in minutes) that a customer spent dining.
// This is the time window a table is occupied
const MEAN_TIME_CUSTOMER = 45;

export default {
	Reservation: {
		table: ({ tableId }, args, { db }) =>
			db.table.findOne({ where: { id: tableId } }),
	},
	Query: {
		reservation: (parent, { id }, { db }) => db.reservation.findByPk(id),

		/** If not passed any filters, it returns all reservations ordered by reservation date.
		 * May be filtered by party size, between a given datetime range
		 * @param {*} args filters
		 * @param {*} param2 Database context
		 * @returns Reservations
		 */
		reservations: async (_, args, { db }) => {
			if (!args.filter) {
				return db.reservation.findAll({
					order: ['reservationDateTime'],
				});
			}

			const { size, from, to } = args.filter;

			const reservations = await db.reservation.findAll({
				where: {
					cancelationDateTime: null,
					reservationDateTime: {
						[Op.between]: [from, to],
					},
				},
				include: [
					{
						model: db.table,
						where: { size: { [Op.gte]: size } },
					},
				],
			});
			return reservations;
		},

		reservationsBySize: async (parent, { size }, { db }) => {
			const tablesLen = (
				await db.table.findAll({
					where: {
						size: {
							[Op.gte]: size,
						},
					},
				})
			).length;

			if (!tablesLen) return [];

			const reservations = await db.reservation.findAll({
				where: {
					cancelationDateTime: null,
					reservationDateTime: {
						[Op.gt]: moment().subtract(4, 'hours'),
					},
				},
			});

			const reservedDates = [];
			const diff = moment().add(1, 'M').diff(new Date(), 'days');

			for (let i = 1; i <= diff; i += 1) {
				const actualDate = moment().add(i, 'days').toDate();
				const actualReservedTables = reservations.filter(
					({ reservationDateTime }) =>
						moment(reservationDateTime).isSame(actualDate, 'date')
				);

				if (actualReservedTables.length === tablesLen) {
					reservedDates.push(actualDate);
				}
			}
			if (!reservedDates.length) return ['available'];
			return reservedDates;
		},

		/** Returns the reservations booked for a given day
		 * @param {size} Integer Number of people to seat
		 * @param {date} DateTime Date to check
		 * @returns Reservations booked for the given day
		 */
		reservationsDay: async (_, { size, date }, { db }) => {
			const day = moment(date).format('YYYY-MM-DD');
			const tomorrow = moment(day).add(1, 'days');

			const reservations = await db.reservation.findAll({
				where: {
					cancelationDateTime: null,
					reservationDateTime: {
						[Op.between]: [day, tomorrow],
					},
				},
				include: [
					{
						model: db.table,
						where: { size: { [Op.gte]: size } },
					},
				],
			});
			return reservations;
		},
	},

	Mutation: {
		createReservation: async (_, { reservation }, { db }) => {
			const { reservationDateTime, partySize } = reservation;

			const from = moment(reservationDateTime);
			const to = moment(from).add(MEAN_TIME_CUSTOMER, 'm');

			try {
				return await db.sequelize.transaction(async () => {
					// Find all other reservations in range
					const reservationsInRange = await db.reservation
						.findAll({
							where: {
								cancelationDateTime: null,
								reservationDateTime: {
									[Op.between]: [from, to],
								},
							},
							include: [
								{
									model: db.table,
									where: { size: { [Op.gte]: partySize } },
								},
							],
						})
						.then((res) => {
							return res.map((row) => {
								return row.tableId;
							});
						});

					// Find smallest available table in datetime range (not reserved)
					const availableTable = await db.table.findOne({
						where: {
							id: { [Op.notIn]: reservationsInRange },
							size: { [Op.gte]: partySize },
						},
						order: ['size'],
					});

					if (!availableTable) {
						throw new ValidationError('No available tables.');
					}

					return db.reservation.create({
						...reservation,
						tableId: availableTable.id,
					});
				});
			} catch (error) {
				// Transaction failed, rollback
				throw new Error(error);
			}
		},

		updateReservation: async (parent, { id, reservation }, { db }) => {
			const table = await db.table.findByPk(reservation.tableId);

			if (!table) {
				// ToDo: Throw Exception table not found.
			}

			await db.reservation.update(reservation, {
				where: { id },
			});
			const updated = await db.reservation.findByPk(reservation.tableId);
			return updated;
		},

		deleteReservation: (parent, { id }, { db }) =>
			db.reservation.destroy({
				where: { id },
			}),
	},
};
