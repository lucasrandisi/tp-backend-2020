const moment = require('moment');

module.exports = {
	up: (queryInterface) => {
		const time = { minute: 0, second: 0, millisecond: 0 };
		const halfTime = { minute: 30, second: 0, millisecond: 0 };
		return queryInterface.bulkInsert('reservations', [
			{
				id: 1,
				CustomerName: 'Lucas',
				partySize: 2,
				reservationDateTime: moment()
					.add(1, 'hours')
					.set(time)
					.toDate(),
				tableId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
				phone: '3412008765',
				email: 'lucas@hotmail.com',
			},
			{
				id: 2,
				CustomerName: 'Agustín',
				partySize: 2,
				reservationDateTime: moment()
					.add(2, 'hours')
					.set(halfTime)
					.toDate(),
				tableId: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
				phone: '3419887878',
				email: 'agustin@hotmail.com',
			},
			{
				id: 3,
				CustomerName: 'Natalia',
				partySize: 2,
				reservationDateTime: moment()
					.add(3, 'hours')
					.set(time)
					.toDate(),
				tableId: 3,
				createdAt: new Date(),
				updatedAt: new Date(),
				phone: '3412008603',
				email: 'natalia@hotmail.com',
			},
			{
				id: 4,
				CustomerName: 'Francisco',
				partySize: 2,
				reservationDateTime: moment()
					.add(1, 'days')
					.set(halfTime)
					.toDate(),
				tableId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
				phone: '3412887656',
				email: 'francisco@hotmail.com',
			},
			{
				id: 5,
				CustomerName: 'Julia',
				partySize: 3,
				reservationDateTime: moment()
					.add(2, 'hours')
					.set(time)
					.toDate(),
				tableId: 4,
				createdAt: new Date(),
				updatedAt: new Date(),
				phone: '3412887622',
				email: 'julia@hotmail.com',
			},
			{
				id: 6,
				CustomerName: 'Cholo',
				partySize: 3,
				reservationDateTime: moment()
					.add(5, 'hours')
					.set(halfTime)
					.toDate(),
				tableId: 5,
				createdAt: new Date(),
				updatedAt: new Date(),
				phone: '3412007622',
				email: 'cholo@hotmail.com',
			},
			{
				id: 7,
				CustomerName: 'Tito',
				partySize: 4,
				reservationDateTime: moment().add(2, 'days').set(time).toDate(),
				tableId: 6,
				createdAt: new Date(),
				updatedAt: new Date(),
				phone: '3412111622',
				email: 'tito@hotmail.com',
			},
			{
				id: 8,
				CustomerName: 'Hernán',
				partySize: 6,
				reservationDateTime: moment()
					.add(2, 'hours')
					.set(halfTime)
					.toDate(),
				tableId: 7,
				createdAt: new Date(),
				updatedAt: new Date(),
				phone: '3413333622',
				email: 'hernan@hotmail.com',
			},
		]);
	},

	down: (queryInterface) => {
		return queryInterface.bulkDelete('reservations', null);
	},
};
