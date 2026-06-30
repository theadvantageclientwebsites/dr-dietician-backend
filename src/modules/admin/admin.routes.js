const express = require("express");
const adminController = require("./admin.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const adminMiddleware = require("../../middlewares/admin.middleware");

const router = express.Router();

router.get(
  "/dashboard/summary",
  authMiddleware,
  adminMiddleware,
  adminController.getDashboardSummary
);

router.get(
  "/doctors",
  authMiddleware,
  adminMiddleware,
  adminController.getDoctors
);

router.patch(
  "/doctors/:id/approve",
  authMiddleware,
  adminMiddleware,
  adminController.approveDoctor
);

router.get(
  "/patients",
  authMiddleware,
  adminMiddleware,
  adminController.getPatients
);

router.get(
  "/interns",
  authMiddleware,
  adminMiddleware,
  adminController.getInterns
);

module.exports = router;