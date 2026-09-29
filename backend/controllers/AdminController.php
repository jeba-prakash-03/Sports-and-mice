<?php
// backend/controllers/AdminController.php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/FormSubmission.php';
require_once __DIR__ . '/../models/Setting.php';
require_once __DIR__ . '/../models/Content.php';
require_once __DIR__ . '/../services/AuthService.php';

class AdminController {
    private $db;
    private $userModel;
    private $submissionModel;
    private $settingModel;
    private $contentModel;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        if ($this->db) {
            $this->userModel = new User($this->db);
            $this->submissionModel = new FormSubmission($this->db);
            $this->settingModel = new Setting($this->db);
            $this->contentModel = new Content($this->db);
        }
    }

    public function login($email, $password) {
        if (empty($email) || empty($password)) {
            return ['status' => 400, 'response' => ['success' => false, 'error' => 'Please provide both email and password.']];
        }

        $user = $this->userModel->authenticate($email, $password);
        if (!$user) {
            return ['status' => 401, 'response' => ['success' => false, 'error' => 'Invalid email or password.']];
        }

        $token = AuthService::generateToken($user['id'], $user['email'], $user['role']);
        return [
            'status' => 200,
            'response' => [
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]
        ];
    }

    public function updateProfile($currentUser, $data) {
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $newPassword = !empty($data['password']) ? trim($data['password']) : null;

        if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ['status' => 400, 'response' => ['success' => false, 'error' => 'Valid name and email are required.']];
        }

        if ($newPassword && strlen($newPassword) < 6) {
            return ['status' => 400, 'response' => ['success' => false, 'error' => 'Password must be at least 6 characters.']];
        }

        $success = $this->userModel->updateProfile($currentUser['id'], $name, $email, $newPassword);
        if ($success) {
            $updated = $this->userModel->findById($currentUser['id']);
            return ['status' => 200, 'response' => ['success' => true, 'message' => 'Profile updated successfully.', 'user' => $updated]];
        }
        return ['status' => 500, 'response' => ['success' => false, 'error' => 'Failed to update profile.']];
    }

    public function getDashboard() {
        require_once __DIR__ . '/../models/CmsConfig.php';
        require_once __DIR__ . '/../models/AuditLog.php';

        $stats = $this->submissionModel->getStatistics();
        $recent = $this->submissionModel->getAll(['limit' => 5, 'page' => 1, 'sort_by' => 'created_at', 'sort_order' => 'DESC']);

        $cms = new CmsConfig($this->db);
        $published = $cms->getPublished();
        $draft = $cms->getDraft();
        $diff = $cms->calculateDiff($draft, $published);

        $audit = new AuditLog($this->db);
        $recentLogs = $audit->getAll(6);

        // Count pages / sections (18 core CMS sections/pages)
        $pagesCount = 18;

        $rawPublishedDate = $published['last_published_at'] ?? null;
        $formattedPublishedDate = !empty($rawPublishedDate)
            ? date('j M Y, g:i A', strtotime($rawPublishedDate))
            : '27 Sep 2026, 5:30 PM';

        $websiteStatus = [
            'status' => 'live',
            'version' => 'v' . ($published['version'] ?? 1),
            'has_unpublished_changes' => ($diff['count'] > 0),
            'draft_changes_count' => $diff['count'],
            'draft_changes_summary' => $diff['summary'],
            'last_published_at' => $formattedPublishedDate,
            'raw_last_published' => $rawPublishedDate,
            'last_saved_at' => $draft['last_saved_at'] ?? null
        ];

        return [
            'status' => 200,
            'response' => [
                'success' => true,
                'statistics' => [
                    'total_submissions' => $stats['total_submissions'] ?? $stats['total'] ?? 0,
                    'new_submissions' => $stats['new_submissions'] ?? $stats['new'] ?? 0,
                    'published_pages' => $pagesCount,
                    'draft_changes' => $diff['count']
                ],
                'website_status' => $websiteStatus,
                'recent_activity' => $recentLogs,
                'recent_submissions' => $recent['items'] ?? []
            ]
        ];
    }

    public function getSubmissions($params) {
        $result = $this->submissionModel->getAll($params);
        return [
            'status' => 200,
            'response' => [
                'success' => true,
                'data' => $result
            ]
        ];
    }

    public function getSubmissionDetail($id) {
        $item = $this->submissionModel->findById($id);
        if (!$item) {
            return ['status' => 404, 'response' => ['success' => false, 'error' => 'Submission not found.']];
        }
        return ['status' => 200, 'response' => ['success' => true, 'data' => $item]];
    }

    public function updateSubmissionStatus($id, $data) {
        $status = $data['status'] ?? null;
        $notes = $data['notes'] ?? null;

        if (!$status) {
            return ['status' => 400, 'response' => ['success' => false, 'error' => 'Status field is required.']];
        }

        $success = $this->submissionModel->updateStatus($id, $status, $notes);
        if ($success) {
            return ['status' => 200, 'response' => ['success' => true, 'message' => 'Submission status updated.']];
        }
        return ['status' => 500, 'response' => ['success' => false, 'error' => 'Failed to update submission status.']];
    }

    public function deleteSubmission($id) {
        $success = $this->submissionModel->delete($id);
        if ($success) {
            return ['status' => 200, 'response' => ['success' => true, 'message' => 'Submission deleted successfully.']];
        }
        return ['status' => 500, 'response' => ['success' => false, 'error' => 'Failed to delete submission.']];
    }

    public function getSettings() {
        $settings = $this->settingModel->getAll();
        return ['status' => 200, 'response' => ['success' => true, 'data' => $settings]];
    }

    public function updateSettings($data) {
        $success = $this->settingModel->updateAll($data);
        if ($success) {
            return ['status' => 200, 'response' => ['success' => true, 'message' => 'Settings saved successfully.', 'data' => $this->settingModel->getAll()]];
        }
        return ['status' => 500, 'response' => ['success' => false, 'error' => 'Failed to save settings.']];
    }

    public function getContent() {
        $content = $this->contentModel->getAll();
        return ['status' => 200, 'response' => ['success' => true, 'data' => $content]];
    }

    public function updateContent($sectionKey, $data) {
        if (empty($sectionKey)) {
            return ['status' => 400, 'response' => ['success' => false, 'error' => 'Section key is required.']];
        }
        $success = $this->contentModel->saveSection($sectionKey, $data);
        if ($success) {
            return ['status' => 200, 'response' => ['success' => true, 'message' => 'Content updated successfully.']];
        }
        return ['status' => 500, 'response' => ['success' => false, 'error' => 'Failed to update content.']];
    }
}
