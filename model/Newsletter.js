const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  source: { type: String, default: 'Website' }
}, { timestamps: true, collection: 'newsletters' });

module.exports = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);