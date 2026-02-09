import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class State extends Model {
  declare stateId: number;
  declare countryId: number;
  declare stateName: string;
  declare stateCode: string | null;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initState(sequelize: Sequelize): void {
  State.init(
    {
      stateId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      countryId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'countries', key: 'country_id' } },
      stateName: { type: DataTypes.STRING(100), allowNull: false },
      stateCode: { type: DataTypes.STRING(10), allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'State',
      tableName: 'states',
      indexes: [
        { fields: ['country_id'] },
        { fields: ['is_active'] },
      ],
    }
  );
}
