const express = require('express');
const router = express.Router();
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');
const { validate } = require('../../middleware/validators/validate');
const notificationController = require('../../controllers/notificationController');
const {
    createNotificationValidator,
    getNotificationsByUserValidator,
    markAsReadValidator,
    deleteNotificationValidator,
    clearNotificationsValidator
} = require('../../middleware/validators/notificationValidator');

router.route('/')
    .get(
        verifyRoles(ROLES_LIST.Admin),
        notificationController.getAllNotifications
    )
    .post(
        createNotificationValidator,
        validate,
        notificationController.createNotification
    );

router.route('/:userid')
    .get(
        getNotificationsByUserValidator,
        validate,
        notificationController.getNotificationsByUser
    );

router.route('/unread/:userid')
    .get(
        getNotificationsByUserValidator,
        validate,
        notificationController.getUnreadNotificationsByUser
    );

router.route('/clear/:userid')
    .delete(
        clearNotificationsValidator,
        validate,
        notificationController.clearNotifications
    );

router.route('/:id')
    .put(
        markAsReadValidator,
        validate,
        notificationController.markAsRead
    )
    .delete(
        deleteNotificationValidator,
        validate,
        notificationController.deleteNotification
    );

module.exports = router;
