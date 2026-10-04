import React, { useState, useEffect, useRef } from 'react';
import SportsImageCard from './SportsImageCard';
import { pageImageCollections } from '../../data/sportsImageManifest';
import '../../styles/sports.css';

/**
 * ContactCinematicReveal Component
 * Page-Specific Visual Treatment for the CONTACT PAGE:
 * - Minimal, high-end editorial consultation card
 * - Smooth entrance on load with subtle parallax & scale transition (1.03 -> 1.0)
 * - Zero intrusive carousels, zero manual controls
 * - Lets the contact form & booking workflow remain the primary hero
 */
export default function ContactCinematicReveal({
  title = "Direct Sports Delegation Consultation",
  subtitle = "Contact our executive sports advisory team for customized team hotel bookings, event logistics, and international tournament planning.",
  className = ""
}) {
  const [item] = useState(() => pageImageCollections.contact[0] || {
    id: 'contact_hero_bg',
    category: 'advisory',
    title: 'Direct Sports Delegation Advisory',
    alt: 'Dedicated personal consultation for sports associations and national teams',
    src: '/assets/images/contact_hero_bg.jpg',
    photographer: 'K-Consulting',
    license: 'All rights reserved'
  });

  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`contact-cinematic-reveal-wrapper ${isRevealed ? 'is-revealed' : ''} ${className}`}
    >
      <div className="contact-reveal-card-container">
        <SportsImageCard
          src={item.src}
          alt={item.alt}
          title={item.title}
          desc={item.alt}
          category={item.category}
          number="01"
          photographer={item.photographer}
          license={item.license}
          aspectRatio="16-10"
          showOverlay={true}
        />
        <div className="contact-reveal-badge">DIRECT ADVISORY</div>
      </div>
    </div>
  );
}
