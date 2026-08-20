const { body, param } = require('express-validator');

const eventValidation = [
  body('title').optional().trim(),
  body('date').optional().trim(),
  body('time').optional().trim(),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('title').if(body('title').exists()).notEmpty().withMessage('Title is required'),
  body('date').if(body('date').exists()).notEmpty().withMessage('Date is required'),
  body('time').if(body('time').exists()).notEmpty().withMessage('Time is required'),
];

const eventIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('Event id must be a positive integer'),
];

module.exports = {
  eventValidation,
  eventIdValidation,
};
