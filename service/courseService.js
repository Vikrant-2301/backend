// services/productService.js
const { createCourse, getAllCourses, getCoursePriceById,deleteCourse,updateCourse,
  getCourseById
 } = require("../repo/courseRepo")
const getAllCoursesService = async () => {
  return await getAllCourses();
};

const getCoursePriceByIdService = async (courseName) => {
  return await getCoursePriceById(courseName);
};
const createCourseService = async (courseData) => {
    return await createCourse(courseData);
  };

// get course by courseId
const getCourseByIdService = async (courseId) => {
    return await getCourseById(courseId);
    }


  // delete a course by courseId
const deleteCourseService = async (courseId) => {
    return await deleteCourse(courseId);
    }

// update a course by courseId
const updateCourseService = async (courseId, courseData) => {
    return await updateCourse(courseId, courseData);
}




module.exports = {
  getAllCoursesService,
  getCoursePriceByIdService,
  createCourseService,
  deleteCourseService,
  updateCourseService,
  getCourseByIdService
};
