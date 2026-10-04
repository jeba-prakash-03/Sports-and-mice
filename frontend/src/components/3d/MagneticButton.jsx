import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * MAGNETIC BUTTON COMPONENT (3D SPRING INTERPOLATION)
 * Smooth magnetic cursor attraction with max ±8px displacement.
 */
export const MagneticButton = ({ children, className = '', onClick, ...props }) => {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 350, damping: 25, mass: 0.1 });
  const y = useSpring(0, { stiffness: 350, damping: 25, mass: 0.1 });

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    // Limit to max 8px magnetic pull
    const pullX = Math.max(-8, Math.min(8, middleX * 0.25));
    const pullY = Math.max(-8, Math.min(8, middleY * 0.25));

    x.set(pullX);
    y.set(pullY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      className="magnetic-btn-wrapper"
    >
      <button className={`magnetic-btn ${className}`} onClick={onClick} {...props}>
        {children}
      </button>
    </motion.div>
  );
};
