import React from 'react';
import CinematicSportsCard from './CinematicSportsCard';
import SportsImageCard from './SportsImageCard';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsImageShowcase Component
 * Premier Sports Photography Editorial Showcase:
 * Top: 1 Ultra-Wide Cinematic Sports Feature Card (12 cols)
 * Bottom: 3 Balanced 4-Column Cards (Football, Athletics, Team)
 */
export default function SportsImageShowcase({
  title = "Sports & MICE Photography Showcase",
  subtitle = "Dynamic visual storytelling across world championships, international leagues, and federation events.",
  className = ""
}) {
  const feature = sportsImageManifest.find(i => i.id === 'football-05') || sportsImageManifest[0];
  const card1 = sportsImageManifest.find(i => i.id === 'team-03') || sportsImageManifest[1];
  const card2 = sportsImageManifest.find(i => i.id === 'athletics-01') || sportsImageManifest[2];
  const card3 = sportsImageManifest.find(i => i.id === 'stadium-02') || sportsImageManifest[3];

  return (
    <section className={`sports-system-section ${className}`}>
      <div className="sports-container">
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" />
            Editorial Showcase
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        <div className="sports-grid-12" style={{ rowGap: '28px' }}>
          {/* Top Row: Full 12-Column Feature */}
          {feature && (
            <div className="col-span-12">
              <CinematicSportsCard
                src={feature.src}
                alt={feature.alt}
                title={feature.title}
                subtitle="Championship Arena Atmosphere"
                category={feature.category}
                number="01"
                photographer={feature.photographer}
                aspectRatio="21-9"
              />
            </div>
          )}

          {/* Bottom Row: 3x 4-Column Cards */}
          {card1 && (
            <div className="col-span-4">
              <SportsImageCard
                src={card1.src}
                alt={card1.alt}
                title={card1.title}
                desc={card1.alt}
                category={card1.category}
                number="02"
                photographer={card1.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}

          {card2 && (
            <div className="col-span-4">
              <SportsImageCard
                src={card2.src}
                alt={card2.alt}
                title={card2.title}
                desc={card2.alt}
                category={card2.category}
                number="03"
                photographer={card2.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}

          {card3 && (
            <div className="col-span-4">
              <SportsImageCard
                src={card3.src}
                alt={card3.alt}
                title={card3.title}
                desc={card3.alt}
                category={card3.category}
                number="04"
                photographer={card3.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
