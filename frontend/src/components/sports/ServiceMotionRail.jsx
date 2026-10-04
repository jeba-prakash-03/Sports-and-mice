import React, { useState, useEffect, useRef } from 'react';
import SportsImageCard from './SportsImageCard';
import { pageImageCollections } from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * ServiceMotionRail Component
 * Page-Specific Visual Composition for the SERVICE PAGE:
 * - Professional sports services & logistics (Delegation Travel, Conferences, Coaching, Team Hotels)
 * - Horizontal cinematic motion stream moving at differential parallax speeds
 * - Automatic smooth cinematic glide + scroll-linked parallax
 * - Clean default: Image only; on hover: smooth staggered service info reveal
 * - ZERO carousel arrows, ZERO manual buttons
 */
export default function ServiceMotionRail({
  title = "Sports & MICE Delegations in Motion",
  subtitle = "End-to-end infrastructure, competition travel, and turnkey logistics for national teams and sports federations.",
  className = ""
}) {
  const [items] = useState(() => pageImageCollections.service);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const railRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let offset = 0;

    const animateRail = () => {
      if (!isHovered) {
        offset = (offset + 0.35) % 1000;
        setScrollProgress(offset);
      }
      animationFrameId = requestAnimationFrame(animateRail);
    };

    animationFrameId = requestAnimationFrame(animateRail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <section 
      className={`sports-system-section service-motion-rail-section ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: 'var(--accent)' }} />
            02 / SPORTS SERVICES & LOGISTICS
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* Horizontal Motion Rail Stage */}
        <div className="service-rail-viewport" ref={railRef}>
          <div 
            className="service-rail-track"
            style={{
              transform: `translate3d(-${(scrollProgress * 0.45) % 360}px, 0, 0)`,
              transition: isHovered ? 'transform 0.5s ease-out' : 'none'
            }}
          >
            {items.concat(items).map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`}
                className="service-rail-card-wrapper"
                style={{
                  transform: idx % 2 === 0 ? 'translateY(0)' : 'translateY(18px)',
                  transition: 'transform 0.4s ease'
                }}
              >
                <SportsImageCard
                  src={item.src}
                  alt={item.alt}
                  title={item.title}
                  desc={item.alt}
                  category={item.category}
                  number={`0${(idx % items.length) + 1}`}
                  photographer={item.photographer}
                  license={item.license}
                  aspectRatio="16-9"
                  showOverlay={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
