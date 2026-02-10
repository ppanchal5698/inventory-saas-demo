import express from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { brandSchema, categorySchema, uomSchema, taxRateSchema, productSchema } from '../schemas/catalog';
import { brandController, categoryController, uomController, taxRateController, productController } from '../controllers/catalogController';

const router = express.Router();

// Apply auth to all routes for now
router.use(authenticate);

// Brand Routes
router.get('/brands', brandController.getAll);
router.post('/brands', validate(brandSchema), brandController.create);
router.get('/brands/:id', brandController.getOne);
router.put('/brands/:id', validate(brandSchema.partial()), brandController.update);
router.delete('/brands/:id', brandController.delete);

// Category Routes
router.get('/categories', categoryController.getAll);
router.post('/categories', validate(categorySchema), categoryController.create);
router.get('/categories/:id', categoryController.getOne);
router.put('/categories/:id', validate(categorySchema.partial()), categoryController.update);
router.delete('/categories/:id', categoryController.delete);

// Unit of Measure Routes
router.get('/uoms', uomController.getAll);
router.post('/uoms', validate(uomSchema), uomController.create);
router.get('/uoms/:id', uomController.getOne);
router.put('/uoms/:id', validate(uomSchema.partial()), uomController.update);
router.delete('/uoms/:id', uomController.delete);

// Tax Rate Routes
router.get('/tax-rates', taxRateController.getAll);
router.post('/tax-rates', validate(taxRateSchema), taxRateController.create);
router.get('/tax-rates/:id', taxRateController.getOne);
router.put('/tax-rates/:id', validate(taxRateSchema.partial()), taxRateController.update);
router.delete('/tax-rates/:id', taxRateController.delete);

// Product Routes
router.get('/products', productController.getAll);
router.post('/products', validate(productSchema), productController.create);
router.get('/products/:id', productController.getOne);
router.put('/products/:id', validate(productSchema.partial()), productController.update);
router.delete('/products/:id', productController.delete);

export default router;
