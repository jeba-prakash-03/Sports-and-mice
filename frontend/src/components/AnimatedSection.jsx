import React from 'react';
import { motion } from 'framer-motion';
export { ScrollReveal, StaggerContainer, ImageReveal, CountUpNumber, SpotlightCard } from './ScrollReveal';

export const AnimatedSection = ({ 
  children, 
  className = '', 
  delay = 0, 
  direction = 'up', 
  distance = 30,
  duration = 0.55,
  stagger = false,
  style = {}
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: distance };
      case 'down': return { opacity: 0, y: -distance };
      case 'left': return { opacity: 0, x: distance };
      case 'right': return { opacity: 0, x: -distance };
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
        ease: [0.16, 1, 0.3, 1],
        when: stagger ? "beforeChildren" : undefined,
        staggerChildren: stagger ? 0.12 : undefined
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={variants}
      style={{ width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedCard = ({ 
  children, 
  className = '', 
  index = 0, 
  style = {},
  direction = 'up',
  totalCards = 3,
  distance = 60
}) => {
  const getInitialProps = () => {
    if (direction === 'asymmetrical' || direction === 'split') {
      if (totalCards <= 2) {
        if (index === 0) return { opacity: 0, x: -distance, y: 0, scale: 0.96 };
        return { opacity: 0, x: distance, y: 0, scale: 0.96 };
      } else if (totalCards === 3) {
        if (index === 0) return { opacity: 0, x: -distance, y: 0, scale: 0.96 };
        if (index === 1) return { opacity: 0, x: 0, y: distance, scale: 0.96 };
        return { opacity: 0, x: distance, y: 0, scale: 0.96 };
      } else {
        if (index === 0) return { opacity: 0, x: -distance, y: 0, scale: 0.96 };
        if (index === totalCards - 1) return { opacity: 0, x: distance, y: 0, scale: 0.96 };
        return { opacity: 0, x: 0, y: distance, scale: 0.96 };
      }
    } else if (direction === 'left') {
      return { opacity: 0, x: distance, y: 0, scale: 0.96 };
    } else if (direction === 'right') {
      return { opacity: 0, x: -distance, y: 0, scale: 0.96 };
    } else if (direction === 'down') {
      return { opacity: 0, x: 0, y: -distance, scale: 0.96 };
    }
    return { opacity: 0, x: 0, y: distance, scale: 0.96 };
  };

  return (
    <motion.div
      initial={getInitialProps()}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ 
        duration: 0.65, 
        delay: (index % 6) * 0.12,
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ 
        y: -6, 
        transition: { duration: 0.25, ease: "easeOut" } 
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box' }}
    >
      {children}
    </motion.div>
  );
};
