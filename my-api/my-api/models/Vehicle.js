module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    vehicle_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    plate_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'vehicles',
    timestamps: false,
  });

  return Vehicle;
};
