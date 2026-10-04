import React, { useState, useEffect, useRef, useCallback } from 'react';
import SportsImageCard from './SportsImageCard';
import { pageImageCollections } from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * HotelsDestinationStack Component
 * Page-Specific Visual Composition for the HOTELS & MORE PAGE:
 * - Destination Depth Stack (Team Hotels, Training Hubs, Inspection Venues, Luxury Sports Resorts)
 * - 1 Large Active Foreground Destination + 3-4 Layered Depth Cards
 * - Automatic 4.5s cycle: Active card rolls smoothly to side/back, background cards shift forward
 * - Default: Image only; Hover: Staggered metadata cascade with location/hotel details
 * - ZERO generic football grids, ZERO manual controls, ZERO "PAUSED" text
 */
export default function HotelsDestinationStack({
  title = "International Sports Venues & Team Hotels",
  subtitle = "Handpicked sports-tested hotels, Olympic-grade training centers, and luxury delegation hubs worldwide.",
  className = ""
}) {
  const [items, setItems] = useState(() => pageImageCollections.hotels.map((item, idx) => ({
    ...item,
    itemNumber: idx + 1
  })));

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [outgoingItem, setOutgoingItem] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const isLockedRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Viewport intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Next transition
  const nextSlide = useCallback(() => {
    if (isLockedRef.current || items.length === 0) return;
    isLockedRef.current = true;
    setIsTransitioning(true);
    setOutgoingItem(items[0]);

    setTimeout(() => {
      setItems((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setOutgoingItem(null);
      setIsTransitioning(false);
      isLockedRef.current = false;
    }, 1200);
  }, [items]);

  // Automatic cycle timer (every 4.5s)
  useEffect(() => {
    if (!isInView || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isInView, isHovered, nextSlide]);

  const getDestinationLayerStyle = (position) => {
    if (isMobile) {
      switch (position) {
        case 0:
          return { transform: 'translate3d(0, 0, 40px) scale(1)', opacity: 1, zIndex: 10 };
        case 1:
          return { transform: 'translate3d(-24px, -15px, 10px) rotateZ(-3deg) scale(0.92)', opacity: 0.85, zIndex: 8 };
        case 2:
          return { transform: 'translate3d(30px, -28px, -20px) rotateZ(4deg) scale(0.85)', opacity: 0.55, zIndex: 6 };
        default:
          return { transform: 'translate3d(0, -40px, -60px) scale(0.78)', opacity: 0, zIndex: 1, pointerEvents: 'none' };
      }
    }

    // Destination fan composition (Spread horizontally with depth perspective)
    switch (position) {
      case 0: // Active Large Front
        return {
          transform: 'translate3d(0, 0, 90px) scale(1) rotateZ(0deg)',
          opacity: 1,
          zIndex: 10,
          boxShadow: '0 35px 80px -15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(16, 185, 129, 0.15)'
        };
      case 1: // Behind Left
        return {
          transform: 'translate3d(-110px, -30px, 30px) rotateZ(-6deg) scale(0.90)',
          opacity: 0.85,
          zIndex: 8,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
        };
      case 2: // Behind Right
        return {
          transform: 'translate3d(120px, -25px, 10px) rotateZ(6deg) scale(0.88)',
          opacity: 0.75,
          zIndex: 7,
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7)'
        };
      case 3: // Deep Left
        return {
          transform: 'translate3d(-190px, -55px, -30px) rotateZ(-11deg) scale(0.78)',
          opacity: 0.50,
          zIndex: 5,
          boxShadow: '0 15px 30px -8px rgba(0, 0, 0, 0.5)'
        };
      case 4: // Deep Right
        return {
          transform: 'translate3d(190px, -50px, -50px) rotateZ(12deg) scale(0.75)',
          opacity: 0.35,
          zIndex: 4,
          boxShadow: '0 10px 25px -8px rgba(0, 0, 0, 0.4)'
        };
      default:
        return {
          transform: 'translate3d(0, -80px, -100px) scale(0.65)',
          opacity: 0,
          zIndex: 1,
          pointerEvents: 'none'
        };
    }
  };

  const visibleCards = items.slice(0, isMobile ? 3 : 5);

  return (
    <section
      ref={containerRef}
      className={`sports-system-section hotels-destination-stack-section ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: 'var(--accent)' }} />
            02 / DESTINATION DEPTH STACK
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* 3D Destination Stage */}
        <div className="hotels-depth-stage">
          {/* Outgoing Roll Card */}
          {isTransitioning && outgoingItem && (
            <div
              key={`outgoing-${outgoingItem.id}`}
              className="hotels-depth-card-wrapper outgoing-destination-card"
            >
              <SportsImageCard
                src={outgoingItem.src}
                alt={outgoingItem.alt}
                title={outgoingItem.title}
                desc={outgoingItem.alt}
                category={outgoingItem.category}
                number={`0${outgoingItem.itemNumber}`}
                photographer={outgoingItem.photographer}
                license={outgoingItem.license}
                aspectRatio="16-9"
                showOverlay={false}
              />
            </div>
          )}

          {/* Visible Layers */}
          {visibleCards.map((card, idx) => {
            const cardStyle = getDestinationLayerStyle(idx);

            return (
              <div
                key={card.id}
                className="hotels-depth-card-wrapper"
                style={{
                  ...cardStyle,
                  transition: isTransitioning
                    ? 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    : 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onClick={() => {
                  if (idx !== 0) {
                    setItems(prev => {
                      const clicked = prev[idx];
                      const others = prev.filter((_, i) => i !== idx);
                      return [clicked, ...others];
                    });
                  }
                }}
              >
                <SportsImageCard
                  src={card.src}
                  alt={card.alt}
                  title={card.title}
                  desc={card.alt}
                  category={card.category}
                  number={`0${card.itemNumber}`}
                  photographer={card.photographer}
                  license={card.license}
                  aspectRatio="16-9"
                  showOverlay={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
