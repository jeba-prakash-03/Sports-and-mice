import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchAdminConfig, saveDraftConfig } from '../../services/api';
import AdminCmsHeader from '../../components/admin/AdminCmsHeader';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Star, 
  Image as ImageIcon,
  Loader2,
  X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminContentCRUD = () => {
  const location = useLocation();
  const [configData, setConfigData] = useState(null);
  const [activeTab, setActiveTab] = useState('services'); // 'services', 'team', 'testimonials', 'faqs', 'gallery'
  const [collections, setCollections] = useState({
    services: [],
    team: [],
    testimonials: [],
    faqs: [],
    gallery: []
  });
  const [editingModal, setEditingModal] = useState(null); // { type, item, isNew }
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Parse path for direct tab selection
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/content/team')) setActiveTab('team');
    else if (path.includes('/admin/content/testimonials')) setActiveTab('testimonials');
    else if (path.includes('/admin/content/faqs')) setActiveTab('faqs');
    else if (path.includes('/admin/content/gallery')) setActiveTab('gallery');
    else if (path.includes('/admin/content/services')) setActiveTab('services');
  }, [location.pathname]);

  const loadData = async () => {
    const res = await fetchAdminConfig();
    if (res.success && res.data) {
      setConfigData(res.data);
      const draft = res.data.draft || {};
      setCollections({
        services: draft.services || [],
        team: draft.team || [],
        testimonials: draft.testimonials || [],
        faqs: draft.faqs || [],
        gallery: draft.gallery || []
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveCollection = async (newCollections, logContext) => {
    setSaving(true);
    const updatedConfig = {
      ...(configData?.draft || {}),
      ...newCollections
    };

    const res = await saveDraftConfig(updatedConfig, logContext || `Content Manager (${activeTab})`);
    if (res.success) {
      setSaveSuccess(true);
      await loadData();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleToggleActive = (tabKey, id) => {
    const list = [...(collections[tabKey] || [])];
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index].active = !list[index].active;
      const updated = { ...collections, [tabKey]: list };
      setCollections(updated);
      handleSaveCollection(updated, `Toggled active status on ${tabKey}`);
    }
  };

  const handleDeleteItem = (tabKey, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const list = (collections[tabKey] || []).filter(item => item.id !== id);
    const updated = { ...collections, [tabKey]: list };
    setCollections(updated);
    handleSaveCollection(updated, `Deleted item from ${tabKey}`);
  };

  const handleMoveItem = (tabKey, index, direction) => {
    const list = [...(collections[tabKey] || [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;

    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;

    list.forEach((item, idx) => {
      item.order = idx + 1;
    });

    const updated = { ...collections, [tabKey]: list };
    setCollections(updated);
    handleSaveCollection(updated, `Reordered ${tabKey}`);
  };

  const handleOpenEdit = (type, item = null) => {
    if (!item) {
      // Create template for new item
      let newItem = { id: `${type}_${Date.now()}`, active: true, order: (collections[type]?.length || 0) + 1 };
      if (type === 'services') {
        newItem = { ...newItem, title_en: '', title_de: '', desc_en: '', desc_de: '', image: '/assets/images/service_meeting.jpg', link: '/en/Contact/' };
      } else if (type === 'team') {
        newItem = { ...newItem, name: '', role_en: '', role_de: '', designation: '', photo: '/assets/images/about_hockey_referee.jpeg', bio_en: '', bio_de: '' };
      } else if (type === 'testimonials') {
        newItem = { ...newItem, name: '', role: '', review: '', rating: 5 };
      } else if (type === 'faqs') {
        newItem = { ...newItem, question_en: '', question_de: '', answer_en: '', answer_de: '' };
      } else if (type === 'gallery') {
        newItem = { ...newItem, title: '', hotel_name: '', location: '', image: '/assets/images/hotel_cancun.jpg', external_url: '', desc_en: '', desc_de: '' };
      }
      setEditingModal({ type, item: newItem, isNew: true });
    } else {
      setEditingModal({ type, item: { ...item }, isNew: false });
    }
  };

  const handleModalSave = (e) => {
    e.preventDefault();
    if (!editingModal) return;
    const { type, item, isNew } = editingModal;
    const list = [...(collections[type] || [])];

    if (isNew) {
      list.push(item);
    } else {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) list[idx] = item;
    }

    const updated = { ...collections, [type]: list };
    setCollections(updated);
    handleSaveCollection(updated, `${isNew ? 'Added' : 'Updated'} item in ${type}`);
    setEditingModal(null);
  };

  const tabs = [
    { key: 'services', label: 'Services (Offerings)' },
    { key: 'team', label: 'Team & Founder' },
    { key: 'testimonials', label: 'Testimonials' },
    { key: 'faqs', label: 'FAQs' },
    { key: 'gallery', label: 'Gallery & Scouting Tours' }
  ];

  const currentItems = collections[activeTab] || [];

  return (
    <div className="admin-page-container">
      <AdminCmsHeader 
        onRefresh={loadData} 
        hasChanges={configData?.has_unpublished_changes}
        version={configData?.version}
      />

      <div className="cms-page-header-row">
        <div>
          <h2 className="cms-page-title">Content Collections Management</h2>
          <p className="cms-page-subtitle">Add, edit, reorder, and remove dynamic cards for Services, Team members, Testimonials, FAQs, and Hotel Tours.</p>
        </div>

        <button 
          type="button" 
          onClick={() => handleOpenEdit(activeTab)} 
          className="cms-btn-primary"
        >
          <Plus size={16} />
          <span>Add New {tabs.find(t => t.key === activeTab)?.label.split(' ')[0]}</span>
        </button>
      </div>

      {/* Collection Tabs */}
      <div className="cms-tabs-bar">
        {tabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`cms-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.label}</span>
            <span className="tab-count-badge">{(collections[tab.key] || []).length}</span>
          </button>
        ))}
      </div>

      {/* Items List Table / Grid */}
      <div className="cms-panel-card" style={{ marginTop: '20px' }}>
        {currentItems.length > 0 ? (
          <div className="crud-items-table">
            <div className="crud-table-header">
              <span style={{ width: '60px' }}>Order</span>
              <span style={{ width: '80px' }}>Preview</span>
              <span style={{ flex: 1.5 }}>Title / Name</span>
              <span style={{ flex: 2 }}>Summary / Details</span>
              <span style={{ width: '100px' }}>Status</span>
              <span style={{ width: '120px', textAlign: 'right' }}>Actions</span>
            </div>

            {currentItems.map((item, idx) => (
              <div key={item.id || idx} className="crud-table-row">
                <div className="crud-order-cell" style={{ width: '60px' }}>
                  <button 
                    type="button" 
                    disabled={idx === 0} 
                    onClick={() => handleMoveItem(activeTab, idx, 'up')}
                    className="btn-order-arrow"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button 
                    type="button" 
                    disabled={idx === currentItems.length - 1} 
                    onClick={() => handleMoveItem(activeTab, idx, 'down')}
                    className="btn-order-arrow"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                <div className="crud-preview-cell" style={{ width: '80px' }}>
                  {item.image || item.photo ? (
                    <img src={item.image || item.photo} alt="Thumb" className="crud-thumb" />
                  ) : (
                    <div className="crud-no-thumb">No Img</div>
                  )}
                </div>

                <div className="crud-title-cell" style={{ flex: 1.5 }}>
                  <strong>{item.title_en || item.title || item.name || item.question_en}</strong>
                  {item.designation && <p className="crud-sub">{item.designation}</p>}
                  {item.hotel_name && <p className="crud-sub">{item.hotel_name}</p>}
                </div>

                <div className="crud-desc-cell" style={{ flex: 2 }}>
                  <p className="crud-desc-clamp">
                    {item.desc_en || item.bio_en || item.review || item.answer_en}
                  </p>
                </div>

                <div className="crud-status-cell" style={{ width: '100px' }}>
                  <button 
                    type="button"
                    onClick={() => handleToggleActive(activeTab, item.id)}
                    className={`badge-status-pill ${item.active !== false ? 'pill-active' : 'pill-inactive'}`}
                  >
                    {item.active !== false ? 'Active' : 'Disabled'}
                  </button>
                </div>

                <div className="crud-actions-cell" style={{ width: '120px', textAlign: 'right' }}>
                  <button 
                    type="button" 
                    onClick={() => handleOpenEdit(activeTab, item)} 
                    className="btn-edit-action"
                    title="Edit Item"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteItem(activeTab, item.id)} 
                    className="btn-delete-action"
                    title="Delete Item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cms-empty-selection" style={{ padding: '40px 20px' }}>
            <h4>No items in this collection yet.</h4>
            <button 
              type="button" 
              onClick={() => handleOpenEdit(activeTab)} 
              className="cms-btn-primary"
              style={{ marginTop: '14px' }}
            >
              <Plus size={15} />
              <span>Create First Item</span>
            </button>
          </div>
        )}
      </div>

      {/* Edit Item Modal */}
      <AnimatePresence>
        {editingModal && (
          <div className="cms-modal-backdrop" onClick={() => setEditingModal(null)}>
            <motion.div 
              className="cms-modal-box modal-wide"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-row">
                <h3>{editingModal.isNew ? 'Create New Item' : 'Edit Item'} ({editingModal.type})</h3>
                <button type="button" className="btn-modal-close" onClick={() => setEditingModal(null)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleModalSave} className="cms-editor-form modal-form">
                {/* Dynamic Fields for Services */}
                {editingModal.type === 'services' && (
                  <>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label className="cms-label">Service Title (English)</label>
                        <input
                          type="text"
                          required
                          value={editingModal.item.title_en || ''}
                          onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, title_en: e.target.value } }))}
                          className="cms-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="cms-label">Service Title (German)</label>
                        <input
                          type="text"
                          value={editingModal.item.title_de || ''}
                          onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, title_de: e.target.value } }))}
                          className="cms-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="cms-label">Image URL / Path</label>
                      <input
                        type="text"
                        value={editingModal.item.image || ''}
                        onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, image: e.target.value } }))}
                        className="cms-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="cms-label">Description (English)</label>
                      <textarea
                        rows="3"
                        value={editingModal.item.desc_en || ''}
                        onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, desc_en: e.target.value } }))}
                        className="cms-textarea"
                      />
                    </div>

                    <div className="form-group">
                      <label className="cms-label">Description (German)</label>
                      <textarea
                        rows="3"
                        value={editingModal.item.desc_de || ''}
                        onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, desc_de: e.target.value } }))}
                        className="cms-textarea"
                      />
                    </div>
                  </>
                )}

                {/* Dynamic Fields for Team */}
                {editingModal.type === 'team' && (
                  <>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label className="cms-label">Full Name</label>
                        <input
                          type="text"
                          required
                          value={editingModal.item.name || ''}
                          onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, name: e.target.value } }))}
                          className="cms-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="cms-label">Designation / Sport Role</label>
                        <input
                          type="text"
                          value={editingModal.item.designation || ''}
                          onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, designation: e.target.value } }))}
                          className="cms-input"
                        />
                      </div>
                    </div>

                    <div className="form-group-row">
                      <div className="form-group">
                        <label className="cms-label">Role Title (EN)</label>
                        <input
                          type="text"
                          value={editingModal.item.role_en || ''}
                          onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, role_en: e.target.value } }))}
                          className="cms-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="cms-label">Photo URL</label>
                        <input
                          type="text"
                          value={editingModal.item.photo || ''}
                          onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, photo: e.target.value } }))}
                          className="cms-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="cms-label">Biography / Background (English)</label>
                      <textarea
                        rows="3"
                        value={editingModal.item.bio_en || ''}
                        onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, bio_en: e.target.value } }))}
                        className="cms-textarea"
                      />
                    </div>
                  </>
                )}

                {/* Dynamic Fields for Testimonials */}
                {editingModal.type === 'testimonials' && (
                  <>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label className="cms-label">Client / Association Name</label>
                        <input
                          type="text"
                          required
                          value={editingModal.item.name || ''}
                          onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, name: e.target.value } }))}
                          className="cms-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="cms-label">Role / Organization</label>
                        <input
                          type="text"
                          value={editingModal.item.role || ''}
                          onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, role: e.target.value } }))}
                          className="cms-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="cms-label">Review / Feedback</label>
                      <textarea
                        rows="3"
                        required
                        value={editingModal.item.review || ''}
                        onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, review: e.target.value } }))}
                        className="cms-textarea"
                      />
                    </div>
                  </>
                )}

                {/* Dynamic Fields for FAQs */}
                {editingModal.type === 'faqs' && (
                  <>
                    <div className="form-group">
                      <label className="cms-label">Question (English)</label>
                      <input
                        type="text"
                        required
                        value={editingModal.item.question_en || ''}
                        onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, question_en: e.target.value } }))}
                        className="cms-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="cms-label">Question (German)</label>
                      <input
                        type="text"
                        value={editingModal.item.question_de || ''}
                        onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, question_de: e.target.value } }))}
                        className="cms-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="cms-label">Answer (English)</label>
                      <textarea
                        rows="3"
                        required
                        value={editingModal.item.answer_en || ''}
                        onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, answer_en: e.target.value } }))}
                        className="cms-textarea"
                      />
                    </div>

                    <div className="form-group">
                      <label className="cms-label">Answer (German)</label>
                      <textarea
                        rows="3"
                        value={editingModal.item.answer_de || ''}
                        onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, answer_de: e.target.value } }))}
                        className="cms-textarea"
                      />
                    </div>
                  </>
                )}

                {/* Dynamic Fields for Gallery / Tours */}
                {editingModal.type === 'gallery' && (
                  <>
                    <div className="form-group-row">
                      <div className="form-group">
                        <label className="cms-label">Tour / Destination Title</label>
                        <input
                          type="text"
                          required
                          value={editingModal.item.title || ''}
                          onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, title: e.target.value } }))}
                          className="cms-input"
                          placeholder="e.g. Tour - Mexico - Cancún"
                        />
                      </div>
                      <div className="form-group">
                        <label className="cms-label">Hotel / Venue Name</label>
                        <input
                          type="text"
                          value={editingModal.item.hotel_name || ''}
                          onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, hotel_name: e.target.value } }))}
                          className="cms-input"
                        />
                      </div>
                    </div>

                    <div className="form-group-row">
                      <div className="form-group">
                        <label className="cms-label">Image URL</label>
                        <input
                          type="text"
                          value={editingModal.item.image || ''}
                          onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, image: e.target.value } }))}
                          className="cms-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="cms-label">External Hotel Website Link</label>
                        <input
                          type="text"
                          value={editingModal.item.external_url || ''}
                          onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, external_url: e.target.value } }))}
                          className="cms-input"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="cms-label">Inspection Tour Report (English)</label>
                      <textarea
                        rows="3"
                        value={editingModal.item.desc_en || ''}
                        onChange={(e) => setEditingModal(prev => ({ ...prev, item: { ...prev.item, desc_en: e.target.value } }))}
                        className="cms-textarea"
                      />
                    </div>
                  </>
                )}

                <div className="cms-modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setEditingModal(null)}>Cancel</button>
                  <button type="submit" className="cms-btn-primary">
                    <Save size={15} />
                    <span>Save Item to Draft</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminContentCRUD;
