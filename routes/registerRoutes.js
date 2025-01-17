// routes/registrationRoutes.js
const express = require('express');
const router = express.Router();
const registrationController = require('../controller/registerController');

router.post('/create-team', registrationController.register);

module.exports = router;
