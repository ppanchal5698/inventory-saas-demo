import express from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { customerSchema, salesOrderSchema } from '../schemas/sales';
import { customerController, salesOrderController } from '../controllers/salesController';

const router = express.Router();

router.use(authenticate);

// Customers
router.get('/customers', customerController.getAll);
router.post('/customers', validate(customerSchema), customerController.create);
router.get('/customers/:id', customerController.getOne);
router.put('/customers/:id', validate(customerSchema.partial()), customerController.update);
router.delete('/customers/:id', customerController.delete);

// Sales Orders
router.get('/orders', salesOrderController.getAll);
router.post('/orders', validate(salesOrderSchema), salesOrderController.createOrder);
router.get('/orders/:id', salesOrderController.getOne);
// Status updates, etc., can be added here.

export default router;
