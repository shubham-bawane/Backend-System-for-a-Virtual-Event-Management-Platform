# Virtual Event Management Platform Backend

A Node.js + Express backend for a virtual event management platform with user authentication, organizer workflows, attendee registration, and in-memory event data management.

## Overview

This project provides a backend API for:
- user registration and login
- organizer and attendee role management
- event creation, update, deletion, and retrieval
- attendee registration and withdrawal from events
- simulated email notifications after successful registration

The application uses in-memory arrays as the data store, which makes it simple to run and test without needing a database.

## Tech Stack

- Node.js
- Express.js
- bcryptjs
- jsonwebtoken
- express-validator
- Jest + Supertest
- dotenv

## Project Structure

```text
.
├── app.js
├── server.js
├── app.test.js
├── .env.example
├── package.json
├── README.md
└── src/
    ├── app.js
    ├── config/
    │   └── index.js
    ├── controllers/
    │   ├── authController.js
    │   └── eventController.js
    ├── data/
    │   └── store.js
    ├── middleware/
    │   ├── auth.js
    │   ├── errorHandler.js
    │   ├── notFoundHandler.js
    │   └── validate.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── eventRoutes.js
    ├── services/
    │   ├── authService.js
    │   └── eventService.js
    ├── utils/
    │   ├── AppError.js
    │   ├── email.js
    │   └── token.js
    └── validators/
        ├── authValidator.js
        └── eventValidator.js
```

## Prerequisites

- Node.js 18+
- npm

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create an environment file:

```bash
cp .env.example .env
```

4. Update the values if needed, especially the JWT secret.

## Environment Variables

Example values in [.env.example](.env.example):

```env
PORT=3000
JWT_SECRET=change_this_secret
```

## Run the Application

Start the backend server:

```bash
npm start
```

The application will run at:

```text
http://localhost:3000
```

## API Endpoints

### Authentication

#### POST /register
Creates a new user.

Request body:

```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "Password123",
  "role": "organizer"
}
```

Response:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "organizer"
  }
}
```

#### POST /login
Authenticates a user and returns a JWT token.

Request body:

```json
{
  "email": "alice@example.com",
  "password": "Password123"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "organizer"
  }
}
```

### Events

All event routes require a Bearer token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

#### GET /events
Returns all events.

#### POST /events
Creates a new event. Only organizers can do this.

Request body:

```json
{
  "title": "Virtual Leadership Summit",
  "description": "A digital summit on leadership and remote work.",
  "date": "2026-09-15",
  "time": "18:00"
}
```

#### GET /events/:id
Returns a specific event with participants.

#### PUT /events/:id
Updates an existing event. Only the creator organizer can update it.

#### DELETE /events/:id
Deletes an event. Only the creator organizer can delete it.

#### POST /events/:id/register
Registers the authenticated attendee for an event.

#### DELETE /events/:id/register
Removes the authenticated attendee from an event.

## Example Usage with curl

Register a user:

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "Password123",
    "role": "organizer"
  }'
```

Login:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "Password123"
  }'
```

Create an event:

```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "title": "Virtual Leadership Summit",
    "description": "A digital summit on leadership and remote work.",
    "date": "2026-09-15",
    "time": "18:00"
  }'
```

Register for an event:

```bash
curl -X POST http://localhost:3000/events/1/register \
  -H "Authorization: Bearer <jwt_token>"
```

## Testing

Run the automated tests:

```bash
npm test
```

The test suite covers:
- user registration
- login and JWT validation
- organizer authorization
- event creation and update flow
- attendee registration and unregistration
- event detail retrieval

## Notes

- Data is stored in memory and resets when the server restarts.
- Registration emails are simulated asynchronously to demonstrate the async/await pattern required by the project.
- The project is designed for learning and backend API practice, not production-grade persistence.

## Repository

GitHub: https://github.com/shubham-bawane/Backend-System-for-a-Virtual-Event-Management-Platform
