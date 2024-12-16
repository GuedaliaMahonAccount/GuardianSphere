const winston = require('winston');

// Configuration du logger
const logger = winston.createLogger({
    level: 'info', // Niveau par défaut ('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        // Affiche les logs dans la console
        new winston.transports.Console(),
        
        // Enregistre les logs d'erreurs dans un fichier
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),

        // Enregistre tous les logs dans un fichier
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

module.exports = logger;
