const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, addressController.createAddress);
router.get('/order/:orderId', authMiddleware, addressController.getOrderAddress);

module.exports = router;