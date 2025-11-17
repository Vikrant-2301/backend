// routes/authorRoutes.js
const express = require('express');
const router = express.Router();
const authorController = require('../controller/authorController');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/access.middleware');

// All author routes are admin-protected
router.use(authMiddleware, roleMiddleware('admin'));

router.post('/', authorController.createAuthor);
router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);
router.put('/:id', authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;
