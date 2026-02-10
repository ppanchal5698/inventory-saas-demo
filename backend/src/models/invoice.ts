import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

/** balance_due is generated column; add via post-sync-mysql.sql */
export class Invoice extends Model {
  declare invoiceId: number;
  declare organizationId: number;
  declare invoiceNumber: string;
  declare invoiceType: 'sales' | 'purchase' | 'credit_note' | 'debit_note' | 'proforma';
  declare referenceType: string | null;
  declare referenceId: number | null;
  declare entityType: string;
  declare entityId: number;
  declare invoiceDate: Date;
  declare dueDate: Date | null;
  declare status: 'draft' | 'sent' | 'viewed' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  declare subtotal: string;
  declare taxAmount: string;
  declare discount: string;
  declare totalAmount: string;
  declare paidAmount: string;
  declare balanceDue: string; // Generated column
  declare currency: string;
  declare billingAddress: string | null;
  declare shippingAddress: string | null;
  declare notes: string | null;
  declare termsAndConditions: string | null;
  declare attachments: unknown;
  declare sentAt: Date | null;
  declare viewedAt: Date | null;
  declare createdBy: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
  declare deletedBy: number | null;
}

export function initInvoice(sequelize: Sequelize): void {
  Invoice.init(
    {
      invoiceId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'organization_id' } },
      invoiceNumber: { type: DataTypes.STRING(50), allowNull: false },
      invoiceType: {
        type: DataTypes.ENUM('sales', 'purchase', 'credit_note', 'debit_note', 'proforma'),
        allowNull: false,
      },
      referenceType: { type: DataTypes.STRING(50), allowNull: true },
      referenceId: { type: DataTypes.INTEGER, allowNull: true },
      entityType: { type: DataTypes.STRING(50), allowNull: false },
      entityId: { type: DataTypes.INTEGER, allowNull: false },
      invoiceDate: { type: DataTypes.DATEONLY, allowNull: false },
      dueDate: { type: DataTypes.DATEONLY, allowNull: true },
      status: {
        type: DataTypes.ENUM('draft', 'sent', 'viewed', 'partially_paid', 'paid', 'overdue', 'cancelled', 'refunded'),
        allowNull: false,
        defaultValue: 'draft',
      },
      subtotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      taxAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      discount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      paidAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
      balanceDue: { type: DataTypes.DECIMAL(15, 2), allowNull: true }, // Generated Column
      currency: { type: DataTypes.STRING(10), allowNull: true, defaultValue: 'USD' },
      billingAddress: { type: DataTypes.TEXT, allowNull: true },
      shippingAddress: { type: DataTypes.TEXT, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      termsAndConditions: { type: DataTypes.TEXT, allowNull: true },
      attachments: { type: DataTypes.JSON, allowNull: true },
      sentAt: { type: DataTypes.DATE, allowNull: true },
      viewedAt: { type: DataTypes.DATE, allowNull: true },
      createdBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'user_id' } },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
      deletedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Invoice',
      tableName: 'invoices',
      paranoid: true,
      indexes: [
        { unique: true, fields: ['organization_id', 'invoice_number'] },
        { fields: ['organization_id'] },
        { fields: ['invoice_type'] },
        { fields: ['entity_type', 'entity_id'] },
        { fields: ['status'] },
        { fields: ['invoice_date'] },
        { fields: ['due_date'] },
        { fields: ['deleted_at'] },
      ],
    }
  );
}
