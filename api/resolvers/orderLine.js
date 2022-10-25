import { GraphQLError } from 'graphql';

export default {
	OrderLine: {
		item: ({ itemId }, args, { db }) =>
			db.item.findOne({ where: { id: itemId } }),
		order: ({ orderId }, args, { db }) =>
			db.order.findOne({ where: { id: orderId } }),
	},
	Query: {
		lines: (parent, args, { db }) => db.line.findAll(),
		line: (parent, { id }, { db }) => db.line.findByPk(id),
	},
	Mutation: {
        createLine: async (parent, { lineInput }, { db }) => {
            const order = await db.order.findByPk(lineInput.orderId);

            if (!order) {
                throw new GraphQLError('Order not found');
            }

            const item = await db.item.findByPk(lineInput.itemId);

            if (!item) {
                throw new GraphQLError('Item not found');
            }

            return db.line.create(lineInput)
        },
		deleteLine: (parent, { id }, { db }) =>
			db.line.destroy({ where: { id } }),
	},
};
