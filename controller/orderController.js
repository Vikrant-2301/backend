const { createNewOrder, fetchAllOrders, fetchOrdersByUser } = require('../service/orderService');

const createOrderController = async (req, res) => {
  try {
    // Ensure orderBy is extracted from the body
    const { orderBy, orderValue, courseId, orderStatus } = req.body;
    
    if (!orderBy || !courseId) {
      return res.status(400).json({ error: "Missing required fields: orderBy or courseId" });
    }

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

// NEW: Add this controller for the dashboard
const getMyOrdersController = async (req, res) => {
  try {
    // Gets the user ID from the auth middleware token
    const userId = req.user.id; 
    const orders = await fetchOrdersByUser(userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOrderController, getAllOrdersController, getMyOrdersController };