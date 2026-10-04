import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { 
  ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight,
  Menu as MenuIcon, X as CloseIcon,
  Globe, Phone, Mail, Trophy, Users, Clock, MapPin, Sparkles, Compass, Shield
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { SportsScene } from './3d/SportsScene';
import { Hero3DCanvas } from './3d/Hero3DCanvas';
import { SportsGlobe3D } from './3d/SportsGlobe3D';
import { SportsActionShowcase } from './3d/SportsActionShowcase';
import { MagneticButton as PhysicsMagneticButton } from './3d/MagneticButton';
import { AnimatedSportsImage } from './3d/AnimatedSportsImage';
import { SportsWatermarkWord } from './3d/SportsWatermarkWord';
import { SceneManager, UIAnchor, DepthImage, CameraRig, SportsEnvironment, FootballScene, TrophyScene, GlobeScene, ParticleSystem, TrajectorySystem } from './experience3d';

export { 
  SportsScene, Hero3DCanvas, SportsGlobe3D, SportsActionShowcase, 
  AnimatedSportsImage, SportsWatermarkWord,
  SceneManager, UIAnchor, DepthImage, CameraRig, SportsEnvironment, 
  FootballScene, TrophyScene, GlobeScene, ParticleSystem, TrajectorySystem 
};


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ============================================================================
   1. LENIS SMOOTH SCROLL PROVIDER
   ============================================================================ */
export const SmoothScrollProvider = ({ children }) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
      infinite: false
    });

    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
};

/* ============================================================================
   2. DESKTOP SPATIAL CURSOR (MAX 5-8px Parallax / Subtle)
   ============================================================================ */
export const SpatialCursor = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [state, setState] = useState('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);

      const el = e.target.closest('a, button, .cursor-hover, .interactive-panel, input, textarea');
      if (el) {
        setState('hover');
      } else {
        setState('default');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', () => setVisible(false));
    document.addEventListener('mouseenter', () => setVisible(true));
    return () => window.removeEventListener('mousemove', onMove);
  }, [visible]);

  if (typeof window === 'undefined' || !visible) return null;

  const size = state === 'hover' ? 36 : 10;
  const offset = size / 2;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999999,
        pointerEvents: 'none',
        borderRadius: '50%',
        mixBlendMode: 'difference',
        border: state === 'hover' ? '1px solid rgba(255,255,255,0.6)' : 'none',
        backgroundColor: state === 'hover' ? 'rgba(255,255,255,0.1)' : '#FFFFFF'
      }}
      animate={{
        x: pos.x - offset,
        y: pos.y - offset,
        width: size,
        height: size
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.1 }}
    />
  );
};

/* ============================================================================
   3. HEADER / NAVIGATION (FULL WIDTH, 72-84px, NO PILLS, STRICT SPEC)
   ============================================================================ */
