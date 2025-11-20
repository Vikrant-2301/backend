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
    setUserRoleController,
    getPublicProfileByIdController,
    toggleFavoriteBlogController,
    getUserFavoritesController,
    getAdminChartData
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
router.get('/public/profile/:id', getPublicProfileByIdController); // --- NEW PUBLIC ROUTE ---

// --- AUTHENTICATED & ADMIN ROUTES ---
router.get('/verify-token', authMiddleware, verifyTokenController);
router.put('/profile', authMiddleware, editUserController);
router.post('/password', authMiddleware, updatePasswordController);
router.get('/users', authMiddleware, roleMiddleware('admin'), getAllUsersController);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUserByIdController);
router.post('/assign-admin', authMiddleware, roleMiddleware('admin'), assignAdminController);
router.put('/users/:id/role', authMiddleware, roleMiddleware('admin'), setUserRoleController);

// --- NEW AUTHENTICATED ROUTE ---
router.post('/profile/favorites/blog/:blogId', authMiddleware, toggleFavoriteBlogController);
router.get('/profile/favorites', authMiddleware, getUserFavoritesController);
router.get('/admin/charts', authMiddleware, roleMiddleware('admin'), getAdminChartData);

module.exports = router;
