import React, { useRef, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useEditor } from '../context/EditorContext';
import { Sparkles, Trophy, ArrowRight, Shield, Zap, Flame, Globe2, Activity } from 'lucide-react';
import '../styles/cinematic-hero.css';

const Cinematic3DHero = ({ section, pageKey = 'home' }) => {
  const { lang, t } = useLanguage();
  const { editorMode, isPreviewMode, handleEditorClick, selectedElement } = useEditor();
  const isEditing = editorMode && !isPreviewMode;
  const isSelected = isEditing && selectedElement?.id === section?.id;
  const prefersReducedMotion = useReducedMotion();

  const heroRef = useRef(null);

  // Smooth mouse interpolation target & current states
  const mouseRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0
  });

  // State for animated transforms on layers
  const [offsets, setOffsets] = useState({
    bgX: 0, bgY: 0,
    stadiumX: 0, stadiumY: 0,
    athleteX: 0, athleteY: 0,
    ballX: 0, ballY: 0, ballRotX: 0, ballRotY: 0,
    particlesX: 0, particlesY: 0,
    textX: 0, textY: 0
  });

  // Scroll Progress for depth transition storytelling
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const scrollY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const ballScrollRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const athleteScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  // RequestAnimationFrame loop for butter-smooth mouse movement (current += (target - current) * 0.08)
  useEffect(() => {
    if (prefersReducedMotion) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let animId;

    const updateFrame = () => {
      const m = mouseRef.current;
      m.currentX += (m.targetX - m.currentX) * 0.08;
      m.currentY += (m.targetY - m.currentY) * 0.08;

      setOffsets({
        bgX: m.currentX * 12,
        bgY: m.currentY * 12,
        stadiumX: m.currentX * 24,
        stadiumY: m.currentY * 24,
        athleteX: m.currentX * 45,
        athleteY: m.currentY * 45,
        ballX: m.currentX * 70,
        ballY: m.currentY * 70,
        ballRotX: m.currentY * -35,
        ballRotY: m.currentX * 35,
        particlesX: m.currentX * 100,
        particlesY: m.currentY * 100,
        textX: m.currentX * 16,
        textY: m.currentY * 16
      });

      animId = requestAnimationFrame(updateFrame);
    };

    animId = requestAnimationFrame(updateFrame);

    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const container = heroRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    return () => {
      cancelAnimationFrame(animId);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [prefersReducedMotion]);

  // Section fields mapped to current language
  const title = lang === 'de' ? (section.heading_prefix_de || section.heading_prefix_en) : (section.heading_prefix_en || section.heading_prefix_de) || 'SPORTS ASSOCIATIONS &';
  const tag1 = lang === 'de' ? (section.tag1_de || section.tag1_en) : (section.tag1_en || section.tag1_de) || 'Meetings ♢ Incentives';
  const tag2 = lang === 'de' ? (section.tag2_de || section.tag2_en) : (section.tag2_en || section.tag2_de) || 'Conferences ♢ Events';
  const subtitle = lang === 'de' ? (section.subtitle_de || section.subtitle_en) : (section.subtitle_en || section.subtitle_de) || 'Sport needs professional structures when traveling to competitions, team building and conferences worldwide';
  const bgImage = section.bg_image || '/assets/images/home_hero_bg.jpg';
  const ctaText = lang === 'de' ? (section.cta_button_text_de || section.cta_button_text_en) : (section.cta_button_text_en || section.cta_button_text_de) || 'Get Free Consultation';
  const ctaLink = section.cta_button_link || '/en/Contact/';

  return (
    <section 
      ref={heroRef}
      className={`cinematic-hero-section ${isSelected ? 'builder-element-selected' : ''}`}
      onClick={(e) => {
        if (isEditing) {
          handleEditorClick(e, { type: 'section', id: section.id, section });
        }
      }}
    >
      {/* LAYER 1: Deep Stadium / Arena Background */}
      <div 
        className="hero-layer layer-1-stadium"
        style={{
          backgroundImage: `url('${bgImage}')`,
          transform: `translate3d(${offsets.bgX}px, ${offsets.bgY}px, 0) scale(1.08)`
        }}
      />

      {/* LAYER 2: Atmospheric Stadium Spotlights */}
      <div 
        className="hero-layer layer-2-lights"
        style={{
          backgroundImage: `url('/assets/sports/stadium_lights.svg')`,
          transform: `translate3d(${offsets.stadiumX}px, ${offsets.stadiumY}px, 0)`
        }}
      />

      {/* LAYER 3: Dark Atmospheric Fog / Vignette Radial Overlay */}
      <div className="hero-layer layer-3-fog" />

      {/* LAYER 4: Athlete Visual / Parallax Character */}
      <motion.div 
        className="hero-layer layer-4-athlete"
        style={{
          transform: `translate3d(${offsets.athleteX}px, ${offsets.athleteY}px, 0)`,
          scale: athleteScale
        }}
      >
        <div className="athlete-silhouette-glow" />
      </motion.div>

      {/* LAYER 5: Interactive 3D Rotating Sports Ball */}
      <div 
        className="hero-layer layer-5-ball-container"
        style={{
          transform: `translate3d(${offsets.ballX}px, ${offsets.ballY}px, 0)`
        }}
      >
        <div className="ball-3d-perspective-wrapper">
          <motion.img 
            src="/assets/sports/3d_soccer_ball.svg" 
            alt="3D Sports Ball" 
            className="ball-3d-image"
            style={{
              transform: `rotateX(${offsets.ballRotX}deg) rotateY(${offsets.ballRotY}deg) rotateZ(0deg)`,
              rotate: ballScrollRotate
            }}
          />
        </div>
      </div>

      {/* LAYER 6: Foreground Motion Particles Overlay */}
      <div 
        className="hero-layer layer-6-particles"
        style={{
          transform: `translate3d(${offsets.particlesX}px, ${offsets.particlesY}px, 0)`
        }}
      >
        <div className="particle-dot p-1" />
        <div className="particle-dot p-2" />
        <div className="particle-dot p-3" />
        <div className="particle-dot p-4" />
        <div className="particle-dot p-5" />
      </div>

      {/* LAYER 7 & 8: Spatial Glass Content & CTAs */}
      <div 
        className="hero-layer layer-7-content"
        style={{
          transform: `translate3d(${offsets.textX}px, ${offsets.textY}px, 0)`
        }}
      >
        <div className="hero-container">
          <div className="hero-main-column">
            
            {/* Tag Badges */}
            <motion.div 
              className="hero-tag-pills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="spatial-pill accent-pill">
                <Flame size={14} className="pill-icon" />
                {tag1}
              </span>
              <span className="spatial-pill glass-pill">
                <Globe2 size={14} className="pill-icon" />
                {tag2}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="title-prefix">{title}</span>
              <span className="title-gradient">SPORTS & MICE EXCELLENCE</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              {subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="hero-cta-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              {section.cta_button_enabled !== false && (
                <NavLink 
                  to={isEditing ? '#' : ctaLink} 
                  className="btn-spatial-primary"
                >
                  <span className="btn-text">{ctaText}</span>
                  <div className="btn-glow-ring" />
                  <ArrowRight size={18} className="btn-arrow" />
                </NavLink>
              )}

              <NavLink 
                to={isEditing ? '#' : '/en/Service/'} 
                className="btn-spatial-glass"
              >
                <Zap size={16} style={{ color: '#00f0ff' }} />
                <span>Explore Services</span>
              </NavLink>
            </motion.div>

          </div>

          {/* Floating Spatial Glass Stat Cards */}
          <motion.div 
            className="hero-glass-floating-cards"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="spatial-glass-card card-match-status">
              <div className="card-status-header">
                <span className="live-pulse-dot" />
                <span className="status-label">GLOBAL REACH</span>
              </div>
              <div className="card-body">
                <span className="card-big-stat">35+</span>
                <span className="card-sub-stat">Global Destinations</span>
              </div>
            </div>

            <div className="spatial-glass-card card-badge">
              <Trophy size={28} className="trophy-card-icon" />
              <div>
                <h4 className="badge-title">15+ Years Experience</h4>
                <p className="badge-desc">100% Tailored Logistics</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Cinematic3DHero;
