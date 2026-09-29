# Deployment & Setup Guide for Sports & MICE

This guide explains how to run the project locally and deploy it to production (**Vercel** for Frontend + **PHP Hosting / InfinityFree / Shared Apache / Render** for Backend + **MySQL** for Database).

---

## 🏗️ Architecture Overview

- **Frontend**: React + Vite SPA (Deployable on **Vercel**, Netlify, etc.)
- **Backend**: PHP 7.4+ / 8.x REST API with automatic JSON file fallback + MySQL PDO support.
- **Database**: MySQL 5.7+ / 8.0+ / MariaDB (Schema in [`database.sql`](file:///home/jeba-prakash/Jeba/sports%20and%20mice/database.sql)).
- **Configuration**: Strictly environment & config-file driven. No manual source code changes needed between local and production.

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js** (v18+) & **npm**
- **PHP** (v7.4+ or 8.x) CLI installed
- (Optional) **MySQL** Server (if using local database; otherwise backend automatically uses fallback JSON storage in `backend/data/`)

### 2. Backend Local Start
1. Navigate to the project root:
   ```bash
   cd "/home/jeba-prakash/Jeba/sports and mice"
   ```
2. (Optional) Configure database in `backend/config.php` (copy from `backend/config.sample.php`):
   ```php
   <?php
   return [
       'db_host' => '127.0.0.1',
       'db_port' => '3306',
       'db_name' => 'sports_and_mice',
       'db_user' => 'root',
       'db_pass' => '',
       'app_env' => 'development',
       'allowed_origins' => [
           'http://localhost:5173',
           'http://localhost:3000'
       ]
   ];
   ```
3. Start the PHP built-in server with router:
   ```bash
   php -S 127.0.0.1:8000 backend/router.php
   ```

### 3. Frontend Local Start
1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.
4. Admin panel is available at `http://localhost:5173/admin/login` (Default credentials: `admin@sportsandmice.com` / `admin123`).

---

## 🚀 Production Deployment Step-by-Step

---

### Step 1: Database Setup (MySQL)

1. Open your MySQL management panel (phpMyAdmin, cPanel MySQL, Supabase, Railway MySQL, or Render).
2. Create a new database (e.g. `sports_and_mice` or your host-assigned DB name).
3. Import the [`database.sql`](file:///home/jeba-prakash/Jeba/sports%20and%20mice/database.sql) file located in the root of this project.
4. Note down your Database credentials:
   - **Host** (e.g., `sql123.infinityfree.com` or `aws.connect.psdb.cloud`)
   - **Database Name**
   - **Username**
   - **Password**
   - **Port** (default 3306)

---

### Step 2: Backend Deployment (PHP Hosting / Apache / InfinityFree)

1. **Upload Files**:
   Upload the entire contents of the `backend/` directory to your web server (e.g., inside `public_html/api/` or `htdocs/api/`).
   
   *Example target structure on host:*
   ```text
   public_html/
   ├── api/
   │   ├── config.php          <-- Created in step 2 below
   │   ├── cors.php
   │   ├── router.php
   │   ├── index.php
   │   ├── .htaccess
   │   ├── config/
   │   ├── controllers/
   │   ├── models/
   │   ├── middleware/
   │   └── data/               <-- Ensure write permissions (chmod 775 / 777)
   ```

2. **Create `backend/config.php` on Server**:
   Create `config.php` inside the backend directory on your server with your production database credentials:
   ```php
   <?php
   return [
       'db_host' => 'YOUR_PRODUCTION_DB_HOST',
       'db_port' => '3306',
       'db_name' => 'YOUR_PRODUCTION_DB_NAME',
       'db_user' => 'YOUR_PRODUCTION_DB_USER',
       'db_pass' => 'YOUR_PRODUCTION_DB_PASSWORD',
       'app_env' => 'production',
       'allowed_origins' => [
           'https://your-frontend.vercel.app',
           'https://www.yourcustomdomain.com'
       ]
   ];
   ```

3. **Verify Backend Health**:
   Open in your browser: `https://your-backend-domain.com/api/health`
   You should receive:
   ```json
   {
       "status": "healthy",
       "service": "sports-and-mice-api",
       "environment": "production"
   }
   ```

---

### Step 3: Frontend Deployment (Vercel)

1. **Push your repository** to GitHub:
   ```bash
   git add .
   git commit -m "Deployment ready setup"
   git push origin main
   ```

2. **Import into Vercel**:
   - Log in to [Vercel Dashboard](https://vercel.com).
   - Click **Add New** → **Project**.
   - Select your `Sports-and-mice` GitHub repository.

3. **Configure Build & Project Settings in Vercel**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` *(Click Edit and choose `frontend`)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables in Vercel**:
   In the **Environment Variables** section, add:
   | Key | Value | Example |
   |---|---|---|
   | `VITE_API_URL` | Your production backend API endpoint (without trailing slash) | `https://your-backend-domain.com/api` |

5. Click **Deploy**.

---

## 🔒 Cloudinary Media Storage (Optional)

If you wish to store uploaded media files directly on Cloudinary rather than the server filesystem:
Add these keys in your `backend/config.php` or as server environment variables:
```php
'cloudinary_cloud_name' => 'YOUR_CLOUD_NAME',
'cloudinary_api_key'    => 'YOUR_API_KEY',
'cloudinary_api_secret' => 'YOUR_API_SECRET',
```

---

## 🧪 Post-Deployment Checklist

- [ ] **Public Pages**: Verify `/en/`, `/en/About-us/`, `/en/Hotels-more/`, `/en/Service/`, `/en/Contact/` load with correct page content.
- [ ] **Contact Form**: Submit a message on `/en/Contact/` and verify success feedback.
- [ ] **Admin Login**: Visit `/admin/login` and log in with default credentials.
- [ ] **Form Inquiries**: Go to Admin Dashboard → Inquiries to view the submitted message.
- [ ] **CMS Editor**: Change a text string in Admin Website Builder or Content Editor, click Save, and verify changes appear live on the public site.
- [ ] **Security**: Change the default admin password in `/admin/profile` after your first login.
