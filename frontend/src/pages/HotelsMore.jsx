import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { PageTransition } from '../components/AnimatedSection';
import DynamicSectionRenderer from '../components/DynamicSectionRenderer';
import '../styles/hotels.css';

const HotelsMore = () => {
  const { cmsConfig } = useSite();
  const hotelsSections = cmsConfig?.sections?.hotels || [];
  const sortedSections = [...hotelsSections].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <PageTransition>
      <div className="hotels-page">
        {sortedSections.map(section => (
          <DynamicSectionRenderer 
            key={section.id} 
            section={section} 
            pageKey="hotels" 
          />
        ))}
      </div>
    </PageTransition>
  );
};

export default HotelsMore;
