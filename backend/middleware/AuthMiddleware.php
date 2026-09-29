<?php
// backend/middleware/AuthMiddleware.php
require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../models/User.php';

class AuthMiddleware {
    public static function authenticate($db = null) {
        $token = AuthService::getBearerToken();
        if (!$token) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "error" => "Unauthorized. Authentication token is missing."
            ]);
            exit;
        }

        $payload = AuthService::verifyToken($token);
        if (!$payload) {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "error" => "Unauthorized. Invalid or expired token."
            ]);
            exit;
        }

        if ($db) {
            try {
                $userModel = new User($db);
                $user = $userModel->findById($payload['user_id']);
                if ($user) {
                    return $user;
                }
            } catch (Exception $e) {
                // Fallback to token payload
            }
        }

        // Return user from token payload if DB lookup not performed or user found in token
        return [
            'id' => $payload['user_id'] ?? 1,
            'email' => $payload['email'] ?? 'admin@sportsandmice.com',
            'name' => $payload['name'] ?? 'Administrator',
            'role' => $payload['role'] ?? 'admin'
        ];
    }
}
