const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  submissionLink: { type: String, required: true }, // Google Form link
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('Competition', competitionSchema);