import express from 'express';
import { checkHealth } from '../controllers/health.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: System health status
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get system health info
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Health data
 */
router.get('/', checkHealth);

export default router;
