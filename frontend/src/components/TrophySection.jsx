import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Trophy, Award, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import { handleMagnetMove, handleMagnetLeave } from '../utils/magneticButton';
import '../styles/trophy-section.css';

const TrophySection = ({ title, subtitle }) => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const trophyRotateY = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const trophyScale = useTransform(scrollYProgress, [0.1, 0.5], [0.85, 1.05]);

  return (
    <section ref={sectionRef} className="trophy-championship-section">
      <ParticleBackground particleCount={20} color="#f87171" />
      
      <div className="trophy-ambient-spotlight" />

      <div className="trophy-container">
        <div className="trophy-content-wrapper">
          
          {/* Badge */}
          <motion.div 
            className="trophy-championship-badge"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Trophy size={16} className="text-amber" />
            <span>EXCELLENCE IN SPORTS LOGISTICS</span>
          </motion.div>

          {/* Title */}
          <motion.h2
            className="trophy-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            TRUSTED BY <span className="text-gold-gradient">HIGH-PERFORMANCE SPORT</span>
          </motion.h2>

          <p className="trophy-description">
            {subtitle || 'High-performance travel, hand-vetted team hotels, and tailor-made sports event logistics for national teams and federations worldwide.'}
          </p>

          <div className="trophy-highlights-grid">
            <div className="trophy-highlight-item">
              <ShieldCheck size={20} className="text-gold" />
              <span>Hand-Vetted Athlete Hotels</span>
            </div>
            <div className="trophy-highlight-item">
              <Flame size={20} className="text-gold" />
              <span>Match Proximity & Privacy</span>
            </div>
            <div className="trophy-highlight-item">
              <Award size={20} className="text-gold" />
              <span>100% Tailor-Made Logistics</span>
            </div>
          </div>

          <div className="trophy-cta-wrap">
            <NavLink to="/en/Contact/" className="btn-spatial-gold btn-magnetic" onMouseMove={handleMagnetMove} onMouseLeave={handleMagnetLeave}>
              <span>Request a Consultation</span>
              <ArrowRight size={18} />
            </NavLink>
          </div>

        </div>

        {/* 3D Trophy Showcase Container */}
        <div className="trophy-3d-showcase">
          <motion.div 
            className="trophy-image-wrapper"
            style={{
              rotateY: trophyRotateY,
              scale: trophyScale
            }}
          >
            <img 
              src="/assets/sports/3d_trophy.svg" 
              alt="Golden Championship Trophy" 
              className="trophy-3d-img"
            />
            <div className="trophy-pedestal-shadow" />
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default TrophySection;
