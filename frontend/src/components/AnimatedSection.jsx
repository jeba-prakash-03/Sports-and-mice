import React from 'react';
import { motion } from 'framer-motion';
export { ScrollReveal, StaggerContainer, ImageReveal, CountUpNumber, SpotlightCard } from './ScrollReveal';

export const AnimatedSection = ({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up', 
  distance = 30,
  duration = 0.7,
  stagger = false,
  style = {}
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: distance };
      case 'down': return { opacity: 0, y: -distance };
      case 'left': return { opacity: 0, x: distance };
      case 'right': return { opacity: 0, x: -distance };
      case 'none': return { opacity: 1, y: 0 };
      default: return { opacity: 0, y: distance };
    }
  };

  const variants = {
    hidden: getInitialPosition(),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
        when: stagger ? "beforeChildren" : undefined,
        staggerChildren: stagger ? 0.1 : undefined
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      variants={variants}
      style={{ width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedCard = ({ children, className = '', index = 0, style = {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ 
        duration: 0.6, 
        delay: (index % 6) * 0.09,
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } 
      }}
      style={{ width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}
    >
      {children}
    </motion.div>
  );
};
