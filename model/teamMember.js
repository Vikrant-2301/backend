const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phoneNumber: { type: String, required: true, match: /^\d{10}$/ },
  dob: { type: Date, required: true },
  course: { type: String, required: true },
  academicYear: { type: String, required: true }, // FIX: Changed type from Number to String
  collegeName: { type: String, required: true }
}, { collection: 'teamMembers' }); // Specify the collection name

const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;