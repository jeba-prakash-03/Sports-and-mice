<?php
// backend/api/admin/settings.php
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../controllers/AdminController.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $user = AuthMiddleware::authenticate($db);

    $controller = new AdminController();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $result = $controller->getSettings();
        http_response_code($result['status']);
        echo json_encode($result['response']);
        exit;
    }

    if ($method === 'PUT' || $method === 'POST') {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true) ?: $_POST;
        $result = $controller->updateSettings($data);
        http_response_code($result['status']);
        echo json_encode($result['response']);
        exit;
    }

    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error processing settings'
    ]);
}
