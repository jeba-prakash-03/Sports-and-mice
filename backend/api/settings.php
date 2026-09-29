<?php
// backend/api/settings.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Setting.php';

$database = new Database();
$db = $database->getConnection();
$settingModel = new Setting($db);

$allSettings = $settingModel->getAll();

// Exclude sensitive credentials like SMTP password from public endpoint
$publicSettings = [
    "site_name" => $allSettings['site_name'] ?? 'Sports & MICE',
    "company_name" => $allSettings['company_name'] ?? 'K-Consulting Sports & MICE',
    "founder_name" => $allSettings['founder_name'] ?? 'Marc Knuelle',
    "phone" => $allSettings['phone'] ?? '+49 2241 343320',
    "fax" => $allSettings['fax'] ?? '+49 2241 344316',
    "email" => $allSettings['email'] ?? 'contact@sportsandmice.com',
    "address_street" => $allSettings['address_street'] ?? 'Fritz-Pullig-Strasse 9',
    "address_city" => $allSettings['address_city'] ?? '53757 Sankt Augustin',
    "address_country" => $allSettings['address_country'] ?? 'Germany',
    "linkedin_url" => $allSettings['linkedin_url'] ?? 'https://www.linkedin.com/in/marc-knuelle-427252161/'
];

echo json_encode(["success" => true, "data" => $publicSettings]);
