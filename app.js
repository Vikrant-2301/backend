const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const registerRoutes = require('./routes/registerRoutes');
const courseRoutes = require('./routes/courseRoutes');
const certificationsRoutes = require('./routes/certificationsRoutes');
const Razorpay = require('razorpay');
const config = require('./config');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());

const corsOptions = {
    origin: ['http://127.0.0.1:5500', 'http://localhost:3000'], // Add more origins as needed
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

// Razorpay Setup
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Mongoose Connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes (using dynamic approach for api/v1)
const routes = [
    { path: '/auth', router: authRoutes },
    { path: '/posts', router: postRoutes },
    { path: '/courses', router: courseRoutes },
    { path: '/register', router: registerRoutes },
    { path: '/orders', router: orderRoutes},
    { path: '/certifications', router: certificationsRoutes},
]; 

routes.forEach(route => {
    app.use(`/api/v1${route.path}`, route.router);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
