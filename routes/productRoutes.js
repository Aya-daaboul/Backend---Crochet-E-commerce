const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");

// Public routes
router.get("/category/:category", productController.getProductsByCategory);
router.get("/:id", productController.getProductById);
router.get("/", productController.getAllProducts);

// Admin-only routes
router.post(
  "/",
  authMiddleware,
  authorize("admin"),
  productController.createProduct
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  productController.deleteProduct
);

module.exports = router;
