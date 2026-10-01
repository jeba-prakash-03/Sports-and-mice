import React, { useEffect, useState } from 'react';

/**
 * Premium Minimal Agency Custom Cursor (Desktop only, non-touch)
 */
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check touch device or reduced motion
    if (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const isInteractive = target.closest('a, button, [role="button"], input, select, textarea, .nav-link, .btn-red-pill, .interactive-card');
      const isImg = target.closest('.tour-card, .image-zoom-container, .about-story-img, .responsive-video-container');

      setIsHovered(!!isInteractive);
      setIsImageHovered(!!isImg && !isInteractive);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <div className="custom-cursor-container" aria-hidden="true" style={{ pointerEvents: 'none', position: 'fixed', top: 0, left: 0, zIndex: 99999 }}>
      {/* Center dot */}
      <div 
        className={`custom-cursor-dot ${isHovered ? 'cursor-dot-hover' : ''}`}
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          width: '6px',
          height: '6px',
          backgroundColor: '#ff0000',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.1s ease-out, width 0.2s, height 0.2s, background-color 0.2s',
          pointerEvents: 'none',
          boxShadow: '0 0 8px rgba(255, 0, 0, 0.6)'
        }}
      />
      {/* Outer trailing ring */}
      <div 
        className={`custom-cursor-ring ${isHovered ? 'cursor-ring-hover' : ''} ${isImageHovered ? 'cursor-ring-image' : ''}`}
        style={{
          position: 'fixed',
          top: position.y,
          left: position.x,
          width: isImageHovered ? '64px' : isHovered ? '48px' : '32px',
          height: isImageHovered ? '64px' : isHovered ? '48px' : '32px',
          border: isImageHovered ? 'none' : '1.5px solid rgba(255, 0, 0, 0.4)',
          backgroundColor: isImageHovered ? 'rgba(15, 23, 42, 0.85)' : isHovered ? 'rgba(255, 0, 0, 0.08)' : 'transparent',
          backdropFilter: isImageHovered ? 'blur(4px)' : 'none',
          WebkitBackdropFilter: isImageHovered ? 'blur(4px)' : 'none',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontFamily: 'var(--font-heading, sans-serif)',
          fontWeight: 700,
          letterSpacing: '1px',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border-color 0.2s',
          pointerEvents: 'none'
        }}
      >
        {isImageHovered && <span>VIEW</span>}
      </div>
    </div>
  );
};

export default CustomCursor;
