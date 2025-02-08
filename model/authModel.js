const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    firstName: { type: String, required: false, default:'' }, // Optional
    lastName: { type: String, required: false , default:''}, // Optional
    email: { type: String, required: true, unique: true }, // Required and unique
    phoneNumber: { type: String, required: false, default:'' }, // Optional
    password: { type: String, required: true }, // Required
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Role with default as 'user'
    professionalTitle: { type: String, required: false , default:''}, // Optional
    currentLocation: { type: String, required: false , default:''}, // Optional
    yearOfGraduation: { type: String, required: false , default:''}, // Optional
    nameOfOrganisation: { type: String, required: false , default:''}, // Optional
}, { timestamps: true }); 

module.exports = mongoose.model('Auth', authSchema);