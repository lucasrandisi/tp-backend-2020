import { Op } from 'sequelize';
import moment from 'moment';
import {
	getCurrentDate,
	allTimes,
	getTablesWithOrders,
	getTablesWithReservation,
} from '../utils/util';

export default {
	Table: {
		currentOrder: (parent, _, { db }) =>
			db.order.findOne({
				where: { tableId: parent.id, paidAt: null },
				order: [['createdAt', 'DESC']],
			}),
		nextReservation: (parent, _, { db }) =>
			db.reservation.findOne({
				where: [
					{
						tableId: parent.id,
						cancelationDateTime: null,
						reservationDateTime: {
							[Op.lt]: getCurrentDate().add(3, 'hours'),
							[Op.gt]: getCurrentDate().subtract(1, 'hours'),
						},
					},
					db.sequelize.where(db.sequelize.col('order.id'), null),
				],
				include: [
					{
						model: db.order,
						attributes: [],
						required: false,
					},
				],
			}),
		reservations: (parent, _, { db }) =>
			db.reservation.findAll({
				where: {
					tableId: parent.id,
					cancelationDateTime: null,
					reservationDateTime: {
						[Op.gt]: moment().subtract(4, 'hours'),
					},
				},
			}),
	},
	Query: {
		table: (parent, { id }, { db }) => db.table.findByPk(id),
		tables: (parent, args, { db }) => db.table.findAll(),
		max_table: (parent, args, { db }) => db.table.max('size'),
		tablesAvailableByDateSize: async (parent, { date, size }, { db }) => {
			const allTables = await db.table.findAll({
				where: {
					size: { [Op.gte]: size },
				},
			});

			let times = [...allTimes];

			if (date === moment().format('YYYY-MM-DD')) {
				const actualTime = moment().format('HH:mm');
				times = allTimes.filter((t) => t > actualTime);
			}

			const availableTimes = [];

			// eslint-disable-next-line
			for (let i = 0; i < times.length; i++) {
				const actualDate = `${date} ${times[i]}`;
				// eslint-disable-next-line
				const tablesWithRes = await getTablesWithReservation(
					db,
					size,
					actualDate
				);
				// eslint-disable-next-line
				const tablesWithOrder = await getTablesWithOrders(
					db,
					size,
					actualDate
				);
				Array.prototype.push.apply(tablesWithRes, tablesWithOrder);

				const allIdTablesBusy = tablesWithRes.map((t) => t.id);
				const availableTables = allTables.filter(
					({ id }) => !allIdTablesBusy.includes(id)
				);

				if (availableTables.length > 0) {
					availableTimes.push({
						time: times[i],
						tableId: availableTables[0].id,
					});
				}
			}

			return availableTimes;
		},
	},
	Mutation: {
		createTable: (parent, { table }, { db }) => db.table.create(table),
		updateTable: (parent, { id, table }, { db }) =>
			db.table
				.update(table, { where: { id } })
				.then(() => db.table.findByPk(id)),
		deleteTable: (parent, { id }, { db }) =>
			db.table.destroy({
				where: {
					id,
				},
			}),
	},
};
