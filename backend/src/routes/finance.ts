import express from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { invoiceSchema, paymentSchema } from '../schemas/finance';
import { invoiceController, paymentController } from '../controllers/financeController';

const router = express.Router();

router.use(authenticate);

// Invoices
router.get('/invoices', invoiceController.getAll);
router.post('/invoices', validate(invoiceSchema), invoiceController.createInvoice);
router.get('/invoices/:id', invoiceController.getOne);

// Payments
router.get('/payments', paymentController.getAll);
router.post('/payments', validate(paymentSchema), paymentController.recordPayment);
router.get('/payments/:id', paymentController.getOne);

export default router;
