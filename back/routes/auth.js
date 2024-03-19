const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passwordReset = require('../controllers/passwordReset');
const { loginValidationRules, forgotPasswordValidationRules, resetPasswordValidationRules } = require('../middleware/validators/authvalidator');
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array()[0].msg);
        const errorMessage = errors.array()[0].msg;
        return res.status(400).json({ message: errorMessage });
    }
    next();
};


router.post('/',
    loginValidationRules(),
    validate,
    authController.handleLogin
);
router.post('/forgotpassword',
    forgotPasswordValidationRules(),
    validate,
    passwordReset.handleForgotPassword
);
router.post('/resetpassword',
    //resetPasswordValidationRules(),
    //validate,
    passwordReset.handleResetPassword
);
router.get('/resetpassword/:token', passwordReset.verifyToken);

module.exports = router;