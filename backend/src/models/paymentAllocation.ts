import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class PaymentAllocation extends Model {
  declare allocationId: number;
  declare paymentId: number;
  declare invoiceId: number;
  declare allocatedAmount: string;
  declare createdAt: Date;
}

export function initPaymentAllocation(sequelize: Sequelize): void {
  PaymentAllocation.init(
    {
      allocationId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      paymentId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'payments', key: 'payment_id' } },
      invoiceId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'invoices', key: 'invoice_id' } },
      allocatedAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    },
    {
      sequelize,
      modelName: 'PaymentAllocation',
      tableName: 'payment_allocations',
      timestamps: true,
      updatedAt: false,
      indexes: [{ fields: ['payment_id'] }, { fields: ['invoice_id'] }],
    }
  );
}
