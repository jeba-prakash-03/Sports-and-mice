<?php
// backend/api/admin/submissions.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PATCH, DELETE, OPTIONS");
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
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $result = $controller->getSubmissionDetail((int)$_GET['id']);
    } else {
        $result = $controller->getSubmissions($_GET);
    }
    http_response_code($result['status']);
    echo json_encode($result['response']);
    exit;
}

if ($method === 'PATCH') {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true) ?: [];
    $id = isset($_GET['id']) ? (int)$_GET['id'] : ($data['id'] ?? 0);

    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Submission ID is required."]);
        exit;
    }

    $result = $controller->updateSubmissionStatus($id, $data);
    http_response_code($result['status']);
    echo json_encode($result['response']);
    exit;
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if (!$id) {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true) ?: [];
        $id = $data['id'] ?? 0;
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Submission ID is required."]);
        exit;
    }

    $result = $controller->deleteSubmission($id);
    http_response_code($result['status']);
    echo json_encode($result['response']);
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "error" => "Method not allowed."]);
