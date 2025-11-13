function errorHandler(err, req, res, next) {
  console.error('Erreur non gérée:', err);

  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation échouée';
  }

  res.status(statusCode).json({ status: 'error', message });
}
module.exports = errorHandler;
