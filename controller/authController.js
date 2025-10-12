const authService = require('../service/authService');

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
    resendVerificationController
};
