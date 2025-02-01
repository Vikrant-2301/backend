const AWS = require('aws-sdk');

const fs = require('fs');
const postService = require('../service/postService');

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

/**
 * Uploads a post image to S3 and creates a new post in the database.
 */
const uploadPostImage = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Validate required fields
        const { description, name } = req.body;
        if (!description || !name ) {
            return res.status(400).json({ message: 'Description, name, and date are required' });
        }

        // Read the file from the local filesystem
        const fileContent = fs.readFileSync(req.file.path);

        // Define S3 upload parameters
        const s3Params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `uploads/${Date.now()}-${req.file.originalname}`, // Unique file name
            Body: fileContent,
            ContentType: req.file.mimetype, // Preserve the file's MIME type
        };

        // Upload the file to S3
        const uploadResult = await s3.upload(s3Params).promise();

        // Clean up the local file after upload
        fs.unlinkSync(req.file.path);

        // Prepare post data for database
        const postData = {
            description,
            name,
            date: new Date(),
            filename: uploadResult.Location, // S3 file URL
        };

        // Create the post in the database
        const newPost = await postService.createPost(postData);

        // Return success response
        res.status(201).json({ message: 'Post uploaded successfully', post: newPost });
    } catch (error) {
        console.error('Error uploading post image:', error);

        // Clean up the local file in case of an error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // Handle specific AWS S3 errors
        if (error.code === 'AccessDenied' || error.code === 'NoSuchBucket') {
            return res.status(403).json({ error: 'S3 access denied or bucket does not exist' });
        }

        // Generic error response
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Fetches all posts from the database.
 */
const fetchAllPosts = async (req, res) => {
    try {
        // Fetch all posts from the database
        const posts = await postService.getAllPosts();

        // Check if posts exist
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }

        // Return the list of posts
        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Fetches a single post by its ID.
 */
const fetchPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        // Fetch the post by ID
        const post = await postService.getPostById(postId);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Return the post
        res.status(200).json({ post });
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Adds a vote to a post.
 */
const addVoteToPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id; // Assuming user ID is available in the request (from auth middleware)

        // Add the vote
        const updatedPost = await postService.addVote(postId, userId);

        // Return the updated post
        res.status(200).json({ message: 'Vote added successfully', post: updatedPost });
    } catch (error) {
        console.error('Error adding vote:', error);

        // Handle specific errors
        if (error.message === 'User has already voted') {
            return res.status(400).json({ error: 'User has already voted' });
        }

        if (error.message === 'Post not found') {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Generic error response
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Removes a vote from a post.
 */
const removeVoteFromPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id; // Assuming user ID is available in the request (from auth middleware)

        // Remove the vote
        const updatedPost = await postService.removeVote(postId, userId);

        // Return the updated post
        res.status(200).json({ message: 'Vote removed successfully', post: updatedPost });
    } catch (error) {
        console.error('Error removing vote:', error);

        // Handle specific errors
        if (error.message === 'User has not voted') {
            return res.status(400).json({ error: 'User has not voted' });
        }

        if (error.message === 'Post not found') {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Generic error response
        res.status(500).json({ error: 'Internal server error' });
    }
};

// delete a post by postId
const deletePostController = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await postService.deletePost(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
  }



module.exports = {
    uploadPostImage,
    fetchAllPosts,
    fetchPostById,
    addVoteToPost,
    removeVoteFromPost,
    deletePostController
};