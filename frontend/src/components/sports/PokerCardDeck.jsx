import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, Sparkles } from 'lucide-react';
import sportsImageManifest from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * PokerCardDeck Component
 * Advanced Poker Card Swipe & Fan Animation Suite
 * - Realistic poker card fan layout (rotational offset & arc translation)
 * - Swipe gestures (drag left/right, flick off-screen)
 * - Card indices (A♠, K♥, Q♦, J♣, 10♠) with gold metallic edges
 * - Interactive Deal & Shuffle physics
 */
export default function PokerCardDeck({
  title = "Interactive Sports Poker Deck",
  subtitle = "Swipe, flick, or click to deal championship sports photography cards.",
  className = ""
}) {
  const cardsData = [
    {
      ...sportsImageManifest.find(i => i.id === 'football-01') || sportsImageManifest[0],
      pokerIndex: "A",
      suit: "♠",
      suitColor: "#ef4444",
      tagline: "Ace of Football — Championship Precision"
    },
    {
      ...sportsImageManifest.find(i => i.id === 'basketball-01') || sportsImageManifest[1],
      pokerIndex: "K",
      suit: "♥",
      suitColor: "#f59e0b",
      tagline: "King of Courts — High-Altitude Slam Dunk"
    },
    {
      ...sportsImageManifest.find(i => i.id === 'tennis-01') || sportsImageManifest[2],
      pokerIndex: "Q",
      suit: "♦",
      suitColor: "#84cc16",
      tagline: "Queen of Service — Grand Slam Precision"
    },
    {
      ...sportsImageManifest.find(i => i.id === 'athletics-01') || sportsImageManifest[3],
      pokerIndex: "J",
      suit: "♣",
      suitColor: "#06b6d4",
      tagline: "Jack of Track — 100m Velocity Explosion"
    },
    {
      ...sportsImageManifest.find(i => i.id === 'stadium-01') || sportsImageManifest[4],
      pokerIndex: "10",
      suit: "♠",
      suitColor: "#a855f7",
      tagline: "10 of Venues — Architectural Arena Grandeur"
    },
    {
      ...sportsImageManifest.find(i => i.id === 'swimming-01') || sportsImageManifest[5],
      pokerIndex: "9",
      suit: "♥",
      suitColor: "#3b82f6",
      tagline: "9 of Aquatics — Freestyle Sprint Power"
    },
    {
      ...sportsImageManifest.find(i => i.id === 'cycling-01') || sportsImageManifest[6],
      pokerIndex: "8",
      suit: "♦",
      suitColor: "#eab308",
      tagline: "8 of Pelotons — Mountain Pass Pursuit"
    }
  ];

  const [cards, setCards] = useState(cardsData);
  const [swipingCardId, setSwipingCardId] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left' | 'right'
  const [isFanned, setIsFanned] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);

  // Swipe top card
  const handleSwipe = (direction = 'right') => {
    if (cards.length === 0 || swipingCardId) return;
    const topCard = cards[0];
    setSwipingCardId(topCard.id);
    setSwipeDirection(direction);

    setTimeout(() => {
      setCards((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setSwipingCardId(null);
      setSwipeDirection(null);
      setDragOffset(0);
    }, 450);
  };

  // Shuffle deck
  const handleShuffle = () => {
    setIsFanned(false);
    setCards((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  // Drag handlers
  const onTouchStart = (e) => {
    setDragStartX(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    if (dragStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - dragStartX;
    setDragOffset(diff);
  };

  const onTouchEnd = () => {
    if (Math.abs(dragOffset) > 70) {
      handleSwipe(dragOffset > 0 ? 'right' : 'left');
    } else {
      setDragOffset(0);
    }
    setDragStartX(null);
  };

  const onMouseDown = (e) => {
    setDragStartX(e.clientX);
  };

  const onMouseMove = (e) => {
    if (dragStartX === null) return;
    const diff = e.clientX - dragStartX;
    setDragOffset(diff);
  };

  const onMouseUp = () => {
    if (Math.abs(dragOffset) > 70) {
      handleSwipe(dragOffset > 0 ? 'right' : 'left');
    } else {
      setDragOffset(0);
    }
    setDragStartX(null);
  };

  return (
    <section className={`sports-system-section ${className}`} style={{ background: 'linear-gradient(180deg, rgba(8,10,14,0.95) 0%, rgba(14,18,24,0.98) 50%, rgba(8,10,14,0.95) 100%)' }}>
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header text-center">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
            Poker Card Swipe Suite
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* Deck Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleSwipe('left')}
            className="poker-ctrl-btn"
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronLeft size={18} />
            <span>Swipe Left</span>
          </button>

          <button
            onClick={() => setIsFanned(!isFanned)}
            className="poker-ctrl-btn"
            style={{
              padding: '10px 24px',
              borderRadius: '9999px',
              background: isFanned ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: isFanned ? '0 0 20px rgba(239,68,68,0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={16} />
            <span>{isFanned ? 'Stack Deck' : 'Fan Cards Hand'}</span>
          </button>

          <button
            onClick={handleShuffle}
            className="poker-ctrl-btn"
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Shuffle size={16} />
            <span>Shuffle</span>
          </button>

          <button
            onClick={() => handleSwipe('right')}
            className="poker-ctrl-btn"
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Swipe Right</span>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Poker Deck Interactive Arena */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '540px',
            height: '460px',
            margin: '0 auto 30px auto',
            perspective: '1400px',
            userSelect: 'none',
            touchAction: 'pan-y'
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {cards.slice(0, 5).map((card, idx) => {
            const isTop = idx === 0;
            const isSwiping = swipingCardId === card.id;

            // Poker Fan & Stack Transform Calculations
            let transform = '';
            let zIndex = 10 - idx;
            let opacity = 1 - idx * 0.12;

            if (isSwiping) {
              const xMove = swipeDirection === 'right' ? '140%' : '-140%';
              const rot = swipeDirection === 'right' ? '24deg' : '-24deg';
              transform = `translate3d(${xMove}, 20px, 100px) rotateZ(${rot}) scale(0.9)`;
              opacity = 0;
            } else if (isTop && dragOffset !== 0) {
              const rot = (dragOffset / 20) * 1.5;
              transform = `translate3d(${dragOffset}px, 0, 0) rotateZ(${rot}deg) scale(1.02)`;
            } else if (isFanned) {
              // Poker Fan Hand Arc
              const angle = (idx - 2) * 9;
              const xOffset = (idx - 2) * 60;
              const yOffset = Math.abs(idx - 2) * 16;
              transform = `translate3d(${xOffset}px, ${yOffset}px, ${-idx * 20}px) rotateZ(${angle}deg) scale(${1 - idx * 0.04})`;
            } else {
              // Poker Stack Alignment
              const yOffset = idx * 14;
              const scale = 1 - idx * 0.045;
              const zDist = -idx * 40;
              const rotZ = idx % 2 === 0 ? idx * 0.8 : -idx * 0.8;
              transform = `translate3d(0, ${yOffset}px, ${zDist}px) rotateZ(${rotZ}deg) scale(${scale})`;
            }

            return (
              <div
                key={card.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '20px',
                  background: '#12141a',
                  border: isTop ? '2px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.12)',
                  boxShadow: isTop
                    ? '0 30px 60px -15px rgba(0,0,0,0.85), 0 0 25px rgba(239,68,68,0.2)'
                    : '0 15px 35px -10px rgba(0,0,0,0.7)',
                  overflow: 'hidden',
                  transform,
                  zIndex,
                  opacity,
                  transition: isSwiping ? 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)' : 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: isTop ? 'grab' : 'pointer'
                }}
                onClick={() => {
                  if (!isTop) {
                    // Bring clicked card to top
                    setCards((prev) => {
                      const clicked = prev[idx];
                      const others = prev.filter((_, i) => i !== idx);
                      return [clicked, ...others];
                    });
                  }
                }}
              >
                {/* Media Container */}
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img
                    src={card.src}
                    alt={card.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 35%'
                    }}
                  />

                  {/* Poker Card Darkened Edge Gradient */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.92) 100%)',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Poker Top Left Index */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      zIndex: 3
                    }}
                  >
                    <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.1rem', color: '#fff', lineHeight: 1 }}>
                      {card.pokerIndex}
                    </span>
                    <span style={{ fontSize: '1.1rem', color: card.suitColor, lineHeight: 1, marginTop: 2 }}>
                      {card.suit}
                    </span>
                  </div>

                  {/* Poker Top Right Category Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      zIndex: 3
                    }}
                  >
                    <span className="sports-cat-badge">
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: card.suitColor }} />
                      {card.category}
                    </span>
                  </div>

                  {/* Poker Card Bottom Details */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '20px',
                      zIndex: 3
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: card.suitColor, fontWeight: 700, marginBottom: 4 }}>
                      {card.tagline}
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px 0', lineHeight: 1.25, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                      {card.title}
                    </h3>
                    <p style={{ color: '#d1d5db', fontSize: '0.82rem', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {card.alt}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Swipe Instruction */}
        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.82rem', margin: 0 }}>
          💡 Drag or swipe card horizontally, or use the buttons above to cycle cards in poker dealing motion.
        </p>
      </div>
    </section>
  );
}
