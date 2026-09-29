import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { useEditor } from '../context/EditorContext';
import { Menu, X, Sparkles, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/header.css';

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const { cmsConfig } = useSite();
  const { editorMode, isPreviewMode, handleEditorClick, selectedElement } = useEditor();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isEditing = editorMode && !isPreviewMode;

  const headerSettings = cmsConfig?.header || {};
  const logoUrl = headerSettings.logo_url || '/assets/images/logo.png';
  const brandTitle = headerSettings.brand_title || 'Sports & MICE';

  // Dynamic Navigation Items from CMS
  const rawNavItems = headerSettings.nav_items && headerSettings.nav_items.length > 0 
    ? headerSettings.nav_items.filter(item => item.enabled !== false)
    : [
      { id: 'nav_home', name_en: t.nav.home, name_de: t.nav.home, path: '/' },
      { id: 'nav_service', name_en: t.nav.service, name_de: t.nav.service, path: '/en/Service/' },
      { id: 'nav_about', name_en: t.nav.aboutUs, name_de: t.nav.aboutUs, path: '/en/About-us/' },
      { id: 'nav_hotels', name_en: t.nav.hotelsMore, name_de: t.nav.hotelsMore, path: '/en/Hotels-more/' },
      { id: 'nav_contact', name_en: t.nav.contact, name_de: t.nav.contact, path: '/en/Contact/' }
    ];

  // Map to current language & process children/submenus
  const navItems = rawNavItems.map(item => ({
    ...item,
    name: lang === 'de' ? (item.name_de || item.name_en) : (item.name_en || item.name_de),
    path: item.path,
    children: (item.children || item.sub_items || []).filter(c => c.enabled !== false).map(child => ({
      ...child,
      name: lang === 'de' ? (child.name_de || child.name_en) : (child.name_en || child.name_de),
      path: child.path
    }))
  }));

  const [activeDropdown, setActiveDropdown] = useState(null);

  // Track scroll for navbar elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change & lock body scroll when open
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    setDropdownOpen(false);
  };

  const isPathActive = (path) => {
    if (!path) return false;
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    const currentClean = location.pathname.replace(/^\/+|\/+$/g, '');
    
    if (cleanPath === '' || path === '/') {
      return currentClean === '' || currentClean === 'en';
    }
    return currentClean === cleanPath || 
           currentClean.startsWith(cleanPath + '/') ||
           (cleanPath.includes('Service') && currentClean.includes('Dienstleistung')) || 
           (cleanPath.includes('About') && currentClean.includes('Über-uns')) || 
           (cleanPath.includes('Hotels') && currentClean.includes('Hotels-mehr')) || 
           (cleanPath.includes('Contact') && currentClean.includes('Kontakt'));
  };

  return (
    <header className={`site-header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Brand Logo & Title in Left Corner */}
        <div className="header-brand">
          <NavLink 
            to={isEditing ? '#' : '/'} 
            className="brand-link"
            onClick={(e) => {
              if (isEditing) {
                handleEditorClick(e, {
                  type: 'header_brand',
                  brand_title: brandTitle,
                  logo_url: logoUrl
                });
              }
            }}
          >
            <motion.div 
              className="logo-wrapper"
              whileHover={{ scale: 1.05, rotate: [-1, 1, 0] }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <img 
                src={logoUrl} 
                alt="K-Consulting Logo" 
                className="brand-logo"
              />
            </motion.div>
            <motion.span 
              className="brand-title"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {brandTitle}
            </motion.span>
          </NavLink>
        </div>

        {/* Desktop Navigation with Animated Indicators & Submenus */}
        <nav className="desktop-nav" onMouseLeave={() => { setHoveredIndex(null); setActiveDropdown(null); }}>
          <ul className="nav-list">
            {navItems.map((item, index) => {
              const hasSubmenu = item.children && item.children.length > 0;
              const isActive = isPathActive(item.path) || (hasSubmenu && item.children.some(c => isPathActive(c.path)));
              const isSubmenuOpen = activeDropdown === (item.id || index);
              const isItemSelected = isEditing && selectedElement?.type === 'navbar_item' && selectedElement?.navId === item.id;

              return (
                <li 
                  key={item.path || item.id || index} 
                  className={`nav-item ${hasSubmenu ? 'nav-item-dropdown' : ''}`}
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    if (hasSubmenu) setActiveDropdown(item.id || index);
                  }}
                  onMouseLeave={() => {
                    if (hasSubmenu) setActiveDropdown(null);
                  }}
                >
                  <NavLink
                    to={isEditing ? '#' : item.path}
                    className={`nav-link ${isActive ? 'active' : ''} ${hasSubmenu ? 'nav-dropdown-trigger' : ''} ${isItemSelected ? 'builder-element-selected' : ''}`}
                    end={item.path === '/'}
                    onClick={(e) => {
                      if (isEditing) {
                        handleEditorClick(e, {
                          type: 'navbar_item',
                          navId: item.id,
                          item
                        });
                      }
                    }}
                  >
                    <motion.span
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="nav-text-span"
                    >
                      {item.name}
                    </motion.span>

                    {hasSubmenu && (
                      <span className="nav-submenu-arrow" style={{ fontSize: '10px', marginLeft: '4px', opacity: 0.7 }}>
                        &#9660;
                      </span>
                    )}

                    {/* Animated Active Pill Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="active-pill-glow"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Hover Glow Highlight */}
                    {hoveredIndex === index && !isActive && (
                      <motion.div
                        layoutId="hoverNavIndicator"
                        className="hover-pill-backdrop"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                  </NavLink>

                  {/* Desktop Dropdown Submenu */}
                  <AnimatePresence>
                    {hasSubmenu && isSubmenuOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="desktop-submenu"
                      >
                        {item.children.map((child, cIdx) => (
                          <li key={child.path || cIdx} className="submenu-item">
                            <NavLink
                              to={isEditing ? '#' : child.path}
                              className={`submenu-link ${isPathActive(child.path) ? 'active' : ''}`}
                              onClick={(e) => {
                                if (isEditing) {
                                  handleEditorClick(e, {
                                    type: 'navbar_item',
                                    navId: child.id,
                                    item: child
                                  });
                                }
                              }}
                            >
                              {child.name}
                            </NavLink>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right tools: Language Selector */}
        <div className="header-right-tools">
          <div className="language-selector-wrapper" ref={dropdownRef}>
            <motion.div 
              className={`lang-combobox ${dropdownOpen ? 'combobox-open' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              whileHover={{ scale: 1.03, borderColor: '#ff0000' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Globe size={15} className="lang-globe-icon" />
              <input 
                type="text" 
                readOnly 
                value={lang === 'de' ? 'Deutsch' : 'English'} 
                className="lang-input"
              />
              <button type="button" className="lang-dropdown-btn">
                <motion.span 
                  className="caret-arrow"
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  &#9660;
                </motion.span>
              </button>
            </motion.div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul 
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="lang-dropdown-menu"
                >
                  <motion.li 
                    whileHover={{ x: 4, backgroundColor: '#fff0f0' }}
                    className={lang === 'de' ? 'active-lang' : ''}
                    onClick={() => handleLanguageChange('de')}
                  >
                    <span>🇩🇪</span> Deutsch
                  </motion.li>
                  <motion.li 
                    whileHover={{ x: 4, backgroundColor: '#fff0f0' }}
                    className={lang === 'en' ? 'active-lang' : ''}
                    onClick={() => handleLanguageChange('en')}
                  >
                    <span>🇬🇧</span> English
                  </motion.li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </motion.button>
      </div>

      {/* Animated subtle bottom edge line on scroll */}
      <div className="header-bottom-line" />

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="mobile-nav-drawer"
          >
            <ul className="mobile-nav-list">
              {navItems.map((item, index) => {
                const hasSubmenu = item.children && item.children.length > 0;
                const isMobileActive = isPathActive(item.path);

                return (
                  <motion.li 
                    key={item.path || item.id || index} 
                    className="mobile-nav-item"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <NavLink
                      to={item.path}
                      className={`mobile-nav-link ${isMobileActive ? 'active' : ''}`}
                      end={item.path === '/'}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </NavLink>

                    {hasSubmenu && (
                      <ul className="mobile-submenu-list">
                        {item.children.map((child, cIdx) => (
                          <li key={child.path || cIdx}>
                            <NavLink
                              to={child.path}
                              className={`mobile-submenu-link ${isPathActive(child.path) ? 'active' : ''}`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              ↳ {child.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                );
              })}
            </ul>

            {/* Mobile Language Switcher */}
            <div className="mobile-lang-switcher">
              <span className="mobile-lang-label">
                <Globe size={14} style={{ marginRight: '6px' }} /> Language:
              </span>
              <div className="mobile-lang-buttons">
                <button 
                  type="button"
                  className={`mobile-lang-btn ${lang === 'de' ? 'active' : ''}`}
                  onClick={() => { handleLanguageChange('de'); setMobileMenuOpen(false); }}
                >
                  🇩🇪 Deutsch
                </button>
                <button 
                  type="button"
                  className={`mobile-lang-btn ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => { handleLanguageChange('en'); setMobileMenuOpen(false); }}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
