const competitionService = require('../service/competitionService');

const createCompetition = async (req, res) => {
    try {
        const competition = await competitionService.createCompetition(req.body);
        res.status(201).json(competition);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllCompetitions = async (req, res) => {
    try {
        const competitions = await competitionService.getAllCompetitions();
        res.status(200).json(competitions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCompetitionById = async (req, res) => {
    try {
        const competition = await competitionService.getCompetitionById(req.params.id);
        if (!competition) return res.status(404).json({ error: 'Competition not found' });
        res.status(200).json(competition);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCompetition = async (req, res) => {
    try {
        const competition = await competitionService.updateCompetition(req.params.id, req.body);
        if (!competition) return res.status(404).json({ error: 'Competition not found' });
        res.status(200).json(competition);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteCompetition = async (req, res) => {
    try {
        const competition = await competitionService.deleteCompetition(req.params.id);
        if (!competition) return res.status(404).json({ error: 'Competition not found' });
        res.status(200).json({ message: 'Competition deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserCompetitions = async (req, res) => {
    try {
        // req.user.id should be available from the auth middleware
        const competitions = await competitionService.getUserCompetitions(req.user.id);
        res.status(200).json(competitions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const registerForCompetition = async (req, res) => {
    try {
        const { id: competitionId } = req.params;
        const { id: userId } = req.user; // from auth middleware
        const updatedUser = await competitionService.registerForCompetition(userId, competitionId);
        res.status(200).json({ message: 'Successfully registered!', data: updatedUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
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
