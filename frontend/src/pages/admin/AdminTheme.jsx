import React, { useState, useEffect } from 'react';
import { fetchAdminConfig, saveDraftConfig } from '../../services/api';
import AdminCmsHeader from '../../components/admin/AdminCmsHeader';
import { 
  Palette, 
  Save, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  Type, 
  Layout, 
  Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';

const defaultThemeValues = {
  primary_color: '#ff0000',
  primary_hover: '#e60000',
  secondary_color: '#106cc2',
  accent_color: '#ff6b6b',
  dark_bg: '#1f242d',
  card_bg: '#faf5fa',
  card_border: '#ede4ed',
  text_primary: '#222222',
  text_secondary: '#555555',
  font_family: "'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  border_radius: '8px',
  button_border_radius: '50px'
};

const AdminTheme = () => {
  const [configData, setConfigData] = useState(null);
  const [theme, setTheme] = useState(defaultThemeValues);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadData = async () => {
    const res = await fetchAdminConfig();
    if (res.success && res.data) {
      setConfigData(res.data);
      setTheme(res.data.draft?.theme || defaultThemeValues);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleColorChange = (key, value) => {
    setTheme(prev => ({
      ...prev,
      [key]: value
    }));
    setSaveSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updatedConfig = {
      ...(configData?.draft || {}),
      theme
    };

    const res = await saveDraftConfig(updatedConfig, 'Theme & Colors');
    if (res.success) {
      setSaveSuccess(true);
      await loadData();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleResetTheme = () => {
    if (window.confirm('Reset theme colors and typography to default Sports & MICE brand identity?')) {
      setTheme(defaultThemeValues);
      setSaveSuccess(false);
    }
  };

  const presets = [
    {
      name: 'Sports & MICE Classic (Red & Navy)',
      primary: '#ff0000',
      primary_hover: '#e60000',
      secondary: '#106cc2',
      dark: '#1f242d',
      card_bg: '#faf5fa'
    },
    {
      name: 'Executive Crimson',
      primary: '#dc2626',
      primary_hover: '#b91c1c',
      secondary: '#0284c7',
      dark: '#0f172a',
      card_bg: '#f8fafc'
    },
    {
      name: 'Modern Athletic (Scarlet & Obsidian)',
      primary: '#ef4444',
      primary_hover: '#dc2626',
      secondary: '#2563eb',
      dark: '#18181b',
      card_bg: '#f4f4f5'
    }
  ];

  const applyPreset = (p) => {
    setTheme(prev => ({
      ...prev,
      primary_color: p.primary,
      primary_hover: p.primary_hover,
      secondary_color: p.secondary,
      dark_bg: p.dark,
      card_bg: p.card_bg
    }));
    setSaveSuccess(false);
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
          <h2 className="cms-page-title">Theme & Color Customizer</h2>
          <p className="cms-page-subtitle">Customize your brand color palette, fonts, card backgrounds, and button styles.</p>
        </div>

        <button type="button" onClick={handleResetTheme} className="btn-secondary-action">
          <RotateCcw size={15} />
          <span>Reset to Brand Colors</span>
        </button>
      </div>

      {/* Color Presets */}
      <div className="cms-presets-bar">
        <span className="preset-label">Quick Presets:</span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            className="preset-btn"
            onClick={() => applyPreset(preset)}
          >
            <span className="preset-color-dots">
              <span style={{ backgroundColor: preset.primary }} />
              <span style={{ backgroundColor: preset.secondary }} />
              <span style={{ backgroundColor: preset.dark }} />
            </span>
            <span>{preset.name}</span>
          </button>
        ))}
      </div>

      <div className="cms-builder-layout-grid">
        {/* Left Form: Theme Controls */}
        <div className="cms-panel-card theme-controls-panel">
          <h3 className="panel-title">Brand Color Palette</h3>

          <form onSubmit={handleSave} className="cms-editor-form">
            <div className="color-inputs-grid">
              {/* Primary Red */}
              <div className="color-field-card">
                <label className="color-label">Primary Brand Red</label>
                <div className="color-picker-wrap">
                  <input
                    type="color"
                    value={theme.primary_color || '#ff0000'}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                    className="color-input-circle"
                  />
                  <input
                    type="text"
                    value={theme.primary_color || ''}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                    className="color-hex-text"
                  />
                </div>
              </div>

              {/* Primary Hover */}
              <div className="color-field-card">
                <label className="color-label">Primary Hover State</label>
                <div className="color-picker-wrap">
                  <input
                    type="color"
                    value={theme.primary_hover || '#e60000'}
                    onChange={(e) => handleColorChange('primary_hover', e.target.value)}
                    className="color-input-circle"
                  />
                  <input
                    type="text"
                    value={theme.primary_hover || ''}
                    onChange={(e) => handleColorChange('primary_hover', e.target.value)}
                    className="color-hex-text"
                  />
                </div>
              </div>

              {/* Secondary Blue */}
              <div className="color-field-card">
                <label className="color-label">Secondary MICE Blue</label>
                <div className="color-picker-wrap">
                  <input
                    type="color"
                    value={theme.secondary_color || '#106cc2'}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                    className="color-input-circle"
                  />
                  <input
                    type="text"
                    value={theme.secondary_color || ''}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                    className="color-hex-text"
                  />
                </div>
              </div>

              {/* Dark Banner Background */}
              <div className="color-field-card">
                <label className="color-label">Dark Strip & Footer Bg</label>
                <div className="color-picker-wrap">
                  <input
                    type="color"
                    value={theme.dark_bg || '#1f242d'}
                    onChange={(e) => handleColorChange('dark_bg', e.target.value)}
                    className="color-input-circle"
                  />
                  <input
                    type="text"
                    value={theme.dark_bg || ''}
                    onChange={(e) => handleColorChange('dark_bg', e.target.value)}
                    className="color-hex-text"
                  />
                </div>
              </div>

              {/* Card Background */}
              <div className="color-field-card">
                <label className="color-label">Feature Card Background</label>
                <div className="color-picker-wrap">
                  <input
                    type="color"
                    value={theme.card_bg || '#faf5fa'}
                    onChange={(e) => handleColorChange('card_bg', e.target.value)}
                    className="color-input-circle"
                  />
                  <input
                    type="text"
                    value={theme.card_bg || ''}
                    onChange={(e) => handleColorChange('card_bg', e.target.value)}
                    className="color-hex-text"
                  />
                </div>
              </div>

              {/* Text Primary */}
              <div className="color-field-card">
                <label className="color-label">Primary Text Color</label>
                <div className="color-picker-wrap">
                  <input
                    type="color"
                    value={theme.text_primary || '#222222'}
                    onChange={(e) => handleColorChange('text_primary', e.target.value)}
                    className="color-input-circle"
                  />
                  <input
                    type="text"
                    value={theme.text_primary || ''}
                    onChange={(e) => handleColorChange('text_primary', e.target.value)}
                    className="color-hex-text"
                  />
                </div>
              </div>
            </div>

            <div className="cms-divider" />

            <h4 className="cms-section-heading">Typography & Shapes</h4>

            <div className="form-group-row">
              <div className="form-group">
                <label className="cms-label">Font Family</label>
                <select
                  value={theme.font_family || ''}
                  onChange={(e) => handleColorChange('font_family', e.target.value)}
                  className="cms-select"
                >
                  <option value="'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif">Open Sans (Default Corporate)</option>
                  <option value="'Roboto', -apple-system, BlinkMacSystemFont, sans-serif">Roboto (Clean Sans)</option>
                  <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Modern Agency)</option>
                  <option value="'Inter', sans-serif">Inter (Precision Tech)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="cms-label">Card Border Radius</label>
                <select
                  value={theme.border_radius || '8px'}
                  onChange={(e) => handleColorChange('border_radius', e.target.value)}
                  className="cms-select"
                >
                  <option value="4px">4px (Sharp / Subtle)</option>
                  <option value="8px">8px (Standard Rounded)</option>
                  <option value="12px">12px (Smooth Modern)</option>
                  <option value="16px">16px (Extra Rounded)</option>
                </select>
              </div>
            </div>

            <div className="cms-form-footer">
              <button type="submit" className="cms-btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    <span>Saving Theme Draft...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check size={16} />
                    <span>Theme Saved!</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Theme Draft</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview Card: Interactive Component Demo */}
        <div className="cms-panel-card theme-preview-panel">
          <h3 className="panel-title">Live Component Preview</h3>
          <p className="cms-hint">See how your buttons, cards, and banners look with the chosen colors.</p>

          <div className="theme-live-preview-stage" style={{ fontFamily: theme.font_family }}>
            {/* Demo Hero Badge */}
            <div 
              className="demo-blue-box" 
              style={{ backgroundColor: theme.secondary_color, borderRadius: theme.border_radius }}
            >
              <div>Meetings ♢ Incentives</div>
              <div>Conferences ♢ Events</div>
            </div>

            {/* Demo Button */}
            <div style={{ marginTop: '16px' }}>
              <button 
                type="button" 
                className="demo-btn-pill"
                style={{ 
                  backgroundColor: theme.primary_color,
                  borderRadius: theme.button_border_radius,
                  color: '#ffffff'
                }}
              >
                Get Free Consultation →
              </button>
            </div>

            {/* Demo Feature Card */}
            <div 
              className="demo-feature-card"
              style={{ 
                backgroundColor: theme.card_bg,
                borderColor: theme.card_border,
                borderRadius: theme.border_radius,
                color: theme.text_primary
              }}
            >
              <div className="demo-card-badge" style={{ color: theme.primary_color, backgroundColor: 'rgba(255,0,0,0.08)' }}>
                01
              </div>
              <h4 style={{ color: theme.text_primary, margin: '0 0 8px 0' }}>TEAM TRIPS</h4>
              <p style={{ color: theme.text_secondary, fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
                High-quality food and an environment in which sports delegations prepare in a focused manner.
              </p>
            </div>

            {/* Demo Dark Stats Strip */}
            <div 
              className="demo-stats-strip"
              style={{ 
                backgroundColor: theme.dark_bg,
                borderRadius: theme.border_radius,
                borderBottom: `3px solid ${theme.primary_color}`
              }}
            >
              <div>
                <span className="demo-stat-num" style={{ color: '#ffffff' }}>15+</span>
                <span className="demo-stat-label">Years Experience</span>
              </div>
              <div>
                <span className="demo-stat-num" style={{ color: '#ffffff' }}>500+</span>
                <span className="demo-stat-label">MICE Events</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTheme;
