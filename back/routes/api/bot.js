const express = require('express');
const router = express.Router();
const botController = require('../../controllers/botController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');
const upload = require('../../middleware/multer');
const { BotValidationRules, paramBotValidationRules, botStatusValidationRules, getAllBotsValidationRules } = require('../../middleware/validators/botvalidator');
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
        upload.single('file'),
        paramBotValidationRules(),
        BotValidationRules(),
        validate,
        botController.updateBot
    );

router.route('/status')
    .post(
        paramBotValidationRules(),
        botStatusValidationRules(),
        botController.runOrStopBot
    );

router.route('/schedule')
    .post(
        botController.scheduleBot
    );

module.exports = router;
