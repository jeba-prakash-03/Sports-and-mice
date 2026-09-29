<?php
// backend/api/auth/profile.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS");
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

$raw = file_get_contents("php://input");
$data = json_decode($raw, true) ?: $_POST;

$controller = new AdminController();
$result = $controller->updateProfile($user, $data);

http_response_code($result['status']);
echo json_encode($result['response']);
