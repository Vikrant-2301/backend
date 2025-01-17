const express = require('express');
const { uploadPostImage, fetchAllPosts } = require('../controller/postController');
const upload = require('../config/upload');

const router = express.Router();

router.post('/upload', upload.single('image'), uploadPostImage);
router.get('/all', fetchAllPosts);

module.exports = router;
