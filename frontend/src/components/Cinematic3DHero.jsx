import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useEditor } from '../context/EditorContext';
import { Sparkles, Trophy, ArrowRight, Globe2, Users } from 'lucide-react';
import '../styles/cinematic-hero.css';

const MotionNavLink = motion(NavLink);

const Cinematic3DHero = ({ section = {}, pageKey = 'home' }) => {
  const { lang } = useLanguage();
  const { editorMode, isPreviewMode, handleEditorClick, selectedElement } = useEditor();
  const isEditing = editorMode && !isPreviewMode;
  const isSelected = isEditing && selectedElement?.id === section?.id;
  const prefersReducedMotion = useReducedMotion();

  const heroRef = useRef(null);

  // Dynamic language strings with fallbacks
  const badgeText = lang === 'de'
    ? (section.badge_text_de || 'Sports & MICE')
    : (section.badge_text_en || section.badge_text || 'Sports & MICE');

  const trustedText = lang === 'de'
    ? (section.trusted_text_de || 'We\'re trusted by teams worldwide')
    : (section.trusted_text_en || section.trusted_text || 'We\'re trusted by teams worldwide');

  const rawTitle = lang === 'de' 
    ? (section.heading_prefix_de || section.title_de || 'THIS TIME IT\'S\nALL ABOUT\nTHE GOALS') 
    : (section.heading_prefix_en || section.title_en || 'THIS TIME IT\'S\nALL ABOUT\nTHE GOALS');

  const subtitle = lang === 'de' 
    ? (section.subtitle_de || 'Elevate your sports events and MICE experiences with seamless planning, pro athlete engagement, and immersive tournaments — all in one platform.') 
    : (section.subtitle_en || 'Elevate your sports events and MICE experiences with seamless planning, pro athlete engagement, and immersive tournaments — all in one platform.');

  const heroImage = section.hero_image || section.image_url || section.bg_image || '/assets/images/sports_athletes_hero.png';

  const captionText = lang === 'de'
    ? (section.caption_text_de || 'Soccer • Team Training • Events')
    : (section.caption_text_en || section.caption_text || 'Soccer • Team Training • Events');

  const ctaText = lang === 'de' 
    ? (section.cta_button_text_de || 'Get in Touch') 
    : (section.cta_button_text_en || section.cta_button_text || 'Get in Touch');

  const ctaLink = section.cta_button_link || '/en/Contact/';

  const stat1Text = lang === 'de' ? (section.stat1_text_de || '500+ Teams') : (section.stat1_text_en || section.stat1_text || '500+ Teams');
  const stat2Text = lang === 'de' ? (section.stat2_text_de || '30+ Countries') : (section.stat2_text_en || section.stat2_text || '30+ Countries');
  const stat3Text = lang === 'de' ? (section.stat3_text_de || '4.9/5 Rating') : (section.stat3_text_en || section.stat3_text || '4.9/5 Rating');

  // Format title for line breaks if contains \n
  const formattedTitle = rawTitle.includes('\n')
    ? rawTitle.split('\n').map((line, idx) => (
        <React.Fragment key={idx}>
          {line}
          {idx < rawTitle.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))
    : rawTitle;

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
      {/* Studio Lavender Background with Soft Gradient */}
      <div className="hero-studio-lavender-bg" />

      {/* Floating Translucent 3D Liquid Glass Orbs (Bubbles) */}
      <div className="liquid-orbs-container">
        <div className="liquid-orb orb-1" />
        <div className="liquid-orb orb-2" />
        <div className="liquid-orb orb-3" />
        <div className="liquid-orb orb-4" />
        <div className="liquid-orb orb-5" />
      </div>

      {/* Master Liquid Glass Enclosure Container */}
      <div className="hero-content-wrapper">
        <motion.div 
          className="master-liquid-glass-card"
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top-Left Badge inside Master Glass Card */}
          <div 
            className="master-card-top-badge"
            onClick={(e) => {
              if (isEditing) {
                e.stopPropagation();
                handleEditorClick(e, { type: 'text', sectionId: section.id, fieldKey: lang === 'de' ? 'badge_text_de' : 'badge_text_en' });
              }
            }}
            style={{ cursor: isEditing ? 'pointer' : 'default' }}
          >
            <div className="badge-glass-pill">
              <Trophy size={14} className="badge-icon" />
              <span>{badgeText}</span>
            </div>
          </div>

          {/* Interior Two-Column Grid */}
          <div className="master-glass-grid">

            {/* LEFT: Inner Liquid Glass Frame holding Athletes Image */}
            <div className="master-glass-left-col">
              <motion.div 
                className="inner-athletes-glass-frame hyper-liquid-glass"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                onClick={(e) => {
                  if (isEditing) {
                    e.stopPropagation();
                    handleEditorClick(e, { type: 'image', sectionId: section.id, fieldKey: 'hero_image', src: heroImage });
                  }
                }}
                style={{ cursor: isEditing ? 'pointer' : 'default' }}
              >
                {/* Hyper Liquid Glass Glare & Specular Reflection Layers */}
                <div className="inner-glass-liquid-sheen" />
                <div className="inner-glass-specular-reflection" />
                <div className="inner-glass-liquid-rim" />

                <div className="athletes-img-container">
                  <img 
                    src={heroImage} 
                    alt="Soccer Athletes" 
                    className="athletes-cutout-img"
                  />

                  {/* Subtext overlay at bottom of photo */}
                  <div 
                    className="athletes-caption-overlay"
                    onClick={(e) => {
                      if (isEditing) {
                        e.stopPropagation();
                        handleEditorClick(e, { type: 'text', sectionId: section.id, fieldKey: lang === 'de' ? 'caption_text_de' : 'caption_text_en' });
                      }
                    }}
                  >
                    <span>{captionText}</span>
                  </div>

                  {/* 3D Spinning Soccer Ball landing on Girl's Hand */}
                  <motion.div 
                    className="ball-hand-target-container"
                    initial={{ opacity: 1, x: 1350, y: -380, scale: 3.2, rotate: -360 }}
                    animate={{ 
                      opacity: 1, 
                      x: [1350, -35, 18, -6, 0],
                      y: [-380, 35, -24, 8, 0],
                      scale: [3.2, 0.75, 1.15, 0.95, 1],
                      rotate: [-360, -90, 90, 270, 360]
                    }}
                    transition={{
                      duration: 3.5,
                      delay: 0,
                      times: [0, 0.42, 0.68, 0.88, 1],
                      ease: [0.25, 1, 0.5, 1]
                    }}
                  >
                    <div className="ball-mask-backdrop" />
                    <motion.img 
                      src="/assets/sports/3d_soccer_ball.svg" 
                      alt="3D Soccer Ball" 
                      className="spinning-3d-ball-hand"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Typography, Golden Capsule CTA & Stats Badges */}
            <div className="master-glass-right-col">

              {/* Trusted Pill */}
              <motion.div 
                className="trusted-teams-pill"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                onClick={(e) => {
                  if (isEditing) {
                    e.stopPropagation();
                    handleEditorClick(e, { type: 'text', sectionId: section.id, fieldKey: lang === 'de' ? 'trusted_text_de' : 'trusted_text_en' });
                  }
                }}
                style={{ cursor: isEditing ? 'pointer' : 'default' }}
              >
                <span className="wave-icon">≈</span>
                <span>{trustedText}</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                className="hero-master-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                onClick={(e) => {
                  if (isEditing) {
                    e.stopPropagation();
                    handleEditorClick(e, { type: 'heading', sectionId: section.id, fieldKey: lang === 'de' ? 'heading_prefix_de' : 'heading_prefix_en' });
                  }
                }}
                style={{ cursor: isEditing ? 'pointer' : 'default' }}
              >
                {formattedTitle}
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                className="hero-master-subtitle"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                onClick={(e) => {
                  if (isEditing) {
                    e.stopPropagation();
                    handleEditorClick(e, { type: 'subtitle', sectionId: section.id, fieldKey: lang === 'de' ? 'subtitle_de' : 'subtitle_en' });
                  }
                }}
                style={{ cursor: isEditing ? 'pointer' : 'default' }}
              >
                {subtitle}
              </motion.p>

              {/* Golden Capsule CTA Button */}
              <motion.div 
                className="hero-cta-wrapper"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                onClick={(e) => {
                  if (isEditing) {
                    e.stopPropagation();
                    handleEditorClick(e, { type: 'button', sectionId: section.id, fieldPrefix: 'cta_button', text_en: ctaText, link: ctaLink });
                  }
                }}
              >
                <MotionNavLink 
                  to={isEditing ? '#' : ctaLink} 
                  className="btn-liquid-gold-capsule"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={isEditing ? (e) => e.preventDefault() : undefined}
                >
                  <span>{ctaText}</span>
                  <ArrowRight size={18} className="btn-arrow-icon" />
                </MotionNavLink>
              </motion.div>

              {/* Bottom Stats Pills */}
              <motion.div 
                className="hero-stats-pills-row"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div 
                  className="stat-glass-pill"
                  onClick={(e) => {
                    if (isEditing) {
                      e.stopPropagation();
                      handleEditorClick(e, { type: 'text', sectionId: section.id, fieldKey: lang === 'de' ? 'stat1_text_de' : 'stat1_text_en' });
                    }
                  }}
                  style={{ cursor: isEditing ? 'pointer' : 'default' }}
                >
                  <Users size={14} className="stat-icon" />
                  <span>{stat1Text}</span>
                </div>
                <div 
                  className="stat-glass-pill"
                  onClick={(e) => {
                    if (isEditing) {
                      e.stopPropagation();
                      handleEditorClick(e, { type: 'text', sectionId: section.id, fieldKey: lang === 'de' ? 'stat2_text_de' : 'stat2_text_en' });
                    }
                  }}
                  style={{ cursor: isEditing ? 'pointer' : 'default' }}
                >
                  <Globe2 size={14} className="stat-icon" />
                  <span>{stat2Text}</span>
                </div>
                <div 
                  className="stat-glass-pill"
                  onClick={(e) => {
                    if (isEditing) {
                      e.stopPropagation();
                      handleEditorClick(e, { type: 'text', sectionId: section.id, fieldKey: lang === 'de' ? 'stat3_text_de' : 'stat3_text_en' });
                    }
                  }}
                  style={{ cursor: isEditing ? 'pointer' : 'default' }}
                >
                  <Sparkles size={14} className="stat-icon" />
                  <span>{stat3Text}</span>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Cinematic3DHero;
