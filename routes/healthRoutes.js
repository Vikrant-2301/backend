// routes/healthRoutes.js
const express = require('express');
const router = express.Router();

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 *
 * This endpoint is used by hosting services (like Render) to verify
 * that the application is alive and running. It should be lightweight
 * and return a 200 OK status quickly.
 */
router.get('/', (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "I'm alive!",
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;