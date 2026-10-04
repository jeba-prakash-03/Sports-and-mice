import React from 'react';
import SportsImageCard from './SportsImageCard';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsMoments Component
 * Emotional and High-Intensity Sporting Moments Showcase:
 * Structured 3x2 Grid (4 cols each) with individual 3D hover physics.
 */
export default function SportsMoments({
  title = "Sports Moments & Emotion",
  subtitle = "The Unforgettable Drama of International Live Competition — Precision, Sacrifice, and Triumph.",
  className = ""
}) {
  const moments = [
    sportsImageManifest.find(i => i.id === 'team-03') || sportsImageManifest[0],
    sportsImageManifest.find(i => i.id === 'volleyball-01') || sportsImageManifest[1],
    sportsImageManifest.find(i => i.id === 'hockey-01') || sportsImageManifest[2],
    sportsImageManifest.find(i => i.id === 'athletics-03') || sportsImageManifest[3],
    sportsImageManifest.find(i => i.id === 'tennis-03') || sportsImageManifest[4],
    sportsImageManifest.find(i => i.id === 'football-04') || sportsImageManifest[5],
  ].filter(Boolean);

  return (
    <section className={`sports-system-section ${className}`}>
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: '#f97316' }} />
            Championship Moments
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* 12-Column Responsive Grid (6 cards = 2 rows of 3) */}
        <div className="sports-grid-12" style={{ rowGap: '28px' }}>
          {moments.map((item, idx) => (
            <div key={item.id} className="col-span-4">
              <SportsImageCard
                src={item.src}
                alt={item.alt}
                title={item.title}
                desc={item.alt}
                category={item.category}
                number={`0${idx + 1}`}
                photographer={item.photographer}
                aspectRatio="16-9"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
