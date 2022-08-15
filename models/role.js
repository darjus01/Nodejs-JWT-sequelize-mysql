'use strict';
const { Model } = require('sequelize');
const alerts = require('../utils/alertMessages.json');
const User = require('./user');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, UserRoles }) {
      // define association here
      this.belongsToMany(User, {
        as: 'users',
        through: UserRoles,
        foreignKey: 'roleId',
      });
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        UserRoles: undefined,
        createdAt: moment(this.get().createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(this.get().updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      };
    }
  }
  Role.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: alerts.roles.required },
          notNull: { msg: alerts.roles.required },
        },
      },
    },
    {
      sequelize,
      tableName: 'roles',
      modelName: 'Role',
    },
  );
  return Role;
};
