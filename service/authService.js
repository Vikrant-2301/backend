const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const { findUserByEmail,editUser, findUserById,createUser, getAllUsers,getUserByEmail ,deleteUserById} = require('../repo/authRepo');

const signup = async (userData) => {
    const { role, ...rest } = userData; // Extract role and rest of the fields

    // Validate role
    if (role && !['admin', 'user'].includes(role)) {
        throw new Error('Invalid role specified');
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(rest.email);
    if (existingUser) throw new Error('Email already in use');

    // Hash the password
    const hashedPassword = await bcrypt.hash(rest.password, 10);
    rest.password = hashedPassword;

    // Add role (default to 'user' if not provided)
    const user = await createUser({ ...rest, role: role || 'user' });

    return user;
};


const login = async ({ email, password }) => {
    const user = await findUserByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user._id, email: user.email,role:user.role }, jwtSecret, { expiresIn: '3h' });
    return  {token:token, email:user.email, role:user.role};
};

const fetchAllUsers = async () => {
    return getAllUsers();
};

const fetchUserByEmail = async (email) => {
    const user = await getUserByEmail(email);
    if (!user) throw new Error('User not found');
    return user;
};

const deleteUser = async (id) => {
    const user = await deleteUserById(id);
    if (!user) throw new Error('User not found');
    return user;
};

const editUserService = async (id, userData) => {
    const user = await findUserById(id);
    if (!user) throw new Error('User not found');
    return editUser(id, userData);
};


module.exports = { signup, login, fetchAllUsers, fetchUserByEmail,deleteUser,editUserService };
