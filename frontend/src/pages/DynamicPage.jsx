import React, { useEffect } from 'react';
import { useParams, useLocation, Navigate, Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import DynamicSectionRenderer from '../components/DynamicSectionRenderer';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

const DynamicPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { cmsConfig, loading, isDraftPreview } = useSite();
  const { lang } = useLanguage();

  // Determine current page slug from route params or pathname
  const extractSlug = () => {
    if (slug) {
      return slug.replace(/^\/+|\/+$/g, '').toLowerCase();
    }
    const path = location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    // Strip language prefixes like 'en/'
    if (path.startsWith('en/')) {
      return path.substring(3).replace(/^\/+|\/+$/g, '');
    }
    if (path === 'en' || path === '') {
      return 'home';
    }
    return path;
  };

  const currentSlug = extractSlug();

  // Find matching page in cmsConfig
  const pages = cmsConfig?.pages || {};
  let pageKey = null;
  let pageData = null;

  // Direct key match
  if (pages[currentSlug]) {
    pageKey = currentSlug;
    pageData = pages[currentSlug];
  } else {
    // Search by slug property or match key
    const foundEntry = Object.entries(pages).find(([k, p]) => {
      const pSlug = (p.slug || k).replace(/^\/+|\/+$/g, '').toLowerCase();
      return pSlug === currentSlug || k.toLowerCase() === currentSlug;
    });

    if (foundEntry) {
      pageKey = foundEntry[0];
      pageData = foundEntry[1];
    }
  }

  // Update Page Title and Meta Tags
  useEffect(() => {
    if (pageData) {
      const pageTitle = pageData.seo_title || pageData.title || (currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1));
      document.title = `${pageTitle} | Sports & MICE`;

      // Update meta description if present
      if (pageData.seo_description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = pageData.seo_description;
      }
    }
  }, [pageData, currentSlug]);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="admin-spinner" style={{ width: '40px', height: '40px', border: '4px solid #eee', borderTopColor: '#ff0000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading page...</p>
        </div>
      </div>
    );
  }

  // Page not found or page is disabled (unless in admin draft preview mode)
  if (!pageData || (pageData.enabled === false && !isDraftPreview)) {
    return (
      <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '560px', width: '100%', background: '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <AlertCircle size={32} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1f242d', marginBottom: '12px' }}>Page Not Found</h1>
          <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
            The page <code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', color: '#0f172a' }}>/{currentSlug}</code> does not exist or has not been published yet.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <Link to="/" className="btn-red-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Home size={16} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get sections for this page
  const pageSections = (cmsConfig?.sections?.[pageKey] || []).filter(s => s.enabled !== false || isDraftPreview);

  // If page exists but has no sections yet, show a clean placeholder or hero
  if (pageSections.length === 0) {
    return (
      <div>
        <section className="about-hero-banner" style={{ backgroundImage: pageData.hero_bg_image ? `url('${pageData.hero_bg_image}')` : `url('/assets/images/home_hero_bg.jpg')` }}>
          <div className="container">
            <h1 className="about-hero-title">{pageData.title || currentSlug}</h1>
          </div>
        </section>
        <section style={{ padding: '80px 20px', textAlign: 'center', minHeight: '30vh' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.6rem', color: '#1f242d', marginBottom: '16px' }}>{pageData.title || 'Welcome'}</h2>
            <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              {pageData.seo_description || 'Content for this page is being prepared.'}
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="dynamic-page-content">
      {pageSections.map((section, idx) => (
        <DynamicSectionRenderer
          key={section.id || idx}
          section={section}
          pageKey={pageKey}
          isBuilderMode={false}
        />
      ))}
    </div>
  );
};

export default DynamicPage;
