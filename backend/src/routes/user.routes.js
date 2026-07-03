import express from 'express';
import { getAllCustomers, getCustomerById } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Only admins can access customer management routes
router.use(authenticate, authorize(ROLES.ADMIN));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /admin/users/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 */
router.get('/customers', getAllCustomers);

/**
 * @swagger
 * /admin/users/customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Users]
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
 *         description: Customer details
 */
router.get('/customers/:id', getCustomerById);

export default router;
