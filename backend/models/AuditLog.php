<?php
// backend/models/AuditLog.php

class AuditLog {
    private $db;
    private $jsonFile;

    public function __construct($db = null) {
        $this->db = $db;
        $this->jsonFile = __DIR__ . '/../data/audit_logs.json';
        if (!file_exists($this->jsonFile)) {
            file_put_contents($this->jsonFile, json_encode([], JSON_PRETTY_PRINT));
        }
    }

    public function log($adminEmail, $action, $target, $details = '') {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $logEntry = [
            'id' => 'log_' . time() . '_' . substr(md5(uniqid()), 0, 6),
            'admin_email' => $adminEmail ?: 'admin@sportsandmice.com',
            'action' => $action,
            'target' => $target,
            'details' => $details,
            'ip' => $ip,
            'created_at' => date('Y-m-d H:i:s')
        ];

        // Save to JSON
        $logs = [];
        if (file_exists($this->jsonFile)) {
            $content = file_get_contents($this->jsonFile);
            $logs = json_decode($content, true) ?: [];
        }
        array_unshift($logs, $logEntry);
        // Keep latest 200 logs
        if (count($logs) > 200) {
            $logs = array_slice($logs, 0, 200);
        }
        file_put_contents($this->jsonFile, json_encode($logs, JSON_PRETTY_PRINT));

        // Save to DB if table exists
        if ($this->db && ($this->db instanceof PDO)) {
            try {
                $query = "INSERT INTO audit_logs (admin_email, action, target, details, ip_address, created_at) 
                          VALUES (:email, :action, :target, :details, :ip, NOW())";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':email', $logEntry['admin_email']);
                $stmt->bindParam(':action', $logEntry['action']);
                $stmt->bindParam(':target', $logEntry['target']);
                $stmt->bindParam(':details', $logEntry['details']);
                $stmt->bindParam(':ip', $ip);
                $stmt->execute();
            } catch (Exception $e) {
                // Silently ignore DB error and use JSON
            }
        }

        return $logEntry;
    }

    public function getAll($limit = 100) {
        if (file_exists($this->jsonFile)) {
            $content = file_get_contents($this->jsonFile);
            $logs = json_decode($content, true) ?: [];
            return array_slice($logs, 0, $limit);
        }
        return [];
    }
}
