const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/config'); // Import config

const JWT_SECRET = config.jwt.secret;

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Token manquant ou mal formé',
      });
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Token invalide ou expiré',
      });
    }

    // payload.sub contient l'id de l'utilisateur
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Utilisateur associé au token introuvable',
      });
    }

    // On attache l'utilisateur à la requête
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = auth;