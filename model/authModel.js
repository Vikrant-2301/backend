const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    firstName: { type: String, required: false, default: '' },
    lastName: { type: String, required: false, default: '' },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: false, default: '' },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    professionalTitle: { type: String, required: false, default: '' },
    currentLocation: { type: String, required: false, default: '' },
    yearOfGraduation: { type: String, required: false, default: '' },
    nameOfOrganisation: { type: String, required: false, default: '' },
    
    // Fields for password reset
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Fields for OTP Verification
    isVerified: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('Auth', authSchema);