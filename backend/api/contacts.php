<?php
// backend/api/contacts.php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../controllers/ContactController.php';

$controller = new ContactController();
$result = $controller->getAll();

http_response_code($result['status']);
echo json_encode($result['response']);
