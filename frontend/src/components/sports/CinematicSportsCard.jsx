import React, { useState, useRef } from 'react';
import '../../styles/sports.css';

/**
 * CinematicSportsCard Component
 * Ultra-wide or hero feature sports card with layered typography,
 * animated red/gold accent line, and subtle perspective.
 */
export default function CinematicSportsCard({
  src,
  alt = "Sports Feature",
  title = "Championship Athletic Performance",
  subtitle = "Elite Competition",
  category = "Football",
  number = "01",
  photographer = "",
  aspectRatio = "21-9",
  objectPosition = "center 30%",
  className = ""
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 2 - 1;
    const yPercent = (y / rect.height) * 2 - 1;

    setTilt({
      rotateX: -yPercent * 2.5,
      rotateY: xPercent * 2.5
    });
  };

  return (
    <div
      ref={cardRef}
      className={`sports-card-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ rotateX: 0, rotateY: 0 });
      }}
      style={{
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)'
      }}
    >
      <div
        className="sports-card-inner"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
            : 'rotateX(0deg) rotateY(0deg)'
        }}
      >
        <div className={`sports-card-media aspect-${aspectRatio}`}>
          <img
            src={src}
            alt={alt || title}
            className="sports-card-img"
            loading="lazy"
            style={{
              objectPosition,
              transform: isHovered ? 'scale(1.05)' : 'scale(1.01)'
            }}
          />

          <div
            className="sports-card-scrim"
            style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.35s ease' }}
          />
          <div className="sports-light-sweep" />

          {/* Cinematic Overlay — Emerges on hover */}
          <div
            className="sports-card-overlay"
            style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none' }}
          >
            <div
              className="sports-overlay-top"
              style={{
                transform: isHovered ? 'translateY(0)' : 'translateY(-10px)',
                opacity: isHovered ? 1 : 0,
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease'
              }}
            >
              <span className="sports-cat-badge">
                <span className="pill-dot" style={{ backgroundColor: '#ff2a2a' }} />
                {category}
              </span>
              <span className="sports-index-num">{number}</span>
            </div>

            <div className="sports-overlay-bottom">
              {subtitle && (
                <div
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: '#ff6b6b',
                    fontWeight: 700,
                    marginBottom: 4,
                    transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                    opacity: isHovered ? 1 : 0,
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0ms, opacity 0.35s ease 0ms'
                  }}
                >
                  {subtitle}
                </div>
              )}
              <h3
                className="sports-section-title"
                style={{
                  fontSize: 'clamp(1.25rem, 2.2vw, 1.85rem)',
                  marginBottom: 6,
                  transform: isHovered ? 'translateY(0)' : 'translateY(15px)',
                  opacity: isHovered ? 1 : 0,
                  transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) 80ms, opacity 0.35s ease 80ms'
                }}
              >
                {title}
              </h3>
              {photographer && (
                <div
                  className="sports-photographer-tag"
                  style={{
                    transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isHovered ? 0.85 : 0,
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 150ms, opacity 0.4s ease 150ms'
                  }}
                >
                  <span>📷 Photojournalist: {photographer}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
