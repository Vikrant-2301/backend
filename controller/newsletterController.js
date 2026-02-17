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

const subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ error: "Email already subscribed" });
    }

    const newSubscriber = new Newsletter({ email, name });
    await newSubscriber.save();

    res.status(201).json({ message: "Successfully subscribed!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllSubscribers, deleteSubscriber, subscribe };