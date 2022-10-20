module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert('categories_items', [
			{
				categoryId: 2,
				itemId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 9,
				itemId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 2,
				itemId: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 9,
				itemId: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 4,
				itemId: 3,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 1,
				itemId: 4,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 2,
				itemId: 5,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 10,
				itemId: 6,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 1,
				itemId: 7,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 1,
				itemId: 8,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 1,
				itemId: 9,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 5,
				itemId: 10,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 5,
				itemId: 11,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				categoryId: 5,
				itemId: 12,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	down: (queryInterface) => {
		return queryInterface.bulkDelete('categories_items', null, {});
	},
};
