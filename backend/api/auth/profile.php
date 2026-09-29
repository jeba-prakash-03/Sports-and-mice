<?php
// backend/api/auth/profile.php
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../controllers/AdminController.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $user = AuthMiddleware::authenticate($db);

    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true) ?: $_POST;

    $controller = new AdminController();
    $result = $controller->updateProfile($user, $data);

    http_response_code($result['status']);
    echo json_encode($result['response']);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "error" => "Unauthorized"
    ]);
}
