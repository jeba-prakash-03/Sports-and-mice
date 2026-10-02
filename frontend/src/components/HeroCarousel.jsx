import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeroParallaxBg from './HeroParallaxBg';

/**
 * Renders the home hero as a carousel when there's more than one active
 * slide. Each slide reuses HeroParallaxBg for the background (so the mouse/
 * scroll parallax from the single-slide hero carries over unchanged) plus
 * the same heading/tag/subtitle/button markup — just sourced from the
 * slide object instead of the single legacy `section` object.
 *
 * Auto-advances every 6s, pauses on hover, and skips auto-advance entirely
 * under prefers-reduced-motion (arrows/dots still work either way).
 */
const HeroCarousel = ({ slides, lang, renderButton }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const goTo = useCallback((i) => {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (prefersReducedMotion || paused || slides.length <= 1) return undefined;
    const timer = setInterval(() => goTo(index + 1), 6000);
    return () => clearInterval(timer);
  }, [index, paused, prefersReducedMotion, slides.length, goTo]);

  const slide = slides[index];
  const prefix = lang === 'de' ? (slide.heading_prefix_de || slide.heading_prefix_en) : slide.heading_prefix_en;
  const tag1 = lang === 'de' ? (slide.tag1_de || slide.tag1_en) : slide.tag1_en;
  const tag2 = lang === 'de' ? (slide.tag2_de || slide.tag2_en) : slide.tag2_en;
  const subtitle = lang === 'de' ? (slide.subtitle_de || slide.subtitle_en) : slide.subtitle_en;

  return (
    <div
      className="hero-carousel-wrapper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id || index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-carousel-slide"
        >
          <HeroParallaxBg bgImage={slide.bg_image} />
          <div className="container home-hero-container">
            <div className="home-hero-content">
              {prefix && <h1 className="hero-heading-prefix">{prefix}</h1>}

              {(tag1 || tag2) && (
                <div className="hero-blue-box">
                  {tag1 && <div className="blue-box-line">{tag1}</div>}
                  {tag2 && <div className="blue-box-line">{tag2}</div>}
                </div>
              )}

              {subtitle && <p className="hero-subtitle">{subtitle}</p>}

              {slide.cta_button_enabled !== false && renderButton(slide, lang)}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button type="button" className="hero-carousel-arrow hero-carousel-arrow-prev" onClick={() => goTo(index - 1)} aria-label="Previous slide">
            <ChevronLeft size={22} />
          </button>
          <button type="button" className="hero-carousel-arrow hero-carousel-arrow-next" onClick={() => goTo(index + 1)} aria-label="Next slide">
            <ChevronRight size={22} />
          </button>

          <div className="hero-carousel-dots" role="tablist" aria-label="Hero slides">
            {slides.map((s, i) => (
              <button
                key={s.id || i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
                className={`hero-carousel-dot ${i === index ? 'active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
