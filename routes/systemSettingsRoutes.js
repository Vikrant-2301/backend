const express = require('express');
const router = express.Router();
const systemSettingsController = require('../controller/systemSettingsController');

router.get('/', systemSettingsController.getSettings);
router.put('/', systemSettingsController.updateSettings);

module.exports = router;
