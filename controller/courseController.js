const { createCourseService, getAllCoursesService, getCoursePriceByIdService } = require("../service/courseService")

const createCourseController = async (req, res) => {
    try {
        const course = await createCourseService(req.body);
        res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllCoursesController = async (req, res) => {
    try {
        const courses = await getAllCoursesService();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getCoursePriceByIdController = async (req, res) => {
    try {
      const { courseName } = req.params;
      const price = await getCoursePriceByIdService(courseName);
  
      if (!price) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      res.status(200).json(price);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
  };
module.exports = {getCoursePriceByIdController,getAllCoursesController, createCourseController};