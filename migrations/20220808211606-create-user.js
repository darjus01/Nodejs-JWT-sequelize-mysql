'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface
      .createTable('users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        name: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        surname: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING(13),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        hashLink: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      })
      .then(() => {
        queryInterface.addIndex('users', ['uuid']);
        queryInterface.addIndex('users', ['email']);
        queryInterface.addIndex('users', ['phone']);
        queryInterface.addIndex('users', ['password']);
        queryInterface.addIndex('users', ['hashLink']);
        queryInterface.addIndex('users', ['isActive']);
      });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('users');
  },
};
