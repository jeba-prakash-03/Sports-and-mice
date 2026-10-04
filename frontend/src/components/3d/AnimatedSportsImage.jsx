import React, { useRef, useState } from 'react';
import { RevealOnScroll } from '../MotionSuite';

/**
 * ANIMATED SPORTS IMAGE (3-LAYER DEPTH COMPOSITION)
 * Layer 1: Sharp sports photograph with uncompromised quality
 * Layer 2: Offset architectural border frame & ambient shadow
 * Layer 3: Floating foreground sports telemetry badge with translateZ
 */
export const AnimatedSportsImage = ({
  src,
  alt = 'Sports Photography',
  tag = '01 / FIELD LOGISTICS',
  aspectRatio = '16 / 10',
  className = '',
  maxTilt = 3
}) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale(1.01)`
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)');
  };

  return (
    <RevealOnScroll className={`animated-sports-img-container ${className}`}>
      <div
        ref={cardRef}
        className="sports-depth-frame"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          aspectRatio,
          transform: transformStyle || 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease'
        }}
      >
        {/* Layer 1: Pure crystal-clear image */}
        <img
          src={src}
          alt={alt}
          className="sports-depth-img"
          loading="lazy"
        />

        {/* Layer 2: Subtle gradient vignette for contrast */}
        <div className="sports-depth-scrim" />

        {/* Layer 3: Floating 3D Telemetry Badge */}
        {tag && (
          <div className="sports-floating-tag">
            <span className="sports-tag-dot" />
            <span className="sports-tag-text">{tag}</span>
          </div>
        )}
      </div>
    </RevealOnScroll>
  );
};
