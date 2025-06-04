const express = require('express');
const {
    signupController,
    loginController,
    getAllUsersController,
    getUserByEmailController,
    deleteUserByIdController,
    editUserController
} = require('../controller/authController');

const upload = require('../middleware/upload.middleware'); // import upload middleware

const router = express.Router();

// Use multer middleware to handle single file upload for 'profilePic' field in PUT request
router.put('/edit/users', upload.single('profilePic'), editUserController);

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/users', getAllUsersController);
router.get('/users/:email', getUserByEmailController); 
router.delete('/users/:id', deleteUserByIdController);

module.exports = router;
