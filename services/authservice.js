const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const UserService = require('./userservice');

class AuthService {
  static async loginAction(email, password) {
    const currentUser = await UserService.getByEmail(email);

    if (currentUser === false || currentUser === null) {
      return {
        success: false,
        user: null,
      };
    }

    if (await bcrypt.compare(password, currentUser.password)) {
      // create token
      let token = jwt.sign({ user_uuid: currentUser.uuid }, process.env.JWT_TOKEN_KEY, { expiresIn: process.env.JWT_EXP_TIME });

      return {
        success: true,
        user: currentUser,
        token,
      };
    } else {
      return {
        success: false,
        user: false,
      };
    }
  }
}

module.exports = AuthService;
