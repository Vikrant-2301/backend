const { signup, login, fetchAllUsers, fetchUserByEmail,deleteUser } = require('../service/authService');
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
        const token = await login(req.body);
        const email = token["email"]
        const jwtToken = token["token"]
        const role = token["role"]
        res.status(200).json({ message: 'Login successfull',jwtToken, email, role });
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
        const { email } = req.params; // Get email from URL params
        const user = await fetchUserByEmail(email);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const deleteUserByIdController = async (req, res) => {
    try {
        const { id } = req.params; // Get email from URL params
        const user = await deleteUser(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

module.exports = { signupController, loginController, getAllUsersController, getUserByEmailController ,deleteUserByIdController};
