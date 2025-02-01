// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema({
//     description: { type: String, required: true },
//     name: { type: String, required: true },
//     date: { type: Date, required: true },
//     filename: { type: String, required: true }
//     // voteCount interger
//     // 2 api to vote
//     // remove vote if there
//     // only logged in user can vote
//     // one user can do only one vote
//     // api- get post by post id
    
// });

// module.exports = mongoose.model('Post', postSchema);

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    description: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    filename: { type: String, required: true },
    voteCount: { type: Number, default: 0 }, // Track the number of votes
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Track users who have voted
});

// Method to add a vote
postSchema.methods.addVote = function(userId) {
    if (this.voters.includes(userId)) {
        throw new Error('User has already voted');
    }
    this.voters.push(userId);
    this.voteCount += 1;
    return this.save();
};

// Method to remove a vote
postSchema.methods.removeVote = function(userId) {
    const voterIndex = this.voters.indexOf(userId);
    if (voterIndex === -1) {
        throw new Error('User has not voted');
    }
    this.voters.splice(voterIndex, 1);
    this.voteCount -= 1;
    return this.save();
};

module.exports = mongoose.model('Post', postSchema);