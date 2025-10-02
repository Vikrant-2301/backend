const competitionRepo = require('../repo/competitionRepo');

const createCompetition = async (data) => competitionRepo.create(data);
const getAllCompetitions = async () => competitionRepo.findAll();
const getCompetitionById = async (id) => competitionRepo.findById(id);
const updateCompetition = async (id, data) => competitionRepo.update(id, data);
const deleteCompetition = async (id) => competitionRepo.remove(id);

const getUserCompetitions = async (userId) => {
    const user = await competitionRepo.findUserById(userId);
    if (!user) throw new Error('User not found');
    return user.registeredCompetitions;
};

const registerForCompetition = async (userId, competitionId) => {
    const competition = await competitionRepo.findById(competitionId);
    if (!competition) throw new Error('Competition not found');
    
    const user = await competitionRepo.findUserById(userId);
    if (user.registeredCompetitions.some(comp => comp._id.equals(competitionId))) {
        // This prevents errors, but you could also throw an error
        // throw new Error('User already registered for this competition');
        return user; // Silently fail if already registered
    }

    return competitionRepo.registerUserForCompetition(userId, competitionId);
};


module.exports = { 
    createCompetition, 
    getAllCompetitions, 
    getCompetitionById, 
    updateCompetition, 
    deleteCompetition, 
    getUserCompetitions,
    registerForCompetition
};
