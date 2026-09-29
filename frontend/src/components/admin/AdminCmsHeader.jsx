import React, { useState } from 'react';
import { publishConfig, resetConfig, discardDraft } from '../../services/api';
import { useSite } from '../../context/SiteContext';
import { 
  UploadCloud, 
  Eye, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCmsHeader = ({ 
  onRefresh, 
  hasChanges = false, 
  version = 1, 
  draftChangesCount = 0,
  draftSummary = [] 
}) => {
  const { loadSiteConfig } = useSite();
  const [publishing, setPublishing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const handlePublish = async () => {
    setPublishing(true);
    setStatusMsg(null);
    try {
      const res = await publishConfig();
      if (res.success) {
        setStatusMsg({ 
          type: 'success', 
          text: `✓ Published Successfully! New live version: v${res.data?.version || (version + 1)}` 
        });
        await loadSiteConfig(false);
        if (onRefresh) onRefresh();
      } else {
        setStatusMsg({ type: 'error', text: res.error || 'Failed to publish changes.' });
      }
    } catch (e) {
      setStatusMsg({ type: 'error', text: 'Publish request failed. Please check network connection.' });
    } finally {
      setPublishing(false);
      setConfirmModal(null);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    setStatusMsg(null);
    try {
      const res = await resetConfig();
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Website reset to default configuration.' });
        await loadSiteConfig();
        if (onRefresh) onRefresh();
      } else {
        setStatusMsg({ type: 'error', text: res.error || 'Failed to reset configuration.' });
      }
    } catch (e) {
      setStatusMsg({ type: 'error', text: 'Reset request failed.' });
    } finally {
      setResetting(false);
      setConfirmModal(null);
    }
  };

  const handleDiscard = async () => {
    setDiscarding(true);
    setStatusMsg(null);
    try {
      const res = await discardDraft();
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Draft changes discarded.' });
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      setStatusMsg({ type: 'error', text: 'Discard failed.' });
    } finally {
      setDiscarding(false);
      setConfirmModal(null);
    }
  };

  const openPreview = () => {
    window.open('/?preview=true', '_blank');
  };

  return (
    <>
      <div className="admin-cms-topbar-banner">
        <div className="cms-status-left">
          <div className={`cms-status-pill ${hasChanges ? 'status-draft' : 'status-live'}`}>
            <span className="status-dot" />
            <span>{hasChanges ? 'Draft (Unpublished Changes)' : 'Live Version Published'}</span>
          </div>
          <span className="cms-version-badge">v{version}</span>
        </div>

        <div className="cms-actions-right">
          <button 
            type="button" 
            onClick={openPreview} 
            className="cms-btn cms-btn-preview"
            title="Open website with draft changes in a new tab"
          >
            <Eye size={15} />
            <span>Preview Website</span>
          </button>

          {hasChanges && (
            <button 
              type="button" 
              onClick={() => setConfirmModal('discard')} 
              className="cms-btn cms-btn-discard"
              disabled={discarding}
            >
              <RotateCcw size={15} />
              <span>Discard Draft</span>
            </button>
          )}

          <button 
            type="button" 
            onClick={() => setConfirmModal('publish')} 
            className="cms-btn cms-btn-publish"
            disabled={publishing}
          >
            {publishing ? <Loader2 size={15} className="spin-icon" /> : <UploadCloud size={15} />}
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {statusMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`cms-alert-banner ${statusMsg.type === 'success' ? 'cms-alert-success' : 'cms-alert-error'}`}
          >
            {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{statusMsg.text}</span>
            <button className="cms-alert-close" onClick={() => setStatusMsg(null)}>×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="cms-modal-backdrop" onClick={() => setConfirmModal(null)}>
            <motion.div 
              className="cms-modal-box"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {confirmModal === 'publish' && (
                <>
                  <div className="cms-modal-icon publish-icon">
                    <UploadCloud size={32} />
                  </div>
                  <h3>Publish Changes?</h3>
                  <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '14px' }}>
                    You are about to make the current draft visible on the live website.
                  </p>

                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '18px',
                    textAlign: 'left'
                  }}>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.85rem', marginBottom: '6px' }}>
                      Pending Changes ({draftChangesCount || (draftSummary.length > 0 ? draftSummary.length : 1)})
                    </div>
                    {draftSummary && draftSummary.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#64748b' }}>
                        {draftSummary.slice(0, 4).map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '3px' }}>{item}</li>
                        ))}
                        {draftSummary.length > 4 && (
                          <li style={{ color: '#94a3b8' }}>+ {draftSummary.length - 4} more modifications</li>
                        )}
                      </ul>
                    ) : (
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                        All draft edits to pages, sections, styles, and media will be released live.
                      </p>
                    )}
                  </div>

                  <div className="cms-modal-actions">
                    <button className="btn-modal-cancel" onClick={() => setConfirmModal(null)}>Cancel</button>
                    <button className="btn-modal-confirm publish-btn" onClick={handlePublish} disabled={publishing}>
                      {publishing ? <Loader2 size={15} className="spin-icon" /> : null}
                      <span>{publishing ? 'Publishing...' : 'Publish'}</span>
                    </button>
                  </div>
                </>
              )}

              {confirmModal === 'reset' && (
                <>
                  <div className="cms-modal-icon reset-icon">
                    <AlertTriangle size={32} />
                  </div>
                  <h3>Reset Website to Default Configuration?</h3>
                  <p>This will restore the original Sports & MICE defaults for theme colors, navigation, sections, and copy. This action cannot be undone.</p>
                  <div className="cms-modal-actions">
                    <button className="btn-modal-cancel" onClick={() => setConfirmModal(null)}>Cancel</button>
                    <button className="btn-modal-confirm danger-btn" onClick={handleReset}>
                      {resetting ? 'Resetting...' : 'Yes, Reset to Default'}
                    </button>
                  </div>
                </>
              )}

              {confirmModal === 'discard' && (
                <>
                  <div className="cms-modal-icon reset-icon">
                    <RotateCcw size={32} />
                  </div>
                  <h3>Discard Unpublished Draft Changes?</h3>
                  <p>All unsaved changes made in the draft will be reverted back to the currently published live version.</p>
                  <div className="cms-modal-actions">
                    <button className="btn-modal-cancel" onClick={() => setConfirmModal(null)}>Cancel</button>
                    <button className="btn-modal-confirm danger-btn" onClick={handleDiscard}>
                      {discarding ? 'Discarding...' : 'Yes, Discard Draft'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminCmsHeader;
