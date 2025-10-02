const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/access.middleware');

// Get notifications for the logged-in user
router.get('/', authMiddleware, notificationController.getNotificationsForUser);

// Admin: send a notification
router.post('/', authMiddleware, roleMiddleware('admin'), notificationController.sendNotification);

// Admin: get all notifications
router.get('/all', authMiddleware, roleMiddleware('admin'), notificationController.getAllNotifications);


module.exports = router;
