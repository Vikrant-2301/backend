// model/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  url: { type: String, required: true }, // URL from ImageKit
  fileId: { type: String, required: true }, // fileId from ImageKit (for deletions)
  altText: { type: String, default: '' },
  caption: { type: String, default: '' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' } // Optional: track who uploaded it
}, { timestamps: true });

module.exports = mongoose.models.Image || mongoose.model('Image', imageSchema);