const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const { validationResult } = require('express-validator');
const { UserValidationRules, getAllUsersValidationRules, paramUserValidationRules } = require('../../middleware/validators/uservalidator');


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
    .get(verifyRoles(ROLES_LIST.Admin), 
        getAllUsersValidationRules(),
        validate,
        usersController.getAllUsers
    )

router.route('/userbots')
    .get(
        paramUserValidationRules(),
        validate,
        usersController.getUserBots
    )

router.route('/:matricule')
    .get(
        paramUserValidationRules(),
        validate,
        usersController.getUser
    )
    .delete(verifyRoles(ROLES_LIST.Admin), 
        paramUserValidationRules(),
        validate,
        usersController.deleteUser
    )
    .put(verifyRoles(ROLES_LIST.Admin), 
        paramUserValidationRules(),
        UserValidationRules(),
        validate,
        usersController.updateUser
        );

module.exports = router;