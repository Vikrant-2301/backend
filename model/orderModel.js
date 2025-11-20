const mongoose = require('mongoose');
const { Schema } = mongoose;

// Utility function to generate a random string for order ID
const generateOrderId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 6) + 5; 
  let orderId = '';
  for (let i = 0; i < length; i++) {
    orderId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return orderId;
};

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: generateOrderId,
  },
  orderTime: {
    type: Date,
    default: Date.now,
  },
  orderStatus: {
    type: String,
    enum: ['paid', 'pending', 'canceled', 'free_acquired'], // Added status for free items
    default: 'pending',
  },
  orderBy: {
    type: String, // Stores the User ID
    required: true, 
  },
  orderValue: {
    type: Number,
    required: true,
  },
  // UPDATED: Changed to String to support static product IDs
  courseId: {
    type: String, 
    required: true,
  },
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);