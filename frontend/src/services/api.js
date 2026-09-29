// frontend/src/services/api.js

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

// Helper for auth headers
const getAuthHeaders = (token) => {
  const authToken = token || localStorage.getItem('sm_admin_token') || localStorage.getItem('sports_admin_token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
  };
};

// Check for 401 Unauthorized and handle session invalidation
export const handleAuthResponse = (response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('sm_admin_token');
    localStorage.removeItem('sports_admin_token');
    localStorage.removeItem('sm_admin_user');
    if (window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/admin/login')) {
      window.location.href = '/admin/login';
    }
  }
  return response;
};

/* ================= PUBLIC & PREVIEW APIs ================= */

export const fetchPublicSiteConfig = async (preview = false) => {
  try {
    const authToken = localStorage.getItem('sm_admin_token') || localStorage.getItem('sports_admin_token');
    const url = preview ? `${API_BASE_URL}/site-config.php?preview=true` : `${API_BASE_URL}/site-config.php`;
    const headers = {};
    if (preview && authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    const response = await fetch(url, { headers });
    const result = await response.json();
    return result.data || {};
  } catch (error) {
    console.error('Failed to fetch site config:', error);
    return null;
  }
};

export const submitContactForm = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      ok: false,
      status: 500,
      data: {
        success: false,
        error: error.message || 'Network error occurred. Please check backend connection.'
      }
    };
  }
};

/* ================= ADMIN CMS & BUILDER APIs ================= */

export const fetchAdminConfig = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/config.php`, {
      headers: getAuthHeaders()
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Admin config fetch error:', error);
    return { success: false, error: error.message };
  }
};

export const saveDraftConfig = async (config, sectionName = 'Website Builder') => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/config.php`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        action: 'save_draft',
        config,
        section_name: sectionName
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Save draft error:', error);
    return { success: false, error: error.message };
  }
};

export const publishConfig = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/config.php`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action: 'publish' })
    });
    return await response.json();
  } catch (error) {
    console.error('Publish error:', error);
    return { success: false, error: error.message };
  }
};

export const resetConfig = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/config.php`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action: 'reset' })
    });
    return await response.json();
  } catch (error) {
    console.error('Reset error:', error);
    return { success: false, error: error.message };
  }
};

export const discardDraft = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/config.php`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action: 'discard' })
    });
    return await response.json();
  } catch (error) {
    console.error('Discard draft error:', error);
    return { success: false, error: error.message };
  }
};

/* ================= MEDIA LIBRARY APIs ================= */

export const fetchMedia = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/media.php`, {
      headers: getAuthHeaders()
    });
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Media fetch error:', error);
    return [];
  }
};

export const uploadMediaFile = async (file, altText = '', category = 'Uploads') => {
  try {
    const authToken = localStorage.getItem('sm_admin_token') || localStorage.getItem('sports_admin_token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', altText);
    formData.append('category', category);

    const response = await fetch(`${API_BASE_URL}/admin/upload.php`, {
      method: 'POST',
      headers: {
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
      },
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteMediaItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/media.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await response.json();
  } catch (error) {
    console.error('Delete media error:', error);
    return { success: false, error: error.message };
  }
};

/* ================= AUDIT LOGS ================= */

export const fetchAuditLogs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/audit-logs.php`, {
      headers: getAuthHeaders()
    });
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Audit logs error:', error);
    return [];
  }
};

/* ================= FORM SUBMISSIONS APIs ================= */

export const fetchSubmissions = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/admin/submissions.php?${query}`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  } catch (error) {
    console.error('Submissions fetch error:', error);
    return { success: false, data: [] };
  }
};

export const updateSubmission = async (id, payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/submissions.php?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.error('Update submission error:', error);
    return { success: false, error: error.message };
  }
};

export const deleteSubmission = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/submissions.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await response.json();
  } catch (error) {
    console.error('Delete submission error:', error);
    return { success: false, error: error.message };
  }
};
