const express = require('express');
const { createOrderController, getAllOrdersController, getMyOrdersController } = require('../controller/orderController');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// UPDATE: Match the frontend path '/create' and add authMiddleware
router.post('/create', authMiddleware, createOrderController);

// NEW: Add the route for the dashboard to fetch user products
router.get('/my-orders', authMiddleware, getMyOrdersController);

// Admin route to see all orders
router.get('/all', getAllOrdersController);

module.exports = router;