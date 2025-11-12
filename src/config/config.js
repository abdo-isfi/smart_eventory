const dotenv = require('dotenv');
const path = require('path');

// Déterminer quel fichier .env charger selon NODE_ENV
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;

// Charger le bon fichier
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Centraliser la configuration dans un objet exporté
const config = {
  env,
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};

module.exports = config;