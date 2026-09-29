import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import { resetConfig, API_BASE_URL } from '../../services/api';
import { Save, Check, RefreshCw, Mail, Phone, Server, Send, AlertTriangle, RotateCcw, ShieldAlert, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSettings = () => {
  const { token } = useAuth();
  const { refreshSettings, loadSiteConfig } = useSite();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [msg, setMsg] = useState(null);

  const [settings, setSettings] = useState({
    site_name: '',
    company_name: '',
    founder_name: '',
    phone: '',
    fax: '',
    email: '',
    admin_notification_email: '',
    address_street: '',
    address_city: '',
    address_country: '',
    linkedin_url: '',
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    smtp_from: '',
    smtp_from_name: '',
    email_notifications_enabled: 'true',
    visitor_autoresponder_enabled: 'true'
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings.php`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSettings(prev => ({ ...prev, ...json.data }));
        }
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        setMsg({ text: 'Settings saved to database successfully!', type: 'success' });
        refreshSettings();
        setTimeout(() => setMsg(null), 3500);
      } else {
        setMsg({ text: 'Failed to update settings.', type: 'error' });
      }
    } catch (e) {
      setMsg({ text: 'Error connecting to server.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (resetConfirmText.trim().toUpperCase() !== 'RESET') {
      alert("Please type 'RESET' in the confirmation box to proceed.");
      return;
    }
    setResetting(true);
    try {
      const res = await resetConfig();
      if (res.success) {
        setMsg({ text: '✓ Website has been reset to default configuration.', type: 'success' });
        setShowResetConfirm(false);
        setResetConfirmText('');
        await loadSiteConfig(false);
        fetchSettings();
      } else {
        setMsg({ text: res.error || 'Failed to reset website defaults.', type: 'error' });
      }
    } catch (e) {
      setMsg({ text: 'Reset request failed.', type: 'error' });
    } finally {
      setResetting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Top Header Card */}
      <div className="admin-card">
        <div className="card-header-flex">
          <div>
            <h2 className="card-heading" style={{ fontSize: '18px' }}>
              Website Settings & Email Alerts
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
              Manage website contact details, automated visitor emails, and SMTP parameters stored in database.
            </p>
          </div>
          {activeTab !== 'advanced' && (
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="btn-admin-primary"
            >
              <Save size={15} /> {saving ? 'Saving...' : 'Save Settings to DB'}
            </button>
          )}
        </div>

        {/* Tab selector */}
        <div className="admin-tabs" style={{ marginTop: '16px', marginBottom: 0 }}>
          <button 
            className={`admin-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Phone size={15} /> Contact & Branding
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Mail size={15} /> Notifications & Alerts
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'smtp' ? 'active' : ''}`}
            onClick={() => setActiveTab('smtp')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Server size={15} /> SMTP Mail Configuration
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ShieldAlert size={15} /> Advanced / System
          </button>
        </div>
      </div>

      {msg && (
        <div style={{
          backgroundColor: msg.type === 'error' ? '#fef2f2' : '#f0fdf4',
          color: msg.type === 'error' ? '#dc2626' : '#16a34a',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontWeight: '600',
          fontSize: '13.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: `1px solid ${msg.type === 'error' ? '#fee2e2' : '#bbf7d0'}`
        }}>
          <Check size={16} />
          <span>{msg.text}</span>
        </div>
      )}

      {loading ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '50px 0', color: '#64748b' }}>
          <RefreshCw size={24} className="spin-icon" style={{ color: '#106cc2' }} />
          <p style={{ marginTop: '8px' }}>Loading settings from database...</p>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          {/* Tab 1: General & Contact Info */}
          {activeTab === 'general' && (
            <div className="admin-card">
              <div className="card-header-flex">
                <h3 className="card-heading">Contact Details & Public Info</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-input-group">
                  <label>Website Name</label>
                  <input 
                    type="text" 
                    value={settings.site_name || ''}
                    onChange={(e) => handleChange('site_name', e.target.value)}
                    className="admin-text-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label>Company Legal Name</label>
                  <input 
                    type="text" 
                    value={settings.company_name || ''}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    className="admin-text-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label>Founder / Managing Director</label>
                  <input 
                    type="text" 
                    value={settings.founder_name || ''}
                    onChange={(e) => handleChange('founder_name', e.target.value)}
                    className="admin-text-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label>Public Contact Email</label>
                  <input 
                    type="email" 
                    value={settings.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="admin-text-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    value={settings.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="admin-text-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label>Fax Number</label>
                  <input 
                    type="text" 
                    value={settings.fax || ''}
                    onChange={(e) => handleChange('fax', e.target.value)}
                    className="admin-text-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label>Street Address</label>
                  <input 
                    type="text" 
                    value={settings.address_street || ''}
                    onChange={(e) => handleChange('address_street', e.target.value)}
                    className="admin-text-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label>City & Zip Code</label>
                  <input 
                    type="text" 
                    value={settings.address_city || ''}
                    onChange={(e) => handleChange('address_city', e.target.value)}
                    className="admin-text-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label>Country</label>
                  <input 
                    type="text" 
                    value={settings.address_country || ''}
                    onChange={(e) => handleChange('address_country', e.target.value)}
                    className="admin-text-input"
                  />
                </div>

                <div className="admin-input-group">
                  <label>LinkedIn Profile URL</label>
                  <input 
                    type="url" 
                    value={settings.linkedin_url || ''}
                    onChange={(e) => handleChange('linkedin_url', e.target.value)}
                    className="admin-text-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Notifications */}
          {activeTab === 'email' && (
            <div className="admin-card">
              <div className="card-header-flex">
                <h3 className="card-heading">Form Submission Email Alerts</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="admin-input-group">
                  <label>Admin Notification Email (Receives New Form Alerts)</label>
                  <input 
                    type="email" 
                    value={settings.admin_notification_email || ''}
                    onChange={(e) => handleChange('admin_notification_email', e.target.value)}
                    className="admin-text-input"
                    placeholder="jebaprakash115@gmail.com"
                  />
                  <small style={{ color: '#64748b', display: 'block', marginTop: '4px' }}>
                    All inquiries submitted on the public website will be sent directly to this address.
                  </small>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
                  <input 
                    type="checkbox"
                    id="notif_toggle"
                    checked={settings.email_notifications_enabled === 'true' || settings.email_notifications_enabled === true}
                    onChange={(e) => handleChange('email_notifications_enabled', e.target.checked ? 'true' : 'false')}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="notif_toggle" style={{ margin: 0, cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                    Enable Admin Email Alerts on Form Submission
                  </label>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
                  <input 
                    type="checkbox"
                    id="auto_toggle"
                    checked={settings.visitor_autoresponder_enabled === 'true' || settings.visitor_autoresponder_enabled === true}
                    onChange={(e) => handleChange('visitor_autoresponder_enabled', e.target.checked ? 'true' : 'false')}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="auto_toggle" style={{ margin: 0, cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                    Enable Automatic Formal Acknowledgement Email to Visitor
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: SMTP Server */}
          {activeTab === 'smtp' && (
            <div className="admin-card">
              <div className="card-header-flex">
                <h3 className="card-heading">SMTP Mail Configuration</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-input-group">
                  <label>SMTP Host</label>
                  <input 
                    type="text" 
                    value={settings.smtp_host || ''}
                    onChange={(e) => handleChange('smtp_host', e.target.value)}
                    className="admin-text-input"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div className="admin-input-group">
                  <label>SMTP Port</label>
                  <input 
                    type="text" 
                    value={settings.smtp_port || '587'}
                    onChange={(e) => handleChange('smtp_port', e.target.value)}
                    className="admin-text-input"
                    placeholder="587"
                  />
                </div>

                <div className="admin-input-group">
                  <label>SMTP Username / Email</label>
                  <input 
                    type="text" 
                    value={settings.smtp_user || ''}
                    onChange={(e) => handleChange('smtp_user', e.target.value)}
                    className="admin-text-input"
                    placeholder="jebaprakash115@gmail.com"
                  />
                </div>

                <div className="admin-input-group">
                  <label>SMTP Password / App Password</label>
                  <input 
                    type="password" 
                    value={settings.smtp_pass || ''}
                    onChange={(e) => handleChange('smtp_pass', e.target.value)}
                    className="admin-text-input"
                    placeholder="••••••••"
                  />
                </div>

                <div className="admin-input-group">
                  <label>From Email Address</label>
                  <input 
                    type="email" 
                    value={settings.smtp_from || ''}
                    onChange={(e) => handleChange('smtp_from', e.target.value)}
                    className="admin-text-input"
                    placeholder="jebaprakash115@gmail.com"
                  />
                </div>

                <div className="admin-input-group">
                  <label>From Name</label>
                  <input 
                    type="text" 
                    value={settings.smtp_from_name || ''}
                    onChange={(e) => handleChange('smtp_from_name', e.target.value)}
                    className="admin-text-input"
                    placeholder="Sports & MICE"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Advanced System Maintenance */}
          {activeTab === 'advanced' && (
            <div className="admin-card">
              <div className="card-header-flex">
                <div>
                  <h3 className="card-heading" style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} /> Danger Zone: Factory Reset
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0 0' }}>
                    Irreversible administrative actions. Please proceed with caution.
                  </p>
                </div>
              </div>

              <div style={{
                background: '#fff5f5',
                border: '1px solid #fed7d7',
                borderRadius: '8px',
                padding: '24px',
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div style={{ maxWidth: '650px' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#991b1b', fontSize: '15px', fontWeight: 700 }}>
                    Reset Website Configuration to Factory Defaults
                  </h4>
                  <p style={{ margin: 0, color: '#7f1d1d', fontSize: '13px', lineHeight: '1.5' }}>
                    Restores the original Sports & MICE default theme palette, section layouts, hero headings, and global navigation. 
                    All unpublished drafts will be discarded. This action requires typed confirmation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '11px 20px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                >
                  <RotateCcw size={15} />
                  <span>Reset Defaults...</span>
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="cms-modal-backdrop" onClick={() => setShowResetConfirm(false)}>
            <motion.div 
              className="cms-modal-box"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cms-modal-icon reset-icon">
                <AlertTriangle size={32} />
              </div>
              <h3>Reset Website to Defaults?</h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '16px' }}>
                This will restore all default layout sections, theme colors, navigation links, and draft configurations. 
                Any custom page content or colors will be permanently replaced with default values.
              </p>

              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  To confirm, please type <span style={{ color: '#dc2626', fontWeight: 700 }}>RESET</span> below:
                </label>
                <input
                  type="text"
                  value={resetConfirmText}
                  onChange={(e) => setResetConfirmText(e.target.value)}
                  placeholder="RESET"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '1px'
                  }}
                />
              </div>

              <div className="cms-modal-actions">
                <button 
                  className="btn-modal-cancel" 
                  onClick={() => {
                    setShowResetConfirm(false);
                    setResetConfirmText('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn-modal-confirm danger-btn" 
                  onClick={handleResetDefaults}
                  disabled={resetting || resetConfirmText.trim().toUpperCase() !== 'RESET'}
                  style={{
                    opacity: resetConfirmText.trim().toUpperCase() === 'RESET' ? 1 : 0.5,
                    cursor: resetConfirmText.trim().toUpperCase() === 'RESET' ? 'pointer' : 'not-allowed'
                  }}
                >
                  {resetting ? <Loader2 size={15} className="spin-icon" /> : <RotateCcw size={15} />}
                  <span>{resetting ? 'Resetting...' : 'Confirm Reset'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminSettings;
