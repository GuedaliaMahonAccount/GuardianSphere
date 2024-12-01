const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header
  if (!token) return res.status(401).json({ message: 'Authentication failed' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Validate token
    req.userId = decoded.userId; // Attach userId to request
    next(); // Proceed to next middleware/handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
