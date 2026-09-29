import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { PageTransition } from '../components/AnimatedSection';
import DynamicSectionRenderer from '../components/DynamicSectionRenderer';
import '../styles/service.css';

const Service = () => {
  const { cmsConfig } = useSite();
  const serviceSections = cmsConfig?.sections?.service || [];
  const sortedSections = [...serviceSections].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <PageTransition>
      <div className="service-page">
        {sortedSections.map(section => (
          <DynamicSectionRenderer 
            key={section.id} 
            section={section} 
            pageKey="service" 
          />
        ))}
      </div>
    </PageTransition>
  );
};

export default Service;
