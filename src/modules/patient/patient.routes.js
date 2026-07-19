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
const { getPackages, getPackageById } = require("./packages/patient-packages.controller");
const { getDigitalProducts, getDigitalProductById } = require("./digital-products/patient-digital-products.controller");
const { createOrder, verifyPayment, getMyOrders } = require("./payments/payments.controller");

const router = express.Router();

// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get("/dashboard", authMiddleware, patientMiddleware, getPatientDashboard);

// ─── Profile ──────────────────────────────────────────────────────────────────
router.get("/profile", authMiddleware, patientMiddleware, getProfile);
router.put("/profile", authMiddleware, patientMiddleware, updateProfile);

// ─── Appointments ─────────────────────────────────────────────────────────────
router.get("/appointments/doctors", authMiddleware, patientMiddleware, getAvailableDoctors);
router.get("/appointments", authMiddleware, patientMiddleware, getMyAppointments);
router.post("/appointments", authMiddleware, patientMiddleware, bookAppointment);
router.get("/appointments/:id", authMiddleware, patientMiddleware, getAppointmentById);
router.patch("/appointments/:id/cancel", authMiddleware, patientMiddleware, cancelAppointment);

// ─── Packages ─────────────────────────────────────────────────────────────────
router.get("/packages", authMiddleware, patientMiddleware, getPackages);
router.get("/packages/:id", authMiddleware, patientMiddleware, getPackageById);

// ─── Digital Products ─────────────────────────────────────────────────────────
router.get("/digital-products", authMiddleware, patientMiddleware, getDigitalProducts);
router.get("/digital-products/:id", authMiddleware, patientMiddleware, getDigitalProductById);

// ─── Payments ─────────────────────────────────────────────────────────────────
router.post("/payments/create-order", authMiddleware, patientMiddleware, createOrder);
router.post("/payments/verify", authMiddleware, patientMiddleware, verifyPayment);
router.get("/payments/my-orders", authMiddleware, patientMiddleware, getMyOrders);

module.exports = router;
