const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:category', productController.getProductsByCategory);

// Admin-only routes
router.post('/', authMiddleware, productController.createProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;