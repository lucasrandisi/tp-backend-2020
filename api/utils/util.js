import moment from 'moment';
import { Op } from 'sequelize';

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
								[Op.lt]: moment(date).add(3, 'hours'),
								[Op.gt]: moment(date).subtract(3, 'hours'),
							},
						},
						db.sequelize.where(
							db.sequelize.fn(
								'date',
								db.sequelize.col('createdAt')
							),
							moment(date).format('YYYY-MM-DD')
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
								[Op.lt]: moment(date).add(3, 'hours'),
								[Op.gt]: moment(date).subtract(3, 'hours'),
							},
						},
						db.sequelize.where(
							db.sequelize.fn(
								'date',
								db.sequelize.col('reservationDateTime')
							),
							moment(date).format('YYYY-MM-DD')
						),
					],
				},
			},
		],
	});
}

export const calculateTimes = () => {
	const allTimes = [];
	// eslint-disable-next-line
	for (let i = 8; i < 24; i++) {
		// eslint-disable-next-line
		for (let j = 0; j < 2; j++) {
			allTimes.push(`${i}:${j === 0 ? `00` : 30 * j}`);
		}
	}
	return allTimes;
};
