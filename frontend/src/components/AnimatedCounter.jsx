import React, { useEffect, useState, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

export const AnimatedCounter = ({ end, duration = 1.8, suffix = '', prefix = '' }) => {
  const target = parseInt(end, 10) || 0;
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(shouldReduceMotion ? target : 0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-40px' });

  useEffect(() => {
    if (shouldReduceMotion) {
      setCount(target);
      return;
    }
    if (!isInView) {
      setCount(0);
      return;
    }

    let startTime = null;
    let animationFrameId = null;

    const updateCounter = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Ease out quartic
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, target, duration, shouldReduceMotion]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
};
