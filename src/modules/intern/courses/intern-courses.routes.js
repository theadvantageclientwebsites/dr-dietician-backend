const express = require("express");
const internCoursesController = require("./intern-courses.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const internMiddleware = require("../../../middlewares/intern.middleware");

const router = express.Router();

// GET    /api/intern/courses                         - Browse available courses
router.get("/", authMiddleware, internMiddleware, internCoursesController.getAvailableCourses);

// GET    /api/intern/courses/my-enrollments          - My enrolled courses
router.get("/my-enrollments", authMiddleware, internMiddleware, internCoursesController.getMyEnrollments);

// POST   /api/intern/courses/:courseId/enroll        - Enroll in a course
router.post("/:courseId/enroll", authMiddleware, internMiddleware, internCoursesController.enrollInCourse);

// GET    /api/intern/courses/:courseId/progress      - Get course with my progress
router.get("/:courseId/progress", authMiddleware, internMiddleware, internCoursesController.getCourseWithProgress);

// PATCH  /api/intern/courses/:courseId/lessons/:lessonId/complete  - Mark lesson done
router.patch("/:courseId/lessons/:lessonId/complete", authMiddleware, internMiddleware, internCoursesController.completeLesson);

// PATCH  /api/intern/courses/:courseId/final-test    - Submit final test result
router.patch("/:courseId/final-test", authMiddleware, internMiddleware, internCoursesController.completeFinalTest);

module.exports = router;
