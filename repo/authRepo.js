const User = require('../model/authModel');

const findUserByEmail = async (email) => User.findOne({ email });
const createUser = async (userData) => new User(userData).save();
const getAllUsers = async () => User.find({});
const getUserByEmail = async (email) => User.findOne({ email });
const deleteUserById = async (_id) => User.findByIdAndDelete(_id);

module.exports = { findUserByEmail, createUser, getAllUsers, getUserByEmail,deleteUserById };

