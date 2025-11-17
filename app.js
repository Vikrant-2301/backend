const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');

// --- Load Environment Variables ---
dotenv.config();

// --- Import Routes ---
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const registerRoutes = require('./routes/registerRoutes');
const courseRoutes = require('./routes/courseRoutes');
const certificationsRoutes = require('./routes/certificationsRoutes');
const blogRoutes = require('./routes/blogRoutes');
const authorRoutes = require('./routes/authorRoutes'); // <-- IMPORT NEW ROUTE
const uploadRoutes = require('./routes/uploadRoutes');

// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 8000;

// --- Security & Core Middleware ---
app.use(helmet()); // Sets crucial security headers

// FIX: Whitelist of allowed frontend domains for production-ready CORS
const whitelist = [
    'http://localhost:3000',
    'https://discoverarch.org',
    'https://www.discoverarch.org',
    process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight requests for all routes

// Modern replacements for bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static')));

// --- Database Connection ---
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit if the database connection fails
    });

// --- API Routes ---
const apiPrefix = '/api/v1';
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/posts`, postRoutes);
app.use(`${apiPrefix}/courses`, courseRoutes);
app.use(`${apiPrefix}/register`, registerRoutes);
app.use(`${apiPrefix}/orders`, orderRoutes);
app.use(`${apiPrefix}/certifications`, certificationsRoutes);
app.use(`${apiPrefix}/blogs`, blogRoutes);
app.use(`${apiPrefix}/authors`, authorRoutes); // <-- USE NEW ROUTE
app.use(`${apiPrefix}/upload`, uploadRoutes); // <-- USE NEW ROUTE

// --- 404 Handler for unknown API routes ---
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

// --- Global Error Handling ---
app.use((err, req, res, next) => {
    console.error(err.stack); // Log full error for debugging
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        error: {
            message,
            // Only show stack trace in development
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        }
    });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});