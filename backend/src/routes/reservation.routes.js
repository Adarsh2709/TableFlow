import express from 'express';
import { createReservation, getMyReservations, getReservationById, cancelReservation } from '../controllers/reservation.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { createReservationValidator } from '../validators/reservation.validator.js';

const router = express.Router();

// All routes here require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation Management
 */

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservationDate
 *               - timeSlot
 *               - guests
 *             properties:
 *               reservationDate:
 *                 type: string
 *                 format: date
 *               timeSlot:
 *                 type: string
 *                 example: "19:00"
 *               guests:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       409:
 *         description: Conflict - No tables available
 */
router.post('/', createReservationValidator, createReservation);

/**
 * @swagger
 * /reservations/my:
 *   get:
 *     summary: Get my reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's reservations
 */
router.get('/my', getMyReservations);

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get reservation details
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation details
 */
router.get('/:id', getReservationById);

/**
 * @swagger
 * /reservations/{id}/cancel:
 *   patch:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation cancelled
 */
router.patch('/:id/cancel', cancelReservation);

export default router;
