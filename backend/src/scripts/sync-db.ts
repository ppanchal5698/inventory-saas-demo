/**
 * Sync database: run Sequelize sync() then apply post-sync SQL
 * (generated columns and FULLTEXT indexes). Idempotent: ignores
 * "duplicate column" / "duplicate key" errors on re-run.
 *
 * Usage: npx tsx src/scripts/sync-db.ts
 * Ensure .env is set (DB_*) and the database exists (e.g. inventory_management).
 */
import 'dotenv/config';
import { sequelize } from '../db/index.js';

const POST_SYNC_SQL = [
  `ALTER TABLE \`stock\` ADD COLUMN \`quantity_available\` INT GENERATED ALWAYS AS (\`quantity_on_hand\` - \`quantity_reserved\`) STORED`,
  `ALTER TABLE \`stock_adjustments\` ADD COLUMN \`quantity_difference\` INT GENERATED ALWAYS AS (\`new_quantity\` - \`old_quantity\`) STORED`,
  `ALTER TABLE \`sales_order_items\` ADD COLUMN \`line_total\` DECIMAL(15, 2) GENERATED ALWAYS AS ((\`quantity\` * \`unit_price\`) + \`tax_amount\` - \`discount\`) STORED`,
  `ALTER TABLE \`purchase_order_items\` ADD COLUMN \`line_total\` DECIMAL(15, 2) GENERATED ALWAYS AS ((\`quantity\` * \`unit_price\`) + \`tax_amount\` - \`discount\`) STORED`,
  `ALTER TABLE \`invoices\` ADD COLUMN \`balance_due\` DECIMAL(15, 2) GENERATED ALWAYS AS (\`total_amount\` - \`paid_amount\`) STORED`,
  `ALTER TABLE \`invoice_items\` ADD COLUMN \`line_total\` DECIMAL(15, 2) GENERATED ALWAYS AS ((\`quantity\` * \`unit_price\`) + \`tax_amount\` - \`discount\`) STORED`,
  `ALTER TABLE \`products\` ADD FULLTEXT KEY \`idx_product_search\` (\`product_name\`, \`description\`)`,
  `ALTER TABLE \`customers\` ADD FULLTEXT KEY \`idx_customer_search\` (\`customer_name\`, \`customer_code\`)`,
];

async function runPostSyncSql(): Promise<void> {
  for (const sql of POST_SYNC_SQL) {
    try {
      await sequelize.query(sql);
      console.log('OK:', sql.slice(0, 60) + '...');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (
        message.includes('Duplicate column name') ||
        message.includes('Duplicate key name') ||
        message.includes('already exists')
      ) {
        console.log('Skip (already applied):', sql.slice(0, 50) + '...');
      } else {
        console.error('SQL failed:', sql.slice(0, 80));
        throw err;
      }
    }
  }
}

async function main(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }

  try {
    await sequelize.sync({ alter: false });
    console.log('Sequelize sync done.');
  } catch (err) {
    console.error('Sync failed:', err);
    process.exit(1);
  }

  try {
    await runPostSyncSql();
    console.log('Post-sync SQL done.');
  } catch (err) {
    console.error('Post-sync SQL failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

main();
