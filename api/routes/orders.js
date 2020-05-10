const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');


router.get('/', OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.orders_create_order);

router.get('/:orderId', checkAuth, OrdersController.orders_get_one_order);

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);

module.exports = router;