<?php
// backend/api/public/page.php
// Optimized single-page endpoint for public site rendering

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

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

// Check if page exists in published config
$pageMeta = $published['pages'][$slug] ?? null;
$pageSections = $published['sections'][$slug] ?? [];

// Filter only enabled sections for public visitor
$enabledSections = array_values(array_filter($pageSections, function($sec) {
    return ($sec['enabled'] ?? true) !== false;
}));

// Sort enabled sections by order
usort($enabledSections, function($a, $b) {
    return ($a['order'] ?? 0) - ($b['order'] ?? 0);
});

// Build lean payload (excluding all draft diffs, admin metadata, history, etc.)
$leanPayload = [
    'page' => $pageMeta ? [
        'id' => $slug,
        'title' => $pageMeta['title'] ?? ucfirst($slug),
        'seo_title' => $pageMeta['seo_title'] ?? '',
        'seo_description' => $pageMeta['seo_description'] ?? '',
        'hero_bg_image' => $pageMeta['hero_bg_image'] ?? ''
    ] : [
        'id' => $slug,
        'title' => ucfirst($slug)
    ],
    'sections' => $enabledSections,
    'theme' => $published['theme'] ?? [],
    'header' => [
        'logo_url' => $published['header']['logo_url'] ?? '/assets/images/logo.png',
        'brand_title' => $published['header']['brand_title'] ?? 'Sports & MICE',
        'nav_items' => array_values(array_filter($published['header']['nav_items'] ?? [], function($i) {
            return ($i['enabled'] ?? true) !== false;
        }))
    ],
    'footer' => $published['footer'] ?? [],
    'animations' => $published['animations'] ?? [
        'enabled' => true,
        'default_type' => 'up',
        'default_duration' => 0.55
    ],
    'version' => $published['version'] ?? 1,
    'published_at' => $published['last_published_at'] ?? ''
];

// Generate ETag for instant 304 response on repeat visits
$etag = '"' . md5('page_' . $slug . '_v' . ($leanPayload['version']) . '_' . ($leanPayload['published_at'])) . '"';

header("Cache-Control: public, max-age=120, stale-while-revalidate=600");
header("ETag: " . $etag);

if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) {
    http_response_code(304);
    exit;
}

http_response_code(200);
echo json_encode([
    'success' => true,
    'slug' => $slug,
    'data' => $leanPayload
]);
