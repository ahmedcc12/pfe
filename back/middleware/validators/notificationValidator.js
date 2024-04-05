const { body, param } = require('express-validator');

const createNotificationValidator = [
    body('user').notEmpty().withMessage('User is required'),
    body('message').notEmpty().withMessage('Message is required')
];

const getNotificationsByUserValidator = [
    param('userid').notEmpty().withMessage('User ID is required')
];

const markAsReadValidator = [
    param('id').notEmpty().withMessage('Notification ID is required')
];

const deleteNotificationValidator = [
    param('id').notEmpty().withMessage('Notification ID is required')
];

const clearNotificationsValidator = [
    param('userid').notEmpty().withMessage('User ID is required')
];

module.exports = {
    createNotificationValidator,
    getNotificationsByUserValidator,
    markAsReadValidator,
    deleteNotificationValidator,
    clearNotificationsValidator
};
