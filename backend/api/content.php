<?php
// backend/api/content.php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Content.php';

$database = new Database();
$db = $database->getConnection();
$contentModel = new Content($db);

$section = $_GET['section'] ?? '';
if (!empty($section)) {
    $data = $contentModel->getSection($section);
    echo json_encode(["success" => true, "data" => $data]);
} else {
    $data = $contentModel->getAll();
    echo json_encode(["success" => true, "data" => $data]);
}
