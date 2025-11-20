const { createOrder, getAllOrders, getOrdersByUserId } = require('../repo/orderRepo');
// const Course = require('../model/courseModel'); // Removed to allow static products

const createNewOrder = async ({ orderBy, orderValue, courseId, orderStatus }) => {
  // We skip the Course.findById check to allow static products (like "tree-brush-set")
  
  const orderData = {
    orderBy, // This is the User ID
    orderValue,
    courseId, // The Product ID string
    orderStatus: orderStatus || 'pending',
  };

  return await createOrder(orderData);
};

const fetchAllOrders = async () => {
  return await getAllOrders();
};

// Ensure this function exists to fetch user's library
const fetchOrdersByUser = async (userId) => {
    // You might need to implement getOrdersByUserId in your repo if missing
    const Order = require('../model/orderModel'); 
    return await Order.find({ orderBy: userId });
};

module.exports = { createNewOrder, fetchAllOrders, fetchOrdersByUser };