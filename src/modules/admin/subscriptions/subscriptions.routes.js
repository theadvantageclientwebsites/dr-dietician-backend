const express = require("express");
const subscriptionsController = require("./subscriptions.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, subscriptionsController.getSubscriptions);
router.get("/:id", authMiddleware, adminMiddleware, subscriptionsController.getSubscriptionById);
router.patch("/:id/assign-doctor", authMiddleware, adminMiddleware, subscriptionsController.assignDoctor);

module.exports = router;
