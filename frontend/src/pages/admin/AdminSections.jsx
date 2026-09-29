import React, { useState, useEffect } from 'react';
import { fetchAdminConfig, saveDraftConfig } from '../../services/api';
import AdminCmsHeader from '../../components/admin/AdminCmsHeader';
import { 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Save, 
  Check, 
  RotateCcw, 
  Edit3, 
  Image as ImageIcon,
  Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSections = () => {
  const [configData, setConfigData] = useState(null);
  const [draftSections, setDraftSections] = useState({});
  const [activePageId, setActivePageId] = useState('home');
  const [editingSection, setEditingSection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadData = async () => {
    const res = await fetchAdminConfig();
    if (res.success && res.data) {
      setConfigData(res.data);
      const secs = res.data.draft?.sections || {};
      setDraftSections(secs);
      if (secs['home'] && secs['home'].length > 0) {
        setEditingSection(secs['home'][0]);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentSectionList = draftSections[activePageId] || [];

  const handleSelectPage = (pageId) => {
    setActivePageId(pageId);
    const secs = draftSections[pageId] || [];
    setEditingSection(secs.length > 0 ? secs[0] : null);
  };

  const handleToggleSection = (pageId, sectionId) => {
    setDraftSections(prev => {
      const list = [...(prev[pageId] || [])];
      const index = list.findIndex(s => s.id === sectionId);
      if (index !== -1) {
        list[index] = {
          ...list[index],
          enabled: list[index].enabled === false ? true : false
        };
      }
      return { ...prev, [pageId]: list };
    });
    setSaveSuccess(false);
  };

  const handleMoveSection = (pageId, index, direction) => {
    setDraftSections(prev => {
      const list = [...(prev[pageId] || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;

      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;

      // Update order field
      list.forEach((sec, idx) => {
        sec.order = idx + 1;
      });

      return { ...prev, [pageId]: list };
    });
    setSaveSuccess(false);
  };

  const handleSectionFieldChange = (field, value) => {
    if (!editingSection) return;
    const updated = { ...editingSection, [field]: value };
    setEditingSection(updated);

    setDraftSections(prev => {
      const list = [...(prev[activePageId] || [])];
      const index = list.findIndex(s => s.id === editingSection.id);
      if (index !== -1) {
        list[index] = updated;
      }
      return { ...prev, [activePageId]: list };
    });
    setSaveSuccess(false);
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    const updatedConfig = {
      ...(configData?.draft || {}),
      sections: draftSections
    };

    const res = await saveDraftConfig(updatedConfig, `Sections Manager (${activePageId})`);
    if (res.success) {
      setSaveSuccess(true);
      await loadData();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const pages = [
    { id: 'home', label: 'Home Page' },
    { id: 'service', label: 'Service Page' },
    { id: 'about', label: 'About Us Page' },
    { id: 'hotels', label: 'Hotels & More Page' },
    { id: 'contact', label: 'Contact Page' }
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
          <h2 className="cms-page-title">Section Management & Layout</h2>
          <p className="cms-page-subtitle">Reorder sections, toggle section visibility, and customize content and background graphics.</p>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="cms-tabs-bar">
        {pages.map(p => (
          <button
            key={p.id}
            type="button"
            className={`cms-tab-btn ${activePageId === p.id ? 'active' : ''}`}
            onClick={() => handleSelectPage(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="cms-builder-layout-grid">
        {/* Left: Reorderable Sections List */}
        <div className="cms-panel-card sections-list-panel">
          <div className="panel-header-simple">
            <h3 className="panel-title">Page Sections ({currentSectionList.length})</h3>
            <span className="cms-hint-badge">Display Order (Top to Bottom)</span>
          </div>

          <div className="sections-draggable-list">
            {currentSectionList.map((sec, idx) => {
              const isEnabled = sec.enabled !== false;
              const isSelected = editingSection?.id === sec.id;

              return (
                <div 
                  key={sec.id} 
                  className={`section-item-row ${isSelected ? 'active-editing' : ''} ${!isEnabled ? 'is-disabled' : ''}`}
                >
                  <div className="section-order-controls">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(activePageId, idx, 'up')}
                      className="btn-order-arrow"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === currentSectionList.length - 1}
                      onClick={() => handleMoveSection(activePageId, idx, 'down')}
                      className="btn-order-arrow"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div 
                    className="section-info-block"
                    onClick={() => setEditingSection(sec)}
                  >
                    <span className="section-num-tag">{idx + 1}</span>
                    <div className="section-name-block">
                      <h4 className="section-name-title">{sec.name || sec.id}</h4>
                      <p className="section-id-hint">{sec.id}</p>
                    </div>
                  </div>

                  <div className="section-actions-right">
                    <button
                      type="button"
                      onClick={() => handleToggleSection(activePageId, sec.id)}
                      className={`btn-toggle-eye ${isEnabled ? 'eye-on' : 'eye-off'}`}
                      title={isEnabled ? 'Visible on public site' : 'Hidden on public site'}
                    >
                      {isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingSection(sec)}
                      className="btn-edit-sec-icon"
                      title="Edit section content"
                    >
                      <Edit3 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Section Content & Media Editor */}
        <div className="cms-panel-card section-editor-panel">
          {editingSection ? (
            <form onSubmit={handleSave} className="cms-editor-form">
              <div className="panel-header-with-action">
                <div>
                  <h3 className="panel-title">Editing: {editingSection.name || editingSection.id}</h3>
                  <p className="panel-sub-desc">Section ID: <code>{editingSection.id}</code></p>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleToggleSection(activePageId, editingSection.id)}
                  className={`btn-toggle-visibility ${editingSection.enabled !== false ? 'btn-vis-on' : 'btn-vis-off'}`}
                >
                  {editingSection.enabled !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                  <span>{editingSection.enabled !== false ? 'Section Enabled' : 'Section Disabled'}</span>
                </button>
              </div>

              {/* Dynamic Form Controls depending on Section Type */}
              {editingSection.heading_prefix_en !== undefined && (
                <div className="form-group-row">
                  <div className="form-group">
                    <label className="cms-label">Heading Prefix (English)</label>
                    <input
                      type="text"
                      value={editingSection.heading_prefix_en || ''}
                      onChange={(e) => handleSectionFieldChange('heading_prefix_en', e.target.value)}
                      className="cms-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="cms-label">Heading Prefix (German)</label>
                    <input
                      type="text"
                      value={editingSection.heading_prefix_de || ''}
                      onChange={(e) => handleSectionFieldChange('heading_prefix_de', e.target.value)}
                      className="cms-input"
                    />
                  </div>
                </div>
              )}

              {editingSection.title_en !== undefined && (
                <div className="form-group-row">
                  <div className="form-group">
                    <label className="cms-label">Section Title (English)</label>
                    <input
                      type="text"
                      value={editingSection.title_en || ''}
                      onChange={(e) => handleSectionFieldChange('title_en', e.target.value)}
                      className="cms-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="cms-label">Section Title (German)</label>
                    <input
                      type="text"
                      value={editingSection.title_de || ''}
                      onChange={(e) => handleSectionFieldChange('title_de', e.target.value)}
                      className="cms-input"
                    />
                  </div>
                </div>
              )}

              {editingSection.subtitle_en !== undefined && (
                <div className="form-group">
                  <label className="cms-label">Subtitle / Tagline (English)</label>
                  <textarea
                    rows="2"
                    value={editingSection.subtitle_en || ''}
                    onChange={(e) => handleSectionFieldChange('subtitle_en', e.target.value)}
                    className="cms-textarea"
                  />
                </div>
              )}

              {editingSection.tag1_en !== undefined && (
                <div className="form-group-row">
                  <div className="form-group">
                    <label className="cms-label">Highlight Tag Line 1</label>
                    <input
                      type="text"
                      value={editingSection.tag1_en || ''}
                      onChange={(e) => handleSectionFieldChange('tag1_en', e.target.value)}
                      className="cms-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="cms-label">Highlight Tag Line 2</label>
                    <input
                      type="text"
                      value={editingSection.tag2_en || ''}
                      onChange={(e) => handleSectionFieldChange('tag2_en', e.target.value)}
                      className="cms-input"
                    />
                  </div>
                </div>
              )}

              {editingSection.video_url !== undefined && (
                <div className="form-group">
                  <label className="cms-label">YouTube Video Embed URL</label>
                  <input
                    type="text"
                    value={editingSection.video_url || ''}
                    onChange={(e) => handleSectionFieldChange('video_url', e.target.value)}
                    className="cms-input"
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>
              )}

              {editingSection.bg_image !== undefined && (
                <div className="form-group">
                  <label className="cms-label">Section Background Image Path</label>
                  <input
                    type="text"
                    value={editingSection.bg_image || ''}
                    onChange={(e) => handleSectionFieldChange('bg_image', e.target.value)}
                    className="cms-input"
                  />
                  {editingSection.bg_image && (
                    <div className="image-preview-mini" style={{ backgroundImage: `url(${editingSection.bg_image})` }} />
                  )}
                </div>
              )}

              {editingSection.photo !== undefined && (
                <div className="form-group">
                  <label className="cms-label">Feature Photo URL</label>
                  <input
                    type="text"
                    value={editingSection.photo || ''}
                    onChange={(e) => handleSectionFieldChange('photo', e.target.value)}
                    className="cms-input"
                  />
                  {editingSection.photo && (
                    <img src={editingSection.photo} alt="Preview" className="img-thumbnail-preview" />
                  )}
                </div>
              )}

              {editingSection.p1_en !== undefined && (
                <div className="form-group">
                  <label className="cms-label">Main Paragraph Content (English)</label>
                  <textarea
                    rows="3"
                    value={editingSection.p1_en || ''}
                    onChange={(e) => handleSectionFieldChange('p1_en', e.target.value)}
                    className="cms-textarea"
                  />
                </div>
              )}

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
                      <span>Save Section Draft</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="cms-empty-selection">
              <Layers size={40} className="empty-icon" />
              <h4>Select a section to edit its content</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSections;
