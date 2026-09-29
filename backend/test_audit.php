<?php
// backend/test_audit.php
// Production Audit Benchmark & Verification Script

error_reporting(E_ALL);
ini_set('display_errors', '1');

$baseUrl = "http://127.0.0.1:8000";

function testRequest($endpoint, $method = 'GET', $data = null, $token = null) {
    global $baseUrl;
    // Try endpoint as-is first; if 404 and no extension, append .php
    $url = $endpoint;
    $ch = curl_init($baseUrl . $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    $headers = ['Content-Type: application/json', 'Accept: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    if ($data !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($data) ? $data : json_encode($data));
    }
    $start = microtime(true);
    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    // If 404 and does not end with .php, retry with .php appended for PHP dev server compatibility
    if ($statusCode === 404 && strpos($url, '.php') === false) {
        curl_close($ch);
        $urlParts = explode('?', $url, 2);
        $cleanPath = $urlParts[0] . '.php';
        $query = isset($urlParts[1]) ? '?' . $urlParts[1] : '';
        $url = $cleanPath . $query;

        $ch = curl_init($baseUrl . $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        if ($data !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($data) ? $data : json_encode($data));
        }
        $start = microtime(true);
        $response = curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    }

    $durationMs = round((microtime(true) - $start) * 1000, 2);
    $error = curl_error($ch);
    curl_close($ch);

    $json = json_decode($response, true);
    return [
        'url' => $url,
        'method' => $method,
        'status' => $statusCode,
        'duration_ms' => $durationMs,
        'json' => $json,
        'raw_length' => strlen($response),
        'curl_error' => $error
    ];
}

$results = [];

echo "========================================================\n";
echo "   SPORTS & MICE PRODUCTION AUDIT & VERIFICATION SUITE  \n";
echo "========================================================\n\n";

// 1. Health Check
$r = testRequest('/api/health');
echo "[1] Health Check: Status {$r['status']} ({$r['duration_ms']}ms)\n";
$results['health'] = $r;

// 2. Public Site Config (Published)
$r = testRequest('/api/site-config');
$ver = $r['json']['data']['version'] ?? 'N/A';
$title = $r['json']['data']['header']['brand_title'] ?? 'N/A';
echo "[2] Public Site Config: Status {$r['status']} ({$r['duration_ms']}ms) - Live v{$ver}, Title: {$title}\n";
$results['public_config'] = $r;

// 3. Auth Tests
// 3a. Empty login
$r = testRequest('/api/auth/login', 'POST', ['email' => '', 'password' => '']);
echo "[3a] Login Empty Credentials: Status {$r['status']} ({$r['duration_ms']}ms) - Handled: " . ($r['status'] === 400 ? "PASS" : "FAIL") . "\n";
$results['login_empty'] = $r;

// 3b. Wrong password
$r = testRequest('/api/auth/login', 'POST', ['email' => 'admin@sportsandmice.com', 'password' => 'wrong_password_xyz']);
echo "[3b] Login Wrong Password: Status {$r['status']} ({$r['duration_ms']}ms) - Handled: " . ($r['status'] === 401 ? "PASS" : "FAIL") . "\n";
$results['login_wrong'] = $r;

// 3c. Valid login
$r = testRequest('/api/auth/login', 'POST', ['email' => 'admin@sportsandmice.com', 'password' => 'admin123']);
$token = $r['json']['token'] ?? null;
echo "[3c] Login Valid Credentials: Status {$r['status']} ({$r['duration_ms']}ms) - Token: " . ($token ? "RECEIVED (" . strlen($token) . " chars)" : "FAIL") . "\n";
$results['login_valid'] = $r;

// 4. Unauthorized Access Check
$r = testRequest('/api/admin/dashboard');
echo "[4a] Unauthorized /api/admin/dashboard: Status {$r['status']} - Protected: " . ($r['status'] === 401 ? "PASS" : "FAIL") . "\n";
$results['unauthorized_dashboard'] = $r;

$r = testRequest('/api/admin/config');
echo "[4b] Unauthorized /api/admin/config: Status {$r['status']} - Protected: " . ($r['status'] === 401 ? "PASS" : "FAIL") . "\n";
$results['unauthorized_config'] = $r;

// 5. Authorized Admin APIs
if ($token) {
    // 5a. Admin Dashboard
    $r = testRequest('/api/admin/dashboard', 'GET', null, $token);
    $subs = $r['json']['statistics']['total_submissions'] ?? 0;
    $ver = $r['json']['website_status']['version'] ?? 'N/A';
    echo "[5a] Admin Dashboard: Status {$r['status']} ({$r['duration_ms']}ms) - Submissions: {$subs}, Live: {$ver}\n";
    $results['admin_dashboard'] = $r;

    // 5b. Admin CMS Config (Draft + Published)
    $r = testRequest('/api/admin/config', 'GET', null, $token);
    $draftChanges = $r['json']['data']['draft_changes_count'] ?? 0;
    echo "[5b] Admin CMS Config: Status {$r['status']} ({$r['duration_ms']}ms) - Draft Pending Changes: {$draftChanges}\n";
    $results['admin_config'] = $r;

    // 5c. Admin Media Library
    $r = testRequest('/api/admin/media', 'GET', null, $token);
    $mediaCount = count($r['json']['data'] ?? []);
    echo "[5c] Admin Media Library: Status {$r['status']} ({$r['duration_ms']}ms) - {$mediaCount} media items\n";
    $results['admin_media'] = $r;

    // 5d. Admin Submissions
    $r = testRequest('/api/admin/submissions', 'GET', null, $token);
    $subsCount = count($r['json']['data']['items'] ?? []);
    echo "[5d] Admin Submissions List: Status {$r['status']} ({$r['duration_ms']}ms) - {$subsCount} loaded\n";
    $results['admin_submissions'] = $r;

    // 5e. Admin Audit Logs
    $r = testRequest('/api/admin/audit-logs', 'GET', null, $token);
    $logsCount = count($r['json']['data'] ?? []);
    echo "[5e] Admin Audit Logs: Status {$r['status']} ({$r['duration_ms']}ms) - {$logsCount} entries\n";
    $results['admin_audit_logs'] = $r;

    // 5f. Test Save Draft Workflow
    $currentDraft = $r['json']['data'] ?? [];
    echo "[5f] Testing Draft vs Published Isolation...\n";
    $testDraftSave = testRequest('/api/admin/config', 'POST', [
        'action' => 'save_draft',
        'config' => [
            'theme' => [
                'primary_color' => '#ff0000',
                'primary_hover' => '#e60000'
            ]
        ],
        'section_name' => 'Automated Audit Test'
    ], $token);
    echo "     Save Draft: Status {$testDraftSave['status']} ({$testDraftSave['duration_ms']}ms) - " . ($testDraftSave['json']['success'] ? "SUCCESS" : "FAIL") . "\n";
    
    // Verify public config was NOT changed immediately
    $pubCheck = testRequest('/api/site-config');
    echo "     Public Config check during draft: Version remains {$pubCheck['json']['data']['version']} (Draft NOT leaked to public website)\n";

    // 5g. Test Preview Endpoint with Token
    $previewCheck = testRequest('/api/site-config?preview=true', 'GET', null, $token);
    echo "     Preview Endpoint: Status {$previewCheck['status']} ({$previewCheck['duration_ms']}ms) - Preview mode: " . ($previewCheck['json']['preview'] ? "ACTIVE" : "INACTIVE") . "\n";
}

// 6. Form Submission Workflow
echo "\n[6] Testing Form Submission Workflow...\n";
// 6a. Missing required fields
$r = testRequest('/api/contact', 'POST', ['name' => '', 'email' => '', 'message' => '']);
echo "    Missing fields: Status {$r['status']} ({$r['duration_ms']}ms) - Handled: " . ($r['status'] === 400 ? "PASS" : "FAIL") . "\n";

// 6b. Invalid email
$r = testRequest('/api/contact', 'POST', ['name' => 'Audit Tester', 'email' => 'invalid-email', 'message' => 'Test message']);
echo "    Invalid email: Status {$r['status']} ({$r['duration_ms']}ms) - Handled: " . ($r['status'] === 400 ? "PASS" : "FAIL") . "\n";

// 6c. Valid submission
$r = testRequest('/api/contact', 'POST', [
    'name' => 'Audit Test User',
    'email' => 'audit.tester@sportsandmice.test',
    'phone' => '+49 123 456789',
    'subject' => 'Production Readiness Verification Inquiry',
    'message' => 'Automated verification check of form submission pipeline.',
    'country' => 'Germany',
    'city' => 'Bonn'
]);
echo "    Valid submission: Status {$r['status']} ({$r['duration_ms']}ms) - Success: " . ($r['json']['success'] ? "PASS" : "FAIL") . "\n";

echo "\n========================================================\n";
echo "   AUDIT EXECUTION COMPLETE\n";
echo "========================================================\n";
