import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  FolderOpen, 
  Link as LinkIcon, 
  Check, 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  Eye, 
  Sparkles,
  Heading,
  Type,
  Square,
  Columns,
  Star,
  Quote,
  BadgeAlert,
  List,
  Video,
  Minus,
  MoveVertical
} from 'lucide-react';

/**
 * Standard Editor Action Button
 */
export const EditorButton = ({
  variant = 'primary', // 'primary' | 'secondary' | 'success' | 'danger' | 'purple' | 'cyan' | 'amber' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = null,
  children,
  onClick,
  disabled = false,
  title = '',
  className = '',
  style = {},
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`editor-btn editor-btn-${variant} editor-btn-${size} ${disabled ? 'disabled' : ''} ${className}`}
      style={style}
    >
      {icon && <span className="editor-btn-icon">{icon}</span>}
      {children && <span className="editor-btn-text">{children}</span>}
    </button>
  );
};

/**
 * Standard Editor Icon-Only Button
 */
export const EditorIconButton = ({
  variant = 'default', // 'move' | 'dup' | 'vis' | 'settings' | 'del' | 'add' | 'default'
  icon,
  onClick,
  disabled = false,
  title = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  style = {},
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`editor-icon-btn btn-${variant} size-${size} ${disabled ? 'disabled' : ''} ${className}`}
      style={style}
    >
      {icon}
    </button>
  );
};

/**
 * Complete Image Picker & Replacement Field
 */
