import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Globe, 
  Trash2, 
  Send, 
  Save, 
  Check, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminFormDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('new');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions.php?id=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setSubmission(data.data);
          setStatus(data.data.status || 'new');
          setNotes(data.data.notes || '');
        }
      }
    } catch (e) {
      console.error('Failed to load submission detail:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id, token]);

  const handleSaveStatusAndNotes = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/submissions.php?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status, notes })
      });

      if (res.ok) {
        setMsg({ text: 'Changes saved successfully!', type: 'success' });
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (e) {
      setMsg({ text: 'Failed to save changes', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete submission #${id}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/submissions.php?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        navigate('/admin/forms');
      }
    } catch (e) {
      alert('Failed to delete submission');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
        <RefreshCw size={24} className="spin-icon" style={{ color: '#106cc2' }} />
        <p style={{ marginTop: '8px' }}>Loading submission #{id}...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '50px 0' }}>
        <AlertCircle size={36} color="#ef4444" style={{ marginBottom: '12px' }} />
        <h3 style={{ margin: 0, color: '#0f172a' }}>Submission Not Found</h3>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>The requested submission ID does not exist or was deleted.</p>
        <NavLink to="/admin/forms" className="btn-admin-primary">
          <ArrowLeft size={16} /> Back to Submissions
        </NavLink>
      </div>
    );
  }

  const formData = submission.form_data || {};

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Top action header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <NavLink 
          to="/admin/forms" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} /> Back to Submissions List
        </NavLink>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a 
            href={`mailto:${submission.email}?subject=Re: ${encodeURIComponent(submission.subject || 'Sports & MICE Inquiry')}`}
            className="btn-admin-primary"
            style={{ textDecoration: 'none' }}
          >
            <Send size={15} /> Reply by Email
          </a>

          <button onClick={handleDelete} className="btn-admin-secondary" style={{ color: '#ef4444' }}>
            <Trash2 size={15} /> Delete
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

      {/* Main Grid: Details on Left, Status & Internal Notes on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px'
      }}>
        {/* Left Column: Full Message & Form Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Inquiry Message Card */}
          <div className="admin-card" style={{ marginBottom: 0 }}>
            <div className="card-header-flex">
              <h3 className="card-heading" style={{ fontSize: '17px' }}>
                Submitted Message
              </h3>
              <span className={`status-badge badge-${submission.status}`}>
                {submission.status}
              </span>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '20px',
              fontSize: '15px',
              lineHeight: 1.7,
              color: '#1e293b',
              whiteSpace: 'pre-wrap'
            }}>
              {submission.message}
            </div>
          </div>

          {/* Contact & Location Details Card */}
          <div className="admin-card" style={{ marginBottom: 0 }}>
            <div className="card-header-flex">
              <h3 className="card-heading">Visitor Information</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13.5px' }}>
              <div>
                <strong style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Full Name:</strong>
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>{submission.name}</span>
              </div>

              <div>
                <strong style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Email Address:</strong>
                <a href={`mailto:${submission.email}`} style={{ color: '#106cc2', fontSize: '15px', fontWeight: '600' }}>
                  {submission.email}
                </a>
              </div>

              <div>
                <strong style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Phone:</strong>
                <span>{submission.phone || formData.phone || 'Not provided'}</span>
              </div>

              <div>
                <strong style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Country / Location:</strong>
                <span>{formData.country || 'Not provided'}</span>
              </div>

              <div>
                <strong style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>City:</strong>
                <span>{formData.city || 'Not provided'}</span>
              </div>

              <div>
                <strong style={{ color: '#64748b', display: 'block', marginBottom: '4px' }}>Street Address:</strong>
                <span>{formData.address || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status Updater, Admin Notes & Technical Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Status & Notes Form Card */}
          <div className="admin-card" style={{ marginBottom: 0 }}>
            <div className="card-header-flex">
              <h3 className="card-heading">Status & Notes</h3>
            </div>

            <div className="admin-input-group">
              <label>Update Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="admin-select-input"
              >
                <option value="new">New (Unread)</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="admin-input-group">
              <label>Internal Admin Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                placeholder="Add private staff notes here..."
                className="admin-textarea"
              />
            </div>

            <button 
              onClick={handleSaveStatusAndNotes}
              disabled={saving}
              className="btn-admin-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Save size={15} /> {saving ? 'Saving...' : 'Save Updates'}
            </button>
          </div>

          {/* Submission Metadata */}
          <div className="admin-card" style={{ marginBottom: 0, fontSize: '12.5px', color: '#64748b' }}>
            <div className="card-header-flex" style={{ marginBottom: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '13px', color: '#0f172a' }}>Technical Audit</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ margin: 0 }}><strong>ID:</strong> #{submission.id}</p>
              <p style={{ margin: 0 }}><strong>Form Type:</strong> {submission.form_type}</p>
              <p style={{ margin: 0 }}><strong>Submitted:</strong> {submission.created_at}</p>
              <p style={{ margin: 0 }}><strong>Last Updated:</strong> {submission.updated_at}</p>
              {submission.ip_address && (
                <p style={{ margin: 0 }}><strong>IP Address:</strong> {submission.ip_address}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminFormDetail;
