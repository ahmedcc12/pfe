const express = require('express');
const router = express.Router();
const botController = require('../../controllers/botController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');
const upload = require ('../../middleware/multer');


router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin),(botController.getAllBots))
    .post(verifyRoles(ROLES_LIST.Admin),upload.single('file'), botController.createBot)

router.route('/:name')
    .get(botController.getBot)
    .delete(verifyRoles(ROLES_LIST.Admin), botController.deleteBot)
    .put(verifyRoles(ROLES_LIST.Admin), upload.single('file'),botController.updateBot);

module.exports = router;