import React from 'react';
import HistoricalSportsCard from './HistoricalSportsCard';
import '../../styles/sports.css';

/**
 * HistoricalSportsSection Component
 * Curated Archival & Historical Sports Moments Gallery
 * Keeps 100% of historical/older sports assets in a dedicated editorial showcase.
 */
export default function HistoricalSportsSection({
  title = "Historical Sports Moments & Athletic Heritage",
  subtitle = "Honoring decades of international competition, refereeing precision, and legendary sporting milestones.",
  className = ""
}) {
  const archives = [
    {
      id: "hist_1",
      src: "/assets/images/about_hockey_referee.jpeg",
      title: "Marc Knuelle — International Field Hockey",
      location: "International Federation Tournaments",
      year: "Est. 2000",
      caption: "Over 15+ years officiating at the highest tier of international championship field hockey.",
      aspectRatio: "4-3"
    },
    {
      id: "hist_2",
      src: "/assets/images/about_havana.jpeg",
      title: "Historic Sports Delegation — Havana",
      location: "Havana, Cuba",
      year: "Classic Tour",
      caption: "International sports team delegation and athlete exchange in the historic sporting capital.",
      aspectRatio: "4-3"
    },
    {
      id: "hist_3",
      src: "/assets/images/about_beijing.jpg",
      title: "Olympic Venue & Delegation Inspection",
      location: "Beijing, China",
      year: "Historic Mission",
      caption: "Site inspection and accommodation logistics for international athletics representatives.",
      aspectRatio: "4-3"
    },
    {
      id: "hist_4",
      src: "/assets/images/about_johannesburg.jpg",
      title: "Global Sports Association Summit",
      location: "Johannesburg, South Africa",
      year: "Continental Meet",
      caption: "Coordinating multi-national sporting federations and team basecamp preparations.",
      aspectRatio: "4-3"
    }
  ];

  return (
    <section className={`sports-system-section ${className}`} style={{ background: 'linear-gradient(180deg, rgba(12,10,8,0.85) 0%, rgba(20,16,12,0.95) 50%, rgba(12,10,8,0.85) 100%)' }}>
      <div className="sports-container">
        {/* Header */}
        <div className="sports-section-header">
          <div className="sports-tag-pill">
            <span className="pill-dot" style={{ backgroundColor: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
            Heritage & Archive
          </div>
          <h2 className="sports-section-title">
            {title}
          </h2>
          <p className="sports-section-desc">
            {subtitle}
          </p>
        </div>

        {/* 12-Column Responsive Grid */}
        <div className="sports-grid-12">
          {archives.map((item, idx) => (
            <div key={item.id} className="col-span-6">
              <HistoricalSportsCard
                src={item.src}
                alt={item.title}
                title={item.title}
                location={item.location}
                year={item.year}
                caption={item.caption}
                aspectRatio={item.aspectRatio}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
