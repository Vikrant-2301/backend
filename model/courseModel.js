const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    price: { type: Number, required: true }, // Use Number for prices
    dateAdded: { type: Date, required: true, default: Date.now }, // Default to the current date
    description: { type: String },
    courseId: {
        type: Number, // Use Number instead of DataTypes.INTEGER
        unique: true,
        required: true,
        default: () => Math.floor(10000 + Math.random() * 90000), // Generate a 5-digit number
    }
});

module.exports = mongoose.model('Course', courseSchema);
