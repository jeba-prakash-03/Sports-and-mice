<?php
// backend/api/health.php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

http_response_code(200);
echo json_encode([
    "status" => "ok",
    "service" => "Sports & MICE Backend API",
    "timestamp" => date('Y-m-d H:i:s'),
    "database_connected" => $db !== null,
    "db_type" => $database->getDbType()
]);
