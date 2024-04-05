const { check, param } = require('express-validator');

const createBotInstancesValidationRules = () => {
    return [
        check('bot').trim().escape().notEmpty().withMessage('BotId is required'),
        check('user').trim().escape().notEmpty().withMessage('UserId is required'),
        check('file').notEmpty().withMessage('File is required')
    ];
}

const paramBotInstanceValidationRules = () => {
    return [
        param('id').trim().escape().notEmpty().withMessage('BotInstanceId is required'),
    ];
}

const scheduleBotValidationRules = () => {
    return [
        check('scheduled').trim().escape().notEmpty().withMessage('BotId is required'),
    ];
}

const userIdValidationRules = () => {
    return [
        param('userid').trim().escape().notEmpty().withMessage('UserId is required'),
    ];
}

const userAndBotIdsValidationRules = () => {
    return [
        param('userid').trim().escape().notEmpty().withMessage('UserId is required'),
        param('botid').trim().escape().notEmpty().withMessage('BotId is required'),
    ];
}

module.exports = {
    createBotInstancesValidationRules,
    paramBotInstanceValidationRules,
    scheduleBotValidationRules,
    userIdValidationRules,
    userAndBotIdsValidationRules
};
