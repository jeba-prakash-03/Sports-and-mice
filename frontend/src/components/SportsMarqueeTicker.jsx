import React from 'react';
import { Activity, Trophy, Zap, Globe, Flame, Star, Award } from 'lucide-react';
import '../styles/sports-marquee.css';

// Real, verifiable figures only — matching the Home page stats section.
// (An earlier draft of this ticker claimed "UEFA Champions League Hotel
// Partner" and "Official MICE Partner for International Associations",
// which are specific partnership/affiliation claims this company doesn't
// actually hold — removed rather than published as fact.)
const marqueeItems = [
  { icon: Trophy, label: '15+ YEARS IN HIGH-PERFORMANCE SPORT' },
  { icon: Flame, label: '500+ TAILOR-MADE SPORTS & MICE EVENTS' },
  { icon: Zap, label: 'HANDS-ON HOTEL & VENUE SCOUTING' },
  { icon: Activity, label: 'ATHLETE-FOCUSED TEAM LOGISTICS' },
  { icon: Award, label: '100% TAILOR-MADE TO EACH DELEGATION' },
  { icon: Globe, label: '35+ GLOBAL DESTINATIONS' }
];

const SportsMarqueeTicker = () => {
  return (
    <div className="sports-marquee-wrapper">
      <div className="sports-marquee-track">
        {[...marqueeItems, ...marqueeItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="marquee-item">
              <Icon size={18} className="marquee-icon" />
              <span className="marquee-label">{item.label}</span>
              <span className="marquee-bullet">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SportsMarqueeTicker;
