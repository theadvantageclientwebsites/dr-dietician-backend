const express = require("express");
const revenueController = require("./revenue.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

const router = express.Router();

// GET /api/admin/revenue/summary
router.get("/summary", authMiddleware, adminMiddleware, revenueController.getRevenueSummary);

// GET /api/admin/revenue/orders
router.get("/orders", authMiddleware, adminMiddleware, revenueController.getAllOrders);

module.exports = router;
