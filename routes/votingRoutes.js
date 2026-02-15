const express = require('express');
const router = express.Router();
const votingController = require('../controller/votingController');
const authMiddleware = require('../middleware/auth.middleware');

// Public route to view projects (optionally passes auth token to check if user voted)
// We use a custom middleware wrapper or just generic authMiddleware but make it optional?
// Actually simpler: The frontend can call this route. 
// If we want to return `userVotedProjectId`, we need to know who the user is.
// So we can make a middleware that extracts user IF token exists, but doesn't fail if not.
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        if (token) {
            const decoded = jwt.verify(token, jwtSecret);
            req.user = decoded;
        }
    } catch (error) {
        // Ignore invalid tokens for optional auth
        console.log('[OptionalAuth] Token verification failed:', error.message);
    }
    next();
};

router.get('/', optionalAuth, votingController.getAllProjects);

// Protected route to vote
router.post('/vote', authMiddleware, votingController.castVote);

// Admin Routes
router.get('/admin/stats', authMiddleware, votingController.getVotingStats); // Place before :id routes
router.post('/', authMiddleware, votingController.createProject);
router.put('/:id', authMiddleware, votingController.updateVotingProject);
router.post('/admin/vote/:id', authMiddleware, votingController.addManualVotes);
router.delete('/:id', authMiddleware, votingController.deleteProject);
router.get('/admin/votes', authMiddleware, votingController.getAllVotes);

// Admin route (optional/hidden)
// router.post('/reset', authMiddleware, votingController.resetVotes);

module.exports = router;
