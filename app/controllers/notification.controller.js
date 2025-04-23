const db = require('../models');

// Send a notification to a user
exports.sendNotification = async (req, res) => {
  const { userId, message } = req.body;
  try {
    const notification = await db.Notification.create({ userId, message });
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await db.Notification.findAll({ where: { userId, isRead: false } });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 