import React from 'react';
import SportsImageCard from './SportsImageCard';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsImageGrid Component
 * Main Editorial 12-Column Sports Grid
 * Structure:
 * - Row 1: [ LARGE (7 cols) ] [ SMALL (5 cols) / SMALL (5 cols) ]
 * - Row 2: [ SMALL (5 cols) ] [ LARGE (7 cols) ]
 * - Row 3: [ 4 cols ] [ 4 cols ] [ 4 cols ]
 */
export default function SportsImageGrid({
  title = "Curated Sports Photography Showcase",
  subtitle = "High-energy athletic moments captured across international sporting federations.",
  className = ""
}) {
  // Grab high-impact images from manifest
  const imgLarge1 = sportsImageManifest.find(i => i.id === 'football-01') || sportsImageManifest[0];
  const imgSmall1 = sportsImageManifest.find(i => i.id === 'basketball-01') || sportsImageManifest[1];
  const imgSmall2 = sportsImageManifest.find(i => i.id === 'tennis-01') || sportsImageManifest[2];

  const imgSmall3 = sportsImageManifest.find(i => i.id === 'athletics-01') || sportsImageManifest[3];
  const imgLarge2 = sportsImageManifest.find(i => i.id === 'stadium-01') || sportsImageManifest[4];

  const imgRow3_1 = sportsImageManifest.find(i => i.id === 'swimming-01') || sportsImageManifest[5];
  const imgRow3_2 = sportsImageManifest.find(i => i.id === 'cycling-01') || sportsImageManifest[6];
  const imgRow3_3 = sportsImageManifest.find(i => i.id === 'volleyball-01') || sportsImageManifest[7];

  return (
    <section className={`sports-system-section ${className}`}>
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" />
            Editorial Sports Grid
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* 12-Column Grid */}
        <div className="sports-grid-12" style={{ rowGap: '32px' }}>
          {/* --- TIER 1: Large Left (7 cols) + Two Stacked Right (5 cols) --- */}
          {imgLarge1 && (
            <div className="col-span-7" style={{ display: 'flex', flexDirection: 'column' }}>
              <SportsImageCard
                src={imgLarge1.src}
                alt={imgLarge1.alt}
                title={imgLarge1.title}
                desc={imgLarge1.alt}
                category={imgLarge1.category}
                number="01"
                photographer={imgLarge1.photographer}
                aspectRatio="fill"
              />
            </div>
          )}

          <div className="col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sports-gap-desktop)' }}>
            {imgSmall1 && (
              <SportsImageCard
                src={imgSmall1.src}
                alt={imgSmall1.alt}
                title={imgSmall1.title}
                desc={imgSmall1.alt}
                category={imgSmall1.category}
                number="02"
                photographer={imgSmall1.photographer}
                aspectRatio="16-9"
              />
            )}
            {imgSmall2 && (
              <SportsImageCard
                src={imgSmall2.src}
                alt={imgSmall2.alt}
                title={imgSmall2.title}
                desc={imgSmall2.alt}
                category={imgSmall2.category}
                number="03"
                photographer={imgSmall2.photographer}
                aspectRatio="16-9"
              />
            )}
          </div>

          {/* --- TIER 2: Small Left (5 cols) + Large Right (7 cols) --- */}
          {imgSmall3 && (
            <div className="col-span-5" style={{ display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
              <SportsImageCard
                src={imgSmall3.src}
                alt={imgSmall3.alt}
                title={imgSmall3.title}
                desc={imgSmall3.alt}
                category={imgSmall3.category}
                number="04"
                photographer={imgSmall3.photographer}
                aspectRatio="fill"
              />
            </div>
          )}

          {imgLarge2 && (
            <div className="col-span-7" style={{ display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
              <SportsImageCard
                src={imgLarge2.src}
                alt={imgLarge2.alt}
                title={imgLarge2.title}
                desc={imgLarge2.alt}
                category={imgLarge2.category}
                number="05"
                photographer={imgLarge2.photographer}
                aspectRatio="fill"
              />
            </div>
          )}

          {/* --- TIER 3: Three 4-Column Balanced Cards --- */}
          {imgRow3_1 && (
            <div className="col-span-4">
              <SportsImageCard
                src={imgRow3_1.src}
                alt={imgRow3_1.alt}
                title={imgRow3_1.title}
                desc={imgRow3_1.alt}
                category={imgRow3_1.category}
                number="06"
                photographer={imgRow3_1.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}

          {imgRow3_2 && (
            <div className="col-span-4">
              <SportsImageCard
                src={imgRow3_2.src}
                alt={imgRow3_2.alt}
                title={imgRow3_2.title}
                desc={imgRow3_2.alt}
                category={imgRow3_2.category}
                number="07"
                photographer={imgRow3_2.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}

          {imgRow3_3 && (
            <div className="col-span-4">
              <SportsImageCard
                src={imgRow3_3.src}
                alt={imgRow3_3.alt}
                title={imgRow3_3.title}
                desc={imgRow3_3.alt}
                category={imgRow3_3.category}
                number="08"
                photographer={imgRow3_3.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
