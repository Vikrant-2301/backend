const jwt = require('jsonwebtoken'); // Ensure you have the 'jsonwebtoken' library installed
const { jwtSecret } = require('../config');

/*
 *
 * Role-based access middleware
 * @param {string} role - The required role ('user' or 'admin')
 */
const roleMiddleware = (role) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log("token",token) 
    // Expecting 'Bearer <token>'
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, jwtSecret);
      console.log("decode",decoded)
      req.user = decoded;

      // Check the user's role
      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      return res.status(400).json({ message: 'Invalid token.' });
    }
  };
};

module.exports = roleMiddleware;
