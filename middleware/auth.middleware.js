// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const authMiddleware = (req, res, next) => {
  // Get token from the Authorization header (e.g., "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('[AuthMiddleware] No token provided');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach user payload (id, email, role) to the request
    next();
  } catch (err) {
    // console.log('[AuthMiddleware] Invalid token:', err.message);
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;