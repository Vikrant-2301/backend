const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  fullName: { type: String }, // Store temporary signup data
  hashedPassword: { type: String }, // Store temporary signup data
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 600 // Document automatically deletes after 600 seconds (10 minutes)
  }
});

module.exports = mongoose.models.Otp || mongoose.model('Otp', otpSchema);