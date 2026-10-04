import React, { useState, useEffect, useRef } from 'react';
import SportsImageCard from './SportsImageCard';
import { pageImageCollections } from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * AboutEditorialPhotography Component
 * Page-Specific Visual Composition for the ABOUT PAGE:
 * - Editorial Layered Photography
 * - 1 Large dominant portrait/historical event image + 2-3 overlapping smaller heritage cards
 * - Scroll and depth reveal with subtle floating parallax & rotation
 * - Default: Image only; Hover: Staggered metadata cascade
 * - Zero generic grids, zero manual buttons
 */
export default function AboutEditorialPhotography({
  title = "15+ Years Referee Precision & High-Performance Heritage",
  subtitle = "International leadership, sports diplomacy, and decades of field-level tournament execution across continents.",
  className = ""
}) {
  const [items] = useState(() => pageImageCollections.about);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  // Subtle floating parallax on mousemove across the stage
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const mainItem = items[0] || {
    id: 'about_hockey_referee',
    category: 'heritage',
    title: '15+ Years International Referee Heritage',
    alt: 'International refereeing precision and decades of high-level tournament leadership',
    src: '/assets/images/about_hockey_referee.jpeg',
    photographer: 'K-Consulting Archives',
    license: 'All rights reserved'
  };

  const subItems = items.slice(1, 4);

  return (
    <section
      ref={containerRef}
      className={`sports-system-section about-editorial-section ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
    >
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: 'var(--accent)' }} />
            02 / EDITORIAL HERITAGE PHOTOGRAPHY
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* Editorial Layered Stage */}
        <div className="about-editorial-stage">
          {/* Background Editorial Glow */}
          <div className="about-editorial-ambient-glow" />

          {/* Sub Image Top-Left (Overlapping background) */}
          {subItems[0] && (
            <div
              className="about-editorial-sub-layer about-sub-top-left"
              style={{
                transform: `translate3d(${mousePos.x * -14}px, ${mousePos.y * -14}px, 0) rotate(-4deg)`,
                transition: isHovered ? 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.8s ease-out'
              }}
            >
              <SportsImageCard
                src={subItems[0].src}
                alt={subItems[0].alt}
                title={subItems[0].title}
                desc={subItems[0].alt}
                category={subItems[0].category}
                number="02"
                photographer={subItems[0].photographer}
                license={subItems[0].license}
                aspectRatio="4-3"
                showOverlay={true}
              />
              <div className="about-editorial-badge">MISSION HUB</div>
            </div>
          )}

          {/* Main Large Hero Image (Center) */}
          <div
            className="about-editorial-main-layer"
            style={{
              transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 40px) scale(1)`,
              transition: isHovered ? 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.8s ease-out'
            }}
          >
            <SportsImageCard
              src={mainItem.src}
              alt={mainItem.alt}
              title={mainItem.title}
              desc={mainItem.alt}
              category={mainItem.category}
              number="01"
              photographer={mainItem.photographer}
              license={mainItem.license}
              aspectRatio="16-10"
              showOverlay={true}
            />
            <div className="about-editorial-badge about-badge-primary">KEY HERITAGE</div>
          </div>

          {/* Sub Image Bottom-Right (Overlapping foreground right) */}
          {subItems[1] && (
            <div
              className="about-editorial-sub-layer about-sub-bottom-right"
              style={{
                transform: `translate3d(${mousePos.x * 22}px, ${mousePos.y * 22}px, 60px) rotate(5deg)`,
                transition: isHovered ? 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.8s ease-out'
              }}
            >
              <SportsImageCard
                src={subItems[1].src}
                alt={subItems[1].alt}
                title={subItems[1].title}
                desc={subItems[1].alt}
                category={subItems[1].category}
                number="03"
                photographer={subItems[1].photographer}
                license={subItems[1].license}
                aspectRatio="4-3"
                showOverlay={true}
              />
              <div className="about-editorial-badge">DELEGATION</div>
            </div>
          )}

          {/* Sub Image Top-Right (Accent) */}
          {subItems[2] && (
            <div
              className="about-editorial-sub-layer about-sub-top-right"
              style={{
                transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18}px, 20px) rotate(3deg)`,
                transition: isHovered ? 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.8s ease-out'
              }}
            >
              <SportsImageCard
                src={subItems[2].src}
                alt={subItems[2].alt}
                title={subItems[2].title}
                desc={subItems[2].alt}
                category={subItems[2].category}
                number="04"
                photographer={subItems[2].photographer}
                license={subItems[2].license}
                aspectRatio="1-1"
                showOverlay={true}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
