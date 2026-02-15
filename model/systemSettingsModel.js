const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    registrationOpen: {
        type: Boolean,
        default: false
    },
    votingOpen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Ensure only one document exists
systemSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({ registrationOpen: false, votingOpen: false });
    }
    return settings;
};

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
