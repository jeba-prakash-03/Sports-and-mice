import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../services/api';
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Check, 
  Download, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  MailCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminForms = () => {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formTypeFilter, setFormTypeFilter] = useState('');
  const [notification, setNotification] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchSubmissions = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 15,
        search,
        status: statusFilter,
        form_type: formTypeFilter,
        sort_by: 'created_at',
        sort_order: 'DESC'
      });

      const res = await fetch(`${API_BASE_URL}/admin/submissions.php?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setSubmissions(data.data.items || []);
          setPagination({
            total: data.data.total,
            page: data.data.page,
            limit: data.data.limit,
            total_pages: data.data.total_pages
          });
        }
      }
    } catch (e) {
      console.error('Failed to load submissions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(1);
  }, [statusFilter, formTypeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSubmissions(1);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/submissions.php`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (res.ok) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
        showNotification(`Submission #${id} marked as ${newStatus}`);
      }
    } catch (e) {
      showNotification('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/submissions.php?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setSubmissions(prev => prev.filter(s => s.id !== id));
        setDeleteConfirmId(null);
        showNotification(`Submission #${id} deleted.`);
      }
    } catch (e) {
      showNotification('Failed to delete submission', 'error');
    }
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const exportCSV = () => {
    if (submissions.length === 0) return;
    const headers = ['ID', 'Form Type', 'Name', 'Email', 'Phone', 'Status', 'Date', 'Message'];
    const rows = submissions.map(s => [
      s.id,
      s.form_type,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      s.email,
      s.phone || '',
      s.status,
      s.created_at,
      `"${(s.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sports_mice_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 9999,
              backgroundColor: notification.type === 'error' ? '#ef4444' : '#10b981',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontWeight: '600',
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Check size={16} />
            <span>{notification.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and Controls */}
      <div className="admin-card">
        <div className="card-header-flex" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 className="card-heading" style={{ fontSize: '18px' }}>
              All Form Submissions ({pagination.total})
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
              Search, filter, view details, and reply to visitor inquiries.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={exportCSV} className="btn-admin-secondary" style={{ padding: '8px 14px', fontSize: '13px' }}>
              <Download size={15} /> Export CSV
            </button>
            <button onClick={() => fetchSubmissions(pagination.page)} className="btn-admin-secondary" style={{ padding: '8px 14px', fontSize: '13px' }}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr auto',
          gap: '12px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e2e8f0'
        }}>
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '6px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search name, email, keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-text-input"
                style={{ paddingLeft: '34px', height: '38px' }}
              />
            </div>
            <button type="submit" className="btn-admin-primary" style={{ padding: '0 14px', height: '38px' }}>
              Search
            </button>
          </form>

          {/* Status filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select-input"
            style={{ height: '38px' }}
          >
            <option value="">All Statuses</option>
            <option value="new">New / Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>

          {/* Form type filter */}
          <select 
            value={formTypeFilter} 
            onChange={(e) => setFormTypeFilter(e.target.value)}
            className="admin-select-input"
            style={{ height: '38px' }}
          >
            <option value="">All Form Types</option>
            <option value="contact">Contact Form</option>
            <option value="inquiry">General Inquiry</option>
          </select>

          {/* Reset button */}
          {(search || statusFilter || formTypeFilter) && (
            <button 
              onClick={() => { setSearch(''); setStatusFilter(''); setFormTypeFilter(''); }}
              className="btn-admin-secondary"
              style={{ height: '38px' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748b' }}>
            <RefreshCw size={24} className="spin-icon" style={{ color: '#106cc2' }} />
            <p style={{ marginTop: '8px' }}>Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#94a3b8' }}>
            <AlertCircle size={36} style={{ opacity: 0.5, marginBottom: '8px' }} />
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#334155', margin: 0 }}>No submissions match your filters</p>
            <p style={{ fontSize: '13px', margin: '4px 0 0 0' }}>Try clearing filters or search query.</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message Snippet</th>
                    <th>Submitted Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((item) => (
                    <tr key={item.id} style={{ backgroundColor: item.status === 'new' ? '#fffdfa' : 'transparent' }}>
                      <td style={{ fontWeight: '700' }}>#{item.id}</td>
                      <td>
                        <span className={`status-badge badge-${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600' }}>{item.name}</td>
                      <td>
                        <a href={`mailto:${item.email}`} style={{ color: '#106cc2' }}>{item.email}</a>
                      </td>
                      <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#475569' }}>
                        {item.message}
                      </td>
                      <td style={{ color: '#64748b', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                        {item.created_at}
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <NavLink 
                            to={`/admin/forms/${item.id}`} 
                            className="btn-action-icon" 
                            title="View Full Details"
                          >
                            <Eye size={15} />
                          </NavLink>

                          {item.status === 'new' ? (
                            <button
                              onClick={() => handleStatusChange(item.id, 'read')}
                              className="btn-action-icon"
                              title="Mark as Read"
                            >
                              <Check size={15} color="#16a34a" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(item.id, 'new')}
                              className="btn-action-icon"
                              title="Mark as New"
                            >
                              <MailCheck size={15} color="#2563eb" />
                            </button>
                          )}

                          <button 
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="btn-action-icon btn-action-delete"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0',
              marginTop: '16px',
              fontSize: '13px',
              color: '#64748b'
            }}>
              <div>
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchSubmissions(pagination.page - 1)}
                  className="btn-admin-secondary"
                  style={{ padding: '6px 10px' }}
                >
                  <ChevronLeft size={16} />
                </button>

                <span style={{ fontWeight: '600', padding: '0 8px', color: '#0f172a' }}>
                  Page {pagination.page} of {pagination.total_pages || 1}
                </span>

                <button
                  disabled={pagination.page >= pagination.total_pages}
                  onClick={() => fetchSubmissions(pagination.page + 1)}
                  className="btn-admin-secondary"
                  style={{ padding: '6px 10px' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a' }}>
              Confirm Deletion
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#64748b' }}>
              Are you sure you want to permanently delete submission <strong>#{deleteConfirmId}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="btn-admin-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminForms;
