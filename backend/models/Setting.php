<?php
// backend/models/Setting.php

class Setting {
    private $db;
    private $dataFile;

    public function __construct($db) {
        $this->db = $db;
        $this->dataFile = __DIR__ . '/../data/settings.json';
    }

    public function getAll() {
        if ($this->db instanceof PDO) {
            $stmt = $this->db->query("SELECT setting_key, setting_value, category FROM site_settings");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $settings = [];
            foreach ($rows as $r) {
                $settings[$r['setting_key']] = $r['setting_value'];
            }
            if (empty($settings)) {
                return $this->getDefaults();
            }
            return array_merge($this->getDefaults(), $settings);
        } else {
            if (file_exists($this->dataFile)) {
                $data = json_decode(file_get_contents($this->dataFile), true) ?: [];
                return array_merge($this->getDefaults(), $data);
            }
            return $this->getDefaults();
        }
    }

    public function updateAll($newSettings) {
        if (!is_array($newSettings)) {
            return false;
        }

        if ($this->db instanceof PDO) {
            $stmt = $this->db->prepare("INSERT INTO site_settings (setting_key, setting_value, category)
                                        VALUES (:k, :v, :cat)
                                        ON DUPLICATE KEY UPDATE setting_value = :v2, updated_at = NOW()");
            foreach ($newSettings as $key => $val) {
                $cat = strpos($key, 'smtp') !== false ? 'smtp' : (strpos($key, 'address') !== false ? 'contact' : 'general');
                $stmt->execute([':k' => $key, ':v' => (string)$val, ':cat' => $cat, ':v2' => (string)$val]);
            }
            return true;
        } else {
            $current = $this->getAll();
            $merged = array_merge($current, $newSettings);
            file_put_contents($this->dataFile, json_encode($merged, JSON_PRETTY_PRINT));
            return true;
        }
    }

    private function getDefaults() {
        return [
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
            "smtp_from_name" => "Sports & MICE Notification",
            "email_notifications_enabled" => "true",
            "visitor_autoresponder_enabled" => "true"
        ];
    }
}
