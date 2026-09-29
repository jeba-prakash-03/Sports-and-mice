import React, { useState, useEffect } from 'react';
import { fetchAdminConfig, saveDraftConfig } from '../../services/api';
import AdminCmsHeader from '../../components/admin/AdminCmsHeader';
import { 
  Sparkles, 
  Save, 
  Check, 
  Play, 
  RotateCcw, 
  Sliders, 
  Eye, 
  Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';

const defaultAnimationValues = {
  enabled: true,
  default_type: 'up',
  default_duration: 0.55,
  default_delay: 0.1,
  stagger_children: true,
  page_transition: 'fade',
  card_hover: 'lift',
  reduced_motion_support: true,
  sections: {
    home_hero: { type: 'up', duration: 0.6, delay: 0.1 },
    home_stats: { type: 'fade', duration: 0.5, delay: 0.1 },
    home_cards: { type: 'up', duration: 0.5, delay: 0.15 },
    home_trust: { type: 'up', duration: 0.5, delay: 0.1 },
    home_video: { type: 'right', duration: 0.6, delay: 0.2 },
    service_hero: { type: 'up', duration: 0.5, delay: 0.1 },
    service_cards: { type: 'up', duration: 0.5, delay: 0.15 },
    service_workflow: { type: 'up', duration: 0.5, delay: 0.2 },
    about_hero: { type: 'up', duration: 0.5, delay: 0.1 },
    about_story: { type: 'right', duration: 0.6, delay: 0.15 },
    about_travel: { type: 'up', duration: 0.5, delay: 0.2 },
    hotels_hero: { type: 'up', duration: 0.5, delay: 0.1 },
    hotels_tours: { type: 'up', duration: 0.5, delay: 0.15 },
    contact_hero: { type: 'up', duration: 0.5, delay: 0.1 },
    contact_form: { type: 'left', duration: 0.55, delay: 0.2 }
  }
};

const AdminAnimations = () => {
  const [configData, setConfigData] = useState(null);
  const [animations, setAnimations] = useState(defaultAnimationValues);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const loadData = async () => {
    const res = await fetchAdminConfig();
    if (res.success && res.data) {
      setConfigData(res.data);
      setAnimations(res.data.draft?.animations || defaultAnimationValues);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGlobalChange = (field, value) => {
    setAnimations(prev => ({
      ...prev,
      [field]: value
    }));
    setSaveSuccess(false);
  };

  const handleSectionAnimChange = (secKey, field, value) => {
    setAnimations(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [secKey]: {
          ...(prev.sections?.[secKey] || {}),
          [field]: value
        }
      }
    }));
    setSaveSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updatedConfig = {
      ...(configData?.draft || {}),
      animations
    };

    const res = await saveDraftConfig(updatedConfig, 'Animations Settings');
    if (res.success) {
      setSaveSuccess(true);
      await loadData();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const triggerTestPreview = () => {
    setPreviewKey(prev => prev + 1);
  };

  const getPreviewVariants = (type, distance = 40) => {
    switch (type) {
      case 'up': return { hidden: { opacity: 0, y: distance }, visible: { opacity: 1, y: 0 } };
      case 'down': return { hidden: { opacity: 0, y: -distance }, visible: { opacity: 1, y: 0 } };
      case 'left': return { hidden: { opacity: 0, x: distance }, visible: { opacity: 1, x: 0 } };
      case 'right': return { hidden: { opacity: 0, x: -distance }, visible: { opacity: 1, x: 0 } };
      case 'zoom': return { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } };
      case 'fade': default: return { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    }
  };

  const sectionLabels = [
    { key: 'home_hero', label: 'Home Page: Hero Section' },
    { key: 'home_stats', label: 'Home Page: Stats Counter Strip' },
    { key: 'home_cards', label: 'Home Page: 4 Pillar Feature Cards' },
    { key: 'home_video', label: 'Home Page: Video & Expertise Box' },
    { key: 'service_cards', label: 'Service Page: Service Offerings Grid' },
    { key: 'service_workflow', label: 'Service Page: 4-Step Process Formula' },
    { key: 'about_story', label: 'About Us: High-Performance Sport Story' },
    { key: 'about_travel', label: 'About Us: World Traveler Cards' },
    { key: 'hotels_tours', label: 'Hotels & More: Inspection Tour Cards' },
    { key: 'contact_form', label: 'Contact Page: Form & Info Columns' }
  ];

  return (
    <div className="admin-page-container">
      <AdminCmsHeader 
        onRefresh={loadData} 
        hasChanges={configData?.has_unpublished_changes}
        version={configData?.version}
      />

      <div className="cms-page-header-row">
        <div>
          <h2 className="cms-page-title">Animation & Motion Controller</h2>
          <p className="cms-page-subtitle">Control entrance transitions, duration, delays, and section motion intensity globally or individually.</p>
        </div>
      </div>

      <div className="cms-builder-layout-grid">
        {/* Left: Global & Section Animation Controls */}
        <div className="cms-panel-card anim-controls-panel">
          <form onSubmit={handleSave} className="cms-editor-form">
            <h3 className="panel-title">Global Animation Settings</h3>

            <div className="form-group-row">
              <div className="form-group">
                <label className="cms-label">Animations Master Switch</label>
                <select
                  value={animations.enabled ? 'true' : 'false'}
                  onChange={(e) => handleGlobalChange('enabled', e.target.value === 'true')}
                  className="cms-select"
                >
                  <option value="true">Enabled (Smooth Framer Motion)</option>
                  <option value="false">Disabled (Instant Rendering)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="cms-label">Default Motion Direction</label>
                <select
                  value={animations.default_type || 'up'}
                  onChange={(e) => handleGlobalChange('default_type', e.target.value)}
                  className="cms-select"
                >
                  <option value="up">Fade Up (From Bottom)</option>
                  <option value="down">Fade Down (From Top)</option>
                  <option value="left">Fade Left (From Right)</option>
                  <option value="right">Fade Right (From Left)</option>
                  <option value="zoom">Zoom In</option>
                  <option value="fade">Pure Fade In</option>
                </select>
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label className="cms-label">Default Duration: {animations.default_duration}s</label>
                <input
                  type="range"
                  min="0.2"
                  max="1.5"
                  step="0.05"
                  value={animations.default_duration || 0.55}
                  onChange={(e) => handleGlobalChange('default_duration', parseFloat(e.target.value))}
                  className="cms-range-slider"
                />
              </div>

              <div className="form-group">
                <label className="cms-label">Card Hover Effect</label>
                <select
                  value={animations.card_hover || 'lift'}
                  onChange={(e) => handleGlobalChange('card_hover', e.target.value)}
                  className="cms-select"
                >
                  <option value="lift">Elevate & Shadow Lift (3D)</option>
                  <option value="zoom">Smooth Scale Zoom</option>
                  <option value="glow">Border Glow Only</option>
                  <option value="none">No Hover Motion</option>
                </select>
              </div>
            </div>

            <div className="cms-divider" />

            <h4 className="cms-section-heading">Section-Specific Overrides</h4>

            <div className="sections-anim-override-list">
              {sectionLabels.map(({ key, label }) => {
                const currentSec = animations.sections?.[key] || { type: 'up', duration: 0.55, delay: 0.1 };
                return (
                  <div key={key} className="section-anim-row">
                    <span className="sec-anim-name">{label}</span>
                    
                    <div className="sec-anim-controls">
                      <select
                        value={currentSec.type || 'up'}
                        onChange={(e) => handleSectionAnimChange(key, 'type', e.target.value)}
                        className="cms-select-sm"
                      >
                        <option value="up">Fade Up</option>
                        <option value="down">Fade Down</option>
                        <option value="left">Fade Left</option>
                        <option value="right">Fade Right</option>
                        <option value="zoom">Zoom In</option>
                        <option value="fade">Fade In</option>
                      </select>

                      <div className="slider-compact">
                        <label>Dur: {currentSec.duration}s</label>
                        <input
                          type="range"
                          min="0.2"
                          max="1.5"
                          step="0.05"
                          value={currentSec.duration || 0.55}
                          onChange={(e) => handleSectionAnimChange(key, 'duration', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cms-form-footer">
              <button type="submit" className="cms-btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    <span>Saving Draft...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check size={16} />
                    <span>Draft Saved!</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Animation Draft</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Interactive Animation Sandbox Preview */}
        <div className="cms-panel-card anim-preview-panel">
          <div className="panel-header-with-action">
            <h3 className="panel-title">Motion Sandbox</h3>
            <button 
              type="button" 
              onClick={triggerTestPreview} 
              className="btn-play-preview"
            >
              <Play size={14} />
              <span>Replay Animation</span>
            </button>
          </div>

          <p className="cms-hint">Simulate how sections animate on scroll using your current duration and motion type.</p>

          <div className="anim-sandbox-stage">
            <motion.div
              key={`demo-${previewKey}-${animations.default_type}-${animations.default_duration}`}
              initial="hidden"
              animate="visible"
              variants={getPreviewVariants(animations.default_type)}
              transition={{ duration: animations.default_duration, ease: [0.25, 0.1, 0.25, 1] }}
              className="sandbox-card-demo"
            >
              <div className="sandbox-card-header">
                <span className="sandbox-badge">Sample Section Banner</span>
              </div>
              <h4>High-Performance Sport & MICE</h4>
              <p>Specialized logistics, team hotels, and conference scouting worldwide.</p>
              <div className="sandbox-demo-btn">
                <span>View Details</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnimations;
