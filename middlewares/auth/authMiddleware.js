const jwt = require('jsonwebtoken');
const alertMessages = require('../../utils/alertMessages.json');
const fieldsValidation = require('../../utils/fieldsValidation');
const UserService = require('../../services/userservice');

exports.verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];

    console.log('bearerToken------>', bearerToken);

    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_TOKEN_KEY);
      req.tokenUser = decoded;
    } catch (error) {
      return res.status(401).send({ error: alertMessages.auth.invalidToken });
    }
    return next();
  } else {
    return res.status(403).json({ error: alertMessages.auth.invalidToken });
  }
};

exports.hashLinkChangePasswordRequest = async (req, res, next) => {
  const { hashLink } = req.params;
  const { password, passwordRepeat } = req.body;
  let errors = [];

  if (typeof hashLink !== 'undefined') {
    if (hashLink.length === 0) {
      errors = [...errors, { path: 'hashLink', message: alertMessages.global.required }];
    } else if ((await UserService.getByHashLink(hashLink)) === null) {
      errors = [...errors, { path: 'hashLink', message: alertMessages.users.hashLinkNotExists }];
    }
  } else {
    errors = [...errors, { path: 'hashLink', message: alertMessages.global.required }];
  }

  if (typeof password !== 'undefined') {
    if (password.length === 0) {
      errors = [...errors, { path: 'password', message: alertMessages.global.required }];
    }
  } else {
    errors = [...errors, { path: 'password', message: alertMessages.global.required }];
  }

  if (typeof passwordRepeat !== 'undefined') {
    if (passwordRepeat.length === 0) {
      errors = [...errors, { path: 'passwordRepeat', message: alertMessages.global.required }];
    }
  } else {
    errors = [...errors, { path: 'passwordRepeat', message: alertMessages.global.required }];
  }

  if (typeof password !== 'undefined' && typeof passwordRepeat !== 'undefined') {
    if (password !== passwordRepeat) {
      errors = [...errors, { path: 'passwordRepeat', message: alertMessages.users.passwordsMustMatch }];
    }
  }

  if (errors.length > 0) {
    return res.status(401).send({ errors });
  } else {
    return next();
  }
};

exports.hashLinkValidationRequest = async (req, res, next) => {
  const { hashLink } = req.params;
  let errors = [];

  if (typeof hashLink !== 'undefined') {
    if (hashLink.length === 0) {
      errors = [...errors, { path: 'hashLink', message: alertMessages.global.required }];
    }
  } else {
    errors = [...errors, { path: 'hashLink', message: alertMessages.global.required }];
  }

  if (errors.length > 0) {
    return res.status(401).send({ errors });
  } else {
    return next();
  }
};

exports.validLoginRequest = async (req, res, next) => {
  const { email, password } = req.body;
  let errors = [];
  if (typeof email !== 'undefined') {
    if (email.length === 0) {
      errors = [...errors, { path: 'email', message: alertMessages.global.required }];
    } else if (fieldsValidation.isEmail(email) === false) {
      errors = [...errors, { path: 'email', message: alertMessages.login.invalidEmail }];
    }
  } else {
    errors = [...errors, { path: 'email', message: alertMessages.global.required }];
  }

  if (typeof password !== 'undefined') {
    if (password.length === 0) {
      errors = [...errors, { path: 'password', message: alertMessages.global.required }];
    }
  } else {
    errors = [...errors, { path: 'password', message: alertMessages.global.required }];
  }

  if (errors.length > 0) {
    return res.status(401).send({ errors });
  } else {
    return next();
  }
};

exports.registrationValidation = async (req, res, next) => {
  const { name, surname, email, phone } = req.body;

  let errors = [];

  if (typeof name !== 'undefined') {
    if (name.length === 0) {
      errors = [...errors, { path: 'name', message: alertMessages.global.required }];
    }
  } else {
    errors = [...errors, { path: 'name', message: alertMessages.global.required }];
  }

  if (typeof surname !== 'undefined') {
    if (surname.length === 0) {
      errors = [...errors, { path: 'surname', message: alertMessages.global.required }];
    }
  } else {
    errors = [...errors, { path: 'surname', message: alertMessages.global.required }];
  }

  if (typeof phone !== 'undefined') {
    if (phone.length === 0) {
      errors = [...errors, { path: 'phone', message: alertMessages.global.required }];
    } else if (fieldsValidation.isLtPhone(phone) === false) {
      errors = [...errors, { path: 'email', message: alertMessages.users.ltPhone }];
    }
  } else {
    errors = [...errors, { path: 'phone', message: alertMessages.global.required }];
  }

  if (typeof email !== 'undefined') {
    if (email.length === 0) {
      errors = [...errors, { path: 'email', message: alertMessages.global.required }];
    } else if (fieldsValidation.isEmail(email) === false) {
      errors = [...errors, { path: 'email', message: alertMessages.login.invalidEmail }];
    } else if ((await UserService.getByEmail(email)) !== null) {
      errors = [...errors, { path: 'email', message: alertMessages.users.emailAlreadyInUse }];
    }
  } else {
    errors = [...errors, { path: 'email', message: alertMessages.global.required }];
  }

  if (errors.length > 0) {
    return res.status(401).send({ errors });
  } else {
    return next();
  }
};
