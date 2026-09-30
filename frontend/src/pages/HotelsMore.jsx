import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { PageTransition } from '../components/AnimatedSection';
import DynamicSectionRenderer from '../components/DynamicSectionRenderer';
import { AlertCircle, RefreshCw } from 'lucide-react';
import '../styles/hotels.css';

const HotelsMore = () => {
  const { cmsConfig, loading, error, loadSiteConfig } = useSite();
  const hotelsSections = cmsConfig?.sections?.hotels || [];
  const sortedSections = [...hotelsSections].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (loading) {
    return (
      <div className="page-loading-wrapper" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', border: '3px solid #eee', borderTopColor: '#ff0000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#666', fontSize: '1.05rem', fontWeight: 500 }}>Loading page...</p>
        </div>
      </div>
    );
  }

  if (error && sortedSections.length === 0) {
    return (
      <div className="page-error-wrapper" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: '#fcfcfc' }}>
        <div style={{ maxWidth: '540px', width: '100%', background: '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #eee' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <AlertCircle size={30} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f242d', marginBottom: '10px' }}>Unable to load page content</h2>
          <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Could not retrieve content from the backend API.
          </p>
          <button 
            onClick={() => loadSiteConfig(false)} 
            className="btn-red-pill" 
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
      <div className="hotels-page">
        {sortedSections.map(section => (
          <DynamicSectionRenderer 
            key={section.id} 
            section={section} 
            pageKey="hotels" 
          />
        ))}
      </div>
    </PageTransition>
  );
};

export default HotelsMore;
