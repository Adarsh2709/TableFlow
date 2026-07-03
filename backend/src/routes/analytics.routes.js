import express from 'express';
import { getDashboardOverview, getTrends, getPopularTables } from '../controllers/analytics.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// All analytics routes are strictly for admins
router.use(authenticate, authorize(ROLES.ADMIN));

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Admin analytics and dashboard overview
 */

/**
 * @swagger
 * /admin/analytics/overview:
 *   get:
 *     summary: Get top-level dashboard statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Analytics overview retrieved
 */
router.get('/overview', getDashboardOverview);

/**
 * @swagger
 * /admin/analytics/trends:
 *   get:
 *     summary: Get reservation trends over time
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trends retrieved
 */
router.get('/trends', getTrends);

/**
 * @swagger
 * /admin/analytics/popular-tables:
 *   get:
 *     summary: Get the most frequently booked tables
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Popular tables retrieved
 */
router.get('/popular-tables', getPopularTables);

export default router;
