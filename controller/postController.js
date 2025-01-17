const AWS = require('aws-sdk');
const { createPost, getAllPosts } = require('../repo/postRepo');
const fs = require('fs');

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const uploadPostImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { description, name, date } = req.body;
        if (!description || !name || !date) {
            return res.status(400).json({ message: 'Description, name, and date are required' });
        }

        const fileContent = fs.readFileSync(req.file.path);
        const s3Params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `uploads/${Date.now()}-${req.file.originalname}`,
            Body: fileContent,
            ContentType: req.file.mimetype,
        };

        // Upload the file to S3
        const uploadResult = await s3.upload(s3Params).promise();

        // Clean up the local file
        fs.unlinkSync(req.file.path);

        const postData = {
            description,
            name,
            date: new Date(date),
            filename: uploadResult.Location
        };

        const newPost = await createPost(postData);

        res.status(200).json({ message: 'Post uploaded successfully', post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const fetchAllPosts = async (req, res) => {
    try {
        const posts = await getAllPosts();

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }

        res.status(200).json({ posts });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { uploadPostImage, fetchAllPosts };
