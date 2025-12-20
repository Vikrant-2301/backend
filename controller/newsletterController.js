const Newsletter = require('../model/Newsletter');

const getAllSubscribers = async (req, res) => {
  try {
    const subs = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json(subs);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteSubscriber = async (req, res) => {
    try {
        await Newsletter.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { getAllSubscribers, deleteSubscriber };