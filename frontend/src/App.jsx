import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';

// Public Layout & Components
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollProgressBar from './components/ScrollProgressBar';
import FloatingWidgets from './components/FloatingWidgets';
import CustomCursor from './components/CustomCursor';

// Public Pages
import Home from './pages/Home';
import Service from './pages/Service';
import AboutUs from './pages/AboutUs';
import HotelsMore from './pages/HotelsMore';
import Contact from './pages/Contact';
import Imprint from './pages/Imprint';
import DynamicPage from './pages/DynamicPage';

// Lazy-loaded Admin Pages & Layout (Excluded from initial public bundle)
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPages = lazy(() => import('./pages/admin/AdminPages'));
const AdminSections = lazy(() => import('./pages/admin/AdminSections'));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'));
const AdminButtons = lazy(() => import('./pages/admin/AdminButtons'));
const AdminAnimations = lazy(() => import('./pages/admin/AdminAnimations'));
const AdminTheme = lazy(() => import('./pages/admin/AdminTheme'));
const AdminHeaderFooter = lazy(() => import('./pages/admin/AdminHeaderFooter'));
const AdminContentCRUD = lazy(() => import('./pages/admin/AdminContentCRUD'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'));
const AdminForms = lazy(() => import('./pages/admin/AdminForms'));
const AdminFormDetail = lazy(() => import('./pages/admin/AdminFormDetail'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminWebsiteBuilder = lazy(() => import('./pages/admin/AdminWebsiteBuilder'));
import ProtectedRoute from './components/admin/ProtectedRoute';

import './styles/global.css';

// Admin Loading Fallback Spinner
const AdminLoadingFallback = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0d1117',
    color: '#ffffff',
    fontFamily: 'sans-serif',
    gap: '16px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(255,255,255,0.1)',
      borderTopColor: '#ff3333',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <span style={{ fontSize: '14px', letterSpacing: '0.5px', color: '#8b949e' }}>Loading Workspace...</span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { setLang } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (pathname.startsWith('/en/') || pathname === '/' || pathname === '/en') {
      // Keep or default to English
    } else if (
      pathname.includes('Dienstleistung') || 
      pathname.includes('Über-uns') || 
      pathname.includes('Hotels-mehr') || 
      pathname.includes('Kontakt') ||
      pathname === '/Impressum-Datenschutzverordnung/'
    ) {
      setLang('de');
    }
  }, [pathname, setLang]);

  return null;
};

// Public Website Shell
const PublicLayout = ({ children }) => {
  return (
    <div className="site-wrapper">
      <CustomCursor />
      <ScrollProgressBar />
      <ScrollToTop />
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <FloatingWidgets />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= ADMIN CMS & BUILDER ROUTES (Lazy Loaded) ================= */}
      <Route 
        path="/admin/login" 
        element={
          <Suspense fallback={<AdminLoadingFallback />}>
            <AdminLogin />
          </Suspense>
        } 
      />
      
      {/* Dedicated Visual Studio Route */}
      <Route 
        path="/admin/website-builder" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminWebsiteBuilder />
            </Suspense>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Suspense fallback={<AdminLoadingFallback />}><AdminDashboard /></Suspense>} />

        {/* Website Builder Sub-routes */}
        <Route path="builder/visual" element={<Navigate to="/admin/website-builder" replace />} />
        <Route path="builder/pages" element={<Suspense fallback={<AdminLoadingFallback />}><AdminPages /></Suspense>} />
        <Route path="builder/sections" element={<Suspense fallback={<AdminLoadingFallback />}><AdminSections /></Suspense>} />
        <Route path="builder/media" element={<Suspense fallback={<AdminLoadingFallback />}><AdminMedia /></Suspense>} />
        <Route path="builder/buttons" element={<Suspense fallback={<AdminLoadingFallback />}><AdminButtons /></Suspense>} />
        <Route path="builder/animations" element={<Suspense fallback={<AdminLoadingFallback />}><AdminAnimations /></Suspense>} />
        <Route path="builder/theme" element={<Suspense fallback={<AdminLoadingFallback />}><AdminTheme /></Suspense>} />
        <Route path="builder/header" element={<Suspense fallback={<AdminLoadingFallback />}><AdminHeaderFooter /></Suspense>} />
        <Route path="builder/footer" element={<Suspense fallback={<AdminLoadingFallback />}><AdminHeaderFooter /></Suspense>} />

        {/* Content Collections Sub-routes */}
        <Route path="content" element={<Navigate to="/admin/content/services" replace />} />
        <Route path="content/services" element={<Suspense fallback={<AdminLoadingFallback />}><AdminContentCRUD /></Suspense>} />
        <Route path="content/team" element={<Suspense fallback={<AdminLoadingFallback />}><AdminContentCRUD /></Suspense>} />
        <Route path="content/testimonials" element={<Suspense fallback={<AdminLoadingFallback />}><AdminContentCRUD /></Suspense>} />
        <Route path="content/faqs" element={<Suspense fallback={<AdminLoadingFallback />}><AdminContentCRUD /></Suspense>} />
        <Route path="content/gallery" element={<Suspense fallback={<AdminLoadingFallback />}><AdminContentCRUD /></Suspense>} />

        {/* Form Submissions */}
        <Route path="forms" element={<Suspense fallback={<AdminLoadingFallback />}><AdminForms /></Suspense>} />
        <Route path="forms/:id" element={<Suspense fallback={<AdminLoadingFallback />}><AdminFormDetail /></Suspense>} />

        {/* Settings, Audit & Profile */}
        <Route path="audit-logs" element={<Suspense fallback={<AdminLoadingFallback />}><AdminAuditLogs /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<AdminLoadingFallback />}><AdminSettings /></Suspense>} />
        <Route path="profile" element={<Suspense fallback={<AdminLoadingFallback />}><AdminProfile /></Suspense>} />
      </Route>

      {/* ================= PUBLIC WEBSITE ROUTES ================= */}
      {/* English / Default Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/en/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/en/Service/" element={<PublicLayout><Service /></PublicLayout>} />
      <Route path="/en/About-us/" element={<PublicLayout><AboutUs /></PublicLayout>} />
      <Route path="/en/Hotels-more/" element={<PublicLayout><HotelsMore /></PublicLayout>} />
      <Route path="/en/Contact/" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/en/Impressum-Datenschutzverordnung/" element={<PublicLayout><Imprint /></PublicLayout>} />
      <Route path="/en/Imprint-Data-Protection-Regulation/" element={<PublicLayout><Imprint /></PublicLayout>} />

      {/* German Routes */}
      <Route path="/Dienstleistung/" element={<PublicLayout><Service /></PublicLayout>} />
      <Route path="/Über-uns/" element={<PublicLayout><AboutUs /></PublicLayout>} />
      <Route path="/Hotels-mehr/" element={<PublicLayout><HotelsMore /></PublicLayout>} />
      <Route path="/Kontakt/" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/Impressum-Datenschutzverordnung/" element={<PublicLayout><Imprint /></PublicLayout>} />

      {/* Dynamic Database-Driven Routes (e.g. /doctors, /team, /en/doctors) */}
      <Route path="/en/:slug" element={<PublicLayout><DynamicPage /></PublicLayout>} />
      <Route path="/en/:slug/" element={<PublicLayout><DynamicPage /></PublicLayout>} />
      <Route path="/:slug" element={<PublicLayout><DynamicPage /></PublicLayout>} />
      <Route path="/:slug/" element={<PublicLayout><DynamicPage /></PublicLayout>} />

      {/* Catch-all dynamic fallback */}
      <Route path="*" element={<PublicLayout><DynamicPage /></PublicLayout>} />
    </Routes>
  );
};

import { EditorProvider } from './context/EditorContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteProvider>
          <EditorProvider>
            <LanguageProvider>
              <AppRoutes />
            </LanguageProvider>
          </EditorProvider>
        </SiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
