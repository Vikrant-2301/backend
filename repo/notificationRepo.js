const Notification = require('../model/Notification');

const create = async (data) => new Notification(data).save();

// Find notifications for a specific user OR global notifications (where user is null)
const findForUser = async (userId) => {
    return Notification.find({
        $or: [{ user: userId }, { user: null }]
    }).sort({ createdAt: -1 });
};

const findAll = async () => Notification.find().sort({ createdAt: -1 }).populate('user', 'email');


module.exports = { create, findForUser, findAll };
