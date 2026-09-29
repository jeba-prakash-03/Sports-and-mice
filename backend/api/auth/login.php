<?php
// backend/api/auth/login.php
require_once __DIR__ . '/../../cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed. Use POST."]);
    exit;
}

require_once __DIR__ . '/../../controllers/AdminController.php';

$raw = file_get_contents("php://input");
$data = json_decode($raw, true) ?: $_POST;

$email = $data['email'] ?? $data['username'] ?? '';
$password = $data['password'] ?? '';

$controller = new AdminController();
$result = $controller->login($email, $password);

http_response_code($result['status']);
echo json_encode($result['response']);
