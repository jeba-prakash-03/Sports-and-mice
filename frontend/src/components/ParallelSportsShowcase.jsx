import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Trophy, MapPin, Sparkles, Shield, ArrowUpRight, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ParticleBackground from './ParticleBackground';
import '../styles/parallel-showcase.css';

const trackA = [
  {
    title: 'Beijing Olympic Arena',
    category: 'STADIUM VENUE',
    location: 'Beijing, China',
    img: '/assets/images/about_beijing.jpg'
  },
  {
    title: 'International Field Hockey Match',
    category: 'CHAMPIONSHIP MATCH',
    location: 'Europe',
    img: '/assets/images/about_hockey_referee.jpeg'
  },
  {
    title: '5-Star Team Accommodation',
    category: 'TEAM HOTEL',
    location: 'Cancun, Mexico',
    img: '/assets/images/hotel_cancun.jpg'
  },
  {
    title: 'National Team Training Camp',
    category: 'TEAM BUILDING',
    location: 'Germany',
    img: '/assets/images/service_teamtrips.jpeg'
  }
];

const trackB = [
  {
    title: 'Luxury Team Resort & Sports Facilities',
    category: 'LUXURY ACCOMMODATION',
    location: 'Dubai, UAE',
    img: '/assets/images/hotel_dubai.jpg'
  },
  {
    title: 'Global Sports Officials Conference',
    category: 'CONFERENCE VENUE',
    location: 'Johannesburg, SA',
    img: '/assets/images/about_johannesburg.jpg'
  },
  {
    title: 'Championship Arena Night Spotlight',
    category: 'MATCH ARENA',
    location: 'Global Tour',
    img: '/assets/images/home_hero_bg.jpg'
  },
  {
    title: 'Executive Team Meeting & Strategy',
    category: 'MICE EVENT',
    location: 'Germany',
    img: '/assets/images/service_meeting.jpg'
  }
];

const ParallelSportsShowcase = () => {
  const { lang } = useLanguage();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  // Parallel opposite scroll movement: Track 1 moves Left, Track 2 moves Right
  const track1X = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const track2X = useTransform(scrollYProgress, [0, 1], ['-25%', '0%']);

  return (
    <section ref={sectionRef} className="parallel-showcase-section">
      <ParticleBackground particleCount={25} color="#93c5fd" />

      {/* Header */}
      <div className="parallel-header">
        <motion.div 
          className="parallel-badge"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Sparkles size={15} style={{ color: '#106cc2' }} />
          <span>PARALLEL SCROLL SHOWCASE • REAL SPORTS VISUALS</span>
        </motion.div>

        <motion.h2 
          className="parallel-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          WORLD-CLASS <span className="text-cyan-gradient">SPORTS & VENUE GALLERY</span>
        </motion.h2>

        <p className="parallel-subtitle">
          Explore high-resolution sports arenas, international match logistics, and 5-star team hotels in parallel motion.
        </p>
      </div>

      {/* Dual Parallel Tracks */}
      <div className="parallel-tracks-wrapper">
        
        {/* TRACK 1 (Moves Left on Scroll) */}
        <div className="track-container">
          <motion.div className="track-inner" style={{ x: track1X }}>
            {[...trackA, ...trackA].map((item, idx) => (
              <div key={idx} className="parallel-card">
                <div className="card-image-wrap">
                  <img src={item.img} alt={item.title} className="parallel-img" />
                  <div className="card-glass-overlay" />
                  <span className="card-category-badge">{item.category}</span>
                </div>
                <div className="card-info">
                  <h3 className="card-title">{item.title}</h3>
                  <div className="card-location">
                    <MapPin size={14} className="text-cyan" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* TRACK 2 (Moves Right on Scroll in Parallel) */}
        <div className="track-container">
          <motion.div className="track-inner" style={{ x: track2X }}>
            {[...trackB, ...trackB].map((item, idx) => (
              <div key={idx} className="parallel-card">
                <div className="card-image-wrap">
                  <img src={item.img} alt={item.title} className="parallel-img" />
                  <div className="card-glass-overlay" />
                  <span className="card-category-badge category-gold">{item.category}</span>
                </div>
                <div className="card-info">
                  <h3 className="card-title">{item.title}</h3>
                  <div className="card-location">
                    <MapPin size={14} className="text-gold" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default ParallelSportsShowcase;
