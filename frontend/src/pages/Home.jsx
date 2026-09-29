import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { PageTransition } from '../components/AnimatedSection';
import DynamicSectionRenderer from '../components/DynamicSectionRenderer';
import '../styles/home.css';

const Home = () => {
  const { cmsConfig } = useSite();
  const homeSections = cmsConfig?.sections?.home || [];

  // Sort sections by order
  const sortedSections = [...homeSections].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <PageTransition>
      <div className="home-page">
        {sortedSections.map(section => (
          <DynamicSectionRenderer 
            key={section.id} 
            section={section} 
            pageKey="home" 
          />
        ))}
      </div>
    </PageTransition>
  );
};

export default Home;
