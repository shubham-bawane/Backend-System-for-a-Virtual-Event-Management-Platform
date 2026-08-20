const bcrypt = require('bcryptjs');
const { users } = require('../data/store');
const AppError = require('../utils/AppError');
const { sendRegistrationEmail } = require('../utils/email');
const { generateToken } = require('../utils/token');

const registerUser = async ({ name, email, password, role = 'attendee' }) => {
  if (!name || !email || !password) {
    throw new AppError(400, 'Name, email, and password are required');
  }

  if (users.some((user) => user.email === email)) {
    throw new AppError(409, 'User already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: users.length + 1,
    name,
    email,
    password: passwordHash,
    role: ['organizer', 'attendee'].includes(role) ? role : 'attendee',
  };

  users.push(user);
  await sendRegistrationEmail(user.email, user.name);

  return {
    message: 'User registered successfully',
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  const user = users.find((entry) => entry.email === email);

  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid credentials');
  }

  const token = generateToken(user);

  return {
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

module.exports = {
  registerUser,
  loginUser,
};
