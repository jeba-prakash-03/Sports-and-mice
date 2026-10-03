<?php
// backend/cors.php
// Shared CORS handling for local and production environments

$httpOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Fallback to Referer header if Origin header is missing
if (empty($httpOrigin) && !empty($_SERVER['HTTP_REFERER'])) {
    $parsed = parse_url($_SERVER['HTTP_REFERER']);
    if (isset($parsed['scheme']) && isset($parsed['host'])) {
        $httpOrigin = $parsed['scheme'] . '://' . $parsed['host'] . (isset($parsed['port']) ? ':' . $parsed['port'] : '');
    }
}

// Allowed origins list
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5180',
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5180',
    'http://127.0.0.1:3000',
    'http://192.168.1.106',
    'http://192.168.1.106:5180',
    'http://192.168.1.106:5173',
    'http://192.168.1.106:8000',
    'http://10.34.140.90',
    'http://10.34.140.90:5180',
    'http://10.34.140.90:5173',
    'http://10.34.140.90:8000',
    'https://sports-and-mice.vercel.app'
];

$envOrigins = getenv('ALLOWED_ORIGINS') ?: getenv('CORS_ALLOWED_ORIGINS');
if ($envOrigins) {
    $allowedOrigins = array_merge($allowedOrigins, array_map('trim', explode(',', $envOrigins)));
}

$originHeader = null;
if (!empty($httpOrigin)) {
    if (in_array($httpOrigin, $allowedOrigins)) {
        $originHeader = $httpOrigin;
    } elseif (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/i', $httpOrigin)) {
        $originHeader = $httpOrigin;
    } elseif (preg_match('/^https:\/\/.*\.vercel\.app$/i', $httpOrigin)) {
        $originHeader = $httpOrigin;
    }
}

// Fallback to request origin or default to http://localhost:5180
if (!$originHeader) {
    $originHeader = !empty($httpOrigin) ? $httpOrigin : 'http://localhost:5180';
}

header("Access-Control-Allow-Origin: $originHeader");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Handle preflight OPTIONS requests immediately
if ($requestMethod === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
