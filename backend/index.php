<?php
// backend/index.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Public APIs
if (strpos($uri, '/api/site-config') !== false) {
    require_once __DIR__ . '/api/site-config.php';
    exit;
} elseif (strpos($uri, '/api/contact') !== false) {
    require_once __DIR__ . '/api/contact.php';
    exit;
} elseif (strpos($uri, '/api/contacts') !== false) {
    require_once __DIR__ . '/api/contacts.php';
    exit;
} elseif (strpos($uri, '/api/health') !== false) {
    require_once __DIR__ . '/api/health.php';
    exit;
} elseif (strpos($uri, '/api/settings') !== false && strpos($uri, '/api/admin/settings') === false) {
    require_once __DIR__ . '/api/settings.php';
    exit;
} elseif (strpos($uri, '/api/content') !== false && strpos($uri, '/api/admin/content') === false) {
    require_once __DIR__ . '/api/content.php';
    exit;
}

// Auth APIs
elseif (strpos($uri, '/api/auth/login') !== false) {
    require_once __DIR__ . '/api/auth/login.php';
    exit;
} elseif (strpos($uri, '/api/auth/me') !== false) {
    require_once __DIR__ . '/api/auth/me.php';
    exit;
} elseif (strpos($uri, '/api/auth/profile') !== false) {
    require_once __DIR__ . '/api/auth/profile.php';
    exit;
}

// Admin CMS & Website Builder APIs
elseif (strpos($uri, '/api/admin/config') !== false) {
    require_once __DIR__ . '/api/admin/config.php';
    exit;
} elseif (strpos($uri, '/api/admin/upload') !== false) {
    require_once __DIR__ . '/api/admin/upload.php';
    exit;
} elseif (strpos($uri, '/api/admin/media') !== false) {
    require_once __DIR__ . '/api/admin/media.php';
    exit;
} elseif (strpos($uri, '/api/admin/audit-logs') !== false) {
    require_once __DIR__ . '/api/admin/audit-logs.php';
    exit;
} elseif (strpos($uri, '/api/admin/dashboard') !== false) {
    require_once __DIR__ . '/api/admin/dashboard.php';
    exit;
} elseif (strpos($uri, '/api/admin/submissions') !== false) {
    require_once __DIR__ . '/api/admin/submissions.php';
    exit;
} elseif (strpos($uri, '/api/admin/settings') !== false) {
    require_once __DIR__ . '/api/admin/settings.php';
    exit;
} elseif (strpos($uri, '/api/admin/content') !== false) {
    require_once __DIR__ . '/api/admin/content.php';
    exit;
} else {
    echo json_encode([
        "service" => "Sports & MICE CMS REST API",
        "version" => "3.0",
        "status" => "active"
    ]);
}
