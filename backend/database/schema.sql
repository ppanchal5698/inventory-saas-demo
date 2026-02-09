-- =====================================================
-- Optimized MySQL Schema
-- Converted from PostgreSQL
-- =====================================================

-- Set MySQL options for optimal performance
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- CORE REFERENCE TABLES
-- =====================================================

-- Countries table
CREATE TABLE `countries` (
  `country_id` INT AUTO_INCREMENT PRIMARY KEY,
  `country_name` VARCHAR(100) NOT NULL,
  `country_code` VARCHAR(2) NOT NULL,
  `country_code_3` VARCHAR(3),
  `numeric_code` VARCHAR(10),
  `phone_code` VARCHAR(10),
  `currency` VARCHAR(10),
  `currency_symbol` VARCHAR(10),
  `flag` TEXT,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_country_code` (`country_code`),
  KEY `idx_country_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- States table
CREATE TABLE `states` (
  `state_id` INT AUTO_INCREMENT PRIMARY KEY,
  `country_id` INT NOT NULL,
  `state_name` VARCHAR(100) NOT NULL,
  `state_code` VARCHAR(10),
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_state_country` (`country_id`),
  KEY `idx_state_active` (`is_active`),
  CONSTRAINT `fk_state_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`country_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cities table
CREATE TABLE `cities` (
  `city_id` INT AUTO_INCREMENT PRIMARY KEY,
  `state_id` INT NOT NULL,
  `city_name` VARCHAR(100) NOT NULL,
  `latitude` DECIMAL(10, 7),
  `longitude` DECIMAL(10, 7),
  `population` INT,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_city_state` (`state_id`),
  KEY `idx_city_active` (`is_active`),
  KEY `idx_city_coordinates` (`latitude`, `longitude`),
  CONSTRAINT `fk_city_state` FOREIGN KEY (`state_id`) REFERENCES `states` (`state_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Postal codes table
CREATE TABLE `postal_codes` (
  `postal_code_id` INT AUTO_INCREMENT PRIMARY KEY,
  `city_id` INT NOT NULL,
  `postal_code` VARCHAR(20) NOT NULL,
  `area_name` VARCHAR(100),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_postal_city` (`city_id`),
  KEY `idx_postal_code` (`postal_code`),
  CONSTRAINT `fk_postal_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ORGANIZATION & USER MANAGEMENT
-- =====================================================

-- Organizations table
CREATE TABLE `organizations` (
  `organization_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `logo` TEXT,
  `website` VARCHAR(255),
  `email` VARCHAR(255),
  `phone` VARCHAR(20),
  `address` TEXT,
  `city_id` INT,
  `postal_code` VARCHAR(20),
  `tax_id` VARCHAR(50),
  `registration_number` VARCHAR(50),
  `status` ENUM('trial', 'active', 'suspended', 'cancelled') NOT NULL DEFAULT 'trial',
  `settings` JSON,
  `metadata` JSON,
  `trial_ends_at` TIMESTAMP NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT,
  UNIQUE KEY `idx_org_slug` (`slug`),
  KEY `idx_org_status` (`status`),
  KEY `idx_org_active` (`is_active`),
  KEY `idx_org_city` (`city_id`),
  KEY `idx_org_deleted` (`deleted_at`),
  CONSTRAINT `fk_org_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users table
CREATE TABLE `users` (
  `user_id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20),
  `profile_picture` TEXT,
  `role` ENUM('admin', 'manager', 'staff', 'viewer') NOT NULL DEFAULT 'staff',
  `status` ENUM('active', 'inactive', 'pending_verification', 'suspended') NOT NULL DEFAULT 'pending_verification',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `phone_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `two_factor_enabled` BOOLEAN NOT NULL DEFAULT FALSE,
  `two_factor_secret` VARCHAR(100),
  `last_login_at` TIMESTAMP NULL,
  `last_login_ip` VARCHAR(45),
  `failed_login_attempts` INT NOT NULL DEFAULT 0,
  `locked_until` TIMESTAMP NULL,
  `password_changed_at` TIMESTAMP NULL,
  `preferences` JSON,
  `metadata` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT,
  UNIQUE KEY `idx_user_username` (`username`),
  UNIQUE KEY `idx_user_email` (`email`),
  KEY `idx_user_status` (`status`),
  KEY `idx_user_active` (`is_active`),
  KEY `idx_user_deleted` (`deleted_at`),
  KEY `idx_user_last_login` (`last_login_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles table
CREATE TABLE `roles` (
  `role_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `role_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `is_system` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_role_org` (`organization_id`),
  KEY `idx_role_active` (`is_active`),
  UNIQUE KEY `idx_role_org_name` (`organization_id`, `role_name`),
  CONSTRAINT `fk_role_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Permissions table
CREATE TABLE `permissions` (
  `permission_id` INT AUTO_INCREMENT PRIMARY KEY,
  `permission_name` VARCHAR(100) NOT NULL,
  `module` VARCHAR(50) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_permission_name` (`permission_name`),
  KEY `idx_permission_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Role permissions junction table
CREATE TABLE `role_permissions` (
  `role_permission_id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_role_perm_unique` (`role_id`, `permission_id`),
  KEY `idx_role_perm_role` (`role_id`),
  KEY `idx_role_perm_permission` (`permission_id`),
  CONSTRAINT `fk_role_perm_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_role_perm_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User organizations junction table
CREATE TABLE `user_organizations` (
  `user_org_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `organization_id` INT NOT NULL,
  `role_id` INT,
  `is_default` BOOLEAN NOT NULL DEFAULT FALSE,
  `invited_by` INT,
  `invited_at` TIMESTAMP NULL,
  `joined_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_user_org_unique` (`user_id`, `organization_id`),
  KEY `idx_user_org_user` (`user_id`),
  KEY `idx_user_org_org` (`organization_id`),
  KEY `idx_user_org_role` (`role_id`),
  CONSTRAINT `fk_user_org_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_org_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_org_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_user_org_invited_by` FOREIGN KEY (`invited_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AUTHENTICATION & SECURITY
-- =====================================================

-- Sessions table
CREATE TABLE `sessions` (
  `session_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `session_token` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `device_info` JSON,
  `expires_at` TIMESTAMP NOT NULL,
  `last_activity_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_session_token` (`session_token`),
  KEY `idx_session_user` (`user_id`),
  KEY `idx_session_expires` (`expires_at`),
  CONSTRAINT `fk_session_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password reset tokens
CREATE TABLE `password_reset_tokens` (
  `token_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `used_at` TIMESTAMP NULL,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_reset_token` (`token_hash`),
  KEY `idx_reset_user` (`user_id`),
  KEY `idx_reset_expires` (`expires_at`),
  CONSTRAINT `fk_reset_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password reset OTPs
CREATE TABLE `password_reset_otps` (
  `otp_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `code_hash` VARCHAR(255) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `used_at` TIMESTAMP NULL,
  `sent_count` INT NOT NULL DEFAULT 1,
  `attempt_count` INT NOT NULL DEFAULT 0,
  `max_attempts` INT NOT NULL DEFAULT 3,
  `last_sent_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` VARCHAR(45),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_otp_user` (`user_id`),
  KEY `idx_otp_expires` (`expires_at`),
  CONSTRAINT `fk_otp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email verification tokens
CREATE TABLE `email_verification_tokens` (
  `token_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `used_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_email_token` (`token_hash`),
  KEY `idx_email_user` (`user_id`),
  KEY `idx_email_expires` (`expires_at`),
  CONSTRAINT `fk_email_token_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Password history
CREATE TABLE `password_history` (
  `history_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_pwd_history_user` (`user_id`),
  CONSTRAINT `fk_pwd_history_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Login history
CREATE TABLE `login_history` (
  `history_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `email` VARCHAR(255) NOT NULL,
  `success` BOOLEAN NOT NULL,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `location` JSON,
  `failure_reason` VARCHAR(255),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_login_user` (`user_id`),
  KEY `idx_login_email` (`email`),
  KEY `idx_login_created` (`created_at`),
  KEY `idx_login_success` (`success`),
  CONSTRAINT `fk_login_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Account deletion requests
CREATE TABLE `account_deletion_requests` (
  `request_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `confirmation_token_hash` VARCHAR(255) NOT NULL,
  `reason` TEXT,
  `expires_at` TIMESTAMP NOT NULL,
  `confirmed_at` TIMESTAMP NULL,
  `processed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_deletion_user` (`user_id`),
  KEY `idx_deletion_expires` (`expires_at`),
  CONSTRAINT `fk_deletion_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PRODUCT CATALOG
-- =====================================================

-- Brands table
CREATE TABLE `brands` (
  `brand_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `brand_name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200),
  `manufacturer_name` VARCHAR(200),
  `logo` TEXT,
  `website` VARCHAR(255),
  `description` TEXT,
  `country_of_origin` INT,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `metadata` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT,
  KEY `idx_brand_org` (`organization_id`),
  KEY `idx_brand_active` (`is_active`),
  KEY `idx_brand_slug` (`slug`),
  KEY `idx_brand_deleted` (`deleted_at`),
  CONSTRAINT `fk_brand_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_brand_country` FOREIGN KEY (`country_of_origin`) REFERENCES `countries` (`country_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE `categories` (
  `category_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `category_name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200),
  `parent_category_id` INT,
  `description` TEXT,
  `image` TEXT,
  `display_order` INT DEFAULT 0,
  `level` INT DEFAULT 0,
  `path` TEXT,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `metadata` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT,
  KEY `idx_category_org` (`organization_id`),
  KEY `idx_category_parent` (`parent_category_id`),
  KEY `idx_category_active` (`is_active`),
  KEY `idx_category_slug` (`slug`),
  KEY `idx_category_deleted` (`deleted_at`),
  CONSTRAINT `fk_category_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_category_parent` FOREIGN KEY (`parent_category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Unit of measures
CREATE TABLE `unit_of_measures` (
  `uom_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `uom_name` VARCHAR(100) NOT NULL,
  `abbreviation` VARCHAR(20) NOT NULL,
  `uom_type` VARCHAR(50) NOT NULL,
  `base_uom_id` INT,
  `conversion_factor` DECIMAL(15, 6) DEFAULT 1,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_uom_org` (`organization_id`),
  KEY `idx_uom_type` (`uom_type`),
  KEY `idx_uom_base` (`base_uom_id`),
  CONSTRAINT `fk_uom_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_uom_base` FOREIGN KEY (`base_uom_id`) REFERENCES `unit_of_measures` (`uom_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tax rates table
CREATE TABLE `tax_rates` (
  `tax_rate_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `tax_name` VARCHAR(100) NOT NULL,
  `tax_type` ENUM('vat', 'gst', 'sales_tax', 'excise', 'custom') NOT NULL,
  `rate` DECIMAL(5, 2) NOT NULL,
  `country_id` INT,
  `state_id` INT,
  `is_compound` BOOLEAN NOT NULL DEFAULT FALSE,
  `priority` INT DEFAULT 0,
  `effective_from` DATE NOT NULL,
  `effective_to` DATE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_tax_org` (`organization_id`),
  KEY `idx_tax_active` (`is_active`),
  KEY `idx_tax_effective` (`effective_from`, `effective_to`),
  CONSTRAINT `fk_tax_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tax_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`country_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tax_state` FOREIGN KEY (`state_id`) REFERENCES `states` (`state_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE `products` (
  `product_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `product_code` VARCHAR(100) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255),
  `description` TEXT,
  `short_description` VARCHAR(500),
  `category_id` INT,
  `brand_id` INT,
  `unit_price` DECIMAL(15, 2) NOT NULL,
  `cost_price` DECIMAL(15, 2),
  `list_price` DECIMAL(15, 2),
  `tax_rate_id` INT,
  `reorder_level` INT NOT NULL DEFAULT 10,
  `min_stock_level` INT NOT NULL DEFAULT 5,
  `max_stock_level` INT,
  `uom_id` INT,
  `barcode` VARCHAR(100),
  `sku` VARCHAR(100),
  `hsn_code` VARCHAR(50),
  `weight` DECIMAL(10, 3),
  `weight_uom_id` INT,
  `dimensions` JSON,
  `is_serialized` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_batched` BOOLEAN NOT NULL DEFAULT FALSE,
  `has_expiry_date` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_perishable` BOOLEAN NOT NULL DEFAULT FALSE,
  `shelf_life` INT,
  `warranty_period` INT,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `tags` JSON,
  `attributes` JSON,
  `metadata` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT,
  UNIQUE KEY `idx_product_code_org` (`organization_id`, `product_code`),
  KEY `idx_product_org` (`organization_id`),
  KEY `idx_product_category` (`category_id`),
  KEY `idx_product_brand` (`brand_id`),
  KEY `idx_product_active` (`is_active`),
  KEY `idx_product_slug` (`slug`),
  KEY `idx_product_barcode` (`barcode`),
  KEY `idx_product_sku` (`sku`),
  KEY `idx_product_deleted` (`deleted_at`),
  FULLTEXT KEY `idx_product_search` (`product_name`, `description`),
  CONSTRAINT `fk_product_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_tax` FOREIGN KEY (`tax_rate_id`) REFERENCES `tax_rates` (`tax_rate_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_uom` FOREIGN KEY (`uom_id`) REFERENCES `unit_of_measures` (`uom_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_product_weight_uom` FOREIGN KEY (`weight_uom_id`) REFERENCES `unit_of_measures` (`uom_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product images
CREATE TABLE `product_images` (
  `image_id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_url` TEXT NOT NULL,
  `alt_text` VARCHAR(255),
  `display_order` INT DEFAULT 0,
  `is_primary` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_image_product` (`product_id`),
  KEY `idx_image_primary` (`product_id`, `is_primary`),
  CONSTRAINT `fk_image_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product variants
CREATE TABLE `product_variants` (
  `variant_id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `variant_code` VARCHAR(100) NOT NULL,
  `variant_name` VARCHAR(255) NOT NULL,
  `attributes` JSON,
  `sku` VARCHAR(100),
  `barcode` VARCHAR(100),
  `price` DECIMAL(15, 2),
  `cost_price` DECIMAL(15, 2),
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_variant_product` (`product_id`),
  KEY `idx_variant_sku` (`sku`),
  KEY `idx_variant_barcode` (`barcode`),
  CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product bundles
CREATE TABLE `product_bundles` (
  `bundle_id` INT AUTO_INCREMENT PRIMARY KEY,
  `bundle_product_id` INT NOT NULL,
  `component_product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_bundle_product` (`bundle_product_id`),
  KEY `idx_bundle_component` (`component_product_id`),
  CONSTRAINT `fk_bundle_product` FOREIGN KEY (`bundle_product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bundle_component` FOREIGN KEY (`component_product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- WAREHOUSE & INVENTORY
-- =====================================================

-- Warehouses table
CREATE TABLE `warehouses` (
  `warehouse_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `warehouse_code` VARCHAR(50) NOT NULL,
  `warehouse_name` VARCHAR(200) NOT NULL,
  `warehouse_type` VARCHAR(50),
  `address` TEXT,
  `city_id` INT,
  `postal_code` VARCHAR(20),
  `manager_user_id` INT,
  `phone` VARCHAR(20),
  `email` VARCHAR(255),
  `capacity` INT,
  `current_utilization` INT DEFAULT 0,
  `coordinates` JSON,
  `operating_hours` JSON,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `metadata` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT,
  UNIQUE KEY `idx_warehouse_code_org` (`organization_id`, `warehouse_code`),
  KEY `idx_warehouse_org` (`organization_id`),
  KEY `idx_warehouse_city` (`city_id`),
  KEY `idx_warehouse_manager` (`manager_user_id`),
  KEY `idx_warehouse_active` (`is_active`),
  KEY `idx_warehouse_deleted` (`deleted_at`),
  CONSTRAINT `fk_warehouse_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_warehouse_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_warehouse_manager` FOREIGN KEY (`manager_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stock locations within warehouses
CREATE TABLE `stock_locations` (
  `location_id` INT AUTO_INCREMENT PRIMARY KEY,
  `warehouse_id` INT NOT NULL,
  `location_type` ENUM('zone', 'aisle', 'rack', 'shelf', 'bin') NOT NULL DEFAULT 'bin',
  `location_code` VARCHAR(50) NOT NULL,
  `parent_location_id` INT,
  `aisle` VARCHAR(20),
  `rack` VARCHAR(20),
  `shelf` VARCHAR(20),
  `bin` VARCHAR(20),
  `capacity` INT,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_location_code_warehouse` (`warehouse_id`, `location_code`),
  KEY `idx_location_warehouse` (`warehouse_id`),
  KEY `idx_location_parent` (`parent_location_id`),
  KEY `idx_location_active` (`is_active`),
  CONSTRAINT `fk_location_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_location_parent` FOREIGN KEY (`parent_location_id`) REFERENCES `stock_locations` (`location_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Batches for batch-tracked products
CREATE TABLE `batches` (
  `batch_id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `batch_number` VARCHAR(100) NOT NULL,
  `manufacturing_date` DATE,
  `expiry_date` DATE,
  `quantity` INT NOT NULL,
  `quantity_remaining` INT NOT NULL,
  `purchase_price` DECIMAL(15, 2),
  `supplier_lot_number` VARCHAR(100),
  `notes` TEXT,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_batch_number` (`batch_number`),
  KEY `idx_batch_product` (`product_id`),
  KEY `idx_batch_warehouse` (`warehouse_id`),
  KEY `idx_batch_expiry` (`expiry_date`),
  KEY `idx_batch_active` (`is_active`),
  CONSTRAINT `fk_batch_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_batch_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Serial numbers for serialized products
CREATE TABLE `serial_numbers` (
  `serial_id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `serial_number` VARCHAR(100) NOT NULL,
  `batch_id` INT,
  `warehouse_id` INT,
  `status` VARCHAR(50) NOT NULL DEFAULT 'in_stock',
  `purchase_date` DATE,
  `warranty_expiry_date` DATE,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_serial_number` (`serial_number`),
  KEY `idx_serial_product` (`product_id`),
  KEY `idx_serial_batch` (`batch_id`),
  KEY `idx_serial_warehouse` (`warehouse_id`),
  KEY `idx_serial_status` (`status`),
  CONSTRAINT `fk_serial_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_serial_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_serial_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stock levels
CREATE TABLE `stock` (
  `stock_id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `location_id` INT,
  `quantity_on_hand` INT NOT NULL DEFAULT 0,
  `quantity_reserved` INT NOT NULL DEFAULT 0,
  `quantity_available` INT GENERATED ALWAYS AS (`quantity_on_hand` - `quantity_reserved`) STORED,
  `quantity_in_transit` INT NOT NULL DEFAULT 0,
  `quantity_damaged` INT NOT NULL DEFAULT 0,
  `quantity_expired` INT NOT NULL DEFAULT 0,
  `reorder_point` INT,
  `last_stock_check` TIMESTAMP NULL,
  `last_stock_check_by` INT,
  `average_cost` DECIMAL(15, 2),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_stock_product_warehouse` (`product_id`, `warehouse_id`),
  KEY `idx_stock_product` (`product_id`),
  KEY `idx_stock_warehouse` (`warehouse_id`),
  KEY `idx_stock_location` (`location_id`),
  KEY `idx_stock_reorder` (`reorder_point`),
  CONSTRAINT `fk_stock_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_stock_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_stock_location` FOREIGN KEY (`location_id`) REFERENCES `stock_locations` (`location_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_stock_check_by` FOREIGN KEY (`last_stock_check_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stock reservations
CREATE TABLE `stock_reservations` (
  `reservation_id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `reference_type` VARCHAR(50) NOT NULL,
  `reference_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `reserved_until` TIMESTAMP NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_reservation_product` (`product_id`),
  KEY `idx_reservation_warehouse` (`warehouse_id`),
  KEY `idx_reservation_reference` (`reference_type`, `reference_id`),
  KEY `idx_reservation_status` (`status`),
  CONSTRAINT `fk_reservation_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reservation_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inventory transactions log
CREATE TABLE `inventory_transactions` (
  `transaction_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `transaction_type` ENUM('receipt', 'shipment', 'adjustment', 'transfer', 'return', 'damage', 'expiry') NOT NULL,
  `product_id` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `batch_id` INT,
  `serial_number_id` INT,
  `quantity` INT NOT NULL,
  `unit_cost` DECIMAL(15, 2),
  `total_cost` DECIMAL(15, 2),
  `reference_type` VARCHAR(50),
  `reference_id` INT,
  `transaction_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` TEXT,
  `performed_by` INT,
  KEY `idx_inv_trans_org` (`organization_id`),
  KEY `idx_inv_trans_product` (`product_id`),
  KEY `idx_inv_trans_warehouse` (`warehouse_id`),
  KEY `idx_inv_trans_type` (`transaction_type`),
  KEY `idx_inv_trans_date` (`transaction_date`),
  KEY `idx_inv_trans_reference` (`reference_type`, `reference_id`),
  CONSTRAINT `fk_inv_trans_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inv_trans_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inv_trans_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inv_trans_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_inv_trans_serial` FOREIGN KEY (`serial_number_id`) REFERENCES `serial_numbers` (`serial_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_inv_trans_user` FOREIGN KEY (`performed_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stock adjustments
CREATE TABLE `stock_adjustments` (
  `adjustment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `adjustment_number` VARCHAR(50) NOT NULL,
  `product_id` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `batch_id` INT,
  `old_quantity` INT NOT NULL,
  `new_quantity` INT NOT NULL,
  `quantity_difference` INT GENERATED ALWAYS AS (`new_quantity` - `old_quantity`) STORED,
  `reason` ENUM('count_discrepancy', 'damage', 'theft', 'expiry', 'correction', 'other') NOT NULL,
  `unit_cost` DECIMAL(15, 2),
  `notes` TEXT,
  `attachments` JSON,
  `adjusted_by` INT,
  `approved_by` INT,
  `adjustment_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_adjustment_number` (`adjustment_number`),
  KEY `idx_adjustment_org` (`organization_id`),
  KEY `idx_adjustment_product` (`product_id`),
  KEY `idx_adjustment_warehouse` (`warehouse_id`),
  KEY `idx_adjustment_date` (`adjustment_date`),
  CONSTRAINT `fk_adjustment_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_adjustment_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_adjustment_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_adjustment_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_adjustment_adjusted_by` FOREIGN KEY (`adjusted_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_adjustment_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stock transfers
CREATE TABLE `stock_transfers` (
  `transfer_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `transfer_number` VARCHAR(50) NOT NULL,
  `from_warehouse_id` INT NOT NULL,
  `to_warehouse_id` INT NOT NULL,
  `transfer_date` DATE NOT NULL,
  `expected_receipt_date` DATE,
  `actual_receipt_date` DATE,
  `status` VARCHAR(50) NOT NULL DEFAULT 'draft',
  `shipping_method` VARCHAR(100),
  `tracking_number` VARCHAR(100),
  `notes` TEXT,
  `created_by` INT,
  `approved_by` INT,
  `received_by` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_transfer_number` (`transfer_number`),
  KEY `idx_transfer_org` (`organization_id`),
  KEY `idx_transfer_from` (`from_warehouse_id`),
  KEY `idx_transfer_to` (`to_warehouse_id`),
  KEY `idx_transfer_status` (`status`),
  KEY `idx_transfer_date` (`transfer_date`),
  CONSTRAINT `fk_transfer_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_transfer_from` FOREIGN KEY (`from_warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_transfer_to` FOREIGN KEY (`to_warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_transfer_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_transfer_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_transfer_received_by` FOREIGN KEY (`received_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stock transfer items
CREATE TABLE `stock_transfer_items` (
  `transfer_item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `transfer_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `batch_id` INT,
  `quantity_requested` INT NOT NULL,
  `quantity_transferred` INT DEFAULT 0,
  `quantity_received` INT DEFAULT 0,
  `notes` TEXT,
  KEY `idx_transfer_item_transfer` (`transfer_id`),
  KEY `idx_transfer_item_product` (`product_id`),
  CONSTRAINT `fk_transfer_item_transfer` FOREIGN KEY (`transfer_id`) REFERENCES `stock_transfers` (`transfer_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_transfer_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_transfer_item_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CUSTOMER MANAGEMENT
-- =====================================================

-- Customer groups
CREATE TABLE `customer_groups` (
  `group_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `group_name` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `discount_percentage` DECIMAL(5, 2) DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_customer_group_org` (`organization_id`),
  KEY `idx_customer_group_active` (`is_active`),
  CONSTRAINT `fk_customer_group_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customers table
CREATE TABLE `customers` (
  `customer_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `customer_code` VARCHAR(50) NOT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_group_id` INT,
  `contact_person` VARCHAR(200),
  `email` VARCHAR(255),
  `phone` VARCHAR(20),
  `alternate_phone` VARCHAR(20),
  `billing_address` TEXT,
  `billing_city_id` INT,
  `billing_postal_code` VARCHAR(20),
  `shipping_address` TEXT,
  `shipping_city_id` INT,
  `shipping_postal_code` VARCHAR(20),
  `tax_id` VARCHAR(50),
  `credit_limit` DECIMAL(15, 2),
  `credit_days` INT DEFAULT 0,
  `total_outstanding` DECIMAL(15, 2) DEFAULT 0,
  `rating` DECIMAL(3, 2),
  `preferred_payment_method` ENUM('cash', 'credit_card', 'bank_transfer', 'cheque', 'upi', 'wallet'),
  `loyalty_points` INT DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `tags` JSON,
  `notes` TEXT,
  `metadata` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT,
  UNIQUE KEY `idx_customer_code_org` (`organization_id`, `customer_code`),
  KEY `idx_customer_org` (`organization_id`),
  KEY `idx_customer_group` (`customer_group_id`),
  KEY `idx_customer_email` (`email`),
  KEY `idx_customer_phone` (`phone`),
  KEY `idx_customer_active` (`is_active`),
  KEY `idx_customer_deleted` (`deleted_at`),
  FULLTEXT KEY `idx_customer_search` (`customer_name`, `customer_code`),
  CONSTRAINT `fk_customer_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_customer_group` FOREIGN KEY (`customer_group_id`) REFERENCES `customer_groups` (`group_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_customer_billing_city` FOREIGN KEY (`billing_city_id`) REFERENCES `cities` (`city_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_customer_shipping_city` FOREIGN KEY (`shipping_city_id`) REFERENCES `cities` (`city_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer specific pricing
CREATE TABLE `customer_pricing` (
  `pricing_id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `price` DECIMAL(15, 2) NOT NULL,
  `min_quantity` INT DEFAULT 1,
  `valid_from` DATE NOT NULL,
  `valid_to` DATE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_customer_pricing_customer` (`customer_id`),
  KEY `idx_customer_pricing_product` (`product_id`),
  KEY `idx_customer_pricing_valid` (`valid_from`, `valid_to`),
  CONSTRAINT `fk_customer_pricing_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_customer_pricing_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SUPPLIER MANAGEMENT
-- =====================================================

-- Suppliers table
CREATE TABLE `suppliers` (
  `supplier_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `supplier_code` VARCHAR(50) NOT NULL,
  `supplier_name` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(200),
  `email` VARCHAR(255),
  `phone` VARCHAR(20),
  `alternate_phone` VARCHAR(20),
  `website` VARCHAR(255),
  `address` TEXT,
  `city_id` INT,
  `postal_code` VARCHAR(20),
  `tax_id` VARCHAR(50),
  `registration_number` VARCHAR(50),
  `payment_terms` VARCHAR(100),
  `credit_limit` DECIMAL(15, 2),
  `credit_days` INT DEFAULT 0,
  `rating` DECIMAL(3, 2),
  `preferred_payment_method` ENUM('cash', 'credit_card', 'bank_transfer', 'cheque', 'upi', 'wallet'),
  `bank_details` JSON,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `tags` JSON,
  `notes` TEXT,
  `metadata` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT,
  UNIQUE KEY `idx_supplier_code_org` (`organization_id`, `supplier_code`),
  KEY `idx_supplier_org` (`organization_id`),
  KEY `idx_supplier_email` (`email`),
  KEY `idx_supplier_phone` (`phone`),
  KEY `idx_supplier_active` (`is_active`),
  KEY `idx_supplier_deleted` (`deleted_at`),
  FULLTEXT KEY `idx_supplier_search` (`supplier_name`, `supplier_code`),
  CONSTRAINT `fk_supplier_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_supplier_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`city_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Supplier products mapping
CREATE TABLE `supplier_products` (
  `supplier_product_id` INT AUTO_INCREMENT PRIMARY KEY,
  `supplier_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `supplier_sku` VARCHAR(100),
  `supplier_price` DECIMAL(15, 2) NOT NULL,
  `currency` VARCHAR(10) DEFAULT 'USD',
  `lead_time_days` INT,
  `min_order_quantity` INT DEFAULT 1,
  `is_preferred` BOOLEAN DEFAULT FALSE,
  `last_purchase_date` DATE,
  `last_purchase_price` DECIMAL(15, 2),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_supplier_product_unique` (`supplier_id`, `product_id`),
  KEY `idx_supplier_product_supplier` (`supplier_id`),
  KEY `idx_supplier_product_product` (`product_id`),
  KEY `idx_supplier_product_preferred` (`is_preferred`),
  CONSTRAINT `fk_supplier_product_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_supplier_product_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SALES ORDERS
-- =====================================================

-- Sales channels
CREATE TABLE `sales_channels` (
  `channel_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `channel_name` VARCHAR(200) NOT NULL,
  `channel_type` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_channel_org` (`organization_id`),
  KEY `idx_channel_active` (`is_active`),
  CONSTRAINT `fk_channel_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sales orders
CREATE TABLE `sales_orders` (
  `order_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `order_number` VARCHAR(50) NOT NULL,
  `customer_id` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `order_date` DATE NOT NULL,
  `expected_delivery_date` DATE,
  `actual_delivery_date` DATE,
  `status` ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'on_hold') NOT NULL DEFAULT 'pending',
  `subtotal` DECIMAL(15, 2) DEFAULT 0,
  `tax_amount` DECIMAL(15, 2) DEFAULT 0,
  `shipping_cost` DECIMAL(15, 2) DEFAULT 0,
  `discount_amount` DECIMAL(15, 2) DEFAULT 0,
  `total_amount` DECIMAL(15, 2) DEFAULT 0,
  `paid_amount` DECIMAL(15, 2) DEFAULT 0,
  `payment_status` ENUM('unpaid', 'partially_paid', 'paid', 'overpaid', 'refunded') NOT NULL DEFAULT 'unpaid',
  `currency` VARCHAR(10) DEFAULT 'USD',
  `shipping_address` TEXT,
  `billing_address` TEXT,
  `customer_po` VARCHAR(100),
  `sales_channel_id` INT,
  `notes` TEXT,
  `internal_notes` TEXT,
  `attachments` JSON,
  `created_by` INT,
  `approved_by` INT,
  `approved_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT,
  UNIQUE KEY `idx_order_number` (`order_number`),
  KEY `idx_order_org` (`organization_id`),
  KEY `idx_order_customer` (`customer_id`),
  KEY `idx_order_warehouse` (`warehouse_id`),
  KEY `idx_order_status` (`status`),
  KEY `idx_order_payment_status` (`payment_status`),
  KEY `idx_order_date` (`order_date`),
  KEY `idx_order_deleted` (`deleted_at`),
  CONSTRAINT `fk_order_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_channel` FOREIGN KEY (`sales_channel_id`) REFERENCES `sales_channels` (`channel_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sales order items
CREATE TABLE `sales_order_items` (
  `order_item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `batch_id` INT,
  `serial_number_id` INT,
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(15, 2) NOT NULL,
  `tax_rate_id` INT,
  `tax_amount` DECIMAL(15, 2) DEFAULT 0,
  `discount` DECIMAL(15, 2) DEFAULT 0,
  `fulfilled_quantity` INT DEFAULT 0,
  `line_total` DECIMAL(15, 2) GENERATED ALWAYS AS ((`quantity` * `unit_price`) + `tax_amount` - `discount`) STORED,
  `notes` TEXT,
  KEY `idx_order_item_order` (`order_id`),
  KEY `idx_order_item_product` (`product_id`),
  CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `sales_orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_item_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_item_serial` FOREIGN KEY (`serial_number_id`) REFERENCES `serial_numbers` (`serial_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_order_item_tax` FOREIGN KEY (`tax_rate_id`) REFERENCES `tax_rates` (`tax_rate_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sales returns
CREATE TABLE `sales_returns` (
  `return_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `return_number` VARCHAR(50) NOT NULL,
  `order_id` INT,
  `customer_id` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `return_date` DATE NOT NULL,
  `status` ENUM('requested', 'approved', 'rejected', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'requested',
  `total_amount` DECIMAL(15, 2),
  `refunded_amount` DECIMAL(15, 2) DEFAULT 0,
  `restocking_fee` DECIMAL(15, 2) DEFAULT 0,
  `reason` TEXT,
  `notes` TEXT,
  `created_by` INT,
  `approved_by` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_return_number` (`return_number`),
  KEY `idx_return_org` (`organization_id`),
  KEY `idx_return_order` (`order_id`),
  KEY `idx_return_customer` (`customer_id`),
  KEY `idx_return_status` (`status`),
  KEY `idx_return_date` (`return_date`),
  CONSTRAINT `fk_return_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_return_order` FOREIGN KEY (`order_id`) REFERENCES `sales_orders` (`order_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_return_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_return_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_return_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_return_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sales return items
CREATE TABLE `sales_return_items` (
  `return_item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `return_id` INT NOT NULL,
  `order_item_id` INT,
  `product_id` INT NOT NULL,
  `batch_id` INT,
  `serial_number_id` INT,
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(15, 2) NOT NULL,
  `refund_amount` DECIMAL(15, 2),
  `reason` TEXT,
  `condition` VARCHAR(50),
  `action` VARCHAR(50),
  KEY `idx_return_item_return` (`return_id`),
  KEY `idx_return_item_product` (`product_id`),
  CONSTRAINT `fk_return_item_return` FOREIGN KEY (`return_id`) REFERENCES `sales_returns` (`return_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_return_item_order_item` FOREIGN KEY (`order_item_id`) REFERENCES `sales_order_items` (`order_item_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_return_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_return_item_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_return_item_serial` FOREIGN KEY (`serial_number_id`) REFERENCES `serial_numbers` (`serial_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PURCHASE ORDERS
-- =====================================================

-- Purchase orders
CREATE TABLE `purchase_orders` (
  `po_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `po_number` VARCHAR(50) NOT NULL,
  `supplier_id` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `order_date` DATE NOT NULL,
  `expected_delivery_date` DATE,
  `actual_delivery_date` DATE,
  `status` ENUM('draft', 'submitted', 'approved', 'rejected', 'partially_received', 'received', 'closed', 'cancelled') NOT NULL DEFAULT 'draft',
  `subtotal` DECIMAL(15, 2) DEFAULT 0,
  `tax_amount` DECIMAL(15, 2) DEFAULT 0,
  `shipping_cost` DECIMAL(15, 2) DEFAULT 0,
  `discount` DECIMAL(15, 2) DEFAULT 0,
  `total_amount` DECIMAL(15, 2) DEFAULT 0,
  `paid_amount` DECIMAL(15, 2) DEFAULT 0,
  `payment_status` ENUM('unpaid', 'partially_paid', 'paid', 'overpaid', 'refunded') NOT NULL DEFAULT 'unpaid',
  `currency` VARCHAR(10) DEFAULT 'USD',
  `exchange_rate` DECIMAL(10, 4) DEFAULT 1,
  `payment_terms` VARCHAR(100),
  `notes` TEXT,
  `internal_notes` TEXT,
  `attachments` JSON,
  `created_by` INT,
  `approved_by` INT,
  `approved_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT,
  UNIQUE KEY `idx_po_number` (`po_number`),
  KEY `idx_po_org` (`organization_id`),
  KEY `idx_po_supplier` (`supplier_id`),
  KEY `idx_po_warehouse` (`warehouse_id`),
  KEY `idx_po_status` (`status`),
  KEY `idx_po_payment_status` (`payment_status`),
  KEY `idx_po_date` (`order_date`),
  KEY `idx_po_deleted` (`deleted_at`),
  CONSTRAINT `fk_po_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_po_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_po_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_po_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_po_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Purchase order items
CREATE TABLE `purchase_order_items` (
  `po_item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `po_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(15, 2) NOT NULL,
  `tax_rate_id` INT,
  `tax_amount` DECIMAL(15, 2) DEFAULT 0,
  `discount` DECIMAL(15, 2) DEFAULT 0,
  `received_quantity` INT NOT NULL DEFAULT 0,
  `line_total` DECIMAL(15, 2) GENERATED ALWAYS AS ((`quantity` * `unit_price`) + `tax_amount` - `discount`) STORED,
  `notes` TEXT,
  KEY `idx_po_item_po` (`po_id`),
  KEY `idx_po_item_product` (`product_id`),
  CONSTRAINT `fk_po_item_po` FOREIGN KEY (`po_id`) REFERENCES `purchase_orders` (`po_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_po_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_po_item_tax` FOREIGN KEY (`tax_rate_id`) REFERENCES `tax_rates` (`tax_rate_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Goods receipt notes
CREATE TABLE `goods_receipt_notes` (
  `grn_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `grn_number` VARCHAR(50) NOT NULL,
  `po_id` INT,
  `warehouse_id` INT NOT NULL,
  `receipt_date` DATE NOT NULL,
  `received_by` INT,
  `inspected_by` INT,
  `quality_status` VARCHAR(50) DEFAULT 'pending',
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_grn_number` (`grn_number`),
  KEY `idx_grn_org` (`organization_id`),
  KEY `idx_grn_po` (`po_id`),
  KEY `idx_grn_warehouse` (`warehouse_id`),
  KEY `idx_grn_date` (`receipt_date`),
  CONSTRAINT `fk_grn_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_grn_po` FOREIGN KEY (`po_id`) REFERENCES `purchase_orders` (`po_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_grn_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_grn_received_by` FOREIGN KEY (`received_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_grn_inspected_by` FOREIGN KEY (`inspected_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- GRN items
CREATE TABLE `goods_receipt_note_items` (
  `grn_item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `grn_id` INT NOT NULL,
  `po_item_id` INT,
  `product_id` INT NOT NULL,
  `batch_id` INT,
  `quantity_ordered` INT NOT NULL,
  `quantity_received` INT NOT NULL,
  `quantity_accepted` INT NOT NULL,
  `quantity_rejected` INT DEFAULT 0,
  `rejection_reason` TEXT,
  `notes` TEXT,
  KEY `idx_grn_item_grn` (`grn_id`),
  KEY `idx_grn_item_product` (`product_id`),
  CONSTRAINT `fk_grn_item_grn` FOREIGN KEY (`grn_id`) REFERENCES `goods_receipt_notes` (`grn_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_grn_item_po_item` FOREIGN KEY (`po_item_id`) REFERENCES `purchase_order_items` (`po_item_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_grn_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_grn_item_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Purchase returns
CREATE TABLE `purchase_returns` (
  `return_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `return_number` VARCHAR(50) NOT NULL,
  `po_id` INT,
  `supplier_id` INT NOT NULL,
  `warehouse_id` INT NOT NULL,
  `return_date` DATE NOT NULL,
  `status` ENUM('requested', 'approved', 'rejected', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'requested',
  `total_amount` DECIMAL(15, 2),
  `refunded_amount` DECIMAL(15, 2) DEFAULT 0,
  `reason` TEXT,
  `notes` TEXT,
  `created_by` INT,
  `approved_by` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_purchase_return_number` (`return_number`),
  KEY `idx_purchase_return_org` (`organization_id`),
  KEY `idx_purchase_return_po` (`po_id`),
  KEY `idx_purchase_return_supplier` (`supplier_id`),
  KEY `idx_purchase_return_status` (`status`),
  CONSTRAINT `fk_purchase_return_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_purchase_return_po` FOREIGN KEY (`po_id`) REFERENCES `purchase_orders` (`po_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_purchase_return_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_purchase_return_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_purchase_return_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_purchase_return_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Purchase return items
CREATE TABLE `purchase_return_items` (
  `return_item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `return_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `batch_id` INT,
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(15, 2) NOT NULL,
  `reason` TEXT,
  `condition` VARCHAR(50),
  KEY `idx_purchase_return_item_return` (`return_id`),
  KEY `idx_purchase_return_item_product` (`product_id`),
  CONSTRAINT `fk_purchase_return_item_return` FOREIGN KEY (`return_id`) REFERENCES `purchase_returns` (`return_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_purchase_return_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_purchase_return_item_batch` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INVOICING & PAYMENTS
-- =====================================================

-- Invoices
CREATE TABLE `invoices` (
  `invoice_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `invoice_number` VARCHAR(50) NOT NULL,
  `invoice_type` ENUM('sales', 'purchase', 'credit_note', 'debit_note', 'proforma') NOT NULL,
  `reference_type` VARCHAR(50),
  `reference_id` INT,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` INT NOT NULL,
  `invoice_date` DATE NOT NULL,
  `due_date` DATE,
  `status` ENUM('draft', 'sent', 'viewed', 'partially_paid', 'paid', 'overdue', 'cancelled', 'refunded') NOT NULL DEFAULT 'draft',
  `subtotal` DECIMAL(15, 2) NOT NULL,
  `tax_amount` DECIMAL(15, 2) DEFAULT 0,
  `discount` DECIMAL(15, 2) DEFAULT 0,
  `total_amount` DECIMAL(15, 2) NOT NULL,
  `paid_amount` DECIMAL(15, 2) DEFAULT 0,
  `balance_due` DECIMAL(15, 2) GENERATED ALWAYS AS (`total_amount` - `paid_amount`) STORED,
  `currency` VARCHAR(10) DEFAULT 'USD',
  `billing_address` TEXT,
  `shipping_address` TEXT,
  `notes` TEXT,
  `terms_and_conditions` TEXT,
  `attachments` JSON,
  `sent_at` TIMESTAMP NULL,
  `viewed_at` TIMESTAMP NULL,
  `created_by` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT,
  UNIQUE KEY `idx_invoice_number` (`invoice_number`),
  KEY `idx_invoice_org` (`organization_id`),
  KEY `idx_invoice_type` (`invoice_type`),
  KEY `idx_invoice_entity` (`entity_type`, `entity_id`),
  KEY `idx_invoice_status` (`status`),
  KEY `idx_invoice_date` (`invoice_date`),
  KEY `idx_invoice_due_date` (`due_date`),
  KEY `idx_invoice_deleted` (`deleted_at`),
  CONSTRAINT `fk_invoice_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_invoice_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Invoice items
CREATE TABLE `invoice_items` (
  `invoice_item_id` INT AUTO_INCREMENT PRIMARY KEY,
  `invoice_id` INT NOT NULL,
  `product_id` INT,
  `description` TEXT NOT NULL,
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(15, 2) NOT NULL,
  `tax_rate_id` INT,
  `tax_amount` DECIMAL(15, 2) DEFAULT 0,
  `discount` DECIMAL(15, 2) DEFAULT 0,
  `line_total` DECIMAL(15, 2) GENERATED ALWAYS AS ((`quantity` * `unit_price`) + `tax_amount` - `discount`) STORED,
  KEY `idx_invoice_item_invoice` (`invoice_id`),
  KEY `idx_invoice_item_product` (`product_id`),
  CONSTRAINT `fk_invoice_item_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_invoice_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_invoice_item_tax` FOREIGN KEY (`tax_rate_id`) REFERENCES `tax_rates` (`tax_rate_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments
CREATE TABLE `payments` (
  `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `payment_number` VARCHAR(50) NOT NULL,
  `invoice_id` INT,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` INT NOT NULL,
  `payment_date` DATE NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL,
  `payment_method` ENUM('cash', 'credit_card', 'debit_card', 'bank_transfer', 'cheque', 'upi', 'wallet', 'other') NOT NULL,
  `reference_number` VARCHAR(100),
  `notes` TEXT,
  `attachments` JSON,
  `created_by` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_payment_number` (`payment_number`),
  KEY `idx_payment_org` (`organization_id`),
  KEY `idx_payment_invoice` (`invoice_id`),
  KEY `idx_payment_entity` (`entity_type`, `entity_id`),
  KEY `idx_payment_date` (`payment_date`),
  CONSTRAINT `fk_payment_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_payment_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_payment_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment allocations
CREATE TABLE `payment_allocations` (
  `allocation_id` INT AUTO_INCREMENT PRIMARY KEY,
  `payment_id` INT NOT NULL,
  `invoice_id` INT NOT NULL,
  `allocated_amount` DECIMAL(15, 2) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_allocation_payment` (`payment_id`),
  KEY `idx_allocation_invoice` (`invoice_id`),
  CONSTRAINT `fk_allocation_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_allocation_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SHIPPING & LOGISTICS
-- =====================================================

-- Shipping carriers
CREATE TABLE `shipping_carriers` (
  `carrier_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `carrier_name` VARCHAR(200) NOT NULL,
  `carrier_code` VARCHAR(50),
  `contact_person` VARCHAR(200),
  `phone` VARCHAR(20),
  `email` VARCHAR(255),
  `website` VARCHAR(255),
  `tracking_url_template` TEXT,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_carrier_org` (`organization_id`),
  KEY `idx_carrier_active` (`is_active`),
  CONSTRAINT `fk_carrier_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shipments
CREATE TABLE `shipments` (
  `shipment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `shipment_number` VARCHAR(50) NOT NULL,
  `order_id` INT,
  `carrier_id` INT,
  `tracking_number` VARCHAR(100),
  `shipped_date` TIMESTAMP NULL,
  `estimated_delivery` TIMESTAMP NULL,
  `actual_delivery` TIMESTAMP NULL,
  `status` ENUM('pending', 'picked', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned', 'cancelled') NOT NULL DEFAULT 'pending',
  `shipping_cost` DECIMAL(15, 2),
  `weight` DECIMAL(10, 3),
  `dimensions` JSON,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_shipment_number` (`shipment_number`),
  KEY `idx_shipment_org` (`organization_id`),
  KEY `idx_shipment_order` (`order_id`),
  KEY `idx_shipment_carrier` (`carrier_id`),
  KEY `idx_shipment_status` (`status`),
  KEY `idx_shipment_tracking` (`tracking_number`),
  CONSTRAINT `fk_shipment_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_shipment_order` FOREIGN KEY (`order_id`) REFERENCES `sales_orders` (`order_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_shipment_carrier` FOREIGN KEY (`carrier_id`) REFERENCES `shipping_carriers` (`carrier_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Delivery notes
CREATE TABLE `delivery_notes` (
  `delivery_note_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `delivery_note_number` VARCHAR(50) NOT NULL,
  `order_id` INT,
  `shipment_id` INT,
  `delivery_date` DATE NOT NULL,
  `delivered_by` INT,
  `received_by` VARCHAR(200),
  `signature` TEXT,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_delivery_note_number` (`delivery_note_number`),
  KEY `idx_delivery_note_org` (`organization_id`),
  KEY `idx_delivery_note_order` (`order_id`),
  KEY `idx_delivery_note_shipment` (`shipment_id`),
  CONSTRAINT `fk_delivery_note_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_delivery_note_order` FOREIGN KEY (`order_id`) REFERENCES `sales_orders` (`order_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_delivery_note_shipment` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`shipment_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_delivery_note_delivered_by` FOREIGN KEY (`delivered_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PRICING & DISCOUNTS
-- =====================================================

-- Pricing rules
CREATE TABLE `pricing_rules` (
  `rule_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `rule_name` VARCHAR(200) NOT NULL,
  `rule_type` ENUM('volume', 'customer', 'product', 'category', 'promotional', 'seasonal') NOT NULL,
  `applicable_on` VARCHAR(50) NOT NULL,
  `entity_id` INT,
  `min_quantity` INT,
  `max_quantity` INT,
  `discount_type` VARCHAR(50) NOT NULL,
  `discount_value` DECIMAL(15, 2) NOT NULL,
  `priority` INT DEFAULT 0,
  `valid_from` DATE NOT NULL,
  `valid_to` DATE,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_pricing_rule_org` (`organization_id`),
  KEY `idx_pricing_rule_type` (`rule_type`),
  KEY `idx_pricing_rule_valid` (`valid_from`, `valid_to`),
  KEY `idx_pricing_rule_active` (`is_active`),
  CONSTRAINT `fk_pricing_rule_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tax exemptions
CREATE TABLE `tax_exemptions` (
  `exemption_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` INT NOT NULL,
  `tax_rate_id` INT,
  `exemption_certificate` VARCHAR(100),
  `valid_from` DATE NOT NULL,
  `valid_to` DATE,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_tax_exemption_org` (`organization_id`),
  KEY `idx_tax_exemption_entity` (`entity_type`, `entity_id`),
  KEY `idx_tax_exemption_valid` (`valid_from`, `valid_to`),
  CONSTRAINT `fk_tax_exemption_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tax_exemption_tax_rate` FOREIGN KEY (`tax_rate_id`) REFERENCES `tax_rates` (`tax_rate_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- FILES & DOCUMENTS
-- =====================================================

-- Files table
CREATE TABLE `files` (
  `file_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_type` ENUM('image', 'document', 'spreadsheet', 'pdf', 'video', 'audio', 'archive', 'other') NOT NULL,
  `mime_type` VARCHAR(100),
  `file_size` INT NOT NULL,
  `file_path` TEXT NOT NULL,
  `file_url` TEXT,
  `entity_type` VARCHAR(50),
  `entity_id` INT,
  `uploaded_by` INT,
  `is_public` BOOLEAN DEFAULT FALSE,
  `metadata` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT,
  KEY `idx_file_org` (`organization_id`),
  KEY `idx_file_entity` (`entity_type`, `entity_id`),
  KEY `idx_file_type` (`file_type`),
  KEY `idx_file_deleted` (`deleted_at`),
  CONSTRAINT `fk_file_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_file_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- REPORTING & ANALYTICS
-- =====================================================

-- Saved reports
CREATE TABLE `saved_reports` (
  `report_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `report_name` VARCHAR(200) NOT NULL,
  `report_type` ENUM('sales', 'inventory', 'financial', 'custom', 'analytics') NOT NULL,
  `description` TEXT,
  `configuration` JSON NOT NULL,
  `created_by` INT,
  `is_public` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_report_org` (`organization_id`),
  KEY `idx_report_type` (`report_type`),
  KEY `idx_report_created_by` (`created_by`),
  CONSTRAINT `fk_report_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Report schedules
CREATE TABLE `report_schedules` (
  `schedule_id` INT AUTO_INCREMENT PRIMARY KEY,
  `report_id` INT NOT NULL,
  `schedule_name` VARCHAR(200) NOT NULL,
  `frequency` VARCHAR(50) NOT NULL,
  `cron_expression` VARCHAR(100),
  `format` ENUM('pdf', 'excel', 'csv', 'html') NOT NULL DEFAULT 'pdf',
  `recipients` JSON,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `last_run_at` TIMESTAMP NULL,
  `next_run_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_schedule_report` (`report_id`),
  KEY `idx_schedule_active` (`is_active`),
  KEY `idx_schedule_next_run` (`next_run_at`),
  CONSTRAINT `fk_schedule_report` FOREIGN KEY (`report_id`) REFERENCES `saved_reports` (`report_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dashboard widgets
CREATE TABLE `dashboard_widgets` (
  `widget_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `user_id` INT,
  `widget_type` VARCHAR(100) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `configuration` JSON NOT NULL,
  `position` JSON,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_widget_org` (`organization_id`),
  KEY `idx_widget_user` (`user_id`),
  KEY `idx_widget_type` (`widget_type`),
  CONSTRAINT `fk_widget_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_widget_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- NOTIFICATIONS & ALERTS
-- =====================================================

-- Notification preferences
CREATE TABLE `notification_preferences` (
  `preference_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `notification_type` ENUM('order_updates', 'inventory_alerts', 'payment_reminders', 'system_alerts', 'marketing', 'security') NOT NULL,
  `in_app_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `email_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `sms_enabled` BOOLEAN NOT NULL DEFAULT FALSE,
  `push_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_notif_pref_user_type` (`user_id`, `notification_type`),
  KEY `idx_notif_pref_user` (`user_id`),
  CONSTRAINT `fk_notif_pref_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications
CREATE TABLE `notifications` (
  `notification_id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `organization_id` INT,
  `type` ENUM('order_updates', 'inventory_alerts', 'payment_reminders', 'system_alerts', 'marketing', 'security') NOT NULL,
  `channel` ENUM('in_app', 'email', 'sms', 'push') NOT NULL DEFAULT 'in_app',
  `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `action_url` TEXT,
  `metadata` JSON,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `read_at` TIMESTAMP NULL,
  `sent_at` TIMESTAMP NULL,
  `expires_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_notif_user` (`user_id`),
  KEY `idx_notif_org` (`organization_id`),
  KEY `idx_notif_read` (`is_read`),
  KEY `idx_notif_type` (`type`),
  KEY `idx_notif_created` (`created_at`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notif_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AUDIT & LOGGING
-- =====================================================

-- Audit logs
CREATE TABLE `audit_logs` (
  `audit_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT,
  `user_id` INT,
  `action` ENUM('create', 'update', 'delete', 'view', 'export', 'login', 'logout', 'approve', 'reject') NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` INT,
  `old_values` JSON,
  `new_values` JSON,
  `changed_fields` JSON,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `metadata` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_audit_org` (`organization_id`),
  KEY `idx_audit_user` (`user_id`),
  KEY `idx_audit_entity` (`entity_type`, `entity_id`),
  KEY `idx_audit_action` (`action`),
  KEY `idx_audit_created` (`created_at`),
  CONSTRAINT `fk_audit_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SUBSCRIPTION & BILLING
-- =====================================================

-- Subscription plans
CREATE TABLE `subscription_plans` (
  `plan_id` INT AUTO_INCREMENT PRIMARY KEY,
  `plan_name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10, 2) NOT NULL,
  `billing_interval` ENUM('monthly', 'quarterly', 'yearly') NOT NULL DEFAULT 'monthly',
  `features` JSON,
  `trial_days` INT DEFAULT 14,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_plan_slug` (`slug`),
  KEY `idx_plan_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subscriptions
CREATE TABLE `subscriptions` (
  `subscription_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `plan_id` INT NOT NULL,
  `status` ENUM('trialing', 'active', 'past_due', 'cancelled', 'unpaid', 'expired') NOT NULL DEFAULT 'trialing',
  `current_period_start` TIMESTAMP NOT NULL,
  `current_period_end` TIMESTAMP NOT NULL,
  `trial_start` TIMESTAMP NULL,
  `trial_end` TIMESTAMP NULL,
  `cancelled_at` TIMESTAMP NULL,
  `cancel_at_period_end` BOOLEAN DEFAULT FALSE,
  `metadata` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_subscription_org` (`organization_id`),
  KEY `idx_subscription_plan` (`plan_id`),
  KEY `idx_subscription_status` (`status`),
  CONSTRAINT `fk_subscription_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_subscription_plan` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`plan_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usage tracking
CREATE TABLE `usage_tracking` (
  `usage_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `period` DATE NOT NULL,
  `metric_name` VARCHAR(100) NOT NULL,
  `current_value` INT NOT NULL DEFAULT 0,
  `limit_value` INT,
  `metadata` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_usage_org_period_metric` (`organization_id`, `period`, `metric_name`),
  KEY `idx_usage_org` (`organization_id`),
  KEY `idx_usage_period` (`period`),
  CONSTRAINT `fk_usage_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- API & INTEGRATIONS
-- =====================================================

-- API keys
CREATE TABLE `api_keys` (
  `api_key_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `key_name` VARCHAR(200) NOT NULL,
  `key_hash` VARCHAR(255) NOT NULL,
  `key_prefix` VARCHAR(20) NOT NULL,
  `permissions` JSON,
  `expires_at` TIMESTAMP NULL,
  `last_used_at` TIMESTAMP NULL,
  `usage_count` INT DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_by` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_api_key_hash` (`key_hash`),
  KEY `idx_api_key_org` (`organization_id`),
  KEY `idx_api_key_prefix` (`key_prefix`),
  KEY `idx_api_key_active` (`is_active`),
  CONSTRAINT `fk_api_key_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_api_key_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Webhooks
CREATE TABLE `webhooks` (
  `webhook_id` INT AUTO_INCREMENT PRIMARY KEY,
  `organization_id` INT NOT NULL,
  `webhook_name` VARCHAR(200) NOT NULL,
  `url` TEXT NOT NULL,
  `secret` VARCHAR(255) NOT NULL,
  `events` JSON,
  `headers` JSON,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `failure_count` INT DEFAULT 0,
  `last_triggered_at` TIMESTAMP NULL,
  `created_by` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_webhook_org` (`organization_id`),
  KEY `idx_webhook_active` (`is_active`),
  CONSTRAINT `fk_webhook_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_webhook_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Webhook logs
CREATE TABLE `webhook_logs` (
  `log_id` INT AUTO_INCREMENT PRIMARY KEY,
  `webhook_id` INT NOT NULL,
  `event` VARCHAR(100) NOT NULL,
  `payload` JSON,
  `response_status` INT,
  `response_body` TEXT,
  `error_message` TEXT,
  `attempt_count` INT DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_webhook_log_webhook` (`webhook_id`),
  KEY `idx_webhook_log_event` (`event`),
  KEY `idx_webhook_log_created` (`created_at`),
  CONSTRAINT `fk_webhook_log_webhook` FOREIGN KEY (`webhook_id`) REFERENCES `webhooks` (`webhook_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PRISMA MIGRATIONS (for compatibility)
-- =====================================================

CREATE TABLE `_prisma_migrations` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `checksum` VARCHAR(64) NOT NULL,
  `finished_at` TIMESTAMP NULL,
  `migration_name` VARCHAR(255) NOT NULL,
  `logs` TEXT,
  `rolled_back_at` TIMESTAMP NULL,
  `started_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `applied_steps_count` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- RESTORE FOREIGN KEY CHECKS
-- =====================================================

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- PERFORMANCE OPTIMIZATION NOTES
-- =====================================================

-- Additional indexes for common queries can be added:
--
-- For products frequently searched by name/description:
-- Already included: FULLTEXT INDEX on products (product_name, description)
--
-- For customer/supplier searches:
-- Already included: FULLTEXT INDEX on customers/suppliers
--
-- For date range queries on transactions:
-- Already included: Indexes on created_at, order_date, etc.
--
-- For organization-wide queries:
-- Already included: Composite indexes on (organization_id, ...)
--
-- Consider partitioning large tables by date for better performance:
-- - audit_logs (partition by created_at)
-- - inventory_transactions (partition by transaction_date)
-- - login_history (partition by created_at)
--
-- Consider archiving old data periodically for:
-- - audit_logs older than 2 years
-- - login_history older than 1 year
-- - sessions older than 30 days
