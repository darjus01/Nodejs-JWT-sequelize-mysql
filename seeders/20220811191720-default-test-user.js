'use strict';
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const UserService = require('../services/userservice');

module.exports = {
  async up(queryInterface, Sequelize) {
    let name = process.env.TEST_USER_NAME;
    let surname = process.env.TEST_USER_SURNAME;
    let email = process.env.TEST_USER_EMAIL;
    let phone = process.env.TEST_USER_PHONE;
    let password = process.env.TEST_USER_PASS;
    let code = process.env.TEST_USER_ROLE_CODE;

    console.log('code->', code);

    const userService = new UserService();

    await userService.createUser(name, surname, email, password, phone, code);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
