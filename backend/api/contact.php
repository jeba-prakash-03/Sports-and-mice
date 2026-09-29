<?php
// backend/api/contact.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed. Use POST."]);
    exit;
}

require_once __DIR__ . '/../controllers/ContactController.php';

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    $data = $_POST;
}

$controller = new ContactController();
$result = $controller->submit($data);

http_response_code($result['status']);
echo json_encode($result['response']);
