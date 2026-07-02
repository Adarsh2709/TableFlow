import logger from '../utils/logger.js';
import ApiError from '../utils/ApiError.js';
import { config } from '../config/env.js';

export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    const field = Object.keys(err.keyValue)[0];
    errors = [{ field, message: `The ${field} '${err.keyValue[field]}' is already taken.` }];
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // Log error
  if (statusCode === 500) {
    logger.error(`${err.name}: ${err.message}\n${err.stack}`);
  } else {
    logger.warn(`API Error [${statusCode}]: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: config.nodeEnv === 'production' ? null : err.stack,
  });
};
