const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const doctorMiddleware = require("../../middlewares/doctor.middleware");

const { getDashboard } = require("./dashboard/doctor-dashboard.controller");
const { getMyAppointments, getAppointmentById, updateAppointmentStatus } = require("./appointments/doctor-appointments.controller");
const { getMyPatients, getPatientById } = require("./patients/doctor-patients.controller");

const router = express.Router();

// ─── Dashboard ────────────────────────────────────────────────────────────────
// GET /api/doctor/dashboard
router.get("/dashboard", authMiddleware, doctorMiddleware, getDashboard);

// ─── Appointments ─────────────────────────────────────────────────────────────
// GET /api/doctor/appointments
router.get("/appointments", authMiddleware, doctorMiddleware, getMyAppointments);

// GET /api/doctor/appointments/:id
router.get("/appointments/:id", authMiddleware, doctorMiddleware, getAppointmentById);

// PATCH /api/doctor/appointments/:id/status
router.patch("/appointments/:id/status", authMiddleware, doctorMiddleware, updateAppointmentStatus);

// ─── Patients ─────────────────────────────────────────────────────────────────
// GET /api/doctor/patients
router.get("/patients", authMiddleware, doctorMiddleware, getMyPatients);

// GET /api/doctor/patients/:id
router.get("/patients/:id", authMiddleware, doctorMiddleware, getPatientById);

module.exports = router;
