const Course = require("../model/courseModel")

const createCourse = async (courseData) => {
    const course = new Course(courseData);
    await course.save();
    return course;
};
const getAllCourses = async() => {
    return await Course.find();
};
const getCoursePriceById = async (courseName) => {
    return await Course.findOne({ courseName }).select('price');
  };
module.exports = {getCoursePriceById,createCourse,getAllCourses}