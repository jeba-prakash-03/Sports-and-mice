<?php
// backend/api/admin/submissions.php
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
        if (isset($_GET['id'])) {
            $result = $controller->getSubmissionById($_GET['id']);
        } else {
            $page = intval($_GET['page'] ?? 1);
            $limit = intval($_GET['limit'] ?? 15);
            $search = $_GET['search'] ?? '';
            $status = $_GET['status'] ?? '';
            $formType = $_GET['form_type'] ?? '';
            $sortBy = $_GET['sort_by'] ?? 'created_at';
            $sortOrder = $_GET['sort_order'] ?? 'DESC';

            $result = $controller->getSubmissions($page, $limit, $search, $status, $formType, $sortBy, $sortOrder);
        }
        http_response_code($result['status']);
        echo json_encode($result['response']);
        exit;
    }

    if ($method === 'PATCH' || $method === 'PUT') {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true) ?: $_POST;
        $id = $data['id'] ?? ($_GET['id'] ?? null);

        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Submission ID is required.']);
            exit;
        }

        $result = $controller->updateSubmissionStatus($id, $data);
        http_response_code($result['status']);
        echo json_encode($result['response']);
        exit;
    }

    if ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $raw = file_get_contents("php://input");
            $data = json_decode($raw, true);
            $id = $data['id'] ?? null;
        }

        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Submission ID is required.']);
            exit;
        }

        $result = $controller->deleteSubmission($id);
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
        'error' => 'Server error processing submissions'
    ]);
}
