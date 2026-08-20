const express = require('express');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();
app.use(express.json());

app.use('/', authRoutes);
app.use('/events', eventRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
