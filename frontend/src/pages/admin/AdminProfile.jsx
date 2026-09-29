import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Save, 
  Check, 
  User, 
  Lock, 
  Mail, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  Loader2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProfile = () => {
  const { user, token, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'Marc Knuelle');
  const [email, setEmail] = useState(user?.email || 'admin@sportsandmice.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (password && password !== confirmPassword) {
      setMsg({ text: 'New passwords do not match. Please verify both fields.', type: 'error' });
      return;
    }

    if (password && password.length < 6) {
      setMsg({ text: 'Password must be at least 6 characters long for security.', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password: password || undefined })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({ text: 'Profile & security credentials updated successfully!', type: 'success' });
        updateUserProfile({ name, email });
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setMsg(null), 4000);
      } else {
        setMsg({ text: data.error || 'Failed to update profile.', type: 'error' });
      }
    } catch (e) {
      setMsg({ text: 'Error connecting to server. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'MK';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      {/* Alert Notification Toast */}
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`cms-alert-banner ${msg.type === 'success' ? 'cms-alert-success' : 'cms-alert-error'}`}
            style={{ marginBottom: '20px' }}
          >
            {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{msg.text}</span>
            <button className="cms-alert-close" onClick={() => setMsg(null)}>×</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Admin Identity Badge Card */}
        <div className="admin-card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #106cc2 0%, #2563eb 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
            border: '3px solid #eff6ff'
          }}>
            {getInitials(name)}
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
            {name}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 14px 0' }}>
            {email}
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '4px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '24px' }}>
            <ShieldCheck size={14} />
            <span>Master Administrator</span>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <KeyRound size={14} /> Access Level:
              </span>
              <strong style={{ color: '#0f172a' }}>Full CMS & Database</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> Session:
              </span>
              <strong style={{ color: '#059669' }}>Active & Secure</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.84rem' }}>
              <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> Version Control:
              </span>
              <strong style={{ color: '#2563eb' }}>Enabled</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Account Details & Security Form */}
        <div className="admin-card">
          <div className="card-header-flex">
            <div>
              <h2 className="card-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} color="#106cc2" />
                <span>Account Profile & Security</span>
              </h2>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                Update your personal name, primary login email, and authentication credentials.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Section 1: Basic Information */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                1. Personal Information
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-input-group">
                  <label htmlFor="admin-name">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      id="admin-name"
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="admin-text-input"
                      style={{ paddingLeft: '38px' }}
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="admin-input-group">
                  <label htmlFor="admin-email">Login Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      id="admin-email"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="admin-text-input"
                      style={{ paddingLeft: '38px' }}
                      placeholder="admin@sportsandmice.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Password & Credentials */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  2. Change Password
                </h4>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Leave blank to keep existing password</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-input-group">
                  <label htmlFor="admin-pass">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      id="admin-pass"
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="admin-text-input"
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>

                <div className="admin-input-group">
                  <label htmlFor="admin-pass-confirm">Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      id="admin-pass-confirm"
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="admin-text-input"
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Submit Footer */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="submit"
                disabled={saving}
                className="btn-admin-primary"
                style={{ padding: '11px 26px', fontSize: '0.92rem' }}
              >
                {saving ? <Loader2 size={16} className="spin-icon" /> : <Save size={16} />}
                <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminProfile;
