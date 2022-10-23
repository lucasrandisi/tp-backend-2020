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
		createItem: (parent, { item }, { db }) => {
			return db.item.create({ ...item }).then(async (i) => {
				if (i && item.categoriesId) {
					await i.setCategories(item.categoriesId);
				}

				i.update({
					...item,
				});

				return i;
			});
		},
		updateItem: (parent, { id, itemInput }, { db }) => {
			return db.item.findByPk(id).then(async (item) => {
				if (item) {
					if (itemInput.categoriesId) {
						await item.setCategories(itemInput.categoriesId);
					}

					return item.update({
						...itemInput,
					});
				}
				return null;
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
