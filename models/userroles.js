'use strict';
const { Model } = require('sequelize');
const alerts = require('../utils/alertMessages.json');
module.exports = (sequelize, DataTypes) => {
  class UserRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  UserRoles.init(
    {
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notEmpty: { msg: alerts.global.required },
          notNull: { msg: alerts.global.required },
        },
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notEmpty: { msg: alerts.global.required },
          notNull: { msg: alerts.global.required },
        },
      },
    },
    {
      sequelize,
      modelName: 'UserRoles',
      tableName: 'users_roles',
    },
  );
  return UserRoles;
};
