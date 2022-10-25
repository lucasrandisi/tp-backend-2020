module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert('items', [
			{
				id: 1,
				title: 'Sopa de calabaza',
				desc: 'Sopa de calabaza',
				pricePerUnit: 200,
				servings: 2,
			},
			{
				id: 2,
				title: 'Sopa de pollo',
				desc: 'Sopa de pollo',
				pricePerUnit: 190,
				servings: 2,
			},
			{
				id: 3,
				title: 'Ensalada Cesar',
				desc: 'Con pechuga de pollo',
				pricePerUnit: 170,
				servings: 2,
			},
			{
				id: 4,
				title: 'Sushi',
				desc: 'Con mariscos',
				pricePerUnit: 300,
				servings: 2,
			},
			{
				id: 5,
				title: 'Gnochi',
				desc: 'De papa',
				pricePerUnit: 230,
				servings: 2,
			},
			{
				id: 6,
				title: 'Papas fritas',
				desc: 'Con queso cheddar',
				servings: 3,
				pricePerUnit: 130,
			},
			{
				id: 7,
				title: 'Pollo al grill',
				desc: 'Con guarnicion',
				servings: 1,
				pricePerUnit: 200,
			},
			{
				id: 8,
				title: 'Asado',
				desc: 'Completo',
				servings: 4,
				pricePerUnit: 350,
			},
			{
				id: 9,
				title: 'Carne a la portuguesa',
				desc: 'Bifes a la portuguesa',
				servings: 4,
				pricePerUnit: 300,
			},
			{
				id: 10,
				title: 'Agua Mineral',
				desc: 'Agua Mineral',
				pricePerUnit: 100,
				servings: 1,
			},
			{
				id: 11,
				title: 'Seven Up',
				desc: 'Seven Up 250ml',
				pricePerUnit: 180,
				servings: 1,
			},
			{
				id: 12,
				title: 'Coca cola',
				desc: 'Coca cola 250ml',
				pricePerUnit: 180,
				servings: 1,
			},
		]);
	},

	down: (queryInterface) => {
		return queryInterface.bulkDelete('items', null, {});
	},
};
