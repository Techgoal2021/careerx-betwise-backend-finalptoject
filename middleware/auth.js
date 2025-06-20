const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Auth middleware
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId); // match login payload
    if (!user) return res.status(401).json({ message: 'User not found.' });

    req.user = user; // attach full user document
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Role-based access middleware
const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin privileges.' });
  }
};

module.exports = { authenticateUser, isAdmin };
