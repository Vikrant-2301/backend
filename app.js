const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const courseRoutes = require('./routes/courseRoutes');
const registerRoutes = require('./routes/registerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const certificationsRoutes = require('./routes/certificationsRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// --- SECURITY & CORE MIDDLEWARE ---
app.use(helmet()); // Sets crucial security headers

// Restrict requests to your frontend URL
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json()); // Modern replacement for bodyParser
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'static')));

// --- DATABASE CONNECTION ---
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit process if DB connection fails
    });

// --- API ROUTES ---
const apiPrefix = '/api/v1';
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/posts`, postRoutes);
app.use(`${apiPrefix}/courses`, courseRoutes);
app.use(`${apiPrefix}/register`, registerRoutes);
app.use(`${apiPrefix}/orders`, orderRoutes);
app.use(`${apiPrefix}/certifications`, certificationsRoutes);

// --- 404 HANDLER for unknown API routes ---
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

// --- GLOBAL ERROR HANDLING ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        }
    });
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});