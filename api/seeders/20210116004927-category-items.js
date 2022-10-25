module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert('categories_items', [
			{
				categoryId: 2,
				itemId: 1,
			},
			{
				categoryId: 9,
				itemId: 1,
			},
			{
				categoryId: 2,
				itemId: 2,
			},
			{
				categoryId: 9,
				itemId: 2,
			},
			{
				categoryId: 4,
				itemId: 3,
			},
			{
				categoryId: 1,
				itemId: 4,
			},
			{
				categoryId: 2,
				itemId: 5,
			},
			{
				categoryId: 10,
				itemId: 6,
			},
			{
				categoryId: 1,
				itemId: 7,
			},
			{
				categoryId: 1,
				itemId: 8,
			},
			{
				categoryId: 1,
				itemId: 9,
			},
			{
				categoryId: 5,
				itemId: 10,
			},
			{
				categoryId: 5,
				itemId: 11,
			},
			{
				categoryId: 5,
				itemId: 12,
			},
		]);
	},

	down: (queryInterface) => {
		return queryInterface.bulkDelete('categories_items', null, {});
	},
};
