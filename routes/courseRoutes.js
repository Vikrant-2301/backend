const express = require('express');
const {createCourseController,getCoursePriceByIdController,getAllCoursesController} = require('../controller/courseController');
const roleMiddleware = require('../middleware/access.middleware');

const router = express.Router();

router.post('/upload',createCourseController);
router.get('/all',roleMiddleware('admin'),getAllCoursesController);
router.get('/name/:courseName',getCoursePriceByIdController)

module.exports = router;