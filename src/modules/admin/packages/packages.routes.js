const express = require("express");
const packagesController = require("./packages.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

const router = express.Router();

// POST /api/admin/packages
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  packagesController.createPackage
);

// GET /api/admin/packages
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  packagesController.getPackages
);

// GET /api/admin/packages/:id
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  packagesController.getPackageById
);

// PUT /api/admin/packages/:id
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  packagesController.updatePackage
);

// PATCH /api/admin/packages/:id/status
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  packagesController.togglePackageStatus
);

// DELETE /api/admin/packages/:id
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  packagesController.deletePackage
);

module.exports = router;
