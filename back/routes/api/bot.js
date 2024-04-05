const express = require('express');
const router = express.Router();
const botController = require('../../controllers/botController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');
const upload = require('../../middleware/multer');
const { BotValidationRules, paramBotValidationRules, botStatusValidationRules, getAllBotsValidationRules } = require('../../middleware/validators/botvalidator');
const { validate } = require('../../middleware/validators/validate');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin),
        getAllBotsValidationRules(),
        validate,
        botController.getAllBots
    )
    .post(
        verifyRoles(ROLES_LIST.Admin),
        upload.single('file'),
        BotValidationRules(),
        validate,
        botController.createBot
    );

router.route('/:name')
    .get(
        paramBotValidationRules(),
        validate,
        botController.getBot
    )
    .delete(
        verifyRoles(ROLES_LIST.Admin),
        paramBotValidationRules(),
        validate,
        botController.deleteBot
    )
    .put(
        verifyRoles(ROLES_LIST.Admin),
        paramBotValidationRules(),
        BotValidationRules(),
        validate,
        upload.single('file'),
        botController.updateBot
    );

module.exports = router;
