import React, { useState, useEffect, useRef } from 'react';
import { saveDraftConfig, uploadMediaFile } from '../../services/api';
import { useSite } from '../../context/SiteContext';
import { useEditor, MAX_NAV_ITEMS } from '../../context/EditorContext';
import AdminCmsHeader from '../../components/admin/AdminCmsHeader';
import WordCounter from '../../components/WordCounter';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  Check,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Upload
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  validateRequired,
  validateMaxWords,
  validateUrl,
  validatePhone,
  validateEmail,
  MAX_WORDS
} from '../../utils/adminValidation';

const emptyNavForm = { name_en: '', name_de: '', path: '' };

const AdminHeaderFooter = () => {
  const { cmsConfig, loadSiteConfig } = useSite();
  const { addNavItem, updateNavItem, deleteNavItem, reorderNavItem } = useEditor();

  const [logoBrand, setLogoBrand] = useState({
    logo_url: '/assets/images/logo.png',
    brand_title: 'Sports & MICE'
  });
  const [footerConfig, setFooterConfig] = useState({
    company_name: 'K-Consulting Sports & MICE',
    street: 'Fritz-Pullig-Strasse 9',
    city_country_en: "53757 Sankt Augustin\nGermany",
    city_country_de: "53757 Sankt Augustin\nDeutschland",
    phone: '+49 2241 343320',
    fax: '+49 2241 344316',
    email: 'contact@sportsandmice.com',
    whatsapp: '',
    business_hours: '',
    copyright_text: '© 2026 www.Sportsandmice.Com',
    social_links: []
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [errors, setErrors] = useState({});
  const [navForm, setNavForm] = useState(emptyNavForm);
  const [navFormError, setNavFormError] = useState(null);
  const [showAddNav, setShowAddNav] = useState(false);
  const logoFileInputRef = useRef(null);

  const navItems = cmsConfig?.header?.nav_items || [];
  const navLimitReached = navItems.length >= MAX_NAV_ITEMS;
  // The public header shows the first 7 items directly; anything beyond that
  // folds into a "⋯" overflow dropdown automatically (see Header.jsx) — so
  // this is just an informational heads-up, not a hard limit like MAX_NAV_ITEMS.
  const VISIBLE_NAV_COUNT = 7;
  const navOverflowCount = Math.max(0, navItems.length - VISIBLE_NAV_COUNT);

  // Load the DRAFT (not published) config, matching the Visual Builder's own
  // mount behavior — otherwise nav edits here could clobber an in-progress
  // draft with whatever the live published site currently has in memory.
  useEffect(() => {
    loadSiteConfig(true);
  }, [loadSiteConfig]);

  useEffect(() => {
    if (cmsConfig?.header) {
      setLogoBrand({
        logo_url: cmsConfig.header.logo_url || '/assets/images/logo.png',
        brand_title: cmsConfig.header.brand_title || 'Sports & MICE'
      });
    }
    if (cmsConfig?.footer) {
      setFooterConfig(prev => ({ ...prev, ...cmsConfig.footer }));
    }
  }, [cmsConfig?.header, cmsConfig?.footer]);

  const handleFooterChange = (field, value) => {
    setFooterConfig(prev => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleSocialLinkChange = (index, field, value) => {
    const list = [...(footerConfig.social_links || [])];
    list[index] = { ...list[index], [field]: value };
    setFooterConfig(prev => ({ ...prev, social_links: list }));
    setSaveSuccess(false);
  };

  const handleAddSocial = () => {
    const list = [...(footerConfig.social_links || [])];
    list.push({ platform: 'New Platform', url: 'https://', enabled: true });
    setFooterConfig(prev => ({ ...prev, social_links: list }));
    setSaveSuccess(false);
  };

  const handleDeleteSocial = (index) => {
    const list = (footerConfig.social_links || []).filter((_, i) => i !== index);
    setFooterConfig(prev => ({ ...prev, social_links: list }));
    setSaveSuccess(false);
  };

  const handleLogoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, logo: 'Please choose an image file (PNG, JPG, WEBP, SVG, GIF).' }));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, logo: 'Logo file is too large (max 8MB).' }));
      return;
    }

    setErrors(prev => ({ ...prev, logo: null }));
    setUploadingLogo(true);
    try {
      const res = await uploadMediaFile(file, 'Site Logo', 'Branding');
      if (res.success && res.url) {
        setLogoBrand(prev => ({ ...prev, logo_url: res.url }));
        setSaveSuccess(false);
      } else {
        setErrors(prev => ({ ...prev, logo: res.error || 'Logo upload failed.' }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, logo: 'Logo upload failed — please try again.' }));
    } finally {
      setUploadingLogo(false);
      if (logoFileInputRef.current) logoFileInputRef.current.value = '';
    }
  };

  const validateFooterForm = () => {
    const next = {};
    next.brand_title = validateRequired(logoBrand.brand_title, 'Brand title') ||
      validateMaxLength(logoBrand.brand_title, 60, 'Brand title');
    next.phone = validatePhone(footerConfig.phone, 'Phone number');
    next.whatsapp = validatePhone(footerConfig.whatsapp, 'WhatsApp number');
    next.email = validateRequired(footerConfig.email, 'Inquiry e-mail') ||
      validateEmail(footerConfig.email, 'Inquiry e-mail');
    next.company_name = validateRequired(footerConfig.company_name, 'Company legal name');

    (footerConfig.social_links || []).forEach((social, idx) => {
      const err = validateUrl(social.url, `${social.platform || 'Social link'} URL`);
      if (err) next[`social_${idx}`] = err;
    });

    setErrors(prev => ({ ...prev, ...next }));
    return !Object.values(next).some(Boolean);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateFooterForm()) return;

    setSaving(true);
    // Merge into the LIVE cmsConfig (not a separately re-fetched copy) so
    // whatever nav_items currently exist there — possibly just changed via
    // addNavItem/deleteNavItem below — are preserved rather than overwritten.
    const updatedConfig = {
      ...(cmsConfig || {}),
      header: {
        ...(cmsConfig?.header || {}),
        logo_url: logoBrand.logo_url,
        brand_title: logoBrand.brand_title
      },
      footer: footerConfig
    };

    const res = await saveDraftConfig(updatedConfig, 'Header & Footer Settings');
    if (res.success) {
      setSaveSuccess(true);
      await loadSiteConfig(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleNavFormSubmit = (e) => {
    e.preventDefault();
    const error = validateRequired(navForm.name_en, 'Label') ||
      validateMaxWords(navForm.name_en, MAX_WORDS, 'Label') ||
      validateRequired(navForm.path, 'Link path') ||
      validateUrl(navForm.path, 'Link path');

    if (error) {
      setNavFormError(error);
      return;
    }

    const result = addNavItem({
      name_en: navForm.name_en,
      name_de: navForm.name_de || navForm.name_en,
      path: navForm.path.startsWith('/') || navForm.path.startsWith('#') ? navForm.path : `/${navForm.path}`
    });

    if (result && result.success === false) {
      setNavFormError(result.error);
      return;
    }

    setNavForm(emptyNavForm);
    setNavFormError(null);
    setShowAddNav(false);
  };

  const handleNavLabelChange = (navId, lang, value) => {
    const error = validateMaxWords(value, MAX_WORDS, 'Label');
    setErrors(prev => ({ ...prev, [`nav_${navId}_${lang}`]: error }));
    if (error) return;
    updateNavItem(navId, lang === 'en' ? { name_en: value } : { name_de: value });
  };

  const handleNavPathChange = (navId, value) => {
    const error = validateUrl(value, 'Link path');
    setErrors(prev => ({ ...prev, [`nav_${navId}_path`]: error }));
    if (error) return;
    updateNavItem(navId, { path: value });
  };

  return (
    <div className="admin-page-container">
      <AdminCmsHeader
        onRefresh={() => loadSiteConfig(true)}
        hasChanges={cmsConfig?.has_unpublished_changes}
        version={cmsConfig?.version}
      />

      <div className="cms-page-header-row">
        <div>
          <h2 className="cms-page-title">Header & Footer Management</h2>
          <p className="cms-page-subtitle">Configure the brand logo, navigation menu, and footer company/contact details — the single place these are managed across the whole site.</p>
        </div>
      </div>

      <div className="cms-builder-layout-grid">
        {/* Header Management Panel */}
        <div className="cms-panel-card">
          <h3 className="panel-title">Logo & Brand</h3>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="cms-label">Logo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
              <div style={{
                width: '64px', height: '64px', border: '1px dashed #cbd5e1', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#f8fafc', flexShrink: 0
              }}>
                {logoBrand.logo_url && (
                  <img src={logoBrand.logo_url} alt="Logo preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                )}
              </div>
              <div>
                <input
                  ref={logoFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  style={{ display: 'none' }}
                  id="logo-file-input"
                />
                <button
                  type="button"
                  className="btn-add-item-sm"
                  onClick={() => logoFileInputRef.current?.click()}
                  disabled={uploadingLogo}
                >
                  {uploadingLogo ? <Loader2 size={14} className="spin-icon" /> : <Upload size={14} />}
                  <span>{uploadingLogo ? 'Uploading...' : 'Replace Logo'}</span>
                </button>
                <p className="cms-hint" style={{ marginTop: '6px' }}>PNG, JPG, WEBP, SVG or GIF — max 8MB. Displayed height is fixed by the header design, so very large images won't break the layout.</p>
                {errors.logo && <div className="cms-field-error"><AlertCircle size={13} /> {errors.logo}</div>}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="cms-label">Brand Title Text</label>
            <input
              type="text"
              value={logoBrand.brand_title || ''}
              onChange={(e) => { setLogoBrand(prev => ({ ...prev, brand_title: e.target.value })); setSaveSuccess(false); }}
              className={`cms-input ${errors.brand_title ? 'has-error' : ''}`}
              placeholder="Sports & MICE"
              maxLength={60}
            />
            {errors.brand_title && <div className="cms-field-error"><AlertCircle size={13} /> {errors.brand_title}</div>}
          </div>

          <div className="cms-divider" />

          <div className="panel-header-with-action">
            <h4 className="cms-section-heading" style={{ margin: 0 }}>Navigation Menu ({navItems.length})</h4>
            <button
              type="button"
              onClick={() => setShowAddNav(v => !v)}
              className="btn-add-item-sm"
              disabled={navLimitReached}
              title={navLimitReached ? `Maximum ${MAX_NAV_ITEMS} navigation items are allowed.` : 'Add a navigation item'}
            >
              <Plus size={14} />
              <span>Add Nav Item</span>
            </button>
          </div>

          {navOverflowCount > 0 && !navLimitReached && (
            <div className="cms-info-msg">
              Showing the first {VISIBLE_NAV_COUNT} items directly — the remaining {navOverflowCount} will appear in a "⋯" overflow menu on the public site.
            </div>
          )}

          {navLimitReached && (
            <div className="cms-limit-reached-msg">
              Maximum {MAX_NAV_ITEMS} navigation items are allowed. Delete one to add another.
            </div>
          )}

          {showAddNav && !navLimitReached && (
            <form onSubmit={handleNavFormSubmit} className="cms-panel-card" style={{ background: '#f8fafc', marginTop: '10px', marginBottom: '10px' }}>
              <div className="form-group-row">
                <div className="form-group">
                  <label className="cms-label">
                    Label (EN)
                    <WordCounter value={navForm.name_en} max={MAX_WORDS} />
                  </label>
                  <input
                    type="text"
                    value={navForm.name_en}
                    onChange={(e) => setNavForm(prev => ({ ...prev, name_en: e.target.value }))}
                    className="cms-input-sm"
                  />
                </div>
                <div className="form-group">
                  <label className="cms-label">
                    Label (DE)
                    <WordCounter value={navForm.name_de} max={MAX_WORDS} />
                  </label>
                  <input
                    type="text"
                    value={navForm.name_de}
                    onChange={(e) => setNavForm(prev => ({ ...prev, name_de: e.target.value }))}
                    className="cms-input-sm"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="cms-label">Link Path</label>
                <input
                  type="text"
                  value={navForm.path}
                  onChange={(e) => setNavForm(prev => ({ ...prev, path: e.target.value }))}
                  className="cms-input-sm"
                  placeholder="/en/About-us/"
                />
              </div>
              {navFormError && <div className="cms-field-error"><AlertCircle size={13} /> {navFormError}</div>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="cms-btn-primary"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                  disabled={validateMaxWords(navForm.name_en, MAX_WORDS, 'Label') !== null}
                >
                  Add
                </button>
                <button type="button" className="btn-modal-cancel" onClick={() => { setShowAddNav(false); setNavForm(emptyNavForm); setNavFormError(null); }}>Cancel</button>
              </div>
            </form>
          )}

          <div className="nav-items-reorder-list">
            {navItems.map((item, idx) => (
              <div key={item.id || idx} className="nav-item-edit-row">
                <div className="nav-order-buttons">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => reorderNavItem(item.id, 'up')}
                    className="btn-order-arrow"
                    title="Move Left / Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === navItems.length - 1}
                    onClick={() => reorderNavItem(item.id, 'down')}
                    className="btn-order-arrow"
                    title="Move Right / Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                <div className="nav-labels-inputs" style={{ flex: 1 }}>
                  <div className="form-group-row">
                    <input
                      type="text"
                      defaultValue={item.name_en || ''}
                      onBlur={(e) => handleNavLabelChange(item.id, 'en', e.target.value)}
                      placeholder="Label (EN)"
                      className={`cms-input-sm ${errors[`nav_${item.id}_en`] ? 'has-error' : ''}`}
                    />
                    <input
                      type="text"
                      defaultValue={item.name_de || ''}
                      onBlur={(e) => handleNavLabelChange(item.id, 'de', e.target.value)}
                      placeholder="Label (DE)"
                      className={`cms-input-sm ${errors[`nav_${item.id}_de`] ? 'has-error' : ''}`}
                    />
                    <input
                      type="text"
                      defaultValue={item.path || ''}
                      onBlur={(e) => handleNavPathChange(item.id, e.target.value)}
                      placeholder="/en/Page/"
                      className={`cms-input-sm ${errors[`nav_${item.id}_path`] ? 'has-error' : ''}`}
                    />
                  </div>
                  {(errors[`nav_${item.id}_en`] || errors[`nav_${item.id}_de`] || errors[`nav_${item.id}_path`]) && (
                    <div className="cms-field-error">
                      <AlertCircle size={13} /> {errors[`nav_${item.id}_en`] || errors[`nav_${item.id}_de`] || errors[`nav_${item.id}_path`]}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => updateNavItem(item.id, { enabled: item.enabled === false })}
                  className={`btn-toggle-eye ${item.enabled !== false ? 'eye-on' : 'eye-off'}`}
                  title={item.enabled !== false ? 'Visible' : 'Hidden'}
                >
                  {item.enabled !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>

                <button
                  type="button"
                  onClick={() => { if (window.confirm(`Delete "${item.name_en}" from the navigation menu?`)) deleteNavItem(item.id); }}
                  className="btn-delete-item-icon"
                  title="Delete nav item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <p className="cms-hint" style={{ marginTop: '10px' }}>Navigation changes save automatically as you edit.</p>
        </div>

        {/* Footer Management Panel */}
        <form onSubmit={handleSave} className="cms-panel-card">
          <h3 className="panel-title">Footer & Contact Details</h3>
          <p className="cms-hint" style={{ marginBottom: '14px' }}>This is the single source for contact info shown in the Header, Footer, and Contact page.</p>

          <div className="form-group">
            <label className="cms-label">Company Legal Name</label>
            <input
              type="text"
              value={footerConfig.company_name || ''}
              onChange={(e) => handleFooterChange('company_name', e.target.value)}
              className={`cms-input ${errors.company_name ? 'has-error' : ''}`}
            />
            {errors.company_name && <div className="cms-field-error"><AlertCircle size={13} /> {errors.company_name}</div>}
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label className="cms-label">Phone Number</label>
              <input
                type="text"
                value={footerConfig.phone || ''}
                onChange={(e) => handleFooterChange('phone', e.target.value)}
                className={`cms-input ${errors.phone ? 'has-error' : ''}`}
              />
              {errors.phone && <div className="cms-field-error"><AlertCircle size={13} /> {errors.phone}</div>}
            </div>

            <div className="form-group">
              <label className="cms-label">WhatsApp Number</label>
              <input
                type="text"
                value={footerConfig.whatsapp || ''}
                onChange={(e) => handleFooterChange('whatsapp', e.target.value)}
                className={`cms-input ${errors.whatsapp ? 'has-error' : ''}`}
                placeholder="+49 2241 343320"
              />
              {errors.whatsapp && <div className="cms-field-error"><AlertCircle size={13} /> {errors.whatsapp}</div>}
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label className="cms-label">Fax Number</label>
              <input
                type="text"
                value={footerConfig.fax || ''}
                onChange={(e) => handleFooterChange('fax', e.target.value)}
                className="cms-input"
              />
            </div>

            <div className="form-group">
              <label className="cms-label">Inquiry E-Mail</label>
              <input
                type="email"
                value={footerConfig.email || ''}
                onChange={(e) => handleFooterChange('email', e.target.value)}
                className={`cms-input ${errors.email ? 'has-error' : ''}`}
              />
              {errors.email && <div className="cms-field-error"><AlertCircle size={13} /> {errors.email}</div>}
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label className="cms-label">Street Address</label>
              <input
                type="text"
                value={footerConfig.street || ''}
                onChange={(e) => handleFooterChange('street', e.target.value)}
                className="cms-input"
              />
            </div>

            <div className="form-group">
              <label className="cms-label">Copyright Notice</label>
              <input
                type="text"
                value={footerConfig.copyright_text || ''}
                onChange={(e) => handleFooterChange('copyright_text', e.target.value)}
                className="cms-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="cms-label">Business Hours</label>
            <textarea
              value={footerConfig.business_hours || ''}
              onChange={(e) => handleFooterChange('business_hours', e.target.value)}
              className="cms-textarea"
              rows={2}
              placeholder={'Mon–Fri: 9:00–18:00\nSat–Sun: Closed'}
            />
          </div>

          <div className="cms-divider" />

          <div className="panel-header-with-action">
            <h4 className="cms-section-heading" style={{ margin: 0 }}>Social Media Links</h4>
            <button type="button" onClick={handleAddSocial} className="btn-add-item-sm">
              <Plus size={14} />
              <span>Add Social Link</span>
            </button>
          </div>

          <div className="social-links-manage-list">
            {(footerConfig.social_links || []).map((social, idx) => (
              <div key={idx}>
                <div className="social-link-row">
                  <input
                    type="text"
                    value={social.platform || ''}
                    onChange={(e) => handleSocialLinkChange(idx, 'platform', e.target.value)}
                    placeholder="Platform (e.g. LinkedIn)"
                    className="cms-input-sm"
                    style={{ width: '130px' }}
                  />
                  <input
                    type="text"
                    value={social.url || ''}
                    onChange={(e) => handleSocialLinkChange(idx, 'url', e.target.value)}
                    placeholder="https://..."
                    className={`cms-input-sm ${errors[`social_${idx}`] ? 'has-error' : ''}`}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteSocial(idx)}
                    className="btn-delete-item-icon"
                    title="Delete link"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {errors[`social_${idx}`] && <div className="cms-field-error"><AlertCircle size={13} /> {errors[`social_${idx}`]}</div>}
              </div>
            ))}
          </div>

          <div className="cms-form-footer" style={{ marginTop: '24px' }}>
            <button type="submit" className="cms-btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span>Saving Draft...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check size={16} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Logo, Brand & Footer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminHeaderFooter;
