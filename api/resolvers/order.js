import { GraphQLError } from 'graphql';

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
        createOrder: async (parent, { tableId, resId }, { db }) => {
            const table = await db.table.findByPk(tableId);
            
            if (!table) {
                throw new GraphQLError('Table not found');
            }

            if (resId) {
                const reservation = await db.reservation.findByPk(resId);

                if (!reservation) {
                    throw new GraphQLError('Reservation not found');
                }
            }

            return db.order.create({
                tableId,
                ...(resId && { reservationId: resId }),
                createdAt: Date.now(),
            });
		},
        closeOrder: async (_, { id }, { db }) => {
            const order = await db.order.findByPk(id);

            if (!order) {
                throw new GraphQLError('Order not found');
            }

            return await order.update(
                {
                    paidAt: Date.now(),
                },
                {
                    where: { id },
                }
            )
        },
		deleteOrder: (parent, { id }, { db }) =>
			db.order.destroy({ where: { id } }),
	},
};
