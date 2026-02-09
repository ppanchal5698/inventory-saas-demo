import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class City extends Model {
  declare cityId: number;
  declare stateId: number;
  declare cityName: string;
  declare latitude: string | null;
  declare longitude: string | null;
  declare population: number | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initCity(sequelize: Sequelize): void {
  City.init(
    {
      cityId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      stateId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'states', key: 'state_id' } },
      cityName: { type: DataTypes.STRING(100), allowNull: false },
      latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
      longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
      population: { type: DataTypes.INTEGER, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'City',
      tableName: 'cities',
      indexes: [
        { fields: ['state_id'] },
        { fields: ['is_active'] },
        { fields: ['latitude', 'longitude'] },
      ],
    }
  );
}
