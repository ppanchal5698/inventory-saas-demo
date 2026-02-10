import express from 'express';
import { authenticate } from '../middleware/auth';
import { auditLogController, notificationController, fileController } from '../controllers/systemController';

const router = express.Router();

router.use(authenticate);

// Audit Logs
router.get('/audit-logs', auditLogController.getAll);

// Notifications
router.get('/notifications', notificationController.getAll);

// Files (Mock upload)
router.post('/files', fileController.uploadFile);
router.get('/files', fileController.getAll);

// Dashboard
router.get('/dashboard/stats', fileController.getDashboardStats); // Reusing instance method

export default router;
