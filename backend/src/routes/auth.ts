import express from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema, userUpdateSchema, organizationCreateSchema } from '../schemas/auth';
import { userController } from '../controllers/userController';

const router = express.Router();

router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);
router.post('/organizations', authenticate, validate(organizationCreateSchema), userController.createOrganization);
router.get('/me', authenticate, userController.me);
router.put('/me', authenticate, validate(userUpdateSchema), userController.update);

export default router;