export const FloatingSpatialNavigation = () => {
  const { lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isInsideBuilder = location.pathname.startsWith('/admin/website-builder') || (typeof document !== 'undefined' && Boolean(document.querySelector('.admin-website-builder-studio')));

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { id: 'home', label: lang === 'de' ? 'Startseite' : 'Home', path: lang === 'de' ? '/de/' : '/en/' },
    { id: 'service', label: lang === 'de' ? 'Dienstleistung' : 'Service', path: lang === 'de' ? '/de/Dienstleistung/' : '/en/Service/' },
    { id: 'about', label: lang === 'de' ? 'Über uns' : 'About us', path: lang === 'de' ? '/de/Über-uns/' : '/en/About-us/' },
    { id: 'hotels', label: lang === 'de' ? 'Hotels & mehr' : 'Hotels & more', path: lang === 'de' ? '/de/Hotels-mehr/' : '/en/Hotels-more/' },
    { id: 'contact', label: lang === 'de' ? 'Kontakt' : 'Contact', path: lang === 'de' ? '/de/Kontakt/' : '/en/Contact/' }
  ];

  const handleNavClick = (e, item) => {
    if (isInsideBuilder) {
      e.preventDefault();
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('builder-nav-select', { detail: item }));
    }
  };

  const handleBrandClick = (e) => {
    if (isInsideBuilder) {
      e.preventDefault();
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('builder-brand-select'));
    }
  };

  return (
    <>
      <header className={`site-header-editorial ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Logo */}
          <NavLink 
            to={lang === 'de' ? '/de/' : '/en/'} 
            className="brand-identity-link"
            onClick={handleBrandClick}
          >
            <img src="/assets/images/logo.png" alt="K-Consulting Logo" className="brand-logo-img" />
            <div className="brand-text-wrap">
              <span className="brand-name">SPORTS & MICE</span>
              <span className="brand-sub">K-CONSULTING</span>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="header-nav-menu" aria-label="Main Navigation">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={(e) => handleNavClick(e, item)}
                className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions: Lang switch & Mobile toggle */}
          <div className="header-actions-group">
            <button
              onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
              className="lang-switch-btn"
              aria-label="Toggle language"
            >
              <Globe size={13} />
              <span>{lang === 'en' ? 'DE' : 'EN'}</span>
            </button>

            <button
              className="mobile-menu-trigger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-drawer-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-drawer-header">
              <div className="brand-name">SPORTS & MICE</div>
              <button
                className="mobile-menu-trigger"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <CloseIcon size={26} />
              </button>
            </div>

            <nav className="mobile-drawer-nav">
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={(e) => handleNavClick(e, item)}
                  className={({ isActive }) => `mobile-drawer-nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ============================================================================
   4. FAILSAFE REVEAL ON SCROLL COMPONENT
   ============================================================================ */
export const RevealOnScroll = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setRevealed(true);
    }, 1200);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${revealed ? 'reveal-init' : ''}`}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'none' : 'translateY(36px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

/* ============================================================================
   5. 3D SPORTS OBJECTS COLLECTION (CURATED, SUBTLE, HIGH REALISM)
   ============================================================================ */

/**
 * 5.1 FLOATING 3D FOOTBALL (HERO SECTION)
 * Includes subtle mouse-tracking parallax (±12px X, ±8px Y).
 */
export const Floating3DFootball = ({ className = '' }) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const x = ((e.clientX - centerX) / centerX) * 12;
      const y = ((e.clientY - centerY) / centerY) * 8;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className={`floating-3d-football-wrapper ${className}`} 
      aria-hidden="true"
      style={{
        transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`
      }}
    >
      <div className="football-3d-sphere">
        <svg viewBox="0 0 240 240" className="football-3d-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sphereLight" cx="38%" cy="32%" r="65%" fx="35%" fy="28%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#F4F7F5" />
              <stop offset="60%" stopColor="#D2DDD8" />
              <stop offset="90%" stopColor="#8A9E96" />
              <stop offset="100%" stopColor="#556961" />
            </radialGradient>
            
            <radialGradient id="panelDark" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#25343A" />
              <stop offset="70%" stopColor="#10202A" />
              <stop offset="100%" stopColor="#081015" />
            </radialGradient>
            
            <radialGradient id="specularGlint" cx="30%" cy="25%" r="30%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.2)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            
            <linearGradient id="sportRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8BFF3D" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#2F6BFF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            <filter id="ballShadowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="rgba(16, 32, 42, 0.35)" />
            </filter>
          </defs>

          <circle cx="120" cy="120" r="100" fill="url(#sphereLight)" filter="url(#ballShadowFilter)" />
          
          <polygon points="120,78 142,94 134,118 106,118 98,94" fill="url(#panelDark)" stroke="#CAD5D0" strokeWidth="2.5" />
          <polygon points="120,78 120,44 148,34 162,60 142,94" fill="none" stroke="#A8B8B0" strokeWidth="2.5" />
          <polygon points="120,78 98,94 78,60 92,34 120,44" fill="none" stroke="#A8B8B0" strokeWidth="2.5" />
          
          <polygon points="162,60 188,68 196,95 178,114 142,94" fill="url(#panelDark)" stroke="#CAD5D0" strokeWidth="2.5" />
          <polygon points="78,60 98,94 62,114 44,95 52,68" fill="url(#panelDark)" stroke="#CAD5D0" strokeWidth="2.5" />
          
          <polygon points="106,118 134,118 126,146 100,158 84,138" fill="none" stroke="#A8B8B0" strokeWidth="2.5" />
          <polygon points="106,118 84,138 68,162 50,144 62,114" fill="url(#panelDark)" stroke="#CAD5D0" strokeWidth="2.5" />
          <polygon points="134,118 178,114 190,144 172,162 156,138" fill="url(#panelDark)" stroke="#CAD5D0" strokeWidth="2.5" />
          
          <polygon points="100,158 126,146 140,172 120,192 100,182" fill="url(#panelDark)" stroke="#CAD5D0" strokeWidth="2.5" />
          <path d="M120 192 L120 220 M140 172 L172 162 M100 182 L68 162 M120 44 L120 20 M188 68 L212 56 M52 68 L28 56 M196 95 L220 105 M44 95 L20 105" stroke="#A8B8B0" strokeWidth="2.5" />

          <ellipse cx="85" cy="70" rx="45" ry="35" fill="url(#specularGlint)" />
          <circle cx="120" cy="120" r="99" fill="url(#sportRim)" stroke="rgba(47, 107, 255, 0.15)" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="football-depth-shadow" />
    </div>
  );
};

