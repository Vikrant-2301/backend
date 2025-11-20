const authService = require('../service/authService');
const Blog = require('../model/Blog');
const User = require('../model/authModel');

const sendOtpController = async (req, res) => {
    try {
        await authService.sendRegistrationOtp(req.body);
        res.status(200).json({ message: 'OTP sent successfully to your email.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const verifyAndCreateController = async (req, res) => {
    try {
        const tokenData = await authService.verifyAndCreateUser(req.body);
        res.status(201).json({
            message: 'Account created and verified successfully!',
            jwtToken: tokenData.token,
            email: tokenData.email,
            role: tokenData.role,
            userId: tokenData.userId
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginController = async (req, res) => {
    try {
        const tokenData = await authService.login(req.body);
        res.status(200).json({ message: 'Login successful', ...tokenData });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllUsersController = async (req, res) => {
    try {
        const users = await authService.fetchAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserByEmailController = async (req, res) => {
    try {
        const user = await authService.fetchUserByEmail(req.params.email);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const deleteUserByIdController = async (req, res) => {
    try {
        await authService.deleteUser(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const editUserController = async (req, res) => {
    try {
        const user = await authService.editUserService(req.user.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(error.message === 'User not found' ? 404 : 500).json({ error: error.message });
    }
};

const updatePasswordController = async (req, res) => {
    try {
        await authService.updatePassword({ email: req.user.email, ...req.body });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const assignAdminController = async (req, res) => {
    try {
        const user = await authService.assignAdmin(req.body.userEmail);
        res.status(200).json({ message: 'User promoted to admin', user });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const verifyTokenController = (req, res) => {
    try {
        const user = authService.verifyToken(req.user);
        res.status(200).json({ valid: true, user });
    } catch (error) {
        res.status(401).json({ valid: false, error: error.message });
    }
};

const resendVerificationController = async (req, res) => {
    try {
        const { email } = req.body;
        await authService.sendRegistrationOtp({ email });
        res.status(200).json({ message: 'Verification email resent successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const forgotPasswordController = async (req, res) => {
    try {
        await authService.forgotPassword(req.body.email);
        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: 'Failed to send password reset email. Please try again later.' });
    }
};

const resetPasswordController = async (req, res) => {
    try {
        await authService.resetPassword(req.params.token, req.body.password);
        res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const setUserRoleController = async (req, res) => {
    try {
        const { id } = req.params; // Get user ID from the URL parameter
        const { role } = req.body; // Get the new role from the request body

        if (!role) {
            return res.status(400).json({ error: 'Role is required in the body.' });
        }

        const user = await authService.setUserRole(id, role);
        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getPublicProfileByIdController = async (req, res) => {
    try {
        // The service now handles both ID and Username lookups correctly
        const user = await authService.getPublicProfileById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const toggleFavoriteBlogController = async (req, res) => {
    try {
        const userId = req.user.id; // From authMiddleware
        const { blogId } = req.params;
        const savedPosts = await authService.toggleFavoriteBlog(userId, blogId);
        res.status(200).json({ savedBlogPosts: savedPosts });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// --- NEW: Get Populated Favorites ---
const getUserFavoritesController = async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch user and populate the savedBlogPosts array
        const user = await User.findById(userId).populate({
            path: 'savedBlogPosts',
            select: 'title slug featuredImage author createdAt', // Select fields to display in card
            populate: { path: 'author', select: 'name' } // Populate author name inside blog
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ 
            savedBlogPosts: user.savedBlogPosts || [], 
            savedTools: user.savedTools || [] 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAdminChartData = async (req, res) => {
    try {
        // 1. User Registrations per Month (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const userStats = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } } // Sort by month
        ]);

        // Map month numbers to Names
        const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedUserStats = userStats.map(stat => ({
            name: monthNames[stat._id],
            users: stat.count
        }));

        // 2. Blog Engagement (Top 5 posts)
        const blogStats = await Blog.find()
            .sort({ viewCount: -1 })
            .limit(5)
            .select('title viewCount likeCount');

        const formattedBlogStats = blogStats.map(b => ({
            name: b.title.substring(0, 15) + '...', // Truncate title
            views: b.viewCount,
            likes: b.likeCount
        }));

        res.json({
            userRegistrations: formattedUserStats,
            blogEngagement: formattedBlogStats
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
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
};
