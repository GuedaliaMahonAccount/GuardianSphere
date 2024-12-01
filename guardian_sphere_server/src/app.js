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
app.use(express.json()); // Parse JSON requests
app.use(bodyParser.json()); // Support JSON in bodyParser
app.use(passport.initialize()); // Initialize Passport.js

// === Session Configuration ===
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret_key', // Secret key for sessions
    resave: false, // Avoid saving the session if it's not modified
    saveUninitialized: true, // Save uninitialized sessions
    cookie: { secure: false }, // Use `true` if you are using HTTPS
  })
);

// === Passport Configuration ===
require('./config/passport')(passport);

// === Import Routes ===
const openaiRoutes = require('./routes/openaiRoutes'); // Routes for OpenAI
const frontendRoutes = require('./routes/frontendRoutes'); // Routes for frontend
const messageRoutes = require('./routes/groupsroutes'); // Routes for group messages

// === Backend Routes ===
app.use('/api/openai', openaiRoutes); // Routes for OpenAI features
app.use('/api/messages', messageRoutes); // Routes for group messages
app.use('/', frontendRoutes); // Routes for serving frontend files



// === Health Check Route ===
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// === Export App ===
module.exports = app;