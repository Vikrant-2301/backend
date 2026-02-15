const SystemSettings = require('../model/systemSettingsModel');

exports.getSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.getSettings();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch settings", error: error.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { registrationOpen, votingOpen } = req.body;

        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings();
        }

        if (registrationOpen !== undefined) settings.registrationOpen = registrationOpen;
        if (votingOpen !== undefined) settings.votingOpen = votingOpen;

        const updatedSettings = await settings.save();
        res.status(200).json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: "Failed to update settings", error: error.message });
    }
};
