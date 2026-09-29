import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { PageTransition } from '../components/AnimatedSection';
import DynamicSectionRenderer from '../components/DynamicSectionRenderer';
import '../styles/about.css';

const AboutUs = () => {
  const { cmsConfig } = useSite();
  const aboutSections = cmsConfig?.sections?.about || [];
  const sortedSections = [...aboutSections].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <PageTransition>
      <div className="about-page">
        {sortedSections.map(section => (
          <DynamicSectionRenderer 
            key={section.id} 
            section={section} 
            pageKey="about" 
          />
        ))}
      </div>
    </PageTransition>
  );
};

export default AboutUs;
