-- ==========================================================
-- Supabase (PostgreSQL) Production Schema for Sports & MICE
-- Run this in Supabase SQL Editor if creating tables manually.
-- (Note: The PHP backend will also auto-create these on first connection).
-- ==========================================================

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Form Submissions Table
CREATE TABLE IF NOT EXISTS form_submissions (
    id SERIAL PRIMARY KEY,
    form_type VARCHAR(50) NOT NULL DEFAULT 'contact',
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) DEFAULT '',
    subject VARCHAR(255) DEFAULT '',
    message TEXT NOT NULL,
    form_data JSONB DEFAULT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    notes TEXT DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT '',
    user_agent TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_type ON form_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_form_email ON form_submissions(email);
CREATE INDEX IF NOT EXISTS idx_form_status ON form_submissions(status);

-- 3. Legacy Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    surname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(255) DEFAULT '',
    city VARCHAR(255) DEFAULT '',
    address VARCHAR(255) DEFAULT '',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT DEFAULT NULL,
    category VARCHAR(50) DEFAULT 'general',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Site Dynamic Content Table (Stores full CMS published & draft trees)
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(100) NOT NULL UNIQUE,
    content_json JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Content Versions Table (Draft & Published History)
CREATE TABLE IF NOT EXISTS content_versions (
    id SERIAL PRIMARY KEY,
    version_number INT NOT NULL,
    page_id VARCHAR(100) DEFAULT 'global',
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    summary VARCHAR(255) DEFAULT '',
    created_by VARCHAR(150) DEFAULT 'admin@sportsandmice.com',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ NULL
);

-- 7. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(150) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target VARCHAR(255) DEFAULT '',
    details TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- Initial Seed Data
-- ==========================================================

-- Default Admin User (Email: admin@sportsandmice.com, Password: admin123)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Marc Knuelle', 'admin@sportsandmice.com', '$2y$10$H.CI.hOd51PYl5catGfUvefFE.OYIp./qauHaMbEkJIpxBNQx1dNq', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Default Site Settings
INSERT INTO site_settings (setting_key, setting_value, category)
VALUES 
('site_title', 'Sports & MICE | K-Consulting', 'general'),
('site_description', 'High-end hospitality, event management, and travel logistics for sports associations and corporate events.', 'general'),
('contact_email', 'info@sportsandmice.com', 'contact'),
('contact_phone', '+49 123 456 7890', 'contact'),
('contact_address', 'Heidelberg, Germany', 'contact')
ON CONFLICT (setting_key) DO NOTHING;
