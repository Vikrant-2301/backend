const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/access.middleware');

router.use(authMiddleware, roleMiddleware('admin'));
router.get('/', contactController.getAllContacts);
router.post('/:id/reply', contactController.replyToContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;