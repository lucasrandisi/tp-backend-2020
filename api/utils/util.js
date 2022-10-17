import moment from 'moment';
import { Op } from 'sequelize';

export const getCurrentDate = () => {
	return moment().subtract(3, 'hours');
};

export const getDate = (date) => {
	return moment(date).subtract(3, 'hours');
};

export function getTablesWithOrders(db, size, date) {
	return db.table.findAll({
		where: {
			size: {
				[Op.gte]: size,
			},
		},
		include: [
			{
				model: db.order,
				where: {
					[Op.and]: [
						{ paidAt: null },
						{
							createdAt: {
								[Op.lt]: getDate(date).add(3, 'hours'),
								[Op.gt]: getDate(date).subtract(3, 'hours'),
							},
						},
						db.sequelize.where(
							db.sequelize.fn(
								'date',
								db.sequelize.col('createdAt')
							),
							getDate(date).format('YYYY-MM-DD')
						),
					],
				},
			},
		],
	});
}

export function getTablesWithReservation(db, size, date) {
	return db.table.findAll({
		where: {
			size: {
				[Op.gte]: size,
			},
		},
		include: [
			{
				model: db.reservation,
				where: {
					[Op.and]: [
						{ cancelationDateTime: null },
						{
							reservationDateTime: {
								[Op.lt]: getDate(date).add(3, 'hours'),
								[Op.gt]: getDate(date).subtract(3, 'hours'),
							},
						},
						db.sequelize.where(
							db.sequelize.fn(
								'date',
								db.sequelize.col('reservationDateTime')
							),
							getDate(date).format('YYYY-MM-DD')
						),
					],
				},
			},
		],
	});
}

export const allTimes = [
	'08:00',
	'08:30',
	'09:00',
	'09:30',
	'10:00',
	'10:30',
	'11:00',
	'11:30',
	'12:00',
	'12:30',
	'13:00',
	'13:30',
	'19:00',
	'19:30',
	'20:00',
	'20:30',
	'21:00',
	'21:30',
	'22:00',
	'22:30',
	'23:00',
];
