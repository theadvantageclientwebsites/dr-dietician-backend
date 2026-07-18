const express = require("express");
const coursesController = require("./courses.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

const router = express.Router();

// ─── Course Routes ────────────────────────────────────────────────────────────

// POST   /api/admin/courses
router.post("/", authMiddleware, adminMiddleware, coursesController.createCourse);

// GET    /api/admin/courses
router.get("/", authMiddleware, adminMiddleware, coursesController.getCourses);

// GET    /api/admin/courses/:id
router.get("/:id", authMiddleware, adminMiddleware, coursesController.getCourseById);

// PUT    /api/admin/courses/:id
router.put("/:id", authMiddleware, adminMiddleware, coursesController.updateCourse);

// DELETE /api/admin/courses/:id
router.delete("/:id", authMiddleware, adminMiddleware, coursesController.deleteCourse);

// ─── Lesson Routes ────────────────────────────────────────────────────────────

// POST   /api/admin/courses/:courseId/lessons
router.post("/:courseId/lessons", authMiddleware, adminMiddleware, coursesController.addLesson);

// PUT    /api/admin/courses/lessons/:lessonId
router.put("/lessons/:lessonId", authMiddleware, adminMiddleware, coursesController.updateLesson);

// DELETE /api/admin/courses/lessons/:lessonId
router.delete("/lessons/:lessonId", authMiddleware, adminMiddleware, coursesController.deleteLesson);

// ─── Enrollment Overview ──────────────────────────────────────────────────────

// GET    /api/admin/courses/:courseId/enrollments
router.get("/:courseId/enrollments", authMiddleware, adminMiddleware, coursesController.getCourseEnrollments);

module.exports = router;
