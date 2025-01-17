const Order = require('../model/orderModel');

const createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

const getAllOrders = async () => {
  return await Order.find().populate('courseId', 'courseName price'); // Populate course details
};

module.exports = { createOrder, getAllOrders };
