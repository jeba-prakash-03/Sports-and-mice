-- Database schema for Sports & MICE

CREATE DATABASE IF NOT EXISTS `sports_and_mice` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sports_and_mice`;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) DEFAULT 'admin',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Form Submissions Table
CREATE TABLE IF NOT EXISTS `form_submissions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `form_type` VARCHAR(50) NOT NULL DEFAULT 'contact',
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(100) DEFAULT '',
    `subject` VARCHAR(255) DEFAULT '',
    `message` TEXT NOT NULL,
    `form_data` JSON DEFAULT NULL,
    `status` ENUM('new', 'read', 'replied', 'archived') NOT NULL DEFAULT 'new',
    `notes` TEXT DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT '',
    `user_agent` TEXT DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_form_type` (`form_type`),
    INDEX `idx_email` (`email`),
    INDEX `idx_status` (`status`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Legacy Contacts Table (for backwards compatibility)
CREATE TABLE IF NOT EXISTS `contacts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `surname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) DEFAULT '',
    `city` VARCHAR(255) DEFAULT '',
    `address` VARCHAR(255) DEFAULT '',
    `message` TEXT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Settings Table
CREATE TABLE IF NOT EXISTS `site_settings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `setting_key` VARCHAR(100) NOT NULL UNIQUE,
    `setting_value` TEXT DEFAULT NULL,
    `category` VARCHAR(50) DEFAULT 'general',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Dynamic Content Table
CREATE TABLE IF NOT EXISTS `site_content` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `section_key` VARCHAR(100) NOT NULL UNIQUE,
    `content_json` JSON NOT NULL,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_section_key` (`section_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
