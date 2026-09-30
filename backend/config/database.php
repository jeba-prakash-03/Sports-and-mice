<?php
// backend/config/database.php

class Database {
    private $host = "127.0.0.1";
    private $port = 3306;
    private $db_name = "sports_and_mice";
    private $username = "root";
    private $password = "";
    private $conn = null;
    private $db_type = 'file'; // 'mysql', 'pgsql', or 'file'

    public function getConnection() {
        if ($this->conn !== null) {
            return $this->conn;
        }

        // 1. Load config from backend/config.php if available
        $configFile = __DIR__ . '/../config.php';
        $config = file_exists($configFile) ? (include $configFile) : [];
        $dbCfg = is_array($config) && isset($config['db']) ? $config['db'] : [];

        $host = getenv('DB_HOST') ?: ($dbCfg['host'] ?? $this->host);
        $port = getenv('DB_PORT') ?: ($dbCfg['port'] ?? $this->port);
        $db_name = getenv('DB_NAME') ?: ($dbCfg['name'] ?? $this->db_name);
        $username = getenv('DB_USER') ?: ($dbCfg['user'] ?? $this->username);
        $password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : (isset($dbCfg['pass']) ? $dbCfg['pass'] : $this->password);

        // Check if DATABASE_URL is provided (e.g. on Render/Supabase)
        $dbUrl = getenv('DATABASE_URL') ?: getenv('SUPABASE_DB_URL') ?: getenv('POSTGRES_URL');
        $dbType = strtolower(getenv('DB_TYPE') ?: '');

        if ($dbUrl) {
            $parsed = parse_url($dbUrl);
            if ($parsed && isset($parsed['scheme'])) {
                if (strpos($parsed['scheme'], 'postgres') !== false || strpos($parsed['scheme'], 'pgsql') !== false) {
                    $dbType = 'pgsql';
                } elseif (strpos($parsed['scheme'], 'mysql') !== false) {
                    $dbType = 'mysql';
                }

                $host = $parsed['host'] ?? $host;
                $port = $parsed['port'] ?? ($dbType === 'pgsql' ? 5432 : 3306);
                $db_name = isset($parsed['path']) ? ltrim($parsed['path'], '/') : $db_name;
                $username = isset($parsed['user']) ? urldecode($parsed['user']) : $username;
                $password = isset($parsed['pass']) ? urldecode($parsed['pass']) : $password;
            }
        }

        // 2. Try PostgreSQL if configured
        if ($dbType === 'pgsql' || getenv('PGHOST') || (isset($parsed) && strpos($parsed['scheme'], 'postgres') !== false)) {
            try {
                $dsn = "pgsql:host={$host};port={$port};dbname={$db_name};sslmode=require";
                $pdo = new PDO($dsn, $username, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]);

                $this->conn = $pdo;
                $this->db_type = 'pgsql';
                return $this->conn;
            } catch (Exception $e) {
                error_log("PostgreSQL connection notice: " . $e->getMessage());
            }
        }

        // 3. Try MySQL (Local MySQL & InfinityFree MySQL)
        try {
            // Connect to specific database
            $dsn = "mysql:host={$host};port={$port};dbname={$db_name};charset=utf8mb4";
            $pdo = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);

            // Auto-initialize required tables if needed
            $this->ensureTablesExist($pdo);

