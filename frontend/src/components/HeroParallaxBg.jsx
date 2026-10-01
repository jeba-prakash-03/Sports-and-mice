import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'framer-motion';

/**
 * Layered hero background with subtle mouse + scroll parallax.
 *
 * Deliberately conservative: a few px of mouse drift and ~60px of scroll
 * drift, both GPU-composited via `transform` only (never background-position
 * or top/left). Disabled under prefers-reduced-motion and on coarse-pointer
 * (touch) devices, where mouse parallax has no meaning and the extra
 * rAF/mousemove work isn't worth the battery cost.
 */
const HeroParallaxBg = ({ bgImage }) => {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 18, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 18, mass: 0.6 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const translateX = useTransform(springX, [-1, 1], [-12, 12]);
  const translateY = useTransform(
    [springY, scrollYProgress],
    ([mouseDrift, scrollProgress]) => mouseDrift * 8 + scrollProgress * 60
  );

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarsePointer) return undefined;

    // The bg layer itself has `pointer-events: none` (so it never blocks
    // clicks on hero content above it) — which also means it never *receives*
    // mousemove. Listen on its parent (the `.home-hero` section) instead,
    // which spans the same area and has normal pointer events.
    const el = ref.current?.parentElement;
    if (!el) return undefined;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [prefersReducedMotion, mouseX, mouseY]);

  if (!bgImage) return null;

  return (
    <motion.div
      ref={ref}
      className="hero-bg-parallax"
      style={{
        backgroundImage: `url('${bgImage}')`,
        x: prefersReducedMotion ? 0 : translateX,
        y: prefersReducedMotion ? 0 : translateY
      }}
      aria-hidden="true"
    />
  );
};

export default HeroParallaxBg;
