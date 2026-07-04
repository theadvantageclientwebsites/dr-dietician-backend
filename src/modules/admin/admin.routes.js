const express = require("express");
const adminController = require("./admin.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const adminMiddleware = require("../../middlewares/admin.middleware");

// Import sub-module routes
const patientsRoutes = require("./patients/patients.routes");
const internsRoutes = require("./interns/interns.routes");
const doctorsRoutes = require("./doctors/doctors.routes");

const router = express.Router();

router.get(
  "/dashboard/summary",
  authMiddleware,
  adminMiddleware,
  adminController.getDashboardSummary
);

// Use patient routes - all routes under /api/admin/patients
router.use("/patients", patientsRoutes);

// Use intern routes - all routes under /api/admin/interns
router.use("/interns", internsRoutes);

// Use doctor routes - all routes under /api/admin/doctors
router.use("/doctors", doctorsRoutes);

router.get(
  "/appointments",
  authMiddleware,
  adminMiddleware,
  adminController.getAppointments
);

module.exports = router;