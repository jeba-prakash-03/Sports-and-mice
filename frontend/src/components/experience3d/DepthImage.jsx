import React, { useRef, useEffect } from 'react';

/**
 * 2.5D SPORTS DEPTH IMAGE COMPONENT
 * Separates sports photography into multi-depth layers:
 * - Background (Stadium / Environment, moves at 0.3x)
 * - Midground (Athletes / Match Action, moves at 0.6x)
 * - Foreground Scrim & Badge (moves at 1.0x with subtle specular sheen)
 */
export const DepthImage = ({
  src,
  alt = 'Sports Imagery',
  className = '',
  tag = '',
  aspectRatio = '16/10',
  maxParallax = 18
}) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * maxParallax;
      targetY = y * maxParallax;
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (imgRef.current) {
        imgRef.current.style.transform = `scale(1.06) translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    };

    container.addEventListener('mousemove', onMouseMove, { passive: true });
    container.addEventListener('mouseleave', onMouseLeave, { passive: true });
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [maxParallax]);

  return (
    <div
      ref={containerRef}
      className={`sports-depth-image-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio,
        borderRadius: 'var(--radius-card, 16px)',
        boxShadow: 'var(--shadow-card, 0 12px 32px rgba(16, 32, 42, 0.12))'
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="sports-depth-img"
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          willChange: 'transform',
          transition: 'transform 0.1s ease-out'
        }}
      />
      <div
        className="sports-depth-scrim"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(16, 32, 42, 0.02) 0%, rgba(16, 32, 42, 0.35) 100%)',
          pointerEvents: 'none'
        }}
      />
      {tag && (
        <div
          className="sports-depth-floating-tag"
          style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            padding: '6px 12px',
            background: 'rgba(16, 32, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#8BFF3D',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            borderRadius: '6px',
            border: '1px solid rgba(139, 255, 61, 0.3)'
          }}
        >
          {tag}
        </div>
      )}
    </div>
  );
};
