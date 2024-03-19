const { check, param } = require('express-validator');

const getAllBotsValidationRules = () => {
    const validSearchOptions = ['all', 'name', 'description', 'status']
    return [
        check('search').escape().optional().isString().withMessage('Search must be a string').isLength({ max: 50 }).withMessage('Search query is too long'),
        check('searchOption').escape().optional().isString().withMessage('Search option must be a string').isIn(validSearchOptions).withMessage('Invalid search option')
    ]
}

const BotValidationRules = () => {
    const statusOptions = ['active', 'inactive'];
    return [
        check('newName').trim().escape().escape().notEmpty().withMessage('Name is required').isLength({ min: 3, max: 10 }).withMessage('Name must be at least 3 characters long and at most 10 characters long'),
        check('description').trim().escape().notEmpty().withMessage('Description is required').isLength({ min: 4, max: 50 }).withMessage('Description must be at least 4 characters long and at most 50 characters long'),
    ];
};

const paramBotValidationRules = () => {
    return [
        param('name').trim().escape().notEmpty().withMessage('Name is required'),
    ];
}

const botStatusValidationRules = () => {
    const statusOptions = ['active', 'inactive'];
    return [
        check('status').trim().escape().notEmpty().withMessage('Status is required').isIn(statusOptions).withMessage('Invalid status')
    ];
}

module.exports = {
    BotValidationRules,
    getAllBotsValidationRules,
    paramBotValidationRules,
    botStatusValidationRules
};