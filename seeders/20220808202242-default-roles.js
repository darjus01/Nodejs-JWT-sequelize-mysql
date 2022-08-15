'use strict';

const roleConstants = require('../constants/roles.json');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, DataTypes) {
    let defaultRoles = [];

    roleConstants.user_roles.forEach((el) => {
      let role = {
        code: el.value,
        uuid: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      defaultRoles = [...defaultRoles, role];
    });

    await queryInterface.bulkInsert('roles', defaultRoles, {});
  },

  async down(queryInterface, DataTypes) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
