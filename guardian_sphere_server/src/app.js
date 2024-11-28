const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env

const app = express(); // Initialisez `app` au début

// === CORS Configuration ===
app.use(
  cors({
    origin: 'http://localhost:3000', // Autorisez uniquement votre front-end React
    credentials: true, // Autorisez les cookies et les en-têtes d'authentification
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  })
);

app.options('*', cors()); // Gère les requêtes préalables (OPTIONS)

// === Middleware ===
app.use(express.json()); // Parse les requêtes avec du JSON
app.use(bodyParser.json()); // Supporte également le JSON dans bodyParser
app.use(passport.initialize()); // Initialise Passport.js

// === Session Configuration ===
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret_key', // Clé secrète pour les sessions
    resave: false, // Évite de sauvegarder la session si elle n'est pas modifiée
    saveUninitialized: true, // Sauvegarde les sessions non initialisées
    cookie: { secure: false }, // Utilisez `true` si vous utilisez HTTPS
  })
);

// === Passport Configuration ===
require('./config/passport')(passport);

// === Import Routes ===
const frontendRoutes = require('./routes/frontendRoutes'); // Routes pour servir les fichiers front-end
const openaiRoutes = require('./routes/openaiRoutes'); // Routes pour OpenAI

// === Backend Routes ===
app.use('/api', openaiRoutes); // Routes pour l'API principale
app.use('/', frontendRoutes); // Routes pour servir les fichiers front-end

// === Health Check Route ===
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// === Export App ===
module.exports = app;