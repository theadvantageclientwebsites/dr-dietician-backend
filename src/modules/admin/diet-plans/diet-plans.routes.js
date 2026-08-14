const express = require("express");
const dietPlansController = require("./diet-plans.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, dietPlansController.getDietPlans);
router.get("/:id", authMiddleware, adminMiddleware, dietPlansController.getDietPlanById);
router.patch("/:id/approve", authMiddleware, adminMiddleware, dietPlansController.approveDietPlan);
router.patch("/:id/reject", authMiddleware, adminMiddleware, dietPlansController.rejectDietPlan);

module.exports = router;
