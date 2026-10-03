import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSite } from './SiteContext';
import { API_BASE_URL } from '../services/api';

export const parseYouTubeUrl = (url) => {
  if (!url) return { isYouTube: false, videoId: null, embedUrl: null };
  const str = String(url).trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = str.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    const videoId = match[2];
    return {
      isYouTube: true,
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`
    };
  }
  return { isYouTube: false, videoId: null, embedUrl: str };
};

const EditorContext = createContext();

// Sanity ceiling only — matches the limit enforced server-side in CmsConfig::saveDraft().
// The public header shows the first 7 items directly and folds the rest into a "⋯"
// overflow dropdown (see Header.jsx), so this is no longer a practical UX limit.
export const MAX_NAV_ITEMS = 20;

export const EditorProvider = ({ children }) => {
  const { token } = useAuth();
  const { cmsConfig, setCmsConfig, loadSiteConfig } = useSite();

  const [editorMode, setEditorMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false); // When true inside builder, links/buttons navigate normally
  const [activePage, setActivePage] = useState('home');
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'visibility'
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const [autoPublish, setAutoPublish] = useState(false); // ALWAYS false: changes are strictly stored as DRAFT
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState(null);

  // History stack for Undo / Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isHistoryAction = useRef(false);
  const autoSaveTimerRef = useRef(null);

  // Initialize history when cmsConfig loads
  useEffect(() => {
    if (cmsConfig && history.length === 0) {
      setHistory([JSON.parse(JSON.stringify(cmsConfig))]);
      setHistoryIndex(0);
    }
  }, [cmsConfig, history.length]);

  // Push new config state and schedule autosave to DB
  const pushState = useCallback((newConfig, immediate = false) => {
    if (!isHistoryAction.current) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newConfig)));
      if (newHistory.length > 30) newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    isHistoryAction.current = false;

    // Synchronously update site config in memory so canvas and inspector re-render immediately
    if (setCmsConfig) {
      setCmsConfig(newConfig);
    }

    // Trigger debounced backend save
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    if (immediate) {
      persistConfigToBackend(newConfig);
    } else {
      setSaveStatus('saving');
      autoSaveTimerRef.current = setTimeout(() => {
        persistConfigToBackend(newConfig);
      }, 700);
    }
  }, [history, historyIndex, setCmsConfig]);

  // Persist to backend database
  const persistConfigToBackend = async (configToSave) => {
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
        body: JSON.stringify({
          action: 'save_draft',
          config: configToSave,
          section_name: `Page: ${activePage.toUpperCase()}`
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSaveStatus('saved');
        } else {
          setSaveStatus('error');
        }
      } else {
        setSaveStatus('error');
      }
    } catch (e) {
      console.error('Autosave error:', e);
      setSaveStatus('error');
    }
  };

  // Explicit Save Draft action (Requirement 11)
  const saveDraft = useCallback(async () => {
    const configToSave = (history && history[historyIndex]) ? history[historyIndex] : cmsConfig;
    if (configToSave) {
      await persistConfigToBackend(configToSave);
    }
  }, [history, historyIndex, cmsConfig]);

  // Update a field on a specific section
  const updateSectionField = (sectionId, fieldKey, value) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];
    const updated = pageSections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, [fieldKey]: value };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    pushState(newConfig);
  };

  // Update an animation property of a section
  const updateSectionAnimation = (sectionId, animField, value) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];
    const updated = pageSections.map(sec => {
      if (sec.id === sectionId) {
        const currentAnim = sec.animation || { type: 'up', duration: 0.55, delay: 0.1 };
        return {
          ...sec,
          animation: { ...currentAnim, [animField]: value }
        };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    pushState(newConfig);
  };

  // Reorder a section
  const moveSection = (sectionId, direction) => {
    if (!cmsConfig) return;
    const pageSections = [...(cmsConfig.sections?.[activePage] || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = pageSections.findIndex(s => s.id === sectionId);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === pageSections.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const [moved] = pageSections.splice(idx, 1);
    pageSections.splice(targetIdx, 0, moved);

    const reordered = pageSections.map((s, i) => ({ ...s, order: i + 1 }));

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: reordered
      }
    };

    pushState(newConfig, true);
  };

  // Duplicate a section
  const duplicateSection = (sectionId) => {
    if (!cmsConfig) return;
    const pageSections = [...(cmsConfig.sections?.[activePage] || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const sec = pageSections.find(s => s.id === sectionId);
    if (!sec) return;

    const cloned = {
      ...JSON.parse(JSON.stringify(sec)),
      id: `${sec.id}_copy_${Date.now().toString().slice(-4)}`,
      name: `${sec.name || 'Section'} (Copy)`
    };

    const idx = pageSections.findIndex(s => s.id === sectionId);
    pageSections.splice(idx + 1, 0, cloned);

    const reordered = pageSections.map((s, i) => ({ ...s, order: i + 1 }));

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: reordered
      }
    };

    setSelectedSectionId(cloned.id);
    pushState(newConfig, true);
  };

  // Toggle Section Visibility
  const toggleSectionVisibility = (sectionId) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];
    const updated = pageSections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, enabled: sec.enabled === false ? true : false };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    pushState(newConfig, true);
  };

  // Delete Section
  const deleteSection = (sectionId) => {
    if (!cmsConfig) return;
    const pageSections = [...(cmsConfig.sections?.[activePage] || [])];
    if (pageSections.length <= 1) {
      alert('You cannot delete the only remaining section on this page.');
      return;
    }
    if (!window.confirm('Delete this section?')) {
      return;
    }

    const filtered = pageSections.filter(s => s.id !== sectionId).map((s, i) => ({ ...s, order: i + 1 }));

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: filtered
      }
    };

    if (selectedSectionId === sectionId) {
      setSelectedSectionId(filtered[0]?.id || null);
    }
    if (selectedElement?.sectionId === sectionId) {
      setSelectedElement(null);
    }

    pushState(newConfig, true);
  };

  // Move section to specific target index
  const moveSectionTo = (sourceSectionId, targetIndex) => {
    if (!cmsConfig) return;
    const pageSections = [...(cmsConfig.sections?.[activePage] || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const srcIdx = pageSections.findIndex(s => s.id === sourceSectionId);
    if (srcIdx === -1) return;

    const [moved] = pageSections.splice(srcIdx, 1);
    const adjustedTarget = targetIndex > srcIdx ? targetIndex - 1 : targetIndex;
    pageSections.splice(Math.max(0, Math.min(pageSections.length, adjustedTarget)), 0, moved);

    const reordered = pageSections.map((s, i) => ({ ...s, order: i + 1 }));

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: reordered
      }
    };

    setSelectedSectionId(sourceSectionId);
    pushState(newConfig, true);
  };

  // Insert a new section at target drop index
  const insertSectionAt = (template, targetIndex) => {
    if (!cmsConfig) return;
    const pageSections = [...(cmsConfig.sections?.[activePage] || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const newId = `${activePage}_${template.type || 'sec'}_${Date.now().toString().slice(-4)}`;
    const newSection = {
      ...JSON.parse(JSON.stringify(template)),
      id: newId,
      order: targetIndex + 1
    };

    pageSections.splice(targetIndex, 0, newSection);
    const reordered = pageSections.map((s, i) => ({ ...s, order: i + 1 }));

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: reordered
      }
    };

    setSelectedSectionId(newId);
    setSelectedElement({ sectionId: newId, type: newSection.type || 'section', section: newSection });
    pushState(newConfig, true);
  };

  // ================= GALLERY CARD CRUD =================
  const updateGalleryCard = (cardId, updates) => {
    if (!cmsConfig) return;
    const currentGallery = cmsConfig.gallery || [];
    const updatedGallery = currentGallery.map(card => {
      if (card.id === cardId) {
        return { ...card, ...updates };
      }
      return card;
    });

    const newConfig = {
      ...cmsConfig,
      gallery: updatedGallery
    };

    if (selectedElement && (selectedElement.cardId === cardId || selectedElement.card?.id === cardId)) {
      setSelectedElement(prev => ({
        ...prev,
        ...updates,
        card: { ...(prev?.card || {}), ...updates }
      }));
    }

    pushState(newConfig);
  };

  const duplicateGalleryCard = (cardId) => {
    if (!cmsConfig) return;
    const currentGallery = [...(cmsConfig.gallery || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const card = currentGallery.find(c => c.id === cardId);
    if (!card) return;

    const newId = `tour_${Date.now().toString().slice(-6)}`;
    const cloned = {
      ...JSON.parse(JSON.stringify(card)),
      id: newId,
      title: `${card.title || 'Tour Card'} (Copy)`
    };

    const idx = currentGallery.findIndex(c => c.id === cardId);
    currentGallery.splice(idx + 1, 0, cloned);
    const reordered = currentGallery.map((c, i) => ({ ...c, order: i + 1 }));

    const newConfig = {
      ...cmsConfig,
      gallery: reordered
    };

    setSelectedElement({
      type: 'gallery_card',
      cardId: newId,
      card: cloned,
      sectionId: 'hotels_tours'
    });
    pushState(newConfig, true);
  };

  const deleteGalleryCard = (cardId) => {
    if (!cmsConfig) return;
    const currentGallery = cmsConfig.gallery || [];
    if (currentGallery.length <= 1) {
      alert('You cannot delete the only remaining card in this gallery.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this card?')) {
      return;
    }

    const filtered = currentGallery.filter(c => c.id !== cardId).map((c, i) => ({ ...c, order: i + 1 }));
    const newConfig = {
      ...cmsConfig,
      gallery: filtered
    };

    if (selectedElement?.cardId === cardId || selectedElement?.card?.id === cardId) {
      setSelectedElement(null);
    }
    pushState(newConfig, true);
  };

  const reorderGalleryCard = (cardId, direction) => {
    if (!cmsConfig) return;
    const currentGallery = [...(cmsConfig.gallery || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = currentGallery.findIndex(c => c.id === cardId);
    if (idx === -1) return;
    if ((direction === 'left' || direction === 'up') && idx === 0) return;
    if ((direction === 'right' || direction === 'down') && idx === currentGallery.length - 1) return;

    const targetIdx = (direction === 'left' || direction === 'up') ? idx - 1 : idx + 1;
    const [moved] = currentGallery.splice(idx, 1);
    currentGallery.splice(targetIdx, 0, moved);

    const reordered = currentGallery.map((c, i) => ({ ...c, order: i + 1 }));
    const newConfig = {
      ...cmsConfig,
      gallery: reordered
    };

    pushState(newConfig, true);
  };

  const toggleGalleryCardVisibility = (cardId) => {
    if (!cmsConfig) return;
    const currentGallery = cmsConfig.gallery || [];
    const updatedGallery = currentGallery.map(card => {
      if (card.id === cardId) {
        return { ...card, active: card.active === false ? true : false };
      }
      return card;
    });

    const newConfig = {
      ...cmsConfig,
      gallery: updatedGallery
    };

    pushState(newConfig, true);
  };

  // ================= SERVICE CARD CRUD =================
  const updateServiceCard = (serviceId, updates) => {
    if (!cmsConfig) return;
    const currentServices = cmsConfig.services || [];
    const updatedServices = currentServices.map(svc => {
      if (svc.id === serviceId) {
        return { ...svc, ...updates };
      }
      return svc;
    });

    const newConfig = {
      ...cmsConfig,
      services: updatedServices
    };

    if (selectedElement && (selectedElement.serviceId === serviceId || selectedElement.cardId === serviceId)) {
      setSelectedElement(prev => ({
        ...prev,
        ...updates,
        service: { ...(prev?.service || {}), ...updates }
      }));
    }

    pushState(newConfig);
  };

  const duplicateServiceCard = (serviceId) => {
    if (!cmsConfig) return;
    const currentServices = [...(cmsConfig.services || [])];
    const svc = currentServices.find(s => s.id === serviceId);
    if (!svc) return;

    const newId = `svc_${Date.now().toString().slice(-6)}`;
    const cloned = {
      ...JSON.parse(JSON.stringify(svc)),
      id: newId,
      title_en: `${svc.title_en || 'Service'} (Copy)`
    };

    const idx = currentServices.findIndex(s => s.id === serviceId);
    currentServices.splice(idx + 1, 0, cloned);

    const newConfig = {
      ...cmsConfig,
      services: currentServices
    };

    setSelectedElement({
      type: 'service_card',
      serviceId: newId,
      cardId: newId,
      service: cloned,
      sectionId: 'service_cards'
    });
    pushState(newConfig, true);
  };

  const deleteServiceCard = (serviceId) => {
    if (!cmsConfig) return;
    const currentServices = cmsConfig.services || [];
    if (currentServices.length <= 1) {
      alert('You cannot delete the only remaining service card.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this service card?')) {
      return;
    }

    const filtered = currentServices.filter(s => s.id !== serviceId);
    const newConfig = {
      ...cmsConfig,
      services: filtered
    };

    if (selectedElement?.serviceId === serviceId || selectedElement?.cardId === serviceId) {
      setSelectedElement(null);
    }
    pushState(newConfig, true);
  };

  const reorderServiceCard = (serviceId, direction) => {
    if (!cmsConfig) return;
    const currentServices = [...(cmsConfig.services || [])];
    const idx = currentServices.findIndex(s => s.id === serviceId);
    if (idx === -1) return;
    if ((direction === 'left' || direction === 'up') && idx === 0) return;
    if ((direction === 'right' || direction === 'down') && idx === currentServices.length - 1) return;

    const targetIdx = (direction === 'left' || direction === 'up') ? idx - 1 : idx + 1;
    const [moved] = currentServices.splice(idx, 1);
    currentServices.splice(targetIdx, 0, moved);

    const newConfig = {
      ...cmsConfig,
      services: currentServices
    };

    pushState(newConfig, true);
  };

  const addServiceCard = () => {
    if (!cmsConfig) return;
    const currentServices = [...(cmsConfig.services || [])];
    const newId = `svc_${Date.now().toString().slice(-6)}`;
    const newCard = {
      id: newId,
      title_en: 'New Professional Service',
      title_de: 'Neuer professioneller Service',
      image: '/assets/images/service_meeting.jpg',
      active: true
    };

    currentServices.push(newCard);
    const newConfig = {
      ...cmsConfig,
      services: currentServices
    };

    setSelectedElement({
      type: 'service_card',
      serviceId: newId,
      cardId: newId,
      service: newCard,
      sectionId: 'service_cards'
    });
    pushState(newConfig, true);
  };

  const addGalleryCard = () => {
    if (!cmsConfig) return;
    const currentGallery = [...(cmsConfig.gallery || [])];
    const newId = `tour_${Date.now().toString().slice(-6)}`;
    const newCard = {
      id: newId,
      title: 'New Destination Tour',
      hotel_name: 'Luxury Resort & Conference Center',
      location: 'Cancún, Mexico',
      image: '/assets/images/hotel_cancun.jpg',
      desc_en: 'Exquisite conference and training facilities suited for international athletic delegations.',
      desc_de: 'Hervorragende Konferenz- und Trainingsmöglichkeiten.',
      button_text_en: 'Explore Destination',
      button_text_de: 'Reiseziel entdecken',
      button_link: '/en/Contact/',
      button_link_type: 'internal',
      order: currentGallery.length + 1,
      active: true
    };

    currentGallery.push(newCard);
    const newConfig = {
      ...cmsConfig,
      gallery: currentGallery
    };

    setSelectedElement({
      type: 'gallery_card',
      cardId: newId,
      card: newCard,
      sectionId: 'hotels_tours'
    });
    pushState(newConfig, true);
  };

  // ================= 4 PILLARS / SECTION CARDS CRUD =================
  const updateSectionCard = (sectionId, cardIndex, updates) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];
    const updated = pageSections.map(sec => {
      if (sec.id === sectionId && sec.cards) {
        const updatedCards = sec.cards.map((c, i) => {
          if (i === cardIndex) {
            return { ...c, ...updates };
          }
          return c;
        });
        return { ...sec, cards: updatedCards };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    if (selectedElement && selectedElement.cardIndex === cardIndex) {
      setSelectedElement(prev => ({
        ...prev,
        ...updates,
        card: { ...(prev?.card || {}), ...updates }
      }));
    }

    pushState(newConfig);
  };

  const duplicateSectionCard = (sectionId, cardIndex) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];
    let newCardIndex = cardIndex + 1;
    const updated = pageSections.map(sec => {
      if (sec.id === sectionId && sec.cards) {
        const clonedCards = [...sec.cards];
        const cardToCopy = clonedCards[cardIndex];
        if (cardToCopy) {
          const newCard = {
            ...JSON.parse(JSON.stringify(cardToCopy)),
            num: `0${clonedCards.length + 1}`,
            title_en: `${cardToCopy.title_en || 'Card'} (Copy)`
          };
          clonedCards.splice(cardIndex + 1, 0, newCard);
          return { ...sec, cards: clonedCards };
        }
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    setSelectedElement({
      type: 'section_card',
      sectionId,
      cardIndex: newCardIndex
    });
    pushState(newConfig, true);
  };

  const deleteSectionCard = (sectionId, cardIndex) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];
    const sec = pageSections.find(s => s.id === sectionId);
    if (!sec || !sec.cards || sec.cards.length <= 1) {
      alert('You cannot delete the only remaining card.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this card?')) {
      return;
    }

    const updated = pageSections.map(s => {
      if (s.id === sectionId && s.cards) {
        const filteredCards = s.cards.filter((_, i) => i !== cardIndex);
        return { ...s, cards: filteredCards };
      }
      return s;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    if (selectedElement?.cardIndex === cardIndex) {
      setSelectedElement(null);
    }
    pushState(newConfig, true);
  };

  const addSectionCard = (sectionId) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];
    let newIdx = 0;
    const updated = pageSections.map(sec => {
      if (sec.id === sectionId && sec.cards) {
        newIdx = sec.cards.length;
        const newCard = {
          num: `0${newIdx + 1}`,
          title_en: 'NEW FEATURE PILLAR',
          title_de: 'NEUE SÄULE',
          desc_en: 'Comprehensive athletic planning and logistical precision for peak performance.',
          desc_de: 'Umfassende athletische Planung und logistische Präzision.'
        };
        return { ...sec, cards: [...sec.cards, newCard] };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    setSelectedElement({
      type: 'section_card',
      sectionId,
      cardIndex: newIdx
    });
    pushState(newConfig, true);
  };

  // ================= VIDEO & YOUTUBE UPDATER =================
  const updateVideoProperties = (sectionId, blockId, videoProps) => {
    if (!cmsConfig) return;
    const { isYouTube, videoId, embedUrl } = parseYouTubeUrl(videoProps.url || videoProps.video_url);
    const resolved = {
      ...videoProps,
      video_type: isYouTube ? 'youtube' : (videoProps.video_type || 'url'),
      video_id: videoId || videoProps.video_id,
      video_url: isYouTube ? embedUrl : (videoProps.video_url || videoProps.url)
    };

    if (blockId) {
      const pageSections = cmsConfig.sections?.[activePage] || [];
      const updated = pageSections.map(sec => {
        if (sec.id === sectionId && sec.columns) {
          const updatedCols = sec.columns.map(col => {
            if (col.blocks) {
              return {
                ...col,
                blocks: col.blocks.map(b => b.id === blockId ? { ...b, ...resolved } : b)
              };
            }
            return col;
          });
          return { ...sec, columns: updatedCols };
        }
        return sec;
      });

      const newConfig = {
        ...cmsConfig,
        sections: { ...cmsConfig.sections, [activePage]: updated }
      };

      if (selectedElement?.blockId === blockId) {
        setSelectedElement(prev => ({ ...prev, ...resolved, block: { ...prev.block, ...resolved } }));
      }
      pushState(newConfig);
    } else if (sectionId) {
      const pageSections = cmsConfig.sections?.[activePage] || [];
      const updated = pageSections.map(sec => {
        if (sec.id === sectionId) {
          return { ...sec, ...resolved };
        }
        return sec;
      });

      const newConfig = {
        ...cmsConfig,
        sections: { ...cmsConfig.sections, [activePage]: updated }
      };

      if (selectedElement?.sectionId === sectionId) {
        setSelectedElement(prev => ({ ...prev, ...resolved }));
      }
      pushState(newConfig);
    }
  };

  // Undo Handler
  const handleUndo = () => {
    if (historyIndex > 0) {
      isHistoryAction.current = true;
      const targetIndex = historyIndex - 1;
      const prevState = history[targetIndex];
      setHistoryIndex(targetIndex);
      persistConfigToBackend(prevState);
    }
  };

  // Redo Handler
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isHistoryAction.current = true;
      const targetIndex = historyIndex + 1;
      const nextState = history[targetIndex];
      setHistoryIndex(targetIndex);
      persistConfigToBackend(nextState);
    }
  };

  // Open Media Library Modal with callback
  const triggerMediaPicker = (callback) => {
    setMediaPickerCallback(() => callback);
    setMediaPickerOpen(true);
  };

  const handleMediaSelected = (url) => {
    if (mediaPickerCallback) {
      mediaPickerCallback(url);
    }
    setMediaPickerOpen(false);
    setMediaPickerCallback(null);
  };

  // ================= PAGE CRUD =================
  const createNewPage = ({ name, slug, layout = 'blank', addToNav = true, navLabel = '', isPublished = true, seoTitle = '', seoDescription = '' }) => {
    if (!cmsConfig) return null;
    const cleanSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')).replace(/^\/+|\/+$/g, '');
    const pageId = cleanSlug;

    // Check if page already exists
    if (cmsConfig.pages?.[pageId]) {
      const confirmOverwrite = window.confirm(`A page with slug "${cleanSlug}" already exists in the database. Would you like to overwrite it and create a fresh layout?`);
      if (!confirmOverwrite) {
        return null;
      }
    }

    const newPageObj = {
      id: pageId,
      slug: cleanSlug,
      title: name,
      seo_title: seoTitle || `${name} | Sports & MICE`,
      seo_description: seoDescription || `Discover ${name} with K-Consulting Sports & MICE.`,
      hero_bg_image: '/assets/images/home_hero_bg.jpg',
      enabled: isPublished
    };

    // Construct starting sections based on layout template
    let startingSections = [];
    if (layout === 'hero_content') {
      startingSections = [
        {
          id: `${pageId}_hero`,
          type: 'hero',
          name: `${name} Hero`,
          heading_prefix_en: name,
          tag1_en: 'Sports & Conferences',
          tag2_en: 'Tailored Logistics',
          subtitle_en: `Welcome to our ${name} overview.`,
          bg_image: '/assets/images/home_hero_bg.jpg',
          enabled: true,
          order: 1
        },
        {
          id: `${pageId}_content`,
          type: 'row',
          name: 'Main Content Row',
          layout: '50-50',
          padding_top: 60,
          padding_bottom: 60,
          columns: [
            {
              id: 'col_1',
              width: '50%',
              blocks: [
                { id: 'b_1', type: 'heading', level: 'h2', text_en: `About Our ${name}`, size: '2.2rem' },
                { id: 'b_2', type: 'text', text_en: 'We provide specialized solutions crafted for high-performance sporting teams and organizations.' },
                { id: 'b_3', type: 'button', text_en: 'Get In Touch', link: '/en/Contact/', style: 'primary' }
              ]
            },
            {
              id: 'col_2',
              width: '50%',
              blocks: [
                { id: 'b_4', type: 'image', src: '/assets/images/home_hero_bg.jpg', alt: name, border_radius: '12px', height: '360px' }
              ]
            }
          ],
          enabled: true,
          order: 2
        }
      ];
    } else if (layout === 'two_column') {
      startingSections = [
        {
          id: `${pageId}_hero`,
          type: 'hero',
          name: `${name} Banner`,
          heading_prefix_en: name,
          tag1_en: 'Specialized Program',
          tag2_en: 'Global Excellence',
          subtitle_en: `Professional coordination for ${name}.`,
          bg_image: '/assets/images/about_hero_bg.jpg',
          enabled: true,
          order: 1
        },
        {
          id: `${pageId}_two_col`,
          type: 'row',
          name: 'Two Column Showcase',
          layout: '50-50',
          padding_top: 60,
          padding_bottom: 60,
          columns: [
            {
              id: 'col_1',
              width: '50%',
              blocks: [
                { id: 'b_1', type: 'heading', level: 'h2', text_en: 'Our Approach' },
                { id: 'b_2', type: 'text', text_en: 'Detailing exceptional standards and proven expertise in sports event logistics.' }
              ]
            },
            {
              id: 'col_2',
              width: '50%',
              blocks: [
                { id: 'b_3', type: 'heading', level: 'h2', text_en: 'Key Benefits' },
                { id: 'b_4', type: 'text', text_en: 'Tailored nutrition, proximity to sports venues, and personal 24/7 service.' }
              ]
            }
          ],
          enabled: true,
          order: 2
        }
      ];
    } else if (layout === 'three_column') {
      startingSections = [
        {
          id: `${pageId}_hero`,
          type: 'hero',
          name: `${name} Banner`,
          heading_prefix_en: name,
          tag1_en: 'Pillars of Excellence',
          tag2_en: 'Worldwide Network',
          subtitle_en: 'Three core pillars supporting every project.',
          bg_image: '/assets/images/service_hero_bg.jpg',
          enabled: true,
          order: 1
        },
        {
          id: `${pageId}_three_col`,
          type: 'row',
          name: '3 Columns Grid',
          layout: '33-33-33',
          padding_top: 60,
          padding_bottom: 60,
          columns: [
            { id: 'col_1', width: '33.333%', blocks: [{ id: 'b_1', type: 'card', title_en: 'Analysis', desc_en: 'Understanding team demands and requirements.' }] },
            { id: 'col_2', width: '33.333%', blocks: [{ id: 'b_2', type: 'card', title_en: 'Execution', desc_en: 'Flawless venue scouting and hotel logistics.' }] },
            { id: 'col_3', width: '33.333%', blocks: [{ id: 'b_3', type: 'card', title_en: 'Support', desc_en: 'Continuous support on-site for officials and athletes.' }] }
          ],
          enabled: true,
          order: 2
        }
      ];
    } else if (layout === 'services') {
      startingSections = [
        { id: `${pageId}_hero`, type: 'hero', name: `${name} Hero`, heading_prefix_en: name, tag1_en: 'Services Overview', tag2_en: 'Global MICE', subtitle_en: 'Explore our complete service portfolio.', bg_image: '/assets/images/service_hero_bg.jpg', enabled: true, order: 1 },
        { id: `${pageId}_services_grid`, type: 'services', name: 'Services Grid', title_en: 'Tailored Services', enabled: true, order: 2 },
        { id: `${pageId}_cta`, type: 'cta', name: 'Contact Callout', title_en: 'Ready to plan your trip?', button_text_en: 'Contact Us', button_link: '/en/Contact/', enabled: true, order: 3 }
      ];
    } else if (layout === 'team' || layout === 'doctors') {
      startingSections = [
        { id: `${pageId}_hero`, type: 'hero', name: `${name} Hero`, heading_prefix_en: name, tag1_en: 'Specialists & Experts', tag2_en: 'High Performance', subtitle_en: 'Meet the professionals behind Sports & MICE.', bg_image: '/assets/images/about_hero_bg.jpg', enabled: true, order: 1 },
        { id: `${pageId}_story`, type: 'story', name: 'Founder & Team Story', title_en: 'Active in high-performance sport', enabled: true, order: 2 },
        { id: `${pageId}_testimonials`, type: 'testimonials', name: 'Testimonials', title_en: 'Client Trust', enabled: true, order: 3 }
      ];
    } else if (layout === 'gallery') {
      startingSections = [
        { id: `${pageId}_hero`, type: 'hero', name: `${name} Hero`, heading_prefix_en: name, tag1_en: 'Destinations', tag2_en: 'Hotel Inspections', subtitle_en: 'Global inspected venues and hotel showcases.', bg_image: '/assets/images/hotels_hero_bg.jpg', enabled: true, order: 1 },
        { id: `${pageId}_gallery`, type: 'gallery', name: 'Inspection Tours', title_en: 'Hotels sights inspection tours', enabled: true, order: 2 }
      ];
    } else if (layout === 'faq_contact') {
      startingSections = [
        { id: `${pageId}_hero`, type: 'hero', name: `${name} Hero`, heading_prefix_en: name, tag1_en: 'Support & Questions', tag2_en: 'Fast Inquiries', subtitle_en: 'Find answers and get in touch with our team.', bg_image: '/assets/images/contact_hero_bg.jpg', enabled: true, order: 1 },
        { id: `${pageId}_faq`, type: 'faq', name: 'FAQ Accordion', title_en: 'Frequently Asked Questions', enabled: true, order: 2 },
        { id: `${pageId}_contact`, type: 'contact', name: 'Contact Form', title_en: 'Send us a message', enabled: true, order: 3 }
      ];
    } else {
      // Blank page starting with standard Hero + Row
      startingSections = [
        {
          id: `${pageId}_hero`,
          type: 'hero',
          name: `${name} Banner`,
          heading_prefix_en: name,
          tag1_en: 'New Custom Page',
          tag2_en: 'Sports & MICE',
          subtitle_en: `Welcome to the ${name} page.`,
          bg_image: '/assets/images/home_hero_bg.jpg',
          enabled: true,
          order: 1
        },
        {
          id: `${pageId}_row_1`,
          type: 'row',
          name: 'Welcome Section',
          layout: '100',
          padding_top: 60,
          padding_bottom: 60,
          columns: [
            {
              id: 'col_1',
              width: '100%',
              blocks: [
                { id: 'b_1', type: 'heading', level: 'h2', text_en: `Welcome to ${name}`, align: 'center' },
                { id: 'b_2', type: 'text', text_en: 'This page was visually created with the Sports & MICE visual CMS.', align: 'center' }
              ]
            }
          ],
          enabled: true,
          order: 2
        }
      ];
    }

    // Process Navbar Item addition (remove existing item with same slug to prevent duplicates)
    let updatedNavItems = (cmsConfig.header?.nav_items || []).filter(item => {
      const p = (item.path || '').replace(/^\/+|\/+$/g, '').replace(/^en\//i, '');
      return p !== cleanSlug && item.id !== `nav_${pageId}`;
    });
    if (addToNav) {
      const label = navLabel || name;
      updatedNavItems.push({
        id: `nav_${pageId}`,
        name_en: label,
        name_de: label,
        path: `/${cleanSlug}`,
        enabled: true,
        order: updatedNavItems.length + 1
      });
    }

    const newConfig = {
      ...cmsConfig,
      pages: {
        ...cmsConfig.pages,
        [pageId]: newPageObj
      },
      sections: {
        ...cmsConfig.sections,
        [pageId]: startingSections
      },
      header: {
        ...cmsConfig.header,
        nav_items: updatedNavItems
      }
    };

    setActivePage(pageId);
    setSelectedSectionId(startingSections[0]?.id || null);
    pushState(newConfig, true);
    return pageId;
  };

  // Duplicate Page
  const duplicatePage = (sourcePageId) => {
    if (!cmsConfig || !cmsConfig.pages?.[sourcePageId]) return;
    const sourcePage = cmsConfig.pages[sourcePageId];
    const newSlug = `${sourcePage.slug || sourcePageId}-copy`;
    const newPageId = newSlug;

    const duplicatedPage = {
      ...JSON.parse(JSON.stringify(sourcePage)),
      id: newPageId,
      slug: newSlug,
      title: `${sourcePage.title || sourcePageId} (Copy)`,
      seo_title: `${sourcePage.seo_title || sourcePageId} (Copy)`
    };

    const sourceSections = cmsConfig.sections?.[sourcePageId] || [];
    const duplicatedSections = sourceSections.map((sec, idx) => ({
      ...JSON.parse(JSON.stringify(sec)),
      id: `${newPageId}_${sec.type || 'sec'}_${idx + 1}`
    }));

    const newConfig = {
      ...cmsConfig,
      pages: {
        ...cmsConfig.pages,
        [newPageId]: duplicatedPage
      },
      sections: {
        ...cmsConfig.sections,
        [newPageId]: duplicatedSections
      }
    };

    setActivePage(newPageId);
    setSelectedSectionId(duplicatedSections[0]?.id || null);
    pushState(newConfig, true);
  };

  // Delete Page
  const deletePage = (pageIdToDelete) => {
    if (!cmsConfig) return;
    if (['home', 'service', 'about', 'hotels', 'contact', 'imprint'].includes(pageIdToDelete)) {
      alert('Core website pages cannot be deleted.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete page "/${pageIdToDelete}"? This will remove its sections and navbar link.`)) {
      return;
    }

    const newPages = { ...cmsConfig.pages };
    delete newPages[pageIdToDelete];

    const newSections = { ...cmsConfig.sections };
    delete newSections[pageIdToDelete];

    const newNavItems = (cmsConfig.header?.nav_items || []).filter(item => {
      const cleanP = (item.path || '').replace(/^\/+|\/+$/g, '');
      return cleanP !== pageIdToDelete;
    });

    const newConfig = {
      ...cmsConfig,
      pages: newPages,
      sections: newSections,
      header: {
        ...cmsConfig.header,
        nav_items: newNavItems
      }
    };

    setActivePage('home');
    setSelectedSectionId(newConfig.sections?.home?.[0]?.id || null);
    pushState(newConfig, true);
  };

  // Update Page Settings / SEO
  const updatePageSettings = (pageId, newSettings) => {
    if (!cmsConfig || !cmsConfig.pages?.[pageId]) return;
    const current = cmsConfig.pages[pageId];
    const updated = { ...current, ...newSettings };

    const newConfig = {
      ...cmsConfig,
      pages: {
        ...cmsConfig.pages,
        [pageId]: updated
      }
    };

    pushState(newConfig, true);
  };

  // ================= ROW & COLUMN MANAGEMENT =================
  const addRowSection = (layoutPreset = '50-50', targetIndex = 999) => {
    if (!cmsConfig) return;
    const pageSections = [...(cmsConfig.sections?.[activePage] || [])];
    const rowId = `${activePage}_row_${Date.now().toString().slice(-4)}`;

    let cols = [];
    if (layoutPreset === '100') {
      cols = [{ id: 'col_1', width: '100%', blocks: [] }];
    } else if (layoutPreset === '50-50') {
      cols = [
        { id: 'col_1', width: '50%', blocks: [] },
        { id: 'col_2', width: '50%', blocks: [] }
      ];
    } else if (layoutPreset === '33-33-33') {
      cols = [
        { id: 'col_1', width: '33.333%', blocks: [] },
        { id: 'col_2', width: '33.333%', blocks: [] },
        { id: 'col_3', width: '33.333%', blocks: [] }
      ];
    } else if (layoutPreset === '25-25-25-25') {
      cols = [
        { id: 'col_1', width: '25%', blocks: [] },
        { id: 'col_2', width: '25%', blocks: [] },
        { id: 'col_3', width: '25%', blocks: [] },
        { id: 'col_4', width: '25%', blocks: [] }
      ];
    } else if (layoutPreset === '66-33') {
      cols = [
        { id: 'col_1', width: '66.666%', blocks: [] },
        { id: 'col_2', width: '33.333%', blocks: [] }
      ];
    } else if (layoutPreset === '33-66') {
      cols = [
        { id: 'col_1', width: '33.333%', blocks: [] },
        { id: 'col_2', width: '66.666%', blocks: [] }
      ];
    } else {
      cols = [
        { id: 'col_1', width: '50%', blocks: [] },
        { id: 'col_2', width: '50%', blocks: [] }
      ];
    }

    const newRow = {
      id: rowId,
      type: 'row',
      name: `Custom Row (${layoutPreset})`,
      layout: layoutPreset,
      padding_top: 60,
      padding_bottom: 60,
      columns: cols,
      enabled: true,
      order: targetIndex + 1
    };

    pageSections.splice(targetIndex, 0, newRow);
    const reordered = pageSections.map((s, i) => ({ ...s, order: i + 1 }));

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: reordered
      }
    };

    setSelectedSectionId(rowId);
    pushState(newConfig, true);
  };

  // Insert block at specific target index in column
  const insertBlockAt = (sectionId, colId, blockType, defaultProps = {}, targetIndex = 999) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];
    const bId = `b_${Date.now().toString().slice(-5)}`;

    let newBlock = { id: bId, type: blockType, ...defaultProps };
    if (blockType === 'heading') {
      newBlock = { id: bId, type: 'heading', level: 'h2', text_en: 'New Heading', text_de: 'Neue Überschrift', size: '2rem', weight: '700', align: 'left', color: '#1f242d', ...defaultProps };
    } else if (blockType === 'text') {
      newBlock = { id: bId, type: 'text', text_en: 'Detailing exceptional standards and proven expertise in sports event logistics and travel.', text_de: 'Neuer Text.', size: '1rem', color: '#555555', align: 'left', ...defaultProps };
    } else if (blockType === 'image') {
      newBlock = { id: bId, type: 'image', src: '/assets/images/home_hero_bg.jpg', alt: 'Showcase Image', border_radius: '12px', height: '320px', object_fit: 'cover', align: 'center', ...defaultProps };
    } else if (blockType === 'button') {
      newBlock = { id: bId, type: 'button', text_en: 'Get In Touch', text_de: 'Kontaktieren Sie uns', link: '/en/Contact/', link_type: 'internal', style: 'primary', bg_color: '#ff0000', text_color: '#ffffff', border_radius: '50px', padding: '12px 28px', align: 'left', ...defaultProps };
    } else if (blockType === 'card') {
      newBlock = { id: bId, type: 'card', title_en: 'Feature Card Title', title_de: 'Karten-Titel', desc_en: 'Card description detailing specific athletic or MICE benefits.', desc_de: 'Karten-Beschreibung.', bg: '#faf5fa', border_color: '#ede4ed', border_radius: '12px', padding: '24px', button_text: 'Learn More', button_link: '/en/Contact/', ...defaultProps };
    } else if (blockType === 'badge') {
      newBlock = { id: bId, type: 'badge', text_en: '✦ Premium Partner', text_de: '✦ Premium Partner', bg_color: 'rgba(255, 0, 0, 0.12)', text_color: '#ff0000', border_radius: '50px', align: 'left', ...defaultProps };
    } else if (blockType === 'quote') {
      newBlock = { id: bId, type: 'quote', quote_en: 'Outstanding organization, great team hotels, and 24/7 personal on-site support.', author: 'National Team Coach', role: 'European Athletics', rating: 5, bg: '#f8fafc', ...defaultProps };
    } else if (blockType === 'feature') {
      newBlock = { id: bId, type: 'feature', icon: 'ShieldCheck', icon_color: '#ff0000', icon_bg: 'rgba(255,0,0,0.1)', title_en: 'High-Performance Standards', title_de: 'Spitzensport-Standards', desc_en: 'Tailored nutrition, fitness rooms, and short distances to competition venues.', desc_de: 'Maßgeschneiderte Ernährung, Fitnessräume und kurze Wege zu Wettkampfstätten.', button_text_en: 'Learn More', button_text_de: 'Mehr erfahren', button_link: '/en/Contact/', button_link_type: 'internal', bg_color: '#ffffff', border_radius: '12px', padding: '24px', ...defaultProps };
    } else if (blockType === 'video') {
      newBlock = { id: bId, type: 'video', video_type: 'youtube', video_id: 'dD_FThvzO9I', video_url: 'https://www.youtube.com/embed/dD_FThvzO9I?controls=1', url: 'https://www.youtube.com/watch?v=dD_FThvzO9I', aspect_ratio: '16/9', border_radius: '12px', shadow: '0 8px 24px rgba(0,0,0,0.12)', controls: true, autoplay: false, muted: false, loop: false, ...defaultProps };
    } else if (blockType === 'youtube') {
      newBlock = { id: bId, type: 'youtube', video_type: 'youtube', video_id: 'dD_FThvzO9I', video_url: 'https://www.youtube.com/embed/dD_FThvzO9I?controls=1', url: 'https://www.youtube.com/watch?v=dD_FThvzO9I', aspect_ratio: '16/9', border_radius: '12px', shadow: '0 8px 24px rgba(0,0,0,0.12)', controls: true, autoplay: false, muted: false, loop: false, ...defaultProps };
    } else if (blockType === 'list') {
      newBlock = { id: bId, type: 'list', items_en: ['Direct venue proximity', 'Tailored athletic meals', 'Dedicated 24/7 coordinator'], icon: 'CheckCircle2', color: '#10b981', ...defaultProps };
    }

    const updated = pageSections.map(sec => {
      if (sec.id === sectionId && sec.columns) {
        const updatedCols = sec.columns.map(col => {
          if (col.id === colId) {
            const currentBlocks = [...(col.blocks || [])];
            const insertIdx = Math.max(0, Math.min(currentBlocks.length, targetIndex));
            currentBlocks.splice(insertIdx, 0, newBlock);
            return {
              ...col,
              blocks: currentBlocks
            };
          }
          return col;
        });
        return { ...sec, columns: updatedCols };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    setSelectedElement({ sectionId, colId, blockId: bId, block: newBlock, type: newBlock.type });
    pushState(newConfig, true);
  };

  // Move block from source column/section to target column/section at targetIndex
  const moveBlockTo = (sourceSecId, sourceColId, blockId, targetSecId, targetColId, targetIndex = 999) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];
    let movingBlock = null;

    // First pass: extract block
    const cleanedSections = pageSections.map(sec => {
      if (sec.id === sourceSecId && sec.columns) {
        const updatedCols = sec.columns.map(col => {
          if (col.id === sourceColId && col.blocks) {
            const idx = col.blocks.findIndex(b => b.id === blockId);
            if (idx !== -1) {
              movingBlock = col.blocks[idx];
              return {
                ...col,
                blocks: col.blocks.filter(b => b.id !== blockId)
              };
            }
          }
          return col;
        });
        return { ...sec, columns: updatedCols };
      }
      return sec;
    });

    if (!movingBlock) return;

    // Second pass: insert block at target
    const finalSections = cleanedSections.map(sec => {
      if (sec.id === targetSecId && sec.columns) {
        const updatedCols = sec.columns.map(col => {
          if (col.id === targetColId) {
            const currentBlocks = [...(col.blocks || [])];
            const insertIdx = Math.max(0, Math.min(currentBlocks.length, targetIndex));
            currentBlocks.splice(insertIdx, 0, movingBlock);
            return {
              ...col,
              blocks: currentBlocks
            };
          }
          return col;
        });
        return { ...sec, columns: updatedCols };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: finalSections
      }
    };

    setSelectedElement({ sectionId: targetSecId, colId: targetColId, blockId, block: movingBlock, type: movingBlock.type });
    pushState(newConfig, true);
  };

  // Update multiple column widths in a row
  const updateColumnWidths = (sectionId, colWidths) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];

    const updated = pageSections.map(sec => {
      if (sec.id === sectionId && sec.columns) {
        const updatedCols = sec.columns.map((col, idx) => {
          if (colWidths[idx] !== undefined) {
            const w = colWidths[idx];
            return { ...col, width: typeof w === 'number' ? `${w}%` : w };
          }
          return col;
        });
        return { ...sec, columns: updatedCols };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    pushState(newConfig, true);
  };

  // Duplicate generic element (Section, Block, Service Card, Gallery Card)
  const duplicateElement = (elem) => {
    if (!elem) return;
    if (elem.colId && elem.blockId) {
      duplicateBlock(elem.sectionId, elem.colId, elem.blockId);
    } else if (elem.type === 'gallery_card' || elem.type?.startsWith('gallery_card') || (elem.cardId && elem.type?.includes('gallery'))) {
      const cardId = elem.cardId || elem.card?.id;
      if (cardId) duplicateGalleryCard(cardId);
    } else if (elem.type === 'service_card' || elem.type?.startsWith('service_card') || elem.serviceId) {
      const svcId = elem.serviceId || elem.service?.id || elem.cardId;
      if (svcId) duplicateServiceCard(svcId);
    } else if (elem.sectionId && !elem.colId && !elem.blockId) {
      duplicateSection(elem.sectionId);
    }
  };

  // Delete generic element (Section, Block, Service Card, Gallery Card)
  const deleteElement = (elem) => {
    if (!elem) return;
    if (elem.colId && elem.blockId) {
      removeBlock(elem.sectionId, elem.colId, elem.blockId);
    } else if (elem.type === 'gallery_card' || elem.type?.startsWith('gallery_card') || (elem.cardId && elem.type?.includes('gallery'))) {
      const cardId = elem.cardId || elem.card?.id;
      if (cardId) deleteGalleryCard(cardId);
    } else if (elem.type === 'service_card' || elem.type?.startsWith('service_card') || elem.serviceId) {
      const svcId = elem.serviceId || elem.service?.id || elem.cardId;
      if (svcId) deleteServiceCard(svcId);
    } else if (elem.sectionId && !elem.colId && !elem.blockId) {
      deleteSection(elem.sectionId);
    }
  };

  // Add block to a column in a row section (appends to end)
  const addBlockToColumn = (sectionId, colId, blockType, defaultProps = {}) => {
    insertBlockAt(sectionId, colId, blockType, defaultProps, 999);
  };

  // Duplicate block inside column
  const duplicateBlock = (sectionId, colId, blockId) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];
    let newBlockId = null;
    let clonedBlock = null;

    const updated = pageSections.map(sec => {
      if (sec.id === sectionId && sec.columns) {
        const updatedCols = sec.columns.map(col => {
          if (col.id === colId && col.blocks) {
            const idx = col.blocks.findIndex(b => b.id === blockId);
            if (idx === -1) return col;
            const original = col.blocks[idx];
            newBlockId = `b_${Date.now().toString().slice(-5)}`;
            clonedBlock = {
              ...JSON.parse(JSON.stringify(original)),
              id: newBlockId
            };
            const newBlocks = [...col.blocks];
            newBlocks.splice(idx + 1, 0, clonedBlock);
            return { ...col, blocks: newBlocks };
          }
          return col;
        });
        return { ...sec, columns: updatedCols };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    if (newBlockId && clonedBlock) {
      setSelectedElement({ sectionId, colId, blockId: newBlockId, block: clonedBlock, type: clonedBlock.type });
    }
    pushState(newConfig, true);
  };

  // Move block up or down within a column
  const moveBlock = (sectionId, colId, blockId, direction) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];

    const updated = pageSections.map(sec => {
      if (sec.id === sectionId && sec.columns) {
        const updatedCols = sec.columns.map(col => {
          if (col.id === colId && col.blocks) {
            const idx = col.blocks.findIndex(b => b.id === blockId);
            if (idx === -1) return col;
            if (direction === 'up' && idx === 0) return col;
            if (direction === 'down' && idx === col.blocks.length - 1) return col;
            const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
            const newBlocks = [...col.blocks];
            const [moved] = newBlocks.splice(idx, 1);
            newBlocks.splice(targetIdx, 0, moved);
            return { ...col, blocks: newBlocks };
          }
          return col;
        });
        return { ...sec, columns: updatedCols };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    pushState(newConfig, true);
  };

  // Clipboard for copy & paste
  const [clipboard, setClipboard] = useState(null);

  const copyElement = (elementData) => {
    setClipboard(JSON.parse(JSON.stringify(elementData)));
  };

  const pasteElement = (targetSectionId, targetColId = null) => {
    if (!clipboard) return;
    if (clipboard.section || (clipboard.type === 'section' && !clipboard.blockId)) {
      const secData = clipboard.section || clipboard;
      const clonedSec = {
        ...JSON.parse(JSON.stringify(secData)),
        id: `${activePage}_${secData.type || 'sec'}_${Date.now().toString().slice(-4)}`,
        name: `${secData.name || 'Section'} (Copy)`
      };
      insertSectionAt(clonedSec, (cmsConfig?.sections?.[activePage] || []).length);
    } else if (targetSectionId && targetColId && (clipboard.block || clipboard.type)) {
      const blockData = clipboard.block || clipboard;
      addBlockToColumn(targetSectionId, targetColId, blockData.type, blockData);
    }
  };

  // Update block properties
  const updateBlock = (sectionId, colId, blockId, fieldKeyOrObj, value = undefined) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];

    const updated = pageSections.map(sec => {
      if (sec.id === sectionId && sec.columns) {
        const updatedCols = sec.columns.map(col => {
          if (col.id === colId && col.blocks) {
            const updatedBlocks = col.blocks.map(b => {
              if (b.id === blockId) {
                if (typeof fieldKeyOrObj === 'object') {
                  return { ...b, ...fieldKeyOrObj };
                }
                return { ...b, [fieldKeyOrObj]: value };
              }
              return b;
            });
            return { ...col, blocks: updatedBlocks };
          }
          return col;
        });
        return { ...sec, columns: updatedCols };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    pushState(newConfig);
  };

  // Update block responsive property (Desktop / Tablet / Mobile)
  const updateBlockResponsive = (sectionId, colId, blockId, property, value, targetViewport = 'desktop') => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];

    const updated = pageSections.map(sec => {
      if (sec.id === sectionId && sec.columns) {
        const updatedCols = sec.columns.map(col => {
          if (col.id === colId && col.blocks) {
            const updatedBlocks = col.blocks.map(b => {
              if (b.id === blockId) {
                const currentResp = b.responsiveStyles || { desktop: {}, tablet: {}, mobile: {} };
                const updatedResp = {
                  ...currentResp,
                  [targetViewport]: {
                    ...(currentResp[targetViewport] || {}),
                    [property]: value
                  }
                };
                const updatedBlock = {
                  ...b,
                  responsiveStyles: updatedResp
                };
                if (targetViewport === 'desktop') {
                  updatedBlock[property] = value;
                }
                return updatedBlock;
              }
              return b;
            });
            return { ...col, blocks: updatedBlocks };
          }
          return col;
        });
        return { ...sec, columns: updatedCols };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    pushState(newConfig);
  };

  // Update section responsive property (Desktop / Tablet / Mobile)
  const updateSectionResponsive = (sectionId, property, value, targetViewport = 'desktop') => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];

    const updated = pageSections.map(sec => {
      if (sec.id === sectionId) {
        const currentResp = sec.responsiveStyles || { desktop: {}, tablet: {}, mobile: {} };
        const updatedResp = {
          ...currentResp,
          [targetViewport]: {
            ...(currentResp[targetViewport] || {}),
            [property]: value
          }
        };
        const updatedSec = {
          ...sec,
          responsiveStyles: updatedResp
        };
        if (targetViewport === 'desktop') {
          updatedSec[property] = value;
        }
        return updatedSec;
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    pushState(newConfig);
  };

  // Remove block from column
  const removeBlock = (sectionId, colId, blockId) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];

    const updated = pageSections.map(sec => {
      if (sec.id === sectionId && sec.columns) {
        const updatedCols = sec.columns.map(col => {
          if (col.id === colId && col.blocks) {
            return {
              ...col,
              blocks: col.blocks.filter(b => b.id !== blockId)
            };
          }
          return col;
        });
        return { ...sec, columns: updatedCols };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    setSelectedElement(null);
    pushState(newConfig, true);
  };

  // Update column properties (width, background, padding)
  const updateColumn = (sectionId, colId, updateFields) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];

    const updated = pageSections.map(sec => {
      if (sec.id === sectionId && sec.columns) {
        const updatedCols = sec.columns.map(col => {
          if (col.id === colId) {
            return { ...col, ...updateFields };
          }
          return col;
        });
        return { ...sec, columns: updatedCols };
      }
      return sec;
    });

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    pushState(newConfig, true);
  };

  // ================= NAVBAR MANAGEMENT =================
  const addNavItem = ({ name_en, name_de, path, parent_id = null }) => {
    if (!cmsConfig) return { success: false, error: 'Site configuration not loaded yet.' };
    const navItems = [...(cmsConfig.header?.nav_items || [])];
    const newId = `nav_${Date.now().toString().slice(-5)}`;

    // Only top-level items count toward the limit — a submenu child isn't a
    // main navigation item. Matches the same count the backend validates.
    if (!parent_id && navItems.length >= MAX_NAV_ITEMS) {
      return { success: false, error: `Maximum ${MAX_NAV_ITEMS} navigation items are allowed.` };
    }

    if (parent_id) {
      // Add as child to parent item
      const updatedNav = navItems.map(item => {
        if (item.id === parent_id) {
          const children = item.children || item.sub_items || [];
          return {
            ...item,
            children: [...children, { id: newId, name_en, name_de: name_de || name_en, path, enabled: true }]
          };
        }
        return item;
      });

      const newConfig = {
        ...cmsConfig,
        header: {
          ...cmsConfig.header,
          nav_items: updatedNav
        }
      };
      pushState(newConfig, true);
      return { success: true };
    }

    navItems.push({
      id: newId,
      name_en,
      name_de: name_de || name_en,
      path,
      enabled: true,
      order: navItems.length + 1
    });

    const newConfig = {
      ...cmsConfig,
      header: {
        ...cmsConfig.header,
        nav_items: navItems
      }
    };

    pushState(newConfig, true);
    return { success: true };
  };

  const reorderNavItem = (navId, direction) => {
    if (!cmsConfig) return;
    const navItems = [...(cmsConfig.header?.nav_items || [])];
    const index = navItems.findIndex(item => item.id === navId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= navItems.length) return;

    const temp = navItems[index];
    navItems[index] = navItems[targetIndex];
    navItems[targetIndex] = temp;
    navItems.forEach((item, idx) => { item.order = idx + 1; });

    const newConfig = {
      ...cmsConfig,
      header: {
        ...cmsConfig.header,
        nav_items: navItems
      }
    };
    pushState(newConfig, true);
  };

  const updateNavItem = (navId, fields) => {
    if (!cmsConfig) return;
    const navItems = [...(cmsConfig.header?.nav_items || [])];

    const updated = navItems.map(item => {
      if (item.id === navId) {
        return { ...item, ...fields };
      }
      if (item.children || item.sub_items) {
        const updatedChildren = (item.children || item.sub_items).map(child => {
          if (child.id === navId) {
            return { ...child, ...fields };
          }
          return child;
        });
        return { ...item, children: updatedChildren };
      }
      return item;
    });

    const newConfig = {
      ...cmsConfig,
      header: {
        ...cmsConfig.header,
        nav_items: updated
      }
    };

    pushState(newConfig, true);
  };

  const deleteNavItem = (navId) => {
    if (!cmsConfig) return;
    const navItems = [...(cmsConfig.header?.nav_items || [])];

    // Find the item being removed to detect if it's a custom page route
    const targetItem = navItems.find(item => item.id === navId);
    let targetSlug = null;
    if (targetItem?.path) {
      targetSlug = targetItem.path.replace(/^\/+|\/+$/g, '').replace(/^en\//i, '').replace(/\/+$/g, '');
    } else if (navId?.startsWith('nav_')) {
      targetSlug = navId.replace(/^nav_/, '');
    }

    const updated = navItems.filter(item => item.id !== navId).map(item => {
      if (item.children || item.sub_items) {
        return {
          ...item,
          children: (item.children || item.sub_items).filter(c => c.id !== navId)
        };
      }
      return item;
    });

    const newPages = { ...(cmsConfig.pages || {}) };
    const newSections = { ...(cmsConfig.sections || {}) };

    // Core pages that must never be removed
    const corePages = ['home', 'service', 'about', 'hotels', 'contact', 'imprint', ''];

    // Identify all matching custom page keys to delete from DB
    const pageKeysToDelete = Object.keys(newPages).filter(key => {
      if (corePages.includes(key.toLowerCase())) return false;
      if (targetSlug && key.toLowerCase() === targetSlug.toLowerCase()) return true;
      if (targetSlug && newPages[key]?.slug?.toLowerCase() === targetSlug.toLowerCase()) return true;
      if (navId && (key === navId || `nav_${key}` === navId)) return true;
      return false;
    });

    pageKeysToDelete.forEach(k => {
      delete newPages[k];
      delete newSections[k];
    });

    const newConfig = {
      ...cmsConfig,
      pages: newPages,
      sections: newSections,
      header: {
        ...cmsConfig.header,
        nav_items: updated
      }
    };

    if (pageKeysToDelete.includes(activePage) || (targetSlug && activePage === targetSlug)) {
      setActivePage('home');
      setSelectedSectionId(newConfig.sections?.home?.[0]?.id || null);
    }

    pushState(newConfig, true);
  };

  // Update any button or link properties on a section or block
  const updateButtonProperties = (sectionId, fieldPrefix, updatesObj, colId = null, blockId = null) => {
    if (!cmsConfig) return;
    const pageSections = cmsConfig.sections?.[activePage] || [];

    let updated = [];
    if (colId && blockId) {
      // It is a button block inside a column
      updated = pageSections.map(sec => {
        if (sec.id === sectionId && sec.columns) {
          const updatedCols = sec.columns.map(col => {
            if (col.id === colId && col.blocks) {
              const updatedBlocks = col.blocks.map(b => {
                if (b.id === blockId) {
                  return { ...b, ...updatesObj };
                }
                return b;
              });
              return { ...col, blocks: updatedBlocks };
            }
            return col;
          });
          return { ...sec, columns: updatedCols };
        }
        return sec;
      });
    } else {
      // It is a section-level CTA button (hero, cta, video, etc.)
      updated = pageSections.map(sec => {
        if (sec.id === sectionId) {
          const updatedSec = { ...sec };
          Object.entries(updatesObj).forEach(([k, v]) => {
            if (fieldPrefix) {
              if (k.startsWith(fieldPrefix)) {
                updatedSec[k] = v;
              } else {
                updatedSec[`${fieldPrefix}_${k}`] = v;
              }
            } else {
              updatedSec[k] = v;
            }
          });
          return updatedSec;
        }
        return sec;
      });
    }

    const newConfig = {
      ...cmsConfig,
      sections: {
        ...cmsConfig.sections,
        [activePage]: updated
      }
    };

    if (selectedElement) {
      setSelectedElement(prev => ({
        ...prev,
        ...updatesObj,
        block: prev?.block ? { ...prev.block, ...updatesObj } : prev?.block
      }));
    }

    pushState(newConfig);
  };

  const selectElement = (elementData) => {
    if (elementData.sectionId) {
      setSelectedSectionId(elementData.sectionId);
    }
    setSelectedElement(elementData);
    setActiveTab('content');
  };

  const clearSelection = () => {
    setSelectedElement(null);
  };

  const handleEditorClick = (e, elementInfo) => {
    if (editorMode && !isPreviewMode) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      selectElement(elementInfo);
      return true;
    }
    return false;
  };

  return (
    <EditorContext.Provider value={{
      editorMode,
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
      selectElement,
      clearSelection,
      handleEditorClick,
      activeTab,
      setActiveTab,
      saveStatus,
      setSaveStatus,
      saveDraft,
      autoPublish,
      setAutoPublish,
      updateSectionField,
      updateSectionAnimation,
      updateButtonProperties,
      moveSection,
      moveSectionTo,
      duplicateSection,
      toggleSectionVisibility,
      deleteSection,
      insertSectionAt,
      // Page CRUD
      createNewPage,
      duplicatePage,
      deletePage,
      updatePageSettings,
      // Row & Column & Block CRUD
      addRowSection,
      addBlockToColumn,
      insertBlockAt,
      moveBlockTo,
      updateColumnWidths,
      duplicateBlock,
      moveBlock,
      updateBlock,
      updateBlockResponsive,
      updateSectionResponsive,
      removeBlock,
      updateColumn,
      duplicateElement,
      deleteElement,
      // Clipboard
      clipboard,
      copyElement,
      pasteElement,
      // Gallery Card CRUD
      updateGalleryCard,
      duplicateGalleryCard,
      deleteGalleryCard,
      reorderGalleryCard,
      toggleGalleryCardVisibility,
      addGalleryCard,
      // Service Card CRUD
      updateServiceCard,
      duplicateServiceCard,
      deleteServiceCard,
      reorderServiceCard,
      addServiceCard,
      // Section Card CRUD (4 Pillars, etc.)
      updateSectionCard,
      duplicateSectionCard,
      deleteSectionCard,
      addSectionCard,
      // Video & YouTube updater
      updateVideoProperties,
      // Nav CRUD
      addNavItem,
      updateNavItem,
      deleteNavItem,
      reorderNavItem,
      // Undo / Redo
      handleUndo,
      handleRedo,
      canUndo: historyIndex > 0,
      canRedo: historyIndex < history.length - 1,
      // Media
      mediaPickerOpen,
      setMediaPickerOpen,
      triggerMediaPicker,
      handleMediaSelected
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    return {
      editorMode: false,
      setEditorMode: () => {},
      isPreviewMode: false,
      setIsPreviewMode: () => {},
      activePage: 'home',
      selectedSectionId: null,
      selectedElement: null,
      selectElement: () => {},
      clearSelection: () => {},
      handleEditorClick: () => false,
      updateSectionField: () => {},
      updateSectionAnimation: () => {},
      updateButtonProperties: () => {},
      moveSection: () => {},
      moveSectionTo: () => {},
      duplicateSection: () => {},
      toggleSectionVisibility: () => {},
      deleteSection: () => {},
      insertSectionAt: () => {},
      triggerMediaPicker: () => {},
      createNewPage: () => {},
      duplicatePage: () => {},
      deletePage: () => {},
      updatePageSettings: () => {},
      addRowSection: () => {},
      addBlockToColumn: () => {},
      insertBlockAt: () => {},
      moveBlockTo: () => {},
      updateColumnWidths: () => {},
      duplicateBlock: () => {},
      moveBlock: () => {},
      updateBlock: () => {},
      removeBlock: () => {},
      updateColumn: () => {},
      duplicateElement: () => {},
      deleteElement: () => {},
      updateGalleryCard: () => {},
      duplicateGalleryCard: () => {},
      deleteGalleryCard: () => {},
      reorderGalleryCard: () => {},
      toggleGalleryCardVisibility: () => {},
      addGalleryCard: () => {},
      updateServiceCard: () => {},
      duplicateServiceCard: () => {},
      deleteServiceCard: () => {},
      reorderServiceCard: () => {},
      addServiceCard: () => {},
      updateSectionCard: () => {},
      duplicateSectionCard: () => {},
      deleteSectionCard: () => {},
      addSectionCard: () => {},
      updateVideoProperties: () => {},
      clipboard: null,
      copyElement: () => {},
      pasteElement: () => {},
      addNavItem: () => {},
      updateNavItem: () => {},
      deleteNavItem: () => {},
      reorderNavItem: () => {}
    };
  }
  return context;
};
