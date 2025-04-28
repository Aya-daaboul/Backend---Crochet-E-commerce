const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public routes
router.get("/category/:category", productController.getProductsByCategory);
router.get("/:id", productController.getProductById);
router.get("/", productController.getAllProducts);

// Admin-only routes
router.post("/", authMiddleware, productController.createProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
