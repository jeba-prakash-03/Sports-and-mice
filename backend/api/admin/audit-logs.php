<?php
// backend/api/admin/audit-logs.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/AuditLog.php';

$database = new Database();
$db = $database->getConnection();
$user = AuthMiddleware::authenticate($db);
$audit = new AuditLog($db);

$logs = $audit->getAll(100);

http_response_code(200);
echo json_encode([
    'success' => true,
    'data' => $logs
]);
