import express from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { supplierSchema, purchaseOrderSchema, grnSchema } from '../schemas/purchasing';
import { supplierController, purchaseOrderController, grnController } from '../controllers/purchasingController';

const router = express.Router();

router.use(authenticate);

// Suppliers
router.get('/suppliers', supplierController.getAll);
router.post('/suppliers', validate(supplierSchema), supplierController.create);
router.get('/suppliers/:id', supplierController.getOne);
router.put('/suppliers/:id', validate(supplierSchema.partial()), supplierController.update);
router.delete('/suppliers/:id', supplierController.delete);

// Purchase Orders
router.get('/purchase-orders', purchaseOrderController.getAll);
router.post('/purchase-orders', validate(purchaseOrderSchema), purchaseOrderController.createPO);
router.get('/purchase-orders/:id', purchaseOrderController.getOne);

// Goods Receipt Notes
router.get('/grns', grnController.getAll);
router.post('/grns', validate(grnSchema), grnController.createGRN);
router.get('/grns/:id', grnController.getOne);

export default router;
