export default (sequelize, DataTypes) => {
	const Item = sequelize.define('item', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		title: DataTypes.STRING,
		desc: DataTypes.STRING,
		servings: DataTypes.REAL,
		pricePerUnit: DataTypes.REAL,
    },
    {
        timestamps: false
    }
    );

	Item.associate = async (models) => {
		Item.belongsToMany(models.category, { through: 'categories_items' });

		Item.hasMany(models.line);

	};

	return Item;
};
