const notificationRepo = require('../repo/notificationRepo');
const authRepo = require('../repo/authRepo');

const getNotificationsForUser = async (userId) => {
    return notificationRepo.findForUser(userId);
};

const getAllNotifications = async () => {
    return notificationRepo.findAll();
};

const sendNotification = async ({ title, message, targetUserEmail }) => {
    let targetUserId = null;
    if (targetUserEmail) {
        const user = await authRepo.findUserByEmail(targetUserEmail);
        if (!user) {
            throw new Error('Target user not found');
        }
        targetUserId = user._id;
    }

    const notificationData = {
        title,
        message,
        user: targetUserId, // Will be null for global notifications
    };

    return notificationRepo.create(notificationData);
};

module.exports = { getNotificationsForUser, sendNotification, getAllNotifications };
