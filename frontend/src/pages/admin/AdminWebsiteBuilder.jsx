import React, { useState, useEffect } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';
import { useEditor, parseYouTubeUrl } from '../../context/EditorContext';
import { API_BASE_URL } from '../../services/api';

// Import Exact Real Pages & Global Shell
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DynamicSectionRenderer from '../../components/DynamicSectionRenderer';
import Home from '../Home';
import Service from '../Service';
import AboutUs from '../AboutUs';
import HotelsMore from '../HotelsMore';
import Contact from '../Contact';

import { 
  ArrowLeft, 
  ArrowRight,
  Monitor, 
  Tablet, 
  Smartphone, 
  Undo2, 
  Redo2, 
  Eye, 
  Save, 
  Send, 
  Check, 
  Loader2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Copy, 
  EyeOff, 
  MoveUp, 
  MoveDown,
  MoveLeft,
  MoveRight,
  Video, 
  Sliders, 
  Sparkles, 
  Palette, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  X, 
  Upload, 
  Search,
  CheckCircle2,
  RefreshCw,
  Trophy,
  Users,
  Building2,
  MessageSquareQuote,
  HelpCircle,
  Compass,
  FileText,
  Zap,
  Columns,
  Square,
  Play,
  Layers,
  Menu,
  ChevronRight,
  ChevronDown,
  Settings,
  ExternalLink,
  Edit2,
  FolderPlus,
  Navigation,
  Star,
  ShieldCheck,
  Globe2,
  Clock,
  MapPin,
  Mail,
  Phone,
  Heart,
  Award,
  GripVertical,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getResponsiveValue, 
  setResponsiveValue, 
  isExplicitlyOverridden, 
  BREAKPOINTS 
} from '../../utils/responsiveStyles';
import '../../styles/website-builder.css';
import { ImagePickerField, EditorButton, EditorIconButton, QuickAddGrid } from '../../components/admin/EditorUI';

const DEFAULT_NEW_SECTIONS = {
  hero: {
    type: 'hero',
    name: 'Hero Banner Section',
    heading_prefix_en: 'Sports associations &',
    heading_prefix_de: 'Sportverbände &',
    tag1_en: 'Meetings ♢ Incentives',
    tag1_de: 'Meetings ♢ Incentives',
    tag2_en: 'Conferences ♢ Events',
    tag2_de: 'Konferenzen ♢ Events',
    subtitle_en: 'Sport needs professional structures when traveling to competitions and conferences around the world.',
    subtitle_de: 'Sport benötigt professionelle Strukturen bei Reisen zu Wettkämpfen.',
    bg_image: '/assets/images/home_hero_bg.jpg',
    cta_button_text_en: 'Get Free Consultation',
    cta_button_text_de: 'Kostenlose Beratung anfragen',
    cta_button_link: '/en/Contact/',
    cta_button_enabled: true,
    enabled: true
  },
  stats: {
    type: 'stats',
    name: 'Statistics Counter Section',
    stat1_num: 15,
    stat1_suffix: '+',
    stat1_label_en: 'Years in High-Performance Sport',
    stat1_label_de: 'Jahre Erfahrung im Spitzensport',
    stat2_num: 500,
    stat2_suffix: '+',
    stat2_label_en: 'Tailor-Made Sports & MICE Events',
    stat2_label_de: 'Maßgeschneiderte Sports & MICE Events',
    stat3_num: 35,
    stat3_suffix: '+',
    stat3_label_en: 'Global Destinations Worldwide',
    stat3_label_de: 'Destinationen weltweit',
    stat4_num: 100,
    stat4_suffix: '%',
    stat4_label_en: 'Personal Consultation & Execution',
    stat4_label_de: 'Persönliche Beratung & Betreuung',
    enabled: true
  },
  cards: {
    type: 'cards',
    name: '4 Pillars Feature Cards',
    title_en: 'Together for success! Travel and meet like the pros!',
    title_de: 'Gemeinsam zum Erfolg! Reisen und tagen wie die Profis!',
    cards: [
      { num: '01', title_en: 'TEAM TRIPS', desc_en: 'The special needs of sports teams are the focus of planning trips to training camps.' },
      { num: '02', title_en: 'MEETINGS', desc_en: 'Sporting officials need an environment for meetings where they make decisions with foresight.' },
      { num: '03', title_en: 'CONFERENCES', desc_en: 'For meetings and conferences, we find the right venue that suits your athletic participants.' },
      { num: '04', title_en: 'INCENTIVES', desc_en: 'Motivating and extraordinary activities to weld you together to celebrate successes.' }
    ],
    enabled: true
  },
  trust_badges: {
    type: 'trust_badges',
    name: 'Trust & Advantage Badges',
    badges: [
      { title_en: 'Global Network', desc_en: 'Vetted team hotels & venues across 5 continents' },
      { title_en: 'Athletic Expertise', desc_en: 'Tailored nutrition & match proximity' },
      { title_en: 'Complete Logistics', desc_en: 'Airport transfers & equipment routing' },
      { title_en: 'Cost Transparency', desc_en: 'Clear budgets and association rates' }
    ],
    enabled: true
  },
  video: {
    type: 'video',
    name: 'Video & High-Performance Showcase',
    title_en: 'Use our expertise for your sporting success!',
    title_de: 'Nutzen Sie unsere Expertise für Ihren sportlichen Erfolg!',
    video_url: 'https://www.youtube.com/embed/dD_FThvzO9I?start=76&controls=1',
    p1_en: 'Unlike large companies, sports associations usually do not have their own department specializing in trips to competitions.',
    p2_en: 'We take care of the search for the right team hotel for you and organize transport.',
    p3_en: 'Our own experiences in international high-performance sport make us experts!',
    cta_link_en: 'Explore Our Services',
    cta_url: '/en/Service/',
    enabled: true
  },
  services: {
    type: 'services',
    name: 'Services Offerings Grid',
    title_en: 'The right answers to your needs',
    title_de: 'Die passenden Antworten auf Ihre Bedürfnisse',
    enabled: true
  },
  workflow: {
    type: 'workflow',
    name: '4-Step Process Workflow',
    title_en: 'Our 4-Step MICE Success Formula',
    title_de: 'Unser 4-Schritte Erfolgsablauf',
    enabled: true
  },
  cta: {
    type: 'cta',
    name: 'Call to Action Banner',
    title_en: 'Write to us with your request!',
    title_de: 'Schreiben Sie uns Ihr Anliegen!',
    button_text_en: 'Contact Form',
    button_text_de: 'Kontaktformular',
    button_link: '/en/Contact/',
    bg_image: '/assets/images/service_cta_bg.jpg',
    enabled: true
  },
  story: {
    type: 'story',
    name: 'Founder Story Section',
    title_en: 'Active in high-performance sport',
    title_de: 'Aktiv im Spitzensport',
    photo: '/assets/images/about_hockey_referee.jpeg',
    p1_en: 'Our founder, Marc Knuelle, has been an international referee in field hockey since 2000.',
    p2_en: 'As a referee, you learn early on to make decisions again and again and take responsibility.',
    p3_en: 'In 2015 Marc founded K-Consulting Sports & MICE to support sports associations.',
    enabled: true
  },
  gallery: {
    type: 'gallery',
    name: 'Inspection Tours & Hotel Gallery',
    title_en: 'Hotels sights inspection tours',
    title_de: 'Hotels & Besichtigungstouren',
    enabled: true
  },
  testimonials: {
    type: 'testimonials',
    name: 'Client Testimonials',
    title_en: 'Client Testimonials & Trust',
    title_de: 'Kundenstimmen & Referenzen',
    enabled: true
  },
  faq: {
    type: 'faq',
    name: 'FAQ Accordion Section',
    title_en: 'Frequently Asked Questions',
    title_de: 'Häufig gestellte Fragen (FAQ)',
    enabled: true
  },
  contact: {
    type: 'contact',
    name: 'Interactive Contact Form',
    title_en: 'Contact Form',
    title_de: 'Kontaktformular',
    subtitle_en: 'Write us your request, we will get in touch with you',
    subtitle_de: 'Schreiben Sie uns Ihr Anliegen, wir melden uns bei Ihnen',
    enabled: true
  },
  image: {
    type: 'image',
    name: 'Visual Image Showcase',
    title_en: 'Visual Showcase',
    image: '/assets/images/home_hero_bg.jpg',
    enabled: true
  },
  content: {
    type: 'content',
    name: 'Custom Text & Content Block',
    title_en: 'Custom Content Section',
    title_de: 'Individueller Textabschnitt',
    p1_en: 'Add detailed descriptions, information, and paragraphs about your sports services.',
    p1_de: 'Fügen Sie detaillierte Beschreibungen und Informationen zu Ihren Dienstleistungen hinzu.',
    enabled: true
  }
};

export const resolvePageIdFromPath = (path, pages = {}) => {
  if (!path) return 'home';
  const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!clean || clean === 'en' || clean === 'home') return 'home';
  if (clean.includes('service') || clean.includes('dienstleistung')) return 'service';
  if (clean.includes('about') || clean.includes('über-uns')) return 'about';
  if (clean.includes('hotel') || clean.includes('hotels-mehr')) return 'hotels';
  if (clean.includes('contact') || clean.includes('kontakt')) return 'contact';
  if (clean.includes('imprint') || clean.includes('impressum')) return 'imprint';

  for (const [pageId, pData] of Object.entries(pages)) {
    if (pageId.toLowerCase() === clean) return pageId;
    const pSlug = (pData?.slug || '').replace(/^\/+|\/+$/g, '').toLowerCase();
    if (pSlug && (clean === pSlug || clean.endsWith('/' + pSlug) || clean.startsWith(pSlug))) {
      return pageId;
    }
  }
  return null;
};

