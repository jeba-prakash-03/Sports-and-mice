<?php
// backend/models/MediaManager.php

class MediaManager {
    private $db;
    private $jsonFile;
    private $publicUploadDir;
    private $backendUploadDir;

    public function __construct($db = null) {
        $this->db = $db;
        $this->jsonFile = __DIR__ . '/../data/media.json';
        $this->publicUploadDir = __DIR__ . '/../../frontend/public/uploads';
        $this->backendUploadDir = __DIR__ . '/../uploads';

        if (!is_dir($this->publicUploadDir)) {
            @mkdir($this->publicUploadDir, 0777, true);
        }
        if (!is_dir($this->backendUploadDir)) {
            @mkdir($this->backendUploadDir, 0777, true);
        }
        if (!file_exists($this->jsonFile)) {
            file_put_contents($this->jsonFile, json_encode($this->getDefaultMedia(), JSON_PRETTY_PRINT));
        }
    }

    public function getDefaultMedia() {
        return [
            [
                'id' => 'media_logo',
                'name' => 'logo.png',
                'url' => '/assets/images/logo.png',
                'alt_text' => 'Sports & MICE K-Consulting Logo',
                'category' => 'Branding',
                'size_kb' => 45,
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 'media_home_hero',
                'name' => 'home_hero_bg.jpg',
                'url' => '/assets/images/home_hero_bg.jpg',
                'alt_text' => 'Stadium Arena Lights Hero Background',
                'category' => 'Hero',
                'size_kb' => 320,
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 'media_service_hero',
                'name' => 'service_hero_bg.jpg',
                'url' => '/assets/images/service_hero_bg.jpg',
                'alt_text' => 'MICE Gala Dinner Background',
                'category' => 'Hero',
                'size_kb' => 280,
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 'media_referee',
                'name' => 'about_hockey_referee.jpeg',
                'url' => '/assets/images/about_hockey_referee.jpeg',
                'alt_text' => 'Marc Knuelle Field Hockey Referee',
                'category' => 'About',
                'size_kb' => 190,
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 'media_cancun',
                'name' => 'hotel_cancun.jpg',
                'url' => '/assets/images/hotel_cancun.jpg',
                'alt_text' => 'Fairmont Mayakoba Riviera Maya Cancun',
                'category' => 'Hotels',
                'size_kb' => 240,
                'created_at' => date('Y-m-d H:i:s')
            ],
            [
                'id' => 'media_dubai',
                'name' => 'hotel_dubai.jpg',
                'url' => '/assets/images/hotel_dubai.jpg',
                'alt_text' => 'Sofitel The Palm Dubai Resort',
                'category' => 'Hotels',
                'size_kb' => 260,
                'created_at' => date('Y-m-d H:i:s')
            ]
        ];
    }

    public function getAll() {
        if (file_exists($this->jsonFile)) {
            $content = file_get_contents($this->jsonFile);
            $items = json_decode($content, true);
            if ($items) return $items;
        }
        return $this->getDefaultMedia();
    }

    public function uploadFile($file, $altText = '', $category = 'Uploads') {
        if (!isset($file['error']) || is_array($file['error'])) {
            throw new RuntimeException('Invalid upload parameters.');
        }

        switch ($file['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                throw new RuntimeException('No file was uploaded.');
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                throw new RuntimeException('Exceeded file size limit (Max 8MB).');
            default:
                throw new RuntimeException('Unknown upload error.');
        }

        // Limit size to 8MB
        if ($file['size'] > 8 * 1024 * 1024) {
            throw new RuntimeException('File size exceeded 8MB.');
        }

        // Check MIME type
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);
        $allowedMimes = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/svg+xml' => 'svg',
            'image/gif' => 'gif'
        ];

        if (!isset($allowedMimes[$mime])) {
            throw new RuntimeException('Invalid file format. Allowed: JPG, PNG, WEBP, SVG, GIF.');
        }

        $ext = $allowedMimes[$mime];
        $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
        $filename = sprintf('%s_%s.%s', $safeName, substr(md5(uniqid()), 0, 8), $ext);

