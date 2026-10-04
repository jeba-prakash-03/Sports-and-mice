import React, { useState, useEffect, useRef, useCallback } from 'react';
import { pageImageCollections } from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * HomeSportsShowcase — Full-Width Cinematic 3D Sports Image Wheel
 * 
 * Major Upgrades:
 * - True Full-Width (100vw full-bleed) layout occupying 85–95% of screen width
 * - Significantly enlarged front and side editorial photography (up to 560px × 700px on desktop)
 * - Wide 3D orbital radius (clamp 480px–840px) eliminating empty side margins
 * - True 3D cylinder perspective (1800px–2200px) with calculated depth curves
 * - High-visibility side cards with clear subject recognition (rotateY bounded ±25°–55°)
 * - Instant hover pause: Hovering any card or the stage freezes rotation immediately
 * - Hover focus enhancement: Hovered card scales up (+5%), brightens, and presents editorial metadata
 * - Smooth scroll velocity influence + mouse 3D parallax tilt (rotateX/rotateY)
 * - Generous bottom spacing (140px–180px) ensuring an intentional transition to Section 03 / Expertise
 * - Contained safety for /admin/website-builder editor canvas
 */
export default function HomeSportsShowcase({
  images = null,
  title = "Curated Sports Moments & Championship Focus",
  subtitle = "Elite athletic achievement and international sports federations captured through dynamic full-width 3D photography.",
  className = ""
}) {
  // Use CMS provided images or fallback to the curated 7 home sports images
  const rawItems = (images && images.length > 0) ? images : pageImageCollections.home;
  // Curate 7 prominent sports moments
  const items = rawItems.slice(0, 7);
  const N = items.length;

  const [rotationAngle, setRotationAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1400
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Parallax Tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Physics & Animation Refs
  const requestRef = useRef(null);
  const lastTimeRef = useRef(null);
  const rotationAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const dragStartRef = useRef({ x: 0, angle: 0 });
  const stageRef = useRef(null);

  // Sync ref with state
  rotationAngleRef.current = rotationAngle;

  // Viewport resize & reduced motion detection
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Compute Full-Width 3D Cylindrical Geometry based on viewport
  const getWheelDimensions = () => {
    if (viewportWidth <= 640) {
      return {
        radiusX: Math.min(260, Math.max(160, viewportWidth * 0.44)),
        radiusZ: Math.min(180, Math.max(110, viewportWidth * 0.28)),
        cardWidth: Math.min(320, Math.max(260, viewportWidth * 0.74)),
        cardHeight: Math.min(420, Math.max(340, viewportWidth * 0.95))
      };
    }
    if (viewportWidth <= 1024) {
      return {
        radiusX: Math.min(500, Math.max(340, viewportWidth * 0.42)),
        radiusZ: Math.min(360, Math.max(240, viewportWidth * 0.28)),
        cardWidth: Math.min(440, Math.max(340, viewportWidth * 0.38)),
        cardHeight: Math.min(560, Math.max(440, viewportWidth * 0.48))
      };
    }
    // Desktop: Full-bleed immersive 3D stage
    return {
      radiusX: Math.min(840, Math.max(480, viewportWidth * 0.42)),
      radiusZ: Math.min(580, Math.max(340, viewportWidth * 0.28)),
      cardWidth: Math.min(560, Math.max(420, viewportWidth * 0.28)),
      cardHeight: Math.min(700, Math.max(530, viewportWidth * 0.36))
    };
  };

  const { radiusX, radiusZ, cardWidth, cardHeight } = getWheelDimensions();

  // Continuous Animation Loop (requestAnimationFrame with smooth lerping)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const animate = (time) => {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = time;
      }
      const deltaTime = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      // When NOT hovered and NOT dragging: rotate slowly and smoothly
      if (!isHovered && !isDragging) {
        // ~6.5 degrees per second -> slow, cinematic editorial glide
        const speed = 6.5; 
        targetAngleRef.current += speed * deltaTime;
      }

      // Smooth lerp toward targetAngle
      const diff = targetAngleRef.current - rotationAngleRef.current;
      const step = diff * Math.min(deltaTime * 8, 1);
      const newAngle = rotationAngleRef.current + step;

      setRotationAngle(newAngle);
      rotationAngleRef.current = newAngle;

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isHovered, isDragging, prefersReducedMotion]);

  // Scroll Interaction: Subtle page scroll influence with clamped velocity
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const rawDeltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView && Math.abs(rawDeltaY) > 0 && !isHovered) {
        // Clamped scroll influence
        const clampedDelta = Math.max(-40, Math.min(40, rawDeltaY));
        targetAngleRef.current += clampedDelta * 0.08;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHovered]);

  // Mouse Parallax across the full section
  const handleMouseMove = useCallback((e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
    setTilt({ x: nx * 4, y: -ny * 3 });
  }, []);

  const handleMouseLeaveSection = useCallback(() => {
    setIsHovered(false);
    setHoveredCardIndex(null);
    setTilt({ x: 0, y: 0 });
  }, []);

  // Pointer / Touch Drag Handler for physical 3D wheel interaction
  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX || (e.touches && e.touches[0]?.clientX) || 0,
      angle: targetAngleRef.current
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const deltaX = currentX - dragStartRef.current.x;
    const angleDelta = (deltaX / (radiusX * 1.8)) * 90;
    targetAngleRef.current = dragStartRef.current.angle - angleDelta;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Card Hover Handlers (Instant Pause)
  const handleCardMouseEnter = (index) => {
    setIsHovered(true);
    setHoveredCardIndex(index);
  };

  const handleCardMouseLeave = () => {
    setHoveredCardIndex(null);
    setIsHovered(false);
  };

  // Calculate Front Hero Card index for the editorial progress indicator
  const activeNormalizedAngle = ((-rotationAngle % 360) + 360) % 360;
  const activeCardIndex = Math.round((activeNormalizedAngle / 360) * N) % N;
  const displayActiveIndex = ((activeCardIndex % N) + N) % N + 1;

  return (
    <section
      ref={stageRef}
      className={`sports-3d-wheel-section full-width-cinematic-wheel ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeaveSection}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="sports-wheel-container">
        {/* Editorial Section Header */}
        <div className="sports-wheel-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: 'var(--accent)' }} />
            <span>02 / MEISTERSCHAFTSSHOWCASE</span>
          </div>
          <h2 className="sports-wheel-title">{title}</h2>
          <p className="sports-wheel-subtitle">{subtitle}</p>
        </div>

        {/* Full-Width 3D Cylindrical Stage */}
        <div className="sports-wheel-stage-wrapper">
          <div
            className="sports-wheel-cylinder"
            style={{
              transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
              transition: isDragging ? 'none' : 'transform 0.35s ease-out'
            }}
          >
            {items.map((item, index) => {
              // 3D angle around the cylinder
              const angleStep = 360 / N;
              const baseAngle = index * angleStep;
              const totalAngle = (baseAngle + rotationAngle) % 360;
              // Normalize angle to [-180, 180] relative to camera (0 deg = front center)
              const theta = ((totalAngle % 360) + 540) % 360 - 180;
              const rad = (theta * Math.PI) / 180;

              // Spatial 3D Coordinates
              const x = Math.sin(rad) * radiusX;
              const z = (Math.cos(rad) - 1) * radiusZ; // front is z=0, back is z=-2*radiusZ
              const rotateY = theta * 0.62; // natural perspective curve facing camera

              // Dynamic Depth Properties
              const depthFactor = (Math.cos(rad) + 1) / 2; // 1 at front, 0 at back
              const scale = 0.74 + 0.26 * depthFactor;
              const opacity = 0.45 + 0.55 * depthFactor;
              const zIndex = Math.round(100 + depthFactor * 120);

              const isThisCardHovered = hoveredCardIndex === index;
              const isFrontHero = Math.abs(theta) < (angleStep * 0.52);

              return (
                <div
                  key={item.id || index}
                  className={`sports-wheel-card ${isFrontHero ? 'is-front' : ''} ${isThisCardHovered ? 'is-hovered' : ''}`}
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${isThisCardHovered ? scale * 1.05 : scale})`,
                    opacity: isThisCardHovered ? 1.0 : opacity,
                    zIndex: isThisCardHovered ? 300 : zIndex
                  }}
                  onMouseEnter={() => handleCardMouseEnter(index)}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <div className="sports-wheel-card-inner">
                    {/* Crystal Clear High-Resolution Image */}
                    <img
                      src={item.src}
                      alt={item.alt || item.title || 'Sports action photography'}
                      className="sports-wheel-image"
                      loading="lazy"
                      draggable="false"
                    />

                    {/* Category Badge Top Left */}
                    <div className="sports-wheel-card-badge">
                      <span className="badge-dot" />
                      <span className="badge-text">{item.category?.toUpperCase() || 'SPORTS'}</span>
                    </div>

                    {/* Number Chip Top Right */}
                    <div className="sports-wheel-card-number">
                      0{index + 1}
                    </div>

                    {/* Editorial Detail Panel (Revealed on hover or front hero focus) */}
                    <div className={`sports-wheel-details-panel ${isThisCardHovered || isFrontHero ? 'visible' : ''}`}>
                      <div className="sports-wheel-details-category">
                        {item.category?.toUpperCase() || 'SPORTS'}
                      </div>
                      <h3 className="sports-wheel-details-title">
                        {item.title || 'Championship Experience'}
                      </h3>
                      {item.alt && (
                        <p className="sports-wheel-details-desc">
                          {item.alt}
                        </p>
                      )}
                      {item.photographer && (
                        <div className="sports-wheel-details-meta">
                          <span>Archive / {item.photographer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Refined Editorial Progress Indicator */}
        <div className="sports-wheel-progress-editorial">
          <span className="editorial-cue">SCROLL OR DRAG TO EXPLORE</span>
          <div className="editorial-numbers">
            {displayActiveIndex < 10 ? `0${displayActiveIndex}` : displayActiveIndex} — {N < 10 ? `0${N}` : N}
          </div>
          <div className="editorial-line">
            <div
              className="editorial-line-fill"
              style={{
                width: `${(displayActiveIndex / N) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
