import React, { useState, useEffect } from 'react';
import { fetchAdminConfig, saveDraftConfig } from '../../services/api';
import AdminCmsHeader from '../../components/admin/AdminCmsHeader';
import { 
  Link as LinkIcon, 
  Save, 
  Check, 
  ExternalLink, 
  Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminButtons = () => {
  const [configData, setConfigData] = useState(null);
  const [draftSections, setDraftSections] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadData = async () => {
    const res = await fetchAdminConfig();
    if (res.success && res.data) {
      setConfigData(res.data);
      setDraftSections(res.data.draft?.sections || {});
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleHeroBtnChange = (field, value) => {
    setDraftSections(prev => {
      const homeSecs = [...(prev.home || [])];
      if (homeSecs[0]) {
        homeSecs[0] = { ...homeSecs[0], [field]: value };
      }
      return { ...prev, home: homeSecs };
    });
    setSaveSuccess(false);
  };

  const handleServiceBtnChange = (field, value) => {
    setDraftSections(prev => {
      const sSecs = [...(prev.service || [])];
      const ctaIdx = sSecs.findIndex(s => s.id === 'service_cta');
      if (ctaIdx !== -1) {
        sSecs[ctaIdx] = { ...sSecs[ctaIdx], [field]: value };
      }
      return { ...prev, service: sSecs };
    });
    setSaveSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updatedConfig = {
      ...(configData?.draft || {}),
      sections: draftSections
    };

    const res = await saveDraftConfig(updatedConfig, 'Button & Links Manager');
    if (res.success) {
      setSaveSuccess(true);
      await loadData();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const heroSec = draftSections.home?.[0] || {};
  const serviceCta = draftSections.service?.find(s => s.id === 'service_cta') || {};

  return (
    <div className="admin-page-container">
      <AdminCmsHeader 
        onRefresh={loadData} 
        hasChanges={configData?.has_unpublished_changes}
        version={configData?.version}
      />

      <div className="cms-page-header-row">
        <div>
          <h2 className="cms-page-title">Buttons & Action Links</h2>
          <p className="cms-page-subtitle">Configure call-to-action buttons, link destinations, button copy, and styles across the website.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="cms-editor-form">
        <div className="cms-builder-layout-grid">
          {/* Button 1: Home Hero CTA */}
          <div className="cms-panel-card">
            <h3 className="panel-title">Homepage Hero Consultation Button</h3>
            
            <div className="form-group-row">
              <div className="form-group">
                <label className="cms-label">Button Label (English)</label>
                <input
                  type="text"
                  value={heroSec.cta_button_text_en || 'Get Free Consultation'}
                  onChange={(e) => handleHeroBtnChange('cta_button_text_en', e.target.value)}
                  className="cms-input"
                />
              </div>

              <div className="form-group">
                <label className="cms-label">Button Label (German)</label>
                <input
                  type="text"
                  value={heroSec.cta_button_text_de || 'Kostenlose Beratung anfragen'}
                  onChange={(e) => handleHeroBtnChange('cta_button_text_de', e.target.value)}
                  className="cms-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="cms-label">Destination URL</label>
              <input
                type="text"
                value={heroSec.cta_button_link || '/en/Contact/'}
                onChange={(e) => handleHeroBtnChange('cta_button_link', e.target.value)}
                className="cms-input"
                placeholder="/en/Contact/ or https://..."
              />
            </div>
          </div>

          {/* Button 2: Service Page CTA */}
          <div className="cms-panel-card">
            <h3 className="panel-title">Service Page Inquiry CTA Banner Button</h3>
            
            <div className="form-group-row">
              <div className="form-group">
                <label className="cms-label">Button Label (English)</label>
                <input
                  type="text"
                  value={serviceCta.button_text_en || 'Contact Form'}
                  onChange={(e) => handleServiceBtnChange('button_text_en', e.target.value)}
                  className="cms-input"
                />
              </div>

              <div className="form-group">
                <label className="cms-label">Button Label (German)</label>
                <input
                  type="text"
                  value={serviceCta.button_text_de || 'Kontaktformular'}
                  onChange={(e) => handleServiceBtnChange('button_text_de', e.target.value)}
                  className="cms-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="cms-label">Destination URL</label>
              <input
                type="text"
                value={serviceCta.button_link || '/en/Contact/'}
                onChange={(e) => handleServiceBtnChange('button_link', e.target.value)}
                className="cms-input"
              />
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
                <span>Buttons Saved!</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Buttons Draft</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminButtons;
