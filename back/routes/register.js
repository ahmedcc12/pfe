const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');
const { validationResult } = require('express-validator');
const { UserValidationRules } = require('../middleware/validators/uservalidator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array()[0].msg);
        const errorMessage = errors.array()[0].msg;
        return res.status(400).json({ message: errorMessage });
    }
    next();
};


router.route('/')
        .post(verifyRoles(ROLES_LIST.Admin), 
                UserValidationRules(),
                validate,
                registerController.handleNewUser
        );

module.exports = router;