const { createCourseService, getAllCoursesService,
   getCoursePriceByIdService ,deleteCourseService,updateCourseService,
  getCourseByIdService} = require("../service/courseService")

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


// get course by courseId
const getCourseByIdController = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await getCourseByIdService(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
  }

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


  // delete a course by courseId
const deleteCourseController = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await deleteCourseService(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
  }


// update a course by courseId
const updateCourseController = async (req, res) => {
    try {
        const { courseId } = req.params;
        console.log("🚀🚀🚀 ~ updateCourseController ~ courseId:", courseId)
        console.log("🚀🚀🚀 ~ updateCourseController ~ req.body:", req.body)

        const course = await updateCourseService(courseId, req.body);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error updating course', error: error.message });
    }
  }

module.exports = {
  getCoursePriceByIdController,
  getAllCoursesController, 
  createCourseController, 
  deleteCourseController,
  getCourseByIdController,
  updateCourseController};