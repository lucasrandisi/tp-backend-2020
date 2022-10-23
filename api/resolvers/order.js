export default {
	Order: {
		table: ({ tableId }, args, { db }) =>
			db.table.findOne({ where: { id: tableId } }),
		reservation: ({ reservationId }, args, { db }) =>
			db.reservation.findOne({ where: { id: reservationId } }),
		lines: (parent, args, { db }) =>
			db.line.findAll({ where: { orderId: parent.id } }),
		status: (parent) => {
			if (parent.paidAt) return 'PAID';
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
					createdAt: Date.now(),
				});
			}
			return db.order.create({
				tableId,
				createdAt: Date.now(),
			});
		},
		closeOrder: (_, { id }, { db }) =>
			db.order.update(
				{
					paidAt: Date.now(),
				},
				{
					where: { id },
				}
			),
		deleteOrder: (parent, { id }, { db }) =>
			db.order.destroy({ where: { id } }),
	},
};
