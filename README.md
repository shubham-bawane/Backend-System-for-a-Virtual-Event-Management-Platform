# Backend System for a Virtual Event Management Platform

A Node.js + Express backend for managing virtual event registrations, organizer workflows, JWT-based authentication, and in-memory event data.

## Features

- User registration with bcrypt password hashing
- JWT-based login and protected routes
- Organizer and attendee roles
- Event CRUD operations with in-memory storage
- Event registration for attendees
- Async email notification simulation after successful registration
- RESTful API endpoints for auth and event management

## Tech Stack

- Node.js
- Express.js
- bcryptjs
- jsonwebtoken
- Jest + Supertest

## Installation

1. Clone the project
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The server runs on:

```bash
http://localhost:3000
```

## API Endpoints

### Authentication

- POST /register
- POST /login

Example request body for registration:

```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "Password123",
  "role": "organizer"
}
```

### Events

- GET /events
- POST /events
- PUT /events/:id
- DELETE /events/:id
- POST /events/:id/register

Example event body:

```json
{
  "title": "Virtual Leadership Summit",
  "description": "A digital summit on leadership and remote work.",
  "date": "2026-09-15",
  "time": "18:00"
}
```

### Auth Header

Protected routes require a Bearer token:

```http
Authorization: Bearer <jwt_token>
```

## Testing

Run the test suite:

```bash
npm test
```

## Notes

- User and event data are stored in memory and reset when the server restarts.
- Email sending is simulated asynchronously to demonstrate the async/await pattern required by the project.
- The project uses a public GitHub repository URL for submission and can be made public by changing repository visibility in GitHub settings.

## Repository

- GitHub: https://github.com/shubham-bawane/Backend-System-for-a-Virtual-Event-Management-Platform
