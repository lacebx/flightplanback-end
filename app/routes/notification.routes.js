const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// Route to send a notification
router.post('/', notificationController.sendNotification);

// Route to get notifications for a user
router.get('/:userId', notificationController.getNotifications);

module.exports = router; 