const express = require('express');
const router = express.Router();
const botInstanceController = require('../../controllers/botInstanceController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');
const { validate } = require('../../middleware/validators/validate');
const upload = require('../../middleware/multer');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin),
        botInstanceController.getAllBotInstances
    )
    .post(
        upload.single('file'),
        botInstanceController.createBotInstance
    );

router.route('/scheduled')
    .post(
        upload.single('file'),
        botInstanceController.scheduleBot
    );

router.route('/user/:userid')
    .get(
        botInstanceController.getBotInstancesByUser
    );

router.route('/:id')
    .get(
        botInstanceController.getBotInstance
    );

router.route('/status/:userid/:botid')
    .get(
        botInstanceController.checkBotStatus
    )
    .delete(
        botInstanceController.deleteBotInstance
    );


module.exports = router;

