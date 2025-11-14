const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { ApiError } = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (!(err instanceof ApiError)) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  // Handle MongooseCastError specifically
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Invalid ID';
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = httpStatus.BAD_REQUEST;
    message = `Duplicate field value: ${Object.keys(err.keyValue)} already exists`;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = httpStatus.BAD_REQUEST;
    const errors = Object.values(err.errors).map(el => el.message);
    message = `Invalid input data. ${errors.join('. ')}`;
  }

  res.locals.errorMessage = message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = errorHandler;
