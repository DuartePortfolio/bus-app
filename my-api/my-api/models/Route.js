module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('Route', {
    route_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    route_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  }, {
    tableName: 'routes',
    timestamps: false,
  });
  // Associate Routes table with Stops table (RouteStops)
  Route.associate = (models) => {
    Route.belongsToMany(models.Stop, {
      through: models.RouteStop,
      foreignKey: 'route_id',
      otherKey: 'stop_id',
      as: 'stops'
    });
  };

  return Route;
};