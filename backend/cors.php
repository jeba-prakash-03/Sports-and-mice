<?php
// backend/cors.php
// Shared CORS handling for local and production environments

// Load allowed origins from environment variable or default list
$envOrigins = getenv('CORS_ALLOWED_ORIGINS');
if ($envOrigins) {
    $allowedOrigins = array_map('trim', explode(',', $envOrigins));
} else {
    $allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:8000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'https://sports-and-mice.vercel.app'
    ];
}

$httpOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Match origin safely
$originHeader = '*';
if ($httpOrigin) {
    if (in_array($httpOrigin, $allowedOrigins)) {
        $originHeader = $httpOrigin;
    } elseif (preg_match('/^https:\/\/.*\.vercel\.app$/i', $httpOrigin)) {
        // Automatically support Vercel preview & production deployments
        $originHeader = $httpOrigin;
    } else {
        $originHeader = $httpOrigin;
    }
}

header("Access-Control-Allow-Origin: $originHeader");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS requests immediately without running application/DB logic
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
