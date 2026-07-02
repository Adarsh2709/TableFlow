import express from 'express';
import authRoutes from './auth.routes.js';
import reservationRoutes from './reservation.routes.js';
import adminRoutes from './admin.routes.js';
import healthRoutes from './health.routes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/reservations', reservationRoutes);
router.use('/admin', adminRoutes);

export default router;
