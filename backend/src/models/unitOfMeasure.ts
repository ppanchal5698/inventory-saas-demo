import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class UnitOfMeasure extends Model {
  declare uomId: number;
  declare organizationId: number;
  declare uomName: string;
  declare abbreviation: string;
  declare uomType: string;
  declare baseUomId: number | null;
  declare conversionFactor: string;
  declare isActive: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initUnitOfMeasure(sequelize: Sequelize): void {
  UnitOfMeasure.init(
    {
      uomId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'organizations', key: 'organization_id' },
      },
      uomName: { type: DataTypes.STRING(100), allowNull: false },
      abbreviation: { type: DataTypes.STRING(20), allowNull: false },
      uomType: { type: DataTypes.STRING(50), allowNull: false },
      baseUomId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'unit_of_measures', key: 'uom_id' } },
      conversionFactor: { type: DataTypes.DECIMAL(15, 6), allowNull: true, defaultValue: 1 },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      modelName: 'UnitOfMeasure',
      tableName: 'unit_of_measures',
      indexes: [
        { fields: ['organization_id'] },
        { fields: ['uom_type'] },
        { fields: ['base_uom_id'] },
      ],
    }
  );
}