/**
 * 5.2 FLOATING 3D TROPHY (HERO / CTA SECTION)
 * Metallic Gold trophy with ambient reflections and architectural depth.
 */
export const Floating3DTrophy = ({ className = '', size = 180 }) => {
  return (
    <div className={`floating-3d-trophy-wrapper ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <div className="trophy-3d-model">
        <svg viewBox="0 0 200 200" className="trophy-3d-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldCup" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="35%" stopColor="#D7A93D" />
              <stop offset="70%" stopColor="#99701A" />
              <stop offset="100%" stopColor="#553A04" />
            </linearGradient>
            
            <linearGradient id="goldHandle" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFEAA7" />
              <stop offset="50%" stopColor="#D7A93D" />
              <stop offset="100%" stopColor="#8C6314" />
            </linearGradient>

            <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1B2B33" />
              <stop offset="50%" stopColor="#2E4450" />
              <stop offset="100%" stopColor="#10202A" />
            </linearGradient>

            <filter id="trophyShadow">
              <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="rgba(215, 169, 61, 0.28)" />
            </filter>
          </defs>

          {/* Handles */}
          <path d="M54 50 C26 50 26 95 62 105" stroke="url(#goldHandle)" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M146 50 C174 50 174 95 138 105" stroke="url(#goldHandle)" strokeWidth="9" strokeLinecap="round" fill="none" />

          {/* Main Cup Body */}
          <path 
            d="M56 34 L144 34 C144 34 146 95 100 118 C54 95 56 34 56 34 Z" 
            fill="url(#goldCup)" 
            filter="url(#trophyShadow)" 
            stroke="#FFF4C2" 
            strokeWidth="1.5" 
          />

          {/* Cup Rim & Top Glint */}
          <ellipse cx="100" cy="34" rx="44" ry="10" fill="#FFF2B2" stroke="#D7A93D" strokeWidth="2" />
          <ellipse cx="100" cy="34" rx="36" ry="6" fill="#D7A93D" />

          {/* Stem */}
          <path d="M92 118 L108 118 L105 142 L95 142 Z" fill="url(#goldCup)" />
          <ellipse cx="100" cy="142" rx="16" ry="5" fill="#FFEAA7" />

          {/* Tiered Base / Pedestal */}
          <path d="M80 145 L120 145 L124 165 L76 165 Z" fill="url(#pedestalGrad)" stroke="#D7A93D" strokeWidth="1" />
          <rect x="68" y="165" width="64" height="12" rx="3" fill="url(#pedestalGrad)" stroke="rgba(215,169,61,0.5)" strokeWidth="1.5" />
          <rect x="86" y="168" width="28" height="6" rx="1" fill="#D7A93D" />

          {/* Specular Glint */}
          <path d="M68 45 Q75 80 94 105" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.6" fill="none" />
        </svg>
      </div>
      <div className="trophy-depth-shadow" />
    </div>
  );
};

/**
 * 5.3 FLOATING 3D MEDAL (ATHLETIC HERITAGE / STATS)
 * Rotating gold medal with striped lanyard ribbon.
 */
export const Floating3DMedal = ({ className = '', size = 120 }) => {
  return (
    <div className={`floating-3d-medal-wrapper ${className}`} style={{ width: size, height: size * 1.3 }} aria-hidden="true">
      <div className="medal-3d-container">
        <svg viewBox="0 0 160 200" className="medal-3d-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="medalRibbonLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2F6BFF" />
              <stop offset="50%" stopColor="#1B4ECB" />
              <stop offset="100%" stopColor="#10202A" />
            </linearGradient>
            <linearGradient id="medalRibbonRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D7A93D" />
              <stop offset="50%" stopColor="#B38622" />
              <stop offset="100%" stopColor="#10202A" />
            </linearGradient>
            <radialGradient id="goldMedalDisc" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FFF3B8" />
              <stop offset="45%" stopColor="#D7A93D" />
              <stop offset="85%" stopColor="#946C15" />
              <stop offset="100%" stopColor="#553A04" />
            </radialGradient>
          </defs>

          {/* Ribbon */}
          <path d="M48 10 L80 95 L65 95 L32 10 Z" fill="url(#medalRibbonLeft)" />
          <path d="M112 10 L80 95 L95 95 L128 10 Z" fill="url(#medalRibbonRight)" />

          {/* Medal Ring */}
          <circle cx="80" cy="130" r="48" fill="url(#goldMedalDisc)" stroke="#FFEAA7" strokeWidth="2.5" />
          <circle cx="80" cy="130" r="40" fill="none" stroke="#FFEAA7" strokeWidth="1.5" strokeDasharray="3 3" />
          
          {/* Star Emblem */}
          <polygon points="80,108 86,122 101,123 89,133 93,148 80,139 67,148 71,133 59,123 74,122" fill="#FFEAA7" stroke="#946C15" strokeWidth="1" />
        </svg>
      </div>
      <div className="medal-depth-shadow" />
    </div>
  );
};

/**
 * 5.4 FLOATING 3D HOCKEY PUCK (FOUNDER FIELD HOCKEY HERITAGE)
 * High-performance textured carbon disk.
 */
export const Floating3DHockeyPuck = ({ className = '', size = 110 }) => {
  return (
    <div className={`floating-3d-puck-wrapper ${className}`} style={{ width: size, height: size * 0.75 }} aria-hidden="true">
      <svg viewBox="0 0 160 120" className="puck-3d-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="puckTop" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#3A4D56" />
            <stop offset="60%" stopColor="#1B272E" />
            <stop offset="100%" stopColor="#0B1216" />
          </radialGradient>
          <linearGradient id="puckSide" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#25343C" />
            <stop offset="50%" stopColor="#10202A" />
            <stop offset="100%" stopColor="#060C0F" />
          </linearGradient>
        </defs>

        {/* Beveled Rim */}
        <path d="M15 48 C15 72 145 72 145 48 L145 74 C145 98 15 98 15 74 Z" fill="url(#puckSide)" stroke="#4E6773" strokeWidth="1.5" />
        <ellipse cx="80" cy="48" rx="65" ry="24" fill="url(#puckTop)" stroke="#678391" strokeWidth="1.5" />
        
        {/* Grip Knurling lines */}
        <ellipse cx="80" cy="48" rx="52" ry="18" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <ellipse cx="80" cy="48" rx="38" ry="12" fill="none" stroke="rgba(47,107,255,0.3)" strokeWidth="1" />
      </svg>
      <div className="puck-depth-shadow" />
    </div>
  );
};

/**
 * 5.5 FLOATING 3D DESTINATION GLOBE (HOTELS & MORE SECTION)
 * Wireframe sphere with latitude/longitude rings and pulsing destination markers.
 */
export const Floating3DGlobe = ({ className = '', size = 260 }) => {
  return (
    <div className={`floating-3d-globe-wrapper ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <div className="globe-3d-axis">
        <svg viewBox="0 0 240 240" className="globe-3d-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="globeAtmosphere" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="rgba(47, 107, 255, 0.15)" />
              <stop offset="60%" stopColor="rgba(47, 107, 255, 0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="globeRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2F6BFF" />
              <stop offset="50%" stopColor="#8BFF3D" />
              <stop offset="100%" stopColor="#D7A93D" />
            </linearGradient>
          </defs>

          {/* Outer Ring & Atmosphere */}
          <circle cx="120" cy="120" r="105" fill="url(#globeAtmosphere)" stroke="rgba(47, 107, 255, 0.25)" strokeWidth="1.5" />

          {/* Latitude Lines */}
          <ellipse cx="120" cy="120" rx="105" ry="38" fill="none" stroke="rgba(47, 107, 255, 0.4)" strokeWidth="1.2" strokeDasharray="4 3" />
          <ellipse cx="120" cy="80" rx="90" ry="24" fill="none" stroke="rgba(47, 107, 255, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
          <ellipse cx="120" cy="160" rx="90" ry="24" fill="none" stroke="rgba(47, 107, 255, 0.3)" strokeWidth="1" strokeDasharray="3 3" />

          {/* Longitude Lines */}
          <ellipse cx="120" cy="120" rx="38" ry="105" fill="none" stroke="rgba(47, 107, 255, 0.4)" strokeWidth="1.2" />
          <ellipse cx="120" cy="120" rx="74" ry="105" fill="none" stroke="rgba(47, 107, 255, 0.3)" strokeWidth="1" />
          
          {/* Axis Line */}
          <line x1="120" y1="5" x2="120" y2="235" stroke="rgba(215, 169, 61, 0.5)" strokeWidth="1.5" />

          {/* Real Destination Pulse Beacons */}
          {/* Cancún */}
          <circle cx="68" cy="115" r="5" fill="#8BFF3D" className="globe-beacon pulse-1" />
          {/* Dubai */}
          <circle cx="145" cy="108" r="5" fill="#2F6BFF" className="globe-beacon pulse-2" />
          {/* Beijing */}
          <circle cx="178" cy="92" r="5" fill="#D7A93D" className="globe-beacon pulse-3" />
          {/* Johannesburg */}
          <circle cx="138" cy="155" r="5" fill="#8BFF3D" className="globe-beacon pulse-4" />
        </svg>
      </div>
      <div className="globe-depth-shadow" />
    </div>
  );
};

/* ============================================================================
   6. DEPTH CARD 3D (INTERACTIVE MOUSE PERSPECTIVE TILT)
   ============================================================================ */
export const DepthCard3D = ({ children, className = '', maxTilt = 4 }) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale(1.01)`
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)');
  };

  return (
    <div
      ref={cardRef}
      className={`depth-card-3d ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle || 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease'
      }}
    >
      {children}
    </div>
  );
};

