const userController = require('../controllers/user');

export default {
	Query: {
		user: (_, { id }, { db }) => db.user.findByPk(id),
	},
	Mutation: {
		registerUser: (_, { input }, { db }) =>
			userController.register(input, db),
		login: (_, { input }, { db }) => userController.login(input, db),
	},
};
