import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import SportsImageCard from './SportsImageCard';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsCinematicShowcase Component
 * Single, automatic cinematic layered sports-image composition:
 * - 1 Dominant Active Foreground Card (scale: 1, translateZ: 80px, rot: 0)
 * - 2-3 Overlapping Layered Background Cards (progressive scale, translate, rotateZ, depth)
 * - Automatic 3.5s cycle loop with smooth 3D roll transitions
 * - IntersectionObserver to pause when out of viewport and resume when visible
 * - Pauses on mouse hover with subtle cursor parallax tilt and staggered metadata reveal
 * - Strict Default: Pure Image Only before hover
 * - Mobile responsive: compact offsets to avoid viewport overflow
 */
export default function SportsCinematicShowcase({
  images = null,
  tag = "02 / CINEMATIC SHOWCASE",
  title = "Curated Sports Moments in Motion",
  subtitle = "Elite athletics and international competition captured through dynamic layered photography.",
  autoInterval = 3500,
  transitionDuration = 1200,
  className = ""
}) {
  // Use provided images or fallback to the complete curated sports photography manifest
  const rawList = (images && images.length > 0) ? images : sportsImageManifest;

  // Deck state containing all images in an infinite loop
  const [items, setItems] = useState(() => rawList.map((item, idx) => ({
    ...item,
    itemNumber: idx + 1,
    isArchive: item.source?.includes('Archive') || item.photographer?.includes('1929') || item.id?.includes('historical') || false
  })));

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [outgoingItem, setOutgoingItem] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const isLockedRef = useRef(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // IntersectionObserver to auto-pause when offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Core Transition to Next Card (Infinite stack reordering)
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
    }, transitionDuration);
  }, [items, transitionDuration]);

  // Previous Slide
  const prevSlide = useCallback(() => {
    if (isLockedRef.current || items.length === 0) return;
    isLockedRef.current = true;
    setItems((prev) => {
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, prev.length - 1);
      return [last, ...rest];
    });
    setTimeout(() => {
      isLockedRef.current = false;
    }, 400);
  }, [items]);

  // Automatic Cycling Timer (Auto-runs when visible & not hovered)
  useEffect(() => {
    if (!isInView || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isInView, isHovered, nextSlide, autoInterval]);

  // Transform calculation based on stack position (as specified by user requirements)
  const getCardStyle = (position) => {
    if (isMobile) {
      // Mobile Compact Overlapping Layer
      switch (position) {
        case 0: // Active Foreground
          return {
            transform: 'translate3d(0, 0, 40px) scale(1)',
            opacity: 1,
            zIndex: 10,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)'
          };
        case 1: // Background 1
          return {
            transform: 'translate3d(32px, -18px, 10px) rotateZ(3deg) scale(0.92)',
            opacity: 0.85,
            zIndex: 8,
            boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.7)'
          };
        case 2: // Background 2
          return {
            transform: 'translate3d(55px, -32px, -20px) rotateZ(6deg) scale(0.85)',
            opacity: 0.55,
            zIndex: 6,
            boxShadow: '0 10px 20px -8px rgba(0, 0, 0, 0.6)'
          };
        default:
          return {
            transform: 'translate3d(70px, -45px, -60px) scale(0.78)',
            opacity: 0,
            zIndex: 1,
            pointerEvents: 'none'
          };
      }
    }

    // Desktop Asymmetric Overlapping Layer Composition
    switch (position) {
      case 0: // Active Dominant Foreground Card
        return {
          transform: 'translate3d(0, 0, 80px) scale(1) rotateZ(0deg)',
          opacity: 1,
          zIndex: 10,
          boxShadow: '0 35px 75px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 42, 42, 0.15)'
        };
      case 1: // Background Card 1
        return {
          transform: 'translate3d(70px, -25px, 20px) rotateZ(5deg) scale(0.92)',
          opacity: 0.85,
          zIndex: 8,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
        };
      case 2: // Background Card 2
        return {
          transform: 'translate3d(125px, -45px, -20px) rotateZ(9deg) scale(0.84)',
          opacity: 0.65,
          zIndex: 6,
          boxShadow: '0 18px 35px -10px rgba(0, 0, 0, 0.65)'
        };
      case 3: // Background Card 3
        return {
          transform: 'translate3d(170px, -62px, -60px) rotateZ(13deg) scale(0.76)',
          opacity: 0.40,
          zIndex: 4,
          boxShadow: '0 10px 25px -8px rgba(0, 0, 0, 0.5)'
        };
      default: // Deep sequence (hidden until cycled)
        return {
          transform: 'translate3d(200px, -75px, -100px) rotateZ(16deg) scale(0.70)',
          opacity: 0,
          zIndex: 1,
          pointerEvents: 'none'
        };
    }
  };

  const activeCard = items[0];
  const visibleCards = items.slice(0, isMobile ? 3 : 4);

  return (
    <section
      ref={containerRef}
      className={`sports-cinematic-showcase-section ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sports-showcase-container">
        {/* Section Header */}
        <div className="sports-showcase-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: 'var(--accent)' }} />
            {tag}
          </div>
          <h2 className="sports-showcase-title">
            {title}
          </h2>
          <p className="sports-showcase-subtitle">
            {subtitle}
          </p>
        </div>

        {/* 3D Layered Composition Stage */}
        <div className="sports-showcase-stage">
          {/* Outgoing 3D Roll Animation Layer */}
          {isTransitioning && outgoingItem && (
            <div
              key={`outgoing-${outgoingItem.id}`}
              className="sports-showcase-card-wrapper outgoing-roll-card"
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
                isArchive={outgoingItem.isArchive}
                aspectRatio="fill"
                showOverlay={false}
              />
            </div>
          )}

          {/* Visible Overlapping Layer Stack */}
          {visibleCards.map((card, idx) => {
            const cardStyle = getCardStyle(idx);

            return (
              <div
                key={card.id}
                className="sports-showcase-card-wrapper"
                style={{
                  ...cardStyle,
                  transition: isTransitioning
                    ? `all ${transitionDuration}ms cubic-bezier(0.16, 1, 0.3, 1)`
                    : 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: idx === 0 ? 'pointer' : 'pointer'
                }}
                onClick={() => {
                  if (idx !== 0) {
                    // Bring clicked background card to foreground
                    setItems(prev => {
                      const clicked = prev[idx];
                      const others = prev.filter((_, i) => i !== idx);
                      return [clicked, ...others];
                    });
                  }
                }}
              >
                {/* Reusable SportsImageCard (Clean Default: Image Only; Hover: Staggered Info Reveal) */}
                <SportsImageCard
                  src={card.src}
                  alt={card.alt}
                  title={card.title}
                  desc={card.alt}
                  category={card.category}
                  number={`0${card.itemNumber || idx + 1}`}
                  photographer={card.photographer}
                  license={card.license}
                  isArchive={card.isArchive}
                  aspectRatio="fill"
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
