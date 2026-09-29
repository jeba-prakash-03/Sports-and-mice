import React, { useEffect, useRef, useState } from 'react';

/**
 * Reusable High-Performance Scroll Reveal Component
 * Uses native IntersectionObserver to animate smoothly on entry and replay on re-entry.
 */
export const ScrollReveal = ({
  children,
  animation = 'fade-up', // 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'scale-in', 'zoom-in', 'zoom-out', 'clip-reveal', 'blur-reveal', 'rotate-reveal', 'image-reveal'
  delay = 0,
  duration = 0.55,
  distance = 30,
  threshold = 0.1,
  className = '',
  style = {},
  tag: Tag = 'div'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const currentEl = elementRef.current;
    if (!currentEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    observer.observe(currentEl);

    return () => {
      if (currentEl) observer.unobserve(currentEl);
    };
  }, [threshold]);

  const getTransitionStyle = () => {
    const baseTransition = `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, clip-path ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, filter ${duration}s ease ${delay}s`;

    let initialTransform = 'none';
    let initialClip = 'none';
    let initialFilter = 'none';

    switch (animation) {
      case 'fade-up':
        initialTransform = `translate3d(0, ${distance}px, 0)`;
        break;
      case 'fade-down':
        initialTransform = `translate3d(0, -${distance}px, 0)`;
        break;
      case 'fade-left':
        initialTransform = `translate3d(${distance}px, 0, 0)`;
        break;
      case 'fade-right':
        initialTransform = `translate3d(-${distance}px, 0, 0)`;
        break;
      case 'scale-in':
      case 'zoom-in':
        initialTransform = 'scale(0.92)';
        break;
      case 'zoom-out':
        initialTransform = 'scale(1.08)';
        break;
      case 'rotate-reveal':
        initialTransform = `translate3d(0, ${distance}px, 0) rotate(2deg)`;
        break;
      case 'blur-reveal':
        initialTransform = `translate3d(0, ${distance * 0.7}px, 0)`;
        initialFilter = 'blur(8px)';
        break;
      case 'clip-reveal':
      case 'image-reveal':
        initialClip = 'inset(0 100% 0 0)';
        initialTransform = 'scale(1.04)';
        break;
      default:
        initialTransform = `translate3d(0, ${distance}px, 0)`;
    }

    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translate3d(0,0,0) scale(1) rotate(0deg)' : initialTransform,
      clipPath: isVisible ? 'inset(0 0 0 0)' : initialClip,
      filter: isVisible ? 'blur(0px)' : initialFilter,
      transition: baseTransition,
      willChange: isVisible ? 'auto' : 'opacity, transform',
      ...style
    };
  };

  return (
    <Tag
      ref={elementRef}
      className={`scroll-reveal-item ${isVisible ? 'is-revealed' : ''} ${className}`}
      style={getTransitionStyle()}
    >
      {children}
    </Tag>
  );
};

/**
 * Stagger Container for Card Grids (Card 1: 0ms, Card 2: 100ms, Card 3: 200ms, Card 4: 300ms)
 */
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  animation = 'fade-up',
  className = '',
  style = {}
}) => {
  return (
    <div className={`stagger-reveal-grid ${className}`} style={style}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <ScrollReveal
            animation={animation}
            delay={index * staggerDelay}
            duration={0.5}
            distance={25}
          >
            {child}
          </ScrollReveal>
        );
      })}
    </div>
  );
};

/**
 * Image Reveal Component with Cinematic Wipe
 */
export const ImageReveal = ({
  src,
  alt = '',
  className = '',
  style = {},
  aspectRatio = '16 / 10',
  imgStyle = {}
}) => {
  return (
    <ScrollReveal animation="image-reveal" duration={0.7} distance={0} className={className} style={{ overflow: 'hidden', ...style }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          aspectRatio,
          objectFit: 'cover',
          display: 'block',
          ...imgStyle
        }}
      />
    </ScrollReveal>
  );
};

/**
 * Animated Count-Up Number for Statistics with Replay on Re-entry
 */
export const CountUpNumber = ({
  target,
  duration = 1800,
  suffix = '+',
  prefix = ''
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);

  const numTarget = parseInt(String(target).replace(/[^0-9]/g, ''), 10) || 0;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    let animationFrameId = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTime = null;
          if (animationFrameId) cancelAnimationFrame(animationFrameId);

          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentNum = Math.floor(easeProgress * numTarget);
            setCount(currentNum);

            if (progress < 1) {
              animationFrameId = requestAnimationFrame(animate);
            } else {
              setCount(numTarget);
            }
          };

          animationFrameId = requestAnimationFrame(animate);
        } else {
          // Reset when leaving viewport so it replays smoothly when re-entering
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          setCount(0);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (el) observer.unobserve(el);
    };
  }, [numTarget, duration]);

  return (
    <span ref={elementRef} className="count-up-number">
      {prefix}{count}{suffix}
    </span>
  );
};

/**
 * Interactive Desktop Spotlight Card
 */
export const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 0, 0, 0.15)',
  style = {}
}) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {isHovered && (
        <div
          className="spotlight-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 70%)`,
            zIndex: 1,
            transition: 'opacity 0.2s ease'
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};
