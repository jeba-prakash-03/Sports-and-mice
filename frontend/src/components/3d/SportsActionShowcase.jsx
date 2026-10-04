import React from 'react';
import { NavLink } from 'react-router-dom';
import { Trophy, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { DepthCard3D } from '../MotionSuite';

/**
 * 2.5D SPORTS ACTION PHOTOGRAPHIC SHOWCASE
 * High-End Sports Agency Editorial Composition:
 * Real sports photography with multi-layer depth, kinetic badge overlays,
 * and zero geometric dummy primitives.
 */
export const SportsActionShowcase = ({ className = '', lang = 'en' }) => {
  return (
    <div className={`sports-action-showcase-wrap ${className}`}>
      <div className="sports-action-grid">
        {/* Card 1: Football / Stadium Logistics */}
        <DepthCard3D className="action-photo-card card-primary" maxTilt={3.5}>
          <div className="action-photo-img-box">
            <img
              src="/assets/images/home_sec2_bg.jpg"
              alt="International Sports Stadium"
              className="action-photo-img"
              loading="lazy"
            />
            <div className="action-photo-scrim" />
            <div className="action-floating-tag">
              <Activity size={13} className="action-tag-icon" />
              <span>{lang === 'de' ? 'SPITZENSPORT LOGISTIK' : 'ELITE ATHLETIC LOGISTICS'}</span>
            </div>
          </div>
          <div className="action-photo-content">
            <div className="action-index-num">01 / STADIUMS & VENUES</div>
            <h3 className="action-card-title">
              {lang === 'de' ? 'Maßgeschneiderte Delegationsreisen' : 'Tailored Delegation Travel'}
            </h3>
            <p className="action-card-desc">
              {lang === 'de'
                ? 'Geprüfte Athletenhotels mit kurzen Transferwegen zu Wettkampfstätten und optimalen Regenerationsbedingungen.'
                : 'Vetted athlete-grade accommodations with direct routing to competition venues and optimal recovery facilities.'}
            </p>
          </div>
        </DepthCard3D>

        {/* Card 2: Field Hockey & Championship Heritage */}
        <DepthCard3D className="action-photo-card card-secondary" maxTilt={3.5}>
          <div className="action-photo-img-box">
            <img
              src="/assets/images/about_hockey_referee.jpeg"
              alt="Field Hockey International Championship"
              className="action-photo-img"
              loading="lazy"
            />
            <div className="action-photo-scrim" />
            <div className="action-floating-tag">
              <Trophy size={13} className="action-tag-icon" />
              <span>{lang === 'de' ? '15+ JAHRE ERFAHRUNG' : '15+ YEARS HERITAGE'}</span>
            </div>
          </div>
          <div className="action-photo-content">
            <div className="action-index-num">02 / INTERNATIONAL HERITAGE</div>
            <h3 className="action-card-title">
              {lang === 'de' ? 'Erfahrung aus dem Weltsport' : 'World-Class Referee Precision'}
            </h3>
            <p className="action-card-desc">
              {lang === 'de'
                ? 'Internationale Schiedsrichter-Expertise seit 2000 für schnelle Entscheidungen unter höchstem sportlichem Druck.'
                : 'International referee mastery since 2000 for rapid, decisive leadership under elite sporting pressure.'}
            </p>
          </div>
        </DepthCard3D>
      </div>
    </div>
  );
};
