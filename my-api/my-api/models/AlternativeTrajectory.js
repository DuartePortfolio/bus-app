module.exports = (sequelize, DataTypes) => {
  const AlternativeTrajectory = sequelize.define('AlternativeTrajectory', {
    alt_trajectory_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    stop_id_1: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    stop_id_2: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    alt_trajectory: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    tableName: 'alternative_trajectories',
    timestamps: false,
  });

  AlternativeTrajectory.associate = (models) => {
    AlternativeTrajectory.belongsToMany(models.Trip, {
      through: models.TripAlternativeTrajectory,
      foreignKey: 'trajectory_id',
      otherKey: 'trip_id',
      as: 'trips'
    });
  };

  return AlternativeTrajectory;
};