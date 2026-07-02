import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validate.middleware.js';

export const createTableValidator = [
  body('tableNumber').isInt({ min: 1 }).withMessage('Table number must be a positive integer'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  validateRequest
];

export const updateTableValidator = [
  param('id').isMongoId().withMessage('Invalid table ID format'),
  body('tableNumber').optional().isInt({ min: 1 }).withMessage('Table number must be a positive integer'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  validateRequest
];

export const adminQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
  query('status').optional().isString(),
  query('date').optional().isISO8601(),
  validateRequest
];
