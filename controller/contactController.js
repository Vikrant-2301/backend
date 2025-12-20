const Contact = require('../model/Contact');
const { sendMail } = require('../utils/mail.util'); // Reuse your existing mail util

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const replyToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, subject } = req.body;
    
    const contact = await Contact.findById(id);
    if(!contact) return res.status(404).json({ error: "Contact not found" });

    // Send Reply Email
    await sendMail(
      contact.email, 
      subject || `Re: Ticket #${contact.ticketId} - DiscoverArch`, 
      message
    );

    // Update DB
    contact.status = 'Replied';
    contact.replies.push({ message });
    await contact.save();

    res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { getAllContacts, replyToContact, deleteContact };