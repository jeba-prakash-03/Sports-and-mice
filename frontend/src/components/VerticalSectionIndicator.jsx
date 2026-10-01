import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const VerticalSectionIndicator = () => {
  const [sections, setSections] = useState([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Scan page for major semantic sections
    const updateSections = () => {
      const foundSections = Array.from(
        document.querySelectorAll('main section, main .home-hero, main .service-hero, main .about-hero, main .hotels-hero, main .contact-hero')
      ).filter(sec => {
        // Exclude tiny utility or builder-hidden sections
        return sec.offsetHeight > 100 && sec.offsetParent !== null;
      });

      const sectionData = foundSections.map((sec, idx) => {
        // Get heading text or section label if available
        const heading = sec.querySelector('h1, h2, h3, .section-main-title, .hero-heading-prefix')?.textContent?.trim();
        const shortName = heading ? (heading.length > 24 ? heading.substring(0, 22) + '…' : heading) : `Section ${idx + 1}`;
        return {
          element: sec,
          index: idx,
          numStr: String(idx + 1).padStart(2, '0'),
          name: shortName,
          top: sec.getBoundingClientRect().top + window.scrollY
        };
      });

      setSections(sectionData);
    };

    // Initial timeout to ensure DOM is mounted
    const timer = setTimeout(updateSections, 400);

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      const foundSections = Array.from(
        document.querySelectorAll('main section, main .home-hero, main .service-hero, main .about-hero, main .hotels-hero, main .contact-hero')
      ).filter(sec => sec.offsetHeight > 100 && sec.offsetParent !== null);

      if (foundSections.length === 0) return;

      let currentActive = 0;
      foundSections.forEach((sec, idx) => {
        const rect = sec.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if (scrollPos >= top) {
          currentActive = idx;
        }
      });
      setActiveSectionIndex(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateSections, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateSections);
    };
  }, [location.pathname]);

  const scrollToSection = (sec) => {
    if (sec && sec.element) {
      sec.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (sections.length <= 1) return null;

  return (
    <aside 
      className="vertical-page-indicator"
      aria-label="Section Navigation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="vpi-track">
        {sections.map((sec, idx) => {
          const isActive = idx === activeSectionIndex;
          return (
            <button
              key={idx}
              className={`vpi-node ${isActive ? 'active' : ''}`}
              onClick={() => scrollToSection(sec)}
              title={sec.name}
              aria-label={`Jump to ${sec.numStr}: ${sec.name}`}
            >
              <span className="vpi-num">{sec.numStr}</span>
              <div className="vpi-dot-wrapper">
                <span className={`vpi-dot ${isActive ? 'active-dot' : ''}`} />
                {idx < sections.length - 1 && <span className="vpi-connector-line" />}
              </div>
              <AnimatePresence>
                {(isHovered || isActive) && (
                  <motion.span 
                    className="vpi-label"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {sec.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default VerticalSectionIndicator;
