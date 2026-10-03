import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/api';
import { 
  LayoutDashboard, 
  Inbox, 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  Palette, 
  Sparkles, 
  Link as LinkIcon, 
  Sliders, 
  Settings, 
  User, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Award, 
  Users, 
  MessageSquareQuote, 
  HelpCircle, 
  Compass, 
  History 
} from 'lucide-react';
import '../styles/admin.css';

const AdminLayout = () => {
  const { user, token, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [builderOpen, setBuilderOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/dashboard.php`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.statistics) {
          setUnreadCount(data.statistics.new_submissions || 0);
        }
      }
    } catch (e) {
      console.error('Failed to fetch unread badge:', e);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [token, location.pathname]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/builder/pages')) return 'Website Builder — Pages';
    if (path.includes('/admin/builder/media')) return 'Website Builder — Media Library';
    if (path.includes('/admin/builder/header')) return 'Website Builder — Header & Navigation';
    if (path.includes('/admin/builder/footer')) return 'Website Builder — Footer & Social Links';
    if (path.includes('/admin/content/services')) return 'Content Management — Services';
    if (path.includes('/admin/content/team')) return 'Content Management — Team & Founder';
    if (path.includes('/admin/content/testimonials')) return 'Content Management — Testimonials';
    if (path.includes('/admin/content/faqs')) return 'Content Management — FAQs';
    if (path.includes('/admin/content/gallery')) return 'Content Management — Gallery & Tours';
    if (path.includes('/admin/forms/')) return 'Form Submission Details';
    if (path.includes('/admin/forms')) return 'Visitor Form Inquiries';
    if (path.includes('/admin/audit-logs')) return 'Admin Activity & Audit Trail';
    if (path.includes('/admin/settings')) return 'General & SEO Settings';
    if (path.includes('/admin/profile')) return 'Admin Profile';
    return 'Executive CMS Dashboard';
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar Overlay for Mobile */}
      {mobileSidebarOpen && (
        <div 
          className="admin-sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        {/* Brand */}
        <NavLink to="/admin/dashboard" className="sidebar-brand">
          <img src="/assets/images/logo.png" alt="Logo" className="sidebar-logo" />
          <div>
            <span className="sidebar-brand-title">Sports & MICE</span>
            <span className="sidebar-brand-badge">CMS PANEL</span>
          </div>
        </NavLink>

        {/* Nav list */}
        <div className="sidebar-nav">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            end
          >
            <div className="sidebar-item-left">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </div>
          </NavLink>

          {/* Group 1: Website */}
          <div className="sidebar-group-header" onClick={() => setBuilderOpen(!builderOpen)}>
            <span>Website</span>
            {builderOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>

          {builderOpen && (
            <div className="sidebar-sub-menu">
              <NavLink 
                to="/admin/website-builder" 
                className={({ isActive }) => `sidebar-sub-item ${isActive ? 'active' : ''}`}
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#38bdf8', fontWeight: 600 }}
              >
                <Sparkles size={15} color="#38bdf8" />
                <span>Visual Page Builder</span>
              </NavLink>

              <NavLink 
                to="/admin/builder/pages" 
                className={({ isActive }) => `sidebar-sub-item ${isActive ? 'active' : ''}`}
              >
                <FileText size={15} />
                <span>Pages</span>
              </NavLink>

              <NavLink 
                to="/admin/builder/media" 
                className={({ isActive }) => `sidebar-sub-item ${isActive ? 'active' : ''}`}
              >
                <ImageIcon size={15} />
                <span>Media Library</span>
              </NavLink>
            </div>
          )}

          {/* Group 2: Content */}
          <div className="sidebar-group-header" onClick={() => setContentOpen(!contentOpen)}>
            <span>Content</span>
            {contentOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>

          {contentOpen && (
            <div className="sidebar-sub-menu">
              <NavLink 
                to="/admin/content/services" 
                className={({ isActive }) => `sidebar-sub-item ${isActive ? 'active' : ''}`}
              >
                <Award size={15} />
                <span>Services</span>
              </NavLink>

              <NavLink 
                to="/admin/content/team" 
                className={({ isActive }) => `sidebar-sub-item ${isActive ? 'active' : ''}`}
              >
                <Users size={15} />
                <span>Team</span>
              </NavLink>

              <NavLink 
                to="/admin/content/testimonials" 
                className={({ isActive }) => `sidebar-sub-item ${isActive ? 'active' : ''}`}
              >
                <MessageSquareQuote size={15} />
                <span>Testimonials</span>
              </NavLink>

              <NavLink 
                to="/admin/content/faqs" 
                className={({ isActive }) => `sidebar-sub-item ${isActive ? 'active' : ''}`}
              >
                <HelpCircle size={15} />
                <span>FAQs</span>
              </NavLink>

              <NavLink 
                to="/admin/content/gallery" 
                className={({ isActive }) => `sidebar-sub-item ${isActive ? 'active' : ''}`}
              >
                <Compass size={15} />
                <span>Gallery</span>
              </NavLink>
            </div>
          )}

          {/* Group 3: Inquiries */}
          <div className="sidebar-section-title">Inquiries</div>

          <NavLink 
            to="/admin/forms" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="sidebar-item-left">
              <Inbox size={18} />
              <span>Form Submissions</span>
            </div>
            {unreadCount > 0 && (
              <span className="sidebar-badge">{unreadCount}</span>
            )}
          </NavLink>

          {/* Group 4: Settings */}
          <div className="sidebar-section-title">Settings</div>

          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="sidebar-item-left">
              <Settings size={18} />
              <span>General & SEO</span>
            </div>
          </NavLink>

          <NavLink 
            to="/admin/builder/header" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="sidebar-item-left">
              <Sliders size={18} />
              <span>Header & Footer</span>
            </div>
          </NavLink>

          <NavLink 
            to="/admin/audit-logs" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="sidebar-item-left">
              <History size={18} />
              <span>Audit Log</span>
            </div>
          </NavLink>

          <NavLink 
            to="/admin/profile" 
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="sidebar-item-left">
              <User size={18} />
              <span>Admin Profile</span>
            </div>
          </NavLink>
        </div>

        {/* Footer with logged in user */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-info-text">
              <p className="user-name">{user?.name || 'Administrator'}</p>
              <p className="user-role">{user?.email || 'admin@sportsandmice.com'}</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="logout-btn-icon" 
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button 
              className="mobile-sidebar-toggle"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="topbar-page-title">{getPageTitle()}</h1>
          </div>

          <div className="topbar-right">
            <a href="/?preview=true" target="_blank" rel="noopener noreferrer" className="btn-preview-site">
              <span>Preview Live Site</span>
              <ExternalLink size={14} />
            </a>

            <NavLink 
              to="/admin/profile" 
              className="topbar-user-pill"
              title="View & Edit Admin Profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px 5px 6px',
                borderRadius: '24px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                color: '#1e293b',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #106cc2, #2563eb)',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {(user?.name || 'Marc Knuelle')[0].toUpperCase()}
              </div>
              <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{user?.name || 'Marc Knuelle'}</span>
            </NavLink>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <div className="admin-content-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
