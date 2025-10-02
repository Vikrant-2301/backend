const express = require('express');
const router = express.Router();
const competitionController = require('../controller/competitionController');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/access.middleware');

// Public routes
router.get('/all', competitionController.getAllCompetitions);
router.get('/:id', competitionController.getCompetitionById);

// User-specific routes (needs authentication)
router.get('/user/my-competitions', authMiddleware, competitionController.getUserCompetitions);
router.post('/:id/register', authMiddleware, competitionController.registerForCompetition);


// Admin routes (needs authentication and admin role)
router.post('/', authMiddleware, roleMiddleware('admin'), competitionController.createCompetition);
router.put('/:id', authMiddleware, roleMiddleware('admin'), competitionController.updateCompetition);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), competitionController.deleteCompetition);

module.exports = router;
