import { Op } from 'sequelize';
import moment from 'moment';
import {
	calculateTimes,
	getTablesWithOrders,
	getTablesWithReservation,
} from '../utils/util';
import { GraphQLError } from 'graphql';


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
							[Op.lt]: moment().add(8, 'hours'),
							[Op.gt]: moment().subtract(1, 'hours'),
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
			const allTimes = calculateTimes();
			const allTables = await db.table.findAll({
				where: {
					size: { [Op.gte]: size },
				},
			});

			let times = [...allTimes];

            // Si la fecha seleccionada es la de hoy, filtrar horarios menores a la hora actual
			const onlyDate = moment(date);
			if (onlyDate.isSame(moment(), 'day')) {
				const actualTime = moment().format('HH:mm');
				times = allTimes.filter((t) => t > actualTime);
			}

			const availableTimes = [];

			for (let i = 0; i < times.length; i++) {
                const actualDate = `${onlyDate.format('YYYY-MM-DD') } ${times[i]}`;

                const tablesWithRes = await getTablesWithReservation(
					db,
					size,
					actualDate
				);

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
        createTable: (parent, { tableInput }, { db }) => db.table.create(tableInput),
        updateTable: async (parent, { id, tableInput }, { db }) => {
            const table = await db.table.findByPk(id);
            
            if (!table) {
                throw new GraphQLError("Table not found");
            }

            return table.update(...tableInput)
        },
		deleteTable: (parent, { id }, { db }) =>
			db.table.destroy({
				where: {
					id,
				},
			}),
	},
};
