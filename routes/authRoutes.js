const express = require('express');
const {
    signupController,
    loginController,
    getAllUsersController,
    getUserByEmailController,
    deleteUserByIdController,
    editUserController,
    updatePasswordController,
    assignAdminController,
    verifyTokenController,
    forgotPasswordController,
    resetPasswordController
} = require('../controller/authController');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/access.middleware');

const router = express.Router();

// --- PUBLIC ROUTES ---
router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);
router.get('/users/:email', getUserByEmailController);

// --- AUTHENTICATED ROUTES ---
router.get('/verify-token', authMiddleware, verifyTokenController);
router.put('/profile', authMiddleware, editUserController); // No more upload middleware
router.post('/password', authMiddleware, updatePasswordController);

// --- ADMIN-ONLY ROUTES ---
router.get('/users', authMiddleware, roleMiddleware('admin'), getAllUsersController);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUserByIdController);
router.post('/assign-admin', authMiddleware, roleMiddleware('admin'), assignAdminController);

module.exports = router;