import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: '0%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 70%, #C9A227 100%)',
        boxShadow: '0 0 10px rgba(37, 99, 235, 0.4)',
        zIndex: 99999,
        pointerEvents: 'none'
      }}
    />
  );
};

export default ScrollProgressBar;
