import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate.middleware.js';
import { TIME_SLOTS_VALUES } from '../constants/timeSlots.js';

export const createReservationValidator = [
  body('reservationDate')
    .notEmpty()
    .withMessage('Reservation date is required')
    .isISO8601()
    .withMessage('Date must be in YYYY-MM-DD format')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // reset time to start of day for comparison
      if (date < today) {
        throw new Error('Reservation date cannot be in the past');
      }
      return true;
    }),
  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required')
    .isIn(TIME_SLOTS_VALUES)
    .withMessage(`Time slot must be one of: ${TIME_SLOTS_VALUES.join(', ')}`),
  body('guests')
    .notEmpty()
    .withMessage('Number of guests is required')
    .isInt({ min: 1 })
    .withMessage('Guests must be an integer greater than 0'),
  validateRequest
];
