import React, { useRef } from 'react';
import SportsImageCard from './SportsImageCard';
import sportsImageManifest from '../../data/sportsImageManifest';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/sports.css';

/**
 * SportsImageRail Component
 * Horizontal interactive sports image rail aligned on a common baseline:
 * Football -> Basketball -> Tennis -> Athletics -> Swimming -> Cycling -> Volleyball -> Hockey
 */
export default function SportsImageRail({
  title = "Athletic Disciplines Stream",
  subtitle = "Scroll through global competitive sporting disciplines.",
  className = ""
}) {
  const scrollRef = useRef(null);

  const railItems = [
    sportsImageManifest.find(i => i.id === 'football-03') || sportsImageManifest[0],
    sportsImageManifest.find(i => i.id === 'basketball-03') || sportsImageManifest[1],
    sportsImageManifest.find(i => i.id === 'tennis-03') || sportsImageManifest[2],
    sportsImageManifest.find(i => i.id === 'athletics-03') || sportsImageManifest[3],
    sportsImageManifest.find(i => i.id === 'swimming-01') || sportsImageManifest[4],
    sportsImageManifest.find(i => i.id === 'cycling-01') || sportsImageManifest[5],
    sportsImageManifest.find(i => i.id === 'volleyball-01') || sportsImageManifest[6],
    sportsImageManifest.find(i => i.id === 'hockey-01') || sportsImageManifest[7],
  ].filter(Boolean);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className={`sports-system-section ${className}`}>
      <div className="sports-container">
        {/* Header with Navigation Arrows */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
          <div className="sports-section-header" style={{ marginBottom: 0 }}>
            <div className="sports-tag-pill">
              <span className="pill-dot" style={{ backgroundColor: '#10b981' }} />
              Sports Rail
            </div>
            <h2 className="sports-section-title">
              {title}
            </h2>
            <p className="sports-section-desc">
              {subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => scroll('left')}
              className="btn-rail-nav"
              aria-label="Scroll Left"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="btn-rail-nav"
              aria-label="Scroll Right"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Rail Viewport */}
        <div ref={scrollRef} className="sports-rail-viewport">
          <div className="sports-rail-track">
            {railItems.map((item, idx) => (
              <div key={item.id} className="sports-rail-item">
                <SportsImageCard
                  src={item.src}
                  alt={item.alt}
                  title={item.title}
                  desc={item.alt}
                  category={item.category}
                  number={`0${idx + 1}`}
                  photographer={item.photographer}
                  aspectRatio="4-3"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
