<?php
// backend/config/database.php

class Database {
    private $host = "127.0.0.1";
    private $db_name = "sports_and_mice";
    private $username = "root";
    private $password = "";
    private $conn = null;
    private $db_type = 'file'; // 'mysql', 'pgsql', or 'file'

    public function getConnection() {
        if ($this->conn !== null) {
            return $this->conn;
        }

        // Check if DATABASE_URL or SUPABASE_DB_URL is provided (e.g., postgresql://postgres:password@host:port/dbname)
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

                $host = $parsed['host'] ?? $this->host;
                $port = $parsed['port'] ?? ($dbType === 'pgsql' ? 5432 : 3306);
                $db_name = isset($parsed['path']) ? ltrim($parsed['path'], '/') : $this->db_name;
                $username = $parsed['user'] ?? $this->username;
                $password = $parsed['pass'] ?? $this->password;
            }
        } else {
            $host = getenv('DB_HOST') ?: getenv('PGHOST') ?: $this->host;
            $port = getenv('DB_PORT') ?: getenv('PGPORT') ?: ($dbType === 'pgsql' ? 5432 : 3306);
            $db_name = getenv('DB_NAME') ?: getenv('PGDATABASE') ?: $this->db_name;
            $username = getenv('DB_USER') ?: getenv('PGUSER') ?: $this->username;
            $password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : (getenv('PGPASSWORD') !== false ? getenv('PGPASSWORD') : $this->password);
        }

        // 1. Try PostgreSQL (Supabase) if configured or dbType is pgsql
        if ($dbType === 'pgsql' || getenv('PGHOST') || (isset($parsed) && strpos($parsed['scheme'], 'postgres') !== false)) {
            try {
                $dsn = "pgsql:host={$host};port={$port};dbname={$db_name};sslmode=require";
                $pdo = new PDO($dsn, $username, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]);

                $this->conn = $pdo;
                $this->db_type = 'pgsql';
                return $this->conn;
            } catch (Exception $e) {
                error_log("PostgreSQL connection error: " . $e->getMessage());
                // Fall through to MySQL or file storage
            }
        }

        // 2. Try MySQL if configured
        try {
            $dsn = "mysql:host=" . $host . ";charset=utf8mb4";
            $pdo = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);

            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $pdo->exec("USE `$db_name`");

            // Create users table
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

            // Seed default admin if not exists
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
            if ($stmt->fetch()['count'] == 0) {
                $seedStmt = $pdo->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)");
                $defaultPass = password_hash("admin123", PASSWORD_BCRYPT);
                $seedStmt->execute(["Marc Knuelle", "admin@sportsandmice.com", $defaultPass, "admin"]);
            }

            $this->conn = $pdo;
            $this->db_type = 'mysql';
            return $this->conn;
        } catch (Exception $e) {
            // 3. Fallback to resilient JSON file storage in backend/data/
            $this->db_type = 'file';
            $dataDir = __DIR__ . '/../data';
            if (!is_dir($dataDir)) {
                @mkdir($dataDir, 0777, true);
            }

            // Initialize files
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
