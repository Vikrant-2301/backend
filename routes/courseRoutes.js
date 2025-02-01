const express = require('express');
const {createCourseController,getCoursePriceByIdController,getAllCoursesController
    ,deleteCourseController,updateCourseController,getCourseByIdController
} = require('../controller/courseController');
// const roleMiddleware = require('../middleware/access.middleware');

const router = express.Router();

router.get('/all',getAllCoursesController);
router.post('/upload',createCourseController);
// router.get('/all',roleMiddleware('admin'),getAllCoursesController);
router.get('/name/:courseName',getCoursePriceByIdController)
router.get('/get/:courseId',getCourseByIdController);

router.delete('/delete/:courseId',deleteCourseController);
router.put('/update/:courseId',updateCourseController);





module.exports = router;