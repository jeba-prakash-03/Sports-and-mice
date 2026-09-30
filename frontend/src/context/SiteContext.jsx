import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchPublicSiteConfig } from '../services/api';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [cmsConfig, setCmsConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDraftPreview, setIsDraftPreview] = useState(false);

  // Apply theme tokens to CSS root variables
  const applyThemeTokens = (theme) => {
    if (!theme) return;
    const root = document.documentElement;
    if (theme.primary_color) root.style.setProperty('--primary-red', theme.primary_color);
    if (theme.primary_hover) root.style.setProperty('--primary-red-hover', theme.primary_hover);
    if (theme.secondary_color) root.style.setProperty('--primary-blue', theme.secondary_color);
    if (theme.dark_bg) root.style.setProperty('--dark-bg', theme.dark_bg);
    if (theme.card_bg) root.style.setProperty('--card-bg', theme.card_bg);
    if (theme.card_border) root.style.setProperty('--card-border', theme.card_border);
    if (theme.text_primary) root.style.setProperty('--text-primary', theme.text_primary);
    if (theme.text_secondary) root.style.setProperty('--text-secondary', theme.text_secondary);
    if (theme.font_family) root.style.setProperty('--font-family', theme.font_family);
    if (theme.border_radius) root.style.setProperty('--radius-sm', theme.border_radius);
  };

  const loadSiteConfig = useCallback(async (previewMode = false) => {
    setLoading(true);
    setError(null);
    try {
      const config = await fetchPublicSiteConfig(previewMode);
      if (config && (config.sections || config.pages)) {
        setCmsConfig(config);
        setError(null);
        if (config.theme) {
          applyThemeTokens(config.theme);
        }
      } else {
        throw new Error('Empty or invalid CMS configuration received from backend.');
      }
    } catch (err) {
      console.error('[SiteContext] Error loading CMS site config:', err.message || err);
      setError(err.message || 'Failed to load website configuration from backend API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if preview mode is in URL
    const params = new URLSearchParams(window.location.search);
    const preview = params.get('preview') === 'true';
    setIsDraftPreview(preview);
    loadSiteConfig(preview);
  }, [loadSiteConfig]);

  // Backward-compatible settings & content helpers
  const settings = {
    phone: cmsConfig?.footer?.phone || '+49 2241 343320',
    fax: cmsConfig?.footer?.fax || '+49 2241 344316',
    email: cmsConfig?.footer?.email || 'contact@sportsandmice.com',
    company_name: cmsConfig?.footer?.company_name || 'K-Consulting Sports & MICE',
    address_street: cmsConfig?.footer?.street || 'Fritz-Pullig-Strasse 9',
    address_city: cmsConfig?.footer?.city_country_en || '53757 Sankt Augustin, Germany',
    linkedin_url: cmsConfig?.footer?.social_links?.find(s => s.platform === 'LinkedIn')?.url || 'https://linkedin.com'
  };

  const dynamicContent = {
    home: cmsConfig?.sections?.home?.[0] ? {
      hero_prefix: cmsConfig.sections.home[0].heading_prefix_en,
      hero_tag1: cmsConfig.sections.home[0].tag1_en,
      hero_tag2: cmsConfig.sections.home[0].tag2_en,
      hero_subtitle: cmsConfig.sections.home[0].subtitle_en
    } : {}
  };

  return (
    <SiteContext.Provider value={{
      cmsConfig,
      setCmsConfig,
      loading,
      error,
      isDraftPreview,
      loadSiteConfig,
      settings,
      dynamicContent
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
