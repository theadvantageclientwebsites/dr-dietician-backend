const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const uploadRoutes = require("../modules/upload/upload.routes");
const adminRoutes = require("../modules/admin/admin.routes");
const internCoursesRoutes = require("../modules/intern/courses/intern-courses.routes");
const patientRoutes = require("../modules/patient/patient.routes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running fine",
  });
});

router.use("/auth", authRoutes);
router.use("/upload", uploadRoutes);
router.use("/admin", adminRoutes);
router.use("/intern/courses", internCoursesRoutes);
router.use("/patient", patientRoutes);

module.exports = router;