            $this->conn = $pdo;
            $this->db_type = 'mysql';
            return $this->conn;
        } catch (Exception $e) {
            // If database doesn't exist yet on local, attempt creation
            try {
                $rootDsn = "mysql:host={$host};port={$port};charset=utf8mb4";
                $rootPdo = new PDO($rootDsn, $username, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
                ]);
                $rootPdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                $rootPdo->exec("USE `$db_name`");
                $this->ensureTablesExist($rootPdo);
                $this->conn = $rootPdo;
                $this->db_type = 'mysql';
                return $this->conn;
            } catch (Exception $e2) {
                error_log("MySQL connection fallback: " . $e2->getMessage());
            }

            // 4. Fallback to resilient JSON file storage in backend/data/
            $this->db_type = 'file';
            $dataDir = __DIR__ . '/../data';
            if (!is_dir($dataDir)) {
                @mkdir($dataDir, 0777, true);
            }

            // Initialize default files
            $this->initFile($dataDir . '/users.json', [
                [
                    "id" => 1,
                    "name" => "Marc Knuelle",
                    "email" => "admin@sportsandmice.com",
                    "password_hash" => password_hash("admin123", PASSWORD_BCRYPT),
                    "role" => "admin",
                    "created_at" => date('Y-m-d H:i:s'),
                    "updated_at" => date('Y-m-d H:i:s')
                ]
            ]);

            $this->initFile($dataDir . '/form_submissions.json', []);
            $this->initFile($dataDir . '/contacts.json', []);
            $this->initFile($dataDir . '/settings.json', [
                "site_name" => "Sports & MICE",
                "company_name" => "K-Consulting Sports & MICE",
                "founder_name" => "Marc Knuelle",
                "phone" => "+49 2241 343320",
                "fax" => "+49 2241 344316",
                "email" => "contact@sportsandmice.com",
                "admin_notification_email" => "contact@sportsandmice.com",
                "address_street" => "Fritz-Pullig-Strasse 9",
                "address_city" => "53757 Sankt Augustin",
                "address_country" => "Germany",
                "linkedin_url" => "https://www.linkedin.com/in/marc-knuelle-427252161/",
                "smtp_host" => "smtp.example.com",
                "smtp_port" => "587",
                "smtp_user" => "mailer@sportsandmice.com",
                "smtp_pass" => "",
                "smtp_from" => "no-reply@sportsandmice.com",
                "smtp_from_name" => "Sports & MICE",
                "email_notifications_enabled" => "true",
                "visitor_autoresponder_enabled" => "true"
            ]);
            $this->initFile($dataDir . '/content.json', []);

            $this->conn = 'file_storage';
            return $this->conn;
        }
    }

    private function ensureTablesExist($pdo) {
        // Users Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(100) NOT NULL,
            `email` VARCHAR(150) NOT NULL UNIQUE,
            `password_hash` VARCHAR(255) NOT NULL,
            `role` VARCHAR(50) DEFAULT 'admin',
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX `idx_users_email` (`email`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Form Submissions Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `form_submissions` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Contacts Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `contacts` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `surname` VARCHAR(255) NOT NULL,
            `email` VARCHAR(255) NOT NULL,
            `country` VARCHAR(255) DEFAULT '',
            `city` VARCHAR(255) DEFAULT '',
            `address` VARCHAR(255) DEFAULT '',
            `message` TEXT NOT NULL,
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Site Settings Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `site_settings` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `setting_key` VARCHAR(100) NOT NULL UNIQUE,
            `setting_value` TEXT DEFAULT NULL,
            `category` VARCHAR(50) DEFAULT 'general',
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Site Content Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `site_content` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `section_key` VARCHAR(100) NOT NULL UNIQUE,
            `content_json` JSON NOT NULL,
            `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Content Versions Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `content_versions` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `version_number` INT NOT NULL,
            `page_id` VARCHAR(100) DEFAULT 'global',
            `content` LONGTEXT NOT NULL,
            `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
            `summary` VARCHAR(255) DEFAULT '',
            `created_by` VARCHAR(150) DEFAULT 'admin@sportsandmice.com',
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
            `published_at` DATETIME NULL,
            INDEX `idx_version` (`version_number`),
            INDEX `idx_status` (`status`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Audit Logs Table
        $pdo->exec("CREATE TABLE IF NOT EXISTS `audit_logs` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_email` VARCHAR(150) NOT NULL,
            `action` VARCHAR(100) NOT NULL,
            `target` VARCHAR(255) DEFAULT '',
            `details` TEXT DEFAULT NULL,
            `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Seed default admin if none exists
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM `users`");
        if ($stmt && $stmt->fetch()['count'] == 0) {
            $seedStmt = $pdo->prepare("INSERT INTO `users` (name, email, password_hash, role) VALUES (?, ?, ?, ?)");
            $defaultPass = password_hash("admin123", PASSWORD_BCRYPT);
            $seedStmt->execute(["Marc Knuelle", "admin@sportsandmice.com", $defaultPass, "admin"]);
        }
    }

    private function initFile($path, $defaultData) {
        if (!file_exists($path)) {
            @file_put_contents($path, json_encode($defaultData, JSON_PRETTY_PRINT));
        }
    }

    public function isMySQL() {
        return $this->db_type === 'mysql' || $this->db_type === 'pgsql';
    }

    public function getDbType() {
        return $this->db_type;
    }
}
