import React from 'react';
import SportsImageCard from './SportsImageCard';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsImageMosaic Component
 * Perfectly aligned editorial sports mosaic:
 * - Row 1: [ 1 Large (7 cols) ] + [ 2 Medium Stacked (5 cols) ]
 * - Row 2: [ 4 Small Disciplines (3 cols each) ]
 */
export default function SportsImageMosaic({
  title = "Multi-Discipline Sports Mosaic",
  subtitle = "High-precision athletic imagery across 7 major Olympic & federation disciplines.",
  className = ""
}) {
  const football = sportsImageManifest.find(i => i.id === 'football-02') || sportsImageManifest[0];
  const basketball = sportsImageManifest.find(i => i.id === 'basketball-02') || sportsImageManifest[1];
  const tennis = sportsImageManifest.find(i => i.id === 'tennis-02') || sportsImageManifest[2];

  const athletics = sportsImageManifest.find(i => i.id === 'athletics-02') || sportsImageManifest[3];
  const swimming = sportsImageManifest.find(i => i.id === 'swimming-02') || sportsImageManifest[4];
  const cycling = sportsImageManifest.find(i => i.id === 'cycling-02') || sportsImageManifest[5];
  const volleyball = sportsImageManifest.find(i => i.id === 'volleyball-02') || sportsImageManifest[6];

  return (
    <section className={`sports-system-section ${className}`}>
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: '#06b6d4' }} />
            Sports Mosaic
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* Mosaic Grid */}
        <div className="sports-grid-12" style={{ rowGap: '28px' }}>
          {/* Row 1 Left: Large Football (7 cols) */}
          {football && (
            <div className="col-span-7">
              <SportsImageCard
                src={football.src}
                alt={football.alt}
                title={football.title}
                desc={football.alt}
                category={football.category}
                number="01"
                photographer={football.photographer}
                aspectRatio="16-9"
              />
            </div>
          )}

          {/* Row 1 Right: 2 Medium Stacked (5 cols) */}
          <div className="col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sports-gap-desktop)' }}>
            {basketball && (
              <SportsImageCard
                src={basketball.src}
                alt={basketball.alt}
                title={basketball.title}
                desc={basketball.alt}
                category={basketball.category}
                number="02"
                photographer={basketball.photographer}
                aspectRatio="16-9"
              />
            )}
            {tennis && (
              <SportsImageCard
                src={tennis.src}
                alt={tennis.alt}
                title={tennis.title}
                desc={tennis.alt}
                category={tennis.category}
                number="03"
                photographer={tennis.photographer}
                aspectRatio="16-9"
              />
            )}
          </div>

          {/* Row 2: 4 Small Cards (3 cols each) */}
          {athletics && (
            <div className="col-span-3">
              <SportsImageCard
                src={athletics.src}
                alt={athletics.alt}
                title={athletics.title}
                desc={athletics.alt}
                category={athletics.category}
                number="04"
                photographer={athletics.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}

          {swimming && (
            <div className="col-span-3">
              <SportsImageCard
                src={swimming.src}
                alt={swimming.alt}
                title={swimming.title}
                desc={swimming.alt}
                category={swimming.category}
                number="05"
                photographer={swimming.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}

          {cycling && (
            <div className="col-span-3">
              <SportsImageCard
                src={cycling.src}
                alt={cycling.alt}
                title={cycling.title}
                desc={cycling.alt}
                category={cycling.category}
                number="06"
                photographer={cycling.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}

          {volleyball && (
            <div className="col-span-3">
              <SportsImageCard
                src={volleyball.src}
                alt={volleyball.alt}
                title={volleyball.title}
                desc={volleyball.alt}
                category={volleyball.category}
                number="07"
                photographer={volleyball.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
