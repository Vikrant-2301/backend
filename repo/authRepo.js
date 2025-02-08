const User = require('../model/authModel');

const findUserByEmail = async (email) => User.findOne({ email });
const createUser = async (userData) => new User(userData).save();
const getAllUsers = async () => User.find({});
const getUserByEmail = async (email) => User.findOne({ email });
const deleteUserById = async (_id) => User.findByIdAndDelete(_id);
const findUserById = async (_id) => User.findById(_id);
const editUser = async (_id, userData) => User.findByIdAndUpdate(_id, userData, { new: true });

module.exports = { editUser,findUserByEmail, createUser, getAllUsers, getUserByEmail,deleteUserById ,findUserById};

