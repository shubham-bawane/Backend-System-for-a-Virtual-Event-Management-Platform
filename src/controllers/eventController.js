const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerUserForEvent,
  unregisterUserFromEvent,
} = require('../services/eventService');

const getAllEvents = (req, res) => {
  return res.json(getEvents());
};

const getEventById = (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    const event = getEvent(eventId);
    return res.json({ message: 'Event fetched successfully', event });
  } catch (error) {
    return next(error);
  }
};

const createEventHandler = (req, res, next) => {
  try {
    const event = createEvent({
      ...req.body,
      organizerId: req.user.id,
    });

    return res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    return next(error);
  }
};

const updateEventHandler = (req, res, next) => {
  try {
    const event = updateEvent({
      eventId: Number(req.params.id),
      organizerId: req.user.id,
      ...req.body,
    });

    return res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    return next(error);
  }
};

const deleteEventHandler = (req, res, next) => {
  try {
    const event = deleteEvent({
      eventId: Number(req.params.id),
      organizerId: req.user.id,
    });

    return res.json({ message: 'Event deleted successfully', event });
  } catch (error) {
    return next(error);
  }
};

const registerForEvent = (req, res, next) => {
  try {
    const event = registerUserForEvent({
      eventId: Number(req.params.id),
      userId: req.user.id,
      userEmail: req.user.email,
    });

    return res.status(201).json({ message: 'Registered for event successfully', event });
  } catch (error) {
    return next(error);
  }
};

const unregisterFromEvent = (req, res, next) => {
  try {
    const result = unregisterUserFromEvent({
      eventId: Number(req.params.id),
      userId: req.user.id,
    });

    return res.json({
      message: 'Unregistered from event successfully',
      event: result.event,
      participant: result.participant,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent: createEventHandler,
  updateEvent: updateEventHandler,
  deleteEvent: deleteEventHandler,
  registerForEvent,
  unregisterFromEvent,
};
