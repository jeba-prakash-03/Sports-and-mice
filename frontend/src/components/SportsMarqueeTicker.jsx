import React from 'react';
import { Compass } from 'lucide-react';
import '../styles/sports-marquee.css';

const SportsMarqueeTicker = ({ 
  badgeText = 'UPCOMING TOURS',
  upcomingText = 'Next: Kenya - Mexico - USA - Brazil - Japan'
}) => {
  const marqueeItems = [
    { label: upcomingText, highlight: true },
    { label: 'HANDS-ON HOTEL & VENUE SCOUTING' },
    { label: 'ATHLETE-FOCUSED TEAM LOGISTICS' },
    { label: '35+ GLOBAL DESTINATIONS' },
    { label: '100% TAILOR-MADE TO EACH DELEGATION' },
    { label: '15+ YEARS IN HIGH-PERFORMANCE SPORT' },
    { label: '500+ TAILOR-MADE SPORTS & MICE EVENTS' }
  ];

  return (
    <div className="sports-marquee-outer-container">
      <div className="sports-marquee-glass-capsule">
        {/* Left Fixed 3D Glass Badge Pill */}
        <div className="marquee-badge-pill">
          <Compass size={16} className="badge-compass-icon" />
          <span>{badgeText}</span>
        </div>

        {/* Right Infinite Marquee Scrolling Track */}
        <div className="marquee-track-wrapper">
          <div className="sports-marquee-track">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
              <div key={idx} className={`marquee-item ${item.highlight ? 'highlight-item' : ''}`}>
                <span className="marquee-label">{item.label}</span>
                <span className="marquee-bullet">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsMarqueeTicker;
