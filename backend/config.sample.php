<?php
// backend/config.sample.php
// Sample configuration file for deployment
// Copy this file to backend/config.php on your server and enter your real MySQL credentials.

return [
    'db' => [
        'host'     => getenv('DB_HOST') ?: 'your_database_host',
        'port'     => getenv('DB_PORT') ?: 3306,
        'name'     => getenv('DB_NAME') ?: 'your_database_name',
        'user'     => getenv('DB_USER') ?: 'your_database_user',
        'pass'     => getenv('DB_PASS') !== false ? getenv('DB_PASS') : 'your_database_password',
        'charset'  => 'utf8mb4'
    ],
    'jwt_secret'   => getenv('JWT_SECRET') ?: 'your_jwt_secret_key_here',
    'cors_origins' => getenv('CORS_ALLOWED_ORIGINS') ?: 'http://localhost:5173,https://your-vercel-app.vercel.app'
];
