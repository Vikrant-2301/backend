const { createNewOrder, fetchAllOrders } = require('../service/orderService');

const createOrderController = async (req, res) => {
  try {
    const { orderBy, orderValue, courseId, orderStatus } = req.body;
    const newOrder = await createNewOrder({ orderBy, orderValue, courseId, orderStatus });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllOrdersController = async (req, res) => {
  try {
    const orders = await fetchAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

module.exports = { createOrderController, getAllOrdersController };
