import React from 'react';
import SportsImageCard from './SportsImageCard';
import CinematicSportsCard from './CinematicSportsCard';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsImageWall Component
 * Asymmetric editorial sports gallery for Service Page:
 * Row 1: [ FOOTBALL (7 cols) ] [ TENNIS (5 cols) ]
 * Row 2: [ BASKETBALL (4 cols) ] [ ATHLETICS (4 cols) ] [ SWIMMING (4 cols) ]
 * Row 3: [ CYCLING (8 cols) ] [ VOLLEYBALL (4 cols) ]
 * Row 4: [ HOCKEY (12 cols full width panorama) ]
 */
export default function SportsImageWall({
  title = "Multi-Discipline Sports Excellence Wall",
  subtitle = "Supporting Elite Athletes, Coaches, and Sports Delegations Across International Arenas.",
  className = ""
}) {
  const football = sportsImageManifest.find(i => i.id === 'football-02') || sportsImageManifest[0];
  const tennis = sportsImageManifest.find(i => i.id === 'tennis-01') || sportsImageManifest[1];
  const basketball = sportsImageManifest.find(i => i.id === 'basketball-03') || sportsImageManifest[2];
  const athletics = sportsImageManifest.find(i => i.id === 'athletics-01') || sportsImageManifest[3];
  const swimming = sportsImageManifest.find(i => i.id === 'swimming-01') || sportsImageManifest[4];
  const cycling = sportsImageManifest.find(i => i.id === 'cycling-02') || sportsImageManifest[5];
  const volleyball = sportsImageManifest.find(i => i.id === 'volleyball-02') || sportsImageManifest[6];
  const hockey = sportsImageManifest.find(i => i.id === 'hockey-02') || sportsImageManifest[7];

  return (
    <section className={`sports-system-section ${className}`}>
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: '#10b981' }} />
            Disciplines Supported
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* 12-Column Asymmetric Multi-Tier Wall */}
        <div className="sports-grid-12" style={{ rowGap: '28px' }}>
          {/* Tier 1: [ FOOTBALL (7 cols) ] [ TENNIS (5 cols) ] */}
          {football && (
            <div className="col-span-7" style={{ display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
              <SportsImageCard
                src={football.src}
                alt={football.alt}
                title={football.title}
                desc={football.alt}
                category={football.category}
                number="01"
                photographer={football.photographer}
                aspectRatio="fill"
              />
            </div>
          )}
          {tennis && (
            <div className="col-span-5" style={{ display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
              <SportsImageCard
                src={tennis.src}
                alt={tennis.alt}
                title={tennis.title}
                desc={tennis.alt}
                category={tennis.category}
                number="02"
                photographer={tennis.photographer}
                aspectRatio="fill"
              />
            </div>
          )}

          {/* Tier 2: [ BASKETBALL (4 cols) ] [ ATHLETICS (4 cols) ] [ SWIMMING (4 cols) ] */}
          {basketball && (
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
              <SportsImageCard
                src={basketball.src}
                alt={basketball.alt}
                title={basketball.title}
                desc={basketball.alt}
                category={basketball.category}
                number="03"
                photographer={basketball.photographer}
                aspectRatio="fill"
              />
            </div>
          )}
          {athletics && (
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
              <SportsImageCard
                src={athletics.src}
                alt={athletics.alt}
                title={athletics.title}
                desc={athletics.alt}
                category={athletics.category}
                number="04"
                photographer={athletics.photographer}
                aspectRatio="fill"
              />
            </div>
          )}
          {swimming && (
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
              <SportsImageCard
                src={swimming.src}
                alt={swimming.alt}
                title={swimming.title}
                desc={swimming.alt}
                category={swimming.category}
                number="05"
                photographer={swimming.photographer}
                aspectRatio="fill"
              />
            </div>
          )}

          {/* Tier 3: [ CYCLING (8 cols) ] [ VOLLEYBALL (4 cols) ] */}
          {cycling && (
            <div className="col-span-8" style={{ display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
              <SportsImageCard
                src={cycling.src}
                alt={cycling.alt}
                title={cycling.title}
                desc={cycling.alt}
                category={cycling.category}
                number="06"
                photographer={cycling.photographer}
                aspectRatio="fill"
              />
            </div>
          )}
          {volleyball && (
            <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
              <SportsImageCard
                src={volleyball.src}
                alt={volleyball.alt}
                title={volleyball.title}
                desc={volleyball.alt}
                category={volleyball.category}
                number="07"
                photographer={volleyball.photographer}
                aspectRatio="fill"
              />
            </div>
          )}

          {/* Tier 4: [ HOCKEY (12 cols full width feature) ] */}
          {hockey && (
            <div className="col-span-12" style={{ display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
              <CinematicSportsCard
                src={hockey.src}
                alt={hockey.alt}
                title={hockey.title}
                subtitle="High Velocity Turf Action"
                category={hockey.category}
                number="08"
                photographer={hockey.photographer}
                aspectRatio="fill"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
