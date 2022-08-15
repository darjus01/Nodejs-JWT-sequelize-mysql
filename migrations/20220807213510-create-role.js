'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface
      .createTable('roles', {
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
        code: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      })
      .then(() => {
        queryInterface.addIndex('roles', ['uuid']);
        queryInterface.addIndex('roles', ['code']);
      });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('roles');
  },
};
