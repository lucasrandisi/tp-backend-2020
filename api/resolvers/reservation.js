import moment from 'moment';
import { GraphQLError } from 'graphql';

export default {
	Reservation: {
		table: ({ tableId }, args, { db }) =>
			db.table.findOne({ where: { id: tableId } }),
		order: ({ id }, args, { db }) =>
			db.order.findOne({ where: { reservationId: id } }),
	},
	Query: {
		reservation: (parent, { id }, { db }) => db.reservation.findByPk(id),
		reservations: (parent, args, { db }) => db.reservation.findAll(),
        getNextTableReservations: async (parent, { tableId }, { db }) => {
            const table = await db.table.findByPk(tableId);

            if (!table) {
                throw new GraphQLError("Table not found");
            }

            return db.reservation.findAll({
                where: [
                    { tableId },
                    db.sequelize.where(
                        db.sequelize.fn(
                            'date',
                            db.sequelize.col('reservationDateTime')
                        ),
                        moment().format('YYYY-MM-DD')
                    ),
                ],
            });
        }
	},

	Mutation: {
        createReservation: async (parent, { reservationInput }, { db }) => {
            const table = await db.table.findByPk(reservationInput.tableId);

            if (!table) {
                throw new GraphQLError("Table not found");
            }

            return db.reservation.create(reservationInput)
        },
        updateReservation: async (parent, { id, reservationInput }, { db }) => {
            const reservation = await db.reservation.findByPk(id);

            if (!reservation) {
                throw new GraphQLError("Reservation not found");
            }

            const table = await db.table.findByPk(reservationInput.tableId);

			if (!table) {
                throw new GraphQLError("Table not found");
			}

            return reservation.update(reservationInput)
    		},

        cancelReservation: async (parent, { id }, { db }) => {
            const reservation = await db.reservation.findByPk(id);

            if (!reservation) {
                throw new GraphQLError("Reservation not found");
            }
    
            return reservation.update({
                cancelationDateTime: new Date()
            });
        }
	},
};
