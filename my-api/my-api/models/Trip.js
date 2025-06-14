module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
    trip_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    route_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    vehicle_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    driver_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    tableName: 'trips',
    timestamps: false,
  });

  Trip.associate = (models) => {
    Trip.belongsTo(models.Route, { foreignKey: 'route_id', as: 'route' });
    Trip.belongsTo(models.Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });
    Trip.belongsTo(models.User, { foreignKey: 'driver_id', as: 'driver' });
    Trip.belongsToMany(models.AlternativeTrajectory, {
    through: models.TripAlternativeTrajectory,
    foreignKey: 'trip_id',
    otherKey: 'trajectory_id',
    as: 'alternative_trajectories'});
  };

  return Trip;
};