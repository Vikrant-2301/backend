const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Replied', 'Closed'], default: 'Open' },
  replies: [{
    message: String,
    sentAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true, collection: 'contacts' });

module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);