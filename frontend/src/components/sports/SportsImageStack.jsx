import React, { useState } from 'react';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsImageStack Component
 * 3D Interactive Stacked Sports Photography Section:
 * Clicking or cycling shifts cards in 3D spatial depth (translateZ, scale, opacity).
 */
export default function SportsImageStack({
  title = "3D Sports Action Stack",
  subtitle = "Interactive multi-layer perspective across premier sports moments.",
  className = ""
}) {
  const stackItems = [
    sportsImageManifest.find(i => i.id === 'football-04') || sportsImageManifest[0],
    sportsImageManifest.find(i => i.id === 'basketball-01') || sportsImageManifest[1],
    sportsImageManifest.find(i => i.id === 'tennis-01') || sportsImageManifest[2],
  ].filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % stackItems.length);
  };

  return (
    <section className={`sports-system-section ${className}`}>
      <div className="sports-container">
        <div className="sports-section-header text-center">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: '#a855f7' }} />
            3D Spatial Stack
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle} (Click card to rotate depth)
          </p>
        </div>

        <div className="sports-stack-container" onClick={handleNext}>
          {stackItems.map((item, idx) => {
            const pos = (idx - activeIndex + stackItems.length) % stackItems.length;
            const posClass = `stack-pos-${pos}`;

            return (
              <div
                key={item.id}
                className={`sports-stack-card ${posClass}`}
                style={{
                  background: '#0e1015'
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img
                    src={item.src}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center center'
                    }}
                  />
                  <div className="sports-card-scrim" />
                  
                  <div className="sports-card-overlay">
                    <div className="sports-overlay-top">
                      <span className="sports-cat-badge">
                        {item.category}
                      </span>
                      <span className="sports-index-num">0{idx + 1} / 0{stackItems.length}</span>
                    </div>

                    <div className="sports-overlay-bottom">
                      <h3 className="sports-card-title" style={{ fontSize: '1.4rem' }}>
                        {item.title}
                      </h3>
                      <p className="sports-card-desc">
                        {item.alt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
