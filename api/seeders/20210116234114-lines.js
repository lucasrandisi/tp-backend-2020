module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert('lines', [
			{
				id: 1,
				orderId: 1,
				itemId: 1,
				quantity: 2,
			},
			{
				id: 2,
				orderId: 1,
				itemId: 10,
				quantity: 3,
			},
			{
				id: 3,
				orderId: 2,
				itemId: 4,
				quantity: 2,
			},
			{
				id: 4,
				orderId: 2,
				itemId: 5,
				quantity: 3,
			},
			{
				id: 5,
				orderId: 3,
				itemId: 6,
				quantity: 3,
			},
			{
				id: 6,
				orderId: 3,
				itemId: 8,
				quantity: 3,
			},
			{
				id: 7,
				orderId: 3,
				itemId: 9,
				quantity: 2,
			},
		]);
	},

	down: (queryInterface) => {
		return queryInterface.bulkDelete('lines', null, {});
	},
};
