import React from 'react';
import SportsImageCard from './SportsImageCard';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsExperienceStrip Component
 * Sequential sports journey for About Page:
 * Step 1: Athlete Training & Conditioning
 * Step 2: Tactical Preparation & Briefings
 * Step 3: Global Competition
 * Step 4: Championship Podium Celebration
 * Step 5: State-of-the-Art Venues
 */
export default function SportsExperienceStrip({
  title = "The High-Performance Sports Journey",
  subtitle = "From Intensive Preparation and Delegation Coordination to Championship Triumph.",
  className = ""
}) {
  const steps = [
    {
      step: "01",
      label: "Conditioning & Training",
      item: sportsImageManifest.find(i => i.id === 'team-01') || sportsImageManifest[0]
    },
    {
      step: "02",
      label: "Tactical Preparation",
      item: sportsImageManifest.find(i => i.id === 'team-02') || sportsImageManifest[1]
    },
    {
      step: "03",
      label: "Global Competition",
      item: sportsImageManifest.find(i => i.id === 'football-01') || sportsImageManifest[2]
    },
    {
      step: "04",
      label: "Podium Celebration",
      item: sportsImageManifest.find(i => i.id === 'team-03') || sportsImageManifest[3]
    },
    {
      step: "05",
      label: "World-Class Venues",
      item: sportsImageManifest.find(i => i.id === 'stadium-01') || sportsImageManifest[4]
    }
  ];

  return (
    <section className={`sports-system-section ${className}`}>
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: '#f59e0b' }} />
            Athlete Lifecycle
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* 5-Step Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--sports-gap-desktop)',
            width: '100%'
          }}
        >
          {steps.map((st) => (
            <div key={st.step} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#f59e0b', fontSize: '0.9rem' }}>
                  {st.step}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e5e7eb' }}>
                  {st.label}
                </span>
              </div>
              <SportsImageCard
                src={st.item.src}
                alt={st.item.alt}
                title={st.item.title}
                desc={st.item.alt}
                category={st.item.category}
                number={st.step}
                photographer={st.item.photographer}
                aspectRatio="3-4"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
