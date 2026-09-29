import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchAdminConfig, saveDraftConfig } from '../../services/api';
import AdminCmsHeader from '../../components/admin/AdminCmsHeader';
import { 
  FileText, 
  Save, 
  Check, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  Search, 
  Loader2,
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPages = () => {
  const [configData, setConfigData] = useState(null);
  const [draftPages, setDraftPages] = useState({});
  const [activePageId, setActivePageId] = useState('home');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Page Modal State
  const [newPageModalOpen, setNewPageModalOpen] = useState(false);
  const [newPageForm, setNewPageForm] = useState({
    name: '',
    slug: '',
    layout: 'hero_content',
    addToNav: true,
    navLabel: '',
    isPublished: true,
    seoTitle: '',
    seoDescription: ''
  });

  const loadData = async () => {
    const res = await fetchAdminConfig();
    if (res.success && res.data) {
      setConfigData(res.data);
      const pages = res.data.draft?.pages || {};
      setDraftPages(pages);
      if (!pages[activePageId]) {
        setActivePageId(Object.keys(pages)[0] || 'home');
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFieldChange = (pageId, field, value) => {
    setDraftPages(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [field]: value
      }
    }));
    setSaveSuccess(false);
  };

  const handleToggleEnabled = (pageId) => {
    const current = draftPages[pageId]?.enabled !== false;
    handleFieldChange(pageId, 'enabled', !current);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updatedConfig = {
      ...(configData?.draft || {}),
      pages: draftPages
    };

    const res = await saveDraftConfig(updatedConfig, `Pages Manager (${activePageId})`);
    if (res.success) {
      setSaveSuccess(true);
      await loadData();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  // Duplicate Page
  const handleDuplicatePage = async (pageIdToClone) => {
    const sourcePage = draftPages[pageIdToClone];
    if (!sourcePage) return;

    const newSlug = `${sourcePage.slug || pageIdToClone}-copy`;
    const newPageId = newSlug;

    const duplicatedPage = {
      ...JSON.parse(JSON.stringify(sourcePage)),
      id: newPageId,
      slug: newSlug,
      title: `${sourcePage.title || pageIdToClone} (Copy)`,
      seo_title: `${sourcePage.seo_title || pageIdToClone} (Copy)`
    };

    const sourceSections = configData?.draft?.sections?.[pageIdToClone] || [];
    const duplicatedSections = sourceSections.map((sec, idx) => ({
      ...JSON.parse(JSON.stringify(sec)),
      id: `${newPageId}_${sec.type || 'sec'}_${idx + 1}`
    }));

    const updatedConfig = {
      ...(configData?.draft || {}),
      pages: {
        ...(configData?.draft?.pages || {}),
        [newPageId]: duplicatedPage
      },
      sections: {
        ...(configData?.draft?.sections || {}),
        [newPageId]: duplicatedSections
      }
    };

    const res = await saveDraftConfig(updatedConfig, `Duplicated Page (${pageIdToClone} -> ${newPageId})`);
    if (res.success) {
      await loadData();
      setActivePageId(newPageId);
    }
  };

  // Delete Page
  const handleDeletePage = async (pageIdToDelete) => {
    if (['home', 'service', 'about', 'hotels', 'contact', 'imprint'].includes(pageIdToDelete)) {
      alert('Default system pages cannot be deleted.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete page "/${pageIdToDelete}"? This will remove its sections and navigation links.`)) {
      return;
    }

    const newPages = { ...(configData?.draft?.pages || {}) };
    delete newPages[pageIdToDelete];

    const newSections = { ...(configData?.draft?.sections || {}) };
    delete newSections[pageIdToDelete];

    const newNavItems = (configData?.draft?.header?.nav_items || []).filter(item => {
      const cleanP = (item.path || '').replace(/^\/+|\/+$/g, '');
      return cleanP !== pageIdToDelete;
    });

    const updatedConfig = {
      ...(configData?.draft || {}),
      pages: newPages,
      sections: newSections,
      header: {
        ...(configData?.draft?.header || {}),
        nav_items: newNavItems
      }
    };

    const res = await saveDraftConfig(updatedConfig, `Deleted Page (${pageIdToDelete})`);
    if (res.success) {
      await loadData();
      setActivePageId('home');
    }
  };

  // Create Page Submit from Wizard
  const handleCreateNewPageSubmit = async (e) => {
    e.preventDefault();
    if (!newPageForm.name || !newPageForm.slug) {
      alert('Please provide page name and slug.');
      return;
    }

    const cleanSlug = newPageForm.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const pageId = cleanSlug;

    const newPageObj = {
      id: pageId,
      slug: cleanSlug,
      title: newPageForm.name,
      seo_title: newPageForm.seoTitle || `${newPageForm.name} | Sports & MICE`,
      seo_description: newPageForm.seoDescription || `Discover ${newPageForm.name} with Sports & MICE.`,
      hero_bg_image: '/assets/images/home_hero_bg.jpg',
      enabled: newPageForm.isPublished
    };

    const initialSections = [
      {
        id: `${pageId}_hero`,
        type: 'hero',
        name: `${newPageForm.name} Hero`,
        heading_prefix_en: newPageForm.name,
        tag1_en: 'Sports & MICE',
        tag2_en: 'Global Coordination',
        subtitle_en: `Welcome to our ${newPageForm.name} page.`,
        bg_image: '/assets/images/home_hero_bg.jpg',
        enabled: true,
        order: 1
      },
      {
        id: `${pageId}_row_1`,
        type: 'row',
        name: 'Main Content Row',
        layout: '50-50',
        padding_top: 60,
        padding_bottom: 60,
        columns: [
          {
            id: 'col_1',
            width: '50%',
            blocks: [
              { id: 'b_1', type: 'heading', level: 'h2', text_en: `Overview of ${newPageForm.name}` },
              { id: 'b_2', type: 'text', text_en: 'Detailed description of services and athletic expertise.' },
              { id: 'b_3', type: 'button', text_en: 'Contact Us', link: '/en/Contact/' }
            ]
          },
          {
            id: 'col_2',
            width: '50%',
            blocks: [
              { id: 'b_4', type: 'image', src: '/assets/images/home_hero_bg.jpg', alt: newPageForm.name }
            ]
          }
        ],
        enabled: true,
        order: 2
      }
    ];

    let updatedNavItems = [...(configData?.draft?.header?.nav_items || [])];
    if (newPageForm.addToNav) {
      updatedNavItems.push({
        id: `nav_${pageId}`,
        name_en: newPageForm.navLabel || newPageForm.name,
        name_de: newPageForm.navLabel || newPageForm.name,
        path: `/${cleanSlug}`,
        enabled: true,
        order: updatedNavItems.length + 1
      });
    }

    const updatedConfig = {
      ...(configData?.draft || {}),
      pages: {
        ...(configData?.draft?.pages || {}),
        [pageId]: newPageObj
      },
      sections: {
        ...(configData?.draft?.sections || {}),
        [pageId]: initialSections
      },
      header: {
        ...(configData?.draft?.header || {}),
        nav_items: updatedNavItems
      }
    };

    const res = await saveDraftConfig(updatedConfig, `Created Page (${newPageForm.name})`);
    if (res.success) {
      setNewPageModalOpen(false);
      await loadData();
      setActivePageId(pageId);
    }
  };

  const currentPage = draftPages[activePageId] || {};
  const pagesList = Object.entries(draftPages).map(([k, p]) => ({
    id: k,
    label: p.title || k,
    slug: p.slug || k,
    path: `/${p.slug || k}`,
    enabled: p.enabled !== false
  }));

  return (
    <div className="admin-page-container">
      <AdminCmsHeader 
        onRefresh={loadData} 
        hasChanges={configData?.has_unpublished_changes}
        version={configData?.version}
      />

      <div className="cms-page-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="cms-page-title">Page Management</h2>
          <p className="cms-page-subtitle">Create, customize, preview, and manage all public and dynamic website pages.</p>
        </div>

        <button 
          type="button"
          onClick={() => setNewPageModalOpen(true)}
          className="cms-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          <span>+ Create New Page</span>
        </button>
      </div>

      <div className="cms-builder-layout-grid">
        {/* Left Sidebar: Pages List */}
        <div className="cms-panel-card pages-list-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="panel-title" style={{ margin: 0 }}>Website Pages ({pagesList.length})</h3>
          </div>

          <div className="pages-selection-list">
            {pagesList.map((p) => {
              const isEnabled = p.enabled !== false;
              const isSelected = activePageId === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setActivePageId(p.id)}
                  className={`page-select-btn ${isSelected ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '12px 14px' }}
                >
                  <div className="page-select-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={16} color={isSelected ? '#ff0000' : '#64748b'} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#1f242d', fontSize: '0.92rem' }}>{p.label}</div>
                      <div style={{ color: '#888', fontSize: '0.78rem' }}>/{p.slug}</div>
                    </div>
                  </div>
                  <span className={`page-status-badge ${isEnabled ? 'badge-enabled' : 'badge-disabled'}`}>
                    {isEnabled ? 'Live' : 'Hidden'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Editor: Page Settings Form & Quick Actions */}
        <div className="cms-panel-card page-editor-panel">
          <div className="panel-header-with-action" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 className="panel-title" style={{ margin: 0 }}>{currentPage.title || activePageId} (/{currentPage.slug || activePageId})</h3>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <NavLink
                to={`/admin/website-builder?page=${activePageId}`}
                className="cms-btn-primary"
                style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <Edit size={14} />
                <span>Visual Studio Editor</span>
              </NavLink>

              <a
                href={`/${currentPage.slug || activePageId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '8px 14px', fontSize: '0.85rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <ExternalLink size={14} />
                <span>Live Route</span>
              </a>

              <button
                type="button"
                onClick={() => handleToggleEnabled(activePageId)}
                className={`btn-toggle-visibility ${currentPage.enabled !== false ? 'btn-vis-on' : 'btn-vis-off'}`}
                style={{ padding: '8px 12px' }}
              >
                {currentPage.enabled !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{currentPage.enabled !== false ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="cms-editor-form" style={{ marginTop: '20px' }}>
            <div className="form-group-row">
              <div className="form-group">
                <label className="cms-label">Page Title</label>
                <input
                  type="text"
                  value={currentPage.title || ''}
                  onChange={(e) => handleFieldChange(activePageId, 'title', e.target.value)}
                  className="cms-input"
                  placeholder="e.g. Doctors"
                />
              </div>

              <div className="form-group">
                <label className="cms-label">Hero Background Image URL / Path</label>
                <div className="input-with-preview">
                  <input
                    type="text"
                    value={currentPage.hero_bg_image || ''}
                    onChange={(e) => handleFieldChange(activePageId, 'hero_bg_image', e.target.value)}
                    className="cms-input"
                    placeholder="/assets/images/home_hero_bg.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="cms-divider" />

            <h4 className="cms-section-heading">SEO & Metadata Configuration</h4>

            <div className="form-group">
              <label className="cms-label">SEO Meta Title</label>
              <input
                type="text"
                value={currentPage.seo_title || ''}
                onChange={(e) => handleFieldChange(activePageId, 'seo_title', e.target.value)}
                className="cms-input"
                placeholder="Meta title displayed in Google search and browser tab"
              />
            </div>

            <div className="form-group">
              <label className="cms-label">SEO Meta Description</label>
              <textarea
                rows="3"
                value={currentPage.seo_description || ''}
                onChange={(e) => handleFieldChange(activePageId, 'seo_description', e.target.value)}
                className="cms-textarea"
                placeholder="Search engine summary description for this page"
              />
            </div>

            {/* Duplication and Delete Actions */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => handleDuplicatePage(activePageId)}
                style={{ padding: '8px 14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <Copy size={14} />
                <span>Duplicate Page</span>
              </button>

              {!['home', 'service', 'about', 'hotels', 'contact', 'imprint'].includes(activePageId) && (
                <button
                  type="button"
                  onClick={() => handleDeletePage(activePageId)}
                  style={{ padding: '8px 14px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Trash2 size={14} />
                  <span>Delete Page</span>
                </button>
              )}
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
                    <span>Save Page Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CREATE NEW PAGE WIZARD MODAL */}
      <AnimatePresence>
        {newPageModalOpen && (
          <div className="builder-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="builder-modal-card"
              style={{ maxWidth: '600px', width: '100%', background: '#fff', color: '#1f242d', borderRadius: '16px', overflow: 'hidden' }}
            >
              <div style={{ padding: '20px 24px', background: '#1f242d', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Create New Website Page</h3>
                <button onClick={() => setNewPageModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleCreateNewPageSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>Page Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Doctors, Training Camps" 
                    value={newPageForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                      setNewPageForm(prev => ({ ...prev, name, slug: prev.slug === '' ? slug : prev.slug }));
                    }}
                    required
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>URL Slug *</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0 10px', background: '#f8fafc' }}>
                    <span style={{ color: '#64748b' }}>/</span>
                    <input 
                      type="text" 
                      placeholder="doctors" 
                      value={newPageForm.slug}
                      onChange={(e) => setNewPageForm(prev => ({ ...prev, slug: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '10px 6px', border: 'none', background: 'transparent' }}
                    />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    <input 
                      type="checkbox" 
                      checked={newPageForm.addToNav} 
                      onChange={(e) => setNewPageForm(prev => ({ ...prev, addToNav: e.target.checked }))} 
                      style={{ width: '16px', height: '16px', accentColor: '#ff0000' }}
                    />
                    <span>Add to Header Navbar</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    <input 
                      type="checkbox" 
                      checked={newPageForm.isPublished} 
                      onChange={(e) => setNewPageForm(prev => ({ ...prev, isPublished: e.target.checked }))} 
                      style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
                    />
                    <span>Publish Immediately</span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setNewPageModalOpen(false)} style={{ padding: '10px 18px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" className="cms-btn-primary" style={{ padding: '10px 22px' }}>Create Page</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPages;
