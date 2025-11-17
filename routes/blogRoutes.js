const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/access.middleware');

// --- Public Routes ---
// Get all published blog posts
router.get('/', blogController.getAllBlogsPublic);

// Get a single published blog post by slug
router.get('/:slug', blogController.getBlogBySlugPublic);

// --- Authenticated User Routes (NEW) ---
router.post('/:postId/like', authMiddleware, blogController.likePostController);
router.post('/:postId/share', authMiddleware, blogController.sharePostController);

// --- Admin Routes ---
// Get all blog posts (drafts and published)
router.get('/admin/all', authMiddleware, roleMiddleware('admin'), blogController.getAllBlogsAdmin);

// Get a single blog post by ID (for editing)
router.get('/admin/:id', authMiddleware, roleMiddleware('admin'), blogController.getBlogById);

// Create a new blog post
router.post('/', authMiddleware, roleMiddleware('admin'), blogController.createBlog);

// Update a blog post
router.put('/:id', authMiddleware, roleMiddleware('admin'), blogController.updateBlog);

// Delete a blog post
router.delete('/:id', authMiddleware, roleMiddleware('admin'), blogController.deleteBlog);

module.exports = router;