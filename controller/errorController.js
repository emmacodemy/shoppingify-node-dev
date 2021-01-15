const mongoose = require('mongoose');

const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateKeyErrorDB = (err) => {
  const message = `Duplicate field value: ${
    Object.keys(err.keyValue)[0]
  }. please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((e) => e.message);
  const message = `Invalid input data: ${error.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  console.log(err, 'Error Occured');
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  console.error(err, 'error occured');
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  res.status(500).json({
    status: 'error',
    message: 'something went wrong',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };

    if (err instanceof mongoose.Error.CastError)
      error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateKeyErrorDB(error);
    if (err instanceof mongoose.Error.ValidationError)
      error = handleValidationErrorDB(error);
    sendErrorProd(error, req, res);
  }
};
