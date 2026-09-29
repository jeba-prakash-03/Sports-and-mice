<?php
// backend/api/site-config.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/CmsConfig.php';
require_once __DIR__ . '/../services/AuthService.php';

$database = new Database();
$db = $database->getConnection();
$cms = new CmsConfig($db);

$previewRequested = isset($_GET['preview']) && $_GET['preview'] === 'true';
$isPreview = false;

if ($previewRequested) {
    // Only authenticated admin can view draft preview
    $token = AuthService::getBearerToken() ?? ($_GET['token'] ?? null);
    if ($token && AuthService::verifyToken($token)) {
        $isPreview = true;
    }
}

if ($isPreview) {
    header("Cache-Control: no-cache, no-store, must-revalidate");
    // Return draft config for authorized admin preview
    $config = $cms->getDraft();
} else {
    // Public visitors ALWAYS get published config with ETag caching
    $config = $cms->getPublished();
    $version = $config['version'] ?? 1;
    $lastPublished = $config['last_published_at'] ?? '';
    $etag = '"' . md5('pub_' . $version . '_' . $lastPublished) . '"';
    
    header("Cache-Control: public, max-age=60, stale-while-revalidate=300");
    header("ETag: " . $etag);

    if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
        http_response_code(304);
        exit;
    }
}

http_response_code(200);
echo json_encode([
    'success' => true,
    'preview' => $isPreview,
    'data' => $config
]);
