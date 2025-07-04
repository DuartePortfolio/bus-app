module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('driver', 'operator'),
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  User.associate = (models) => {
    User.hasMany(models.Request, {
      foreignKey: 'driver_id',
      as: 'requestsAsDriver',
    });

    User.hasMany(models.Request, {
      foreignKey: 'operator_id',
      as: 'requestsAsOperator',
    });
  };

  return User;
};
