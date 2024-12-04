// src/app.js
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

// === CORS Configuration ===
const corsOptions = {
  origin: FRONTEND_ORIGIN, // Ensure this matches your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Allow OPTIONS preflight requests
app.options('*', cors(corsOptions));


// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(passport.initialize());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Import Routes
const openaiRoutes = require('./routes/openaiRoutes');
const messageRoutes = require('./routes/groupsroutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/openai', openaiRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/user', userRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

module.exports = app;
