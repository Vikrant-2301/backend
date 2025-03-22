const { 
    createStudentProfile, 
    findPaymentByOrderId, 
    updatePaymentDetails, 
    findStudentById, 
    updateStudentRegistration 
} = require('../repo/studentRegisterRepo');
const Razorpay = require('razorpay');
require('dotenv').config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getCoursePrice = (course) => {
    const coursePrices = {
        Diploma: 100,
        'B.Arch': 100,
        'M.Arch': 100,
    };
    return coursePrices[course] || 100;
};

const createStudentAndOrder = async (studentData) => {
    const price = getCoursePrice(studentData.course);

    // Create student profile
    const student = await createStudentProfile(studentData);
    const payment_capture = 1;
    // Razorpay order creation logic
    const options = {
        amount: price * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${new Date().getTime()}`,
        payment_capture,
    };
    const order = await razorpay.orders.create(options);

    return { student, orderId: order.id, price };
};

const verifyPayment = async (orderId, paymentId, signature) => {
    // Add Razorpay signature validation logic
    const isSignatureValid = true; // Replace with actual validation logic
    if (!isSignatureValid) {
        throw new Error('Invalid payment signature');
    }

    // Find the payment by orderId
    const payment = await findPaymentByOrderId(orderId);
    if (!payment) {
        throw new Error('Payment record not found');
    }

    // Update payment details
    payment.paymentId = paymentId;
    payment.status = 'Success';
    await updatePaymentDetails(orderId, payment);

    // Find and update the student
    const student = await findStudentById(payment.studentId);
    if (!student) {
        throw new Error('Student record not found');
    }

    // Mark the student as registered
    await updateStudentRegistration(student._id, true);

    return student;
};
const getAllStudents = async () => {
    // Replace with your database query logic to fetch all student profiles
    return await Student.find(); // Assuming you're using Mongoose or similar ORM
};

const getStudentByEmail = async (email) => {
    // Replace with your database query logic to fetch a student by email
    return await Student.findOne({ email }); // Assuming you're using Mongoose
};


module.exports = {
    getAllStudents,
    getStudentByEmail,
    createStudentAndOrder,
    verifyPayment,
};
