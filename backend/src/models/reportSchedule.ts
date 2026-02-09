import { Model, DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export class ReportSchedule extends Model {
  declare scheduleId: number;
  declare reportId: number;
  declare scheduleName: string;
  declare frequency: string;
  declare cronExpression: string | null;
  declare format: 'pdf' | 'excel' | 'csv' | 'html';
  declare recipients: unknown;
  declare isActive: boolean;
  declare lastRunAt: Date | null;
  declare nextRunAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export function initReportSchedule(sequelize: Sequelize): void {
  ReportSchedule.init(
    {
      scheduleId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      reportId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'saved_reports', key: 'report_id' } },
      scheduleName: { type: DataTypes.STRING(200), allowNull: false },
      frequency: { type: DataTypes.STRING(50), allowNull: false },
      cronExpression: { type: DataTypes.STRING(100), allowNull: true },
      format: {
        type: DataTypes.ENUM('pdf', 'excel', 'csv', 'html'),
        allowNull: false,
        defaultValue: 'pdf',
      },
      recipients: { type: DataTypes.JSON, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      lastRunAt: { type: DataTypes.DATE, allowNull: true },
      nextRunAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'ReportSchedule',
      tableName: 'report_schedules',
      indexes: [
        { fields: ['report_id'] },
        { fields: ['is_active'] },
        { fields: ['next_run_at'] },
      ],
    }
  );
}
