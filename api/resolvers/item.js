import { GraphQLError } from 'graphql';

export default {
	Item: {
		categories: ({ id }, args, { db }) =>
			db.category.findAll({
				include: [
					{
						model: db.item,
						where: { id },
					},
				],
			})
	},
	Query: {
		items: (parent, args, { db }) => db.item.findAll(),
		item: (parent, { id }, { db }) => db.item.findByPk(id),
	},
	Mutation: {
        createItem: (parent, { itemInput }, { db }) => {
            return db.item.create({ ...itemInput }).then(async (i) => {
                if (i && itemInput.categoriesId) {
                    await i.setCategories(itemInput.categoriesId);
				}

				i.update({
                    ...itemInput,
				});

				return i;
			});
		},
		updateItem: (parent, { id, itemInput }, { db }) => {
			return db.item.findByPk(id).then(async (item) => {
                if (!item) {
                    throw new GraphQLError('Item not found');
                }

                if (itemInput.categoriesId) {
                    await item.setCategories(itemInput.categoriesId);
                }

                return item.update({
                    ...itemInput,
                });
			});
		},
		deleteItem: (parent, { id }, { db }) =>
			db.item.destroy({
				where: {
					id,
				},
			}),
	},
};
