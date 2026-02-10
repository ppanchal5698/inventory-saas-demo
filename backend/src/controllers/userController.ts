import { BaseController } from '../controllers/baseController';
import { User } from '../models/user';
import { Organization } from '../models/organization';
import { AppError } from '../middleware/errorHandler';
import { authService } from '../services/authService';
import { Request, Response, NextFunction } from 'express';

export class UserController extends BaseController<User> {
  constructor() {
    super(User);
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token, organizationId } = await authService.login(req.body);
      res.status(200).json({ status: 'success', data: { user, token, organizationId } });
    } catch (error) {
      next(error);
    }
  };

  createOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('Unauthorized', 401);
      }
      const { organization, token } = await authService.createOrganization(userId, req.body);
      res.status(201).json({ status: 'success', data: { organization, token } });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findByPk(req.user?.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.status(200).json({ status: 'success', data: user });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
