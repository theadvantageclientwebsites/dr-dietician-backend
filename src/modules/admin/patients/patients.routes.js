const express = require("express");
const patientsController = require("./patients.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

const router = express.Router();

// POST /api/admin/patients (Create new patient)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  patientsController.createPatient
);

// GET /api/admin/patients
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  patientsController.getPatients
);

// GET /api/admin/patients/:id
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  patientsController.getPatientById
);

// PUT /api/admin/patients/:id
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  patientsController.updatePatient
);

// DELETE /api/admin/patients/:id
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  patientsController.deletePatient
);

module.exports = router;
