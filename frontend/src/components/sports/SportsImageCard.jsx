import React, { useState, useRef, useEffect } from 'react';
import '../../styles/sports.css';

/**
 * SportsImageCard Component
 * High-performance animated sports card adhering to strict requirements:
 * - DEFAULT (Not Hovered): SHOW ONLY THE IMAGE. Pure, crisp, uncluttered photography.
 * - ON HOVER: Staggered cinematic reveal of bottom gradient, category badge, title, and description.
 * - Desktop Cursor Parallax Tilt (max 3.5 deg) with depth layers.
 * - Seamless Aspect Ratio & Fill Control without empty grey boxes.
 */
export default function SportsImageCard({
  src,
  alt = "Sports Action",
  title = "",
  desc = "",
  category = "sports",
  number = "01",
  photographer = "",
  license = "CC BY",
  isArchive = false,
  aspectRatio = "16-9", // "16-9" | "21-9" | "4-3" | "3-4" | "1-1" | "16-10" | "fill"
  objectPosition = "center 35%",
  className = "",
  showOverlay = true,
  onClick = null
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, rotateZ: 0, x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Desktop Pointer Parallax Tracking (bounded max 3.5 deg)
  const handlePointerMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize -1 to 1
    const xPercent = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1));
    const yPercent = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1));

    setTilt({
      rotateX: -yPercent * 3.5,
      rotateY: xPercent * 3.5,
      rotateZ: xPercent * 1.2,
      x: xPercent * 6,
      y: yPercent * 6
    });
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, rotateZ: 0, x: 0, y: 0 });
  };

  const getCategorySuit = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'football': return { suit: '♠', color: '#10b981', symbol: 'A', name: 'Football / Soccer' };
      case 'basketball': return { suit: '♥', color: '#f59e0b', symbol: 'K', name: 'Basketball' };
      case 'tennis': return { suit: '♦', color: '#84cc16', symbol: 'Q', name: 'Tennis' };
      case 'athletics': return { suit: '♣', color: '#f97316', symbol: 'J', name: 'Athletics & Track' };
      case 'cycling': return { suit: '♦', color: '#06b6d4', symbol: '9', name: 'Cycling' };
      case 'swimming': return { suit: '♥', color: '#3b82f6', symbol: '10', name: 'Swimming & Aquatics' };
      case 'volleyball': return { suit: '♣', color: '#eab308', symbol: '8', name: 'Volleyball' };
      case 'hockey': return { suit: '♠', color: '#f43f5e', symbol: '7', name: 'Field Hockey' };
      case 'stadium': return { suit: '♠', color: '#a855f7', symbol: 'A', name: 'Stadiums & Venues' };
      case 'team': return { suit: '♥', color: '#6366f1', symbol: 'K', name: 'Team Sports' };
      case 'events': return { suit: '♦', color: '#8b5cf6', symbol: 'Q', name: 'Sports Events' };
      case 'travel': return { suit: '♣', color: '#14b8a6', symbol: 'J', name: 'Sports Travel' };
      default: return { suit: '♠', color: '#ef4444', symbol: 'A', name: cat || 'Sports' };
    }
  };

  const pokerInfo = getCategorySuit(category);
  const catColor = isArchive ? 'var(--accent)' : 'var(--accent-2)';

  return (
    <div
      ref={cardRef}
      className={`sports-card-wrapper ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      style={{
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        cursor: onClick ? 'pointer' : 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        className="sports-card-inner"
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transform: isHovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) rotateZ(${tilt.rotateZ}deg)`
            : 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)'
        }}
      >
        {/* Media Box with Controlled Aspect Ratio / Stretch */}
        <div className={`sports-card-media aspect-${aspectRatio}`} style={{ flex: 1, height: '100%' }}>
          <img
            src={src}
            alt={alt || title}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            className="sports-card-img"
            style={{
              objectPosition,
              transform: isHovered
                ? `scale(1.06) translate3d(${tilt.x}px, ${tilt.y}px, 15px)`
                : 'scale(1.00) translate3d(0, 0, 0)',
              opacity: isLoaded ? 1 : 0.4,
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease'
            }}
          />

          {/* Scrim Overlay - Appears only on hover */}
          <div
            className="sports-card-scrim"
            style={{
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.35s ease'
            }}
          />

          {/* Photographic Light Sweep */}
          <div className="sports-light-sweep" />

          {/* Structured Information Overlay — Emerges on hover only */}
          {showOverlay && (
            <div
              className="sports-card-overlay"
              style={{
                pointerEvents: 'none',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            >
              {/* Top Row: Category Badge + Poker Index & Number (Delay 0ms) */}
              <div
                className="sports-overlay-top"
                style={{
                  transform: isHovered ? 'translateY(0)' : 'translateY(-12px)',
                  opacity: isHovered ? 1 : 0,
                  transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0ms, opacity 0.35s ease 0ms'
                }}
              >
                <span
                  className="sports-cat-badge"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'rgba(59, 51, 45, 0.85)'
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent)',
                      boxShadow: '0 0 8px var(--accent)'
                    }}
                  />
                  <span>{isArchive ? 'ARCHIVE' : category}</span>
                  {!isArchive && (
                    <span style={{ color: 'var(--accent)', fontWeight: 900, marginLeft: 3 }}>{pokerInfo.suit}</span>
                  )}
                </span>

                {number && (
                  <span className="sports-index-num">
                    {number}
                  </span>
                )}
              </div>

              {/* Bottom Row: Title (80ms), Description (150ms), Photographer (200ms) */}
              <div className="sports-overlay-bottom">
                {title && (
                  <h4
                    className="sports-card-title"
                    style={{
                      transform: isHovered ? 'translateY(0)' : 'translateY(15px)',
                      opacity: isHovered ? 1 : 0,
                      transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) 80ms, opacity 0.35s ease 80ms'
                    }}
                  >
                    {title}
                  </h4>
                )}
                {desc && (
                  <p
                    className="sports-card-desc"
                    style={{
                      transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                      opacity: isHovered ? 1 : 0,
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 150ms, opacity 0.4s ease 150ms'
                    }}
                  >
                    {desc}
                  </p>
                )}
                {photographer && (
                  <div
                    className="sports-photographer-tag"
                    style={{
                      transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                      opacity: isHovered ? 0.85 : 0,
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 200ms, opacity 0.4s ease 200ms'
                    }}
                  >
                    <span>📷</span>
                    <span>{photographer}</span>
                    {license && <span style={{ opacity: 0.7 }}>• {license}</span>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
