const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  submissionLink: { type: String, required: true },
  googleSheetLink: { type: String },
  priceNational: { type: Number, required: true, default: 0 },
  priceInternational: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('Competition', competitionSchema);
