const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

// Send email notification
router.post("/email", notificationController.sendEmail);

// Add route for sending notifications
router.post("/send", notificationController.sendNotification);

module.exports = router; 