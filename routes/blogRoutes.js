const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/access.middleware');

// --- Admin & Member Routes ---
// Place specific routes BEFORE slug catch-all to avoid collisions
router.get('/admin/all', authMiddleware, roleMiddleware(['admin', 'member']), blogController.getAllBlogsAdmin);
router.get('/admin/:id', authMiddleware, roleMiddleware(['admin', 'member']), blogController.getBlogById);
router.post('/', authMiddleware, roleMiddleware(['admin', 'member']), blogController.createBlog);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'member']), blogController.updateBlog);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'member']), blogController.deleteBlog);

// --- Authenticated User Routes (NEW) ---
router.post('/:postId/like', authMiddleware, blogController.likePostController);
router.post('/:postId/share', authMiddleware, blogController.sharePostController);

// --- Public Routes ---
router.get('/', blogController.getAllBlogsPublic);
router.get('/:slug', blogController.getBlogBySlugPublic);

module.exports = router;
