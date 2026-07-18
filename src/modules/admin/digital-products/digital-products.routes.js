const express = require("express");
const digitalProductsController = require("./digital-products.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

const router = express.Router();

// POST /api/admin/digital-products
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  digitalProductsController.createDigitalProduct
);

// GET /api/admin/digital-products
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  digitalProductsController.getDigitalProducts
);

// GET /api/admin/digital-products/:id
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  digitalProductsController.getDigitalProductById
);

// PUT /api/admin/digital-products/:id
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  digitalProductsController.updateDigitalProduct
);

// PATCH /api/admin/digital-products/:id/status
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  digitalProductsController.updateProductStatus
);

// DELETE /api/admin/digital-products/:id
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  digitalProductsController.deleteDigitalProduct
);

module.exports = router;
