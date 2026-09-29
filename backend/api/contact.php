<?php
// backend/api/contact.php
require_once __DIR__ . '/../cors.php';

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
