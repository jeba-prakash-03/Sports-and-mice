<?php
// backend/api/admin/content.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../controllers/AdminController.php';

$database = new Database();
$db = $database->getConnection();
$user = AuthMiddleware::authenticate($db);

$controller = new AdminController();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $controller->getContent();
    http_response_code($result['status']);
    echo json_encode($result['response']);
    exit;
}

if ($method === 'PUT' || $method === 'POST') {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true) ?: $_POST;
    $sectionKey = $_GET['section'] ?? $data['section_key'] ?? '';
    $sectionData = $data['content'] ?? $data['data'] ?? $data;

    if (isset($sectionData['section_key'])) {
        unset($sectionData['section_key']);
    }

    $result = $controller->updateContent($sectionKey, $sectionData);
    http_response_code($result['status']);
    echo json_encode($result['response']);
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "error" => "Method not allowed."]);
