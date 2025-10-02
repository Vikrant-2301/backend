const mongoose = require('mongoose');
const TeamMember = require('./teamMember'); // Import TeamMember schema

const RegisterSchema = new mongoose.Schema({
  fullName: { type: String, required: false },
  email: { type: String, required: false, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phoneNumber: { type: String, required: false, match: /^\d{10}$/ },
  dob: { type: Date, required: false },
  course: { type: String, required: false },
  academicYear: { type: String, required: false }, // FIX: Changed type from Number to String
  collegeName: { type: String, required: false},
  teamName: {type: String, required: false},
  registrationType: { type: String, enum: ['individual', 'team'], required: true },
  teamSize: { type: Number, required: function() { return this.registrationType === 'team'; }},
  teamMembers: { type: [TeamMember.schema], required: function() { return this.registrationType === 'team'; }}
}, { collection: 'register-data' });

// Avoid OverwriteModelError
const RegisterModel = mongoose.model('register-data', RegisterSchema);

module.exports = RegisterModel;