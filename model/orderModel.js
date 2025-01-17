const mongoose = require('mongoose');
const { Schema } = mongoose;

// Utility function to generate a random string for order ID
const generateOrderId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 6) + 5; // Length between 5 and 10
  let orderId = '';
  for (let i = 0; i < length; i++) {
    orderId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return orderId;
};

// Define the order schema
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: generateOrderId, // Use the defined function here
  },
  orderTime: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
  orderStatus: {
    type: String,
    enum: ['paid', 'pending', 'canceled'], // Restrict to these values
    default: 'pending', // Default value
  },
  orderBy: {
    type: String,
    required: true, // This is now mandatory
  },
  orderValue: {
    type: Number,
    required: true, // This is now mandatory
  },
  courseId: {
    type: Schema.Types.ObjectId, // Use ObjectId type for foreign key
    ref: 'Course', // Reference the Course model
    required: true,
  },
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
