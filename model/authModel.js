const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    firstName: { type: String, required: false }, // Optional
    lastName: { type: String, required: false }, // Optional
    email: { type: String, required: true, unique: true }, // Required and unique
    phoneNumber: { type: String, required: false }, // Optional
    password: { type: String, required: true }, // Required
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Role with default as 'user'
    professionalTitle: { type: String, required: false }, // Optional
    currentLocation: { type: String, required: false }, // Optional
    yearOfGraduation: { type: String, required: false }, // Optional
    nameOfOrganisation: { type: String, required: false }, // Optional
}, { timestamps: true }); 

module.exports = mongoose.model('Auth', authSchema);