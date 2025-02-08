const express = require('express');
const {
    signupController,
    loginController,
    getAllUsersController,
    getUserByEmailController,
    deleteUserByIdController,
    editUserController
} = require('../controller/authController');

const router = express.Router();

router.put('/edit/users', editUserController);
router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/users', getAllUsersController);
router.get('/users/:email', getUserByEmailController); 
router.delete('/users/:id', deleteUserByIdController);

module.exports = router;
