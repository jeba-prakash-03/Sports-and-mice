FROM php:8.2-apache

# Install PostgreSQL, MySQL, and required extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    libcurl4-openssl-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql pgsql curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable Apache modules: rewrite and headers for CORS
RUN a2enmod rewrite headers

# Copy backend application files into Apache DocumentRoot
COPY backend/ /var/www/html/

WORKDIR /var/www/html

# Ensure uploads and data directories are writable
RUN mkdir -p /var/www/html/uploads /var/www/html/data /var/www/html/logs \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/uploads /var/www/html/data /var/www/html/logs

# Set ServerName to avoid Apache warnings
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Ensure startup script is executable
RUN chmod +x /var/www/html/docker/start-apache.sh

# Start Apache dynamically using the startup script
CMD ["/var/www/html/docker/start-apache.sh"]
