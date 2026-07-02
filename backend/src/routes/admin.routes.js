import express from 'express';
import { 
  createTable, getAllTables, updateTable, deleteTable, 
  getAllReservations, getReservationsByDate, updateReservation, deleteReservation 
} from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';
import { createTableValidator, updateTableValidator, adminQueryValidator } from '../validators/table.validator.js';

const router = express.Router();

// Ensure only admins can access these routes
router.use(authenticate, authorize(ROLES.ADMIN));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

// --- Tables ---

/**
 * @swagger
 * /admin/tables:
 *   get:
 *     summary: Get all tables
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tables
 */
router.get('/tables', getAllTables);

router.post('/tables', createTableValidator, createTable);
router.patch('/tables/:id', updateTableValidator, updateTable);
router.delete('/tables/:id', deleteTable);

// --- Reservations ---

/**
 * @swagger
 * /admin/reservations:
 *   get:
 *     summary: Get paginated reservations (supports filtering/sorting)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reservations
 */
router.get('/reservations', adminQueryValidator, getAllReservations);

router.get('/reservations/date/:date', adminQueryValidator, getReservationsByDate);
router.patch('/reservations/:id', updateReservation);
router.delete('/reservations/:id', deleteReservation);

export default router;
