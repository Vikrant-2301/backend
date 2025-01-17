const { createOrder, getAllOrders } = require('../repo/orderRepo');
const Course = require('../model/courseModel');

const createNewOrder = async ({ orderBy, orderValue, courseId, orderStatus }) => {
  // Check if the course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error('Invalid courseId: Course does not exist');
  }

  const orderData = {
    orderId: generateOrderId(),
    orderBy,
    orderValue,
    courseId,
    orderStatus: orderStatus || 'pending',
  };

  return await createOrder(orderData);
};

const fetchAllOrders = async () => {
  return await getAllOrders();
};


const generateOrderId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * 6) + 5; // Length between 5 and 10
    let orderId = '';
    for (let i = 0; i < length; i++) {
      orderId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return orderId;
  };

module.exports = { createNewOrder, fetchAllOrders };
