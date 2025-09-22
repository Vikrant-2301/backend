//backend\service\authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { jwtSecret } = require('../config');
const { sendMail } = require('../utils/mail.util');
const {
  findUserByEmail,
  createUser,
  getAllUsers,
  getUserByEmail,
  deleteUserById,
  findUserById,
  editUserById
} = require('../repo/authRepo');
const User = require('../model/authModel');

const pendingRegistrations = new Map();

const sendRegistrationOtp = async ({ fullName, email, password }) => {
    const existingUser = await findUserByEmail(email);

    if (existingUser && !fullName && !password) {
        if (existingUser.isVerified) {
            throw new Error('This account is already verified.');
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); 

        pendingRegistrations.set(email, { 
            fullName: `${existingUser.firstName} ${existingUser.lastName}`, 
            email, 
            hashedPassword: existingUser.password, 
            otp, 
            expires,
            existingUser: true
        });
        
        setTimeout(() => {
            if (pendingRegistrations.has(email) && pendingRegistrations.get(email).otp === otp) {
                pendingRegistrations.delete(email);
            }
        }, 10 * 60 * 1000 + 1000);

        const emailBody = `Welcome to DiscoverArch!\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;
        await sendMail(email, 'Your DiscoverArch Verification Code', emailBody);

        return { message: 'OTP sent successfully.' };
    }
    
    if (existingUser) {
        throw new Error('An account with this email already exists.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    pendingRegistrations.set(email, { fullName, email, hashedPassword, otp, expires });
    
    setTimeout(() => {
        if (pendingRegistrations.has(email) && pendingRegistrations.get(email).otp === otp) {
            pendingRegistrations.delete(email);
        }
    }, 10 * 60 * 1000 + 1000);

    const emailBody = `Welcome to DiscoverArch!\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;
    await sendMail(email, 'Your DiscoverArch Verification Code', emailBody);

    return { message: 'OTP sent successfully.' };
};

const verifyAndCreateUser = async ({ email, otp }) => {
    const pendingUser = pendingRegistrations.get(email);

    if (!pendingUser) {
        throw new Error('No pending registration found or OTP expired. Please sign up again.');
    }
    if (pendingUser.otp !== otp) {
        throw new Error('Invalid OTP.');
    }

    let user;
    
    if (pendingUser.existingUser) {
        user = await findUserByEmail(email);
        if (!user) throw new Error('User not found. Please sign up again.');
        
        user.isVerified = true;
        await user.save();
    } else {
        const nameParts = pendingUser.fullName.trim().split(" ");
        user = await createUser({
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(" "),
            email: pendingUser.email,
            password: pendingUser.hashedPassword,
            isVerified: true,
        });
    }

    pendingRegistrations.delete(email);

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '3h' });
    return { token, email: user.email, role: user.role, userId: user._id };
};

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '3h' });
  return { 
    token, 
    email: user.email, 
    role: user.role, 
    userId: user._id,
    isVerified: user.isVerified
  };
};

const verifyExistingUser = async ({ email, otp }) => {
    const pendingUser = pendingRegistrations.get(email);

    if (!pendingUser) {
        throw new Error('No pending verification found or OTP expired. Please resend the code.');
    }
    if (pendingUser.otp !== otp) {
        throw new Error('Invalid OTP.');
    }

    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('User not found.');
    }
    if (user.isVerified) {
        throw new Error('This account is already verified.');
    }

    user.isVerified = true;
    await user.save();

    pendingRegistrations.delete(email);

    return { message: 'Account verified successfully!', user: { isVerified: user.isVerified } };
};

const editUserService = async (userId, userData) => {
    const user = await findUserById(userId);
    if (!user) throw new Error('User not found');
    delete userData.password;
    delete userData.role;
    const updatedUser = await editUserById(userId, userData);
    return updatedUser;
};

const forgotPassword = async (email) => {
    if (!process.env.FRONTEND_URL) {
        console.error("FATAL: FRONTEND_URL environment variable is not set.");
        throw new Error("Server configuration error prevents sending reset links.");
    }
    const user = await findUserByEmail(email);
    if (!user) {
        return;
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    const resetURL = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;
    const message = `You requested a password reset. Click this link to reset your password within 10 minutes:\n\n${resetURL}\n\nIf you did not request this, please ignore this email.`;
    await sendMail(user.email, 'Password Reset Link', message);
};

const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) throw new Error('Token is invalid or has expired.');
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
};

const fetchAllUsers = () => getAllUsers();
const fetchUserByEmail = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('User not found');
  return user;
};
const deleteUser = (id) => deleteUserById(id);
const verifyToken = (user) => {
  if (!user) throw new Error('Invalid token');
  return { id: user.id, email: user.email, role: user.role };
};
const updatePassword = async ({ email, currentPassword, newPassword }) => {
    const user = await findUserByEmail(email);
    if (!user) throw new Error('User not found');
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) throw new Error('Invalid current password');
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
};
const assignAdmin = async (email) => {
    const user = await findUserByEmail(email);
    if (!user) throw new Error('User not found');
    user.role = 'admin';
    await user.save();
    return user;
};

module.exports = {
  sendRegistrationOtp,
  verifyAndCreateUser,
  login,
  fetchAllUsers,
  fetchUserByEmail,
  deleteUser,
  editUserService,
  updatePassword,
  assignAdmin,
  verifyToken,
  forgotPassword,
  resetPassword,
  verifyExistingUser,
};

