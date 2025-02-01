const express = require('express');
const {
    signupController,
    loginController,
    getAllUsersController,
    getUserByEmailController,
    deleteUserByIdController
} = require('../controller/authController');

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/users', getAllUsersController);
router.get('/users/:email', getUserByEmailController); 
router.delete('/users/:id', deleteUserByIdController);

module.exports = router;
