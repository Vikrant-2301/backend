//backend\routes\authRoutes.js
const express = require('express');
const {
    sendOtpController,
    verifyAndCreateController,
    loginController,
    getAllUsersController,
    getUserByEmailController,
    deleteUserByIdController,
    editUserController,
    updatePasswordController,
    assignAdminController,
    verifyTokenController,
    forgotPasswordController,
    resetPasswordController,
    resendVerificationController,
    verifyAccountController
} = require('../controller/authController');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/access.middleware');

const router = express.Router();

// --- NEW SIGNUP FLOW ---
router.post('/send-otp', sendOtpController);
router.post('/verify-and-create', verifyAndCreateController);
router.post('/resend-verification', authMiddleware, resendVerificationController);

// --- OTHER PUBLIC ROUTES ---
router.post('/login', loginController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);
router.get('/users/:email', getUserByEmailController);

// --- AUTHENTICATED & ADMIN ROUTES ---
router.post('/verify-account', authMiddleware, verifyAccountController);
router.get('/verify-token', authMiddleware, verifyTokenController);
router.put('/profile', authMiddleware, editUserController);
router.post('/password', authMiddleware, updatePasswordController);
router.get('/users', authMiddleware, roleMiddleware('admin'), getAllUsersController);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUserByIdController);
router.post('/assign-admin', authMiddleware, roleMiddleware('admin'), assignAdminController);

module.exports = router;