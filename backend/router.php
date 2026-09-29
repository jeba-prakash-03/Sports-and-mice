<?php
// PHP built-in server router - prevents server exit on request termination
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Static files served directly
$staticFile = __DIR__ . $uri;
if ($uri !== '/' && file_exists($staticFile) && !is_dir($staticFile)) {
    return false;
}

// Route all API requests through index.php logic (without exit)
require_once __DIR__ . '/cors.php';
header("Content-Type: application/json; charset=UTF-8");

// Dispatch
if (strpos($uri, '/api/public/page') !== false || strpos($uri, '/api/page') !== false) {
    require __DIR__ . '/api/public/page.php';
} elseif (strpos($uri, '/api/site-config') !== false) {
    require __DIR__ . '/api/site-config.php';
} elseif (strpos($uri, '/api/contacts') !== false) {
    require __DIR__ . '/api/contacts.php';
} elseif (strpos($uri, '/api/contact') !== false) {
    require __DIR__ . '/api/contact.php';
} elseif (strpos($uri, '/api/health') !== false) {
    require __DIR__ . '/api/health.php';
} elseif (strpos($uri, '/api/settings') !== false && strpos($uri, '/api/admin/settings') === false) {
    require __DIR__ . '/api/settings.php';
} elseif (strpos($uri, '/api/content') !== false && strpos($uri, '/api/admin/content') === false) {
    require __DIR__ . '/api/content.php';
} elseif (strpos($uri, '/api/auth/login') !== false) {
    require __DIR__ . '/api/auth/login.php';
} elseif (strpos($uri, '/api/auth/me') !== false) {
    require __DIR__ . '/api/auth/me.php';
} elseif (strpos($uri, '/api/auth/profile') !== false) {
    require __DIR__ . '/api/auth/profile.php';
} elseif (strpos($uri, '/api/admin/config') !== false) {
    require __DIR__ . '/api/admin/config.php';
} elseif (strpos($uri, '/api/admin/upload') !== false) {
    require __DIR__ . '/api/admin/upload.php';
} elseif (strpos($uri, '/api/admin/media') !== false) {
    require __DIR__ . '/api/admin/media.php';
} elseif (strpos($uri, '/api/admin/audit-logs') !== false) {
    require __DIR__ . '/api/admin/audit-logs.php';
} elseif (strpos($uri, '/api/admin/dashboard') !== false) {
    require __DIR__ . '/api/admin/dashboard.php';
} elseif (strpos($uri, '/api/admin/submissions') !== false) {
    require __DIR__ . '/api/admin/submissions.php';
} elseif (strpos($uri, '/api/admin/settings') !== false) {
    require __DIR__ . '/api/admin/settings.php';
} elseif (strpos($uri, '/api/admin/content') !== false) {
    require __DIR__ . '/api/admin/content.php';
} else {
    echo json_encode(["service" => "Sports & MICE CMS REST API", "version" => "3.0", "status" => "active"]);
}
