const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/token');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorizeOrganizer = (req, res, next) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Only organizers can perform this action' });
  }

  return next();
};

module.exports = {
  authenticate,
  authorizeOrganizer,
};
