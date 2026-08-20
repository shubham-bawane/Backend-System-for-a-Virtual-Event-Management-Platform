const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const JWT_SECRET = jwtSecret;

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });

module.exports = {
  JWT_SECRET,
  generateToken,
};
