const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const doctorMiddleware = require("../../middlewares/doctor.middleware");

const { getDashboard } = require("./dashboard/doctor-dashboard.controller");
const { getMyAppointments, getAppointmentById, updateAppointmentStatus } = require("./appointments/doctor-appointments.controller");
const { getMyPatients, getPatientById } = require("./patients/doctor-patients.controller");
const { getProfile, updateProfile } = require("./profile/doctor-profile.controller");
const { uploadBloodReport, getBloodReports, getBloodReportById, updateBloodReport, deleteBloodReport } = require("./blood-reports/blood-reports.controller");

const router = express.Router();

// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get("/dashboard", authMiddleware, doctorMiddleware, getDashboard);

// ─── Profile ─────────────────────────────────────────────────────────────────
router.get("/profile", authMiddleware, doctorMiddleware, getProfile);
router.put("/profile", authMiddleware, doctorMiddleware, updateProfile);

// ─── Appointments ─────────────────────────────────────────────────────────────
router.get("/appointments", authMiddleware, doctorMiddleware, getMyAppointments);
router.get("/appointments/:id", authMiddleware, doctorMiddleware, getAppointmentById);
router.patch("/appointments/:id/status", authMiddleware, doctorMiddleware, updateAppointmentStatus);

// ─── Patients ─────────────────────────────────────────────────────────────────
router.get("/patients", authMiddleware, doctorMiddleware, getMyPatients);
router.get("/patients/:id", authMiddleware, doctorMiddleware, getPatientById);

// ─── Blood Reports ────────────────────────────────────────────────────────────
router.post("/blood-reports", authMiddleware, doctorMiddleware, uploadBloodReport);
router.get("/blood-reports", authMiddleware, doctorMiddleware, getBloodReports);
router.get("/blood-reports/:id", authMiddleware, doctorMiddleware, getBloodReportById);
router.put("/blood-reports/:id", authMiddleware, doctorMiddleware, updateBloodReport);
router.delete("/blood-reports/:id", authMiddleware, doctorMiddleware, deleteBloodReport);

module.exports = router;
