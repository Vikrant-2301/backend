const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VotingProject',
        required: true
    }
}, { timestamps: true });

// Ensure a user can only vote once per project
voteSchema.index({ user: 1, project: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
