const notificationService = require('../service/notificationService');

const getNotificationsForUser = async (req, res) => {
    try {
        // req.user.id is from the auth middleware
        const notifications = await notificationService.getNotificationsForUser(req.user.id);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getAllNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const sendNotification = async (req, res) => {
    try {
        const notification = await notificationService.sendNotification(req.body);
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getNotificationsForUser, sendNotification, getAllNotifications };
