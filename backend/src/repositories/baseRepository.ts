import { Model, ModelStatic, WhereOptions, Transaction, CreationAttributes, Attributes } from 'sequelize';

export interface IBaseRepository<T extends Model> {
  findAll(where?: WhereOptions<Attributes<T>>): Promise<T[]>;
  findById(id: number | string): Promise<T | null>;
  findOne(where: WhereOptions<Attributes<T>>): Promise<T | null>;
  create(data: CreationAttributes<T>, transaction?: Transaction): Promise<T>;
  update(id: number | string, data: Partial<Attributes<T>>, transaction?: Transaction): Promise<T | null>;
  delete(id: number | string, transaction?: Transaction): Promise<boolean>;
}

export class BaseRepository<T extends Model> implements IBaseRepository<T> {
  constructor(protected model: ModelStatic<T>) {}

  async findAll(where?: WhereOptions<Attributes<T>>): Promise<T[]> {
    return this.model.findAll({ where });
  }

  async findById(id: number | string): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async findOne(where: WhereOptions<Attributes<T>>): Promise<T | null> {
    return this.model.findOne({ where });
  }

  async create(data: CreationAttributes<T>, transaction?: Transaction): Promise<T> {
    return this.model.create(data, { transaction });
  }

  async update(id: number | string, data: Partial<Attributes<T>>, transaction?: Transaction): Promise<T | null> {
    const item = await this.model.findByPk(id);
    if (!item) return null;
    return item.update(data, { transaction });
  }

  async delete(id: number | string, transaction?: Transaction): Promise<boolean> {
    const item = await this.model.findByPk(id);
    if (!item) return false;
    await item.destroy({ transaction });
    return true;
  }
}
