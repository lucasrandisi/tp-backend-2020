export default (sequelize, DataTypes) => {
	const OrderLine = sequelize.define('line', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		quantity: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
    },
    {
        tableName: 'lines',
        timestamps: false
    }
    );

	OrderLine.associate = (models) => {
		OrderLine.belongsTo(models.order);
		OrderLine.belongsTo(models.item);
	};

	return OrderLine;
};
