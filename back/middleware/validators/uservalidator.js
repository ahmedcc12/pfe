const { check, param } = require('express-validator');

const getAllUsersValidationRules = () => {
    const validSearchOptions = ['all', 'matricule', 'email', 'firstname', 'lastname', 'department', 'role']
    return [
        check('search').optional().isString().withMessage('Search must be a string').isLength({ max: 50 }).withMessage('Search query is too long'),
        check('searchOption').optional().escape().isString().withMessage('Search option must be a string').isIn(validSearchOptions).withMessage('Invalid search option')
    ]
}

const UserValidationRules = () => {
    return [
        check('newMatricule').trim().escape().notEmpty().withMessage('Matricule is required').isLength({ min: 4, max: 50 }).withMessage('Matricule must be at least 4 characters long'),
        check('email').trim().escape().normalizeEmail().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format').isLength({ max: 254 }).withMessage('Email is too long'),
        check('firstname').trim().escape().notEmpty().withMessage('Firstname is required').isLength({ min: 3, max: 20 }).withMessage('Firstname must be 3 to 20 characters long'),
        check('lastname').trim().escape().notEmpty().withMessage('Lastname is required').isLength({ min: 3, max: 20 }).withMessage('Lastname must be 3 to 20 characters long'),
        check('department').trim().escape().notEmpty().withMessage('Department is required').isLength({ min: 2, max: 50 }).withMessage('Department must be 2 to 20 characters long'),
        check('role').trim().escape().notEmpty().withMessage('Role is required'),
        check('selectedBots').isArray({ min: 1 }).withMessage('At least one bot must be selected'),
    ];
};

// Validation rules for deleting a user
const paramUserValidationRules = () => {
    return [
        check('matricule').trim().escape().notEmpty().withMessage('Matricule is required'),
    ];
};


module.exports = {
    UserValidationRules,
    getAllUsersValidationRules,
    paramUserValidationRules
};
