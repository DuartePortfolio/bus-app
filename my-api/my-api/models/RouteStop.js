module.exports = (sequelize, DataTypes) => {
  const RouteStop = sequelize.define('RouteStop', {
    route_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
    },
    stop_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
    },
    stop_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'route_stops',
    timestamps: false,
  });

  return RouteStop;
};