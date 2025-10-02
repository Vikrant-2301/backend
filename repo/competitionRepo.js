const Competition = require('../model/Competition');
const User = require('../model/authModel');

// Admin functions
const create = async (data) => new Competition(data).save();
const findAll = async () => Competition.find().sort({ startDate: -1 });
const findById = async (id) => Competition.findById(id);
const update = async (id, data) => Competition.findByIdAndUpdate(id, data, { new: true });
const remove = async (id) => Competition.findByIdAndDelete(id);

// User functions
const findUserById = async (userId) => User.findById(userId).populate('registeredCompetitions');
const registerUserForCompetition = async (userId, competitionId) => {
    await User.findByIdAndUpdate(userId, { $addToSet: { registeredCompetitions: competitionId } });
    return User.findById(userId).populate('registeredCompetitions');
};

module.exports = { create, findAll, findById, update, remove, findUserById, registerUserForCompetition };
