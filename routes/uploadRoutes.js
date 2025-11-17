// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controller/uploadController');
const authMiddleware = require('../middleware/auth.middleware'); // Protect the route
const roleMiddleware = require('../middleware/access.middleware'); // Ensure only admin can upload

// Use memoryStorage to handle the file as a buffer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// POST /api/v1/upload/image
router.post(
  '/image',
  authMiddleware,
  roleMiddleware('admin'), // Only admins can upload blog images
  upload.single('image'), // 'image' must match the FormData key from frontend
  uploadController.uploadBlogImage
);

module.exports = router;