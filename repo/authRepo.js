// repo/authRepo.js
const User = require('../model/authModel');

const findUserByEmail = async (email) => User.findOne({ email: email });
// --- NEW: Find by username ---
const findUserByUsername = async (username) => User.findOne({ username: username });

const createUser = async (userData) => new User(userData).save();
const getAllUsers = async () => User.find({});
const getUserByEmail = async (email) => User.findOne({ email });
const deleteUserById = async (_id) => User.findByIdAndDelete(_id);
const findUserById = async (_id) => User.findById(_id);
const editUserById = async (_id, userData) => User.findByIdAndUpdate(_id, userData, { new: true });

module.exports = { 
    editUserById, 
    findUserByEmail, 
    findUserByUsername, // Export the new function
    createUser, 
    getAllUsers, 
    getUserByEmail, 
    deleteUserById, 
    findUserById 
};