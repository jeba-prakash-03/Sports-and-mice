import React, { useState, useEffect } from 'react';
import { fetchAuditLogs } from '../../services/api';
import { History, Shield, Clock, Search, Loader2 } from 'lucide-react';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    const data = await fetchAuditLogs();
    setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.target.toLowerCase().includes(search.toLowerCase()) ||
    l.admin_email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page-container">
      <div className="cms-page-header-row">
        <div>
          <h2 className="cms-page-title">Admin Activity & Audit Trail</h2>
          <p className="cms-page-subtitle">Complete chronological history of changes, drafts, publishing actions, and media uploads.</p>
        </div>

        <button type="button" onClick={loadLogs} className="btn-secondary-action">
          <Clock size={15} />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="cms-media-toolbar">
        <div className="media-search-box" style={{ width: '380px' }}>
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search actions, admin email, or target..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="media-search-input"
          />
        </div>
      </div>

      <div className="cms-panel-card" style={{ marginTop: '20px' }}>
        {loading ? (
          <div className="media-loading-state">
            <Loader2 size={32} className="spin-icon" />
            <p>Loading activity trail...</p>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="crud-items-table">
            <div className="crud-table-header">
              <span style={{ width: '160px' }}>Timestamp</span>
              <span style={{ width: '220px' }}>Administrator</span>
              <span style={{ width: '200px' }}>Action</span>
              <span style={{ width: '180px' }}>Target</span>
              <span style={{ flex: 1 }}>Details / IP</span>
            </div>

            {filteredLogs.map((log) => (
              <div key={log.id} className="crud-table-row">
                <div style={{ width: '160px', fontSize: '13px', color: '#666666' }}>
                  {log.created_at}
                </div>

                <div style={{ width: '220px', fontWeight: 600, color: '#222222' }}>
                  {log.admin_email}
                </div>

                <div style={{ width: '200px' }}>
                  <span className="log-action-badge">{log.action}</span>
                </div>

                <div style={{ width: '180px', color: '#444444', fontWeight: 500 }}>
                  {log.target}
                </div>

                <div style={{ flex: 1, fontSize: '13px', color: '#777777' }}>
                  <span>{log.details || '—'}</span>
                  {log.ip && <span className="ip-badge">IP: {log.ip}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cms-empty-selection" style={{ padding: '40px 20px' }}>
            <History size={40} className="empty-icon" />
            <h4>No activity logs found</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogs;
