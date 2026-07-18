const coursesService = require("./courses.service");

// ─── Course Controllers ───────────────────────────────────────────────────────

const createCourse = async (req, res, next) => {
  try {
    const data = await coursesService.createCourse(req.body);
    res.status(201).json({ success: true, message: "Course created successfully", data });
  } catch (error) { next(error); }
};

const getCourses = async (req, res, next) => {
  try {
    const data = await coursesService.getCourses(req.query);
    res.status(200).json({ success: true, message: "Courses fetched successfully", data });
  } catch (error) { next(error); }
};

const getCourseById = async (req, res, next) => {
  try {
    const data = await coursesService.getCourseById(req.params.id);
    res.status(200).json({ success: true, message: "Course fetched successfully", data });
  } catch (error) { next(error); }
};

const updateCourse = async (req, res, next) => {
  try {
    const data = await coursesService.updateCourse(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Course updated successfully", data });
  } catch (error) { next(error); }
};

const deleteCourse = async (req, res, next) => {
  try {
    const data = await coursesService.deleteCourse(req.params.id);
    res.status(200).json({ success: true, message: "Course deleted successfully", data });
  } catch (error) { next(error); }
};

// ─── Lesson Controllers ───────────────────────────────────────────────────────

const addLesson = async (req, res, next) => {
  try {
    const data = await coursesService.addLesson(req.params.courseId, req.body);
    res.status(201).json({ success: true, message: "Lesson added successfully", data });
  } catch (error) { next(error); }
};

const updateLesson = async (req, res, next) => {
  try {
    const data = await coursesService.updateLesson(req.params.lessonId, req.body);
    res.status(200).json({ success: true, message: "Lesson updated successfully", data });
  } catch (error) { next(error); }
};

const deleteLesson = async (req, res, next) => {
  try {
    const data = await coursesService.deleteLesson(req.params.lessonId);
    res.status(200).json({ success: true, message: "Lesson deleted successfully", data });
  } catch (error) { next(error); }
};

// ─── Enrollment Controllers ───────────────────────────────────────────────────

const getCourseEnrollments = async (req, res, next) => {
  try {
    const data = await coursesService.getCourseEnrollments(req.params.courseId, req.query);
    res.status(200).json({ success: true, message: "Enrollments fetched successfully", data });
  } catch (error) { next(error); }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addLesson,
  updateLesson,
  deleteLesson,
  getCourseEnrollments,
};
