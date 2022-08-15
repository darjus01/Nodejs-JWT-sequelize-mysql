const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { User, Role, UserRoles } = require('../models');

class UserService {
  async createUser(name, surname, email, password, phone, userGroupCode) {
    const userRole = await this.getRoleByCode(userGroupCode);
    let pass = await bcrypt.hash(password, 10);

    try {
      const newUser = await User.create({
        name,
        surname,
        email: email.toLowerCase(),
        phone,
        password: pass,
        uuid: uuidv4(),
        hashLink: uuidv4(),
      });

      try {
        await UserRoles.create({
          roleId: userRole.id,
          userId: newUser.id,
        });

        try {
          return await User.findOne({ where: { uuid: newUser.uuid }, include: 'roles' });
        } catch (error) {
          console.log('error createUser User.findOne->', error);
          return false;
        }
      } catch (error) {
        console.log('error createUser newUserRole->', error);
        return false;
      }
    } catch (error) {
      console.log('error createUser newUser->', error);
      return false;
    }
  }

  static async checkEmailForProfileUpdate(currentUser, newEmail) {
    try {
      return await User.findOne(
        {
          where: {
            email: newEmail,
            uuid: {
              [Op.ne]: currentUser.uuid,
            },
          },
          include: 'roles',
        },
        {
          raw: true,
        },
      );
    } catch (error) {
      console.log('error UserService checkEmailForProfileUpdate ->', error);
      return false;
    }
  }

  static async updateProfile(currentUser, name, surname, email, phone, changePass, password) {
    currentUser.name = name;
    currentUser.surname = surname;
    currentUser.email = email;
    currentUser.phone = phone;

    if (changePass === true) {
      let pass = await bcrypt.hash(password, 10);
      currentUser.password = pass;
    }

    await currentUser.save();

    return await User.findOne(
      { where: { uuid: currentUser.uuid }, include: 'roles' },
      {
        raw: true,
      },
    );
  }

  async getRoleByCode(roleCode) {
    try {
      return await Role.findOne({ where: { code: roleCode } });
    } catch (error) {
      console.log('error getRoleByCode->', error);
      return false;
    }
  }

  static async getByUUID(uuid) {
    try {
      return await User.findOne(
        { where: { uuid }, include: 'roles' },
        {
          raw: true,
        },
      );
    } catch (error) {
      console.log('error UserService getByUUID ->', error);
      return false;
    }
  }

  static async getByEmail(email) {
    try {
      return await User.findOne(
        { where: { email: email }, include: 'roles' },
        {
          raw: true,
        },
      );
    } catch (error) {
      console.log('error UserService getByEmail ->', error);
      return false;
    }
  }

  static async getByHashLink(hash) {
    try {
      return await User.findOne(
        { where: { hashLink: hash }, include: 'roles' },
        {
          raw: true,
        },
      );
    } catch (error) {
      console.log('error UserService getByHashLink ->', error);
      return false;
    }
  }

  static async activateAccountFromHash(hashLink, password) {
    let pass = await bcrypt.hash(password, 10);

    try {
      const user = await User.findOne(
        { where: { hashLink: hashLink } },
        {
          raw: true,
        },
      );

      user.hashLink = null;
      user.isActive = true;
      user.password = pass;

      await user.save();

      return await User.findOne(
        { where: { hashLink: hashLink }, include: 'roles' },
        {
          raw: true,
        },
      );
    } catch (error) {
      console.log('error UserService activateAccountFromHash ->', error);
      return false;
    }
  }
}

module.exports = UserService;
