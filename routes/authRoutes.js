const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth/authMiddleware');
const authController = require('../controllers/auth/authController');

// POST
router.route('/active-account-and-submit-passwords/:hashLink').post(authMiddleware.hashLinkChangePasswordRequest, authController.activateAccount);
router.route('/profile/update').post(authMiddleware.verifyToken, authController.updateProfile);
router.route('/register').post(authMiddleware.registrationValidation, authController.register);
router.route('/login').post(authMiddleware.validLoginRequest, authController.login);

// GET
router.route('/current-user').get(authMiddleware.verifyToken, authController.currentUserData);
router.route('/user-activation/:hashLink').get(authMiddleware.hashLinkValidationRequest, authController.checkHashLink);

module.exports = router;
