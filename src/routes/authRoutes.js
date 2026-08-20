const express = require('express');
const { register, login } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const validateRequest = require('../middleware/validate');

const router = express.Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);

module.exports = router;
