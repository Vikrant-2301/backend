const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    description: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    filename: { type: String, required: true }
    // voteCount interger
    // 2 api to vote
    // remove vote if there
    // only logged in user can vote
    // one user can do only one vote
    // api- get post by post id
    
});

module.exports = mongoose.model('Post', postSchema);
