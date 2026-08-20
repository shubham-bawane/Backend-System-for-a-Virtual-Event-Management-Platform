const request = require('supertest');
const app = require('./src/app');

describe('Virtual Event Management API', () => {
  let organizerToken;
  let attendeeToken;
  let createdEventId;

  beforeAll(async () => {
    await request(app)
      .post('/register')
      .send({ name: 'Organizer One', email: 'organizer@example.com', password: 'Password123', role: 'organizer' })
      .expect(201);

    const organizerLogin = await request(app)
      .post('/login')
      .send({ email: 'organizer@example.com', password: 'Password123' })
      .expect(200);

    organizerToken = organizerLogin.body.token;

    await request(app)
      .post('/register')
      .send({ name: 'Attendee One', email: 'attendee@example.com', password: 'Password123', role: 'attendee' })
      .expect(201);

    const attendeeLogin = await request(app)
      .post('/login')
      .send({ email: 'attendee@example.com', password: 'Password123' })
      .expect(200);

    attendeeToken = attendeeLogin.body.token;
  });

  test('POST /register creates a user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ name: 'New User', email: 'newuser@example.com', password: 'Password123', role: 'attendee' })
      .expect(201);

    expect(response.body.user.email).toBe('newuser@example.com');
  });

  test('POST /login returns a JWT token for valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'organizer@example.com', password: 'Password123' })
      .expect(200);

    expect(response.body.token).toBeTruthy();
    expect(response.body.user.role).toBe('organizer');
  });

  test('POST /register rejects invalid payloads', async () => {
    const response = await request(app)
      .post('/register')
      .send({ name: '', email: 'bad-email', password: '' })
      .expect(400);

    expect(response.body.message).toBeTruthy();
  });

  test('POST /events rejects invalid event payloads', async () => {
    const response = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({ title: '', description: 'Missing required fields', date: '', time: '' })
      .expect(400);

    expect(response.body.message).toBeTruthy();
  });

  test('POST /events creates an event for authorized organizer', async () => {
    const response = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Tech Conference',
        description: 'Annual virtual meetup',
        date: '2026-09-15',
        time: '18:00'
      })
      .expect(201);

    createdEventId = response.body.event.id;
    expect(response.body.event.title).toBe('Tech Conference');
  });

  test('GET /events returns events when authenticated', async () => {
    const response = await request(app)
      .get('/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('PUT /events/:id updates an event by organizer', async () => {
    const response = await request(app)
      .put(`/events/${createdEventId}`)
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({ title: 'Updated Conference', description: 'Updated description' })
      .expect(200);

    expect(response.body.event.title).toBe('Updated Conference');
  });

  test('POST /events/:id/register registers attendee for event', async () => {
    const response = await request(app)
      .post(`/events/${createdEventId}/register`)
      .set('Authorization', `Bearer ${attendeeToken}`)
      .expect(201);

    expect(response.body.message).toBe('Registered for event successfully');
  });

  test('GET /events/:id returns event details and participants', async () => {
    const response = await request(app)
      .get(`/events/${createdEventId}`)
      .set('Authorization', `Bearer ${organizerToken}`)
      .expect(200);

    expect(response.body.event.id).toBe(createdEventId);
    expect(Array.isArray(response.body.event.participants)).toBe(true);
  });

  test('DELETE /events/:id/register unregisters attendee from event', async () => {
    const response = await request(app)
      .delete(`/events/${createdEventId}/register`)
      .set('Authorization', `Bearer ${attendeeToken}`)
      .expect(200);

    expect(response.body.message).toBe('Unregistered from event successfully');
  });

  test('DELETE /events/:id removes an event by organizer', async () => {
    const response = await request(app)
      .delete(`/events/${createdEventId}`)
      .set('Authorization', `Bearer ${organizerToken}`)
      .expect(200);

    expect(response.body.message).toBe('Event deleted successfully');
  });
});
