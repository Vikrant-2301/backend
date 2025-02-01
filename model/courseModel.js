const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    price: { type: Number, required: true }, 
    dateAdded: { type: Date, required: true, default: Date.now }, 
    description: { type: String },
    courseId: {
        type: Number, 
        unique: true,
        required: true,
        default: () => Math.floor(10000 + Math.random() * 90000), 
    }
},{timestamps: true});

module.exports = mongoose.model('Course', courseSchema);
