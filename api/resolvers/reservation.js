import moment from 'moment';

export default {
	Reservation: {
		table: ({ tableId }, args, { db }) =>
			db.table.findOne({ where: { id: tableId } }),
		order: ({ id }, args, { db }) =>
			db.order.findOne({ where: { reservationId: id } }),
	},
	Query: {
		reservation: (parent, { id }, { db }) => db.reservation.findByPk(id),
		reservations: (parent, args, { db }) => db.reservation.findAll(),
		getNextTableReservations: (parent, { tableId }, { db }) =>
			db.reservation.findAll({
				where: [
					{ tableId },
					db.sequelize.where(
						db.sequelize.fn(
							'date',
							db.sequelize.col('reservationDateTime')
						),
						moment().format('YYYY-MM-DD')
					),
				],
			}),
	},

	Mutation: {
		createReservation: (parent, { reservation }, { db }) =>
			db.reservation.create(reservation),
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

		cancelReservation: (parent, { id }, { db }) =>
			db.reservation.update(
				{ cancelationDateTime: new Date() },
				{ where: { id } }
			),
	},
};
