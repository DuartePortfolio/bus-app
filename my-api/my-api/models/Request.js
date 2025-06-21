module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('Request', {
    request_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    driver_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    operator_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('time_off', 'meeting', 'feature', 'route_change', 'other'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'denied', 'on_hold'),
      allowNull: false,
      defaultValue: 'pending',
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

    Request.associate = (models) => {
        Request.belongsTo(models.User, {
        foreignKey: 'driver_id',
        as: 'driver',
        onDelete: 'CASCADE',
        });

        Request.belongsTo(models.User, {
            foreignKey: 'operator_id',
            as: 'operator',
            onDelete: 'SET NULL',
        });
    };


  return Request;
};
