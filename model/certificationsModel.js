// models/file.model.js
const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  certificateSerialNumber: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: false },
  fileUrl: { type: String, required: true }, // S3 URL
  fileName: { type: String, required: true }, // Original file name
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);