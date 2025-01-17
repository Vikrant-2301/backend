const express = require('express');
const { createOrderController, getAllOrdersController } = require('../controller/orderController');

const router = express.Router();

router.post('/orders', createOrderController);
router.get('/orders', getAllOrdersController);

module.exports = router;
