

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('items', 'pricePerUnit', {
			type: Sequelize.DataTypes.REAL,
			allowNull: false,
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('items', 'pricePerUnit', {
			type: Sequelize.DataTypes.REAL,
			allowNull: true,
		});
	},
};
