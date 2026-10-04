import React, { useEffect, useRef } from 'react';

/**
 * GIANT LOW-OPACITY BACKGROUND EDITORIAL WORD
 * Creates the MotionSites-style high-end editorial feel with slow scroll parallax.
 */
export const SportsWatermarkWord = ({ text = 'PERFORMANCE', className = '' }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const onScroll = () => {
      if (!textRef.current) return;
      const rect = textRef.current.parentElement.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * 0.08;
      textRef.current.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`sports-watermark-wrapper ${className}`} aria-hidden="true">
      <span ref={textRef} className="sports-watermark-text">
        {text}
      </span>
    </div>
  );
};
