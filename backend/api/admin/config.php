<?php
// backend/api/admin/config.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/CmsConfig.php';
require_once __DIR__ . '/../../models/AuditLog.php';

$database = new Database();
$db = $database->getConnection();
$user = AuthMiddleware::authenticate($db);
$cms = new CmsConfig($db);
$audit = new AuditLog($db);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $published = $cms->getPublished();
    $draft = $cms->getDraft();
    $diff = $cms->calculateDiff($draft, $published);
    $versions = $cms->getVersions(10);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'published' => $published,
            'draft' => $draft,
            'has_unpublished_changes' => $diff['count'] > 0,
            'draft_changes_count' => $diff['count'],
            'draft_changes_summary' => $diff['summary'],
            'version' => $published['version'] ?? 1,
            'last_published_at' => $published['last_published_at'] ?? null,
            'last_saved_at' => $draft['last_saved_at'] ?? null,
            'versions' => $versions
        ]
    ]);
    exit;
}

if ($method === 'POST') {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true) ?: [];
    $action = $data['action'] ?? 'save_draft';
    $userEmail = $user['email'] ?? 'admin@sportsandmice.com';

    if ($action === 'save_draft') {
        $config = $data['config'] ?? [];
        $saved = $cms->saveDraft($config, $userEmail);
        $audit->log($userEmail, 'Saved Draft Changes', $data['section_name'] ?? 'Website Builder', 'Draft version updated with ' . ($saved['draft_changes_count'] ?? 0) . ' changes');

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Draft saved successfully.',
            'data' => $saved
        ]);
        exit;
    }

    if ($action === 'publish') {
        $published = $cms->publish($userEmail);
        $audit->log($userEmail, 'Published Website Changes', 'Global Website', 'New version live: v' . $published['version']);

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Website successfully published! Live changes are now active.',
            'data' => $published
        ]);
        exit;
    }

    if ($action === 'reset') {
        $reset = $cms->resetToDefault();
        $audit->log($user['email'], 'Reset Website Configuration', 'Global Website', 'Restored initial system defaults');

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Website reset to default configuration successfully.',
            'data' => $reset
        ]);
        exit;
    }

    if ($action === 'discard') {
        $discarded = $cms->discardDraft();
        $audit->log($user['email'], 'Discarded Draft Changes', 'Website Builder', 'Reverted draft to published version');

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Unpublished draft changes discarded.',
            'data' => $discarded
        ]);
        exit;
    }

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Unknown action: ' . $action
    ]);
    exit;
}
