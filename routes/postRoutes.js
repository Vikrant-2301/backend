const express = require('express');
const {
    uploadPostImage,
    fetchAllPosts,
    addVoteToPost,
    removeVoteFromPost,
    fetchPostById,
    deletePostController
} = require('../controller/postController');
const upload = require('../config/upload');
// const auth = require('../middleware/auth'); // Authentication middleware

const router = express.Router();

/**
 * Routes
 */

// Upload a post image
router.post('/upload', upload.single('image'), uploadPostImage);

// Fetch all posts
router.get('/all', fetchAllPosts);

// Fetch a post by ID
router.get('/:id', fetchPostById);

// Add a vote to a post
router.post('/:id/vote',  addVoteToPost);

// Remove a vote from a post
router.delete('/:id/vote',  removeVoteFromPost);

// Delete a post by ID
router.delete('/:postId', deletePostController);



module.exports = router;