import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { PageTransition } from '../components/AnimatedSection';
import DynamicSectionRenderer from '../components/DynamicSectionRenderer';
import { AlertCircle, RefreshCw } from 'lucide-react';
import '../styles/service.css';

const Service = () => {
  const { cmsConfig, loading, error, loadSiteConfig } = useSite();
  const serviceSections = cmsConfig?.sections?.service || [];
  const sortedSections = [...serviceSections].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (loading) {
    return null;
  }

  if (error && sortedSections.length === 0) {
    return (
      <div className="page-error-wrapper" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: 'var(--color-ivory)' }}>
        <div style={{ maxWidth: '540px', width: '100%', background: 'var(--color-surface)', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-border)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(182, 83, 69, 0.1)', color: 'var(--color-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <AlertCircle size={30} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-oxblood)', marginBottom: '10px' }}>Unable to load page content</h2>
          <p style={{ color: 'var(--color-warm-gray)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Could not retrieve content from the backend API.
          </p>
          <button 
            onClick={() => loadSiteConfig(false)} 
            className="btn-primary" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none' }}
          >
            <RefreshCw size={16} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="service-page">
        {sortedSections.map(section => (
          <DynamicSectionRenderer 
            key={section.id} 
            section={section} 
            pageKey="service" 
          />
        ))}
      </div>
    </PageTransition>
  );
};

export default Service;
