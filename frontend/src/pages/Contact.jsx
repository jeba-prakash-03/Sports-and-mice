import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { submitContactForm } from '../services/api';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PageTransition, AnimatedSection } from '../components/AnimatedSection';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/contact.css';

const Contact = () => {
  const { t } = useLanguage();
  const { settings } = useSite();

  const [formData, setFormData] = useState({
    surname: '',
    email: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    message: '',
    website_hp: '' // Bot honeypot
  });

  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
    fieldErrors: {}
  });

  const phoneNumber = settings.phone || '+49 2241 343320';
  const faxNumber = settings.fax || '+49 2241 344316';
  const emailAddress = settings.email || 'contact@sportsandmice.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (status.fieldErrors[name]) {
      setStatus(prev => ({
        ...prev,
        fieldErrors: {
          ...prev.fieldErrors,
          [name]: null
        }
      }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.surname.trim()) {
      errors.surname = t.contact.validation.required;
    }
    if (!formData.email.trim()) {
      errors.email = t.contact.validation.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t.contact.validation.invalidEmail;
    }
    if (!formData.message.trim()) {
      errors.message = t.contact.validation.required;
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setStatus(prev => ({ ...prev, fieldErrors: errors }));
      return;
    }

    setStatus({ submitting: true, submitted: false, error: null, fieldErrors: {} });

    try {
      const result = await submitContactForm(formData);
      if (result.ok && result.data.success) {
        setStatus({
          submitting: false,
          submitted: true,
          error: null,
          fieldErrors: {}
        });
        setFormData({
          surname: '',
          email: '',
          country: '',
          city: '',
          address: '',
          phone: '',
          message: '',
          website_hp: ''
        });
      } else {
        setStatus({
          submitting: false,
          submitted: false,
          error: result.data.error || t.contact.validation.error,
          fieldErrors: {}
        });
      }
    } catch (err) {
      setStatus({
        submitting: false,
        submitted: false,
        error: t.contact.validation.error,
        fieldErrors: {}
      });
    }
  };

  return (
    <PageTransition>
      <div className="contact-page">
        {/* Hero Banner */}
        <section className="contact-hero" style={{ backgroundImage: `url('/assets/images/contact_hero_bg.jpg')` }}>
          <div className="container">
            <AnimatedSection direction="up" distance={20}>
              <h1 className="contact-hero-title">{t.contact.heroTitle}</h1>
            </AnimatedSection>
          </div>
        </section>

        {/* Contact Content Section */}
        <section className="contact-content-section">
          <div className="container">
            <div className="contact-main-grid">
              {/* Left Side: Contact Information */}
              <AnimatedSection direction="right" distance={30} className="contact-info-col">
                <h2 className="contact-form-title">{t.contact.formHeading}</h2>
                <p className="contact-form-subtitle">{t.contact.formSub}</p>
                
                <p className="contact-team-sign">
                  <span>Your </span>
                  <a href={`mailto:${emailAddress}`} className="team-link">
                    {t.contact.teamSign.replace('Your ', '').replace('Ihr ', '')}
                  </a>
                </p>

                <div className="contact-details-box">
                  <div className="details-row">
                    <div className="details-icon">
                      <span className="phone-icon-symbol">&#128241;</span>
                    </div>
                    <div className="details-text">
                      <p><span>{t.contact.phone}</span> <a href={`tel:${phoneNumber.replace(/\s+/g, '')}`}>{phoneNumber}</a></p>
                      <p><span>{t.contact.fax}</span> {faxNumber}</p>
                    </div>
                  </div>

                  <div className="details-row">
                    <div className="details-icon">
                      <Mail size={22} className="mail-icon-symbol" />
                    </div>
                    <div className="details-text">
                      <p><span>{t.contact.email}</span> <a href={`mailto:${emailAddress}`}>{emailAddress.replace('@', '(@)')}</a></p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Right Side: Contact Form matching screenshot 1 */}
              <AnimatedSection direction="left" distance={30} className="contact-form-col">
                <AnimatePresence>
                  {status.submitted && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="alert-success-msg"
                    >
                      <CheckCircle size={20} />
                      <div>
                        <strong>{t.contact.validation.success}</strong>
                      </div>
                    </motion.div>
                  )}

                  {status.error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="alert-error-msg"
                    >
                      <AlertCircle size={20} />
                      <span>{status.error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="contact-html-form" noValidate>
                  {/* Anti-spam honeypot (hidden from real users) */}
                  <input 
                    type="text" 
                    name="website_hp" 
                    value={formData.website_hp} 
                    onChange={handleChange} 
                    style={{ display: 'none', position: 'absolute', left: '-9999px' }} 
                    tabIndex="-1" 
                    autoComplete="off" 
                  />

                  {/* Surname / Name */}
                  <div className="form-field-row">
                    <label htmlFor="surname" className="form-label">{t.contact.fields.surname}</label>
                    <div className="input-wrapper">
                      <input 
                        type="text" 
                        id="surname" 
                        name="surname" 
                        value={formData.surname} 
                        onChange={handleChange}
                        className={`form-input ${status.fieldErrors.surname ? 'input-error' : ''}`}
                      />
                      {status.fieldErrors.surname && (
                        <div className="custom-tooltip">{status.fieldErrors.surname}</div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-field-row">
                    <label htmlFor="email" className="form-label">{t.contact.fields.email}</label>
                    <div className="input-wrapper">
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        className={`form-input ${status.fieldErrors.email ? 'input-error' : ''}`}
                      />
                      {status.fieldErrors.email && (
                        <div className="custom-tooltip">{status.fieldErrors.email}</div>
                      )}
                    </div>
                  </div>

                  {/* Country */}
                  <div className="form-field-row">
                    <label htmlFor="country" className="form-label">{t.contact.fields.country}</label>
                    <div className="input-wrapper">
                      <input 
                        type="text" 
                        id="country" 
                        name="country" 
                        value={formData.country} 
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="form-field-row">
                    <label htmlFor="city" className="form-label">{t.contact.fields.city}</label>
                    <div className="input-wrapper">
                      <input 
                        type="text" 
                        id="city" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="form-field-row">
                    <label htmlFor="address" className="form-label">{t.contact.fields.address}</label>
                    <div className="input-wrapper">
                      <input 
                        type="text" 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="form-field-row">
                    <label htmlFor="message" className="form-label">{t.contact.fields.message}</label>
                    <div className="input-wrapper">
                      <textarea 
                        id="message" 
                        name="message" 
                        rows="4"
                        value={formData.message} 
                        onChange={handleChange}
                        className={`form-textarea ${status.fieldErrors.message ? 'input-error' : ''}`}
                      ></textarea>
                      {status.fieldErrors.message && (
                        <div className="custom-tooltip">{status.fieldErrors.message}</div>
                      )}
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="form-actions-row">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      className="contact-send-btn" 
                      disabled={status.submitting}
                    >
                      {status.submitting ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Loader2 size={14} className="spin-icon" />
                          {t.contact.validation.sending}
                        </span>
                      ) : (
                        t.contact.fields.send
                      )}
                    </motion.button>
                  </div>
                </form>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Contact;
