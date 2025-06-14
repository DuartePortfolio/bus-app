module.exports = (sequelize, DataTypes) => {
  const Weather = sequelize.define('Weather', {
    reading_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    temperature: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    rain: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    wind: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'weather',
    timestamps: false,
  });

  return Weather;
};
