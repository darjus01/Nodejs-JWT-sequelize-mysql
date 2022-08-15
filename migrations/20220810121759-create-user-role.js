'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface
      .createTable('users_roles', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        roleId: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
      })
      .then(() => {
        queryInterface.addIndex('users_roles', ['roleId']);
        queryInterface.addIndex('users_roles', ['userId']);
      });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('users_roles');
  },
};
