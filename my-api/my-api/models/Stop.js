module.exports = (sequelize, DataTypes) => {
  const Stop = sequelize.define('Stop', {
    stop_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
      unique: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    stop_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    tableName: 'stops',
    timestamps: false,
  });

  return Stop;
};
