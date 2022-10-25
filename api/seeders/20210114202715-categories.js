module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert('categories', [
			{
				id: 1,
				desc: 'Carnes',
			},
			{
				id: 2,
				desc: 'Pastas',
			},
			{
				id: 3,
				desc: 'Pizzas',
			},
			{
				id: 4,
				desc: 'Ensaladas',
			},
			{
				id: 5,
				desc: 'Bebidas',
			},
			{
				id: 6,
				desc: 'Postres',
			},
			{
				id: 7,
				desc: 'Vegetariano',
			},
			{
				id: 8,
				desc: 'Sin gluten',
			},
			{
				id: 9,
				desc: 'Sopas',
			},
			{
				id: 10,
				desc: 'Entradas',
			},
		]);
	},

	down: (queryInterface) => {
		return queryInterface.bulkDelete('categories', null, {});
	},
};
