<?php
// backend/api/health.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

echo json_encode([
    "status" => "ok",
    "service" => "Sports & MICE Backend API",
    "timestamp" => date('Y-m-d H:i:s'),
    "database_connected" => $db !== null
]);
