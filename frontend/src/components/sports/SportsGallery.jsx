import React, { useState, useMemo } from 'react';
import SportsImageCard from './SportsImageCard';
import sportsImageManifest, { sportsCategories } from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsGallery Component
 * Comprehensive interactive sports gallery with category filter, search, and lightbox modal.
 * 100% Additive: Contains all newly curated sports photographs within a fixed 1400px container.
 */
export default function SportsGallery({
  title = "Sports & MICE Photography Archive",
  subtitle = "High-Resolution Visual Documentation of Worldwide Sports Operations",
  initialCategory = "all",
  showFilters = true,
  className = ""
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return sportsImageManifest.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.alt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section className={`sports-system-section ${className}`}>
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header text-center">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: '#3b82f6' }} />
            Media Library
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* Category Tabs */}
        {showFilters && (
          <div style={{ marginBottom: '36px', overflowX: 'auto', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {sportsCategories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      border: isActive ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.12)',
                      background: isActive ? '#2563eb' : 'rgba(255,255,255,0.05)',
                      color: isActive ? '#ffffff' : '#9ca3af',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{cat.name}</span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: '9999px',
                        background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                        color: '#fff'
                      }}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 12-Column Responsive Grid (3 cards per row on desktop) */}
        <div className="sports-grid-12" style={{ rowGap: '28px' }}>
          {filteredItems.map((item, idx) => (
            <div key={item.id} className="col-span-4" onClick={() => setActiveModalItem(item)}>
              <SportsImageCard
                src={item.src}
                alt={item.alt}
                title={item.title}
                desc={item.alt}
                category={item.category}
                number={`0${(idx % 9) + 1}`}
                photographer={item.photographer}
                aspectRatio="16-9"
              />
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color: '#9ca3af', margin: 0 }}>No images found matching your selection.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
          onClick={() => setActiveModalItem(null)}
        >
          <div 
            style={{
              position: 'relative',
              maxWidth: '900px',
              width: '100%',
              backgroundColor: '#16181d',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalItem(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            <div style={{ aspectRatio: '16 / 9', width: '100%', background: '#000' }}>
              <img
                src={activeModalItem.src}
                alt={activeModalItem.alt}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <span className="sports-cat-badge" style={{ marginBottom: '8px', display: 'inline-block' }}>
                  {activeModalItem.category}
                </span>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', margin: '4px 0 8px 0', fontWeight: 700 }}>
                  {activeModalItem.title}
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
                  {activeModalItem.alt}
                </p>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.6 }}>
                <div>📷 <strong>Author:</strong> {activeModalItem.photographer}</div>
                <div>📜 <strong>License:</strong> {activeModalItem.license}</div>
                <div>⚡ <strong>Category:</strong> {activeModalItem.category}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
