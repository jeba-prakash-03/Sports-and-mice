<?php
// backend/api/admin/config.php
require_once __DIR__ . '/../../cors.php';
require_once __DIR__ . '/../../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../models/CmsConfig.php';
require_once __DIR__ . '/../../models/AuditLog.php';

try {
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
            $summary = $data['summary'] ?? 'Published changes via Website Builder';
            $published = $cms->publish($userEmail, $summary);
            $audit->log($userEmail, 'Published Website', 'Version ' . ($published['version'] ?? 1), $summary);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Website published live successfully!',
                'data' => $published
            ]);
            exit;
        }

        if ($action === 'discard_draft') {
            $result = $cms->discardDraft();
            $audit->log($userEmail, 'Discarded Draft', 'Website Builder', 'Reverted draft to live published version');

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Unpublished draft changes discarded.',
                'data' => $result
            ]);
            exit;
        }

        if ($action === 'rollback') {
            $targetVersion = intval($data['version_number'] ?? 0);
            if ($targetVersion <= 0) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid version number specified.']);
                exit;
            }

            try {
                $rolled = $cms->rollbackToVersion($targetVersion, $userEmail);
            } catch (Exception $rollbackError) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => $rollbackError->getMessage()]);
                exit;
            }
            $audit->log($userEmail, 'Rollback Version', "Reverted to v{$targetVersion}", "New live version published from backup");

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => "Successfully restored and published Version {$targetVersion}!",
                'data' => $rolled
            ]);
            exit;
        }

        if ($action === 'reset_defaults') {
            $reset = $cms->resetToDefault($userEmail);
            $audit->log($userEmail, 'Reset Defaults', 'System', 'Reinitialized site configuration to project defaults');

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Site reset to system default template.',
                'data' => $reset
            ]);
            exit;
        }

        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Unsupported action '{$action}'."]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error processing configuration'
    ]);
}
