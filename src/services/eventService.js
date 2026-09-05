const { events, users } = require('../data/store');
const AppError = require('../utils/AppError');
const { doEventsOverlap } = require('../utils/timeUtils');

const getEvents = () => events;

const getEvent = (eventId) => {
  const event = events.find((entry) => entry.id === eventId);

  if (!event) {
    throw new AppError(404, 'Event not found');
  }

  return event;
};

const createEvent = ({ title, description, date, time, capacity, duration, organizerId }) => {
  if (!title || !date || !time || !capacity || !duration) {
    throw new AppError(400, 'Title, date, time, capacity, and duration are required');
  }

  const newEventData = { date, time, duration };
  const hasOverlap = events.some((existingEvent) => doEventsOverlap(existingEvent, newEventData));

  if (hasOverlap) {
    throw new AppError(409, 'An event is already scheduled during this time');
  }

  const event = {
    id: events.length + 1,
    title,
    description: description || '',
    date,
    time,
    capacity,
    duration,
    organizerId,
    participants: [],
  };

  events.push(event);
  return event;
};

const updateEvent = ({ eventId, organizerId, title, description, date, time, capacity, duration }) => {
  const eventIndex = events.findIndex((event) => event.id === eventId);

  if (eventIndex === -1) {
    throw new AppError(404, 'Event not found');
  }

  const event = events[eventIndex];

  if (event.organizerId !== organizerId) {
    throw new AppError(403, 'Only the event organizer can update this event');
  }

  if (capacity && capacity < event.participants.length) {
    throw new AppError(400, 'New capacity cannot be less than current participants count');
  }

  const updatedDate = date || event.date;
  const updatedTime = time || event.time;
  const updatedDuration = duration || event.duration;

  if (date || time || duration) {
    const newEventData = { date: updatedDate, time: updatedTime, duration: updatedDuration };
    const hasOverlap = events.some((existingEvent) => 
      existingEvent.id !== eventId && doEventsOverlap(existingEvent, newEventData)
    );

    if (hasOverlap) {
      throw new AppError(409, 'Updated event time overlaps with an existing event');
    }
  }

  events[eventIndex] = {
    ...event,
    title: title || event.title,
    description: description !== undefined ? description : event.description,
    date: updatedDate,
    time: updatedTime,
    capacity: capacity || event.capacity,
    duration: updatedDuration,
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

  if (event.participants.length >= event.capacity) {
    throw new AppError(400, 'Event is at full capacity');
  }

  const participantExists = event.participants.some((participant) => participant.userId === userId);
  if (participantExists) {
    throw new AppError(409, 'User is already registered for this event');
  }

  // Check if user is registered for any other overlapping events
  const userOverlappingEvent = events.find((existingEvent) => {
    if (existingEvent.id === eventId) return false;
    const isRegistered = existingEvent.participants.some((p) => p.userId === userId);
    return isRegistered && doEventsOverlap(existingEvent, event);
  });

  if (userOverlappingEvent) {
    throw new AppError(409, 'User is already registered for an overlapping event at this time');
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
