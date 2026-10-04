import React, { useState } from 'react';
import '../../styles/sports.css';

/**
 * HistoricalSportsCard Component
 * Dedicated archival & heritage treatment for historical sports photography
 * (e.g. founder referee archives, historic sports tours, classic matches).
 */
export default function HistoricalSportsCard({
  src,
  alt = "Historical Sports Photography",
  title = "Sports Heritage & Historical Moment",
  location = "",
  year = "",
  caption = "",
  number = "ARCHIVE",
  aspectRatio = "4-3",
  className = ""
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`historical-card-wrapper ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`sports-card-media aspect-${aspectRatio}`}>
        <img
          src={src}
          alt={alt || title}
          className="sports-card-img"
          loading="lazy"
          style={{
            objectPosition: 'center center',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            filter: 'contrast(1.05)'
          }}
        />

        {/* Vintage Darkened Gradient - Appears on hover */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15,10,5,0.5) 0%, rgba(20,15,10,0.1) 40%, rgba(12,8,5,0.92) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.35s ease'
          }}
        />

        {/* Archival Overlay — Emerges on hover */}
        <div
          className="sports-card-overlay"
          style={{
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none'
          }}
        >
          <div
            className="sports-overlay-top"
            style={{
              transform: isHovered ? 'translateY(0)' : 'translateY(-10px)',
              opacity: isHovered ? 1 : 0,
              transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease'
            }}
          >
            <span className="historical-badge">
              ✦ HERITAGE ARCHIVE
            </span>
            {year && (
              <span className="sports-index-num" style={{ color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)' }}>
                {year}
              </span>
            )}
          </div>

          <div
            className="sports-overlay-bottom"
            style={{
              transform: isHovered ? 'translateY(0)' : 'translateY(15px)',
              opacity: isHovered ? 1 : 0,
              transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease'
            }}
          >
            {location && (
              <div className="historical-archive-stamp">
                📍 {location}
              </div>
            )}
            <h4 className="sports-card-title" style={{ color: '#fef3c7', fontSize: '1.1rem' }}>
              {title}
            </h4>
            {caption && (
              <p className="sports-card-desc" style={{ color: '#d1d5db', fontSize: '0.8rem' }}>
                {caption}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
