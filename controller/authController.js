// controller/authController.js
const {
    signup, login, fetchAllUsers, editUserService, fetchUserByEmail,
    deleteUser, updatePassword, assignAdmin, verifyToken,
    forgotPassword, resetPassword
} = require('../service/authService');

const forgotPasswordController = async (req, res) => {
    try {
        await forgotPassword(req.body.email);
        res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }
};

const resetPasswordController = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        await resetPassword(token, password);
        res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const editUserController = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await editUserService(id, req.body); // No file argument
        res.status(200).json(user);
    } catch (error) {
        res.status(error.message === 'User not found' ? 404 : 500).json({ error: error.message });
    }
};

// --- Other controllers ---

const signupController = async (req, res) => {
    try {
        const user = await signup(req.body);
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const loginController = async (req, res) => {
    try {
        const tokenData = await login(req.body);
        res.status(200).json({
            message: 'Login successful',
            jwtToken: tokenData.token,
            email: tokenData.email,
            role: tokenData.role,
            userId: tokenData.userId
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllUsersController = async (req, res) => {
    try {
        const users = await fetchAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserByEmailController = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await fetchUserByEmail(email);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const deleteUserByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await deleteUser(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const updatePasswordController = async (req, res) => {
    try {
        const { email } = req.user;
        const { currentPassword, newPassword } = req.body;
        await updatePassword({ email, currentPassword, newPassword });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const assignAdminController = async (req, res) => {
    try {
        const { userEmail } = req.body;
        const user = await assignAdmin(userEmail);
        res.status(200).json({ message: 'User promoted to admin', user });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const verifyTokenController = (req, res) => {
    try {
        const user = verifyToken(req.user);
        res.status(200).json({ valid: true, user });
    } catch (error) {
        res.status(401).json({ valid: false, error: error.message });
    }
};

module.exports = {
    signupController, loginController, getAllUsersController,
    getUserByEmailController, deleteUserByIdController, editUserController,
    updatePasswordController, assignAdminController, verifyTokenController,
    forgotPasswordController, resetPasswordController
};