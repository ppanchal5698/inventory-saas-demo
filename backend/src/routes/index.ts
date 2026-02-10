import express from 'express';
import authRoutes from './auth';
import catalogRoutes from './catalog';
import inventoryRoutes from './inventory';
import salesRoutes from './sales';
import purchasingRoutes from './purchasing';
import financeRoutes from './finance';
import systemRoutes from './system';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/catalog', catalogRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/sales', salesRoutes);
router.use('/purchasing', purchasingRoutes);
router.use('/finance', financeRoutes);
router.use('/system', systemRoutes);

export default router;
