import React from 'react';
import SportsImageCard from './SportsImageCard';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsActionStrip Component
 * Horizontal cinematic action image strip using strict 12-column grid:
 * [ LARGE FOOTBALL (4 cols) ] [ TENNIS (2 cols) ] [ BASKETBALL (2 cols) ] [ ATHLETICS (2 cols) ] [ SWIMMING (2 cols) ]
 */
export default function SportsActionStrip({ 
  title = "Athletic Precision & Movement", 
  subtitle = "High-Energy Sports Moments — Peak physical discipline across international sporting disciplines.",
  className = "" 
}) {
  const footballImg = sportsImageManifest.find(i => i.id === 'football-01') || sportsImageManifest[0];
  const tennisImg = sportsImageManifest.find(i => i.id === 'tennis-01') || sportsImageManifest[1];
  const basketballImg = sportsImageManifest.find(i => i.id === 'basketball-01') || sportsImageManifest[2];
  const athleticsImg = sportsImageManifest.find(i => i.id === 'athletics-01') || sportsImageManifest[3];
  const swimmingImg = sportsImageManifest.find(i => i.id === 'swimming-01') || sportsImageManifest[4];

  return (
    <section className={`sports-system-section ${className}`}>
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: '#10b981' }} />
            Dynamic Sports Action
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* 12-Column Asymmetric Strip */}
        <div className="sports-grid-12">
          {/* 1. Large Football (4 cols) */}
          {footballImg && (
            <div className="col-span-4">
              <SportsImageCard
                src={footballImg.src}
                alt={footballImg.alt}
                title={footballImg.title}
                desc={footballImg.alt}
                category={footballImg.category}
                number="01"
                photographer={footballImg.photographer}
                aspectRatio="3-4"
              />
            </div>
          )}

          {/* 2. Tennis (2 cols) */}
          {tennisImg && (
            <div className="col-span-2">
              <SportsImageCard
                src={tennisImg.src}
                alt={tennisImg.alt}
                title={tennisImg.title}
                desc={tennisImg.alt}
                category={tennisImg.category}
                number="02"
                photographer={tennisImg.photographer}
                aspectRatio="3-4"
              />
            </div>
          )}

          {/* 3. Basketball (2 cols) */}
          {basketballImg && (
            <div className="col-span-2">
              <SportsImageCard
                src={basketballImg.src}
                alt={basketballImg.alt}
                title={basketballImg.title}
                desc={basketballImg.alt}
                category={basketballImg.category}
                number="03"
                photographer={basketballImg.photographer}
                aspectRatio="3-4"
              />
            </div>
          )}

          {/* 4. Athletics (2 cols) */}
          {athleticsImg && (
            <div className="col-span-2">
              <SportsImageCard
                src={athleticsImg.src}
                alt={athleticsImg.alt}
                title={athleticsImg.title}
                desc={athleticsImg.alt}
                category={athleticsImg.category}
                number="04"
                photographer={athleticsImg.photographer}
                aspectRatio="3-4"
              />
            </div>
          )}

          {/* 5. Swimming (2 cols) */}
          {swimmingImg && (
            <div className="col-span-2">
              <SportsImageCard
                src={swimmingImg.src}
                alt={swimmingImg.alt}
                title={swimmingImg.title}
                desc={swimmingImg.alt}
                category={swimmingImg.category}
                number="05"
                photographer={swimmingImg.photographer}
                aspectRatio="3-4"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
