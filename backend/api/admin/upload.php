<?php
// backend/api/admin/upload.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/MediaManager.php';
require_once __DIR__ . '/../../models/AuditLog.php';

$database = new Database();
$db = $database->getConnection();
$user = AuthMiddleware::authenticate($db);
$media = new MediaManager($db);
$audit = new AuditLog($db);

$uploadFile = $_FILES['file'] ?? $_FILES['image'] ?? null;
if (!$uploadFile) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'No file was uploaded.'
    ]);
    exit;
}

$altText = $_POST['alt_text'] ?? $_POST['title'] ?? '';
$category = $_POST['category'] ?? 'Uploads';

try {
    $uploaded = $media->uploadFile($uploadFile, $altText, $category);
    $audit->log($user['email'], 'Uploaded Image', $uploaded['name'], 'Saved to ' . $uploaded['url']);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Image uploaded successfully.',
        'url' => $uploaded['url'],
        'data' => $uploaded
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
