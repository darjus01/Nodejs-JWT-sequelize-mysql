'use strict';
const { Model } = require('sequelize');
const moment = require('moment');
const alerts = require('../utils/alertMessages.json');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Role, UserRoles }) {
      // define association here
      this.belongsToMany(Role, {
        as: 'roles',
        through: UserRoles,
        foreignKey: 'userId',
      });
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        password: undefined,
        createdAt: moment(this.get().createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(this.get().updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      };
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: { msg: alerts.global.required },
          notNull: { msg: alerts.global.required },
          min: { msg: alerts.users.minName, args: [3] },
          max: { msg: alerts.users.maxName, args: [150] },
        },
      },
      surname: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: { msg: alerts.global.required },
          notNull: { msg: alerts.global.required },
          min: { msg: alerts.users.minSurname, args: [3] },
          max: { msg: alerts.users.maxSurname, args: [150] },
        },
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: { msg: alerts.global.required },
          notNull: { msg: alerts.global.required },
          min: { msg: alerts.users.minEmail, args: [3] },
          max: { msg: alerts.users.maxEmail, args: [150] },
        },
      },
      phone: {
        type: DataTypes.STRING(13),
        allowNull: false,
        validate: {
          notEmpty: { msg: alerts.global.required },
          notNull: { msg: alerts.global.required },
          isLithuanianPhone(value) {
            const phoneRegex = new RegExp(/^[\+]?86|3706[0-9]{2}[0-9]{4,6}$/im);
            if (phoneRegex.test(value) === false) {
              throw new Error(alerts.users.ltPhone);
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: alerts.global.required },
          notNull: { msg: alerts.global.required },
        },
      },
      hashLink: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    },
  );
  return User;
};
