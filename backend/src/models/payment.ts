import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class Payment extends Model {
  declare paymentId: number;
  declare organizationId: number;
  declare paymentNumber: string;
  declare invoiceId: number | null;
  declare entityType: string;
  declare entityId: number;
  declare paymentDate: Date;
  declare amount: string;
  declare paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'cheque' | 'upi' | 'wallet' | 'other';
  declare referenceNumber: string | null;
  declare notes: string | null;
  declare attachments: unknown;
  declare createdBy: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initPayment(sequelize: Sequelize): void {
  Payment.init(
    {
      paymentId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      paymentNumber: { type: DataTypes.STRING(50), allowNull: false },
      invoiceId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'invoices', key: 'invoice_id' } },
      entityType: { type: DataTypes.STRING(50), allowNull: false },
      entityId: { type: DataTypes.INTEGER, allowNull: false },
      paymentDate: { type: DataTypes.DATEONLY, allowNull: false },
      amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      paymentMethod: {
        type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'bank_transfer', 'cheque', 'upi', 'wallet', 'other'),
        allowNull: false,
      },
      referenceNumber: { type: DataTypes.STRING(100), allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      attachments: { type: DataTypes.JSON, allowNull: true },
      createdBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'payments',
      indexes: [
        { unique: true, fields: ['organization_id', 'payment_number'] },
        { fields: ['organization_id'] },
        { fields: ['invoice_id'] },
        { fields: ['entity_type', 'entity_id'] },
        { fields: ['payment_date'] },
      ],
    }
  );
}
