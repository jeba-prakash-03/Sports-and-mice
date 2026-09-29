-- Supabase (PostgreSQL) Schema for Sports & MICE

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

-- 5. Site Dynamic Content Table
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

-- Seed Initial Default Admin User (Password: admin123)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Marc Knuelle', 'admin@sportsandmice.com', '$2y$10$eA3pQZ/KovD1e91qJzCeeu7oZ946J.iL13oQZcE8LpY5E/l4WlVpG', 'admin')
ON CONFLICT (email) DO NOTHING;
