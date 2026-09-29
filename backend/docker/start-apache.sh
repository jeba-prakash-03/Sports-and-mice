#!/bin/bash
set -e

# 1. Read PORT from environment with fallback to 8000
PORT="${PORT:-8000}"

echo "========================================="
echo " Starting Apache on port: ${PORT}"
echo "========================================="

# 2. Configure Apache ports.conf to listen dynamically on $PORT
if [ -f /etc/apache2/ports.conf ]; then
    sed -i "s/Listen [0-9]*/Listen ${PORT}/g" /etc/apache2/ports.conf
    # If no Listen directive exists, create one
    if ! grep -q "Listen" /etc/apache2/ports.conf; then
        echo "Listen ${PORT}" >> /etc/apache2/ports.conf
    fi
else
    echo "Listen ${PORT}" > /etc/apache2/ports.conf
fi

# 3. Configure Apache default site VirtualHost to match $PORT
if [ -f /etc/apache2/sites-available/000-default.conf ]; then
    sed -i "s/<VirtualHost \*:[0-9]*>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/000-default.conf
fi

# 4. Ensure AllowOverride All for /var/www/html so .htaccess routing works seamlessly
if ! grep -q "AllowOverride All" /etc/apache2/apache2.conf 2>/dev/null; then
    cat << 'EOF' >> /etc/apache2/apache2.conf

<Directory /var/www/html>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
EOF
fi

# 5. Ensure required runtime storage directories exist with proper permissions
mkdir -p /var/www/html/uploads /var/www/html/data /var/www/html/logs
chown -R www-data:www-data /var/www/html/uploads /var/www/html/data /var/www/html/logs 2>/dev/null || true
chmod -R 775 /var/www/html/uploads /var/www/html/data /var/www/html/logs 2>/dev/null || true

# 6. Execute apache2-foreground to keep container running as PID 1
exec apache2-foreground
