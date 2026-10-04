import React from 'react';
import SportsImageCard from './SportsImageCard';
import CinematicSportsCard from './CinematicSportsCard';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsEditorialGrid Component
 * Premium Sports Photography Editorial Showcase:
 * [ 1 LARGE FEATURE (12 cols) ]
 * [ 2 MEDIUM (6 cols each) ]
 * [ 3 SMALL (4 cols each) ]
 */
export default function SportsEditorialGrid({
  title = "Sports Editorial Showcase",
  subtitle = "Curated Moments of Elite Sporting Achievement and Championship Focus.",
  className = ""
}) {
  const largeImg = sportsImageManifest.find(i => i.id === 'football-05') || sportsImageManifest[0];
  const medImg1 = sportsImageManifest.find(i => i.id === 'basketball-02') || sportsImageManifest[1];
  const medImg2 = sportsImageManifest.find(i => i.id === 'tennis-02') || sportsImageManifest[2];
  const smallImg1 = sportsImageManifest.find(i => i.id === 'athletics-02') || sportsImageManifest[3];
  const smallImg2 = sportsImageManifest.find(i => i.id === 'swimming-02') || sportsImageManifest[4];
  const smallImg3 = sportsImageManifest.find(i => i.id === 'cycling-01') || sportsImageManifest[5];

  return (
    <section className={`sports-system-section ${className}`}>
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: '#ff2a2a' }} />
            Editorial Showcase
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* Editorial Layout */}
        <div className="sports-grid-12" style={{ rowGap: '28px' }}>
          {/* Row 1: 1 Large Ultra-Wide Feature Card */}
          {largeImg && (
            <div className="col-span-12">
              <CinematicSportsCard
                src={largeImg.src}
                alt={largeImg.alt}
                title={largeImg.title}
                subtitle="High-Performance Atmosphere"
                category={largeImg.category}
                number="01"
                photographer={largeImg.photographer}
                aspectRatio="21-9"
              />
            </div>
          )}

          {/* Row 2: 2 Medium Balanced Cards */}
          {medImg1 && (
            <div className="col-span-6">
              <SportsImageCard
                src={medImg1.src}
                alt={medImg1.alt}
                title={medImg1.title}
                desc={medImg1.alt}
                category={medImg1.category}
                number="02"
                photographer={medImg1.photographer}
                aspectRatio="16-9"
              />
            </div>
          )}
          {medImg2 && (
            <div className="col-span-6">
              <SportsImageCard
                src={medImg2.src}
                alt={medImg2.alt}
                title={medImg2.title}
                desc={medImg2.alt}
                category={medImg2.category}
                number="03"
                photographer={medImg2.photographer}
                aspectRatio="16-9"
              />
            </div>
          )}

          {/* Row 3: 3 Small Balanced Cards */}
          {smallImg1 && (
            <div className="col-span-4">
              <SportsImageCard
                src={smallImg1.src}
                alt={smallImg1.alt}
                title={smallImg1.title}
                desc={smallImg1.alt}
                category={smallImg1.category}
                number="04"
                photographer={smallImg1.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}
          {smallImg2 && (
            <div className="col-span-4">
              <SportsImageCard
                src={smallImg2.src}
                alt={smallImg2.alt}
                title={smallImg2.title}
                desc={smallImg2.alt}
                category={smallImg2.category}
                number="05"
                photographer={smallImg2.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}
          {smallImg3 && (
            <div className="col-span-4">
              <SportsImageCard
                src={smallImg3.src}
                alt={smallImg3.alt}
                title={smallImg3.title}
                desc={smallImg3.alt}
                category={smallImg3.category}
                number="06"
                photographer={smallImg3.photographer}
                aspectRatio="4-3"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