        // Check if Cloudinary is configured
        $cloudName = getenv('CLOUDINARY_CLOUD_NAME');
        $apiKey = getenv('CLOUDINARY_API_KEY');
        $apiSecret = getenv('CLOUDINARY_API_SECRET');
        $uploadPreset = getenv('CLOUDINARY_UPLOAD_PRESET');

        $cloudinaryUrl = getenv('CLOUDINARY_URL');
        if ($cloudinaryUrl && (!$cloudName || !$apiKey || !$apiSecret)) {
            // Parse cloudinary://API_KEY:API_SECRET@CLOUD_NAME
            if (preg_match('/cloudinary:\/\/([^:]+):([^@]+)@(.+)/', $cloudinaryUrl, $matches)) {
                $apiKey = $matches[1];
                $apiSecret = $matches[2];
                $cloudName = $matches[3];
            }
        }

        if ($cloudName && ($apiKey && $apiSecret || $uploadPreset)) {
            // Upload to Cloudinary via REST API
            $timestamp = time();
            $params = [
                'file' => new CURLFile($file['tmp_name'], $mime, $filename),
                'folder' => 'sports_and_mice'
            ];

            if ($uploadPreset) {
                $params['upload_preset'] = $uploadPreset;
            } else {
                $params['timestamp'] = $timestamp;
                $params['api_key'] = $apiKey;
                // Sign parameters
                $signStr = "folder=sports_and_mice&timestamp={$timestamp}{$apiSecret}";
                $params['signature'] = sha1($signStr);
            }

            $ch = curl_init("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200 && $response) {
                $cdata = json_decode($response, true);
                if (isset($cdata['secure_url'])) {
                    $mediaItem = [
                        'id' => 'cld_' . ($cdata['public_id'] ?? time()),
                        'name' => $filename,
                        'url' => $cdata['secure_url'],
                        'alt_text' => $altText ?: $safeName,
                        'category' => $category,
                        'size_kb' => round(($cdata['bytes'] ?? $file['size']) / 1024, 1),
                        'created_at' => date('Y-m-d H:i:s')
                    ];

                    $items = $this->getAll();
                    array_unshift($items, $mediaItem);
                    @file_put_contents($this->jsonFile, json_encode($items, JSON_PRETTY_PRINT));

                    return $mediaItem;
                }
            }
        }

        // Fallback to local storage
        $targetPublic = $this->publicUploadDir . '/' . $filename;
        $targetBackend = $this->backendUploadDir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $targetPublic)) {
            // If public uploads not accessible (e.g. separate server on Render), save to backend uploads
            if (!move_uploaded_file($file['tmp_name'], $targetBackend)) {
                @copy($file['tmp_name'], $targetBackend);
            }
        } else {
            @copy($targetPublic, $targetBackend);
        }

        $mediaItem = [
            'id' => 'med_' . time() . '_' . substr(md5(uniqid()), 0, 6),
            'name' => $filename,
            'url' => '/uploads/' . $filename,
            'alt_text' => $altText ?: $safeName,
            'category' => $category,
            'size_kb' => round($file['size'] / 1024, 1),
            'created_at' => date('Y-m-d H:i:s')
        ];

        $items = $this->getAll();
        array_unshift($items, $mediaItem);
        @file_put_contents($this->jsonFile, json_encode($items, JSON_PRETTY_PRINT));

        return $mediaItem;
    }

    public function delete($id) {
        $items = $this->getAll();
        $filtered = [];
        $found = null;

        foreach ($items as $item) {
            if ($item['id'] === $id) {
                $found = $item;
            } else {
                $filtered[] = $item;
            }
        }

        if ($found) {
            // Delete actual file if in uploads
            if (strpos($found['url'], '/uploads/') === 0) {
                $basename = basename($found['url']);
                @unlink($this->publicUploadDir . '/' . $basename);
                @unlink($this->backendUploadDir . '/' . $basename);
            }
            file_put_contents($this->jsonFile, json_encode($filtered, JSON_PRETTY_PRINT));
            return true;
        }

        return false;
    }
}
