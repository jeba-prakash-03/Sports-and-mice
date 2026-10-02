import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { Trophy, Users, Activity, ShieldCheck, Award, MapPin, ArrowUpRight } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import '../styles/bento-sports.css';

const BentoSportsSection = ({ section }) => {
  const { lang, t } = useLanguage();

  // Real hotel-inspection tours and the real founder profile, sourced from
  // the CMS (same data the Hotels and About pages render) — this card grid
  // used to display a fabricated "FC Barcelona vs Real Madrid" live score
  // and a real footballer's name with invented stats, which had nothing to
  // do with this business and falsely implied results/affiliations that
  // don't exist. Replaced with the company's own real content.
  const { cmsConfig } = useSite();
  const featuredTour = (cmsConfig?.gallery || [])[0] || {
    title: 'Hotel Fairmont Mayakoba "Riviera Maya"',
    location: 'Cancún, Mexico',
    image: '/assets/images/hotel_cancun.jpg'
  };
  const founder = (cmsConfig?.team || [])[0] || {
    name: 'Marc Knuelle',
    designation: 'International Field Hockey Referee since 2000',
    photo: '/assets/images/about_hockey_referee.jpeg'
  };

  return (
    <section className="bento-sports-section">
      <div className="bento-container">
        
        {/* Section Header */}
        <div className="bento-header">
          <motion.div 
            className="bento-badge"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Activity size={15} style={{ color: '#00f0ff' }} />
            <span>SPORTS & MICE DASHBOARD</span>
          </motion.div>

          <motion.h2
            className="bento-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            SPORTS & MICE <span className="title-cyan">LOGISTICS AT A GLANCE</span>
          </motion.h2>

          <p className="bento-subtitle">
            Seamless travel management, elite team hotel sourcing, and venue coordination worldwide.
          </p>
        </div>

        {/* Main Bento Grid Architecture */}
        <div className="bento-grid">
          
          {/* BENTO ITEM 1: Featured Hotel Inspection Tour (Large 2x2 Span) — real data from the Hotels & More gallery */}
          <motion.div
            className="bento-card card-large-match card-featured-tour"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4 }}
            style={{ backgroundImage: `url('${featuredTour.image}')` }}
          >
            <div className="bento-card-header">
              <div className="live-indicator-pill">
                <span className="pulsing-red-dot" />
                <span>FEATURED INSPECTION TOUR</span>
              </div>
            </div>

            <div className="featured-tour-info">
              <h3 className="featured-tour-title">{featuredTour.hotel_name || featuredTour.title}</h3>
              <div className="featured-tour-location">
                <MapPin size={14} />
                <span>{featuredTour.location}</span>
              </div>
            </div>

            <div className="bento-card-footer">
              <div className="venue-info">
                <ShieldCheck size={16} className="text-cyan" />
                <span>On-Site Hotel Inspection</span>
              </div>
              <NavLink to="/en/Hotels-more/" className="btn-bento-link">
                <span>View All Tours</span>
                <ArrowUpRight size={16} />
              </NavLink>
            </div>
          </motion.div>

          {/* BENTO ITEM 2: Trophy & Championship Stats (Medium Span) */}
          <motion.div 
            className="bento-card card-trophy-stats"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -6 }}
          >
            <div className="trophy-spatial-scene">
              <img 
                src="/assets/sports/3d_trophy.svg" 
                alt="Championship Trophy" 
                className="bento-trophy-img" 
              />
            </div>
            <div className="trophy-card-content">
              <div className="stat-counter-wrap">
                <AnimatedCounter target={500} suffix="+" duration={2.5} />
                <span className="stat-label">Tailor-Made Sports & MICE Events</span>
              </div>
              <p className="stat-desc">15+ years of hands-on hotel scouting and team logistics worldwide.</p>
            </div>
          </motion.div>

          {/* BENTO ITEM 3: Fast Stats Counter (Small Span) — same real figures as the Home stats section */}
          <motion.div
            className="bento-card card-fast-stats"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -6 }}
          >
            <div className="mini-stat-item">
              <Users size={24} className="text-cyan" />
              <div>
                <AnimatedCounter target={35} suffix="+" duration={2} />
                <span className="mini-label">Global Destinations</span>
              </div>
            </div>
            <div className="mini-stat-divider" />
            <div className="mini-stat-item">
              <Award size={24} className="text-gold" />
              <div>
                <AnimatedCounter target={100} suffix="%" duration={2} />
                <span className="mini-label">Tailor-Made Logistics</span>
              </div>
            </div>
          </motion.div>

          {/* BENTO ITEM 4: Founder Profile (Medium Span) — the company's real founder, same data as the About page */}
          <motion.div
            className="bento-card card-player-profile"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ y: -6 }}
          >
            <div className="player-avatar-wrapper">
              <img src={founder.photo} alt={founder.name} className="player-img" />
            </div>
            <div className="player-details">
              <span className="player-role">FOUNDER</span>
              <h3 className="player-name">{founder.name}</h3>
              <div className="player-metrics">
                <span>{founder.designation}</span>
              </div>
            </div>
          </motion.div>

          {/* BENTO ITEM 5: Upcoming Sports Category Card */}
          <motion.div 
            className="bento-card card-categories"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ y: -6 }}
          >
            <h4 className="bento-card-title">SPORTS CATEGORIES</h4>
            <div className="categories-pill-list">
              <span className="cat-chip active">⚽ Football</span>
              <span className="cat-chip">🏀 Basketball</span>
              <span className="cat-chip">🏒 Hockey</span>
              <span className="cat-chip">🎾 Tennis</span>
              <span className="cat-chip">🏃 Athletics</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default BentoSportsSection;
