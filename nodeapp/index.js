const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const eventRoutes = require('./routes/eventRoutes');
const communityReportRoutes = require('./routes/communityReportRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/neighbourhood_events';

// CORS configuration
const allowedOrigins = [
  /^https:\/\/.*-8081-.*\.premiumproject.*\.examly\.io$/,
  'http://localhost:8081',
  'http://localhost:3000',
  'http://127.0.0.1:8081'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed = allowedOrigins.some((pattern) =>
        pattern instanceof RegExp
          ? pattern.test(origin)
          : pattern === origin
      );

      if (isAllowed || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.use(express.json());

// API routes
app.use('/api/events', eventRoutes);
app.use('/api/reports', communityReportRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Neighbourhood Pulse API is running');
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`Connected successfully to MongoDB at ${MONGO_URI}`);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;