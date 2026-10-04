import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Layers, 
  Sparkles, 
  RotateCw, 
  Hand,
  Volume2
} from 'lucide-react';
import SportsImageCard from './SportsImageCard';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * SportsCardDeck Component
 * Physical 3D Sports Image Card Deck with:
 * - Controlled 3D Stack (scale, translateY, translateZ, subtle rotateZ)
 * - Pointer Events Drag / Swipe (Mouse + Touch + Pen with Pan-Y scroll preservation)
 * - 3D Roll Transition (rotateY + rotateZ + scale)
 * - Shuffle & Poker Hand Fan Modes
 * - Infinite Deck Cycling (swiped cards move to back of deck)
 * - STRICT DEFAULT: Image only visible before hover
 * - Staggered hover reveal for category, title, and description
 */
export default function SportsCardDeck({
  images = null,
  title = "Sports Moments & Championship Focus",
  subtitle = "Explore our sporting disciplines in physical 3D card deck physics. Drag to swipe, or switch to 3D roll and shuffle modes.",
  initialMode = "swipe", // "swipe" | "roll" | "shuffle" | "fan"
  className = ""
}) {
  // Use provided images or fallback to manifest
  const deckSource = (images && images.length > 0) ? images : sportsImageManifest;

  // Deck state
  const [deck, setDeck] = useState(() => deckSource.map((item, idx) => ({
    ...item,
    deckIndex: idx + 1,
    isArchive: item.source?.includes('Archive') || item.photographer?.includes('1929') || item.id?.includes('historical') || false
  })));

  const [activeMode, setActiveMode] = useState(initialMode); // "swipe" | "roll" | "shuffle" | "fan"
  const [swipingState, setSwipingState] = useState({ active: false, direction: 'right', cardId: null });
  const [isRolling, setIsRolling] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  // Drag physics state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, time: 0 });
  const deckContainerRef = useRef(null);
  const isLockedRef = useRef(false);

  // Sync images prop if changed
  useEffect(() => {
    if (images && images.length > 0) {
      setDeck(images.map((item, idx) => ({
        ...item,
        deckIndex: idx + 1,
        isArchive: item.source?.includes('Archive') || item.photographer?.includes('1929') || false
      })));
    }
  }, [images]);

  // SWIPE TRANSITION (Left or Right)
  const executeSwipe = useCallback((direction = 'right') => {
    if (isLockedRef.current || deck.length === 0) return;
    isLockedRef.current = true;
    const topCard = deck[0];

    setSwipingState({ active: true, direction, cardId: topCard.id });

    setTimeout(() => {
      setDeck((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setSwipingState({ active: false, direction: 'right', cardId: null });
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
      isLockedRef.current = false;
    }, 420);
  }, [deck]);

  // ROLL TRANSITION (3D Outgoing & Incoming Flip)
  const executeRoll = useCallback((direction = 'next') => {
    if (isLockedRef.current || deck.length === 0) return;
    isLockedRef.current = true;
    setIsRolling(true);

    setTimeout(() => {
      setDeck((prev) => {
        if (direction === 'next') {
          const [first, ...rest] = prev;
          return [...rest, first];
        } else {
          const last = prev[prev.length - 1];
          const rest = prev.slice(0, prev.length - 1);
          return [last, ...rest];
        }
      });
      setIsRolling(false);
      isLockedRef.current = false;
    }, 450);
  }, [deck]);

  // SHUFFLE DECK TRANSITION
  const executeShuffle = useCallback(() => {
    if (isLockedRef.current || deck.length === 0) return;
    isLockedRef.current = true;
    setIsShuffling(true);

    setTimeout(() => {
      setDeck((prev) => [...prev].sort(() => Math.random() - 0.5));
      setIsShuffling(false);
      isLockedRef.current = false;
    }, 550);
  }, [deck]);

  // PREVIOUS CARD ACTION
  const handlePrev = useCallback(() => {
    if (isLockedRef.current || deck.length === 0) return;
    isLockedRef.current = true;
    setDeck((prev) => {
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, prev.length - 1);
      return [last, ...rest];
    });
    setTimeout(() => {
      isLockedRef.current = false;
    }, 300);
  }, [deck]);

  // NEXT CARD ACTION (depends on active mode)
  const handleNext = useCallback(() => {
    if (activeMode === 'roll') {
      executeRoll('next');
    } else {
      executeSwipe('right');
    }
  }, [activeMode, executeRoll, executeSwipe]);

  // POINTER EVENTS DRAG PHYSICS (Mouse, Touch, Pen)
  const handlePointerDown = (e) => {
    if (isLockedRef.current || activeMode === 'fan') return;
    
    // Set pointer capture for rock-solid tracking
    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (err) {}

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isLockedRef.current) return;

    const diffX = e.clientX - dragStartRef.current.x;
    const diffY = (e.clientY - dragStartRef.current.y) * 0.3; // Dampen Y movement
    setDragOffset({ x: diffX, y: diffY });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch (err) {}

    const diffX = dragOffset.x;
    const velocity = Math.abs(diffX) / (Date.now() - dragStartRef.current.time + 1);

    // Swipe threshold: 75px distance OR fast flick velocity
    if (Math.abs(diffX) > 75 || velocity > 0.45) {
      executeSwipe(diffX > 0 ? 'right' : 'left');
    } else {
      // Elastic spring snap back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // SCROLL-WHEEL PROGRESSION THROUGH CARDS
  const lastWheelTimeRef = useRef(0);
  const handleWheel = (e) => {
    const now = Date.now();
    if (now - lastWheelTimeRef.current < 450) return; // Debounce 450ms

    if (Math.abs(e.deltaY) > 35) {
      lastWheelTimeRef.current = now;
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const topCard = deck[0];
  const visibleCards = deck.slice(0, 4);

  return (
    <section 
      className={`sports-system-section sports-deck-section ${className}`}
      onWheel={handleWheel}
    >
      <div className="sports-container">
        {/* Section Header */}
        <div className="sports-section-header text-center">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: '#ef4444' }} />
            Championship Card Deck
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* Transition Mode Selector Pills */}
        <div className="sports-deck-modes-bar">
          <button
            type="button"
            onClick={() => setActiveMode('swipe')}
            className={`sports-mode-pill ${activeMode === 'swipe' ? 'active' : ''}`}
          >
            <Hand size={15} />
            <span>Pointer Swipe</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('roll');
              executeRoll('next');
            }}
            className={`sports-mode-pill ${activeMode === 'roll' ? 'active' : ''}`}
          >
            <RotateCw size={15} />
            <span>3D Roll Transition</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('shuffle');
              executeShuffle();
            }}
            className={`sports-mode-pill ${activeMode === 'shuffle' ? 'active' : ''}`}
          >
            <Shuffle size={15} />
            <span>Shuffle Stack</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode(prev => prev === 'fan' ? 'swipe' : 'fan')}
            className={`sports-mode-pill ${activeMode === 'fan' ? 'active' : ''}`}
          >
            <Sparkles size={15} />
            <span>{activeMode === 'fan' ? 'Collapse Stack' : 'Poker Hand Fan'}</span>
          </button>
        </div>

        {/* 3D Physical Card Deck Stage */}
        <div
          ref={deckContainerRef}
          className="sports-deck-stage"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {visibleCards.map((card, idx) => {
            const isTop = idx === 0;
            const isSwipingThis = swipingState.active && isTop;

            // Compute Physical 3D Stack Transformations
            let transform = '';
            let opacity = 1;
            let zIndex = 10 - idx;
            let transitionStyle = isDragging && isTop
              ? 'none'
              : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, box-shadow 0.4s ease';

            if (isSwipingThis) {
              // Complete Flying Swipe Off-Screen
              const xFly = swipingState.direction === 'right' ? '120vw' : '-120vw';
              const rotZ = swipingState.direction === 'right' ? '25deg' : '-25deg';
              const rotY = swipingState.direction === 'right' ? '25deg' : '-25deg';
              transform = `translate3d(${xFly}, 20px, -100px) rotateZ(${rotZ}) rotateY(${rotY}) scale(0.9)`;
              opacity = 0;
            } else if (isRolling && isTop) {
              // 3D Roll Outgoing Flip
              transform = `translate3d(-45%, 0, -120px) rotateY(-110deg) rotateZ(-6deg) scale(0.88)`;
              opacity = 0;
            } else if (isTop && isDragging) {
              // Live Interactive Pointer Drag Following
              const rotZ = (dragOffset.x / 20) * 1.2;
              const rotY = (dragOffset.x / 25) * 1.0;
              transform = `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 90px) rotateZ(${rotZ}deg) rotateY(${rotY}deg) scale(1.02)`;
              opacity = 1;
            } else if (activeMode === 'fan') {
              // Poker Hand Fanned Arc
              const angle = (idx - 1.5) * 10;
              const xOffset = (idx - 1.5) * 75;
              const yOffset = Math.abs(idx - 1.5) * 18;
              transform = `translate3d(${xOffset}px, ${yOffset}px, ${-idx * 30}px) rotateZ(${angle}deg) scale(${1 - idx * 0.04})`;
              opacity = 1 - idx * 0.12;
            } else if (isShuffling) {
              // Shuffle Stack Offset
              const side = idx % 2 === 0 ? 1 : -1;
              transform = `translate3d(${side * 90}px, ${idx * 20}px, ${-idx * 40}px) rotateZ(${side * 6}deg) scale(${1 - idx * 0.05})`;
              opacity = 1 - idx * 0.15;
            } else {
              // Controlled Default 3D Physical Stack
              // Card 0: scale(1), translateY(0), translateZ(80px), rotateZ(0deg)
              // Card 1: scale(0.96), translateY(14px), translateZ(40px), rotateZ(-2deg)
              // Card 2: scale(0.92), translateY(28px), translateZ(0px), rotateZ(2deg)
              // Card 3: scale(0.88), translateY(42px), translateZ(-40px), rotateZ(-3deg)
              const yOffset = idx * 14;
              const zOffset = 80 - idx * 40;
              const scale = 1 - idx * 0.04;
              const rotZ = idx === 0 ? 0 : idx === 1 ? -2 : idx === 2 ? 2 : -3;
              opacity = idx === 0 ? 1 : idx === 1 ? 0.90 : idx === 2 ? 0.65 : 0.35;
              transform = `translate3d(0, ${yOffset}px, ${zOffset}px) rotateZ(${rotZ}deg) scale(${scale})`;
            }

            return (
              <div
                key={card.id}
                className="sports-deck-card-wrapper"
                style={{
                  transform,
                  opacity,
                  zIndex,
                  transition: transitionStyle,
                  cursor: isTop ? (isDragging ? 'grabbing' : 'grab') : 'pointer'
                }}
                onClick={() => {
                  if (!isTop && !isDragging) {
                    // Bring clicked card directly to top
                    setDeck(prev => {
                      const clicked = prev[idx];
                      const others = prev.filter((_, i) => i !== idx);
                      return [clicked, ...others];
                    });
                  }
                }}
              >
                {/* Reusable SportsImageCard (Strict default: image only; hover: staggered info reveal) */}
                <SportsImageCard
                  src={card.src}
                  alt={card.alt}
                  title={card.title}
                  desc={card.alt}
                  category={card.category}
                  number={`0${card.deckIndex || idx + 1}`}
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

        {/* Deck Navigation & Counter Bar */}
        <div className="sports-deck-controls-bar">
          <button
            type="button"
            onClick={handlePrev}
            className="sports-deck-btn"
            aria-label="Previous Sports Photograph"
          >
            <ChevronLeft size={20} />
            <span>Prev</span>
          </button>

          {/* Index Counter */}
          <div className="sports-deck-counter">
            <span className="current-num">{topCard?.deckIndex < 10 ? `0${topCard?.deckIndex || 1}` : (topCard?.deckIndex || 1)}</span>
            <span className="separator">/</span>
            <span className="total-num">{deck.length < 10 ? `0${deck.length}` : deck.length}</span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="sports-deck-btn"
            aria-label="Next Sports Photograph"
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Interaction Hint */}
        <div className="sports-deck-hint">
          <span>💡 Drag card horizontally or use controls above to cycle cards in full 3D physics. Hover card to reveal details.</span>
        </div>
      </div>
    </section>
  );
}
