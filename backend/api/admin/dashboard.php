<?php
// backend/api/admin/dashboard.php
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../controllers/AdminController.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $user = AuthMiddleware::authenticate($db);

    $controller = new AdminController();
    $result = $controller->getDashboardStats();

    http_response_code($result['status']);
    echo json_encode($result['response']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to load dashboard statistics'
    ]);
}
