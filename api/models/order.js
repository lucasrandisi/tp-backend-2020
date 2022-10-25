export default (sequelize, DataTypes) => {
	const Order = sequelize.define('order', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.NOW,
		},
		paidAt: DataTypes.DATE,
    },
    {
        updatedAt: false,
    });

	Order.associate = (models) => {
		Order.hasMany(models.line);
		Order.belongsTo(models.table);
		Order.belongsTo(models.reservation);
	};

	return Order;
};
