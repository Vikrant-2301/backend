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

// get course by courseId
const getCourseById = async (courseId) => {
    return await Course.findOne({ courseId });
    }



// delete a course by courseId
const deleteCourse = async (courseId) => {
    return await Course.findOneAndDelete({ courseId });
    }


// update a course by courseId
const updateCourse = async (courseId, courseData) => {
    return await Course.findOneAndUpdate({ courseId }, courseData, { new: true });
}




module.exports = {getCoursePriceById,createCourse,getAllCourses,deleteCourse,updateCourse
    ,getCourseById
};