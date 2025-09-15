const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { jwtSecret } = require('../config');
const { sendMail } = require('../utils/mail.util');
const {
  findUserByEmail,
  editUserById,
  findUserById,
  createUser,
  getAllUsers,
  getUserByEmail,
  deleteUserById
} = require('../repo/authRepo');
const User = require('../model/authModel');

const signup = async (userData) => {
  const { role, ...rest } = userData;

  if (role && !['admin', 'user'].includes(role)) {
    throw new Error('Invalid role specified');
  }

  const existingUser = await findUserByEmail(rest.email);
  if (existingUser) throw new Error('Email already in use');

  const hashedPassword = await bcrypt.hash(rest.password, 10);
  rest.password = hashedPassword;

  const user = await createUser({ ...rest, role: role || 'user' });

  return user;
};

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '3h' });
  return { token, email: user.email, role: user.role, userId: user._id };
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

const editUserService = async (userId, userData) => {
  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');

  // Do not allow password, role, or profilePic to be changed through this service
  delete userData.password;
  delete userData.profilePic;
  delete userData.role;

  const updatedUser = await editUserById(userId, userData);
  return updatedUser;
};

const verifyToken = (user) => {
    if (!user) throw new Error('Invalid token');
    return { id: user.id, email: user.email, role: user.role };
};

const updatePassword = async ({ email, currentPassword, newPassword }) => {
    const user = await findUserByEmail(email);
    if (!user) throw new Error('User not found');

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) throw new Error('Invalid current password');

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
};

const assignAdmin = async (email) => {
    const user = await findUserByEmail(email);
    if (!user) throw new Error('User not found');

    user.role = 'admin';
    await user.save();
    return user;
};

const forgotPassword = async (email) => {
    const user = await findUserByEmail(email);
    if (!user) {
        console.log(`Password reset attempted for non-existent user: ${email}`);
        return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`; 
    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste this into your browser to complete the process within ten minutes of receiving it:\n\n${resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

    try {
        await sendMail(user.email, 'Password Reset Link', message);
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        throw new Error('There was an error sending the email. Try again later.');
    }
};

const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new Error('Token is invalid or has expired.');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
};

module.exports = {
  signup,
  login,
  fetchAllUsers,
  fetchUserByEmail,
  deleteUser,
  editUserService,
  updatePassword,
  assignAdmin,
  verifyToken,
  forgotPassword,
  resetPassword
};