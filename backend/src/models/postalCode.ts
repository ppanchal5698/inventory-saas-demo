import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class PostalCode extends Model {
  declare postalCodeId: number;
  declare cityId: number;
  declare postalCode: string;
  declare areaName: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initPostalCode(sequelize: Sequelize): void {
  PostalCode.init(
    {
      postalCodeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      cityId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'cities', key: 'city_id' } },
      postalCode: { type: DataTypes.STRING(20), allowNull: false },
      areaName: { type: DataTypes.STRING(100), allowNull: true },
    },
    {
      sequelize,
      modelName: 'PostalCode',
      tableName: 'postal_codes',
      indexes: [
        { fields: ['city_id'] },
        { fields: ['postal_code'] },
      ],
    }
  );
}
