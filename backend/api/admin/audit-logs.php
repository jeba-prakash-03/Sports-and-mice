<?php
// backend/api/admin/audit-logs.php
require_once __DIR__ . '/../../cors.php';
header("Content-Type: application/json; charset=UTF-8");

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
