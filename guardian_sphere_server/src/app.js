const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env

const app = express(); // Déclarez `app` au début, avant d'utiliser ses fonctionnalités

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
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_key', // Utilisez une clé de secours si SESSION_SECRET est manquant
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Mettez à true si vous utilisez HTTPS
}));






// Import routes
const frontendRoutes = require('./routes/frontendRoutes'); // Import frontend routes
//
//
//
//
//
//
// Passport configuration
require('./config/passport')(passport);



// Backend routes
// app.use('/api/users', userRoutes);
//
//
//
//
//
//
//
//
// Frontend routes to serve files dynamically
app.use('/', frontendRoutes); 








// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

module.exports = app;
