const { check, param } = require('express-validator');

const loginValidationRules = () => {
    return [
        check('email').trim().notEmpty().withMessage('Email is required').isLength({ max: 254 }).normalizeEmail().isEmail().withMessage('Invalid email'),
        check('pwd').trim().notEmpty().withMessage('Password is required').isLength({ max: 100 })
    ];
}

const forgotPasswordValidationRules = () => {
    return [
        check('email').trim().notEmpty().withMessage('Email is required').normalizeEmail().isEmail().withMessage('Invalid email').isLength({ max: 254 })
    ];
}
/*
const resetPasswordValidationRules = () => {
    return [
        check('newPassword').trim().notEmpty().withMessage('Password is required'),
        //.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        //.withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

        check('confirmPassword').trim().notEmpty().withMessage('Confirm password is required').custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
    ];
}*/

module.exports = {
    loginValidationRules,
    forgotPasswordValidationRules
    //resetPasswordValidationRules
};