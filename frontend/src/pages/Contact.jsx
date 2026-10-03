import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { submitContactForm } from '../services/api';
import { Phone, Printer, Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PageTransition, AnimatedSection } from '../components/AnimatedSection';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/contact.css';

const Contact = () => {
  const { lang, t } = useLanguage();
  const { settings } = useSite();

  const [formData, setFormData] = useState({
    surname: '',
    email: '',
    country: '',
    city: '',
    address: '',
    message: '',
    website_hp: ''
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
      errors.surname = lang === 'de' ? 'Name ist erforderlich' : 'Surname is required';
    }
    if (!formData.email.trim()) {
      errors.email = lang === 'de' ? 'E-Mail ist erforderlich' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = lang === 'de' ? 'Ungültige E-Mail-Adresse' : 'Invalid email address';
    }
    if (!formData.message.trim()) {
      errors.message = lang === 'de' ? 'Nachricht ist erforderlich' : 'Message is required';
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
          message: '',
          website_hp: ''
        });
      } else {
        setStatus({
          submitting: false,
          submitted: false,
          error: result.data.error || (lang === 'de' ? 'Fehler beim Senden' : 'Error sending message'),
          fieldErrors: {}
        });
      }
    } catch (err) {
      setStatus({
        submitting: false,
        submitted: false,
        error: lang === 'de' ? 'Netzwerkfehler' : 'Network error',
        fieldErrors: {}
      });
    }
  };

  return (
    <PageTransition>
      <div className="contact-page">
        {/* Floating 3D Liquid Orbs Background */}
        <div className="contact-liquid-orbs">
          <div className="contact-orb contact-orb-1" />
          <div className="contact-orb contact-orb-2" />
          <div className="contact-orb contact-orb-3" />
          <div className="contact-orb contact-orb-4" />
        </div>

        <div className="contact-glass-container">
          <div className="contact-glass-grid">

            {/* LEFT MASTER GLASS CARD: Consultation Info Panel */}
            <AnimatedSection direction="left" distance={30} className="contact-glass-card">
              <div>
               
                <h1 className="contact-master-title">contact form</h1>
                <p className="contact-master-subtitle">
                  {lang === 'de' 
                    ? 'Haben Sie Fragen zu unseren Sports & MICE Beratungsleistungen? Kontaktieren Sie unser Team und wir antworten innerhalb von 24 Stunden.'
                    : 'Have questions about our sports & MICE consulting services? Get in touch with our team and we\'ll respond within 24 hours.'
                  }
                </p>
              </div>

              {/* Inset Liquid Glass Contact Detail Pills */}
              <div className="contact-inset-pills-list">
                <div className="contact-inset-pill">
                  <div className="contact-spherical-icon">
                    <Phone size={20} />
                  </div>
                  <div className="contact-pill-content">
                    <span className="contact-pill-label">Phone</span>
                    <a href={`tel:${phoneNumber.replace(/\s+/g, '')}`} className="contact-pill-value">{phoneNumber}</a>
                  </div>
                </div>

                <div className="contact-inset-pill">
                  <div className="contact-spherical-icon">
                    <Printer size={20} />
                  </div>
                  <div className="contact-pill-content">
                    <span className="contact-pill-label">Fax</span>
                    <span className="contact-pill-value">{faxNumber}</span>
                  </div>
                </div>

                <div className="contact-inset-pill">
                  <div className="contact-spherical-icon">
                    <Mail size={20} />
                  </div>
                  <div className="contact-pill-content">
                    <span className="contact-pill-label">Email</span>
                    <a href={`mailto:${emailAddress}`} className="contact-pill-value">{emailAddress}</a>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* RIGHT MASTER GLASS CARD: Interactive Liquid Form Panel */}
            <AnimatedSection direction="right" distance={30} className="contact-glass-card">
              <div>
                <h2 className="contact-form-heading">
                  {lang === 'de' ? 'Nachricht senden' : 'Send us a message'}
                </h2>
                <p className="contact-form-subtext">
                  {lang === 'de'
                    ? 'Füllen Sie das Formular aus und unser Berater wird Sie in Kürze kontaktieren.'
                    : 'Fill out the form and our consultant will contact you shortly.'
                  }
                </p>

                <AnimatePresence>
                  {status.submitted && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#15803d', padding: '14px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <CheckCircle size={20} />
                      <span>{lang === 'de' ? 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.' : 'Thank you! Your message has been sent successfully.'}</span>
                    </motion.div>
                  )}

                  {status.error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#b91c1c', padding: '14px', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <AlertCircle size={20} />
                      <span>{status.error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="glass-form-layout" noValidate>
                  {/* Anti-spam honeypot */}
                  <input 
                    type="text" 
                    name="website_hp" 
                    value={formData.website_hp} 
                    onChange={handleChange} 
                    style={{ display: 'none', position: 'absolute', left: '-9999px' }} 
                    tabIndex="-1" 
                    autoComplete="off" 
                  />

                  {/* Row 1: Surname & e-mail */}
                  <div className="glass-form-row-2col">
                    <div className="glass-form-group">
                      <label htmlFor="surname" className="glass-form-label">Surname</label>
                      <input 
                        type="text" 
                        id="surname" 
                        name="surname" 
                        placeholder="e.g. Marc" 
                        value={formData.surname} 
                        onChange={handleChange}
                        className="glass-form-input"
                      />
                      {status.fieldErrors.surname && <span style={{ color: '#dc2626', fontSize: '12px' }}>{status.fieldErrors.surname}</span>}
                    </div>

                    <div className="glass-form-group">
                      <label htmlFor="email" className="glass-form-label">e-mail</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="you@email.com" 
                        value={formData.email} 
                        onChange={handleChange}
                        className="glass-form-input"
                      />
                      {status.fieldErrors.email && <span style={{ color: '#dc2626', fontSize: '12px' }}>{status.fieldErrors.email}</span>}
                    </div>
                  </div>

                  {/* Row 2: Country & City */}
                  <div className="glass-form-row-2col">
                    <div className="glass-form-group">
                      <label htmlFor="country" className="glass-form-label">Country</label>
                      <input 
                        type="text" 
                        id="country" 
                        name="country" 
                        placeholder="Germany" 
                        value={formData.country} 
                        onChange={handleChange}
                        className="glass-form-input"
                      />
                    </div>

                    <div className="glass-form-group">
                      <label htmlFor="city" className="glass-form-label">City</label>
                      <input 
                        type="text" 
                        id="city" 
                        name="city" 
                        placeholder="Sankt Augustin" 
                        value={formData.city} 
                        onChange={handleChange}
                        className="glass-form-input"
                      />
                    </div>
                  </div>

                  {/* Row 3: Address */}
                  <div className="glass-form-group">
                    <label htmlFor="address" className="glass-form-label">Address</label>
                    <input 
                      type="text" 
                      id="address" 
                      name="address" 
                      placeholder="Fritz-Pullig-Strasse 9, 53757 Sankt Augustin" 
                      value={formData.address} 
                      onChange={handleChange}
                      className="glass-form-input"
                    />
                  </div>

                  {/* Row 4: Message */}
                  <div className="glass-form-group">
                    <label htmlFor="message" className="glass-form-label">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows="3"
                      placeholder="Tell us about your project, event, or consultation needs..." 
                      value={formData.message} 
                      onChange={handleChange}
                      className="glass-form-textarea"
                    />
                    {status.fieldErrors.message && <span style={{ color: '#dc2626', fontSize: '12px' }}>{status.fieldErrors.message}</span>}
                  </div>

                  {/* Row 5: Action Submit Button */}
                  <div className="glass-form-action-bar">
                    <button 
                      type="submit" 
                      className="btn-glass-purple-submit"
                      disabled={status.submitting}
                    >
                      {status.submitting ? (
                        <>
                          <Loader2 size={16} className="spin-icon" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
