const mongoose = require('mongoose');

const votingProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    students: [{
        type: String,
        required: true
    }],
    images: [{
        type: String, // URLs to images
        required: true
    }],
    voteCount: {
        type: Number,
        default: 0
    },
    uniqueId: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined values to not conflict
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('VotingProject', votingProjectSchema);
