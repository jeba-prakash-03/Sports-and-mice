<?php
// backend/models/Content.php

class Content {
    private $db;
    private $dataFile;

    public function __construct($db) {
        $this->db = $db;
        $this->dataFile = __DIR__ . '/../data/content.json';
    }

    public function getSection($sectionKey) {
        if ($this->db instanceof PDO) {
            $stmt = $this->db->prepare("SELECT content_json FROM site_content WHERE section_key = :k LIMIT 1");
            $stmt->execute([':k' => $sectionKey]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                return json_decode($row['content_json'], true);
            }
        } else {
            if (file_exists($this->dataFile)) {
                $all = json_decode(file_get_contents($this->dataFile), true) ?: [];
                if (isset($all[$sectionKey])) {
                    return $all[$sectionKey];
                }
            }
        }
        return null;
    }

    public function getAll() {
        if ($this->db instanceof PDO) {
            $stmt = $this->db->query("SELECT section_key, content_json FROM site_content");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $res = [];
            foreach ($rows as $r) {
                $res[$r['section_key']] = json_decode($r['content_json'], true);
            }
            return $res;
        } else {
            if (file_exists($this->dataFile)) {
                return json_decode(file_get_contents($this->dataFile), true) ?: [];
            }
            return [];
        }
    }

    public function saveSection($sectionKey, $data) {
        $json = json_encode($data, JSON_PRETTY_PRINT);

        if ($this->db instanceof PDO) {
            $stmt = $this->db->prepare("INSERT INTO site_content (section_key, content_json)
                                        VALUES (:k, :json)
                                        ON DUPLICATE KEY UPDATE content_json = :json2, updated_at = NOW()");
            return $stmt->execute([':k' => $sectionKey, ':json' => $json, ':json2' => $json]);
        } else {
            $all = $this->getAll();
            $all[$sectionKey] = $data;
            return file_put_contents($this->dataFile, json_encode($all, JSON_PRETTY_PRINT)) !== false;
        }
    }
}
