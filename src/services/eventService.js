const { events, users } = require('../data/store');
const AppError = require('../utils/AppError');

const getEvents = () => events;

const getEvent = (eventId) => {
  const event = events.find((entry) => entry.id === eventId);

  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  return event;
};

const createEvent = ({ title, description, date, time, organizerId }) => {
  if (!title || !date || !time) {
    throw new AppError(400, 'Title, date, and time are required');
  }

  const event = {
    id: events.length + 1,
    title,
    description: description || '',
    date,
    time,
    organizerId,
    participants: [],
  };

  events.push(event);
  return event;
};

const updateEvent = ({ eventId, organizerId, title, description, date, time }) => {
  const eventIndex = events.findIndex((event) => event.id === eventId);

  if (eventIndex === -1) {
    throw new AppError(404, 'Event not found');
  }

  const event = events[eventIndex];

  if (event.organizerId !== organizerId) {
    throw new AppError(403, 'Only the event organizer can update this event');
  }

  events[eventIndex] = {
    ...event,
    title: title || event.title,
    description: description !== undefined ? description : event.description,
    date: date || event.date,
    time: time || event.time,
  };

  return events[eventIndex];
};

const deleteEvent = ({ eventId, organizerId }) => {
  const eventIndex = events.findIndex((event) => event.id === eventId);

  if (eventIndex === -1) {
    throw new AppError(404, 'Event not found');
  }

  if (events[eventIndex].organizerId !== organizerId) {
    throw new AppError(403, 'Only the event organizer can delete this event');
  }

  const [deletedEvent] = events.splice(eventIndex, 1);
  return deletedEvent;
};

const registerUserForEvent = ({ eventId, userId, userEmail }) => {
  const event = getEvent(eventId);

  const participantExists = event.participants.some((participant) => participant.userId === userId);
  if (participantExists) {
    throw new AppError(409, 'User is already registered for this event');
  }

  const currentUser = users.find((user) => user.id === userId);
  const participantName = currentUser ? currentUser.name : userEmail;

  event.participants.push({ userId, email: userEmail, name: participantName });
  return event;
};

const unregisterUserFromEvent = ({ eventId, userId }) => {
  const event = getEvent(eventId);
  const participantIndex = event.participants.findIndex((participant) => participant.userId === userId);

  if (participantIndex === -1) {
    throw new AppError(404, 'User is not registered for this event');
  }

  const [removedParticipant] = event.participants.splice(participantIndex, 1);
  return { event, participant: removedParticipant };
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerUserForEvent,
  unregisterUserFromEvent,
};
