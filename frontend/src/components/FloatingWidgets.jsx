import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowUp, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingWidgets = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const isContactPage = location.pathname.includes('Contact') || location.pathname.includes('Kontakt');

  return (
    <div className="floating-widgets-container">
      {/* Floating Quick Contact CTA (only if not on contact page) */}
      {!isContactPage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, x: 15 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          style={{ pointerEvents: 'auto' }}
        >
          <NavLink
            to="/en/Contact/"
            className="floating-contact-btn animate-float"
            aria-label="Contact us"
          >
            <span className="contact-status-dot" />
            <Mail size={15} />
            <span>Get in Touch</span>
          </NavLink>
        </motion.div>
      )}

      {/* Back to Top Floating Button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 15 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="floating-top-btn"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingWidgets;
