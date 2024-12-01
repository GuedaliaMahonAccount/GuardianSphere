// src/app.js
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Initialize `app` at the beginning

// === CORS Configuration ===
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors()); // Handle preflight requests (OPTIONS)

// === Middleware ===
app.use(express.json({ limit: '10mb' })); // Increased limit for JSON requests
app.use(bodyParser.json({ limit: '10mb' })); // Increased limit for bodyParser JSON
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Increased limit for URL-encoded requests
app.use(passport.initialize()); // Initialize Passport.js

// === Session Configuration ===
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret_key', // Secret key for sessions
    resave: false, // Avoid saving the session if it's not modified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true, // Prevent JavaScript access to cookies
      maxAge: 1000 * 60 * 60 * 24, // Set cookie expiration (1 day)
    },
  })
);

// === Passport Configuration ===
require('./config/passport')(passport);

// === Import Routes ===
const openaiRoutes = require('./routes/openaiRoutes'); // Routes for OpenAI
const frontendRoutes = require('./routes/frontendRoutes'); // Routes for frontend
const messageRoutes = require('./routes/groupsroutes'); // Routes for group messages
const userRoutes = require('./routes/userRoutes'); // Routes for user management

// === Backend Routes ===
// OpenAI-related routes
app.use('/api/openai', openaiRoutes);

// Group messages routes
app.use('/api/messages', messageRoutes);

// User management routes (protected)
app.use('/api/user', userRoutes);

// Frontend routes (serve static files)
app.use('/', frontendRoutes);

// === Health Check Route ===
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// === Error Handling Middleware ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// === Export App ===
module.exports = app;
