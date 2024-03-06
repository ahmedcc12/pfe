const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passwordReset = require('../controllers/passwordReset');

router.post('/', authController.handleLogin);
router.post('/forgotpassword', passwordReset.handleForgotPassword);
router.post('/resetpassword', passwordReset.handleResetPassword);
router.get('/resetpassword/:token', passwordReset.verifyToken);

module.exports = router;