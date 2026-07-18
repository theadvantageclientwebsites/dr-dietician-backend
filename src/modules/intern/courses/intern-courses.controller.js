const internCoursesService = require("./intern-courses.service");

const getAvailableCourses = async (req, res, next) => {
  try {
    const internId = req.user.userId || req.user.id;
    const data = await internCoursesService.getAvailableCourses(internId, req.query);
    res.status(200).json({ success: true, message: "Courses fetched successfully", data });
  } catch (error) { next(error); }
};

const enrollInCourse = async (req, res, next) => {
  try {
    const internId = req.user.userId || req.user.id;
    const data = await internCoursesService.enrollInCourse(internId, req.params.courseId);
    res.status(201).json({ success: true, message: "Enrolled in course successfully", data });
  } catch (error) { next(error); }
};

const getMyEnrollments = async (req, res, next) => {
  try {
    const internId = req.user.userId || req.user.id;
    const data = await internCoursesService.getMyEnrollments(internId, req.query);
    res.status(200).json({ success: true, message: "My enrollments fetched successfully", data });
  } catch (error) { next(error); }
};

const getCourseWithProgress = async (req, res, next) => {
  try {
    const internId = req.user.userId || req.user.id;
    const data = await internCoursesService.getCourseWithProgress(internId, req.params.courseId);
    res.status(200).json({ success: true, message: "Course progress fetched successfully", data });
  } catch (error) { next(error); }
};

const completeLesson = async (req, res, next) => {
  try {
    const internId = req.user.userId || req.user.id;
    const { courseId, lessonId } = req.params;
    const data = await internCoursesService.completeLesson(internId, courseId, lessonId);
    res.status(200).json({ success: true, message: "Lesson marked as completed", data });
  } catch (error) { next(error); }
};

const completeFinalTest = async (req, res, next) => {
  try {
    const internId = req.user.userId || req.user.id;
    const { passed } = req.body;
    if (passed === undefined) {
      return res.status(400).json({ success: false, message: "passed field is required (true/false)" });
    }
    const data = await internCoursesService.completeFinalTest(internId, req.params.courseId, passed);
    res.status(200).json({ success: true, message: `Final test ${passed ? "passed" : "failed"}`, data });
  } catch (error) { next(error); }
};

module.exports = {
  getAvailableCourses,
  enrollInCourse,
  getMyEnrollments,
  getCourseWithProgress,
  completeLesson,
  completeFinalTest,
};
