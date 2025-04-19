const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/add', authenticate, orderController.addToCart);
router.get('/cart', authenticate, orderController.getCart);
router.post('/confirm', authenticate, orderController.confirmOrder);
router.post('/cancel', authenticate, orderController.cancelOrder);
router.get('/history', authenticate, orderController.getOrders);
router.delete('/remove', authenticate, orderController.removeItem);

module.exports = router;