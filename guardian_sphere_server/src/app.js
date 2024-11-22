const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes

const frontendRoutes = require('./routes/frontendRoutes'); // Import frontend routes

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(passport.initialize());
app.use(bodyParser.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Passport configuration
require('./config/passport')(passport);

// Backend routes


// Frontend routes to serve files dynamically
app.use('/', frontendRoutes); // Add the frontend routes for React files

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

module.exports = app;
