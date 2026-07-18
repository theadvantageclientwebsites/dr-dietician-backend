const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const patientMiddleware = require("../../middlewares/patient.middleware");
const { getPatientDashboard } = require("./dashboard/patient-dashboard.controller");
const { getProfile, updateProfile } = require("./profile/patient-profile.controller");
const {
  getMyAppointments,
  getAppointmentById,
  bookAppointment,
  cancelAppointment,
  getAvailableDoctors,
} = require("./appointments/patient-appointments.controller");

const router = express.Router();

// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get("/dashboard", authMiddleware, patientMiddleware, getPatientDashboard);

// ─── Profile ──────────────────────────────────────────────────────────────────
router.get("/profile", authMiddleware, patientMiddleware, getProfile);
router.put("/profile", authMiddleware, patientMiddleware, updateProfile);

// ─── Appointments ─────────────────────────────────────────────────────────────

// GET  /api/patient/appointments/doctors  - Browse doctors before booking
router.get("/appointments/doctors", authMiddleware, patientMiddleware, getAvailableDoctors);

// GET  /api/patient/appointments          - My all appointments
router.get("/appointments", authMiddleware, patientMiddleware, getMyAppointments);

// POST /api/patient/appointments          - Book new appointment
router.post("/appointments", authMiddleware, patientMiddleware, bookAppointment);

// GET  /api/patient/appointments/:id      - Single appointment detail
router.get("/appointments/:id", authMiddleware, patientMiddleware, getAppointmentById);

// PATCH /api/patient/appointments/:id/cancel - Cancel appointment
router.patch("/appointments/:id/cancel", authMiddleware, patientMiddleware, cancelAppointment);

module.exports = router;
