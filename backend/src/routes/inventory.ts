import express from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { warehouseSchema, stockLocationSchema, stockAdjustmentSchema, stockTransferSchema } from '../schemas/inventory';
import { warehouseController, stockLocationController, stockAdjustmentController, stockTransferController } from '../controllers/inventoryController';

const router = express.Router();

router.use(authenticate);

// Warehouse
router.get('/warehouses', warehouseController.getAll);
router.post('/warehouses', validate(warehouseSchema), warehouseController.create);
router.get('/warehouses/:id', warehouseController.getOne);
router.put('/warehouses/:id', validate(warehouseSchema.partial()), warehouseController.update);
router.delete('/warehouses/:id', warehouseController.delete);

// Stock Locations
router.get('/locations', stockLocationController.getAll);
router.post('/locations', validate(stockLocationSchema), stockLocationController.create);
router.get('/locations/:id', stockLocationController.getOne);
router.put('/locations/:id', validate(stockLocationSchema.partial()), stockLocationController.update);
router.delete('/locations/:id', stockLocationController.delete);

// Adjustments (Create only for now)
router.post('/adjustments', validate(stockAdjustmentSchema), stockAdjustmentController.createAdjustment);

// Transfers
router.get('/transfers', stockTransferController.getAll);
router.post('/transfers', validate(stockTransferSchema), stockTransferController.createTransfer);
router.get('/transfers/:id', stockTransferController.getOne);

export default router;
