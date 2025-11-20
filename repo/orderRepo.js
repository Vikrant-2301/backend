const Order = require('../model/orderModel');

const createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

const getAllOrders = async () => {
  return await Order.find().populate('courseId', 'courseName price');
};

// NEW: Add this function to find orders for a specific user
const getOrdersByUserId = async (userId) => {
  return await Order.find({ orderBy: userId }).sort({ orderTime: -1 });
};

module.exports = { createOrder, getAllOrders, getOrdersByUserId };