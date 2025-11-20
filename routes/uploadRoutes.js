// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controller/uploadController');
const authMiddleware = require('../middleware/auth.middleware'); // Protect the route

// Use memoryStorage to handle the file as a buffer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// POST /api/v1/upload/image
// FIX: Removed roleMiddleware('admin') to allow ALL logged-in users to upload
router.post(
  '/image',
  authMiddleware, 
  upload.single('image'), 
  uploadController.uploadBlogImage
);

module.exports = router;