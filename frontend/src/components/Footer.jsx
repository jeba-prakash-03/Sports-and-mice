import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { Phone, MapPin, Linkedin, Youtube, Instagram, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/footer.css';

const Footer = () => {
  const { lang, t } = useLanguage();
  const { cmsConfig, settings } = useSite();

  const footerConfig = cmsConfig?.footer || {};

  const phoneNumber = footerConfig.phone || settings.phone || t.footer.phoneNumber;
  const faxNumber = footerConfig.fax || settings.fax || t.footer.faxNumber;
  const emailAddress = footerConfig.email || settings.email || 'contact@sportsandmice.com';
  const streetAddress = footerConfig.street || settings.address_street || t.footer.street;
  const cityCountry = lang === 'de' 
    ? (footerConfig.city_country_de || "53757 Sankt Augustin\nDeutschland")
    : (footerConfig.city_country_en || "53757 Sankt Augustin\nGermany");
  const copyrightText = footerConfig.copyright_text || '© 2026 www.Sportsandmice.Com';
  const socialLinks = footerConfig.social_links?.filter(s => s.enabled !== false) || [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/marc-knuelle-427252161/' }
  ];

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Centered Heading */}
        <div className="footer-heading-wrap">
          <h3 className="footer-title">{t.footer.contactUsTitle}</h3>
        </div>

        {/* Footer 4-Column Grid */}
        <div className="footer-grid">
          {/* Column 1: Social Links */}
          <div className="footer-col col-social">
            <p className="footer-col-label">{t.footer.findUsHere}</p>
            <div className="footer-socials-row">
              {socialLinks.map((s, idx) => (
                <motion.a 
                  key={idx}
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.15 }}
                  href={s.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="linkedin-link"
                  aria-label={`Visit on ${s.platform}`}
                  title={s.platform}
                >
                  {s.platform.toLowerCase().includes('linkedin') ? (
                    <span className="linkedin-icon">in</span>
                  ) : s.platform.toLowerCase().includes('youtube') ? (
                    <Youtube size={16} />
                  ) : s.platform.toLowerCase().includes('instagram') ? (
                    <Instagram size={16} />
                  ) : (
                    <Globe size={16} />
                  )}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Phone & Email */}
          <div className="footer-col col-contact">
            <div className="contact-item">
              <Phone className="footer-icon" size={24} />
              <div className="contact-text">
                <p><span>{t.footer.phone}</span> <a href={`tel:${phoneNumber.replace(/\s+/g, '')}`}>{phoneNumber}</a></p>
                <p><span>{t.footer.fax}</span> {faxNumber}</p>
                <p><a href={`mailto:${emailAddress}`}>{emailAddress.replace('@', '()')}</a></p>
              </div>
            </div>
          </div>

          {/* Column 3: Address */}
          <div className="footer-col col-address">
            <div className="address-item">
              <MapPin className="footer-icon" size={24} />
              <div className="address-text">
                <p><strong>{t.footer.addressTitle}</strong></p>
                <p>{footerConfig.company_name || settings.company_name || t.footer.companyName}</p>
                <p>{streetAddress}</p>
                <p>{cityCountry.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>{line}<br/></React.Fragment>
                ))}</p>
              </div>
            </div>
          </div>

          {/* Column 4: Imprint Link */}
          <div className="footer-col col-legal">
            <NavLink 
              to="/en/Impressum-Datenschutzverordnung/" 
              className="imprint-link"
            >
              {t.footer.imprintLink.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>{line}<br/></React.Fragment>
              ))}
            </NavLink>
          </div>
        </div>

        {/* Footer Bottom Copyright */}
        <div className="footer-bottom">
          <p className="copyright-text">
            {copyrightText} <a href="http://www.sportsandmice.com" target="_blank" rel="noopener noreferrer">Sports & MICE</a>
          </p>
          <div className="footer-admin-link">
            <NavLink to="/admin/login" className="admin-portal-link" title="Admin Control Center">
              Admin
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
