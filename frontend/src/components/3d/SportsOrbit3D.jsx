import React from 'react';
import { SportsActionShowcase } from './SportsActionShowcase';

/**
 * SPORTS ORBIT REPLACEMENT
 * Replaces legacy geometric primitive orbits with the rich 2.5D sports action showcase.
 */
export const SportsOrbit3D = ({ className = '', height, lang = 'en' }) => {
  return <SportsActionShowcase lang={lang} className={className} />;
};

export default SportsOrbit3D;
