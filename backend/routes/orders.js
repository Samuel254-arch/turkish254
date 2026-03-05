const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { validateOrder } = require('../middleware/validation');

router.post('/', validateOrder, OrderController.createOrder);
router.get('/:orderNumber', OrderController.getOrder);
router.get('/', OrderController.getAllOrders);

module.exports = router;