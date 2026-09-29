<?php
// backend/api/public/page.php
// Optimized single-page endpoint for public site rendering

require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/CmsConfig.php';

$database = new Database();
$db = $database->getConnection();
$cms = new CmsConfig($db);

// Extract requested slug
$slug = isset($_GET['slug']) ? trim(strtolower($_GET['slug'])) : 'home';
if (empty($slug) || $slug === '/' || $slug === 'en') {
    $slug = 'home';
}

// Normalize German/English slugs
$slugMap = [
    'dienstleistung' => 'service',
    'über-uns' => 'about',
    'ueber-uns' => 'about',
    'hotels-mehr' => 'hotels',
    'kontakt' => 'contact',
    'impressum-datenschutzverordnung' => 'imprint',
    'imprint-data-protection-regulation' => 'imprint'
];

if (isset($slugMap[$slug])) {
    $slug = $slugMap[$slug];
}

// Fetch published site configuration (strictly published only)
$published = $cms->getPublished();

if (!$published || !isset($published['pages'])) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Site configuration unavailable'
    ]);
    exit;
}

$pageData = $published['pages'][$slug] ?? null;

if (!$pageData) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error' => "Page '{$slug}' not found",
        'available_pages' => array_keys($published['pages'])
    ]);
    exit;
}

// Return optimized payload with global headers/footers and requested page sections
$response = [
    'success' => true,
    'slug' => $slug,
    'page' => $pageData,
    'header' => $published['header'] ?? [],
    'footer' => $published['footer'] ?? [],
    'theme' => $published['theme'] ?? [],
    'animations' => $published['animations'] ?? [],
    'version' => $published['version'] ?? 1,
    'last_published_at' => $published['last_published_at'] ?? null
];

http_response_code(200);
echo json_encode($response);
