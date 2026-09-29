import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import { fetchAdminConfig, fetchAuditLogs, publishConfig, API_BASE_URL } from '../../services/api';
import { 
  Inbox, 
  Mail, 
  Layers, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  History, 
  RefreshCw, 
  UploadCloud, 
  Check, 
  Loader2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { token } = useAuth();
  const { loadSiteConfig } = useSite();
  const [data, setData] = useState(null);
  const [cmsData, setCmsData] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [actionAlert, setActionAlert] = useState(null);

  const fetchAllDashboard = async () => {
    setLoading(true);
    try {
      const [dashRes, cmsRes, logsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/dashboard.php`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }),
        fetchAdminConfig(),
        fetchAuditLogs()
      ]);

      if (dashRes.ok) {
        const json = await dashRes.json();
        if (json.success) setData(json);
      }
      if (cmsRes.success && cmsRes.data) {
        setCmsData(cmsRes.data);
      }
      if (logsRes) {
        setRecentLogs(logsRes.slice(0, 6));
      }
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboard();
  }, [token]);

  const stats = data?.statistics || {
    total_submissions: 7,
    new_submissions: 6,
    published_pages: 18,
    draft_changes: 0
  };

  const websiteStatus = data?.website_status || {
    status: 'live',
    version: 'v' + (cmsData?.version || 1),
    has_unpublished_changes: !!cmsData?.has_unpublished_changes,
    draft_changes_count: cmsData?.draft_changes_count || 0,
    draft_changes_summary: cmsData?.draft_changes_summary || [],
    last_published_at: 'Today'
  };

  const recentSubmissions = data?.recent_submissions || [];
  const activityItems = (data?.recent_activity && data.recent_activity.length > 0) 
    ? data.recent_activity 
    : recentLogs;

  const handlePublish = async () => {
    setPublishing(true);
    setActionAlert(null);
    try {
      const res = await publishConfig();
      if (res.success) {
        setActionAlert({
          type: 'success',
          text: `✓ Published Successfully! Live Version: v${res.data?.version || 2}`
        });
        setPublishModalOpen(false);
        await loadSiteConfig(false);
        await fetchAllDashboard();
        setTimeout(() => setActionAlert(null), 5000);
      } else {
        setActionAlert({
          type: 'error',
          text: res.error || 'Failed to publish changes.'
        });
      }
    } catch (e) {
      setActionAlert({
        type: 'error',
        text: 'Publish request failed. Please check network connection.'
      });
    } finally {
      setPublishing(false);
    }
  };

  const openPreview = () => {
    window.open('/?preview=true', '_blank');
  };

  const formatActivityTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      {/* Alert Notification Toast */}
      <AnimatePresence>
        {actionAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`cms-alert-banner ${actionAlert.type === 'success' ? 'cms-alert-success' : 'cms-alert-error'}`}
            style={{ marginBottom: '18px' }}
          >
            {actionAlert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{actionAlert.text}</span>
            <button className="cms-alert-close" onClick={() => setActionAlert(null)}>×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          1. TOP BANNER: WEBSITE MANAGEMENT (Primary Entry Point to Visual Builder)
          ========================================================================= */}
      <div className="dash-mgmt-banner">
        <div>
          <h2 className="dash-mgmt-title">
            <Sparkles size={22} color="#38bdf8" />
            <span>Website Management</span>
          </h2>
          <p className="dash-mgmt-sub">
            Manage your website, review submissions, and publish changes.
          </p>
          <div className="dash-mgmt-meta-strip">
            <span className="dash-live-badge">
              <span className="dash-pulse-dot" />
              <span>Live Website</span>
            </span>

            <span className="dash-version-pill">
              {websiteStatus.version}
            </span>

            {websiteStatus.has_unpublished_changes || stats.draft_changes > 0 ? (
              <span className="dash-draft-pill has-changes">
                <span>🟠 Draft changes: {stats.draft_changes || websiteStatus.draft_changes_count || 1}</span>
              </span>
            ) : (
              <span className="dash-draft-pill all-saved">
                <span>✓ All changes published</span>
              </span>
            )}

            <span className="dash-last-published">
              <Clock size={13} />
              <span>Last published: {websiteStatus.last_published_at}</span>
            </span>
          </div>
        </div>

        <NavLink 
          to="/admin/website-builder" 
          className="btn-open-builder-prominent"
          title="Open Visual Page Builder"
        >
          <span>Open Visual Page Builder</span>
          <ArrowRight size={17} />
        </NavLink>
      </div>

      {/* =========================================================================
          2. WEBSITE STATUS CARD (Live Version, Draft Status, Preview, Publish)
          ========================================================================= */}
      <div className="dash-status-card">
        <div className="dash-status-card-header">
          <h3 className="dash-status-card-title">
            <Layers size={18} color="#106cc2" />
            <span>Website Status</span>
          </h3>
          <button 
            type="button" 
            onClick={fetchAllDashboard} 
            className="btn-admin-secondary"
            style={{ padding: '5px 12px', fontSize: '12px' }}
            title="Refresh website status"
          >
            <RefreshCw size={13} className={loading ? 'spin-icon' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="dash-status-card-grid">
          <div>
            <div className="dash-status-item-label">Current Version</div>
            <div className="dash-status-item-val">
              <span className="status-badge badge-published" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                🟢 Live ({websiteStatus.version})
              </span>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Published: {websiteStatus.last_published_at}
              </span>
            </div>
          </div>

          <div>
            <div className="dash-status-item-label">Draft Status</div>
            <div className="dash-status-item-val">
              {websiteStatus.has_unpublished_changes || stats.draft_changes > 0 ? (
                <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <span>🟠</span>
                  <span>{stats.draft_changes || websiteStatus.draft_changes_count || 1} unpublished change(s)</span>
                </span>
              ) : (
                <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <Check size={16} />
                  <span>✓ Everything is published</span>
                </span>
              )}
            </div>
          </div>

          <div className="dash-status-actions">
            <button 
              type="button" 
              onClick={openPreview}
              className="btn-preview-draft"
              title="Preview complete draft in new tab"
            >
              <Eye size={15} />
              <span>Preview Draft</span>
            </button>

            <button 
              type="button" 
              onClick={() => setPublishModalOpen(true)}
              className="btn-publish-draft"
              disabled={publishing}
              title="Publish all draft changes to the live public site"
            >
              <UploadCloud size={15} />
              <span>Publish Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. STATISTICS (4 Clean, Consistent Cards with Prominent Numbers)
          ========================================================================= */}
      <div className="dash-stats-grid">
        <div className="dash-stat-card">
          <div className="dash-stat-icon-wrap blue">
            <Inbox size={24} />
          </div>
          <div className="dash-stat-body">
            <span className="dash-stat-label">Total Form Submissions</span>
            <span className="dash-stat-number">{stats.total_submissions}</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-icon-wrap emerald">
            <Mail size={24} />
          </div>
          <div className="dash-stat-body">
            <span className="dash-stat-label">New Inquiries</span>
            <span className="dash-stat-number">{stats.new_submissions}</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-icon-wrap indigo">
            <FileText size={24} />
          </div>
          <div className="dash-stat-body">
            <span className="dash-stat-label">Published Pages</span>
            <span className="dash-stat-number">{stats.published_pages}</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-icon-wrap amber">
            <Sparkles size={24} />
          </div>
          <div className="dash-stat-body">
            <span className="dash-stat-label">Draft Changes</span>
            <span className="dash-stat-number">{stats.draft_changes}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. TWO-COLUMN LAYOUT: RECENT ACTIVITY & RECENT INQUIRIES
          ========================================================================= */}
      <div className="dash-two-col-layout">
        {/* Left Column: Recent Activity Feed */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="card-header-flex">
            <h3 className="card-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={18} color="#106cc2" />
              <span>Recent Activity</span>
            </h3>
            <NavLink to="/admin/audit-logs" style={{ fontSize: '12.5px', color: '#106cc2', fontWeight: 600, textDecoration: 'none' }}>
              View Audit Log &rarr;
            </NavLink>
          </div>

          <div className="dash-timeline-list">
            {activityItems && activityItems.length > 0 ? (
              activityItems.slice(0, 5).map((log, index) => {
                const isDraft = log.action?.toLowerCase().includes('draft');
                const isPublish = log.action?.toLowerCase().includes('publish');
                return (
                  <div key={log.id || index} className="dash-timeline-item">
                    <span className={`dash-timeline-dot ${isPublish ? 'publish' : (isDraft ? 'draft' : 'other')}`} />
                    <div className="dash-timeline-content">
                      <div className="dash-timeline-header">
                        <span className="dash-timeline-action">{log.action || 'Activity recorded'}</span>
                        <span className="dash-timeline-time">{formatActivityTime(log.created_at)}</span>
                      </div>
                      <p className="dash-timeline-target">
                        {log.target || log.details || 'Website modification'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="cms-hint" style={{ padding: '20px 0', textAlign: 'center' }}>
                No recent activity records found.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Recent Inquiries */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="card-header-flex">
            <h3 className="card-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Inbox size={18} color="#106cc2" />
              <span>Recent Form Submissions</span>
            </h3>
            <NavLink to="/admin/forms" style={{ fontSize: '12.5px', color: '#106cc2', fontWeight: 600, textDecoration: 'none' }}>
              View All ({stats.total_submissions}) &rarr;
            </NavLink>
          </div>

          {recentSubmissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8' }}>
              <Inbox size={32} style={{ marginBottom: '8px', opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '0.88rem' }}>No visitor inquiries received yet.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper" style={{ marginTop: '12px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Form</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>View</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.slice(0, 5).map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className={`status-badge badge-${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td style={{ textTransform: 'capitalize', color: '#64748b' }}>{item.form_type}</td>
                      <td style={{ color: '#64748b', fontSize: '0.82rem' }}>
                        {item.created_at ? item.created_at.split(' ')[0] : ''}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <NavLink to={`/admin/forms/${item.id}`} className="btn-action-icon" title="View Submission Details">
                          <Eye size={15} />
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          5. PUBLISH CONFIRMATION MODAL (Transaction Safety & Change Summary)
          ========================================================================= */}
      <AnimatePresence>
        {publishModalOpen && (
          <div className="cms-modal-backdrop" onClick={() => setPublishModalOpen(false)}>
            <motion.div 
              className="cms-modal-box"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cms-modal-icon publish-icon">
                <UploadCloud size={32} />
              </div>
              <h3>Publish Changes?</h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '16px' }}>
                You are about to make the current draft visible on the live website.
              </p>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '14px 16px',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.86rem', marginBottom: '6px' }}>
                  Summary of Changes ({stats.draft_changes || websiteStatus.draft_changes_count || 1})
                </div>
                {websiteStatus.draft_changes_summary && websiteStatus.draft_changes_summary.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.83rem', color: '#64748b' }}>
                    {websiteStatus.draft_changes_summary.slice(0, 5).map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '3px' }}>{item}</li>
                    ))}
                    {websiteStatus.draft_changes_summary.length > 5 && (
                      <li style={{ color: '#94a3b8' }}>+ {websiteStatus.draft_changes_summary.length - 5} additional changes</li>
                    )}
                  </ul>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.83rem', color: '#64748b' }}>
                    All draft updates to pages, sections, colors, and media will be released live.
                  </p>
                )}
              </div>

              <div className="cms-modal-actions">
                <button 
                  className="btn-modal-cancel" 
                  onClick={() => setPublishModalOpen(false)}
                  disabled={publishing}
                >
                  Cancel
                </button>
                <button 
                  className="btn-modal-confirm publish-btn" 
                  onClick={handlePublish}
                  disabled={publishing}
                >
                  {publishing ? <Loader2 size={15} className="spin-icon" /> : null}
                  <span>{publishing ? 'Publishing...' : 'Publish'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDashboard;
