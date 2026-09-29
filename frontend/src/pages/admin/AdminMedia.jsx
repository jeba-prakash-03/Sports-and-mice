import React, { useState, useEffect } from 'react';
import { fetchMedia, uploadMediaFile, deleteMediaItem } from '../../services/api';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  AlertCircle,
  Loader2,
  ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminMedia = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const loadMedia = async () => {
    setLoading(true);
    const items = await fetchMedia();
    setMediaItems(items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const res = await uploadMediaFile(file, file.name, selectedCategory !== 'all' ? selectedCategory : 'Uploads');
    if (res.success && res.data) {
      await loadMedia();
      setSelectedImage(res.data);
    } else {
      setUploadError(res.error || 'Failed to upload image. (Allowed: JPG, PNG, WEBP, SVG, Max 8MB)');
    }
    setUploading(false);
    // Reset file input
    e.target.value = '';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media file?')) return;
    const res = await deleteMediaItem(id);
    if (res.success) {
      setMediaItems(prev => prev.filter(m => m.id !== id));
      if (selectedImage?.id === id) setSelectedImage(null);
    } else {
      alert(res.error || 'Delete failed');
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const categories = ['all', 'Hero', 'About', 'Hotels', 'Branding', 'Uploads'];

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.alt_text && item.alt_text.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-page-container">
      <div className="cms-page-header-row">
        <div>
          <h2 className="cms-page-title">Media & Image Library</h2>
          <p className="cms-page-subtitle">Upload, manage, and replace high-resolution images across your website pages and sections.</p>
        </div>

        {/* Upload Trigger Button */}
        <label className="cms-btn-primary upload-label-btn">
          {uploading ? <Loader2 size={16} className="spin-icon" /> : <Upload size={16} />}
          <span>{uploading ? 'Uploading...' : 'Upload New Image'}</span>
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif" 
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }} 
          />
        </label>
      </div>

      {uploadError && (
        <div className="cms-alert-banner cms-alert-error" style={{ marginBottom: '20px' }}>
          <AlertCircle size={18} />
          <span>{uploadError}</span>
          <button className="cms-alert-close" onClick={() => setUploadError(null)}>×</button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="cms-media-toolbar">
        <div className="media-search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search images by name or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="media-search-input"
          />
        </div>

        <div className="media-categories-pills">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              className={`media-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All Files' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid & Sidebar Inspector */}
      <div className="cms-media-workspace">
        {/* Media Items Grid */}
        <div className="media-grid-area">
          {loading ? (
            <div className="media-loading-state">
              <Loader2 size={32} className="spin-icon" />
              <p>Loading media library...</p>
            </div>
          ) : filteredMedia.length > 0 ? (
            <div className="media-cards-grid">
              {filteredMedia.map(item => (
                <div 
                  key={item.id} 
                  className={`media-card-thumb ${selectedImage?.id === item.id ? 'is-selected' : ''}`}
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="media-thumb-wrapper">
                    <img src={item.url} alt={item.alt_text || item.name} loading="lazy" />
                  </div>
                  <div className="media-thumb-info">
                    <span className="media-filename" title={item.name}>{item.name}</span>
                    <span className="media-size-tag">{item.size_kb ? `${item.size_kb} KB` : 'Asset'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cms-empty-selection" style={{ padding: '60px 20px' }}>
              <ImageIcon size={48} className="empty-icon" />
              <h4>No media files found</h4>
              <p>Upload new images or adjust your search keyword.</p>
            </div>
          )}
        </div>

        {/* Selected Image Inspector Panel */}
        {selectedImage && (
          <div className="media-inspector-panel">
            <h3 className="inspector-title">Image Details</h3>
            
            <div className="inspector-preview-frame">
              <img src={selectedImage.url} alt={selectedImage.alt_text || selectedImage.name} />
            </div>

            <div className="inspector-meta-fields">
              <div className="meta-field-row">
                <span className="meta-label">File Name:</span>
                <span className="meta-value">{selectedImage.name}</span>
              </div>
              <div className="meta-field-row">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{selectedImage.category || 'General'}</span>
              </div>
              <div className="meta-field-row">
                <span className="meta-label">File Size:</span>
                <span className="meta-value">{selectedImage.size_kb} KB</span>
              </div>
              <div className="meta-field-row">
                <span className="meta-label">Uploaded At:</span>
                <span className="meta-value">{selectedImage.created_at || 'Default'}</span>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="cms-label">Image URL (Copy to use in sections):</label>
              <div className="url-copy-box">
                <input 
                  type="text" 
                  readOnly 
                  value={selectedImage.url} 
                  className="cms-input url-input"
                />
                <button 
                  type="button" 
                  onClick={() => handleCopyUrl(selectedImage.url)}
                  className="btn-copy-url"
                  title="Copy URL"
                >
                  {copiedUrl === selectedImage.url ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="inspector-actions-row">
              <a 
                href={selectedImage.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-inspector-link"
              >
                <ExternalLink size={14} />
                <span>View Full Size</span>
              </a>

              <button 
                type="button" 
                onClick={() => handleDelete(selectedImage.id)} 
                className="btn-inspector-delete"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMedia;
