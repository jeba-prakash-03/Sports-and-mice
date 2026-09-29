import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import { Save, Check, RefreshCw, Home, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminContent = () => {
  const { token } = useAuth();
  const { refreshContent } = useSite();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const [content, setContent] = useState({
    home: {
      hero_prefix: '',
      hero_tag1: '',
      hero_tag2: '',
      hero_subtitle: '',
      card1_title: '',
      card1_desc: '',
      card2_title: '',
      card2_desc: '',
      card3_title: '',
      card3_desc: '',
      card4_title: '',
      card4_desc: ''
    }
  });

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content.php', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setContent(prev => ({ ...prev, ...json.data }));
        }
      }
    } catch (e) {
      console.error('Failed to load content:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [token]);

  const handleHomeChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      home: {
        ...(prev.home || {}),
        [field]: value
      }
    }));
  };

  const handleSave = async (sectionKey) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content.php?section=${sectionKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content[sectionKey] || {})
      });

      if (res.ok) {
        setMsg({ text: 'Content saved to database and published!', type: 'success' });
        refreshContent();
        setTimeout(() => setMsg(null), 3500);
      } else {
        setMsg({ text: 'Failed to save content.', type: 'error' });
      }
    } catch (e) {
      setMsg({ text: 'Error connecting to server.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Top Header */}
      <div className="admin-card">
        <div className="card-header-flex">
          <div>
            <h2 className="card-heading" style={{ fontSize: '18px' }}>
              Website Content Management (CMS)
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
              Edit headlines, hero banners, and service cards dynamically loaded from the database.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs" style={{ marginTop: '16px', marginBottom: 0 }}>
          <button 
            className={`admin-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Home size={16} /> Home Page
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
          <p style={{ marginTop: '8px' }}>Loading content from database...</p>
        </div>
      ) : activeTab === 'home' && (
        <div className="admin-card">
          <div className="card-header-flex">
            <h3 className="card-heading">Home Page Content</h3>
            <button 
              onClick={() => handleSave('home')} 
              disabled={saving}
              className="btn-admin-primary"
            >
              <Save size={15} /> {saving ? 'Saving...' : 'Save to Database'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Hero Section */}
            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', color: '#0f172a' }}>Hero Banner</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Title Prefix</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sports associations &"
                    value={content.home?.hero_prefix || ''}
                    onChange={(e) => handleHomeChange('hero_prefix', e.target.value)}
                    className="admin-text-input"
                  />
                </div>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Blue Box Tag 1</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Meetings ♢ Incentives"
                    value={content.home?.hero_tag1 || ''}
                    onChange={(e) => handleHomeChange('hero_tag1', e.target.value)}
                    className="admin-text-input"
                  />
                </div>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Blue Box Tag 2</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Conferences ♢ Events"
                    value={content.home?.hero_tag2 || ''}
                    onChange={(e) => handleHomeChange('hero_tag2', e.target.value)}
                    className="admin-text-input"
                  />
                </div>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label>Subtitle</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sport needs professional structures..."
                    value={content.home?.hero_subtitle || ''}
                    onChange={(e) => handleHomeChange('hero_subtitle', e.target.value)}
                    className="admin-text-input"
                  />
                </div>
              </div>
            </div>

            {/* 4 Cards Grid Editor */}
            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', color: '#0f172a' }}>4 Feature Cards</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Card 1 */}
                <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>CARD 1 TITLE</label>
                  <input 
                    type="text" 
                    placeholder="TEAM TRIPS"
                    value={content.home?.card1_title || ''}
                    onChange={(e) => handleHomeChange('card1_title', e.target.value)}
                    className="admin-text-input"
                    style={{ marginBottom: '8px' }}
                  />
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>CARD 1 DESCRIPTION</label>
                  <textarea 
                    rows="3"
                    placeholder="Card description..."
                    value={content.home?.card1_desc || ''}
                    onChange={(e) => handleHomeChange('card1_desc', e.target.value)}
                    className="admin-textarea"
                  />
                </div>

                {/* Card 2 */}
                <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>CARD 2 TITLE</label>
                  <input 
                    type="text" 
                    placeholder="MEETINGS"
                    value={content.home?.card2_title || ''}
                    onChange={(e) => handleHomeChange('card2_title', e.target.value)}
                    className="admin-text-input"
                    style={{ marginBottom: '8px' }}
                  />
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>CARD 2 DESCRIPTION</label>
                  <textarea 
                    rows="3"
                    placeholder="Card description..."
                    value={content.home?.card2_desc || ''}
                    onChange={(e) => handleHomeChange('card2_desc', e.target.value)}
                    className="admin-textarea"
                  />
                </div>

                {/* Card 3 */}
                <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>CARD 3 TITLE</label>
                  <input 
                    type="text" 
                    placeholder="CONFERENCES"
                    value={content.home?.card3_title || ''}
                    onChange={(e) => handleHomeChange('card3_title', e.target.value)}
                    className="admin-text-input"
                    style={{ marginBottom: '8px' }}
                  />
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>CARD 3 DESCRIPTION</label>
                  <textarea 
                    rows="3"
                    placeholder="Card description..."
                    value={content.home?.card3_desc || ''}
                    onChange={(e) => handleHomeChange('card3_desc', e.target.value)}
                    className="admin-textarea"
                  />
                </div>

                {/* Card 4 */}
                <div style={{ backgroundColor: '#ffffff', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>CARD 4 TITLE</label>
                  <input 
                    type="text" 
                    placeholder="INCENTIVES"
                    value={content.home?.card4_title || ''}
                    onChange={(e) => handleHomeChange('card4_title', e.target.value)}
                    className="admin-text-input"
                    style={{ marginBottom: '8px' }}
                  />
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>CARD 4 DESCRIPTION</label>
                  <textarea 
                    rows="3"
                    placeholder="Card description..."
                    value={content.home?.card4_desc || ''}
                    onChange={(e) => handleHomeChange('card4_desc', e.target.value)}
                    className="admin-textarea"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminContent;
