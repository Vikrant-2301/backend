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
  editUserById,
  findUserByUsername
} = require('../repo/authRepo');
const User = require('../model/authModel');
const Blog = require('../model/Blog');
const Otp = require('../model/Otp'); // Requires creating model/Otp.js

const sendRegistrationOtp = async ({ fullName, email, password }) => {
    const existingUser = await findUserByEmail(email);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Scenario 1: Resend verification for existing unverified user
    if (existingUser && !fullName && !password) {
        if (existingUser.isVerified) {
            throw new Error('This account is already verified.');
        }
        
        // Create or update OTP record in MongoDB
        await Otp.findOneAndUpdate(
            { email },
            { otp: otpCode, createdAt: new Date() }, // Reset expiry
            { upsert: true, new: true }
        );

        const emailBody = `Welcome back to DiscoverArch!\n\nYour verification code is: ${otpCode}\n\nThis code will expire in 10 minutes.`;
        await sendMail(email, 'Resend Verification Code [DiscoverArch]', emailBody);

        return { message: 'OTP sent successfully.' };
    }
    
    // Scenario 2: New User Registration
    if (existingUser) {
        throw new Error('An account with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save registration data + OTP to MongoDB
    await Otp.findOneAndUpdate(
        { email },
        { 
            otp: otpCode, 
            fullName, 
            hashedPassword,
            createdAt: new Date() 
        },
        { upsert: true, new: true }
    );

    const emailBody = `Welcome to DiscoverArch!\n\nYour verification code is: ${otpCode}\n\nThis code will expire in 10 minutes.`;
    await sendMail(email, 'Your DiscoverArch Verification Code', emailBody);

    return { message: 'OTP sent successfully.' };
};

const verifyAndCreateUser = async ({ email, otp }) => {
    // Fetch OTP record from MongoDB
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
        throw new Error('No pending registration found or OTP expired. Please sign up again.');
    }
    if (otpRecord.otp !== otp) {
        throw new Error('Invalid OTP.');
    }

    let user = await findUserByEmail(email);
    let tokenData = {};

    // Case A: Verifying existing user
    if (user) {
        user.isVerified = true;
        await user.save();
        tokenData = { id: user._id, email: user.email, role: user.role };
    } 
    // Case B: Creating new user from OTP record data
    else if (otpRecord.fullName && otpRecord.hashedPassword) {
        const nameParts = otpRecord.fullName.trim().split(" ");
        user = await createUser({
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(" "),
            email: otpRecord.email,
            password: otpRecord.hashedPassword,
            isVerified: true,
        });
        tokenData = { id: user._id, email: user.email, role: user.role };
    } else {
        throw new Error('Registration data missing. Please sign up again.');
    }

    // Clean up used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    const token = jwt.sign(tokenData, jwtSecret, { expiresIn: '3h' });
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

const editUserService = async (userId, userData) => {
    const user = await findUserById(userId);
    if (!user) throw new Error('User not found');
    
    if (userData.username && userData.username !== user.username) {
        const newUsername = userData.username.trim().toLowerCase();
        const now = new Date();

        const existingUser = await findUserByUsername(newUsername);
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            throw new Error('Username is already taken.');
        }

        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
        const recentChanges = user.usernameHistory.filter(h => h.changedAt > thirtyMinutesAgo);
        if (recentChanges.length >= 5) {
            throw new Error('You have changed your username too many times recently. Please try again in 30 minutes.');
        }

        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const previousUse = user.usernameHistory.find(h => 
            h.username === newUsername && h.changedAt > fourteenDaysAgo
        );

        if (previousUse) {
            throw new Error('You cannot switch back to a recently used username for 14 days.');
        }

        const history = user.usernameHistory || [];
        userData.usernameHistory = [...history, { username: user.username, changedAt: now }];
    }
    
    const allowedUpdates = {
        username: userData.username,
        usernameHistory: userData.usernameHistory,
        firstName: userData.firstName,
        lastName: userData.lastName,
        professionalTitle: userData.professionalTitle,
        currentLocation: userData.currentLocation,
        phoneNumber: userData.phoneNumber,
        yearOfGraduation: userData.yearOfGraduation,
        nameOfOrganisation: userData.nameOfOrganisation,
        bio: userData.bio,
        bannerUrl: userData.bannerUrl,
        avatarUrl: userData.avatarUrl,
        portfolioLink: userData.portfolioLink,
        socialLinks: userData.socialLinks,
        skills: userData.skills,
        languages: userData.languages,
        interests: userData.interests,
        workExperience: userData.workExperience,
        education: userData.education,
        projects: userData.projects
    };

    Object.keys(allowedUpdates).forEach(key => 
      allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const updatedUser = await editUserById(userId, allowedUpdates);
    return updatedUser;
};

const forgotPassword = async (email) => {
    const user = await findUserByEmail(email);
    if (!user) {
        console.log(`Password reset for non-existent user: ${email}`);
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

const setUserRole = async (targetUserId, newRole) => {
    // UPDATED: Allow 'member' in the validation array
    if (!['admin', 'user', 'member'].includes(newRole)) {
        throw new Error('Invalid role specified.');
    }
    const user = await findUserById(targetUserId);
    if (!user) throw new Error('User not found');
    user.role = newRole;
    await user.save();
    return user;
};

const getPublicProfileById = async (identifier) => {
    const mongoose = require('mongoose');
    const isId = mongoose.Types.ObjectId.isValid(identifier);
    const selectFields = 'firstName lastName username email professionalTitle bio portfolioLink socialLinks nameOfOrganisation createdAt avatarUrl bannerUrl projects workExperience education skills languages interests currentLocation yearOfGraduation isVerified';
    let user;
    if (isId) {
        user = await findUserById(identifier).select(selectFields);
    } else {
        user = await User.findOne({ username: identifier }).select(selectFields);
    }
    if (!user) throw new Error('User not found');
    return user;
};

const toggleFavoriteBlog = async (userId, blogId) => {
    const user = await findUserById(userId);
    if (!user) throw new Error('User not found');
    const blog = await Blog.findById(blogId);
    if (!blog) throw new Error('Blog post not found');
    const isSaved = user.savedBlogPosts.includes(blogId);
    if (isSaved) {
        user.savedBlogPosts.pull(blogId);
    } else {
        user.savedBlogPosts.push(blogId);
    }
    await user.save();
    return user.savedBlogPosts;
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
  setUserRole,
  getPublicProfileById, 
  toggleFavoriteBlog,
};