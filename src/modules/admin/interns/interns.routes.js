const express = require("express");
const internsController = require("./interns.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

const router = express.Router();

// GET /api/admin/interns/summary
router.get(
  "/summary",
  authMiddleware,
  adminMiddleware,
  internsController.getInternsSummary
);

// POST /api/admin/interns (Create new intern)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  internsController.createIntern
);

// GET /api/admin/interns
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  internsController.getInterns
);

// GET /api/admin/interns/:id
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  internsController.getInternById
);

// PUT /api/admin/interns/:id
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  internsController.updateIntern
);

// DELETE /api/admin/interns/:id
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  internsController.deleteIntern
);

module.exports = router;
