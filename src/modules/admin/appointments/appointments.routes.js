const express = require("express");
const appointmentsController = require("./appointments.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

const router = express.Router();

// GET /api/admin/appointments/summary
router.get(
  "/summary",
  authMiddleware,
  adminMiddleware,
  appointmentsController.getAppointmentsSummary
);

// GET /api/admin/appointments
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  appointmentsController.getAppointments
);

// GET /api/admin/appointments/:id
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  appointmentsController.getAppointmentById
);

// PATCH /api/admin/appointments/:id/status
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  appointmentsController.updateAppointmentStatus
);

// DELETE /api/admin/appointments/:id
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  appointmentsController.deleteAppointment
);

module.exports = router;
