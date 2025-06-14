module.exports = (sequelize, DataTypes) => {
  const TripAlternativeTrajectory = sequelize.define('TripAlternativeTrajectory', {
    trip_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
    },
    trajectory_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
    }
  }, {
    tableName: 'trip_alternative_trajectories',
    timestamps: false,
  });

  return TripAlternativeTrajectory;
};