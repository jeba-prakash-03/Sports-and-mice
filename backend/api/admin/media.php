<?php
// backend/api/admin/media.php
require_once __DIR__ . '/../../cors.php';
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/MediaManager.php';
require_once __DIR__ . '/../../models/AuditLog.php';

$database = new Database();
$db = $database->getConnection();
$user = AuthMiddleware::authenticate($db);
$media = new MediaManager($db);
$audit = new AuditLog($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $items = $media->getAll();
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $items
    ]);
    exit;
}

if ($method === 'DELETE' || ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'delete')) {
    $id = $_GET['id'] ?? '';
    if (!$id) {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true) ?: [];
        $id = $data['id'] ?? '';
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Media ID is required.']);
        exit;
    }

    $deleted = $media->delete($id);
    if ($deleted) {
        $audit->log($user['email'], 'Deleted Media', $id, 'Image removed from library');
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Media deleted successfully.']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Media item not found.']);
    }
    exit;
}
