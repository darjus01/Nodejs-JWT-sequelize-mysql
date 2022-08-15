const AuthService = require('../../services/authservice');
const alertMessages = require('../../utils/alertMessages.json');
const rolesConstants = require('../../constants/roles.json');
const UserService = require('../../services/userservice');
const globalFunctions = require('../../utils/globalFunctions');
const mailService = require('../../services/mailservice');
const emailConstants = require('../../constants/email.json');

exports.updateProfile = async (req, res, next) => {
  const currentUserFromRequest = req.tokenUser;
  const { name, surname, email, phone, password, passwordRepeat } = req.body;

  try {
    const currentUserAction = await UserService.getByUUID(currentUserFromRequest.user_uuid);

    if (currentUserAction === false || currentUserAction === null) {
      res.status(401).json({
        status: false,
        error: alertMessages.users.userDontExits,
      });
    } else {
      let changePass = false;

      if (typeof password !== 'undefined' && typeof passwordRepeat !== 'undefined') {
        if (password === passwordRepeat) {
          changePass = true;
        }
      }

      if ((await UserService.checkEmailForProfileUpdate(currentUserAction, email)) !== null) {
        res.status(401).send({ status: false, errors: [{ path: 'email', message: alertMessages.users.emailAlreadyInUse }] });
      } else {
        let userUpdateAction = await UserService.updateProfile(currentUserAction, name, surname, email, phone, changePass, password);

        res.status(200).json({
          status: true,
          user: userUpdateAction,
        });
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.currentUserData = async (req, res, next) => {
  try {
    let currentUserFromRequest = req.tokenUser;

    const currentUserAction = await UserService.getByUUID(currentUserFromRequest.user_uuid);

    if (currentUserAction === false || currentUserAction === null) {
      res.status(401).json({
        status: false,
        error: alertMessages.users.userDontExits,
      });
    } else {
      res.status(200).json({
        status: true,
        user: currentUserAction,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.activateAccount = async (req, res, next) => {
  try {
    const { hashLink } = req.params;
    const { password } = req.body;

    const userActivateAction = await UserService.activateAccountFromHash(hashLink, password);

    if (userActivateAction === false) {
      res.status(401).json({
        status: false,
        error: alertMessages.users.userNotActivated,
      });
    } else {
      res.status(200).json({
        status: true,
        user: userActivateAction,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.checkHashLink = async (req, res, next) => {
  try {
    const { hashLink } = req.params;

    const userGetAction = await UserService.getByHashLink(hashLink);

    if (userGetAction === false) {
      res.status(401).json({
        status: false,
        error: alertMessages.users.activationLinkIsWrong,
      });
    } else {
      res.status(200).json({
        status: true,
        message: alertMessages.users.activationLinkGood,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, surname, email, phone } = req.body;
    // client group
    const clientGroup = rolesConstants.client_role;

    const pass = globalFunctions.randomString(8);

    const userService = new UserService();

    const userRegisterAction = await userService.createUser(name, surname, email, pass, phone, clientGroup);

    if (userRegisterAction === false) {
      res.status(401).json({
        status: false,
        error: alertMessages.users.registrationFailed,
      });
    } else {
      let mailConfig = {
        from: `"system" <${process.env.MAIL_NO_REPLY}>`, // sender address
        to: email.toLowerCase(), // list of receivers
        subject: emailConstants.client.registration.subject, // Subject line
        template: emailConstants.client.registration.templateFileName, // the name of the template file i.e email.handlebars
        context: {
          subject: emailConstants.client.registration.subject,
          name,
          surname,
          email,
          activationUrl: `${process.env.FRONT_WEB_URL}/user-activation/${userRegisterAction.hashLink}`,
        },
      };

      await mailService.sendEmail(mailConfig);

      res.status(200).json({
        status: true,
        message: alertMessages.users.registrationSuccess,
        user: userRegisterAction,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const loginAction = await AuthService.loginAction(email, password);

    if (loginAction.success === false && loginAction.user === false) {
      res.status(401).json({
        status: false,
        error: alertMessages.login.badCredentials,
      });
    } else if (loginAction.success === false && loginAction.user === null) {
      res.status(401).json({
        status: false,
        error: alertMessages.login.badCredentials,
      });
    } else if (loginAction.success === true) {
      status: true, res.status(200).json({ token: loginAction.token, currentUser: loginAction.user });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
