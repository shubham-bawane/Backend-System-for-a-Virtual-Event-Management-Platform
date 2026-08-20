const express = require('express');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
} = require('../controllers/eventController');
const { authenticate, authorizeOrganizer } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');
const { eventValidation, eventIdValidation } = require('../validators/eventValidator');

const router = express.Router();

router.get('/', authenticate, getAllEvents);
router.get('/:id', authenticate, eventIdValidation, validateRequest, getEventById);
router.post('/', authenticate, authorizeOrganizer, eventValidation, validateRequest, createEvent);
router.put('/:id', authenticate, authorizeOrganizer, eventIdValidation, eventValidation, validateRequest, updateEvent);
router.delete('/:id', authenticate, authorizeOrganizer, eventIdValidation, validateRequest, deleteEvent);
router.post('/:id/register', authenticate, eventIdValidation, validateRequest, registerForEvent);
router.delete('/:id/register', authenticate, eventIdValidation, validateRequest, unregisterFromEvent);

module.exports = router;
