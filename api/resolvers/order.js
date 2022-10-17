import { getCurrentDate } from '../utils/util';

export default {
	Order: {
		table: ({ tableId }, args, { db }) =>
			db.table.findOne({ where: { id: tableId } }),
		reservation: ({ reservationId }, args, { db }) =>
			db.reservation.findOne({ where: { id: reservationId } }),
		lines: (parent, args, { db }) =>
			db.line.findAll({ where: { orderId: parent.id } }),
		staff: ({ staffId }, args, { db }) =>
			db.staff.findOne({ where: { id: staffId } }),
		status: (parent) => {
			if (parent.paidAt) return 'PAID';
			if (parent.closedAt) return 'CLOSED';
			return 'OPEN';
		},
	},
	Query: {
		orders: (parent, args, { db }) => db.order.findAll(),
		order: (parent, { id }, { db }) => db.order.findByPk(id),
	},
	Mutation: {
		createOrder: (parent, { tableId, resId }, { db }) => {
			if (resId !== 'undefined') {
				return db.order.create({
					reservationId: resId,
					tableId,
					createdAt: getCurrentDate(),
				});
			} 
				return db.order.create({
					tableId,
					createdAt: getCurrentDate(),
				});
			
		},
		closeOrder: (_, { id }, { db }) =>
			db.order.update(
				{
					paidAt: getCurrentDate(),
				},
				{
					where: { id },
				}
			),
		deleteOrder: (parent, { id }, { db }) =>
			db.order.destroy({ where: { id } }),
	},
};