const AdminWebsiteBuilder = () => {
  const { token } = useAuth();
  const { cmsConfig, loadSiteConfig } = useSite();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    setEditorMode,
    isPreviewMode,
    setIsPreviewMode,
    activePage,
    setActivePage,
    viewport,
    setViewport,
    selectedSectionId,
    setSelectedSectionId,
    selectedElement,
    setSelectedElement,
    activeTab,
    setActiveTab,
    saveStatus,
    setSaveStatus,
    saveDraft,
    autoPublish,
    setAutoPublish,
    updateSectionField,
    updateSectionAnimation,
    updateSectionResponsive,
    updateBlockResponsive,
    updateButtonProperties,
    moveSection,
    duplicateSection,
    toggleSectionVisibility,
    deleteSection,
    insertSectionAt,
    moveSectionTo,
    createNewPage,
    duplicatePage,
    deletePage,
    updatePageSettings,
    addRowSection,
    addBlockToColumn,
    insertBlockAt,
    moveBlockTo,
    updateColumnWidths,
    duplicateBlock,
    updateBlock,
    removeBlock,
    updateColumn,
    duplicateElement,
    deleteElement,
    updateGalleryCard,
    duplicateGalleryCard,
    deleteGalleryCard,
    reorderGalleryCard,
    toggleGalleryCardVisibility,
    addGalleryCard,
    updateServiceCard,
    duplicateServiceCard,
    deleteServiceCard,
    reorderServiceCard,
    addServiceCard,
    updateSectionCard,
    duplicateSectionCard,
    deleteSectionCard,
    addSectionCard,
    updateVideoProperties,
    clipboard,
    copyElement,
    pasteElement,
    addNavItem,
    updateNavItem,
    deleteNavItem,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    mediaPickerOpen,
    setMediaPickerOpen,
    triggerMediaPicker,
    handleMediaSelected
  } = useEditor();

  const [activeLibraryTab, setActiveLibraryTab] = useState('all'); // 'all' | 'basic' | 'layout' | 'content' | 'website' | 'layers'
  const [librarySearch, setLibrarySearch] = useState('');
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState('');

  // Professional Builder Layout & Responsive States
  const [zoom, setZoom] = useState(100);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState(null); // 'library' | 'layers' | 'properties' | null
  const [editingDevice, setEditingDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [accordions, setAccordions] = useState({
    content: true,
    appearance: true,
    typography: true,
    spacing: true,
    responsive: true,
    animation: false,
    grid: true
  });
  const [boxModelLink, setBoxModelLink] = useState({ margin: false, padding: false });

  // Toggle accordion section
  const toggleAccordion = (sectionKey) => {
    setAccordions(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  // Switch device viewport & editing breakpoint simultaneously
  const handleDeviceChange = (device) => {
    setEditingDevice(device);
    setViewport(device);
  };

  // New Page Creation Wizard Modal State
  const [newPageModalOpen, setNewPageModalOpen] = useState(false);
  const [newPageForm, setNewPageForm] = useState({
    name: '',
    slug: '',
    layout: 'hero_content',
    addToNav: true,
    navLabel: '',
    isPublished: true,
    seoTitle: '',
    seoDescription: ''
  });

  // Pages List Manager Modal State
  const [pagesListModalOpen, setPagesListModalOpen] = useState(false);

  // Page Settings / SEO Modal State
  const [pageSettingsModalOpen, setPageSettingsModalOpen] = useState(false);
  const [pageSettingsForm, setPageSettingsForm] = useState({
    title: '',
    slug: '',
    seo_title: '',
    seo_description: '',
    hero_bg_image: '',
    enabled: true
  });

  // Navigation Items Manager Modal State
  const [navModalOpen, setNavModalOpen] = useState(false);
  const [newNavItemForm, setNewNavItemForm] = useState({
    name_en: '',
    name_de: '',
    path: '',
    parent_id: ''
  });

  // Activate Editor Mode on mount, load draft config, deactivate on unmount
  useEffect(() => {
    setEditorMode(true);
    loadSiteConfig(true);
    return () => setEditorMode(false);
  }, [setEditorMode, loadSiteConfig]);

  // Sync activePage from URL query param (?page=...) on mount & back/forward navigation
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam && pageParam !== activePage) {
      setActivePage(pageParam);
      setSelectedElement(null);
      setSelectedSectionId(null);
    }
  }, [searchParams]);

  // Page switching helper that updates state, clears stale selections, and synchronizes URL query param
  const handlePageChange = (newPageId) => {
    setActivePage(newPageId);
    setSelectedElement(null);
    setSelectedSectionId(null);
    setSearchParams({ page: newPageId }, { replace: true });
  };

  // Global Visual Builder Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable;

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey && !isInput) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl+Shift+Z / Ctrl+Y / Cmd+Shift+Z
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && e.shiftKey) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y')) {
        if (!isInput) {
          e.preventDefault();
          handleRedo();
          return;
        }
      }

      // Copy: Ctrl+C / Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && !isInput) {
        if (selectedElement) {
          e.preventDefault();
          copyElement(selectedElement);
        } else if (selectedSectionId) {
          const currentSecs = cmsConfig?.sections?.[activePage] || [];
          const sec = currentSecs.find(s => s.id === selectedSectionId);
          if (sec) {
            e.preventDefault();
            copyElement({ type: 'section', sectionId: sec.id, section: sec });
          }
        }
        return;
      }

      // Paste: Ctrl+V / Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v' && !isInput) {
        if (clipboard) {
          e.preventDefault();
          pasteElement(selectedSectionId, selectedElement?.colId);
        }
        return;
      }

      // Duplicate: Ctrl+D / Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && !isInput) {
        if (selectedElement?.colId && selectedElement?.blockId) {
          e.preventDefault();
          duplicateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId);
        } else if (selectedSectionId) {
          e.preventDefault();
          duplicateSection(selectedSectionId);
        }
        return;
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
        if (selectedElement?.colId && selectedElement?.blockId) {
          e.preventDefault();
          removeBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId);
        } else if (selectedSectionId) {
          e.preventDefault();
          deleteSection(selectedSectionId);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, selectedSectionId, clipboard, cmsConfig, activePage, handleUndo, handleRedo, copyElement, pasteElement, duplicateBlock, duplicateSection, removeBlock, deleteSection]);

  // Load Media Library catalog
  const loadMedia = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/media.php`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setMediaList(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to load media list:', e);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [token]);

  // Removed stale auto-selection of section 0 to prevent corrupting header/navbar/footer element selections

  // Load current page settings into modal state when modal opens
  useEffect(() => {
    if (cmsConfig?.pages?.[activePage]) {
      const p = cmsConfig.pages[activePage];
      setPageSettingsForm({
        title: p.title || activePage,
        slug: p.slug || activePage,
        seo_title: p.seo_title || '',
        seo_description: p.seo_description || '',
        hero_bg_image: p.hero_bg_image || '',
        enabled: p.enabled !== false
      });
    }
  }, [activePage, cmsConfig, pageSettingsModalOpen]);

  // Publish changes to live version
  const handlePublish = async () => {
    const authToken = token || localStorage.getItem('sm_admin_token') || localStorage.getItem('sports_admin_token');
    if (!authToken) return;
    setSaveStatus('saving');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/config.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ action: 'publish' })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSaveStatus('saved');
          setPublishModalOpen(false);
          setPublishSuccessMsg(`Published successfully! New Live Version: v${json.data.version || 2}`);
          setTimeout(() => setPublishSuccessMsg(null), 4000);
          loadSiteConfig(false);
        }
      }
    } catch (e) {
      console.error('Error publishing site:', e);
      setSaveStatus('error');
    }
  };

  // Image Upload handler for Media Library
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setMediaUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', file.name);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/upload.php`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.url) {
          handleMediaSelected(json.url);
          loadMedia();
        }
      }
    } catch (e) {
      console.error('Image upload failed:', e);
    } finally {
      setMediaUploading(false);
    }
  };

  // Auto-generate slug when typing page name in creation wizard
  const handleNewPageNameChange = (name) => {
    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    setNewPageForm(prev => ({
      ...prev,
      name,
      slug: prev.slug === '' || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
      navLabel: prev.navLabel === '' || prev.navLabel === prev.name ? name : prev.navLabel
    }));
  };

  // Submit New Page Creation
  const handleCreatePageSubmit = (e) => {
    e.preventDefault();
    if (!newPageForm.name || !newPageForm.slug) {
      alert('Please enter a valid page name and URL slug.');
      return;
    }

    const createdId = createNewPage(newPageForm);
    if (createdId) {
      setNewPageModalOpen(false);
      setNewPageForm({
        name: '',
        slug: '',
        layout: 'hero_content',
        addToNav: true,
        navLabel: '',
        isPublished: true,
        seoTitle: '',
        seoDescription: ''
      });
      setPublishSuccessMsg(`Page "${newPageForm.name}" created and loaded into visual editor!`);
      setTimeout(() => setPublishSuccessMsg(null), 4000);
    }
  };

  // Submit Page Settings
  const handleSavePageSettings = (e) => {
    e.preventDefault();
    updatePageSettings(activePage, pageSettingsForm);
    setPageSettingsModalOpen(false);
    setPublishSuccessMsg('Page settings saved.');
    setTimeout(() => setPublishSuccessMsg(null), 3000);
  };

  // Submit New Navigation Item
  const handleAddNavItemSubmit = (e) => {
    e.preventDefault();
    if (!newNavItemForm.name_en || !newNavItemForm.path) {
      alert('Please provide navigation label and link path.');
      return;
    }

    addNavItem({
      name_en: newNavItemForm.name_en,
      name_de: newNavItemForm.name_de || newNavItemForm.name_en,
      path: newNavItemForm.path.startsWith('/') ? newNavItemForm.path : `/${newNavItemForm.path}`,
      parent_id: newNavItemForm.parent_id || null
    });

    setNewNavItemForm({ name_en: '', name_de: '', path: '', parent_id: '' });
  };

  const currentSections = cmsConfig?.sections?.[activePage] || [];
  const selectedSection = selectedSectionId ? currentSections.find(s => s.id === selectedSectionId) : null;
  const allPagesList = Object.entries(cmsConfig?.pages || {}).map(([key, val]) => ({
    id: key,
    label: val.title || key,
    slug: val.slug || key,
    enabled: val.enabled !== false
  }));

  const navItemsList = cmsConfig?.header?.nav_items || [];

  const ALL_LIBRARY_ITEMS = [
    // 1. BASIC
    { category: 'basic', kind: 'block', type: 'heading', name: 'Heading', desc: 'H1-H6 title or section headline', icon: Type, defaultProps: { level: 'h2', text_en: 'New Heading', text_de: 'Neue Überschrift', size: '2rem', align: 'left', color: '#1f242d' } },
    { category: 'basic', kind: 'block', type: 'text', name: 'Text / Paragraph', desc: 'Body paragraph with inline editing', icon: FileText, defaultProps: { text_en: 'Detailing exceptional standards and proven expertise in sports event logistics and travel.', text_de: 'Detaillierte Informationen.', size: '1rem', color: '#555555', align: 'left' } },
    { category: 'basic', kind: 'block', type: 'image', name: 'Image Block', desc: 'Photo asset with media picker and sizing', icon: ImageIcon, defaultProps: { src: '/assets/images/home_hero_bg.jpg', alt: 'Showcase Photo', border_radius: '12px', height: '320px', object_fit: 'cover', align: 'center' } },
    { category: 'basic', kind: 'block', type: 'button', name: 'Button', desc: 'Call to action button with custom link and style', icon: Zap, defaultProps: { text_en: 'Get In Touch', text_de: 'Kontaktieren Sie uns', link: '/en/Contact/', link_type: 'internal', bg_color: '#ff0000', text_color: '#ffffff', border_radius: '50px', padding: '12px 28px', align: 'left' } },
    { category: 'basic', kind: 'block', type: 'icon', name: 'Icon', desc: 'Lucide icon with background and colors', icon: Star, defaultProps: { icon: 'Star', size: 36, color: '#ff0000', bg_color: 'rgba(255,0,0,0.1)', border_radius: '50px', align: 'left' } },
    { category: 'basic', kind: 'block', type: 'divider', name: 'Divider', desc: 'Horizontal separation line rule', icon: Sliders, defaultProps: { thickness: 1, color: '#e2e8f0', style: 'solid', margin: 24 } },
    { category: 'basic', kind: 'block', type: 'spacer', name: 'Spacer', desc: 'Vertical height spacer to adjust whitespace', icon: Columns, defaultProps: { height: 30 } },

    // 2. LAYOUT
    { category: 'layout', kind: 'row', type: 'row', layout: '100', name: 'Section', desc: 'New section container with empty drop zone', icon: Layout, cols: 1 },
    { category: 'layout', kind: 'row', type: 'row', layout: '100', name: 'Container', desc: 'Centered boxed width container', icon: Square, cols: 1 },
    { category: 'layout', kind: 'row', type: 'row', layout: '50-50', name: 'Row (2 Columns)', desc: 'Balanced 50% / 50% columns', icon: Columns, cols: 2 },
    { category: 'layout', kind: 'row', type: 'row', layout: '33-33-33', name: 'Row (3 Columns)', desc: '3 equal width 33.3% columns', icon: Columns, cols: 3 },
    { category: 'layout', kind: 'row', type: 'row', layout: '25-25-25-25', name: 'Grid (4 Columns)', desc: '4 equal width 25% columns', icon: Columns, cols: 4 },
    { category: 'layout', kind: 'row', type: 'row', layout: '66-33', name: 'Row (66% / 33%)', desc: 'Main content + right sidebar', icon: Layout, cols: 2 },
    { category: 'layout', kind: 'row', type: 'row', layout: '33-66', name: 'Row (33% / 66%)', desc: 'Left sidebar + main content', icon: Layout, cols: 2 },

    // 3. CONTENT
    { category: 'content', kind: 'block', type: 'card', name: 'Card', desc: 'Card with title, description, and button', icon: Square, defaultProps: { title_en: 'Team Trips & Camps', desc_en: 'Tailored nutrition, fitness amenities, and match proximity.', bg: '#faf5fa', border_color: '#ede4ed', border_radius: '12px', padding: '24px', button_text: 'Learn More', button_link: '/en/Contact/' } },
    { category: 'content', kind: 'block', type: 'feature', name: 'Feature', desc: 'Icon with title & description box', icon: ShieldCheck, defaultProps: { icon: 'ShieldCheck', title_en: 'High-Performance Standards', desc_en: 'Vetted hotels, short venue distances, and customized athlete meals.' } },
    { category: 'content', kind: 'block', type: 'quote', name: 'Quote', desc: 'Testimonial quote card with rating and author', icon: MessageSquareQuote, defaultProps: { quote_en: 'Outstanding organization, great team hotels, and 24/7 personal support on-site.', author: 'National Team Coach', role: 'European Athletics', rating: 5, bg: '#f8fafc' } },
    { category: 'content', kind: 'block', type: 'badge', name: 'Badge', desc: 'Highlighted pill badge tag', icon: Award, defaultProps: { text_en: '✦ Premium Partner', text_de: '✦ Premium Partner', bg_color: 'rgba(255, 0, 0, 0.12)', text_color: '#ff0000', border_radius: '50px', align: 'left' } },
    { category: 'content', kind: 'block', type: 'list', name: 'List', desc: 'Key bullet points checklist', icon: CheckCircle2, defaultProps: { items_en: ['Direct venue proximity', 'Tailored athletic meals', 'Dedicated 24/7 coordinator'], icon: 'CheckCircle2', color: '#10b981' } },
    { category: 'content', kind: 'block', type: 'video', name: 'Video', desc: 'YouTube or Vimeo video player', icon: Play, defaultProps: { video_url: 'https://www.youtube.com/embed/dD_FThvzO9I?start=76&controls=1' } },

    // 4. WEBSITE SECTIONS
    { category: 'website', kind: 'section', type: 'hero', name: 'Hero', desc: 'Main full-width hero header banner', icon: Layout },
    { category: 'website', kind: 'section', type: 'about', name: 'About', desc: 'Founder story & referee background', icon: Users },
    { category: 'website', kind: 'section', type: 'services', name: 'Services', desc: 'Full MICE & sports services grid', icon: Compass },
    { category: 'website', kind: 'section', type: 'cards', name: '4 Pillars Cards', desc: 'Core service cards with numbered badges', icon: Sparkles },
    { category: 'website', kind: 'section', type: 'stats', name: 'Statistics', desc: '4 animated numeric counters (15+, 500+, 35+, 100%)', icon: Trophy },
    { category: 'website', kind: 'section', type: 'team', name: 'Team', desc: 'Specialists & founder showcase', icon: Users },
    { category: 'website', kind: 'section', type: 'testimonials', name: 'Testimonials', desc: 'Client testimonials with star ratings', icon: MessageSquareQuote },
    { category: 'website', kind: 'section', type: 'faq', name: 'FAQ', desc: 'Interactive expandable question list', icon: HelpCircle },
    { category: 'website', kind: 'section', type: 'gallery', name: 'Gallery', desc: 'Hotel inspection showcase cards', icon: ImageIcon },
    { category: 'website', kind: 'section', type: 'cta', name: 'CTA', desc: 'Full banner with action button and background', icon: Zap },
    { category: 'website', kind: 'section', type: 'contact', name: 'Contact', desc: 'Interactive team inquiry form', icon: FileText }
  ];

  // Render Visual Preview Mockup inside component card
  const renderComponentMockup = (item) => {
    const t = item.type;
    if (t === 'button') {
      return (
        <div className="mini-btn-mockup">
          <span>Book Now</span>
          <ArrowRight size={10} />
        </div>
      );
    }
    if (t === 'card') {
      return (
        <div className="mini-card-mockup">
          <div className="mini-card-line"></div>
          <div className="mini-card-subline"></div>
          <div style={{ height: '5px', width: '32px', background: '#ff0000', borderRadius: '3px' }}></div>
        </div>
      );
    }
    if (t === 'heading') {
      return <div className="mini-heading-mockup">Headline H1</div>;
    }
    if (t === 'text') {
      return (
        <div className="mini-text-mockup">
          <div className="mini-text-line" style={{ width: '100%' }}></div>
          <div className="mini-text-line" style={{ width: '85%' }}></div>
          <div className="mini-text-line" style={{ width: '60%' }}></div>
        </div>
      );
    }
    if (t === 'image' || t === 'gallery') {
      return (
        <div className="mini-image-mockup">
          <ImageIcon size={18} />
        </div>
      );
    }
    if (t === 'icon') {
      return (
        <div className="mini-icon-mockup">
          <Star size={18} />
        </div>
      );
    }
    if (t === 'badge') {
      return <div className="mini-badge-mockup">✦ Partner Badge</div>;
    }
    if (t === 'divider') {
      return <div style={{ width: '130px', borderTop: '2px dashed #64748b' }}></div>;
    }
    if (t === 'spacer') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700 }}>
          <MoveUp size={12} />
          <span>30px Space</span>
          <MoveDown size={12} />
        </div>
      );
    }
    if (t === 'feature') {
      return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="mini-icon-mockup" style={{ width: '28px', height: '28px' }}>
            <ShieldCheck size={14} />
          </div>
          <div className="mini-text-mockup" style={{ width: '90px' }}>
            <div className="mini-card-line"></div>
            <div className="mini-card-subline"></div>
          </div>
        </div>
      );
    }
    if (t === 'quote') {
      return (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <MessageSquareQuote size={18} color="#38bdf8" />
          <div className="mini-text-mockup" style={{ width: '100px' }}>
            <div className="mini-card-line"></div>
            <div className="mini-card-subline"></div>
          </div>
        </div>
      );
    }
    if (t === 'video') {
      return (
        <div style={{ width: '80px', height: '42px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Play size={16} color="#ff0000" fill="#ff0000" />
        </div>
      );
    }
    if (item.kind === 'row') {
      const colsCount = item.cols || 2;
      return (
        <div className="mini-wireframe-cols">
          {Array.from({ length: colsCount }).map((_, i) => (
            <div key={i} className="mini-wireframe-col" style={{ flex: 1 }}>
              Col {i + 1}
            </div>
          ))}
        </div>
      );
    }
    if (t === 'hero') {
      return (
        <div className="mini-hero-mockup">
          <div className="mini-hero-title"></div>
          <div className="mini-hero-btn"></div>
        </div>
      );
    }
    if (t === 'stats') {
      return (
        <div style={{ display: 'flex', gap: '4px', fontSize: '0.62rem', fontWeight: 700, color: '#38bdf8' }}>
          <span style={{ padding: '2px 4px', background: '#1e293b', borderRadius: '3px' }}>15+</span>
          <span style={{ padding: '2px 4px', background: '#1e293b', borderRadius: '3px' }}>500+</span>
          <span style={{ padding: '2px 4px', background: '#1e293b', borderRadius: '3px' }}>100%</span>
        </div>
      );
    }
    if (t === 'faq') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '120px' }}>
          <div style={{ height: '8px', background: '#1e293b', borderRadius: '2px', borderLeft: '2px solid #38bdf8' }}></div>
          <div style={{ height: '8px', background: '#1e293b', borderRadius: '2px', borderLeft: '2px solid #38bdf8' }}></div>
        </div>
      );
    }
    if (t === 'contact') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '110px' }}>
          <div style={{ height: '7px', background: '#1e293b', borderRadius: '2px' }}></div>
          <div style={{ height: '7px', background: '#1e293b', borderRadius: '2px' }}></div>
          <div style={{ height: '8px', width: '35px', background: '#ff0000', borderRadius: '2px' }}></div>
        </div>
      );
    }
    if (t === 'cta') {
      return (
        <div style={{ width: '130px', height: '36px', background: 'linear-gradient(135deg, #7f1d1d, #991b1b)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.62rem', color: '#fff', fontWeight: 700 }}>CTA Banner</span>
        </div>
      );
    }

    const FallbackIcon = item.icon || Layout;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
        <FallbackIcon size={20} />
      </div>
    );
  };

  // Add Item to Page handler
  const handleAddLibraryItem = (item) => {
    if (item.kind === 'block') {
      // 1. If a column is actively selected, add into that column
      if (selectedElement?.sectionId && selectedElement?.colId) {
        addBlockToColumn(selectedElement.sectionId, selectedElement.colId, item.type, item.defaultProps || {});
      } else if (selectedSectionId) {
        // If a section is selected, check if it has columns
        const sec = currentSections.find(s => s.id === selectedSectionId);
        if (sec && sec.columns && sec.columns.length > 0) {
          addBlockToColumn(sec.id, sec.columns[0].id, item.type, item.defaultProps || {});
        } else {
          // If selected section is not a multi-column row (e.g. hero, about), create a clean 1-column container row and add ONLY this single block
          const targetIdx = currentSections.findIndex(s => s.id === selectedSectionId) + 1;
          const newRowId = `${activePage}_row_${Date.now().toString().slice(-4)}`;
          const newColId = `col_${Date.now().toString().slice(-4)}`;
          const bId = `b_${Date.now().toString().slice(-4)}`;
          const newBlock = { id: bId, type: item.type, ...(item.defaultProps || {}) };
          const newSection = {
            id: newRowId,
            type: 'row',
            name: 'Container',
            layout: '100',
            order: targetIdx + 1,
            enabled: true,
            columns: [
              {
                id: newColId,
                width: '100%',
                blocks: [newBlock]
              }
            ]
          };
          const pageSections = [...(cmsConfig?.sections?.[activePage] || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
          pageSections.splice(targetIdx, 0, newSection);
          const reordered = pageSections.map((s, i) => ({ ...s, order: i + 1 }));
          const newConfig = { ...cmsConfig, sections: { ...cmsConfig.sections, [activePage]: reordered } };
          setSelectedSectionId(newRowId);
          setSelectedElement({ sectionId: newRowId, colId: newColId, blockId: bId, block: newBlock, type: newBlock.type });
          pushState(newConfig, true);
        }
      } else {
        // Look for existing row section on page
        const rowSec = currentSections.find(s => s.type === 'row' || (s.columns && s.columns.length > 0));
        if (rowSec && rowSec.columns?.[0]) {
          addBlockToColumn(rowSec.id, rowSec.columns[0].id, item.type, item.defaultProps || {});
        } else {
          // Create a clean new 100% row section containing ONLY this single block
          const newRowId = `${activePage}_row_${Date.now().toString().slice(-4)}`;
          const newColId = `col_${Date.now().toString().slice(-4)}`;
          const bId = `b_${Date.now().toString().slice(-4)}`;
          const newBlock = { id: bId, type: item.type, ...(item.defaultProps || {}) };
          const newSection = {
            id: newRowId,
            type: 'row',
            name: 'Container',
            layout: '100',
            order: currentSections.length + 1,
            enabled: true,
            columns: [
              {
                id: newColId,
                width: '100%',
                blocks: [newBlock]
              }
            ]
          };
          const pageSections = [...(cmsConfig?.sections?.[activePage] || [])];
          pageSections.push(newSection);
          const newConfig = { ...cmsConfig, sections: { ...cmsConfig.sections, [activePage]: pageSections } };
          setSelectedSectionId(newRowId);
          setSelectedElement({ sectionId: newRowId, colId: newColId, blockId: bId, block: newBlock, type: newBlock.type });
          pushState(newConfig, true);
        }
      }
    } else if (item.kind === 'row') {
      const targetIdx = selectedSectionId ? currentSections.findIndex(s => s.id === selectedSectionId) + 1 : currentSections.length;
      addRowSection(item.layout, targetIdx);
    } else if (item.kind === 'section') {
      const targetIdx = selectedSectionId ? currentSections.findIndex(s => s.id === selectedSectionId) + 1 : currentSections.length;
      insertSectionAt(DEFAULT_NEW_SECTIONS[item.type] || { type: item.type, name: item.name, enabled: true }, targetIdx);
    }
  };

  // Filtered items for display
  const filteredLibraryItems = ALL_LIBRARY_ITEMS.filter(item => {
    const matchesSearch = !librarySearch || item.name.toLowerCase().includes(librarySearch.toLowerCase()) || item.desc.toLowerCase().includes(librarySearch.toLowerCase());
    const matchesCategory = activeLibraryTab === 'all' || item.category === activeLibraryTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-website-builder-studio">
      {/* 1. TOP HEADER STUDIO BAR */}
      <header className="builder-top-bar">
        {/* Left: Brand & Page Switcher */}
        <div className="builder-top-left">
          <NavLink to="/admin/dashboard" className="builder-back-link" title="Exit to Admin Dashboard">
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </NavLink>

          <div className="builder-page-select-wrapper">
            <span className="builder-bar-label">Page:</span>
            <select 
              value={activePage} 
              onChange={(e) => handlePageChange(e.target.value)}
              className="builder-page-select"
            >
              {allPagesList.map(p => (
                <option key={p.id} value={p.id}>
                  {p.label} (/{p.slug}) {p.enabled ? '' : '[Hidden]'}
                </option>
              ))}
            </select>
          </div>

          {/* Manage All Pages Modal Button */}
          <button 
            type="button" 
            onClick={() => setPagesListModalOpen(true)}
            className="builder-tool-btn"
            title="Manage all website pages & custom routes"
          >
            <FileText size={15} />
            <span>Pages</span>
          </button>

          {/* New Page Wizard Quick Button */}
          <button 
            type="button" 
            onClick={() => setNewPageModalOpen(true)}
            className="builder-tool-btn btn-new-page-trigger"
            title="Create completely new page visually"
          >
            <Plus size={15} />
            <span>+ New Page</span>
          </button>

          {/* Page Settings & SEO Button */}
          <button
            type="button"
            onClick={() => setPageSettingsModalOpen(true)}
            className="builder-tool-btn"
            title="Configure Page SEO, slug, and metadata"
          >
            <Settings size={15} />
            <span>Page SEO</span>
          </button>

          {/* Navigation Manager Button */}
          <button
            type="button"
            onClick={() => setNavModalOpen(true)}
            className="builder-tool-btn"
            title="Manage header navigation items and submenus"
          >
            <Navigation size={15} />
            <span>Navbar</span>
          </button>
        </div>

        {/* Center: Device Switcher, Zoom Controls & Mode Toggle */}
        <div className="builder-top-center">
          {/* Responsive Viewport Switcher */}
          <div className="builder-viewport-pills">
            <button 
              type="button"
              className={`builder-viewport-pill ${viewport === 'desktop' ? 'active' : ''}`}
              onClick={() => handleDeviceChange('desktop')}
              title="Desktop Viewport (100%)"
            >
              <Monitor size={14} />
              <span>Desktop</span>
            </button>
            <button 
              type="button"
              className={`builder-viewport-pill ${viewport === 'tablet' ? 'active' : ''}`}
              onClick={() => handleDeviceChange('tablet')}
              title="Tablet Viewport (768px)"
            >
              <Tablet size={14} />
              <span>Tablet</span>
            </button>
            <button 
              type="button"
              className={`builder-viewport-pill ${viewport === 'mobile' ? 'active' : ''}`}
              onClick={() => handleDeviceChange('mobile')}
              title="Mobile Viewport (390px)"
            >
              <Smartphone size={14} />
              <span>Mobile</span>
            </button>
          </div>

          {/* Canvas Zoom Controls */}
          <div className="builder-zoom-controls">
            <button 
              type="button" 
              className="zoom-btn" 
              onClick={() => setZoom(prev => Math.max(50, prev - 25))}
              title="Zoom out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="zoom-value-label">{zoom}%</span>
            <button 
              type="button" 
              className="zoom-btn" 
              onClick={() => setZoom(prev => Math.min(150, prev + 25))}
              title="Zoom in"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              className="zoom-btn"
              onClick={() => setZoom(100)}
              title="Reset Zoom to 100%"
              style={{ fontSize: '0.68rem', fontWeight: 700 }}
            >
              1:1
            </button>
          </div>

          {/* Mode Switcher: Edit Mode vs Live Preview Mode */}
          <div className="builder-viewport-pills" style={{ background: '#0b1320' }}>
            <button
              type="button"
              className={`builder-viewport-pill ${!isPreviewMode ? 'active' : ''}`}
              onClick={() => setIsPreviewMode(false)}
              style={{
                background: !isPreviewMode ? '#38bdf8' : 'transparent',
                color: !isPreviewMode ? '#0f172a' : '#8b949e',
                fontWeight: 700
              }}
              title="Edit Mode: Click any element to select and customize properties"
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className={`builder-viewport-pill ${isPreviewMode ? 'active' : ''}`}
              onClick={() => {
                setIsPreviewMode(true);
                setSelectedElement(null);
              }}
              style={{
                background: isPreviewMode ? '#10b981' : 'transparent',
                color: isPreviewMode ? '#ffffff' : '#8b949e',
                fontWeight: 700
              }}
              title="Live Preview Mode: Interactive public links and forms"
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Right: History Undo/Redo & Save/Publish */}
        <div className="builder-top-right">
          <div className="builder-history-group">
            <button 
              className="builder-icon-btn" 
              onClick={handleUndo} 
              disabled={!canUndo}
              title="Undo last change (Ctrl+Z)"
            >
              <Undo2 size={15} />
            </button>
            <button 
              className="builder-icon-btn" 
              onClick={handleRedo} 
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={15} />
            </button>
          </div>

          {/* Requirement 19: Draft Mode Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
            <span>Editing Draft</span>
          </div>

          {/* Requirement 11: Save Status Badge */}
          <div className={`builder-save-badge badge-${saveStatus}`}>
            {saveStatus === 'saved' && (
              <>
                <Check size={14} />
                <span>✓ Draft Saved</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <Loader2 size={14} className="builder-spinning" />
                <span>Saving Draft...</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle size={14} />
                <span>Save Error</span>
              </>
            )}
          </div>

          {/* Explicit Save Draft Button */}
          <button 
            type="button"
            className="builder-btn-secondary"
            onClick={saveDraft}
            title="Save current draft changes"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={14} />
            <span>Save Draft</span>
          </button>

          {/* Preview Draft Button */}
          <button 
            type="button"
            className="builder-btn-secondary"
            onClick={() => {
              const slug = activePage === 'home' ? '' : (cmsConfig?.pages?.[activePage]?.slug || activePage);
              window.open(`/${slug}?preview=true`, '_blank');
            }}
            title="Open complete draft preview in new tab"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Eye size={14} />
            <span>Preview Draft</span>
          </button>

          {/* Publish Changes Button */}
          <button 
            type="button"
            className="builder-btn-primary"
            onClick={() => setPublishModalOpen(true)}
            title="Publish all changes to public live website"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Send size={14} />
            <span>Publish Changes</span>
          </button>
        </div>
      </header>

      {/* Mode Status Info Strip */}
      <div 
        style={{
          background: isPreviewMode ? '#064e3b' : '#0f2942',
          borderBottom: isPreviewMode ? '1px solid #059669' : '1px solid #1e3a8a',
          color: isPreviewMode ? '#a7f3d0' : '#bae6fd',
          padding: '6px 20px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 600,
          zIndex: 25
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isPreviewMode ? <Eye size={15} color="#34d399" /> : <Edit2 size={15} color="#38bdf8" />}
          <span>
            {isPreviewMode 
              ? '👁 LIVE PREVIEW MODE ACTIVE — Buttons and links navigate normally. Form submissions work with draft database.' 
              : '🔧 EDIT MODE ACTIVE — Click any button, heading, text, image, or navbar item to customize properties. Public links are paused.'}
          </span>
        </div>
        {!isPreviewMode && selectedElement && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
            <span style={{ color: '#94a3b8' }}>Selected:</span>
            <span style={{ background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
              {selectedElement.type || 'Element'} {selectedElement.fieldPrefix || selectedElement.blockId || selectedElement.navId || ''}
            </span>
            <button 
              onClick={() => setSelectedElement(null)} 
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="Clear selection"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Success Banner Alert */}
      <AnimatePresence>
        {publishSuccessMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'absolute',
              top: 86,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#10b981',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: '30px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{publishSuccessMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. THREE-COLUMN STUDIO WORKSPACE */}
      <div className={`builder-workspace ${leftSidebarCollapsed ? 'left-collapsed' : ''} ${rightSidebarCollapsed ? 'right-collapsed' : ''}`}>
        {/* ================= LEFT PANEL: COMPONENT LIBRARY & STRUCTURE ================= */}
        <aside className="builder-sidebar-left">
          {leftSidebarCollapsed ? (
            <div className="sidebar-rail-collapsed">
              <button 
                type="button" 
                className="rail-action-btn"
                onClick={() => setLeftSidebarCollapsed(false)}
                title="Expand Add to Page Library"
              >
                <ChevronRight size={16} />
              </button>
              <button 
                type="button" 
                className="rail-action-btn"
                onClick={() => { setLeftSidebarCollapsed(false); setActiveLibraryTab('all'); }}
                title="Components"
              >
                <Plus size={16} />
              </button>
              <button 
                type="button" 
                className="rail-action-btn"
                onClick={() => { setLeftSidebarCollapsed(false); setActiveLibraryTab('layers'); }}
                title="Layers Structure"
              >
                <Layers size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="sidebar-header-row">
                <div className="sidebar-title">
                  <Plus size={16} color="#38bdf8" />
                  <span>Add to Page</span>
                </div>
                <button 
                  type="button" 
                  className="sidebar-toggle-btn"
                  onClick={() => setLeftSidebarCollapsed(true)}
                  title="Collapse Sidebar"
                >
                  <ChevronLeft size={15} />
                </button>
              </div>

              {activeLibraryTab !== 'layers' && (
                <div className="library-search-box">
                  <input 
                    type="text" 
                    placeholder="Search components (button, card, text...)" 
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    className="library-search-input"
                  />
                </div>
              )}

              {/* Category Chips Bar */}
              <div className="library-category-chips">
                <button 
                  type="button" 
                  className={`library-category-chip ${activeLibraryTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveLibraryTab('all')}
                >
                  All
                </button>
                <button 
                  type="button" 
                  className={`library-category-chip ${activeLibraryTab === 'basic' ? 'active' : ''}`}
                  onClick={() => setActiveLibraryTab('basic')}
                >
                  Basic
                </button>
                <button 
                  type="button" 
                  className={`library-category-chip ${activeLibraryTab === 'layout' ? 'active' : ''}`}
                  onClick={() => setActiveLibraryTab('layout')}
                >
                  Layout
                </button>
                <button 
                  type="button" 
                  className={`library-category-chip ${activeLibraryTab === 'content' ? 'active' : ''}`}
                  onClick={() => setActiveLibraryTab('content')}
                >
                  Content
                </button>
                <button 
                  type="button" 
                  className={`library-category-chip ${activeLibraryTab === 'website' ? 'active' : ''}`}
                  onClick={() => setActiveLibraryTab('website')}
                >
                  Website
                </button>
                <button 
                  type="button" 
                  className={`library-category-chip ${activeLibraryTab === 'layers' ? 'active' : ''}`}
                  onClick={() => setActiveLibraryTab('layers')}
                >
                  Layers
                </button>
              </div>

              <div className="library-list-container">
                {/* Visual Component Cards Grid */}
                {activeLibraryTab !== 'layers' ? (
                  <div className="library-grid-cards">
                    <div style={{ fontSize: '0.74rem', color: '#64748b', padding: '0 4px 4px 4px' }}>
                      {selectedElement?.colId 
                        ? `Adding will insert into selected Column:` 
                        : `Drag any card to canvas or click [+ Add]:`}
                    </div>
                    {filteredLibraryItems.length === 0 ? (
                      <div className="library-empty-search-state" style={{ padding: '36px 16px', textAlign: 'center', color: '#94a3b8' }}>
                        <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>No components found</p>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Try another category or search term.</span>
                      </div>
                    ) : (
                      filteredLibraryItems.map((item) => (
                        <div 
                          key={`${item.category}_${item.type}_${item.layout || ''}`}
                          className="visual-component-card"
                          draggable={true}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/json', JSON.stringify({
                              kind: item.kind,
                              type: item.type,
                              layout: item.layout,
                              name: item.name,
                              defaultProps: item.defaultProps || {}
                            }));
                          }}
                          onClick={() => handleAddLibraryItem(item)}
                          title={`Drag onto page canvas, or click to add`}
                        >
                          {/* Visual Mockup Header */}
                          <div className="card-mockup-frame">
                            {renderComponentMockup(item)}
                          </div>

                          {/* Meta info & Action buttons */}
                          <div className="card-details-box">
                            <div className="card-title-group">
                              <span className="card-name-title">{item.name}</span>
                              <span className="card-desc-text">{item.desc}</span>
                            </div>
                            <div className="card-actions-group" onClick={(e) => e.stopPropagation()}>
                              <div className="card-drag-pill" title="Drag onto canvas">
                                <GripVertical size={13} />
                                <span>Drag</span>
                              </div>
                              <button 
                                type="button" 
                                className="card-add-btn" 
                                onClick={() => handleAddLibraryItem(item)}
                                title="Click to add component"
                              >
                                <Plus size={13} />
                                <span>Add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  /* LAYERS & STRUCTURE TREE */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 8px', background: '#0f172a', borderRadius: '6px', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                      <Layers size={14} color="#38bdf8" />
                      <span>PAGE: {activePage.toUpperCase()}</span>
                    </div>

                    {/* 0. HEADER COMPONENT TREE NODE */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: (selectedElement?.type?.startsWith('header') || selectedElement?.type === 'navbar_item') ? '2px solid #38bdf8' : '2px solid #334155', paddingLeft: '8px' }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: selectedElement?.type === 'header_brand' ? '#1e293b' : '#0f172a', borderRadius: '6px', cursor: 'pointer' }}
                        onClick={() => { setSelectedSectionId(null); setSelectedElement({ type: 'header_brand' }); }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Layout size={13} color="#38bdf8" />
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>Header & Navbar</span>
                        </div>
                      </div>
                      <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                        {(cmsConfig?.header?.nav_items || []).map((nav) => {
                          const isNavSelected = selectedElement?.type === 'navbar_item' && selectedElement?.navId === nav.id;
                          return (
                            <div
                              key={nav.id}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 6px', background: isNavSelected ? '#334155' : 'rgba(255,255,255,0.03)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.76rem', color: isNavSelected ? '#38bdf8' : '#cbd5e1' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSectionId(null);
                                setSelectedElement({ type: 'navbar_item', navId: nav.id, item: nav });
                              }}
                            >
                              <span>🔗 {nav.name_en || nav.name}</span>
                              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{nav.path}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {currentSections.map((sec, sIdx) => {
                      const isSecSelected = selectedSectionId === sec.id;
                      const isRowType = sec.type === 'row' || sec.columns;
                      const isGalleryType = sec.id === 'hotels_tours' || sec.id === 'about_travel' || sec.type === 'gallery' || sec.type === 'tours';
                      const isCardsType = sec.id === 'home_cards' || sec.type === 'cards' || Boolean(sec.cards);
                      const isServicesType = sec.id === 'service_cards' || sec.type === 'services';
                      const isHeroType = sec.id === 'home_hero' || sec.type === 'hero' || sec.type === 'hero_banner';
                      const isVideoType = sec.id === 'home_video' || sec.id === 'service_hero_video' || sec.type === 'video' || sec.type === 'video_showcase';

                      const galleryCards = isGalleryType ? (cmsConfig?.gallery || []) : [];
                      const pillarCards = isCardsType ? (sec.cards || []) : [];
                      const serviceCards = isServicesType ? (cmsConfig?.services || []) : [];

                      return (
                        <div key={sec.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: isSecSelected ? '2px solid #38bdf8' : '2px solid #334155', paddingLeft: '8px' }}>
                          <div 
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: isSecSelected ? '#1e293b' : '#0f172a', borderRadius: '6px', cursor: 'pointer' }}
                            onClick={() => {
                              setSelectedSectionId(sec.id);
                              setSelectedElement({ type: 'section', sectionId: sec.id, section: sec });
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                              <Layout size={13} color={isSecSelected ? '#38bdf8' : '#64748b'} />
                              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isSecSelected ? '#fff' : '#cbd5e1', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {sec.name || sec.id}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button type="button" onClick={(e) => { e.stopPropagation(); moveSection(sec.id, 'up'); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}><MoveUp size={12} /></button>
                              <button type="button" onClick={(e) => { e.stopPropagation(); moveSection(sec.id, 'down'); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}><MoveDown size={12} /></button>
                            </div>
                          </div>

                          {/* 0. SERVICE OFFERINGS CARDS TREE */}
                          {isServicesType && (
                            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                              {serviceCards.map((sCard, sIdx) => {
                                const isCardNodeSelected = (selectedElement?.serviceId === sCard.id || selectedElement?.cardId === sCard.id) && selectedElement?.type === 'service_card';
                                return (
                                  <div key={sCard.id || sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <div
                                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: isCardNodeSelected ? '#334155' : 'rgba(255,255,255,0.03)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', color: isCardNodeSelected ? '#38bdf8' : '#94a3b8' }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSectionId(sec.id);
                                        setSelectedElement({ type: 'service_card', serviceId: sCard.id, cardId: sCard.id, service: sCard, sectionId: sec.id });
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflow: 'hidden' }}>
                                        <Square size={11} color={isCardNodeSelected ? '#38bdf8' : '#64748b'} />
                                        <span style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Card {sIdx + 1}: {sCard.title_en}</span>
                                      </div>
                                      <div style={{ display: 'flex', gap: '2px' }}>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); duplicateServiceCard(sCard.id); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '1px' }} title="Duplicate Service Card"><Copy size={10} /></button>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); deleteServiceCard(sCard.id); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '1px' }} title="Delete Service Card"><Trash2 size={10} /></button>
                                      </div>
                                    </div>

                                    {/* Sub-elements inside Service Card */}
                                    <div style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                      <div
                                        style={{ padding: '2px 6px', fontSize: '0.74rem', color: (selectedElement?.serviceId === sCard.id && selectedElement?.type === 'service_card_image') ? '#38bdf8' : '#64748b', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'service_card_image', serviceId: sCard.id, cardId: sCard.id, service: sCard, sectionId: sec.id, src: sCard.image, alt: sCard.title_en }); }}
                                      >
                                        🖼 Image
                                      </div>
                                      <div
                                        style={{ padding: '2px 6px', fontSize: '0.74rem', color: (selectedElement?.serviceId === sCard.id && selectedElement?.type === 'service_card_title') ? '#38bdf8' : '#64748b', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'service_card_title', serviceId: sCard.id, cardId: sCard.id, service: sCard, sectionId: sec.id, text_en: sCard.title_en, text_de: sCard.title_de }); }}
                                      >
                                        ✏ Title
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); addServiceCard(); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px dashed #38bdf855', color: '#38bdf8', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', cursor: 'pointer', marginTop: '2px' }}
                              >
                                <Plus size={11} /> <span>+ Add Service Card</span>
                              </button>
                            </div>
                          )}

                          {/* 1. GALLERY HIERARCHY TREE */}
                          {isGalleryType && (
                            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                              {galleryCards.map((gCard, gIdx) => {
                                const isCardNodeSelected = selectedElement?.cardId === gCard.id && selectedElement?.type === 'gallery_card';
                                return (
                                  <div key={gCard.id || gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <div
                                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: isCardNodeSelected ? '#334155' : 'rgba(255,255,255,0.03)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', color: isCardNodeSelected ? '#38bdf8' : '#94a3b8' }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSectionId(sec.id);
                                        setSelectedElement({ type: 'gallery_card', cardId: gCard.id, card: gCard, sectionId: sec.id });
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflow: 'hidden' }}>
                                        <Square size={11} color={isCardNodeSelected ? '#38bdf8' : '#64748b'} />
                                        <span style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Card {gIdx + 1}: {gCard.title}</span>
                                      </div>
                                      <div style={{ display: 'flex', gap: '2px' }}>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); duplicateGalleryCard(gCard.id); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '1px' }} title="Duplicate Card"><Copy size={10} /></button>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); deleteGalleryCard(gCard.id); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '1px' }} title="Delete Card"><Trash2 size={10} /></button>
                                      </div>
                                    </div>

                                    {/* Sub-elements inside Card */}
                                    <div style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                      <div
                                        style={{ padding: '2px 6px', fontSize: '0.74rem', color: (selectedElement?.cardId === gCard.id && selectedElement?.type === 'card_image') ? '#38bdf8' : '#64748b', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'card_image', cardId: gCard.id, card: gCard, sectionId: sec.id, src: gCard.image, alt: gCard.title }); }}
                                      >
                                        🖼 Image
                                      </div>
                                      <div
                                        style={{ padding: '2px 6px', fontSize: '0.74rem', color: (selectedElement?.cardId === gCard.id && selectedElement?.type === 'card_title') ? '#38bdf8' : '#64748b', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'card_title', cardId: gCard.id, card: gCard, sectionId: sec.id, text_en: gCard.title }); }}
                                      >
                                        ✏ Title
                                      </div>
                                      <div
                                        style={{ padding: '2px 6px', fontSize: '0.74rem', color: (selectedElement?.cardId === gCard.id && selectedElement?.type === 'card_location') ? '#38bdf8' : '#64748b', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'card_location', cardId: gCard.id, card: gCard, sectionId: sec.id, location: gCard.location }); }}
                                      >
                                        📍 Location
                                      </div>
                                      <div
                                        style={{ padding: '2px 6px', fontSize: '0.74rem', color: (selectedElement?.cardId === gCard.id && selectedElement?.type === 'card_desc') ? '#38bdf8' : '#64748b', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'card_desc', cardId: gCard.id, card: gCard, sectionId: sec.id, desc_en: gCard.desc_en }); }}
                                      >
                                        📄 Description
                                      </div>
                                      <div
                                        style={{ padding: '2px 6px', fontSize: '0.74rem', color: (selectedElement?.cardId === gCard.id && selectedElement?.type === 'card_button') ? '#38bdf8' : '#64748b', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'card_button', cardId: gCard.id, card: gCard, sectionId: sec.id, text_en: gCard.button_text_en || 'Explore Destination', link: gCard.button_link || gCard.external_url || '/en/Contact/' }); }}
                                      >
                                        🔘 Button
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); addGalleryCard(); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px dashed #38bdf855', color: '#38bdf8', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', cursor: 'pointer', marginTop: '2px' }}
                              >
                                <Plus size={11} /> <span>+ Add Card</span>
                              </button>
                            </div>
                          )}

                          {/* 2. 4 PILLARS CARDS TREE */}
                          {isCardsType && (
                            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                              {pillarCards.map((pCard, pIdx) => {
                                const isCardNodeSelected = selectedElement?.cardIndex === pIdx && selectedElement?.type === 'section_card';
                                return (
                                  <div key={pIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <div
                                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: isCardNodeSelected ? '#334155' : 'rgba(255,255,255,0.03)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', color: isCardNodeSelected ? '#38bdf8' : '#94a3b8' }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSectionId(sec.id);
                                        setSelectedElement({ type: 'section_card', sectionId: sec.id, cardIndex: pIdx, card: pCard });
                                      }}
                                    >
                                      <span>Card {pCard.num || `0${pIdx + 1}`}: {pCard.title_en}</span>
                                      <div style={{ display: 'flex', gap: '2px' }}>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); duplicateSectionCard(sec.id, pIdx); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '1px' }}><Copy size={10} /></button>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); deleteSectionCard(sec.id, pIdx); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '1px' }}><Trash2 size={10} /></button>
                                      </div>
                                    </div>
                                    <div style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                      <div
                                        style={{ padding: '2px 6px', fontSize: '0.74rem', color: (selectedElement?.cardIndex === pIdx && selectedElement?.type === 'pillar_num') ? '#38bdf8' : '#64748b', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'pillar_num', sectionId: sec.id, cardIndex: pIdx, num: pCard.num }); }}
                                      >
                                        🏷 Number ({pCard.num || `0${pIdx + 1}`})
                                      </div>
                                      <div
                                        style={{ padding: '2px 6px', fontSize: '0.74rem', color: (selectedElement?.cardIndex === pIdx && selectedElement?.type === 'pillar_title') ? '#38bdf8' : '#64748b', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'pillar_title', sectionId: sec.id, cardIndex: pIdx, text_en: pCard.title_en }); }}
                                      >
                                        ✏ Title
                                      </div>
                                      <div
                                        style={{ padding: '2px 6px', fontSize: '0.74rem', color: (selectedElement?.cardIndex === pIdx && selectedElement?.type === 'pillar_desc') ? '#38bdf8' : '#64748b', cursor: 'pointer' }}
                                        onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'pillar_desc', sectionId: sec.id, cardIndex: pIdx, desc_en: pCard.desc_en }); }}
                                      >
                                        📄 Description
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); addSectionCard(sec.id); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: '1px dashed #38bdf855', color: '#38bdf8', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', cursor: 'pointer', marginTop: '2px' }}
                              >
                                <Plus size={11} /> <span>+ Add Pillar Card</span>
                              </button>
                            </div>
                          )}

                          {/* 3. HERO SECTION SUB-ELEMENTS */}
                          {isHeroType && (
                            <div style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                              <div
                                style={{ padding: '3px 6px', fontSize: '0.75rem', color: selectedElement?.fieldPrefix === 'heading_prefix' ? '#38bdf8' : '#94a3b8', cursor: 'pointer' }}
                                onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'heading', sectionId: sec.id, fieldKey: 'heading_prefix_en' }); }}
                              >
                                ✏ Hero Heading
                              </div>
                              <div
                                style={{ padding: '3px 6px', fontSize: '0.75rem', color: selectedElement?.fieldPrefix === 'cta_button' ? '#38bdf8' : '#94a3b8', cursor: 'pointer' }}
                                onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'button', sectionId: sec.id, fieldPrefix: 'cta_button', text_en: sec.cta_button_text_en, link: sec.cta_button_link }); }}
                              >
                                🔘 CTA Button
                              </div>
                              <div
                                style={{ padding: '3px 6px', fontSize: '0.75rem', color: selectedElement?.fieldPrefix === 'bg_image' ? '#38bdf8' : '#94a3b8', cursor: 'pointer' }}
                                onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'image', sectionId: sec.id, fieldKey: 'bg_image', src: sec.bg_image }); }}
                              >
                                🖼 Background Image
                              </div>
                            </div>
                          )}

                          {/* 4. VIDEO SECTION SUB-ELEMENTS */}
                          {isVideoType && (
                            <div style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                              <div
                                style={{ padding: '3px 6px', fontSize: '0.75rem', color: selectedElement?.type === 'video' ? '#38bdf8' : '#94a3b8', cursor: 'pointer' }}
                                onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'video', sectionId: sec.id, video_url: sec.video_url }); }}
                              >
                                📹 YouTube Video Player
                              </div>
                              <div
                                style={{ padding: '3px 6px', fontSize: '0.75rem', color: selectedElement?.fieldPrefix === 'cta' ? '#38bdf8' : '#94a3b8', cursor: 'pointer' }}
                                onClick={(e) => { e.stopPropagation(); setSelectedSectionId(sec.id); setSelectedElement({ type: 'button', sectionId: sec.id, fieldPrefix: 'cta', text_en: sec.cta_link_en, link: sec.cta_url }); }}
                              >
                                🔘 Services CTA Button
                              </div>
                            </div>
                          )}

                          {/* 5. ROW & COLUMNS & BLOCKS */}
                          {isRowType && sec.columns && (
                            <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                              {sec.columns.map((col, cIdx) => (
                                <div key={col.id || cIdx}>
                                  <div 
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', background: selectedElement?.colId === col.id ? '#334155' : 'rgba(255,255,255,0.03)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', color: '#94a3b8' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedSectionId(sec.id);
                                      setSelectedElement({ sectionId: sec.id, colId: col.id, col, type: 'column' });
                                    }}
                                  >
                                    <Columns size={12} />
                                    <span>Column {cIdx + 1} ({col.width || 'auto'})</span>
                                  </div>

                                  {/* Blocks in Column */}
                                  <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                                    {(col.blocks || []).map((blk, bIdx) => (
                                      <div 
                                        key={blk.id || bIdx}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 6px', background: selectedElement?.blockId === blk.id ? '#38bdf8' : 'none', color: selectedElement?.blockId === blk.id ? '#0f172a' : '#cbd5e1', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedSectionId(sec.id);
                                          setSelectedElement({ sectionId: sec.id, colId: col.id, blockId: blk.id, block: blk, type: blk.type });
                                        }}
                                      >
                                        <span>• {blk.type}</span>
                                        <button 
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); removeBlock(sec.id, col.id, blk.id); }} 
                                          style={{ background: 'none', border: 'none', color: 'inherit', opacity: 0.7, cursor: 'pointer' }}
                                        >
                                          <Trash2 size={11} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {/* 7. FOOTER COMPONENT TREE NODE */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: selectedElement?.type?.startsWith('footer') ? '2px solid #38bdf8' : '2px solid #334155', paddingLeft: '8px' }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: selectedElement?.type?.startsWith('footer') ? '#1e293b' : '#0f172a', borderRadius: '6px', cursor: 'pointer' }}
                        onClick={() => { setSelectedSectionId(null); setSelectedElement({ type: 'footer', footer: cmsConfig?.footer }); }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Layout size={13} color="#38bdf8" />
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>Footer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </aside>

        {/* ================= CENTER PANEL: EXACT REAL WEBSITE CANVAS ================= */}
        <main className="builder-canvas-container">
          {/* Breadcrumb Navigation Bar (Requirement 10 & 16) */}
          <div className="builder-breadcrumb-bar">
            <button 
              type="button"
              className="breadcrumb-item breadcrumb-clickable"
              onClick={() => { setSelectedSectionId(null); setSelectedElement(null); }}
              title="Page Root"
            >
              <Layout size={13} color="#38bdf8" />
              <span>{activePage.toUpperCase()}</span>
            </button>

            {/* Header Element Breadcrumbs */}
            {selectedElement?.type === 'navbar_item' && (
              <>
                <ChevronRight size={12} className="breadcrumb-separator" />
                <span className="breadcrumb-item" style={{ color: '#94a3b8' }}>Header</span>
                <ChevronRight size={12} className="breadcrumb-separator" />
                <span className="breadcrumb-item" style={{ color: '#94a3b8' }}>Navbar</span>
                <ChevronRight size={12} className="breadcrumb-separator" />
                <div className="breadcrumb-item breadcrumb-current">
                  <span className="breadcrumb-type-badge">{selectedElement.item?.name_en || selectedElement.item?.name || selectedElement.navId}</span>
                </div>
              </>
            )}

            {selectedElement?.type === 'header_brand' && (
              <>
                <ChevronRight size={12} className="breadcrumb-separator" />
                <span className="breadcrumb-item" style={{ color: '#94a3b8' }}>Header</span>
                <ChevronRight size={12} className="breadcrumb-separator" />
                <div className="breadcrumb-item breadcrumb-current">
                  <span className="breadcrumb-type-badge">Brand & Logo</span>
                </div>
              </>
            )}

            {/* Footer Element Breadcrumbs */}
            {selectedElement?.type?.startsWith('footer') && (
              <>
                <ChevronRight size={12} className="breadcrumb-separator" />
                <span className="breadcrumb-item" style={{ color: '#94a3b8' }}>Footer</span>
                {selectedElement.type !== 'footer' && (
                  <>
                    <ChevronRight size={12} className="breadcrumb-separator" />
                    <div className="breadcrumb-item breadcrumb-current">
                      <span className="breadcrumb-type-badge">{selectedElement.type.replace('footer_', '').toUpperCase()}</span>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Section Breadcrumbs (only if selectedSection exists and not a header/footer element) */}
            {selectedSection && !['navbar_item', 'header_brand', 'footer', 'footer_socials', 'footer_contact', 'footer_address', 'footer_legal'].includes(selectedElement?.type) && (
              <>
                <ChevronRight size={12} className="breadcrumb-separator" />
                <button 
                  type="button"
                  className={`breadcrumb-item ${selectedElement ? 'breadcrumb-clickable' : 'breadcrumb-current'}`}
                  onClick={() => { setSelectedSectionId(selectedSection.id); setSelectedElement({ type: 'section', sectionId: selectedSection.id, section: selectedSection }); }}
                  title="Section"
                >
                  <Layers size={13} color={selectedElement ? '#94a3b8' : '#38bdf8'} />
                  <span>{selectedSection.name || selectedSection.id}</span>
                </button>
              </>
            )}

            {/* Service Cards Breadcrumbs */}
            {['service_card', 'service_card_image', 'service_card_title'].includes(selectedElement?.type) && (
              <>
                <ChevronRight size={12} className="breadcrumb-separator" />
                <span className="breadcrumb-item" style={{ color: '#94a3b8' }}>
                  {selectedElement.service?.title_en || selectedElement.serviceId}
                </span>
                <ChevronRight size={12} className="breadcrumb-separator" />
                <div className="breadcrumb-item breadcrumb-current">
                  <span className="breadcrumb-type-badge">
                    {selectedElement.type === 'service_card_image' ? 'IMAGE' : selectedElement.type === 'service_card_title' ? 'TITLE' : 'CARD'}
                  </span>
                </div>
              </>
            )}

            {selectedElement && (
              <>
                {selectedElement.cardId && selectedElement.type?.startsWith('gallery') && (
                  <>
                    <ChevronRight size={12} className="breadcrumb-separator" />
                    <button 
                      type="button"
                      className={`breadcrumb-item ${selectedElement.type !== 'gallery_card' ? 'breadcrumb-clickable' : 'breadcrumb-current'}`}
                      onClick={() => {
                        const card = cmsConfig?.gallery?.find(c => c.id === selectedElement.cardId) || selectedElement.card;
                        setSelectedElement({ type: 'gallery_card', cardId: selectedElement.cardId, card, sectionId: selectedSectionId });
                      }}
                      title="Gallery Card"
                    >
                      <Square size={13} color={selectedElement.type !== 'gallery_card' ? '#94a3b8' : '#38bdf8'} />
                      <span>{selectedElement.card?.title || selectedElement.cardId}</span>
                    </button>
                  </>
                )}

                {selectedElement.cardIndex !== undefined && (
                  <>
                    <ChevronRight size={12} className="breadcrumb-separator" />
                    <button 
                      type="button"
                      className={`breadcrumb-item ${selectedElement.type !== 'section_card' ? 'breadcrumb-clickable' : 'breadcrumb-current'}`}
                      onClick={() => {
                        setSelectedElement({ type: 'section_card', sectionId: selectedSectionId, cardIndex: selectedElement.cardIndex });
                      }}
                      title="Pillar Card"
                    >
                      <Square size={13} color={selectedElement.type !== 'section_card' ? '#94a3b8' : '#38bdf8'} />
                      <span>Card 0{selectedElement.cardIndex + 1}</span>
                    </button>
                  </>
                )}

                {selectedElement.colId && (
                  <>
                    <ChevronRight size={12} className="breadcrumb-separator" />
                    <button 
                      type="button"
                      className={`breadcrumb-item ${selectedElement.blockId ? 'breadcrumb-clickable' : 'breadcrumb-current'}`}
                      onClick={() => {
                        setSelectedElement({ type: 'column', sectionId: selectedSectionId, colId: selectedElement.colId });
                      }}
                      title="Column"
                    >
                      <Columns size={13} color={selectedElement.blockId ? '#94a3b8' : '#38bdf8'} />
                      <span>Column</span>
                    </button>
                  </>
                )}

                {selectedElement.type && !['gallery_card', 'section_card', 'column', 'section', 'navbar_item', 'header_brand', 'footer', 'footer_socials', 'footer_contact', 'footer_address', 'footer_legal', 'service_card', 'service_card_image', 'service_card_title'].includes(selectedElement.type) && (
                  <>
                    <ChevronRight size={12} className="breadcrumb-separator" />
                    <div className="breadcrumb-item breadcrumb-current">
                      <span className="breadcrumb-type-badge">{selectedElement.type.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div 
            className="builder-canvas-scaler"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center'
            }}
          >
            <div className={`builder-canvas-viewport ${viewport}`}>
              {/* Real Header Component */}
              <Header />

              {/* Real Active Page Component */}
              <div className="real-page-editor-wrapper">
              {['home', 'service', 'about', 'hotels', 'contact'].includes(activePage) ? (
                <>
                  {activePage === 'home' && <Home />}
                  {activePage === 'service' && <Service />}
                  {activePage === 'about' && <AboutUs />}
                  {activePage === 'hotels' && <HotelsMore />}
                  {activePage === 'contact' && <Contact />}
                </>
              ) : (
                <div className="dynamic-page-content">
                  {(cmsConfig?.sections?.[activePage] || []).length === 0 ? (
                    <div className="builder-empty-page-state">
                      <div className="empty-page-icon">
                        <Layout size={38} color="#38bdf8" />
                      </div>
                      <h3>This page is currently empty</h3>
                      <p>Start building your page by dragging components from the left library or click below:</p>
                      <div className="empty-page-actions">
                        <button type="button" onClick={() => insertSectionAt(DEFAULT_NEW_SECTIONS.hero, 0)} className="btn-empty-add-sec">+ Add Hero Banner</button>
                        <button type="button" onClick={() => addRowSection('50-50', 0)} className="btn-empty-add-sec">+ Add 2-Column Row</button>
                        <button type="button" onClick={() => addRowSection('100', 0)} className="btn-empty-add-sec">+ Add 1-Column Row</button>
                      </div>
                    </div>
                  ) : (
                    (cmsConfig?.sections?.[activePage] || []).map((section, idx) => (
                      <DynamicSectionRenderer
                        key={section.id || idx}
                        section={section}
                        pageKey={activePage}
                        isBuilderMode={true}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Real Footer Component */}
            <Footer />
          </div>
        </div>
      </main>


        {/* ================= RIGHT PANEL: CONTEXTUAL INSPECTOR ================= */}
        <aside className="builder-sidebar-right">
          {/* ================= 0.0 SERVICE CARD INSPECTOR ================= */}
          {selectedElement?.type === 'service_card' ? (
            (() => {
              const svc = cmsConfig?.services?.find(s => s.id === (selectedElement.serviceId || selectedElement.cardId)) || selectedElement.service || {};
              const isCongress = svc.image?.includes('congress_icon');
              return (
                <div className="properties-content" style={{ padding: '16px' }}>
                  <div className="properties-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="properties-title">Service Card Settings</span>
                      <span className="section-tag-label">{svc.id || 'service_card'}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                  </div>

                  {/* Card Actions Toolbar */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '16px', background: '#0f172a', padding: '8px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <button
                      type="button"
                      className="btn-toolbar-action"
                      onClick={() => reorderServiceCard(svc.id, 'left')}
                      title="Move Left"
                      style={{ padding: '6px', background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <MoveLeft size={12} /> <span>Left</span>
                    </button>
                    <button
                      type="button"
                      className="btn-toolbar-action"
                      onClick={() => reorderServiceCard(svc.id, 'right')}
                      title="Move Right"
                      style={{ padding: '6px', background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <MoveRight size={12} /> <span>Right</span>
                    </button>
                    <button
                      type="button"
                      className="btn-toolbar-action"
                      onClick={() => duplicateServiceCard(svc.id)}
                      title="Duplicate Card"
                      style={{ padding: '6px', background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Copy size={12} /> <span>Copy</span>
                    </button>
                    <button
                      type="button"
                      className="btn-toolbar-action"
                      onClick={() => deleteServiceCard(svc.id)}
                      title="Delete Card"
                      style={{ padding: '6px', background: '#ef444422', border: '1px solid #ef444455', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Trash2 size={12} /> <span>Del</span>
                    </button>
                  </div>

                  {/* Card Image Preview & Quick Actions */}
                  <div className="property-group">
                    <label className="property-label">Service Card Image / Icon</label>
                    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '140px', background: isCongress ? '#0f172a' : '#f8fafc', marginBottom: '8px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={svc.image || '/assets/images/service_meeting.jpg'} alt={svc.title_en} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => triggerMediaPicker((url) => updateServiceCard(svc.id, { image: url }))}
                        className="btn-admin-action"
                        style={{ padding: '7px 10px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Upload size={12} /> <span>Replace Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedElement({ type: 'service_card_image', serviceId: svc.id, cardId: svc.id, service: svc, sectionId: 'service_cards', src: svc.image, alt: svc.title_en })}
                        style={{ padding: '7px 10px', background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Sliders size={12} /> <span>Image Settings</span>
                      </button>
                    </div>
                  </div>

                  {/* Title Fields */}
                  <div className="property-group">
                    <label className="property-label">Service Title (English)</label>
                    <input
                      type="text"
                      value={svc.title_en || ''}
                      onChange={(e) => updateServiceCard(svc.id, { title_en: e.target.value })}
                      className="property-input"
                    />
                  </div>
                  <div className="property-group">
                    <label className="property-label">Service Title (German)</label>
                    <input
                      type="text"
                      value={svc.title_de || ''}
                      onChange={(e) => updateServiceCard(svc.id, { title_de: e.target.value })}
                      className="property-input"
                    />
                  </div>
                </div>
              );
            })()
          ) : selectedElement?.type === 'service_card_image' ? (
            /* ================= 0.01 SERVICE CARD IMAGE INSPECTOR ================= */
            (() => {
              const svc = cmsConfig?.services?.find(s => s.id === (selectedElement.serviceId || selectedElement.cardId)) || selectedElement.service || {};
              return (
                <div className="properties-content" style={{ padding: '16px' }}>
                  <div className="properties-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="properties-title">Service Card Image</span>
                      <span className="section-tag-label">{svc.id || 'service_card'}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                  </div>

                  <ImagePickerField
                    label="Card Image Asset"
                    value={svc.image || ''}
                    onUrlChange={(url) => updateServiceCard(svc.id, { image: url })}
                    onOpenMediaPicker={() => triggerMediaPicker((url) => updateServiceCard(svc.id, { image: url }))}
                  />

                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'service_card', serviceId: svc.id, cardId: svc.id, service: svc, sectionId: 'service_cards' })}
                    style={{ width: '100%', marginTop: '16px', padding: '9px', background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
                  >
                    ← Back to Card Settings
                  </button>
                </div>
              );
            })()
          ) : selectedElement?.type === 'service_card_title' ? (
            /* ================= 0.02 SERVICE CARD TITLE INSPECTOR ================= */
            (() => {
              const svc = cmsConfig?.services?.find(s => s.id === (selectedElement.serviceId || selectedElement.cardId)) || selectedElement.service || {};
              return (
                <div className="properties-content" style={{ padding: '16px' }}>
                  <div className="properties-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="properties-title">Service Card Title</span>
                      <span className="section-tag-label">{svc.id || 'service_card'}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Title (English)</label>
                    <input
                      type="text"
                      value={svc.title_en || ''}
                      onChange={(e) => updateServiceCard(svc.id, { title_en: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Title (German)</label>
                    <input
                      type="text"
                      value={svc.title_de || ''}
                      onChange={(e) => updateServiceCard(svc.id, { title_de: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedElement({ type: 'service_card', serviceId: svc.id, cardId: svc.id, service: svc, sectionId: 'service_cards' })}
                    style={{ width: '100%', marginTop: '16px', padding: '9px', background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
                  >
                    ← Back to Card Settings
                  </button>
                </div>
              );
            })()
          ) : selectedElement?.type === 'gallery_card' ? (
            (() => {
              const card = cmsConfig?.gallery?.find(c => c.id === selectedElement.cardId) || selectedElement.card || {};
              return (
                <div className="properties-content" style={{ padding: '16px' }}>
                  <div className="properties-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="properties-title">Gallery Card Settings</span>
                      <span className="section-tag-label">{selectedElement.cardId}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                  </div>

                  {/* Card Actions Toolbar */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '16px', background: '#0f172a', padding: '8px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <button
                      type="button"
                      className="btn-toolbar-action"
                      onClick={() => reorderGalleryCard(card.id, 'left')}
                      title="Move Left"
                      style={{ padding: '6px', background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <MoveLeft size={12} /> <span>Left</span>
                    </button>
                    <button
                      type="button"
                      className="btn-toolbar-action"
                      onClick={() => reorderGalleryCard(card.id, 'right')}
                      title="Move Right"
                      style={{ padding: '6px', background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <MoveRight size={12} /> <span>Right</span>
                    </button>
                    <button
                      type="button"
                      className="btn-toolbar-action"
                      onClick={() => duplicateGalleryCard(card.id)}
                      title="Duplicate Card"
                      style={{ padding: '6px', background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Copy size={12} /> <span>Copy</span>
                    </button>
                    <button
                      type="button"
                      className="btn-toolbar-action"
                      onClick={() => deleteGalleryCard(card.id)}
                      title="Delete Card"
                      style={{ padding: '6px', background: '#ef444422', border: '1px solid #ef444455', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Trash2 size={12} /> <span>Del</span>
                    </button>
                  </div>

                  {/* Card Image Preview & Quick Actions */}
                  <div className="property-group">
                    <label className="property-label">Card Image</label>
                    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '140px', background: '#0f172a', marginBottom: '8px', border: '1px solid #334155' }}>
                      <img src={card.image || '/assets/images/hotel_cancun.jpg'} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => triggerMediaPicker((url) => updateGalleryCard(card.id, { image: url }))}
                        className="btn-admin-action"
                        style={{ padding: '7px 10px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Upload size={12} /> <span>Replace Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedElement({ type: 'card_image', cardId: card.id, card, sectionId: 'hotels_tours', src: card.image, alt: card.title })}
                        style={{ padding: '7px 10px', background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Sliders size={12} /> <span>Image Settings</span>
                      </button>
                    </div>
                  </div>

                  {/* Title Fields */}
                  <div className="property-group">
                    <label className="property-label">Card Title (English)</label>
                    <input
                      type="text"
                      value={card.title || ''}
                      onChange={(e) => updateGalleryCard(card.id, { title: e.target.value })}
                      className="property-input"
                    />
                  </div>
                  <div className="property-group">
                    <label className="property-label">Card Title (German)</label>
                    <input
                      type="text"
                      value={card.title_de || ''}
                      onChange={(e) => updateGalleryCard(card.id, { title_de: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  {/* Location Field */}
                  <div className="property-group">
                    <label className="property-label">Location (e.g. Cancún, Mexico)</label>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={card.location || ''}
                        onChange={(e) => updateGalleryCard(card.id, { location: e.target.value })}
                        className="property-input"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedElement({ type: 'card_location', cardId: card.id, card, sectionId: 'hotels_tours', location: card.location })}
                        style={{ padding: '8px', background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', borderRadius: '6px', cursor: 'pointer' }}
                        title="Customize Location Style"
                      >
                        <Settings size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Description Fields */}
                  <div className="property-group">
                    <label className="property-label">Description (English)</label>
                    <textarea
                      rows={3}
                      value={card.desc_en || ''}
                      onChange={(e) => updateGalleryCard(card.id, { desc_en: e.target.value })}
                      className="property-input"
                    />
                  </div>
                  <div className="property-group">
                    <label className="property-label">Description (German)</label>
                    <textarea
                      rows={3}
                      value={card.desc_de || ''}
                      onChange={(e) => updateGalleryCard(card.id, { desc_de: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  {/* Button Section */}
                  <div className="property-group" style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="property-label" style={{ margin: 0 }}>Card Button</label>
                      <button
                        type="button"
                        onClick={() => setSelectedElement({ type: 'card_button', cardId: card.id, card, sectionId: 'hotels_tours', text_en: card.button_text_en || 'Explore Destination', link: card.button_link || card.external_url || '/en/Contact/' })}
                        style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.74rem', cursor: 'pointer' }}
                      >
                        Full Button Settings →
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={card.button_text_en || ''}
                        onChange={(e) => updateGalleryCard(card.id, { button_text_en: e.target.value })}
                        className="property-input"
                      />
                      <input
                        type="text"
                        placeholder="Button Link / URL"
                        value={card.button_link || card.external_url || ''}
                        onChange={(e) => updateGalleryCard(card.id, { button_link: e.target.value, external_url: e.target.value })}
                        className="property-input"
                      />
                    </div>
                  </div>
                </div>
              );
            })()
          ) : selectedElement?.type === 'card_image' ? (
            /* ================= 0.2 CARD IMAGE INSPECTOR ================= */
            (() => {
              const card = cmsConfig?.gallery?.find(c => c.id === selectedElement.cardId) || selectedElement.card || {};
              const currentSrc = card.image || selectedElement.src || '';
              return (
                <div className="properties-content" style={{ padding: '16px' }}>
                  <div className="properties-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="properties-title">Card Image Settings</span>
                      <span className="section-tag-label">{selectedElement.cardId}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Image Preview</label>
                    <div style={{ position: 'relative', height: '160px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155', background: '#0f172a', marginBottom: '10px' }}>
                      <img src={currentSrc} alt={card.title || 'Preview'} style={{ width: '100%', height: '100%', objectFit: card.image_object_fit || 'cover' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => triggerMediaPicker((url) => updateGalleryCard(card.id, { image: url }))}
                        style={{ padding: '7px 8px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.74rem', cursor: 'pointer', textAlign: 'center' }}
                      >
                        Replace Image
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerMediaPicker((url) => updateGalleryCard(card.id, { image: url }))}
                        style={{ padding: '7px 8px', background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', borderRadius: '6px', fontSize: '0.74rem', cursor: 'pointer', textAlign: 'center' }}
                      >
                        Upload New
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerMediaPicker((url) => updateGalleryCard(card.id, { image: url }))}
                        style={{ padding: '7px 8px', background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', borderRadius: '6px', fontSize: '0.74rem', cursor: 'pointer', textAlign: 'center' }}
                      >
                        Media Library
                      </button>
                    </div>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Image URL</label>
                    <input
                      type="text"
                      value={currentSrc}
                      onChange={(e) => updateGalleryCard(card.id, { image: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Height (px)</label>
                    <input
                      type="text"
                      value={card.image_height || '220px'}
                      onChange={(e) => updateGalleryCard(card.id, { image_height: e.target.value })}
                      className="property-input"
                      placeholder="220px"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Object Fit</label>
                    <select
                      value={card.image_object_fit || 'cover'}
                      onChange={(e) => updateGalleryCard(card.id, { image_object_fit: e.target.value })}
                      className="property-input"
                    >
                      <option value="cover">Cover (Fill & Crop)</option>
                      <option value="contain">Contain (Fit Whole)</option>
                      <option value="fill">Fill (Stretch)</option>
                    </select>
                  </div>
                </div>
              );
            })()
          ) : selectedElement?.type === 'card_title' ? (
            /* ================= 0.3 CARD TITLE INSPECTOR ================= */
            (() => {
              const card = cmsConfig?.gallery?.find(c => c.id === selectedElement.cardId) || selectedElement.card || {};
              return (
                <div className="properties-content" style={{ padding: '16px' }}>
                  <div className="properties-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="properties-title">Card Title Settings</span>
                      <span className="section-tag-label">{selectedElement.cardId}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Title Text (English)</label>
                    <input
                      type="text"
                      value={card.title || ''}
                      onChange={(e) => updateGalleryCard(card.id, { title: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Title Text (German)</label>
                    <input
                      type="text"
                      value={card.title_de || ''}
                      onChange={(e) => updateGalleryCard(card.id, { title_de: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Title Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={card.title_color || '#1f242d'}
                        onChange={(e) => updateGalleryCard(card.id, { title_color: e.target.value })}
                        style={{ width: '40px', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'none' }}
                      />
                      <input
                        type="text"
                        value={card.title_color || '#1f242d'}
                        onChange={(e) => updateGalleryCard(card.id, { title_color: e.target.value })}
                        className="property-input"
                      />
                    </div>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Font Size</label>
                    <select
                      value={card.title_size || '1.25rem'}
                      onChange={(e) => updateGalleryCard(card.id, { title_size: e.target.value })}
                      className="property-input"
                    >
                      <option value="1rem">Small (1rem)</option>
                      <option value="1.15rem">Medium (1.15rem)</option>
                      <option value="1.25rem">Standard (1.25rem)</option>
                      <option value="1.4rem">Large (1.4rem)</option>
                      <option value="1.6rem">Extra Large (1.6rem)</option>
                    </select>
                  </div>
                </div>
              );
            })()
          ) : selectedElement?.type === 'card_location' ? (
            /* ================= 0.4 CARD LOCATION INSPECTOR ================= */
            (() => {
              const card = cmsConfig?.gallery?.find(c => c.id === selectedElement.cardId) || selectedElement.card || {};
              return (
                <div className="properties-content" style={{ padding: '16px' }}>
                  <div className="properties-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="properties-title">Card Location Settings</span>
                      <span className="section-tag-label">{selectedElement.cardId}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Location Text (e.g. Cancún, Mexico)</label>
                    <input
                      type="text"
                      value={card.location || ''}
                      onChange={(e) => updateGalleryCard(card.id, { location: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Icon Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={card.location_icon_color || '#ff0000'}
                        onChange={(e) => updateGalleryCard(card.id, { location_icon_color: e.target.value })}
                        style={{ width: '40px', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'none' }}
                      />
                      <input
                        type="text"
                        value={card.location_icon_color || '#ff0000'}
                        onChange={(e) => updateGalleryCard(card.id, { location_icon_color: e.target.value })}
                        className="property-input"
                      />
                    </div>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Text Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={card.location_color || '#666666'}
                        onChange={(e) => updateGalleryCard(card.id, { location_color: e.target.value })}
                        style={{ width: '40px', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'none' }}
                      />
                      <input
                        type="text"
                        value={card.location_color || '#666666'}
                        onChange={(e) => updateGalleryCard(card.id, { location_color: e.target.value })}
                        className="property-input"
                      />
                    </div>
                  </div>
                </div>
              );
            })()
          ) : selectedElement?.type === 'card_desc' ? (
            /* ================= 0.5 CARD DESCRIPTION INSPECTOR ================= */
            (() => {
              const card = cmsConfig?.gallery?.find(c => c.id === selectedElement.cardId) || selectedElement.card || {};
              return (
                <div className="properties-content" style={{ padding: '16px' }}>
                  <div className="properties-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="properties-title">Card Description Settings</span>
                      <span className="section-tag-label">{selectedElement.cardId}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Description (English)</label>
                    <textarea
                      rows={4}
                      value={card.desc_en || ''}
                      onChange={(e) => updateGalleryCard(card.id, { desc_en: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Description (German)</label>
                    <textarea
                      rows={4}
                      value={card.desc_de || ''}
                      onChange={(e) => updateGalleryCard(card.id, { desc_de: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Text Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={card.desc_color || '#555555'}
                        onChange={(e) => updateGalleryCard(card.id, { desc_color: e.target.value })}
                        style={{ width: '40px', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'none' }}
                      />
                      <input
                        type="text"
                        value={card.desc_color || '#555555'}
                        onChange={(e) => updateGalleryCard(card.id, { desc_color: e.target.value })}
                        className="property-input"
                      />
                    </div>
                  </div>
                </div>
              );
            })()
          ) : selectedElement?.type === 'card_button' ? (
            /* ================= 0.6 CARD BUTTON INSPECTOR ================= */
            (() => {
              const card = cmsConfig?.gallery?.find(c => c.id === selectedElement.cardId) || selectedElement.card || {};
              const btnDest = card.button_link || card.external_url || '/en/Contact/';
              return (
                <div className="properties-content" style={{ padding: '16px' }}>
                  <div className="properties-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="properties-title">Card Button Settings</span>
                      <span className="section-tag-label">{selectedElement.cardId}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Button Text (English)</label>
                    <input
                      type="text"
                      value={card.button_text_en || ''}
                      onChange={(e) => updateGalleryCard(card.id, { button_text_en: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Button Text (German)</label>
                    <input
                      type="text"
                      value={card.button_text_de || ''}
                      onChange={(e) => updateGalleryCard(card.id, { button_text_de: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Link Destination</label>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={btnDest}
                        onChange={(e) => updateGalleryCard(card.id, { button_link: e.target.value, external_url: e.target.value })}
                        className="property-input"
                      />
                      <button
                        type="button"
                        onClick={() => window.open(btnDest, '_blank')}
                        style={{ padding: '8px 12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                        title="Test opening link in new tab"
                      >
                        <ExternalLink size={12} /> <span>Test Link</span>
                      </button>
                    </div>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Quick Page Target</label>
                    <select
                      value={btnDest}
                      onChange={(e) => updateGalleryCard(card.id, { button_link: e.target.value, external_url: e.target.value })}
                      className="property-input"
                    >
                      <option value="/en/Contact/">Contact Us (/en/Contact/)</option>
                      <option value="/en/Service/">Services (/en/Service/)</option>
                      <option value="/en/About/">About Us (/en/About/)</option>
                      <option value="/en/Hotels/">Hotels & Tours (/en/Hotels/)</option>
                    </select>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Background Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={card.button_bg_color || '#ff0000'}
                        onChange={(e) => updateGalleryCard(card.id, { button_bg_color: e.target.value })}
                        style={{ width: '40px', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'none' }}
                      />
                      <input
                        type="text"
                        value={card.button_bg_color || '#ff0000'}
                        onChange={(e) => updateGalleryCard(card.id, { button_bg_color: e.target.value })}
                        className="property-input"
                      />
                    </div>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Text Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={card.button_text_color || '#ffffff'}
                        onChange={(e) => updateGalleryCard(card.id, { button_text_color: e.target.value })}
                        style={{ width: '40px', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'none' }}
                      />
                      <input
                        type="text"
                        value={card.button_text_color || '#ffffff'}
                        onChange={(e) => updateGalleryCard(card.id, { button_text_color: e.target.value })}
                        className="property-input"
                      />
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (selectedElement?.type === 'video' || selectedElement?.type === 'youtube') ? (
            /* ================= 0.7 YOUTUBE & VIDEO INSPECTOR ================= */
            (() => {
              const vUrl = selectedElement.url || selectedElement.video_url || selectedElement.block?.video_url || selectedElement.block?.url || '';
              const { isYouTube, videoId } = parseYouTubeUrl(vUrl);
              return (
                <div className="properties-content" style={{ padding: '16px' }}>
                  <div className="properties-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="properties-title">YouTube & Video Settings</span>
                      <span className="section-tag-label">{selectedElement.blockId || selectedElement.sectionId}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Video URL (YouTube or Direct)</label>
                    <input
                      type="text"
                      value={vUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        const parsed = parseYouTubeUrl(val);
                        updateVideoProperties(selectedElement.sectionId, selectedElement.blockId, {
                          url: val,
                          video_url: parsed.isYouTube ? parsed.embedUrl : val,
                          video_id: parsed.videoId,
                          video_type: parsed.isYouTube ? 'youtube' : 'url'
                        });
                      }}
                      className="property-input"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    {isYouTube && videoId && (
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.78rem', fontWeight: 600 }}>
                        <CheckCircle2 size={13} />
                        <span>Detected YouTube Video ID: <strong>{videoId}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="property-group">
                    <label className="property-label">Aspect Ratio</label>
                    <select
                      value={selectedElement.block?.aspect_ratio || '16/9'}
                      onChange={(e) => updateVideoProperties(selectedElement.sectionId, selectedElement.blockId, { aspect_ratio: e.target.value })}
                      className="property-input"
                    >
                      <option value="16/9">16:9 Standard Widescreen</option>
                      <option value="4/3">4:3 Classic TV</option>
                      <option value="1/1">1:1 Square</option>
                      <option value="21/9">21:9 Ultrawide Cinematic</option>
                    </select>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Corner Border Radius</label>
                    <input
                      type="text"
                      value={selectedElement.block?.border_radius || '12px'}
                      onChange={(e) => updateVideoProperties(selectedElement.sectionId, selectedElement.blockId, { border_radius: e.target.value })}
                      className="property-input"
                      placeholder="12px"
                    />
                  </div>

                  <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.5 }}>
                    💡 <strong>Live Mode Notice:</strong> In Edit Mode, clicking the video selects it for customization. To play and preview the video interactively, click <strong>Test / Play Video</strong> on the video itself or switch to <strong>Live Preview</strong>.
                  </div>
                </div>
              );
            })()
          ) : (selectedElement?.type === 'section_card' || selectedElement?.type === 'pillar_num' || selectedElement?.type === 'pillar_title' || selectedElement?.type === 'pillar_desc') ? (
            /* ================= 0.8 4 PILLARS CARD INSPECTOR ================= */
            (() => {
              const sec = currentSections.find(s => s.id === selectedElement.sectionId);
              const card = sec?.cards?.[selectedElement.cardIndex] || selectedElement.card || {};
              const idx = selectedElement.cardIndex;
              return (
                <div className="properties-content" style={{ padding: '16px' }}>
                  <div className="properties-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="properties-title">Pillar Card Settings</span>
                      <span className="section-tag-label">Card {card.num || `0${idx + 1}`}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                    <button
                      type="button"
                      onClick={() => duplicateSectionCard(selectedElement.sectionId, idx)}
                      style={{ padding: '7px 10px', background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Copy size={12} /> <span>Duplicate Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSectionCard(selectedElement.sectionId, idx)}
                      style={{ padding: '7px 10px', background: '#ef444422', border: '1px solid #ef444455', color: '#ef4444', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Trash2 size={12} /> <span>Delete Card</span>
                    </button>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Number Badge (e.g. 01)</label>
                    <input
                      type="text"
                      value={card.num || ''}
                      onChange={(e) => updateSectionCard(selectedElement.sectionId, idx, { num: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Title (English)</label>
                    <input
                      type="text"
                      value={card.title_en || ''}
                      onChange={(e) => updateSectionCard(selectedElement.sectionId, idx, { title_en: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Title (German)</label>
                    <input
                      type="text"
                      value={card.title_de || ''}
                      onChange={(e) => updateSectionCard(selectedElement.sectionId, idx, { title_de: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Description (English)</label>
                    <textarea
                      rows={4}
                      value={card.desc_en || ''}
                      onChange={(e) => updateSectionCard(selectedElement.sectionId, idx, { desc_en: e.target.value })}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Description (German)</label>
                    <textarea
                      rows={4}
                      value={card.desc_de || ''}
                      onChange={(e) => updateSectionCard(selectedElement.sectionId, idx, { desc_de: e.target.value })}
                      className="property-input"
                    />
                  </div>
                </div>
              );
            })()
          ) : (selectedElement?.type === 'feature' || selectedElement?.type === 'feature_icon' || selectedElement?.type === 'feature_heading' || selectedElement?.type === 'feature_desc' || selectedElement?.type === 'feature_button') ? (
            /* ================= 0.9 FEATURE COMPONENT INSPECTOR ================= */
            (() => {
              const blk = selectedElement.block || {};
              return (
                <div className="properties-content" style={{ padding: '16px' }}>
                  <div className="properties-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <span className="properties-title">Feature Component Settings</span>
                      <span className="section-tag-label">{selectedElement.blockId || 'Feature'}</span>
                    </div>
                    <button type="button" onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Feature Heading (English)</label>
                    <input
                      type="text"
                      value={blk.title_en || ''}
                      onChange={(e) => updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'title_en', e.target.value)}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Feature Heading (German)</label>
                    <input
                      type="text"
                      value={blk.title_de || ''}
                      onChange={(e) => updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'title_de', e.target.value)}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Description (English)</label>
                    <textarea
                      rows={3}
                      value={blk.desc_en || ''}
                      onChange={(e) => updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'desc_en', e.target.value)}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Button Text</label>
                    <input
                      type="text"
                      value={blk.button_text_en || ''}
                      onChange={(e) => updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'button_text_en', e.target.value)}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Button Link</label>
                    <input
                      type="text"
                      value={blk.button_link || '/en/Contact/'}
                      onChange={(e) => updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'button_link', e.target.value)}
                      className="property-input"
                    />
                  </div>
                </div>
              );
            })()
          ) : selectedElement?.type === 'button' ? (
            <div className="properties-content" style={{ padding: '16px' }}>
              <div className="properties-header" style={{ marginBottom: '16px' }}>
                <div>
                  <span className="properties-title">Button & Link Settings</span>
                  <span className="section-tag-label">{selectedElement.fieldPrefix || selectedElement.blockId || 'Button'}</span>
                </div>
                <button 
                  onClick={() => setSelectedElement(null)} 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* 1.1 CONTENT: LABELS & URL */}
              <div className="property-group">
                <label className="property-label">Button Text (English)</label>
                <input 
                  type="text" 
                  value={selectedElement.text_en || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (selectedElement.colId && selectedElement.blockId) {
                      updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'text_en', val);
                    } else {
                      updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { text_en: val });
                    }
                    setSelectedElement(prev => ({ ...prev, text_en: val }));
                  }}
                  className="property-input"
                />
              </div>

              <div className="property-group">
                <label className="property-label">Button Text (German)</label>
                <input 
                  type="text" 
                  value={selectedElement.text_de || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (selectedElement.colId && selectedElement.blockId) {
                      updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'text_de', val);
                    } else {
                      updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { text_de: val });
                    }
                    setSelectedElement(prev => ({ ...prev, text_de: val }));
                  }}
                  className="property-input"
                />
              </div>

              <div className="property-group">
                <label className="property-label">Link Destination Type</label>
                <select 
                  value={selectedElement.link_type || 'internal'}
                  onChange={(e) => {
                    const lType = e.target.value;
                    let defaultDest = selectedElement.link || '/en/Contact/';
                    if (lType === 'email' && !defaultDest.startsWith('mailto:')) defaultDest = 'mailto:contact@sportsandmice.com';
                    if (lType === 'phone' && !defaultDest.startsWith('tel:')) defaultDest = 'tel:+492241343320';
                    if (lType === 'external' && !defaultDest.startsWith('http')) defaultDest = 'https://';

                    if (selectedElement.colId && selectedElement.blockId) {
                      updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, { link_type: lType, link: defaultDest });
                    } else {
                      updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { link_type: lType, link: defaultDest });
                    }
                    setSelectedElement(prev => ({ ...prev, link_type: lType, link: defaultDest }));
                  }}
                  className="property-input"
                >
                  <option value="internal">Internal Website Page</option>
                  <option value="external">External URL (https://...)</option>
                  <option value="email">Email Address (mailto:...)</option>
                  <option value="phone">Phone Number (tel:...)</option>
                </select>
              </div>

              {/* Internal Page Picker dropdown */}
              {(selectedElement.link_type === 'internal' || !selectedElement.link_type) && (
                <div className="property-group">
                  <label className="property-label">Select Internal Page</label>
                  <select 
                    value={selectedElement.link || '/en/Contact/'}
                    onChange={(e) => {
                      const dest = e.target.value;
                      if (selectedElement.colId && selectedElement.blockId) {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'link', dest);
                      } else {
                        updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { link: dest });
                      }
                      setSelectedElement(prev => ({ ...prev, link: dest }));
                    }}
                    className="property-input"
                  >
                    <option value="/">Home ( / )</option>
                    <option value="/en/Service/">Services ( /en/Service/ )</option>
                    <option value="/en/About-us/">About Us ( /en/About-us/ )</option>
                    <option value="/en/Hotels-more/">Hotels & More ( /en/Hotels-more/ )</option>
                    <option value="/en/Contact/">Contact Form ( /en/Contact/ )</option>
                    {/* Add all custom dynamic pages */}
                    {Object.entries(cmsConfig?.pages || {}).filter(([k]) => !['home', 'service', 'about', 'hotels', 'contact'].includes(k)).map(([slug, pageObj]) => (
                      <option key={slug} value={`/${slug}`}>
                        {pageObj.title || slug} ( /{slug} )
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Exact URL / Destination field */}
              <div className="property-group">
                <label className="property-label">Target URL / Path</label>
                <input 
                  type="text" 
                  value={selectedElement.link || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (selectedElement.colId && selectedElement.blockId) {
                      updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'link', val);
                    } else {
                      updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { link: val });
                    }
                    setSelectedElement(prev => ({ ...prev, link: val }));
                  }}
                  className="property-input"
                  placeholder="/en/Contact/"
                />
              </div>

              {/* Target & Test Link Action */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label className="property-label">Open In</label>
                  <select 
                    value={selectedElement.target || '_self'}
                    onChange={(e) => {
                      const tgt = e.target.value;
                      if (selectedElement.colId && selectedElement.blockId) {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'target', tgt);
                      } else {
                        updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { target: tgt });
                      }
                      setSelectedElement(prev => ({ ...prev, target: tgt }));
                    }}
                    className="property-input"
                  >
                    <option value="_self">Same Tab</option>
                    <option value="_blank">New Tab (_blank)</option>
                  </select>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <label className="property-label">&nbsp;</label>
                  <button 
                    type="button"
                    onClick={() => {
                      const dest = selectedElement.link || '/en/Contact/';
                      window.open(dest.startsWith('http') ? dest : `http://localhost:5173${dest.startsWith('/') ? dest : '/' + dest}`, '_blank');
                    }}
                    style={{ padding: '8px 12px', background: '#334155', color: '#fff', border: '1px solid #475569', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    title="Safely test the button destination in a separate browser tab"
                  >
                    <ExternalLink size={13} />
                    <span>Test Link</span>
                  </button>
                </div>
              </div>

              {/* 1.2 STYLES: COLORS & PADDING */}
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #334155' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', display: 'block', marginBottom: '12px' }}>Colors & Appearance</span>

                <div className="property-group">
                  <label className="property-label">Background Color</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="color" 
                      value={selectedElement.bg_color || '#ff0000'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedElement.colId && selectedElement.blockId) {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'bg_color', val);
                        } else {
                          updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { bg_color: val });
                        }
                        setSelectedElement(prev => ({ ...prev, bg_color: val }));
                      }}
                      style={{ width: '40px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input 
                      type="text" 
                      value={selectedElement.bg_color || '#ff0000'} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedElement.colId && selectedElement.blockId) {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'bg_color', val);
                        } else {
                          updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { bg_color: val });
                        }
                        setSelectedElement(prev => ({ ...prev, bg_color: val }));
                      }}
                      className="property-input"
                    />
                  </div>
                </div>

                <div className="property-group">
                  <label className="property-label">Text Color</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="color" 
                      value={selectedElement.text_color || '#ffffff'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedElement.colId && selectedElement.blockId) {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'text_color', val);
                        } else {
                          updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { text_color: val });
                        }
                        setSelectedElement(prev => ({ ...prev, text_color: val }));
                      }}
                      style={{ width: '40px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input 
                      type="text" 
                      value={selectedElement.text_color || '#ffffff'} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedElement.colId && selectedElement.blockId) {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'text_color', val);
                        } else {
                          updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { text_color: val });
                        }
                        setSelectedElement(prev => ({ ...prev, text_color: val }));
                      }}
                      className="property-input"
                    />
                  </div>
                </div>

                <div className="property-group">
                  <label className="property-label">Hover Background Color</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="color" 
                      value={selectedElement.hover_bg_color || '#cc0000'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedElement.colId && selectedElement.blockId) {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'hover_bg_color', val);
                        } else {
                          updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { hover_bg_color: val });
                        }
                        setSelectedElement(prev => ({ ...prev, hover_bg_color: val }));
                      }}
                      style={{ width: '40px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input 
                      type="text" 
                      value={selectedElement.hover_bg_color || '#cc0000'} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedElement.colId && selectedElement.blockId) {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'hover_bg_color', val);
                        } else {
                          updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { hover_bg_color: val });
                        }
                        setSelectedElement(prev => ({ ...prev, hover_bg_color: val }));
                      }}
                      className="property-input"
                    />
                  </div>
                </div>

                <div className="property-group">
                  <label className="property-label">Border Radius</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      step="2"
                      value={parseInt(selectedElement.border_radius) || 50}
                      onChange={(e) => {
                        const val = `${e.target.value}px`;
                        if (selectedElement.colId && selectedElement.blockId) {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'border_radius', val);
                        } else {
                          updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { border_radius: val });
                        }
                        setSelectedElement(prev => ({ ...prev, border_radius: val }));
                      }}
                      className="property-slider"
                    />
                    <span style={{ fontSize: '0.85rem', color: '#fff', minWidth: '40px' }}>{selectedElement.border_radius || '50px'}</span>
                  </div>
                </div>

                <div className="property-group">
                  <label className="property-label">Padding (Vertical & Horizontal)</label>
                  <input 
                    type="text" 
                    value={selectedElement.padding || '14px 32px'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (selectedElement.colId && selectedElement.blockId) {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'padding', val);
                      } else {
                        updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { padding: val });
                      }
                      setSelectedElement(prev => ({ ...prev, padding: val }));
                    }}
                    className="property-input"
                    placeholder="14px 32px"
                  />
                </div>

                <div className="property-group">
                  <label className="property-label">Hover Animation Effect</label>
                  <select 
                    value={selectedElement.hover_animation || 'scale'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (selectedElement.colId && selectedElement.blockId) {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'hover_animation', val);
                      } else {
                        updateButtonProperties(selectedElement.sectionId, selectedElement.fieldPrefix, { hover_animation: val });
                      }
                      setSelectedElement(prev => ({ ...prev, hover_animation: val }));
                    }}
                    className="property-input"
                  >
                    <option value="scale">Scale Up (Zoom)</option>
                    <option value="lift">Lift Up (Translate Y)</option>
                    <option value="glow">Glow Highlight</option>
                    <option value="pulse">Pulse Motion</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              {/* Remove block button if it is a block */}
              {selectedElement.blockId && (
                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #334155' }}>
                  <button 
                    type="button" 
                    onClick={() => removeBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId)}
                    style={{ width: '100%', padding: '10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Trash2 size={15} />
                    <span>Delete Button Block</span>
                  </button>
                </div>
              )}
            </div>
          ) : selectedElement?.type === 'navbar_item' ? (
            /* ================= 2. NAVBAR ITEM INSPECTOR ================= */
            <div className="properties-content" style={{ padding: '16px' }}>
              <div className="properties-header" style={{ marginBottom: '16px' }}>
                <div>
                  <span className="properties-title">Navbar Link Settings</span>
                  <span className="section-tag-label">{selectedElement.navId || 'Navbar'}</span>
                </div>
                <button 
                  onClick={() => setSelectedElement(null)} 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="property-group">
                <label className="property-label">Navigation Label (English)</label>
                <input 
                  type="text" 
                  value={selectedElement.item?.name_en || selectedElement.item?.name || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateNavItem(selectedElement.navId, { name_en: val });
                    setSelectedElement(prev => ({ ...prev, item: { ...prev.item, name_en: val } }));
                  }}
                  className="property-input"
                />
              </div>

              <div className="property-group">
                <label className="property-label">Navigation Label (German)</label>
                <input 
                  type="text" 
                  value={selectedElement.item?.name_de || selectedElement.item?.name || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateNavItem(selectedElement.navId, { name_de: val });
                    setSelectedElement(prev => ({ ...prev, item: { ...prev.item, name_de: val } }));
                  }}
                  className="property-input"
                />
              </div>

              <div className="property-group">
                <label className="property-label">Link Path / Page</label>
                <input 
                  type="text" 
                  value={selectedElement.item?.path || '/'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateNavItem(selectedElement.navId, { path: val });
                    setSelectedElement(prev => ({ ...prev, item: { ...prev.item, path: val } }));
                  }}
                  className="property-input"
                />
              </div>

              {(() => {
                const targetPageId = resolvePageIdFromPath(selectedElement.item?.path, cmsConfig?.pages);
                const targetPageName = targetPageId ? (cmsConfig?.pages?.[targetPageId]?.title || targetPageId.toUpperCase()) : 'Page';

                return (
                  <>
                    <div className="property-group">
                      <label className="property-label">Linked Website Page</label>
                      <select
                        value={targetPageId || ''}
                        onChange={(e) => {
                          const pId = e.target.value;
                          if (!pId) return;
                          const p = cmsConfig?.pages?.[pId];
                          const newPath = pId === 'home' ? '/' : (p?.slug ? (p.slug.startsWith('/') ? p.slug : `/${p.slug}`) : `/en/${pId}/`);
                          updateNavItem(selectedElement.navId, { path: newPath });
                          setSelectedElement(prev => ({ ...prev, item: { ...prev.item, path: newPath } }));
                        }}
                        className="property-input"
                      >
                        <option value="">-- Custom URL Path --</option>
                        {allPagesList.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.label} (/{p.slug})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                      {targetPageId && (
                        <button 
                          type="button"
                          onClick={() => {
                            handlePageChange(targetPageId);
                          }}
                          style={{ width: '100%', padding: '10px 14px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                        >
                          <FolderPlus size={15} />
                          <span>Open {targetPageName} Page in Builder</span>
                        </button>
                      )}

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setNavModalOpen(true)}
                          style={{ flex: 1, padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                        >
                          <Navigation size={14} />
                          <span>Edit Navigation</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            const p = selectedElement.item?.path || '/';
                            window.open(`http://localhost:5173${p.startsWith('/') ? p : '/' + p}`, '_blank');
                          }}
                          style={{ flex: 1, padding: '9px 12px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                        >
                          <ExternalLink size={14} />
                          <span>Test Link</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete this navigation item and its page route completely from the database?')) {
                              deleteNavItem(selectedElement.navId);
                              setSelectedElement(null);
                            }
                          }}
                          style={{ padding: '9px 12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}
                          title="Delete navigation item & purge route from database"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : selectedElement?.type === 'header_brand' ? (
            /* ================= 3. BRAND & LOGO INSPECTOR ================= */
            <div className="properties-content" style={{ padding: '16px' }}>
              <div className="properties-header" style={{ marginBottom: '16px' }}>
                <span className="properties-title">Header Brand Settings</span>
                <button onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
              </div>

              <div className="property-group">
                <label className="property-label">Brand Title</label>
                <input 
                  type="text" 
                  value={cmsConfig?.header?.brand_title || 'Sports & MICE'}
                  onChange={(e) => {
                    const val = e.target.value;
                    const newConfig = { ...cmsConfig, header: { ...cmsConfig.header, brand_title: val } };
                    pushState(newConfig);
                  }}
                  className="property-input"
                />
              </div>

              <ImagePickerField
                label="Header Brand Logo"
                value={cmsConfig?.header?.logo_url || '/assets/images/logo.png'}
                onUrlChange={(url) => {
                  const newConfig = { ...cmsConfig, header: { ...cmsConfig.header, logo_url: url } };
                  pushState(newConfig);
                }}
                onOpenMediaLibrary={() => {
                  triggerMediaPicker((url) => {
                    const newConfig = { ...cmsConfig, header: { ...cmsConfig.header, logo_url: url } };
                    pushState(newConfig);
                  });
                }}
                onRemove={() => {
                  const newConfig = { ...cmsConfig, header: { ...cmsConfig.header, logo_url: '/assets/images/logo.png' } };
                  pushState(newConfig);
                }}
                previewHeight={110}
                showAltField={false}
              />
            </div>
          ) : selectedElement?.type === 'form' ? (
            /* ================= 4. FORM INSPECTOR ================= */
            <div className="properties-content" style={{ padding: '16px' }}>
              <div className="properties-header" style={{ marginBottom: '16px' }}>
                <div>
                  <span className="properties-title">Contact Form Settings</span>
                  <span className="section-tag-label">{selectedElement.sectionId}</span>
                </div>
                <button onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
              </div>

              <div className="property-group">
                <label className="property-label">Form Title (English)</label>
                <input 
                  type="text" 
                  value={selectedElement.title_en || 'Contact Form'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateSectionField(selectedElement.sectionId, 'title_en', val);
                    setSelectedElement(prev => ({ ...prev, title_en: val }));
                  }}
                  className="property-input"
                />
              </div>

              <div className="property-group">
                <label className="property-label">Form Title (German)</label>
                <input 
                  type="text" 
                  value={selectedElement.title_de || 'Kontaktformular'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateSectionField(selectedElement.sectionId, 'title_de', val);
                    setSelectedElement(prev => ({ ...prev, title_de: val }));
                  }}
                  className="property-input"
                />
              </div>

              <div className="property-group">
                <label className="property-label">Notification Recipient Email</label>
                <input 
                  type="email" 
                  value={selectedElement.recipient_email || 'contact@sportsandmice.com'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateSectionField(selectedElement.sectionId, 'recipient_email', val);
                    setSelectedElement(prev => ({ ...prev, recipient_email: val }));
                  }}
                  className="property-input"
                  placeholder="contact@sportsandmice.com"
                />
              </div>

              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', marginTop: '12px', color: '#bae6fd', fontSize: '0.8rem', lineHeight: 1.5 }}>
                💡 <strong>Testing note:</strong> In Edit Mode, form submissions are intercepted to prevent accidental submits. To test real live form submission with email notifications, switch to <strong>Live Preview Mode</strong> at the top.
              </div>
            </div>
          ) : selectedElement?.blockId ? (
            /* ================= 5. COMPLETE BLOCK INSPECTORS ================= */
            <div className="properties-content" style={{ padding: '16px' }}>
              <div className="properties-header" style={{ marginBottom: '16px' }}>
                <div>
                  <span className="properties-title">Block Settings: {selectedElement.type?.toUpperCase()}</span>
                  <span className="section-tag-label">{selectedElement.blockId}</span>
                </div>
                <button 
                  onClick={() => setSelectedElement(null)} 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* 5.1 HEADING BLOCK */}
              {selectedElement.type === 'heading' && (
                <>
                  <div className="property-group">
                    <label className="property-label">Heading Tag / Level</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {['h1', 'h2', 'h3', 'h4'].map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          style={{ padding: '7px', background: (selectedElement.block?.level || 'h2') === lvl ? '#38bdf8' : '#1e293b', color: (selectedElement.block?.level || 'h2') === lvl ? '#0f172a' : '#fff', border: '1px solid #334155', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                          onClick={() => {
                            updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'level', lvl);
                            setSelectedElement(prev => ({ ...prev, block: { ...prev.block, level: lvl } }));
                          }}
                        >
                          {lvl.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Heading Text (English)</label>
                    <input 
                      type="text" 
                      value={selectedElement.block?.text_en || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'text_en', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, text_en: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Heading Text (German)</label>
                    <input 
                      type="text" 
                      value={selectedElement.block?.text_de || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'text_de', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, text_de: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Text Alignment</label>
                    <div className="property-btn-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {['left', 'center', 'right'].map(align => (
                        <button
                          key={align}
                          type="button"
                          className={`btn-align-toggle ${selectedElement.block?.align === align ? 'active' : ''}`}
                          style={{ padding: '8px', background: (selectedElement.block?.align || 'left') === align ? '#38bdf8' : '#1e293b', border: '1px solid #334155', color: (selectedElement.block?.align || 'left') === align ? '#0f172a' : '#fff', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}
                          onClick={() => {
                            updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'align', align);
                            setSelectedElement(prev => ({ ...prev, block: { ...prev.block, align } }));
                          }}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Text Color</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="color" 
                        value={selectedElement.block?.color || '#1f242d'}
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'color', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, color: e.target.value } }));
                        }}
                        style={{ width: '40px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input 
                        type="text" 
                        value={selectedElement.block?.color || '#1f242d'} 
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'color', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, color: e.target.value } }));
                        }}
                        className="property-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 5.2 TEXT / PARAGRAPH BLOCK */}
              {selectedElement.type === 'text' && (
                <>
                  <div className="property-group">
                    <label className="property-label">Paragraph Content (English)</label>
                    <textarea 
                      rows="4"
                      value={selectedElement.block?.text_en || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'text_en', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, text_en: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Paragraph Content (German)</label>
                    <textarea 
                      rows="4"
                      value={selectedElement.block?.text_de || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'text_de', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, text_de: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Text Alignment</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {['left', 'center', 'right'].map(align => (
                        <button
                          key={align}
                          type="button"
                          style={{ padding: '8px', background: (selectedElement.block?.align || 'left') === align ? '#38bdf8' : '#1e293b', border: '1px solid #334155', color: (selectedElement.block?.align || 'left') === align ? '#0f172a' : '#fff', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}
                          onClick={() => {
                            updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'align', align);
                            setSelectedElement(prev => ({ ...prev, block: { ...prev.block, align } }));
                          }}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Text Color</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="color" 
                        value={selectedElement.block?.color || '#555555'}
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'color', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, color: e.target.value } }));
                        }}
                        style={{ width: '40px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input 
                        type="text" 
                        value={selectedElement.block?.color || '#555555'} 
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'color', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, color: e.target.value } }));
                        }}
                        className="property-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 5.3 IMAGE BLOCK */}
              {selectedElement.type === 'image' && (
                <>
                  <ImagePickerField
                    label="Image Asset"
                    value={selectedElement.block?.src || selectedElement.block?.image || ''}
                    altText={selectedElement.block?.alt || ''}
                    onUrlChange={(url) => {
                      updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'src', url);
                      setSelectedElement(prev => ({ ...prev, block: { ...prev.block, src: url } }));
                    }}
                    onAltChange={(alt) => {
                      updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'alt', alt);
                      setSelectedElement(prev => ({ ...prev, block: { ...prev.block, alt } }));
                    }}
                    onOpenMediaLibrary={() => {
                      triggerMediaPicker((url) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'src', url);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, src: url } }));
                      });
                    }}
                    onRemove={() => {
                      updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'src', '');
                      setSelectedElement(prev => ({ ...prev, block: { ...prev.block, src: '' } }));
                    }}
                    previewHeight={140}
                  />

                  {/* Responsive Dimensions */}
                  <div className="property-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label className="property-label" style={{ margin: 0 }}>Dimensions & Responsive</label>
                      <div className="responsive-mini-pills">
                        {['desktop', 'tablet', 'mobile'].map(dev => (
                          <button
                            key={dev}
                            type="button"
                            className={`mini-pill-btn ${editingDevice === dev ? 'active' : ''}`}
                            onClick={() => setEditingDevice(dev)}
                          >
                            {dev === 'desktop' ? '🖥️' : dev === 'tablet' ? '📱' : '📲'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label className="property-sub-label">Width ({editingDevice})</label>
                        <input
                          type="text"
                          value={
                            editingDevice === 'desktop' ? (selectedElement.block?.width || '100%') :
                            editingDevice === 'tablet' ? (selectedElement.block?.tablet_width || selectedElement.block?.width || '100%') :
                            (selectedElement.block?.mobile_width || '100%')
                          }
                          onChange={(e) => {
                            const fKey = editingDevice === 'desktop' ? 'width' : `${editingDevice}_width`;
                            updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, fKey, e.target.value);
                            setSelectedElement(prev => ({ ...prev, block: { ...prev.block, [fKey]: e.target.value } }));
                          }}
                          className="property-input"
                          placeholder="100% or 400px"
                        />
                      </div>
                      <div>
                        <label className="property-sub-label">Height ({editingDevice})</label>
                        <input
                          type="text"
                          value={
                            editingDevice === 'desktop' ? (selectedElement.block?.height || '420px') :
                            editingDevice === 'tablet' ? (selectedElement.block?.tablet_height || selectedElement.block?.height || '340px') :
                            (selectedElement.block?.mobile_height || '260px')
                          }
                          onChange={(e) => {
                            const fKey = editingDevice === 'desktop' ? 'height' : `${editingDevice}_height`;
                            updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, fKey, e.target.value);
                            setSelectedElement(prev => ({ ...prev, block: { ...prev.block, [fKey]: e.target.value } }));
                          }}
                          className="property-input"
                          placeholder="420px or auto"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Display & Fit */}
                  <div className="property-group">
                    <label className="property-label">Object Fit & Alignment</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <select
                        value={selectedElement.block?.object_fit || 'cover'}
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'object_fit', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, object_fit: e.target.value } }));
                        }}
                        className="property-input"
                      >
                        <option value="cover">Cover (Crop to Fit)</option>
                        <option value="contain">Contain (Full Image)</option>
                        <option value="fill">Fill (Stretch)</option>
                        <option value="none">None (Original Size)</option>
                        <option value="scale-down">Scale Down</option>
                      </select>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        {['left', 'center', 'right'].map(align => (
                          <button
                            key={align}
                            type="button"
                            className={`editor-btn ${selectedElement.block?.align === align ? 'editor-btn-primary' : 'editor-btn-secondary'}`}
                            style={{ flex: 1, padding: '6px', fontSize: '0.75rem', textTransform: 'capitalize' }}
                            onClick={() => {
                              updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'align', align);
                              setSelectedElement(prev => ({ ...prev, block: { ...prev.block, align } }));
                            }}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Corner Radius & Style */}
                  <div className="property-group">
                    <label className="property-label">Corner Radius: {selectedElement.block?.border_radius || '12px'}</label>
                    <input 
                      type="range"
                      min="0"
                      max="40"
                      value={parseInt(selectedElement.block?.border_radius || 12, 10)}
                      onChange={(e) => {
                        const val = `${e.target.value}px`;
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'border_radius', val);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, border_radius: val } }));
                      }}
                      style={{ width: '100%', accentColor: '#38bdf8' }}
                    />
                  </div>

                  {/* Shadow */}
                  <div className="property-group" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#cbd5e1', fontSize: '0.85rem' }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(selectedElement.block?.shadow)}
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'shadow', e.target.checked);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, shadow: e.target.checked } }));
                        }}
                      />
                      <span>Drop Shadow</span>
                    </label>
                  </div>
                </>
              )}

              {/* 5.4 CARD BLOCK */}
              {selectedElement.type === 'card' && (
                <>
                  <div className="property-group">
                    <label className="property-label">Card Title (English)</label>
                    <input 
                      type="text" 
                      value={selectedElement.block?.title_en || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'title_en', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, title_en: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Card Title (German)</label>
                    <input 
                      type="text" 
                      value={selectedElement.block?.title_de || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'title_de', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, title_de: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Card Description (English)</label>
                    <textarea 
                      rows="3"
                      value={selectedElement.block?.desc_en || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'desc_en', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, desc_en: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Card Description (German)</label>
                    <textarea 
                      rows="3"
                      value={selectedElement.block?.desc_de || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'desc_de', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, desc_de: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Card Background Color</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="color" 
                        value={selectedElement.block?.bg || '#faf5fa'}
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'bg', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, bg: e.target.value } }));
                        }}
                        style={{ width: '40px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input 
                        type="text" 
                        value={selectedElement.block?.bg || '#faf5fa'} 
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'bg', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, bg: e.target.value } }));
                        }}
                        className="property-input"
                      />
                    </div>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Corner Radius: {selectedElement.block?.border_radius || '12px'}</label>
                    <input 
                      type="range"
                      min="0"
                      max="30"
                      value={parseInt(selectedElement.block?.border_radius || 12, 10)}
                      onChange={(e) => {
                        const val = `${e.target.value}px`;
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'border_radius', val);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, border_radius: val } }));
                      }}
                      style={{ width: '100%', accentColor: '#38bdf8' }}
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Button Text & Link</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Button Text" 
                        value={selectedElement.block?.button_text || ''} 
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'button_text', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, button_text: e.target.value } }));
                        }}
                        className="property-input"
                      />
                      <input 
                        type="text" 
                        placeholder="/en/Contact/" 
                        value={selectedElement.block?.button_link || ''} 
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'button_link', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, button_link: e.target.value } }));
                        }}
                        className="property-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 5.5 ICON BLOCK */}
              {selectedElement.type === 'icon' && (
                <>
                  <div className="property-group">
                    <label className="property-label">Choose Icon</label>
                    <div className="icon-picker-grid">
                      {['Star', 'Trophy', 'ShieldCheck', 'Award', 'Sparkles', 'Zap', 'Heart', 'Globe2', 'Compass', 'MapPin', 'Clock', 'Users', 'Building2', 'Mail', 'Phone', 'MessageSquareQuote', 'HelpCircle', 'CheckCircle2', 'Play'].map(icName => (
                        <div 
                          key={icName} 
                          className={`icon-picker-item ${(selectedElement.block?.icon || 'Star') === icName ? 'active' : ''}`}
                          onClick={() => {
                            updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'icon', icName);
                            setSelectedElement(prev => ({ ...prev, block: { ...prev.block, icon: icName } }));
                          }}
                          title={icName}
                        >
                          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{icName.slice(0, 3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Icon Color</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="color" 
                        value={selectedElement.block?.color || '#ff0000'}
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'color', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, color: e.target.value } }));
                        }}
                        style={{ width: '40px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input 
                        type="text" 
                        value={selectedElement.block?.color || '#ff0000'} 
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'color', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, color: e.target.value } }));
                        }}
                        className="property-input"
                      />
                    </div>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Icon Background Color</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={selectedElement.block?.bg_color || 'rgba(255, 0, 0, 0.1)'} 
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'bg_color', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, bg_color: e.target.value } }));
                        }}
                        className="property-input"
                      />
                    </div>
                  </div>

                  <div className="property-group">
                    <label className="property-label">Icon Size: {selectedElement.block?.size || 36}px</label>
                    <input 
                      type="range"
                      min="18"
                      max="72"
                      value={selectedElement.block?.size || 36}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'size', val);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, size: val } }));
                      }}
                      style={{ width: '100%', accentColor: '#38bdf8' }}
                    />
                  </div>
                </>
              )}

              {/* 5.6 BADGE BLOCK */}
              {selectedElement.type === 'badge' && (
                <>
                  <div className="property-group">
                    <label className="property-label">Badge Text (English)</label>
                    <input 
                      type="text" 
                      value={selectedElement.block?.text_en || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'text_en', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, text_en: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Badge Text (German)</label>
                    <input 
                      type="text" 
                      value={selectedElement.block?.text_de || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'text_de', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, text_de: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Badge Text Color</label>
                    <input 
                      type="color" 
                      value={selectedElement.block?.text_color || '#ff0000'}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'text_color', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, text_color: e.target.value } }));
                      }}
                      style={{ width: '100%', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    />
                  </div>
                </>
              )}

              {/* 5.7 QUOTE BLOCK */}
              {selectedElement.type === 'quote' && (
                <>
                  <div className="property-group">
                    <label className="property-label">Quote Content</label>
                    <textarea 
                      rows="3"
                      value={selectedElement.block?.quote_en || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'quote_en', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, quote_en: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Author Name & Title</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Author" 
                        value={selectedElement.block?.author || ''}
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'author', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, author: e.target.value } }));
                        }}
                        className="property-input"
                      />
                      <input 
                        type="text" 
                        placeholder="Role / Org" 
                        value={selectedElement.block?.role || ''}
                        onChange={(e) => {
                          updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'role', e.target.value);
                          setSelectedElement(prev => ({ ...prev, block: { ...prev.block, role: e.target.value } }));
                        }}
                        className="property-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 5.8 FEATURE BOX BLOCK */}
              {selectedElement.type === 'feature' && (
                <>
                  <div className="property-group">
                    <label className="property-label">Feature Heading</label>
                    <input 
                      type="text" 
                      value={selectedElement.block?.title_en || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'title_en', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, title_en: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Feature Description</label>
                    <textarea 
                      rows="3"
                      value={selectedElement.block?.desc_en || ''}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'desc_en', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, desc_en: e.target.value } }));
                      }}
                      className="property-input"
                    />
                  </div>
                </>
              )}

              {/* 5.9 VIDEO BLOCK */}
              {selectedElement.type === 'video' && (
                <div className="property-group">
                  <label className="property-label">YouTube / Video Embed URL</label>
                  <input 
                    type="text" 
                    value={selectedElement.block?.video_url || ''}
                    onChange={(e) => {
                      updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'video_url', e.target.value);
                      setSelectedElement(prev => ({ ...prev, block: { ...prev.block, video_url: e.target.value } }));
                    }}
                    className="property-input"
                  />
                </div>
              )}

              {/* 5.10 DIVIDER BLOCK */}
              {selectedElement.type === 'divider' && (
                <>
                  <div className="property-group">
                    <label className="property-label">Divider Thickness: {selectedElement.block?.thickness || 1}px</label>
                    <input 
                      type="range"
                      min="1"
                      max="8"
                      value={selectedElement.block?.thickness || 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'thickness', val);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, thickness: val } }));
                      }}
                      style={{ width: '100%', accentColor: '#38bdf8' }}
                    />
                  </div>

                  <div className="property-group">
                    <label className="property-label">Divider Color</label>
                    <input 
                      type="color" 
                      value={selectedElement.block?.color || '#e2e8f0'}
                      onChange={(e) => {
                        updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'color', e.target.value);
                        setSelectedElement(prev => ({ ...prev, block: { ...prev.block, color: e.target.value } }));
                      }}
                      style={{ width: '100%', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    />
                  </div>
                </>
              )}

              {/* 5.11 SPACER BLOCK */}
              {selectedElement.type === 'spacer' && (
                <div className="property-group">
                  <label className="property-label">Spacer Height: {selectedElement.block?.height || 30}px</label>
                  <input 
                    type="range"
                    min="10"
                    max="160"
                    value={selectedElement.block?.height || 30}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      updateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId, 'height', val);
                      setSelectedElement(prev => ({ ...prev, block: { ...prev.block, height: val } }));
                    }}
                    style={{ width: '100%', accentColor: '#38bdf8' }}
                  />
                </div>
              )}

              {/* Block Actions: Duplicate & Delete */}
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => duplicateBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId)}
                  style={{ width: '100%', padding: '10px', background: '#1e293b', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Copy size={15} />
                  <span>Duplicate This Block</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => removeBlock(selectedElement.sectionId, selectedElement.colId, selectedElement.blockId)}
                  style={{ width: '100%', padding: '10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Trash2 size={15} />
                  <span>Delete This Block</span>
                </button>
              </div>
            </div>
          ) : selectedElement?.colId ? (
            /* ================= 6. COLUMN INSPECTOR ================= */
            <div className="properties-content" style={{ padding: '16px' }}>
              <div className="properties-header" style={{ marginBottom: '16px' }}>
                <div>
                  <span className="properties-title">Column Settings</span>
                  <span className="section-tag-label">{selectedElement.colId}</span>
                </div>
                <button 
                  onClick={() => setSelectedElement(null)} 
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="property-group">
                <label className="property-label">Column Width</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {['25%', '33.333%', '50%', '66.666%', '75%', '100%'].map(w => (
                    <button
                      key={w}
                      type="button"
                      style={{ padding: '8px', background: selectedElement.col?.width === w ? '#38bdf8' : '#1e293b', color: selectedElement.col?.width === w ? '#0f172a' : '#fff', border: '1px solid #334155', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => {
                        updateColumn(selectedElement.sectionId, selectedElement.colId, { width: w });
                        setSelectedElement(prev => ({ ...prev, col: { ...prev.col, width: w } }));
                      }}
                    >
                      {w === '33.333%' ? '33%' : w === '66.666%' ? '66%' : w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="property-group">
                <label className="property-label">Quick Add Block to this Column</label>
                <QuickAddGrid 
                  onSelectElement={(type) => {
                    const item = ALL_LIBRARY_ITEMS.find(i => i.type === type);
                    addBlockToColumn(selectedElement.sectionId, selectedElement.colId, type, item?.defaultProps || {});
                  }} 
                />
              </div>
            </div>
          ) : selectedSection ? (
            /* ================= 7. SECTION INSPECTOR ================= */
            <>
              <div className="properties-header" style={{ padding: '14px 16px', margin: 0, flexShrink: 0, background: '#0f172a' }}>
                <span className="properties-title">{selectedSection.name || 'Section Settings'}</span>
                <span className="section-tag-label">{selectedSection.id}</span>
              </div>

              {/* Tabs */}
              <div className="properties-tabs" style={{ flexShrink: 0, position: 'sticky', top: 0, zIndex: 10 }}>
                <button 
                  className={`properties-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
                  onClick={() => setActiveTab('content')}
                >
                  Content
                </button>
                <button 
                  className={`properties-tab-btn ${activeTab === 'style' ? 'active' : ''}`}
                  onClick={() => setActiveTab('style')}
                >
                  Style
                </button>
                <button 
                  className={`properties-tab-btn ${activeTab === 'spacing' ? 'active' : ''}`}
                  onClick={() => setActiveTab('spacing')}
                >
                  Spacing
                </button>
                <button 
                  className={`properties-tab-btn ${activeTab === 'animation' ? 'active' : ''}`}
                  onClick={() => setActiveTab('animation')}
                >
                  Motion
                </button>
                <button 
                  className={`properties-tab-btn ${activeTab === 'visibility' ? 'active' : ''}`}
                  onClick={() => setActiveTab('visibility')}
                >
                  Manage
                </button>
              </div>

              {/* Tab Contents */}
              <div className="properties-content" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px' }}>
                {/* 1. CONTENT TAB */}
                {activeTab === 'content' && (
                  <>
                    <div className="property-group">
                      <label className="property-label">Section Name</label>
                      <input 
                        type="text" 
                        value={selectedSection.name || ''} 
                        onChange={(e) => updateSectionField(selectedSection.id, 'name', e.target.value)}
                        className="property-input"
                      />
                    </div>

                    {/* Headings */}
                    {(selectedSection.title_en !== undefined || selectedSection.heading_prefix_en !== undefined) && (
                      <>
                        <div className="property-group">
                          <label className="property-label">Main Heading (English)</label>
                          <input 
                            type="text" 
                            value={selectedSection.title_en || selectedSection.heading_prefix_en || ''} 
                            onChange={(e) => {
                              if (selectedSection.heading_prefix_en !== undefined) {
                                updateSectionField(selectedSection.id, 'heading_prefix_en', e.target.value);
                              } else {
                                updateSectionField(selectedSection.id, 'title_en', e.target.value);
                              }
                            }}
                            className="property-input"
                          />
                        </div>

                        <div className="property-group">
                          <label className="property-label">Main Heading (German)</label>
                          <input 
                            type="text" 
                            value={selectedSection.title_de || selectedSection.heading_prefix_de || ''} 
                            onChange={(e) => {
                              if (selectedSection.heading_prefix_de !== undefined) {
                                updateSectionField(selectedSection.id, 'heading_prefix_de', e.target.value);
                              } else {
                                updateSectionField(selectedSection.id, 'title_de', e.target.value);
                              }
                            }}
                            className="property-input"
                          />
                        </div>
                      </>
                    )}

                    {/* Subtitles */}
                    {selectedSection.subtitle_en !== undefined && (
                      <div className="property-group">
                        <label className="property-label">Subtitle (English)</label>
                        <textarea 
                          rows="3"
                          value={selectedSection.subtitle_en || ''} 
                          onChange={(e) => updateSectionField(selectedSection.id, 'subtitle_en', e.target.value)}
                          className="property-input"
                        />
                      </div>
                    )}

                    {/* Background Image */}
                    {selectedSection.bg_image !== undefined && (
                      <ImagePickerField
                        label="Section Background Image"
                        value={selectedSection.bg_image || ''}
                        onUrlChange={(url) => updateSectionField(selectedSection.id, 'bg_image', url)}
                        onOpenMediaLibrary={() => {
                          triggerMediaPicker((url) => updateSectionField(selectedSection.id, 'bg_image', url));
                        }}
                        onRemove={() => updateSectionField(selectedSection.id, 'bg_image', '')}
                        previewHeight={120}
                        showAltField={false}
                      />
                    )}

                    {/* Video URL — shown when section has a video_url field (e.g. service_hero_video) */}
                    {selectedSection.video_url !== undefined && (
                      <div className="property-group">
                        <label className="property-label">🎬 YouTube Video URL</label>
                        <input
                          type="text"
                          value={selectedSection.video_url || ''}
                          onChange={(e) => {
                            const parsed = parseYouTubeUrl(e.target.value);
                            const embedUrl = parsed.isYouTube ? parsed.embedUrl + '?controls=1' : e.target.value;
                            updateSectionField(selectedSection.id, 'video_url', embedUrl);
                          }}
                          className="property-input"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <p style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                          Paste a YouTube URL or embed URL — it will be auto-converted.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* 2. STYLE TAB */}
                {activeTab === 'style' && (
                  <>
                    <ImagePickerField
                      label="Section Background Image"
                      value={selectedSection.bg_image || ''}
                      onUrlChange={(url) => updateSectionField(selectedSection.id, 'bg_image', url)}
                      onOpenMediaLibrary={() => {
                        triggerMediaPicker((url) => updateSectionField(selectedSection.id, 'bg_image', url));
                      }}
                      onRemove={() => updateSectionField(selectedSection.id, 'bg_image', '')}
                      previewHeight={120}
                      showAltField={false}
                    />

                    <div className="property-group">
                      <label className="property-label">Section Background Color</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input 
                          type="color" 
                          value={selectedSection.bg_color || '#ffffff'}
                          onChange={(e) => updateSectionField(selectedSection.id, 'bg_color', e.target.value)}
                          style={{ width: '40px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        />
                        <input 
                          type="text" 
                          value={selectedSection.bg_color || '#ffffff'}
                          onChange={(e) => updateSectionField(selectedSection.id, 'bg_color', e.target.value)}
                          className="property-input"
                        />
                      </div>
                    </div>

                    <div className="property-group">
                      <label className="property-label">Heading Color Override</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input 
                          type="color" 
                          value={selectedSection.heading_color || '#1f242d'}
                          onChange={(e) => updateSectionField(selectedSection.id, 'heading_color', e.target.value)}
                          style={{ width: '40px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        />
                        <input 
                          type="text" 
                          value={selectedSection.heading_color || '#1f242d'}
                          onChange={(e) => updateSectionField(selectedSection.id, 'heading_color', e.target.value)}
                          className="property-input"
                        />
                      </div>
                    </div>

                    <div className="property-group">
                      <label className="property-label">Body Text Color</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input 
                          type="color" 
                          value={selectedSection.text_color || '#555555'}
                          onChange={(e) => updateSectionField(selectedSection.id, 'text_color', e.target.value)}
                          style={{ width: '40px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        />
                        <input 
                          type="text" 
                          value={selectedSection.text_color || '#555555'}
                          onChange={(e) => updateSectionField(selectedSection.id, 'text_color', e.target.value)}
                          className="property-input"
                        />
                      </div>
                    </div>

                    <div className="property-group">
                      <label className="property-label">Border Width: {selectedSection.border_width || 0}px</label>
                      <input 
                        type="range"
                        min="0"
                        max="20"
                        value={selectedSection.border_width || 0}
                        onChange={(e) => updateSectionField(selectedSection.id, 'border_width', parseInt(e.target.value))}
                        className="property-slider"
                      />
                    </div>

                    {(selectedSection.border_width > 0) && (
                      <>
                        <div className="property-group">
                          <label className="property-label">Border Color</label>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input 
                              type="color" 
                              value={selectedSection.border_color || '#e2e8f0'}
                              onChange={(e) => updateSectionField(selectedSection.id, 'border_color', e.target.value)}
                              style={{ width: '40px', height: '36px', padding: 0, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            />
                            <input 
                              type="text" 
                              value={selectedSection.border_color || '#e2e8f0'}
                              onChange={(e) => updateSectionField(selectedSection.id, 'border_color', e.target.value)}
                              className="property-input"
                            />
                          </div>
                        </div>

                        <div className="property-group">
                          <label className="property-label">Border Style</label>
                          <select 
                            value={selectedSection.border_style || 'solid'}
                            onChange={(e) => updateSectionField(selectedSection.id, 'border_style', e.target.value)}
                            className="property-input"
                          >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="property-group">
                      <label className="property-label">Corner Radius: {selectedSection.border_radius || 0}px</label>
                      <input 
                        type="range"
                        min="0"
                        max="40"
                        value={selectedSection.border_radius || 0}
                        onChange={(e) => updateSectionField(selectedSection.id, 'border_radius', parseInt(e.target.value))}
                        className="property-slider"
                      />
                    </div>

                    <div className="property-group">
                      <label className="property-label">Box Shadow</label>
                      <select 
                        value={selectedSection.shadow || ''}
                        onChange={(e) => updateSectionField(selectedSection.id, 'shadow', e.target.value)}
                        className="property-input"
                      >
                        <option value="">None</option>
                        <option value="0 4px 6px -1px rgba(0,0,0,0.1)">Subtle Shadow</option>
                        <option value="0 10px 15px -3px rgba(0,0,0,0.1)">Medium Shadow</option>
                        <option value="0 20px 25px -5px rgba(0,0,0,0.15)">Large Elevation</option>
                        <option value="0 0 20px rgba(56,189,248,0.2)">Cyan Glow</option>
                      </select>
                    </div>

                    <div className="property-group">
                      <label className="property-label">Opacity: {selectedSection.opacity !== undefined ? selectedSection.opacity : 1}</label>
                      <input 
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={selectedSection.opacity !== undefined ? selectedSection.opacity : 1}
                        onChange={(e) => updateSectionField(selectedSection.id, 'opacity', parseFloat(e.target.value))}
                        className="property-slider"
                      />
                    </div>
                  </>
                )}

                {/* 3. SPACING TAB */}
                {activeTab === 'spacing' && (
                  <>
                    {/* Viewport Selection */}
                    <div className="property-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="property-label" style={{ margin: 0 }}>Responsive Breakpoint</label>
                        <div className="responsive-mini-pills">
                          {['desktop', 'tablet', 'mobile'].map(dev => (
                            <button
                              key={dev}
                              type="button"
                              className={`mini-pill-btn ${editingDevice === dev ? 'active' : ''}`}
                              onClick={() => setEditingDevice(dev)}
                            >
                              {dev === 'desktop' ? '🖥️ Desktop' : dev === 'tablet' ? '📱 Tablet' : '📲 Mobile'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Padding Group */}
                    <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #334155' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', display: 'block', marginBottom: '10px' }}>
                        Padding ({editingDevice.toUpperCase()})
                      </span>
                      
                      <div className="property-group" style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label className="property-sub-label" style={{ margin: 0 }}>Padding Top</label>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            {getResponsiveValue(selectedSection, 'padding_top', editingDevice, selectedSection.padding_top !== undefined ? selectedSection.padding_top : 60)}px
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input 
                            type="range" 
                            min="0" 
                            max="240" 
                            step="1"
                            value={Number(getResponsiveValue(selectedSection, 'padding_top', editingDevice, selectedSection.padding_top !== undefined ? selectedSection.padding_top : 60)) || 0}
                            onChange={(e) => updateSectionResponsive(selectedSection.id, 'padding_top', parseInt(e.target.value) || 0, editingDevice)}
                            className="property-slider"
                            style={{ flex: 1 }}
                          />
                          <input 
                            type="number" 
                            min="0" 
                            max="240" 
                            value={Number(getResponsiveValue(selectedSection, 'padding_top', editingDevice, selectedSection.padding_top !== undefined ? selectedSection.padding_top : 60)) || 0}
                            onChange={(e) => updateSectionResponsive(selectedSection.id, 'padding_top', parseInt(e.target.value) || 0, editingDevice)}
                            className="property-input"
                            style={{ width: '65px', padding: '4px 6px', textAlign: 'center' }}
                          />
                        </div>
                      </div>

                      <div className="property-group" style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label className="property-sub-label" style={{ margin: 0 }}>Padding Bottom</label>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            {getResponsiveValue(selectedSection, 'padding_bottom', editingDevice, selectedSection.padding_bottom !== undefined ? selectedSection.padding_bottom : 60)}px
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input 
                            type="range" 
                            min="0" 
                            max="240" 
                            step="1"
                            value={Number(getResponsiveValue(selectedSection, 'padding_bottom', editingDevice, selectedSection.padding_bottom !== undefined ? selectedSection.padding_bottom : 60)) || 0}
                            onChange={(e) => updateSectionResponsive(selectedSection.id, 'padding_bottom', parseInt(e.target.value) || 0, editingDevice)}
                            className="property-slider"
                            style={{ flex: 1 }}
                          />
                          <input 
                            type="number" 
                            min="0" 
                            max="240" 
                            value={Number(getResponsiveValue(selectedSection, 'padding_bottom', editingDevice, selectedSection.padding_bottom !== undefined ? selectedSection.padding_bottom : 60)) || 0}
                            onChange={(e) => updateSectionResponsive(selectedSection.id, 'padding_bottom', parseInt(e.target.value) || 0, editingDevice)}
                            className="property-input"
                            style={{ width: '65px', padding: '4px 6px', textAlign: 'center' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label className="property-sub-label">Padding Left</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="160"
                            value={getResponsiveValue(selectedSection, 'padding_left', editingDevice, selectedSection.padding_left || 0)}
                            onChange={(e) => updateSectionResponsive(selectedSection.id, 'padding_left', parseInt(e.target.value) || 0, editingDevice)}
                            className="property-input"
                            placeholder="0px"
                          />
                        </div>
                        <div>
                          <label className="property-sub-label">Padding Right</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="160"
                            value={getResponsiveValue(selectedSection, 'padding_right', editingDevice, selectedSection.padding_right || 0)}
                            onChange={(e) => updateSectionResponsive(selectedSection.id, 'padding_right', parseInt(e.target.value) || 0, editingDevice)}
                            className="property-input"
                            placeholder="0px"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Margin Group */}
                    <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #334155' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', display: 'block', marginBottom: '10px' }}>
                        Margin ({editingDevice.toUpperCase()})
                      </span>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                        <div>
                          <label className="property-sub-label">Margin Top</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="200"
                            value={getResponsiveValue(selectedSection, 'margin_top', editingDevice, selectedSection.margin_top || 0)}
                            onChange={(e) => updateSectionResponsive(selectedSection.id, 'margin_top', parseInt(e.target.value) || 0, editingDevice)}
                            className="property-input"
                            placeholder="0px"
                          />
                        </div>
                        <div>
                          <label className="property-sub-label">Margin Bottom</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="200"
                            value={getResponsiveValue(selectedSection, 'margin_bottom', editingDevice, selectedSection.margin_bottom || 0)}
                            onChange={(e) => updateSectionResponsive(selectedSection.id, 'margin_bottom', parseInt(e.target.value) || 0, editingDevice)}
                            className="property-input"
                            placeholder="0px"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label className="property-sub-label">Margin Left</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="120"
                            value={getResponsiveValue(selectedSection, 'margin_left', editingDevice, selectedSection.margin_left || 0)}
                            onChange={(e) => updateSectionResponsive(selectedSection.id, 'margin_left', parseInt(e.target.value) || 0, editingDevice)}
                            className="property-input"
                            placeholder="0px"
                          />
                        </div>
                        <div>
                          <label className="property-sub-label">Margin Right</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="120"
                            value={getResponsiveValue(selectedSection, 'margin_right', editingDevice, selectedSection.margin_right || 0)}
                            onChange={(e) => updateSectionResponsive(selectedSection.id, 'margin_right', parseInt(e.target.value) || 0, editingDevice)}
                            className="property-input"
                            placeholder="0px"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Min Height */}
                    <div className="property-group">
                      <label className="property-label">Minimum Height (px)</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="1200" 
                        step="10"
                        value={getResponsiveValue(selectedSection, 'min_height', editingDevice, selectedSection.min_height || '')}
                        onChange={(e) => updateSectionResponsive(selectedSection.id, 'min_height', e.target.value ? parseInt(e.target.value) : '', editingDevice)}
                        className="property-input"
                        placeholder="e.g. 500"
                      />
                    </div>
                  </>
                )}

                {/* 4. MOTION & ANIMATION TAB */}
                {activeTab === 'animation' && (
                  <>
                    <div className="property-group">
                      <label className="property-label">Entrance Animation Direction</label>
                      <select 
                        value={selectedSection.animation?.type || 'up'}
                        onChange={(e) => updateSectionAnimation(selectedSection.id, 'type', e.target.value)}
                        className="property-input"
                      >
                        <option value="up">Fade Up (Bottom to Top)</option>
                        <option value="down">Fade Down (Top to Bottom)</option>
                        <option value="left">Slide from Right</option>
                        <option value="right">Slide from Left</option>
                        <option value="fade">Pure Fade In</option>
                        <option value="zoom">Zoom Scale In</option>
                      </select>
                    </div>

                    <div className="property-group">
                      <label className="property-label">Duration: {selectedSection.animation?.duration || 0.55}s</label>
                      <input 
                        type="range" 
                        min="0.2" 
                        max="2.5" 
                        step="0.05"
                        value={selectedSection.animation?.duration || 0.55}
                        onChange={(e) => updateSectionAnimation(selectedSection.id, 'duration', parseFloat(e.target.value))}
                        className="property-slider"
                      />
                    </div>

                    <div className="property-group">
                      <label className="property-label">Delay: {selectedSection.animation?.delay || 0.1}s</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="1.5" 
                        step="0.05"
                        value={selectedSection.animation?.delay !== undefined ? selectedSection.animation.delay : 0.1}
                        onChange={(e) => updateSectionAnimation(selectedSection.id, 'delay', parseFloat(e.target.value))}
                        className="property-slider"
                      />
                    </div>

                    <div className="property-group">
                      <label className="property-label">Animation Easing</label>
                      <select 
                        value={selectedSection.animation?.easing || 'easeOut'}
                        onChange={(e) => updateSectionAnimation(selectedSection.id, 'easing', e.target.value)}
                        className="property-input"
                      >
                        <option value="easeOut">Smooth Ease Out</option>
                        <option value="easeInOut">Ease In Out</option>
                        <option value="linear">Linear</option>
                        <option value="spring">Bouncy Spring</option>
                      </select>
                    </div>
                  </>
                )}

                {/* 5. VISIBILITY & MANAGEMENT TAB */}
                {activeTab === 'visibility' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button 
                      type="button" 
                      onClick={() => toggleSectionVisibility(selectedSection.id)}
                      className={`btn-action-wide ${selectedSection.enabled !== false ? 'btn-enabled' : 'btn-disabled'}`}
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: selectedSection.enabled !== false ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: selectedSection.enabled !== false ? '#10b981' : '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      {selectedSection.enabled !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                      <span>{selectedSection.enabled !== false ? 'Section is Visible on Public Site' : 'Section is Hidden'}</span>
                    </button>

                    <button 
                      type="button" 
                      onClick={() => duplicateSection(selectedSection.id)}
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      <Copy size={16} />
                      <span>Duplicate Section</span>
                    </button>

                    <button 
                      type="button" 
                      onClick={() => deleteSection(selectedSection.id)}
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                      <span>Delete Section</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: '#94a3b8' }}>
              <p>Select any section, button, column, image, or text on the canvas to inspect and edit its properties.</p>
            </div>
          )}
        </aside>
      </div>

      {/* ================= 8. MOBILE FLOATING DOCK ================= */}
      <nav className="builder-mobile-bottom-bar">
        <button 
          type="button" 
          className={`mobile-dock-btn ${mobileDrawer === 'library' ? 'active' : ''}`}
          onClick={() => {
            setActiveLibraryTab('all');
            setMobileDrawer(mobileDrawer === 'library' ? null : 'library');
          }}
        >
          <Plus size={18} />
          <span>Components</span>
        </button>
        <button 
          type="button" 
          className={`mobile-dock-btn ${mobileDrawer === 'layers' ? 'active' : ''}`}
          onClick={() => {
            setActiveLibraryTab('layers');
            setMobileDrawer(mobileDrawer === 'layers' ? null : 'layers');
          }}
        >
          <Layers size={18} />
          <span>Layers</span>
        </button>
        <button 
          type="button" 
          className={`mobile-dock-btn ${mobileDrawer === 'properties' ? 'active' : ''}`}
          onClick={() => setMobileDrawer(mobileDrawer === 'properties' ? null : 'properties')}
        >
          <Sliders size={18} />
          <span>Properties</span>
        </button>
        <button 
          type="button" 
          className={`mobile-dock-btn ${isPreviewMode ? 'active' : ''}`}
          onClick={() => setIsPreviewMode(!isPreviewMode)}
        >
          <Eye size={18} />
          <span>{isPreviewMode ? 'Edit Mode' : 'Preview'}</span>
        </button>
      </nav>

      {/* Mobile Drawer Backdrops & Modals */}
      <AnimatePresence>
        {mobileDrawer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="builder-drawer-backdrop"
            onClick={() => setMobileDrawer(null)}
          >
            {mobileDrawer === 'library' && (
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="builder-mobile-drawer drawer-left"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sidebar-header-row">
                  <div className="sidebar-title">
                    <Plus size={16} color="#38bdf8" />
                    <span>Add to Page</span>
                  </div>
                  <button type="button" className="sidebar-toggle-btn" onClick={() => setMobileDrawer(null)}>
                    <X size={16} />
                  </button>
                </div>
                <div className="library-search-box" style={{ padding: '8px 12px' }}>
                  <input 
                    type="text" 
                    placeholder="Search components..." 
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    className="library-search-input"
                  />
                </div>

                <div className="library-category-chips">
                  {['all', 'basic', 'layout', 'content', 'website'].map((cat) => (
                    <button 
                      key={cat}
                      type="button" 
                      className={`library-category-chip ${activeLibraryTab === cat ? 'active' : ''}`}
                      onClick={() => setActiveLibraryTab(cat)}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="library-list-container">
                  <div className="library-grid-cards">
                    {filteredLibraryItems.length === 0 ? (
                      <div className="library-empty-search-state" style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8' }}>
                        <p style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>No components found</p>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Try another category or search term.</span>
                      </div>
                    ) : (
                      filteredLibraryItems.map((item) => (
                        <div 
                          key={`m_${item.category}_${item.type}`}
                          className="visual-component-card"
                          onClick={() => {
                            handleAddLibraryItem(item);
                            setMobileDrawer(null);
                          }}
                        >
                          <div className="card-mockup-frame">{renderComponentMockup(item)}</div>
                          <div className="card-details-box">
                            <span className="card-name-title">{item.name}</span>
                            <span className="card-desc-text">{item.desc}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {mobileDrawer === 'properties' && (
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="builder-mobile-drawer drawer-bottom"
                onClick={(e) => e.stopPropagation()}
                style={{ padding: '16px', maxHeight: '75vh', overflowY: 'auto' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {selectedElement ? `Edit ${selectedElement.type || 'Element'}` : 'Properties'}
                  </span>
                  <button type="button" className="builder-btn-primary" onClick={() => setMobileDrawer(null)} style={{ height: '30px', padding: '0 12px' }}>
                    Done
                  </button>
                </div>
                {!selectedElement ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', margin: '20px 0' }}>Tap any element on canvas to customize.</p>
                ) : (
                  <p style={{ color: '#a7f3d0', fontSize: '0.82rem' }}>Selected: {selectedElement.type} ({selectedElement.fieldPrefix || selectedElement.blockId || ''})</p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 1: CREATE NEW PAGE WIZARD ================= */}
      <AnimatePresence>
        {newPageModalOpen && (
          <div className="builder-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="builder-modal-card"
              style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div className="builder-modal-header">
                <div>
                  <h3 className="builder-modal-title">Create New Website Page</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    Visually generate a new route and dynamic page with custom starting layout.
                  </p>
                </div>
                <button 
                  onClick={() => setNewPageModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreatePageSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Step 1: Page Name */}
                <div>
                  <label style={{ display: 'block', color: '#f8fafc', fontWeight: 600, marginBottom: '8px', fontSize: '0.95rem' }}>
                    1. Page Name *
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Doctors, Training Camps, MICE Packages" 
                    value={newPageForm.name}
                    onChange={(e) => handleNewPageNameChange(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                  />
                </div>

                {/* Step 2: URL Slug */}
                <div>
                  <label style={{ display: 'block', color: '#f8fafc', fontWeight: 600, marginBottom: '8px', fontSize: '0.95rem' }}>
                    2. URL Route / Slug *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '0 12px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: 600 }}>/</span>
                    <input 
                      type="text" 
                      placeholder="doctors" 
                      value={newPageForm.slug}
                      onChange={(e) => setNewPageForm(prev => ({ ...prev, slug: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '12px 6px', background: 'transparent', border: 'none', color: '#38bdf8', fontWeight: 600, fontSize: '1rem', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Step 3: Choose Starting Layout */}
                <div>
                  <label style={{ display: 'block', color: '#f8fafc', fontWeight: 600, marginBottom: '8px', fontSize: '0.95rem' }}>
                    3. Choose Starting Layout Template
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { id: 'hero_content', label: 'Hero + 2-Col Content', desc: 'Hero banner and split text/image row' },
                      { id: 'two_column', label: 'Two Column Showcase', desc: 'Side-by-side equal columns' },
                      { id: 'three_column', label: 'Three Column Grid', desc: '3 cards highlighting features' },
                      { id: 'team', label: 'Doctors / Team Page', desc: 'Founder story, team & reviews' },
                      { id: 'services', label: 'Services Page', desc: 'Hero + Services grid + CTA' },
                      { id: 'gallery', label: 'Gallery / Tours', desc: 'Inspection tours and destinations' },
                      { id: 'faq_contact', label: 'FAQ + Contact Form', desc: 'Accordion questions and form' },
                      { id: 'blank', label: 'Blank Page', desc: 'Clean starting canvas with hero' }
                    ].map(tpl => (
                      <div 
                        key={tpl.id}
                        onClick={() => setNewPageForm(prev => ({ ...prev, layout: tpl.id }))}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: newPageForm.layout === tpl.id ? '2px solid #38bdf8' : '1px solid #334155',
                          background: newPageForm.layout === tpl.id ? 'rgba(56, 189, 248, 0.12)' : '#0f172a',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontWeight: 700, color: newPageForm.layout === tpl.id ? '#38bdf8' : '#fff', fontSize: '0.9rem', marginBottom: '4px' }}>
                          {tpl.label}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{tpl.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 4: Navigation Bar & Publishing Options */}
                <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={newPageForm.addToNav} 
                      onChange={(e) => setNewPageForm(prev => ({ ...prev, addToNav: e.target.checked }))} 
                      style={{ width: '18px', height: '18px', accentColor: '#ff0000' }}
                    />
                    <span>Automatically add this page to Header Navbar</span>
                  </label>

                  {newPageForm.addToNav && (
                    <div style={{ paddingLeft: '28px' }}>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Navbar Link Label:</label>
                      <input 
                        type="text" 
                        value={newPageForm.navLabel} 
                        onChange={(e) => setNewPageForm(prev => ({ ...prev, navLabel: e.target.value }))}
                        placeholder={newPageForm.name || 'Navbar Label'}
                        style={{ width: '100%', padding: '8px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                  )}

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={newPageForm.isPublished} 
                      onChange={(e) => setNewPageForm(prev => ({ ...prev, isPublished: e.target.checked }))} 
                      style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
                    />
                    <span>Publish immediately (Make accessible to public visitors)</span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                  <button 
                    type="button" 
                    onClick={() => setNewPageModalOpen(false)}
                    style={{ padding: '10px 20px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-publish-confirm"
                    style={{ padding: '10px 24px', background: '#ff0000', color: '#fff', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                  >
                    Create Page & Launch Visual Editor
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: ALL PAGES & ROUTES MANAGER ================= */}
      <AnimatePresence>
        {pagesListModalOpen && (
          <div className="builder-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="builder-modal-card"
              style={{ maxWidth: '680px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="builder-modal-header">
                <div>
                  <h3 className="builder-modal-title">Website Pages & Custom Routes ({allPagesList.length})</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    View, switch to, edit, or delete any page route in your website.
                  </p>
                </div>
                <button onClick={() => setPagesListModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {allPagesList.map(p => {
                  const isCore = ['home', 'service', 'about', 'hotels', 'contact', 'imprint'].includes(p.id);
                  const isCurrent = activePage === p.id;
                  const isLinkedToNav = (cmsConfig?.header?.nav_items || []).some(n => {
                    const cleanP = (n.path || '').replace(/^\/+|\/+$/g, '').replace(/^en\//i, '');
                    return cleanP === p.slug || cleanP === p.id;
                  });

                  return (
                    <div 
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: isCurrent ? 'rgba(56, 189, 248, 0.1)' : '#1e293b',
                        border: isCurrent ? '1px solid #38bdf8' : '1px solid #334155',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: isCore ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FileText size={18} color={isCore ? '#60a5fa' : '#f87171'} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{p.label}</span>
                            {isCurrent && <span style={{ fontSize: '0.72rem', background: '#38bdf8', color: '#0f172a', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>Active</span>}
                            {isCore && <span style={{ fontSize: '0.72rem', background: '#334155', color: '#94a3b8', padding: '2px 6px', borderRadius: '4px' }}>Core</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>/{p.slug}</span>
                            <span style={{ color: '#64748b' }}>•</span>
                            <span style={{ color: isLinkedToNav ? '#10b981' : '#f59e0b', fontSize: '0.78rem' }}>
                              {isLinkedToNav ? 'In Navbar' : 'Not in Navbar'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setActivePage(p.id);
                            setSelectedElement(null);
                            setPagesListModalOpen(false);
                          }}
                          style={{
                            padding: '6px 12px',
                            background: isCurrent ? '#38bdf8' : '#334155',
                            color: isCurrent ? '#0f172a' : '#fff',
                            fontWeight: 600,
                            fontSize: '0.82rem',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {isCurrent ? 'Editing' : 'Open in Studio'}
                        </button>

                        <button
                          type="button"
                          onClick={() => duplicatePage(p.id)}
                          title="Duplicate Page"
                          style={{ padding: '6px 8px', background: '#334155', color: '#94a3b8', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                        >
                          <Copy size={14} />
                        </button>

                        {!isCore && (
                          <button
                            type="button"
                            onClick={() => {
                              deletePage(p.id);
                            }}
                            title="Delete this page and its route"
                            style={{
                              padding: '6px 10px',
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.82rem',
                              fontWeight: 600
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '16px 24px', background: '#0f172a', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setPagesListModalOpen(false);
                    setNewPageModalOpen(true);
                  }}
                  className="btn-publish-now"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}
                >
                  <Plus size={15} />
                  <span>+ Create New Page</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPagesListModalOpen(false)}
                  style={{ padding: '8px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 2: PAGE SETTINGS & SEO ================= */}
      <AnimatePresence>
        {pageSettingsModalOpen && (
          <div className="builder-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="builder-modal-card"
              style={{ maxWidth: '560px', width: '100%' }}
            >
              <div className="builder-modal-header">
                <div>
                  <h3 className="builder-modal-title">Page Settings & SEO: {activePage.toUpperCase()}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    Configure search title, meta description, and page visibility.
                  </p>
                </div>
                <button onClick={() => setPageSettingsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleSavePageSettings} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '6px' }}>Page Title</label>
                  <input 
                    type="text" 
                    value={pageSettingsForm.title} 
                    onChange={(e) => setPageSettingsForm(prev => ({ ...prev, title: e.target.value }))}
                    className="property-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '6px' }}>SEO Browser Title</label>
                  <input 
                    type="text" 
                    value={pageSettingsForm.seo_title} 
                    onChange={(e) => setPageSettingsForm(prev => ({ ...prev, seo_title: e.target.value }))}
                    className="property-input"
                    placeholder="Title appearing on Google and browser tab"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '6px' }}>SEO Meta Description</label>
                  <textarea 
                    rows="3"
                    value={pageSettingsForm.seo_description} 
                    onChange={(e) => setPageSettingsForm(prev => ({ ...prev, seo_description: e.target.value }))}
                    className="property-input"
                    placeholder="Short summary for search results"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0f172a', padding: '12px', borderRadius: '8px' }}>
                  <input 
                    type="checkbox" 
                    checked={pageSettingsForm.enabled} 
                    onChange={(e) => setPageSettingsForm(prev => ({ ...prev, enabled: e.target.checked }))}
                    style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
                  />
                  <span style={{ color: '#fff', fontSize: '0.9rem' }}>Page is Enabled & Published</span>
                </div>

                {/* Page Duplication & Delete Actions */}
                <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', borderTop: '1px solid #334155' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      duplicatePage(activePage);
                      setPageSettingsModalOpen(false);
                    }}
                    style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Copy size={15} />
                    <span>Duplicate Page</span>
                  </button>

                  {!['home', 'service', 'about', 'hotels', 'contact', 'imprint'].includes(activePage) && (
                    <button 
                      type="button" 
                      onClick={() => {
                        deletePage(activePage);
                        setPageSettingsModalOpen(false);
                      }}
                      style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Trash2 size={15} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setPageSettingsModalOpen(false)} style={{ padding: '10px 18px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '10px 22px', background: '#38bdf8', color: '#0f172a', fontWeight: 700, borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Save Settings</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 3: NAVBAR ITEMS & SUBMENU MANAGER ================= */}
      <AnimatePresence>
        {navModalOpen && (
          <div className="builder-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="builder-modal-card"
              style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div className="builder-modal-header">
                <div>
                  <h3 className="builder-modal-title">Header Navigation & Submenus</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    Add new items, configure dropdowns, and link pages to the navbar.
                  </p>
                </div>
                <button onClick={() => setNavModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Add New Item Form */}
                <form onSubmit={handleAddNavItemSubmit} style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>+ Add Navigation Link / Submenu Item</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '4px' }}>Label (English) *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Doctors" 
                        value={newNavItemForm.name_en}
                        onChange={(e) => setNewNavItemForm(prev => ({ ...prev, name_en: e.target.value }))}
                        required
                        className="property-input"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '4px' }}>Path / URL *</label>
                      <input 
                        type="text" 
                        placeholder="/doctors" 
                        value={newNavItemForm.path}
                        onChange={(e) => setNewNavItemForm(prev => ({ ...prev, path: e.target.value }))}
                        required
                        className="property-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '4px' }}>Parent Dropdown (Optional)</label>
                    <select 
                      value={newNavItemForm.parent_id}
                      onChange={(e) => setNewNavItemForm(prev => ({ ...prev, parent_id: e.target.value }))}
                      className="property-input"
                    >
                      <option value="">None (Top Level Item)</option>
                      {navItemsList.map(item => (
                        <option key={item.id} value={item.id}>
                          Under: {item.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    style={{ padding: '8px 16px', alignSelf: 'flex-start', background: '#ff0000', color: '#fff', fontWeight: 700, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Add to Navbar
                  </button>
                </form>

                {/* Existing Nav Items List */}
                <div>
                  <span style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '10px' }}>Current Navigation Bar Items:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItemsList.map((item, idx) => (
                      <div key={item.id || idx} style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, color: '#fff' }}>{item.name_en}</span>
                            <span style={{ color: '#38bdf8', fontSize: '0.85rem' }}>({item.path})</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => deleteNavItem(item.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                            title="Delete Item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {/* Submenu items if present */}
                        {(item.children || item.sub_items) && (item.children || item.sub_items).length > 0 && (
                          <div style={{ marginTop: '8px', paddingLeft: '16px', borderLeft: '2px solid #38bdf8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {(item.children || item.sub_items).map(child => (
                              <div key={child.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
                                <span>↳ {child.name_en} ({child.path})</span>
                                <button 
                                  type="button" 
                                  onClick={() => deleteNavItem(child.id)}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button 
                    type="button" 
                    onClick={() => setNavModalOpen(false)}
                    style={{ padding: '10px 24px', background: '#38bdf8', color: '#0f172a', fontWeight: 700, borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 4: PUBLISH CONFIRMATION ================= */}
      <AnimatePresence>
        {publishModalOpen && (
          <div className="builder-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="builder-modal-card"
            >
              <div className="builder-modal-header">
                <h3 className="builder-modal-title">Publish Changes?</h3>
                <button 
                  className="builder-modal-close"
                  onClick={() => setPublishModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="builder-modal-body">
                <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '14px' }}>
                  You are about to make the current draft visible on the live website.
                </p>
                <div className="publish-summary-card">
                  <div className="summary-row">
                    <span>Active Page:</span>
                    <strong>{activePage.toUpperCase()} (/{cmsConfig?.pages?.[activePage]?.slug || activePage})</strong>
                  </div>
                  <div className="summary-row">
                    <span>Draft Status:</span>
                    <strong style={{ color: '#38bdf8' }}>Ready to publish live</strong>
                  </div>
                  <div className="summary-row">
                    <span>Publish Safety:</span>
                    <strong>Atomic & Transaction Safe</strong>
                  </div>
                </div>
              </div>

              <div className="builder-modal-footer">
                <button 
                  className="builder-modal-btn btn-cancel"
                  onClick={() => setPublishModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="builder-modal-btn btn-publish-confirm"
                  onClick={handlePublish}
                >
                  <Send size={15} />
                  <span>Publish</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 5: MEDIA LIBRARY PICKER ================= */}
      <AnimatePresence>
        {mediaPickerOpen && (
          <div className="builder-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="builder-modal-card media-library-modal"
              style={{ maxWidth: '840px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="builder-modal-header">
                <div>
                  <h3 className="builder-modal-title">Select Image</h3>
                  <span className="builder-modal-subtitle">Choose an existing media asset or upload a new picture</span>
                </div>
                <button 
                  className="builder-modal-close"
                  onClick={() => {
                    setMediaPickerOpen(false);
                    setSelectedMediaUrl('');
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search & Upload Bar */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #334155', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Search images by name..."
                    value={mediaSearchQuery}
                    onChange={(e) => setMediaSearchQuery(e.target.value)}
                    className="property-input"
                    style={{ paddingLeft: '32px' }}
                  />
                  <ImageIcon size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
                <div>
                  <input 
                    type="file" 
                    id="media-file-input" 
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif" 
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label 
                    htmlFor="media-file-input" 
                    className="editor-btn editor-btn-success editor-btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', margin: 0 }}
                  >
                    {mediaUploading ? <Loader2 size={14} className="builder-spinning" /> : <Upload size={14} />}
                    <span>Upload New Image</span>
                  </label>
                </div>
              </div>

              <div className="media-library-body" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                {mediaUploading && (
                  <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8' }}>
                    <Loader2 size={18} className="builder-spinning" />
                    <span>Uploading new image to server & syncing media catalog...</span>
                  </div>
                )}

                {(() => {
                  const filtered = mediaList.filter(m => 
                    !mediaSearchQuery || 
                    (m.title && m.title.toLowerCase().includes(mediaSearchQuery.toLowerCase())) ||
                    (m.url && m.url.toLowerCase().includes(mediaSearchQuery.toLowerCase()))
                  );

                  if (filtered.length === 0) {
                    return (
                      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                        <ImageIcon size={40} color="#475569" style={{ margin: '0 auto 12px' }} />
                        <p style={{ margin: 0, fontWeight: 600 }}>No images found matching "{mediaSearchQuery}"</p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Try another keyword or click "Upload New Image" above</p>
                      </div>
                    );
                  }

                  return (
                    <div className="media-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                      {filtered.map((m) => {
                        const isChosen = selectedMediaUrl === m.url;
                        return (
                          <div 
                            key={m.id || m.url} 
                            className={`media-gallery-card ${isChosen ? 'selected' : ''}`}
                            style={{ 
                              position: 'relative', 
                              borderRadius: '8px', 
                              overflow: 'hidden', 
                              border: isChosen ? '2px solid #38bdf8' : '1px solid #334155',
                              boxShadow: isChosen ? '0 0 12px rgba(56, 189, 248, 0.4)' : 'none',
                              cursor: 'pointer',
                              height: '110px',
                              background: '#0f172a'
                            }}
                            onClick={() => setSelectedMediaUrl(m.url)}
                            onDoubleClick={() => {
                              handleMediaSelected(m.url);
                              setSelectedMediaUrl('');
                            }}
                            title={m.title || m.url}
                          >
                            <img 
                              src={m.url} 
                              alt={m.title || 'Media Asset'} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {isChosen && (
                              <div style={{ position: 'absolute', top: '6px', right: '6px', background: '#38bdf8', color: '#0f172a', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                                ✓
                              </div>
                            )}
                            <div className="media-card-title-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 6px', background: 'rgba(15, 23, 42, 0.85)', fontSize: '0.7rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {m.title || m.url.split('/').pop()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Modal Footer with Select and Cancel buttons */}
              <div className="builder-modal-footer" style={{ borderTop: '1px solid #334155', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {selectedMediaUrl ? `Selected: ${selectedMediaUrl.split('/').pop()}` : 'Click an image to select, or double-click to apply'}
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <EditorButton
                    variant="secondary"
                    onClick={() => {
                      setMediaPickerOpen(false);
                      setSelectedMediaUrl('');
                    }}
                  >
                    Cancel
                  </EditorButton>
                  <EditorButton
                    variant="primary"
                    disabled={!selectedMediaUrl}
                    onClick={() => {
                      if (selectedMediaUrl) {
                        handleMediaSelected(selectedMediaUrl);
                        setSelectedMediaUrl('');
                      }
                    }}
                  >
                    Select & Apply Image
                  </EditorButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminWebsiteBuilder;
