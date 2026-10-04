import React from 'react';
import SportsImageCard from './SportsImageCard';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsDestinationGrid Component
 * Additional destination, stadium, and event photography for Hotels & More page:
 * - High-Performance Training Hubs & Sports Resorts (6 cols each)
 * - Delegation Transit, Airport Logistics & International Congresses (4 cols each)
 */
export default function SportsDestinationGrid({
  title = "Sports Venues & Hospitality Showcase",
  subtitle = "Global Arenas, High-Performance Training Hubs & Dedicated Delegation Stays.",
  className = ""
}) {
  const stadium1 = sportsImageManifest.find(i => i.id === 'stadium-01') || sportsImageManifest[0];
  const stadium2 = sportsImageManifest.find(i => i.id === 'stadium-02') || sportsImageManifest[1];
  const travel = sportsImageManifest.find(i => i.id === 'travel-01') || sportsImageManifest[2];
  const events1 = sportsImageManifest.find(i => i.id === 'events-01') || sportsImageManifest[3];
  const events2 = sportsImageManifest.find(i => i.id === 'events-02') || sportsImageManifest[4];

  return (
    <section className={`sports-system-section ${className}`}>
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: '#06b6d4' }} />
            Venues & Hospitality
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* 12-Column Responsive Layout */}
        <div className="sports-grid-12" style={{ rowGap: '28px' }}>
          {stadium1 && (
            <div className="col-span-6">
              <SportsImageCard
                src={stadium1.src}
                alt={stadium1.alt}
                title={stadium1.title}
                desc={stadium1.alt}
                category={stadium1.category}
                number="01"
                photographer={stadium1.photographer}
                aspectRatio="16-9"
              />
            </div>
          )}
          {stadium2 && (
            <div className="col-span-6">
              <SportsImageCard
                src={stadium2.src}
                alt={stadium2.alt}
                title={stadium2.title}
                desc={stadium2.alt}
                category={stadium2.category}
                number="02"
                photographer={stadium2.photographer}
                aspectRatio="16-9"
              />
            </div>
          )}

          {travel && (
            <div className="col-span-4">
              <SportsImageCard
                src={travel.src}
                alt={travel.alt}
                title={travel.title}
                desc={travel.alt}
                category={travel.category}
                number="03"
                photographer={travel.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}
          {events1 && (
            <div className="col-span-4">
              <SportsImageCard
                src={events1.src}
                alt={events1.alt}
                title={events1.title}
                desc={events1.alt}
                category={events1.category}
                number="04"
                photographer={events1.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}
          {events2 && (
            <div className="col-span-4">
              <SportsImageCard
                src={events2.src}
                alt={events2.alt}
                title={events2.title}
                desc={events2.alt}
                category={events2.category}
                number="05"
                photographer={events2.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
