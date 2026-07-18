const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const patientMiddleware = require("../../middlewares/patient.middleware");
const { getPatientDashboard } = require("./dashboard/patient-dashboard.controller");
const { getProfile, updateProfile } = require("./profile/patient-profile.controller");

const router = express.Router();

// GET /api/patient/dashboard
router.get(
  "/dashboard",
  authMiddleware,
  patientMiddleware,
  getPatientDashboard
);

// GET /api/patient/profile
router.get(
  "/profile",
  authMiddleware,
  patientMiddleware,
  getProfile
);

// PUT /api/patient/profile
router.put(
  "/profile",
  authMiddleware,
  patientMiddleware,
  updateProfile
);

module.exports = router;