/* ============================================================================
   7. 3D SPORTS TIMELINE (ABOUT US ATHLETIC HERITAGE)
   ============================================================================ */
export const Sports3DTimeline = ({ lang = 'en' }) => {
  const milestones = [
    {
      year: '2000',
      tag: lang === 'de' ? 'SPITZENSPORT SCHIEDSRICHTER' : 'INTERNATIONAL REFEREE DEBUT',
      title: lang === 'de' ? 'Marc Knülle im internationalen Feldhockey' : 'Marc Knülle in International Field Hockey',
      desc: lang === 'de' 
        ? 'Beginn der internationalen Schiedsrichtertätigkeit. Frühe Erfahrung in schnellen Entscheidungen und höchster Verantwortung auf Weltklasse-Niveau.'
        : 'Debut as international field hockey referee. Early mastery in split-second decisions and strategic responsibility under elite sporting pressure.'
    },
    {
      year: '2012',
      tag: lang === 'de' ? 'GLOBALE WETTKÄMPFE' : 'GLOBAL TOURNAMENT EXPANSION',
      title: lang === 'de' ? 'Internationale Turniere & Organisationserfahrung' : 'International Championships & Team Logistics',
      desc: lang === 'de'
        ? 'Organisation von Reisen für Nationalmannschaften, Funktionäre und Delegationen zu weltweiten Turnieren und Trainingslagern.'
        : 'Comprehensive travel management for national squads, sports executives, and VIP delegations to major continental championships.'
    },
    {
      year: '2015',
      tag: lang === 'de' ? 'GRÜNDUNG K-CONSULTING' : 'FOUNDING OF SPORTS & MICE',
      title: lang === 'de' ? 'K-Consulting Sports & MICE gegründet' : 'K-Consulting Sports & MICE Established',
      desc: lang === 'de'
        ? 'Gründung der spezialisierten Agentur zur professionellen Betreuung von Sportverbänden bei Reisen, Hotels, Tagungen und Incentives.'
        : 'Official establishment of the bespoke agency dedicated to elite sports associations, seamless hotel routing, and high-performance MICE events.'
    },
    {
      year: '2026',
      tag: lang === 'de' ? 'WELTWEITES NETZWERK' : 'WORLDWIDE ATHLETIC NETWORK',
      title: lang === 'de' ? 'Über 50 Destinationen auf 5 Kontinenten' : '50+ Global Host Cities Across 5 Continents',
      desc: lang === 'de'
        ? 'Geprüfte Athleten-Hotels, erstklassige Trainingsanlagen und massgeschneiderte MICE-Programme rund um den Globus.'
        : 'Vetted athlete-grade accommodations, world-class training facilities, and executive sports conferences around the world.'
    }
  ];

  return (
    <div className="sports-3d-timeline-wrap">
      <div className="timeline-central-spine" />
      <div className="timeline-milestones-list">
        {milestones.map((item, idx) => (
          <RevealOnScroll key={idx} delay={idx * 120} className={`timeline-node-item ${idx % 2 === 0 ? 'node-left' : 'node-right'}`}>
            <DepthCard3D className="timeline-node-card">
              <div className="timeline-node-top">
                <span className="timeline-year-badge">{item.year}</span>
                <span className="timeline-tag-text">{item.tag}</span>
              </div>
              <h3 className="timeline-node-title">{item.title}</h3>
              <p className="timeline-node-desc">{item.desc}</p>
            </DepthCard3D>
            <div className="timeline-pin-sphere">
              <div className="pin-inner-dot" />
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
   8. ART HERO SEQUENCE (HOME HERO 3D EXPERIENCE)
   ============================================================================ */
export const ArtHeroSequence = ({
  bgImage = '/assets/images/home_hero_bg.jpg',
  prefix = 'Sports associations &',
  tag1 = 'Meetings ♢ Incentives',
  tag2 = 'Conferences ♢ Events',
  subtitle = 'Sport needs professional structures when traveling to competitions, team building and conferences around the world',
  ctaText = 'Get Free Consultation',
  ctaLink = '/en/Contact/'
}) => {
  return (
    <div className="home-hero-cinematic">
      {/* Background Media with High Contrast Scrim */}
      <div 
        className="home-hero-bg-layer" 
        style={{ backgroundImage: `url(${bgImage})` }} 
      />
      <div className="home-hero-overlay-gradient" />

      {/* PeachWeb-style Master Hybrid 3D Scene Manager */}
      <SceneManager activeScene="hero" />

      {/* Giant Editorial Watermark Word with scroll parallax */}
      <SportsWatermarkWord text="PERFORMANCE" />

      {/* Content Placed Directly Over Stadium Backdrop */}
      <div className="home-hero-content-wrapper">
        <div className="container">
          <div className="home-hero-text-block">
            {/* Tagline / Chrome Label */}
            <UIAnchor id="hero-tag" className="editorial-tag-anchor">
              <div className="editorial-tag">
                01 / High Performance
              </div>
            </UIAnchor>

            {/* Major Heading Composition */}
            <UIAnchor id="hero-title" className="hero-title-anchor">
              <h1 className="home-hero-main-title">
                <span className="hero-line-prefix">{prefix}</span>
                <span className="hero-line-accent">{tag1}</span>
                {tag2 && <span className="hero-line-secondary">{tag2}</span>}
              </h1>
            </UIAnchor>

            {/* Subtitle Description */}
            <UIAnchor id="hero-subtitle" className="hero-subtitle-anchor">
              <p className="home-hero-subtitle">
                {subtitle}
              </p>
            </UIAnchor>

            {/* Button Actions with 3D Depth */}
            <UIAnchor id="hero-actions" className="hero-actions-anchor">
              <div className="home-hero-actions">
                <NavLink to={ctaLink} className="btn-primary">
                  <span>{ctaText}</span>
                  <ArrowRight size={16} />
                </NavLink>

                <NavLink to="/en/Service/" className="btn-secondary">
                  <span>Explore Services</span>
                </NavLink>
              </div>
            </UIAnchor>

            {/* Floating Sports Telemetry Badge */}
            <UIAnchor id="hero-telemetry" className="hero-telemetry-anchor">
              <div className="hero-floating-sports-chip">
                <div className="sports-chip-icon">🏆</div>
                <div className="sports-chip-text">
                  <strong>15+ Years</strong>
                  <span>International Athletic Excellence</span>
                </div>
              </div>
            </UIAnchor>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   9. INTERACTIVE HORIZONTAL EDITORIAL PILLARS
   ============================================================================ */
export const InteractiveHorizontalPillars = ({
  title = 'Together for success! Travel and meet like the pros!',
  superTag = '02 / PILLARS',
  items = []
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultItems = [
    {
      num: '01',
      title: 'HOTELS',
      desc: 'We find the right hotels around the globe for the needs of your sports team. Security and facilities tailored for athletes.',
      image: '/assets/images/service_meeting.jpg'
    },
    {
      num: '02',
      title: 'CONFERENCES',
      desc: 'For meetings, conferences and seminars, we find the right venue that suits your athletic participants with attractive event programs.',
      image: '/assets/images/service_teambuilding.png'
    },
    {
      num: '03',
      title: 'INCENTIVES',
      desc: 'Motivating and extraordinary activities to weld national teams and sports executives together for lasting success.',
      image: '/assets/images/service_teamtrips.jpeg'
    }
  ];

  const pillarList = items && items.length > 0 ? items : defaultItems;
  const activeItem = pillarList[activeIndex] || pillarList[0];

  return (
    <section className="editorial-pillars-section">
      <div className="container">
        {/* Section Header */}
        <div className="pillars-header">
          <div className="editorial-tag">{superTag}</div>
          <h2 className="section-main-title">{title}</h2>
        </div>

        {/* Large Active Editorial Showcase */}
        <div className="pillars-main-display">
          <div className="pillars-active-card">
            <div className="pillar-image-container">
              <img
                src={activeItem.image || (activeIndex === 0 ? '/assets/images/service_meeting.jpg' : activeIndex === 1 ? '/assets/images/service_teambuilding.png' : '/assets/images/service_teamtrips.jpeg')}
                alt={activeItem.title}
                className="pillar-display-img"
              />
              <div className="pillar-img-gradient" />
            </div>

            <div className="pillar-active-content">
              <div className="pillar-active-num">{activeItem.num || `0${activeIndex + 1}`}</div>
              <h3 className="pillar-active-title">{activeItem.title}</h3>
              <p className="pillar-active-desc">{activeItem.desc}</p>
              <NavLink to="/en/Service/" className="btn-link-editorial">
                <span>Explore detail</span>
                <ArrowRight size={15} className="arrow-icon" />
              </NavLink>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation / Selector Tabs */}
        <div className="pillars-selector-row">
          {pillarList.map((item, idx) => (
            <button
              key={idx}
              className={`pillar-tab-item ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <div className="pillar-tab-top">
                <span className="pillar-tab-num">{item.num || `0${idx + 1}`}</span>
                <ArrowUpRight size={16} className="pillar-tab-arrow" />
              </div>
              <span className="pillar-tab-title">{item.title}</span>
              <div className="pillar-tab-indicator" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
   10. EDITORIAL DESTINATIONS / HOTELS GALLERY
   ============================================================================ */
export const EditorialDestinationGallery = ({
  title = 'Upcoming Destinations',
  subtitle = 'Global sports hubs and premium hospitality',
  destinations = []
}) => {
  const defaultDestinations = [
    { title: 'Cancun, Mexico', category: 'High-Altitude Training', image: '/assets/images/hotel_cancun.jpg' },
    { title: 'Dubai, UAE', category: 'Executive Sports Conference', image: '/assets/images/hotel_dubai.jpg' },
    { title: 'Beijing, China', category: 'Olympic Legacy Facilities', image: '/assets/images/about_beijing.jpg' },
    { title: 'Johannesburg, SA', category: 'International Athletics', image: '/assets/images/about_johannesburg.jpg' }
  ];

  const list = destinations.length > 0 ? destinations : defaultDestinations;

  return (
    <section className="editorial-destinations-section">
      <div className="container">
        <div className="destinations-header-row">
          <div>
            <div className="editorial-tag">05 / DESTINATIONS</div>
            <h2 className="section-main-title">{title}</h2>
          </div>
          <NavLink to="/en/Hotels-more/" className="btn-secondary">
            <span>All Locations</span>
            <ArrowRight size={14} />
          </NavLink>
        </div>

        {/* Asymmetric Gallery Layout */}
        <div className="destinations-mosaic-grid">
          {list.slice(0, 4).map((dest, idx) => (
            <div 
              key={idx} 
              className={`destination-mosaic-card ${idx === 0 ? 'card-lead' : 'card-standard'}`}
            >
              <div className="dest-image-wrap">
                <img src={dest.image} alt={dest.title} className="dest-img" loading="lazy" />
                <div className="dest-gradient" />
              </div>
              <div className="dest-content">
                <span className="dest-category">{dest.category}</span>
                <h3 className="dest-title">{dest.title}</h3>
                <div className="dest-accent-line" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
   11. CINEMATIC FILM FOOTER
   ============================================================================ */
export const CinematicFilmFooter = () => {
  const { lang } = useLanguage();
  const { settings } = useSite();

  const phoneNumber = settings?.phone || '+49 2241 343320';
  const emailAddress = settings?.email || 'contact@sportsandmice.com';

  return (
    <footer className="site-footer-editorial">
      <div className="container">
        {/* Huge Decorative Wordmark */}
        <div className="footer-top-brand-row">
          <div className="footer-huge-wordmark">SPORTS & MICE</div>
        </div>

        {/* Main Columns */}
        <div className="footer-main-grid">
          {/* Col 1: About */}
          <div className="footer-col-about">
            <img src="/assets/images/logo.png" alt="K-Consulting Logo" className="brand-logo-img" />
            <p className="footer-company-desc">
              Tailor-made sports travel, high-performance training camps, international MICE conferences and executive incentives worldwide.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <div className="footer-col-heading">Navigation</div>
            <ul className="footer-nav-list">
              <li><NavLink to={lang === 'de' ? '/de/' : '/en/'}>{lang === 'de' ? 'Startseite' : 'Home'}</NavLink></li>
              <li><NavLink to={lang === 'de' ? '/de/Dienstleistung/' : '/en/Service/'}>{lang === 'de' ? 'Dienstleistung' : 'Service'}</NavLink></li>
              <li><NavLink to={lang === 'de' ? '/de/Über-uns/' : '/en/About-us/'}>{lang === 'de' ? 'Über uns' : 'About us'}</NavLink></li>
              <li><NavLink to={lang === 'de' ? '/de/Hotels-mehr/' : '/en/Hotels-more/'}>{lang === 'de' ? 'Hotels & mehr' : 'Hotels & more'}</NavLink></li>
              <li><NavLink to={lang === 'de' ? '/de/Kontakt/' : '/en/Contact/'}>{lang === 'de' ? 'Kontakt' : 'Contact'}</NavLink></li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <div className="footer-col-heading">Specialization</div>
            <ul className="footer-nav-list">
              <li><NavLink to="/en/Service/">Hotels & Logistics</NavLink></li>
              <li><NavLink to="/en/Service/">Sports Conferences</NavLink></li>
              <li><NavLink to="/en/Service/">Executive Incentives</NavLink></li>
              <li><NavLink to="/en/Service/">Team Building</NavLink></li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <div className="footer-col-heading">Direct Contact</div>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <Phone size={16} style={{ color: 'var(--blue)', flexShrink: 0, marginTop: 3 }} />
                <a href={`tel:${phoneNumber.replace(/\s+/g, '')}`}>{phoneNumber}</a>
              </div>
              <div className="footer-contact-item">
                <Mail size={16} style={{ color: 'var(--blue)', flexShrink: 0, marginTop: 3 }} />
                <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div className="footer-divider-line" />

        {/* Bottom copyright & legal */}
        <div className="footer-bottom-bar">
          <div>© {new Date().getFullYear()} Sports & MICE (K-Consulting). All rights reserved.</div>
          <div className="footer-bottom-links">
            <NavLink to="/Impressum-Datenschutzverordnung/">Impressum & Datenschutz</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ============================================================================
   12. COMPATIBILITY EXPORTS FOR SYSTEM SECTIONS
   ============================================================================ */
export const ParallaxImage = ({ src, alt = '', aspectRatio = '16 / 9', className = '' }) => (
  <div className={`parallax-image-wrapper ${className}`} style={{ aspectRatio, overflow: 'hidden', position: 'relative', borderRadius: 'var(--radius-media)' }}>
    <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
  </div>
);

export const TextReveal = ({ children, className = '' }) => (
  <span className={`text-reveal ${className}`}>{children}</span>
);

export const MagneticButton = ({ children, className = '', ...props }) => (
  <button className={`magnetic-btn ${className}`} {...props}>{children}</button>
);

export const HorizontalImageScrollGallery = ({ title, items = [] }) => (
  <EditorialDestinationGallery title={title} destinations={items} />
);

export const FullWidthAtmosphericBreak = ({ image = '/assets/images/service_cta_bg.jpg', title, subtitle }) => (
  <div className="about-full-photo-break">
    <img src={image} alt="Atmospheric break" />
    <div className="about-photo-gradient" />
  </div>
);

export const InteractiveEditorialRows = (props) => (
  <InteractiveHorizontalPillars {...props} />
);

export const PinnedEditorialScene = ({ title, subtitle, paragraphs = [], image }) => (
  <div className="container" style={{ padding: '80px 0' }}>
    <RevealOnScroll>
      <div className="statement-12-grid">
        <div className="statement-left">
          {subtitle && <div className="editorial-tag">{subtitle}</div>}
          <h2 className="section-main-title">{title}</h2>
        </div>
        <div className="statement-right">
          {paragraphs.map((p, i) => (
            <p key={i} className="statement-paragraph">{p}</p>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  </div>
);
