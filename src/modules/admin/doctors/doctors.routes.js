const express = require("express");
const doctorsController = require("./doctors.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

const router = express.Router();

// POST /api/admin/doctors (Create new doctor)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  doctorsController.createDoctor
);

// GET /api/admin/doctors (List all doctors with filters)
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  doctorsController.getDoctors
);

// GET /api/admin/doctors/:id (Get single doctor)
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  doctorsController.getDoctorById
);

// PUT /api/admin/doctors/:id (Update doctor)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  doctorsController.updateDoctor
);

// PATCH /api/admin/doctors/:id/status (Enable/Disable doctor)
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  doctorsController.updateDoctorStatus
);

// PATCH /api/admin/doctors/:id/approve (Approve doctor)
router.patch(
  "/:id/approve",
  authMiddleware,
  adminMiddleware,
  doctorsController.approveDoctor
);

// DELETE /api/admin/doctors/:id (Delete doctor)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  doctorsController.deleteDoctor
);

module.exports = router;
