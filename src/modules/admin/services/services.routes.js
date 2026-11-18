const express = require("express");
const servicesController = require("./services.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, servicesController.createService);
router.get("/", authMiddleware, adminMiddleware, servicesController.getServices);
router.get("/bookings", authMiddleware, adminMiddleware, servicesController.getBookings);
router.get("/bookings/:id", authMiddleware, adminMiddleware, servicesController.getBookingById);
router.patch(
  "/bookings/:id/assign-doctor",
  authMiddleware,
  adminMiddleware,
  servicesController.assignDoctor
);
router.get("/:id", authMiddleware, adminMiddleware, servicesController.getServiceById);
router.put("/:id", authMiddleware, adminMiddleware, servicesController.updateService);
router.patch("/:id/status", authMiddleware, adminMiddleware, servicesController.toggleServiceStatus);
router.delete("/:id", authMiddleware, adminMiddleware, servicesController.deleteService);

module.exports = router;
