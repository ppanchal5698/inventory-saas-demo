import { Request, Response, NextFunction } from 'express';
import { Model, ModelStatic } from 'sequelize';
import { AppError } from '../middleware/errorHandler';

export class BaseController<T extends Model> {
  constructor(protected model: ModelStatic<T>) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const where: any = {};
      if (req.organizationId) {
        where.organizationId = req.organizationId;
      }
      const items = await this.model.findAll({ where });
      res.status(200).json({ status: 'success', data: items });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const where: any = { [this.model.primaryKeyAttribute]: req.params.id };
      if (req.organizationId) {
        where.organizationId = req.organizationId;
      }

      const item = await this.model.findOne({ where });
      if (!item) {
        return next(new AppError('Not found', 404));
      }
      res.status(200).json({ status: 'success', data: item });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = { ...req.body };
      if (req.organizationId) {
        data.organizationId = req.organizationId;
      }
      const item = await this.model.create(data);
      res.status(201).json({ status: 'success', data: item });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const where: any = { [this.model.primaryKeyAttribute]: req.params.id };
      if (req.organizationId) {
        where.organizationId = req.organizationId;
      }

      const item = await this.model.findOne({ where });
      if (!item) {
        return next(new AppError('Not found', 404));
      }
      await item.update(req.body);
      res.status(200).json({ status: 'success', data: item });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const where: any = { [this.model.primaryKeyAttribute]: req.params.id };
      if (req.organizationId) {
        where.organizationId = req.organizationId;
      }

      const item = await this.model.findOne({ where });
      if (!item) {
        return next(new AppError('Not found', 404));
      }
      await item.destroy();
      res.status(204).json({ status: 'success', data: null });
    } catch (error) {
      next(error);
    }
  };
}
