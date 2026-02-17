const express = require('express');
const router = express.Router();
const newsletterController = require('../controller/newsletterController');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/access.middleware');

// Public route
router.post('/subscribe', newsletterController.subscribe);

// Protected routes
router.use(authMiddleware, roleMiddleware('admin'));
router.get('/', newsletterController.getAllSubscribers);
router.delete('/:id', newsletterController.deleteSubscriber);

module.exports = router;