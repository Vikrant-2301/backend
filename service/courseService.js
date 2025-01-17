// services/productService.js
const { createCourse, getAllCourses, getCoursePriceById } = require("../repo/courseRepo")
const getAllCoursesService = async () => {
  return await getAllCourses();
};

const getCoursePriceByIdService = async (courseName) => {
  return await getCoursePriceById(courseName);
};
const createCourseService = async (courseData) => {
    // You can add validation or transformation logic here if needed
    return await createCourse(courseData);
  };
module.exports = {
  getAllCoursesService,
  getCoursePriceByIdService,
  createCourseService,
};
