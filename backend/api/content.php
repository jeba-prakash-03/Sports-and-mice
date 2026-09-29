<?php
// backend/api/content.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Content.php';

$database = new Database();
$db = $database->getConnection();
$contentModel = new Content($db);

$section = $_GET['section'] ?? '';
if (!empty($section)) {
    $data = $contentModel->getSection($section);
    echo json_encode(["success" => true, "data" => $data]);
} else {
    $data = $contentModel->getAll();
    echo json_encode(["success" => true, "data" => $data]);
}
