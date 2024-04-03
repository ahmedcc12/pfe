const express = require('express');
const router = express.Router();
const groupController = require('../../controllers/groupController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');
const { GroupValidationRules, paramGroupValidationRules, getGroupBotsValidationRules } = require('../../middleware/validators/groupvalidator');
const { validate } = require('../../middleware/validators/validate');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin),
        getGroupBotsValidationRules(),
        validate,
        groupController.getAllGroups
    )
    .post(
        verifyRoles(ROLES_LIST.Admin),
        GroupValidationRules(),
        validate,
        groupController.createGroup
    );

router.route('/:id')
    .get(
        verifyRoles(ROLES_LIST.Admin),
        paramGroupValidationRules(),
        validate,
        groupController.getGroup
    )
    .put(
        verifyRoles(ROLES_LIST.Admin),
        paramGroupValidationRules(),
        GroupValidationRules(),
        validate,
        groupController.updateGroup
    )
    .delete(
        verifyRoles(ROLES_LIST.Admin),
        paramGroupValidationRules(),
        validate,
        groupController.deleteGroup
    );

router.route('/:id/bots')
    .get(
        paramGroupValidationRules(),
        getGroupBotsValidationRules(),
        validate,
        groupController.getBotsByGroup
    );

module.exports = router;