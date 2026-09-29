import React, { useState, useEffect } from 'react';
import { fetchAdminConfig, saveDraftConfig } from '../../services/api';
import AdminCmsHeader from '../../components/admin/AdminCmsHeader';
import { 
  Menu, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Save, 
  Check, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminHeaderFooter = () => {
  const [configData, setConfigData] = useState(null);
  const [headerConfig, setHeaderConfig] = useState({
    logo_url: '/assets/images/logo.png',
    brand_title: 'Sports & MICE',
    sticky: true,
    nav_items: []
  });
  const [footerConfig, setFooterConfig] = useState({
    company_name: 'K-Consulting Sports & MICE',
    street: 'Fritz-Pullig-Strasse 9',
    city_country_en: "53757 Sankt Augustin\nGermany",
    city_country_de: "53757 Sankt Augustin\nDeutschland",
    phone: '+49 2241 343320',
    fax: '+49 2241 344316',
    email: 'contact@sportsandmice.com',
    copyright_text: '© 2026 www.Sportsandmice.Com',
    social_links: []
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadData = async () => {
    const res = await fetchAdminConfig();
    if (res.success && res.data) {
      setConfigData(res.data);
      if (res.data.draft?.header) setHeaderConfig(res.data.draft.header);
      if (res.data.draft?.footer) setFooterConfig(res.data.draft.footer);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNavMove = (index, direction) => {
    const list = [...(headerConfig.nav_items || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    list.forEach((item, idx) => {
      item.order = idx + 1;
    });

    setHeaderConfig(prev => ({ ...prev, nav_items: list }));
    setSaveSuccess(false);
  };

  const handleNavToggle = (index) => {
    const list = [...(headerConfig.nav_items || [])];
    list[index].enabled = !list[index].enabled;
    setHeaderConfig(prev => ({ ...prev, nav_items: list }));
    setSaveSuccess(false);
  };

  const handleNavLabelChange = (index, lang, value) => {
    const list = [...(headerConfig.nav_items || [])];
    if (lang === 'en') list[index].name_en = value;
    if (lang === 'de') list[index].name_de = value;
    setHeaderConfig(prev => ({ ...prev, nav_items: list }));
    setSaveSuccess(false);
  };

  const handleFooterChange = (field, value) => {
    setFooterConfig(prev => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleSocialLinkChange = (index, field, value) => {
    const list = [...(footerConfig.social_links || [])];
    list[index][field] = value;
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updatedConfig = {
      ...(configData?.draft || {}),
      header: headerConfig,
      footer: footerConfig
    };

    const res = await saveDraftConfig(updatedConfig, 'Header & Footer Settings');
    if (res.success) {
      setSaveSuccess(true);
      await loadData();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="admin-page-container">
      <AdminCmsHeader 
        onRefresh={loadData} 
        hasChanges={configData?.has_unpublished_changes}
        version={configData?.version}
      />

      <div className="cms-page-header-row">
        <div>
          <h2 className="cms-page-title">Header & Footer Management</h2>
          <p className="cms-page-subtitle">Configure the brand logo, navigation menu order, footer company address, phone, and social links.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="cms-editor-form">
        <div className="cms-builder-layout-grid">
          {/* Header Management Panel */}
          <div className="cms-panel-card">
            <h3 className="panel-title">Header & Navigation Menu</h3>

            <div className="form-group-row">
              <div className="form-group">
                <label className="cms-label">Logo Image URL</label>
                <input
                  type="text"
                  value={headerConfig.logo_url || ''}
                  onChange={(e) => setHeaderConfig(prev => ({ ...prev, logo_url: e.target.value }))}
                  className="cms-input"
                  placeholder="/assets/images/logo.png"
                />
              </div>

              <div className="form-group">
                <label className="cms-label">Brand Title Text</label>
                <input
                  type="text"
                  value={headerConfig.brand_title || ''}
                  onChange={(e) => setHeaderConfig(prev => ({ ...prev, brand_title: e.target.value }))}
                  className="cms-input"
                  placeholder="Sports & MICE"
                />
              </div>
            </div>

            <div className="cms-divider" />

            <h4 className="cms-section-heading">Navigation Items (Reorder & Visibility)</h4>

            <div className="nav-items-reorder-list">
              {(headerConfig.nav_items || []).map((item, idx) => (
                <div key={item.id || idx} className="nav-item-edit-row">
                  <div className="nav-order-buttons">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleNavMove(idx, 'up')}
                      className="btn-order-arrow"
                      title="Move Left / Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (headerConfig.nav_items || []).length - 1}
                      onClick={() => handleNavMove(idx, 'down')}
                      className="btn-order-arrow"
                      title="Move Right / Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div className="nav-labels-inputs">
                    <input
                      type="text"
                      value={item.name_en || ''}
                      onChange={(e) => handleNavLabelChange(idx, 'en', e.target.value)}
                      placeholder="Label (EN)"
                      className="cms-input-sm"
                    />
                    <input
                      type="text"
                      value={item.name_de || ''}
                      onChange={(e) => handleNavLabelChange(idx, 'de', e.target.value)}
                      placeholder="Label (DE)"
                      className="cms-input-sm"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavToggle(idx)}
                    className={`btn-toggle-eye ${item.enabled !== false ? 'eye-on' : 'eye-off'}`}
                    title={item.enabled !== false ? 'Visible' : 'Hidden'}
                  >
                    {item.enabled !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Management Panel */}
          <div className="cms-panel-card">
            <h3 className="panel-title">Footer & Contact Details</h3>

            <div className="form-group">
              <label className="cms-label">Company Legal Name</label>
              <input
                type="text"
                value={footerConfig.company_name || ''}
                onChange={(e) => handleFooterChange('company_name', e.target.value)}
                className="cms-input"
              />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label className="cms-label">Phone Number</label>
                <input
                  type="text"
                  value={footerConfig.phone || ''}
                  onChange={(e) => handleFooterChange('phone', e.target.value)}
                  className="cms-input"
                />
              </div>

              <div className="form-group">
                <label className="cms-label">Fax Number</label>
                <input
                  type="text"
                  value={footerConfig.fax || ''}
                  onChange={(e) => handleFooterChange('fax', e.target.value)}
                  className="cms-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="cms-label">Inquiry E-Mail</label>
              <input
                type="text"
                value={footerConfig.email || ''}
                onChange={(e) => handleFooterChange('email', e.target.value)}
                className="cms-input"
              />
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
                <div key={idx} className="social-link-row">
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
                    className="cms-input-sm"
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
              ))}
            </div>
          </div>
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
                <span>Header & Footer Saved!</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Header & Footer Draft</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminHeaderFooter;