export const ImagePickerField = ({
  label = 'Image',
  value = '',
  altText = '',
  onUrlChange,
  onAltChange,
  onRemove,
  onOpenMediaLibrary,
  onUploadSuccess,
  authToken = null,
  previewHeight = 160,
  showAltField = true
}) => {
  const [urlInput, setUrlInput] = useState(value || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  // Sync internal state if external value changes
  React.useEffect(() => {
    setUrlInput(value || '');
    setImageError(false);
  }, [value]);

  const handleApplyUrl = () => {
    if (onUrlChange) {
      onUrlChange(urlInput);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid format. Please upload JPG, PNG, WEBP, or SVG.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size is 10MB.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', altText || file.name);

    const token = authToken || localStorage.getItem('sm_admin_token') || localStorage.getItem('sports_admin_token');

    try {
      const res = await fetch('/api/admin/upload.php', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      if (res.ok) {
        const json = await res.json();
        const newUrl = json.url || json.data?.url;
        if (newUrl) {
          setUrlInput(newUrl);
          setImageError(false);
          if (onUrlChange) onUrlChange(newUrl);
          if (onUploadSuccess) onUploadSuccess(newUrl, json.data);
        } else {
          setUploadError(json.error || 'Upload failed');
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        setUploadError(errJson.error || 'Failed to upload image to server.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setUploadError('Upload connection failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const fakeEvt = { target: { files } };
      handleFileUpload(fakeEvt);
    }
  };

  const hasImage = Boolean(value && value.trim());

  return (
    <div className="editor-image-picker-field">
      {label && <label className="property-label">{label}</label>}

      {/* Thumbnail Preview Card & Dropzone */}
      <div 
        className={`image-preview-card ${imageError ? 'has-error' : ''}`}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={handleDrop}
        style={{ minHeight: `${previewHeight}px` }}
      >
        {isUploading ? (
          <div className="preview-uploading-state">
            <Loader2 size={26} className="builder-spinning" color="#38bdf8" />
            <span>Uploading & Processing Image...</span>
          </div>
        ) : hasImage && !imageError ? (
          <>
            <img 
              src={value} 
              alt={altText || 'Preview'} 
              onError={() => setImageError(true)}
              className="preview-img-tag"
            />
            <div className="preview-path-badge" title={value}>
              <span>{value.split('/').pop() || value}</span>
            </div>
          </>
        ) : (
          <div className="preview-empty-state">
            {imageError ? (
              <>
                <AlertCircle size={24} color="#f87171" />
                <span className="empty-title">Image Not Found</span>
                <span className="empty-sub">Check URL or select a replacement</span>
              </>
            ) : (
              <>
                <ImageIcon size={26} color="#64748b" />
                <span className="empty-title">No Image Selected</span>
                <span className="empty-sub">Drop an image here or click buttons below</span>
              </>
            )}
          </div>
        )}
      </div>

      {uploadError && (
        <div className="image-upload-error-banner">
          <AlertCircle size={14} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="image-action-buttons-grid">
        <EditorButton
          variant="primary"
          size="sm"
          icon={<FolderOpen size={13} />}
          onClick={onOpenMediaLibrary}
          title="Select from Media Library"
        >
          Library
        </EditorButton>

        <EditorButton
          variant="success"
          size="sm"
          icon={<Upload size={13} />}
          onClick={() => fileInputRef.current?.click()}
          title="Upload image from computer"
        >
          Upload
        </EditorButton>

        {hasImage && onRemove && (
          <EditorButton
            variant="danger"
            size="sm"
            icon={<Trash2 size={13} />}
            onClick={() => {
              if (window.confirm('Remove this image?')) {
                onRemove();
              }
            }}
            title="Remove Image"
            style={{ gridColumn: '1 / -1' }}
          >
            Remove Image
          </EditorButton>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif" 
        onChange={handleFileUpload}
        style={{ display: 'none' }} 
      />

      {/* Manual URL Input */}
      <div className="image-url-input-group">
        <label className="property-sub-label">Direct Image URL</label>
        <div className="input-with-action">
          <input 
            type="text" 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleApplyUrl(); }}
            placeholder="https://... or /assets/images/..."
            className="property-input"
          />
          <EditorButton
            variant="secondary"
            size="sm"
            onClick={handleApplyUrl}
            title="Apply Image URL"
          >
            Apply
          </EditorButton>
        </div>
      </div>

      {/* Alt Text Input */}
      {showAltField && onAltChange && (
        <div className="image-alt-input-group">
          <label className="property-sub-label">Alt Text (Accessibility & SEO)</label>
          <input 
            type="text" 
            value={altText || ''}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Describe this image..."
            className="property-input"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Categorized Quick Add Elements Grid
 */
export const QUICK_ADD_COMPONENTS = [
  { type: 'heading', name: 'Heading', icon: Heading, color: '#38bdf8' },
  { type: 'text', name: 'Text', icon: Type, color: '#60a5fa' },
  { type: 'image', name: 'Image', icon: ImageIcon, color: '#c084fc' },
  { type: 'button', name: 'Button', icon: Sparkles, color: '#fb923c' },
  { type: 'card', name: 'Card', icon: Square, color: '#34d399' },
  { type: 'icon', name: 'Icon', icon: Star, color: '#f472b6' },
  { type: 'divider', name: 'Divider', icon: Minus, color: '#94a3b8' },
  { type: 'spacer', name: 'Spacer', icon: MoveVertical, color: '#94a3b8' },
  { type: 'badge', name: 'Badge', icon: BadgeAlert, color: '#e879f9' },
  { type: 'quote', name: 'Quote', icon: Quote, color: '#fbbf24' },
  { type: 'list', name: 'List', icon: List, color: '#a3e635' },
  { type: 'video', name: 'Video', icon: Video, color: '#f87171' }
];

export const QuickAddGrid = ({ onSelectElement }) => {
  return (
    <div className="editor-quick-add-grid">
      {QUICK_ADD_COMPONENTS.map(c => {
        const IconC = c.icon;
        return (
          <button
            key={c.type}
            type="button"
            className="quick-add-card-btn"
            onClick={() => onSelectElement(c.type)}
          >
            <div className="quick-add-card-icon" style={{ color: c.color, background: `${c.color}15` }}>
              <IconC size={15} />
            </div>
            <span className="quick-add-card-label">{c.name}</span>
          </button>
        );
      })}
    </div>
  );
};
