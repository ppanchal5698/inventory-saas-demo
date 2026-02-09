-- =====================================================
-- Post-sync MySQL: generated columns and FULLTEXT indexes
-- Run once after sequelize.sync(). Idempotent: ignore errors if column/index exists.
-- =====================================================

-- 1. stock.quantity_available (generated)
ALTER TABLE `stock`
  ADD COLUMN `quantity_available` INT GENERATED ALWAYS AS (`quantity_on_hand` - `quantity_reserved`) STORED;

-- 2. stock_adjustments.quantity_difference (generated)
ALTER TABLE `stock_adjustments`
  ADD COLUMN `quantity_difference` INT GENERATED ALWAYS AS (`new_quantity` - `old_quantity`) STORED;

-- 3. sales_order_items.line_total (generated)
ALTER TABLE `sales_order_items`
  ADD COLUMN `line_total` DECIMAL(15, 2) GENERATED ALWAYS AS ((`quantity` * `unit_price`) + `tax_amount` - `discount`) STORED;

-- 4. purchase_order_items.line_total (generated)
ALTER TABLE `purchase_order_items`
  ADD COLUMN `line_total` DECIMAL(15, 2) GENERATED ALWAYS AS ((`quantity` * `unit_price`) + `tax_amount` - `discount`) STORED;

-- 5. invoices.balance_due (generated)
ALTER TABLE `invoices`
  ADD COLUMN `balance_due` DECIMAL(15, 2) GENERATED ALWAYS AS (`total_amount` - `paid_amount`) STORED;

-- 6. invoice_items.line_total (generated)
ALTER TABLE `invoice_items`
  ADD COLUMN `line_total` DECIMAL(15, 2) GENERATED ALWAYS AS ((`quantity` * `unit_price`) + `tax_amount` - `discount`) STORED;

-- 7. FULLTEXT index on products (product_name, description)
ALTER TABLE `products`
  ADD FULLTEXT KEY `idx_product_search` (`product_name`, `description`);

-- 8. FULLTEXT index on customers (customer_name, customer_code)
ALTER TABLE `customers`
  ADD FULLTEXT KEY `idx_customer_search` (`customer_name`, `customer_code`);
