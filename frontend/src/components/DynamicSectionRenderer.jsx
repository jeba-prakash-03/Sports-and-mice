import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSite } from '../context/SiteContext';
import { useEditor, parseYouTubeUrl } from '../context/EditorContext';
import { AnimatedSection, AnimatedCard } from './AnimatedSection';
import { AnimatedCounter } from './AnimatedCounter';
import { VideoFacade } from './VideoFacade';
import HeroParallaxBg from './HeroParallaxBg';
import HeroCarousel from './HeroCarousel';
import Cinematic3DHero from './Cinematic3DHero';
import BentoSportsSection from './BentoSportsSection';
import TrophySection from './TrophySection';
import ParallelSportsShowcase from './ParallelSportsShowcase';
import SportsMarqueeTicker from './SportsMarqueeTicker';
import SportsVideoShowcase from './SportsVideoShowcase';
import {
  Trophy,
  Globe2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Clock,
  Users,
  MapPin,
  Calendar,
  Handshake,
  CheckCircle2,
  Search,
  Building2,
  Compass,
  Star,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  HelpCircle,
  MessageSquareQuote,
  ExternalLink,
  Edit3,
  GripVertical,
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  Video,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Upload,
  Zap,
  Award,
  Target,
  Plus,
  Sliders,
  Play,
  Layers,
  Heart,
  Square,
  Columns,
  Layout,
  Type,
  FileText,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getResponsiveValue, buildElementStyles } from '../utils/responsiveStyles';
import { handleTiltMove, handleTiltLeave } from '../utils/tilt';
import { handleMagnetMove, handleMagnetLeave } from '../utils/magneticButton';
import { QuickAddGrid } from './admin/EditorUI';

export const DEFAULT_NEW_SECTIONS = {
  hero: {
    type: 'hero',
    name: 'Hero Banner Section',
  
    heading_prefix_de: 'Sportverbände &',
    tag1_en: 'Meetings ♢ Incentives',
    tag1_de: 'Besprechungen ♢ Teambildung',
    tag2_en: 'Conferences ♢ Events',
    tag2_de: 'Konferenzen ♢ Veranstaltungen',
    subtitle_en: 'Sport needs professional structures when traveling to competitions, team building and conferences around the world',
    subtitle_de: 'Der Sport braucht professionelle Strukturen bei Reisen zu Wettkämpfen, Teambildung und Konferenzen weltweit',
    bg_image: '/assets/images/home_hero_bg.jpg',
    cta_button_text_en: 'Get Free Consultation',
    cta_button_text_de: 'Kostenlose Beratung anfragen',
    cta_button_link: '/en/Contact/',
    cta_button_enabled: true,
    enabled: true
  },
  home_intro: {
    type: 'home_intro',
    name: 'Introductory Explanation',
    title_en: 'Sport needs professional structures when traveling to competitions, team building and conferences around the world',
    title_de: 'Der Sport braucht professionelle Strukturen bei Reisen zu Wettkämpfen, Teambildung und Konferenzen weltweit',
    p1_en: 'Be it at competitions or team building of the national teams or at conferences, events or meetings of sports associations, the focus must always be on sport and its further development.',
    p1_de: 'Sei es bei Wettkämpfen oder Teambildungen der Nationalmannschaften oder bei Konferenzen, Veranstaltungen oder Besprechungen der Sportverbände, der Sport und seine Weiterentwicklung müssen immer im Mittelpunkt stehen.',
    p2_en: 'It is particularly important that the infrastructure suits the needs to the attendees. Hotels need to be able to deal with the needs of sports teams, team building activities have to meet the special demands of athletes and conference rooms should suit active athletic participants.',
    p2_de: 'So ist es besonders wichtig, dass die Infrastruktur stimmig ist. Hotels müssen mit Sportmannschaften umgehen können, Teambildungsaktivitäten den besonderen Ansprüchen der Sportler:innen entsprechen, Konferenzräume zu den aktiven sportlichen Teilnehmer:innen passen.',
    p3_en: 'For events to be successful, the environment must also be suit the sporting characteristics of the customer.',
    p3_de: 'Zum Gelingen von Veranstaltungen muss auch das Umfeld zu den sportlichen Eigenschaften der Kunden passen.',
    enabled: true
  },
  cards: {
    type: 'cards',
    name: 'Together for Success - 3 Pillars',
    title_en: 'Together for success! Travel and meet like the pros!',
    title_de: 'Gemeinsam zum Erfolg! Reisen und Tagen wie die Profis!',
    cards: [
      {
        num: '01',
        title_en: 'HOTELS',
        title_de: 'HOTELS',
        desc_en: 'We find the right hotels around the globe for the needs of your sports team. The security and facilities of hotels play a major role, as well as good connections to the competition site and an environment suitable for athletes.',
        desc_de: 'Wir finden für die Bedürfnisse Ihrer Sportmannschaft die richtigen Hotels rund um den Globus. Dabei spielen die Sicherheit und die Ausstattung der Hotels eine große Rolle, sowie gute Verbindungen zum Wettkampfort und ein für Sportler:innen passendes Umfeld.'
      },
      {
        num: '02',
        title_en: 'CONFERENCES',
        title_de: 'KONFERENZEN',
        desc_en: 'For meetings, conferences, seminars and events, we will find the right venue for you that suits your athletic participants. This also includes an environment with attractive offers and events.',
        desc_de: 'Für die Besprechungen, Konferenzen, Seminare und Veranstaltungen finden wir für Sie den passenden Veranstaltungsort, der zu Ihren sportlichen Teilnehmenden passt. Dazu gehört auch ein Umfeld mit attraktiven Angeboten und Events.'
      },
      {
        num: '03',
        title_en: 'INCENTIVES',
        title_de: 'TEAMBILDUNG',
        desc_en: 'Whether the national team or the board of directors of the sports association, we will find a suitable motivating and extraordinary activity for you, which will weld you together even more so that you can celebrate successes together.',
        desc_de: 'Ob die Nationalmannschaft oder der Vorstand des Sportverbandes, wir finden für Sie eine passende motivierende und außergewöhnliche Aktivität, die Sie noch enger zusammenschweißt, um gemeinsam Erfolge zu feiern. Langeweile ist uns fremd!'
      }
    ],
    enabled: true
  },
  expertise: {
    type: 'expertise',
    name: 'Expertise for Sporting Success',
    title_en: 'Use our expertise for your sporting success!',
    title_de: 'Nutzen Sie unsere Expertise für Ihren sportlichen Erfolg!',
    p1_en: 'Unlike large companies, sports associations usually do not have their own department specializing in trips to competitions for national teams or sports officials to conferences.',
    p1_de: 'Anders als große Unternehmen haben Sportverbände in der Regel keine eigene Abteilung, die sich nur um die Reisen zu Wettkämpfen der Nationalmannschaften oder der Sportfunktionäre zu Tagungen kümmert.',
    p2_en: 'We take care of the search for the right team hotel for you, organize transport from the airport and to the competition venue, or find the right team building activity.',
    p2_de: 'Wir nehmen Ihnen die Suche des passenden Mannschaftshotels ab, organisieren auf Wunsch den Transport vom Flughafen wie auch zur Wettkampfstätte oder finden die richtige Teambildungsaktivität.',
    p3_en: 'We will look for suitable conference options for your conferences and meetings that suit your sports officials and their needs.',
    p3_de: 'Wir suchen passende Tagungsmöglichkeiten für Ihre Konferenzen und Besprechungen, die zu Ihren Sportfunktionären passen.',
    p4_en: 'We will only propose conference locations with access to suitable sporting facilities. With our many years of experience, we will find exactly the right thing for you.',
    p4_de: 'Keine Konferenzorte ohne sportliches Angebot. Mit unseren langjährigen Erfahrungen werden wir genau das Richtige für Sie finden.',
    enabled: true
  },
  video: {
    type: 'video',
    name: 'International High-Performance Sport Video',
    title_en: 'Our own experiences in international high-performance sport make us experts!',
    title_de: 'Eigene Erfahrungen im internationalen Hochleistungssport machen uns zu Experten!',
    video_url: 'https://www.youtube.com/embed/dD_FThvzO9I?start=76&controls=1',
    p1_en: 'In order to understand the needs of customers from top-class sport, a MICE co-ordinator needs to have had their own experiences at that level.',
    p1_de: 'Um Kunden aus dem Spitzensport verstehen zu können, sollte man eigene Erfahrungen gemacht haben.',
    p2_en: 'How do you know what it means when a sports team competes and travels abroad? What is important to sports officials at conferences? What are their special requirements?',
    p2_de: 'Was bedeutet es, wenn eine Sportmannschaft zu einem Wettkampf reist oder man selbst an einem Wettkampf teilnimmt? Was ist den Sportfunktionären bei Tagungen wichtig? Was sind die besonderen Ansprüche?',
    p3_en: 'We know the answers because we have seen it ourselves!',
    p3_de: 'Wir kennen die Antworten, denn wir haben es selbst erlebt!',
    about_link_text_en: 'See further details in our About Us section.',
    about_link_text_de: 'Erfahren Sie mehr in unserem Bereich Über uns.',
    about_link_url: '/en/About-us/',
    enabled: true
  },
  upcoming: {
    type: 'upcoming',
    name: 'Upcoming Destinations Banner',
    title_en: 'Next: Kenya - Mexico - USA - Brazil - Japan',
    title_de: 'Next: Kenia - Mexiko - USA - Brasilien - Japan',
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
    title_de: 'Häufig gestellte Fragen',
    enabled: true
  },
  contact: {
    type: 'contact',
    name: 'Contact & Inquiry Form Section',
    title_en: 'Contact Us',
    title_de: 'Kontaktieren Sie uns',
    enabled: true
  }
};

// ================= SECTION DROP ZONE =================
export const SectionDropZone = ({ pageKey = 'home', targetIndex = 0, label = 'Drop Section Here', isLast = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const editorCtx = useEditor();

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    try {
      const raw = e.dataTransfer.getData('application/json');
      if (!raw) return;
      const data = JSON.parse(raw);

      if (data.kind === 'move_section') {
        editorCtx.moveSectionTo(data.sourceSectionId, targetIndex);
      } else if (data.kind === 'row') {
        editorCtx.addRowSection(data.layout || '50-50', targetIndex);
      } else if (data.kind === 'section') {
        const template = DEFAULT_NEW_SECTIONS[data.type] || { type: data.type, name: data.name || 'New Section', enabled: true };
        editorCtx.insertSectionAt(template, targetIndex);
      } else if (data.kind === 'block') {
        const rowId = `${pageKey}_sec_${Date.now().toString().slice(-4)}`;
        const newSec = {
          id: rowId,
          type: 'row',
          name: `${data.name || data.type} Section`,
          layout: '100',
          padding_top: 60,
          padding_bottom: 60,
          columns: [
            {
              id: 'col_1',
              width: '100%',
              blocks: [
                {
                  id: `b_${Date.now().toString().slice(-5)}`,
                  type: data.type,
                  ...(data.defaultProps || {})
                }
              ]
            }
          ],
          enabled: true,
          order: targetIndex + 1
        };
        editorCtx.insertSectionAt(newSec, targetIndex);
      }
    } catch (err) {
      console.error('Section drop error:', err);
    }
  };

  return (
    <div
      className={`builder-section-dropzone ${isDragOver ? 'drag-over' : ''} ${isLast ? 'is-last-dropzone' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setIsDragOver(false);
      }}
      onDrop={handleDrop}
    >
      <div className="section-dropzone-line">
        <button
          type="button"
          className="btn-add-section-interstitial"
          onClick={(e) => {
            e.stopPropagation();
            setShowPicker(!showPicker);
          }}
          title="Add New Section Here"
        >
          <Plus size={13} />
          <span>Add Section</span>
        </button>
      </div>

      {isDragOver && (
        <div className="section-drop-indicator">
          <span>↓ DROP HERE TO INSERT ↓</span>
        </div>
      )}

      {/* Quick Section Picker Popover */}
      {showPicker && (
        <div className="section-picker-popover" onClick={(e) => e.stopPropagation()}>
          <div className="popover-header">
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f0f6fc' }}>Insert Section</span>
            <button type="button" onClick={() => setShowPicker(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
          </div>
          <div className="popover-grid">
            <button type="button" className="popover-item" onClick={() => { editorCtx.addRowSection('100', targetIndex); setShowPicker(false); }}>
              <Square size={15} color="#38bdf8" /> <span>1 Col (100%)</span>
            </button>
            <button type="button" className="popover-item" onClick={() => { editorCtx.addRowSection('50-50', targetIndex); setShowPicker(false); }}>
              <Columns size={15} color="#38bdf8" /> <span>2 Cols (50/50)</span>
            </button>
            <button type="button" className="popover-item" onClick={() => { editorCtx.addRowSection('33-33-33', targetIndex); setShowPicker(false); }}>
              <Columns size={15} color="#38bdf8" /> <span>3 Cols (33/33/33)</span>
            </button>
            <button type="button" className="popover-item" onClick={() => { editorCtx.addRowSection('25-25-25-25', targetIndex); setShowPicker(false); }}>
              <Columns size={15} color="#38bdf8" /> <span>4 Cols (25% each)</span>
            </button>
            <button type="button" className="popover-item" onClick={() => { editorCtx.insertSectionAt(DEFAULT_NEW_SECTIONS.hero, targetIndex); setShowPicker(false); }}>
              <Layout size={15} color="#10b981" /> <span>Hero Banner</span>
            </button>
            <button type="button" className="popover-item" onClick={() => { editorCtx.insertSectionAt(DEFAULT_NEW_SECTIONS.cards, targetIndex); setShowPicker(false); }}>
              <Sparkles size={15} color="#f59e0b" /> <span>4 Feature Cards</span>
            </button>
            <button type="button" className="popover-item" onClick={() => { editorCtx.insertSectionAt(DEFAULT_NEW_SECTIONS.stats, targetIndex); setShowPicker(false); }}>
              <Trophy size={15} color="#ef4444" /> <span>Stats Counter</span>
            </button>
            <button type="button" className="popover-item" onClick={() => { editorCtx.insertSectionAt(DEFAULT_NEW_SECTIONS.cta, targetIndex); setShowPicker(false); }}>
              <Zap size={15} color="#a855f7" /> <span>CTA Callout</span>
            </button>
            <button type="button" className="popover-item" onClick={() => { editorCtx.insertSectionAt(DEFAULT_NEW_SECTIONS.faq, targetIndex); setShowPicker(false); }}>
              <HelpCircle size={15} color="#8b5cf6" /> <span>FAQ Accordion</span>
            </button>
            <button type="button" className="popover-item" onClick={() => { editorCtx.insertSectionAt(DEFAULT_NEW_SECTIONS.testimonials, targetIndex); setShowPicker(false); }}>
              <MessageSquareQuote size={15} color="#38bdf8" /> <span>Testimonials</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= BLOCK DROP ZONE =================
export const BlockDropZone = ({ sectionId, colId, targetIndex = 0, label = 'Drop Element Here' }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const editorCtx = useEditor();

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    try {
      const raw = e.dataTransfer.getData('application/json');
      if (!raw) return;
      const data = JSON.parse(raw);

      if (data.kind === 'move_block') {
        editorCtx.moveBlockTo(data.sourceSectionId, data.sourceColId, data.blockId, sectionId, colId, targetIndex);
      } else if (data.kind === 'block') {
        editorCtx.insertBlockAt(sectionId, colId, data.type, data.defaultProps || {}, targetIndex);
      }
    } catch (err) {
      console.error('Block drop error:', err);
    }
  };

  return (
    <div
      className={`builder-block-dropzone ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setIsDragOver(false);
      }}
      onDrop={handleDrop}
    >
      <div className="block-dropzone-line"></div>
      {isDragOver && (
        <div className="block-drop-indicator">
          <span>↓ DROP HERE ↓</span>
        </div>
      )}
    </div>
  );
};

/**
 * 3D Interactive Feature Card with Smooth Perspective Tilt & Mouse Tracking
 */
export const Pillar3DCard = ({
  card,
  idx,
  lang,
  isEditorActive,
  editorCtx,
  sectionId,
  isMobileDeck = false
}) => {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
    glareX: 50,
    glareY: 50,
    glareOpacity: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const rafId = useRef(null);

  const isCardSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.cardIndex === idx && editorCtx.selectedElement?.type === 'section_card';
  const isNumSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.cardIndex === idx && editorCtx.selectedElement?.type === 'pillar_num';
  const isTitleSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.cardIndex === idx && editorCtx.selectedElement?.type === 'pillar_title';
  const isDescSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.cardIndex === idx && editorCtx.selectedElement?.type === 'pillar_desc';

  const pTitle = lang === 'de' ? (card.title_de || card.title_en) : (card.title_en || card.title_de);
  const pDesc = lang === 'de' ? (card.desc_de || card.desc_en) : (card.desc_en || card.desc_de);

  const handleMouseMove = (e) => {
    if (isEditorActive && !editorCtx.isPreviewMode) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5.5; // subtle tilt: -5.5 to +5.5 deg
    const rotateY = ((x - centerX) / centerX) * 5.5;  // subtle tilt: -5.5 to +5.5 deg

    const glareX = Math.round((x / rect.width) * 100);
    const glareY = Math.round((y / rect.height) * 100);

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale(1.02)`,
        boxShadow: `0 20px 36px -8px rgba(0, 0, 0, 0.11), 0 0 16px rgba(255, 0, 0, 0.05), ${rotateY > 0 ? '3px' : '-3px'} 8px 18px rgba(0, 0, 0, 0.04)`,
        glareX,
        glareY,
        glareOpacity: 0.16
      });
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
      glareX: 50,
      glareY: 50,
      glareOpacity: 0
    });
  };

  const isLongDesc = pDesc && pDesc.length > 120;

  return (
    <div
      ref={cardRef}
      className={`home-feature-card ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isCardSelected ? 'element-selected-active' : ''} ${isExpanded ? 'card-expanded' : ''}`}
      style={{
        transform: tiltStyle.transform,
        boxShadow: tiltStyle.boxShadow,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        if (isEditorActive && !editorCtx.isPreviewMode) {
          e.stopPropagation();
          editorCtx.setSelectedSectionId(sectionId);
          editorCtx.setSelectedElement({
            type: 'section_card',
            sectionId: sectionId,
            cardIndex: idx,
            card: card
          });
        }
      }}
    >
      {/* Dynamic specular glare overlay */}
      <div
        className="card-glare-overlay"
        style={{
          background: `radial-gradient(circle at ${tiltStyle.glareX}% ${tiltStyle.glareY}%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 65%)`,
          opacity: tiltStyle.glareOpacity,
          pointerEvents: 'none'
        }}
      />

      {/* Floating card toolbar in CMS builder mode */}
      {isEditorActive && !editorCtx.isPreviewMode && (
        <div className="floating-card-toolbar" onClick={(e) => e.stopPropagation()}>
          <span className="card-toolbar-label">CARD {card.num || `0${idx + 1}`}</span>
          <button
            type="button"
            className="card-tool-btn"
            onClick={() => editorCtx.duplicateSectionCard(sectionId, idx)}
            title="Duplicate Card"
          >
            <Copy size={12} /> <span>Duplicate</span>
          </button>
          <button
            type="button"
            className="card-tool-btn delete-tool-btn"
            onClick={() => editorCtx.deleteSectionCard(sectionId, idx)}
            title="Delete Card"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Card Header: Number Badge */}
      <div className="card-top-row">
        <div
          className={`card-num-box ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isNumSelected ? 'element-selected-active' : ''}`}
          onClick={(e) => {
            if (isEditorActive && !editorCtx.isPreviewMode) {
              e.stopPropagation();
              editorCtx.setSelectedSectionId(sectionId);
              editorCtx.setSelectedElement({
                type: 'pillar_num',
                sectionId: sectionId,
                cardIndex: idx,
                num: card.num
              });
            }
          }}
          style={{ position: 'relative', display: 'inline-block' }}
        >
          {isEditorActive && !editorCtx.isPreviewMode && (
            <span className="element-badge-tag">NUMBER</span>
          )}
          <div className="card-num-badge">
            {isEditorActive && !editorCtx.isPreviewMode ? (
              <span
                contentEditable
                suppressContentEditableWarning
                className="builder-inline-editable"
                onBlur={(e) => {
                  const val = e.currentTarget.innerText;
                  editorCtx.updateSectionCard(sectionId, idx, { num: val });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
              >
                {card.num || `0${idx + 1}`}
              </span>
            ) : (
              card.num || `0${idx + 1}`
            )}
          </div>
        </div>
        <div className="card-accent-pill">Pillar 0{idx + 1}</div>
      </div>

      {/* Card Title */}
      <div
        className={`card-title-box ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isTitleSelected ? 'element-selected-active' : ''}`}
        onClick={(e) => {
          if (isEditorActive && !editorCtx.isPreviewMode) {
            e.stopPropagation();
            editorCtx.setSelectedSectionId(sectionId);
            editorCtx.setSelectedElement({
              type: 'pillar_title',
              sectionId: sectionId,
              cardIndex: idx,
              text_en: card.title_en,
              text_de: card.title_de
            });
          }
        }}
        style={{ position: 'relative' }}
      >
        {isEditorActive && !editorCtx.isPreviewMode && (
          <span className="element-badge-tag">TITLE</span>
        )}
        <h3 className="card-title">
          {isEditorActive && !editorCtx.isPreviewMode ? (
            <span
              contentEditable
              suppressContentEditableWarning
              className="builder-inline-editable"
              onBlur={(e) => {
                const val = e.currentTarget.innerText;
                editorCtx.updateSectionCard(sectionId, idx, { [lang === 'de' ? 'title_de' : 'title_en']: val });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
            >
              {pTitle}
            </span>
          ) : (
            pTitle
          )}
        </h3>
      </div>

      {/* Card Description */}
      <div
        className={`card-desc-box ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isDescSelected ? 'element-selected-active' : ''}`}
        onClick={(e) => {
          if (isEditorActive && !editorCtx.isPreviewMode) {
            e.stopPropagation();
            editorCtx.setSelectedSectionId(sectionId);
            editorCtx.setSelectedElement({
              type: 'pillar_desc',
              sectionId: sectionId,
              cardIndex: idx,
              desc_en: card.desc_en,
              desc_de: card.desc_de
            });
          }
        }}
        style={{ position: 'relative' }}
      >
        {isEditorActive && !editorCtx.isPreviewMode && (
          <span className="element-badge-tag">DESC</span>
        )}
        <p className={`card-desc ${isMobileDeck && !isExpanded && isLongDesc ? 'card-desc-clamped' : ''}`}>
          {isEditorActive && !editorCtx.isPreviewMode ? (
            <span
              contentEditable
              suppressContentEditableWarning
              className="builder-inline-editable"
              onBlur={(e) => {
                const val = e.currentTarget.innerText;
                editorCtx.updateSectionCard(sectionId, idx, { [lang === 'de' ? 'desc_de' : 'desc_en']: val });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
            >
              {pDesc}
            </span>
          ) : (
            pDesc
          )}
        </p>
      </div>

      {/* Mobile Expand / Read More toggle */}
      {isMobileDeck && isLongDesc && !isEditorActive && (
        <button
          type="button"
          className="card-expand-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? (lang === 'de' ? 'Weniger anzeigen' : 'Show Less') : (lang === 'de' ? 'Mehr lesen' : 'Read More')}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      )}

      {/* Subtle bottom decorative accent bar */}
      <div className="card-bottom-bar" />
    </div>
  );
};

/**
 * Mobile Interactive Swipe Deck with Tab Pills and Touch Gestures
 */
export const PillarCardsMobileDeck = ({
  cards,
  lang,
  isEditorActive,
  editorCtx,
  sectionId
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 35;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  return (
    <div className="mobile-cards-deck-wrapper">
      {/* Navigation Pill Tabs */}
      <div className="mobile-deck-tabs">
        {cards.map((c, i) => (
          <button
            key={i}
            type="button"
            className={`mobile-deck-tab ${activeIndex === i ? 'tab-active' : ''}`}
            onClick={() => setActiveIndex(i)}
          >
            <span className="tab-num">{c.num || `0${i + 1}`}</span>
            <span className="tab-title">
              {lang === 'de' ? (c.title_de || c.title_en) : (c.title_en || c.title_de)}
            </span>
          </button>
        ))}
      </div>

      {/* Swipeable Card Viewport */}
      <div className="mobile-deck-viewport">
        <motion.div
          key={activeIndex}
          className="mobile-deck-card-container"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, x: 25, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -25, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ touchAction: 'pan-y' }}
        >
          <Pillar3DCard
            card={cards[activeIndex]}
            idx={activeIndex}
            lang={lang}
            isEditorActive={isEditorActive}
            editorCtx={editorCtx}
            sectionId={sectionId}
            isMobileDeck={true}
          />
        </motion.div>
      </div>

      {/* Swipe Controls & Pagination Indicators */}
      <div className="mobile-deck-footer">
        <button
          type="button"
          className="deck-nav-btn"
          onClick={handlePrev}
          aria-label="Previous card"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="deck-indicators">
          {cards.map((_, i) => (
            <span
              key={i}
              className={`deck-dot ${activeIndex === i ? 'dot-active' : ''}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className="deck-nav-btn"
          onClick={handleNext}
          aria-label="Next card"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mobile-swipe-hint">
        <span>← {lang === 'de' ? 'Wischen Sie für nächste Karte' : 'Swipe left/right to explore'} →</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* HOME INTRO ULTRA-PREMIUM INTERACTIVE CARD DECK SECTION                     */
/* -------------------------------------------------------------------------- */
export const HomeIntroCardDeck = ({
  section,
  isBuilderMode,
  isEditorActive,
  editorCtx,
  lang,
  renderInlineText,
  customStyle,
  anim
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const title = lang === 'de' ? (section.title_de || section.title_en) : (section.title_en || section.title_de);
  const p1 = lang === 'de' ? (section.p1_de || section.p1_en) : (section.p1_en || section.p1_de) || 'Be it at competitions or team building of the national teams or at conferences, events or meetings of sports associations, the focus must always be on sport and its further development.';
  const p2 = lang === 'de' ? (section.p2_de || section.p2_en) : (section.p2_en || section.p2_de) || 'It is particularly important that the infrastructure suits the needs to the attendees. Hotels need to be able to deal with the needs of sports teams, team building activities have to meet the special demands of athletes and conference rooms should suit active athletic participants.';
  const p3 = lang === 'de' ? (section.p3_de || section.p3_en) : (section.p3_en || section.p3_de) || 'For events to be successful, the environment must also be suit the sporting characteristics of the customer.';

  const cardsData = [
    {
      id: 1,
      badge: 'PILLAR 01 • CHAMPIONSHIP LOGISTICS',
      title: 'Global Competition Focus',
      icon: Globe2,
      text: p1,
      accentColor: '#38bdf8',
    },
    {
      id: 2,
      badge: 'PILLAR 02 • ATHLETE INFRASTRUCTURE',
      title: 'Tailored Venue & Hotel Logistics',
      icon: ShieldCheck,
      text: p2,
      accentColor: '#e60000',
    },
    {
      id: 3,
      badge: 'PILLAR 03 • PERFORMANCE ENVIRONMENT',
      title: 'Optimal Success Environment',
      icon: Trophy,
      text: p3,
      accentColor: '#2563eb',
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cardsData.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, cardsData.length]);

  return (
    <section
      className={`home-intro-section ${isBuilderMode ? 'builder-section-preview' : ''}`}
      style={customStyle}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => {
        if (isEditorActive && !editorCtx.isPreviewMode) {
          editorCtx.setSelectedSectionId(section.id);
          editorCtx.setSelectedElement({ type: 'section', sectionId: section.id, section });
        }
      }}
    >
      {/* Soft lavender glowing ambient glass orbs */}
      <div className="spatial-bg-glow glow-purple"></div>
      <div className="spatial-bg-glow glow-cyan"></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Main Title with Motion Scroll Reveal */}
        <motion.h2 
          className="section-main-title home-intro-title" 
          style={{ color: section.heading_color || undefined }}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderInlineText(
            lang === 'de' ? 'title_de' : 'title_en',
            title,
            'Sport needs professional structures when traveling to competitions, team building and conferences around the world',
            'span'
          )}
        </motion.h2>

        {/* Interactive Card Deck / Book Slide Deck */}
        <div className="intro-card-deck-wrapper">
          
          {/* Auto-Slide Progress Tabs with Staggered Scroll Reveal */}
          <div className="deck-progress-tabs">
            {cardsData.map((card, idx) => (
              <motion.button
                key={card.id}
                type="button"
                className={`deck-tab-btn ${activeIndex === idx ? 'active-tab' : ''}`}
                onClick={() => setActiveIndex(idx)}
                initial={{ opacity: 0, y: -25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="tab-number">0{card.id}</span>
                <span className="tab-label">{card.title}</span>
                <div className="tab-progress-bar">
                  <div 
                    className="tab-progress-fill"
                    style={{ 
                      width: activeIndex === idx ? '100%' : '0%',
                      transition: activeIndex === idx && !isPaused ? 'width 4.5s linear' : 'none'
                    }} 
                  />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Interactive Cards Display with Asymmetrical Split Entrance Animation */}
          <div className="deck-cards-grid">
            {cardsData.map((card, idx) => {
              const IconComp = card.icon;
              const isActive = activeIndex === idx;

              // Asymmetrical entry directions for the 3 cards in this section:
              // Card 1: Enters from LEFT (x: -65px)
              // Card 2: Enters from BOTTOM (y: 65px)
              // Card 3: Enters from RIGHT (x: 65px)
              const cardInitial = idx === 0 
                ? { opacity: 0, x: -65, y: 0 } 
                : idx === 1 
                ? { opacity: 0, x: 0, y: 65 } 
                : { opacity: 0, x: 65, y: 0 };

              return (
                <motion.div
                  key={card.id}
                  className={`intro-deck-card ${isActive ? 'active-deck-card' : 'inactive-deck-card'}`}
                  onClick={() => setActiveIndex(idx)}
                  initial={cardInitial}
                  whileInView={{
                    opacity: isActive ? 1 : 0.85,
                    x: 0,
                    y: isActive ? -6 : 0,
                    scale: isActive ? 1.03 : 0.96,
                  }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.7, delay: idx * 0.14, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.25, ease: "easeOut" }
                  }}
                  style={{
                    borderTop: `3px solid ${card.accentColor}`,
                  }}
                >
                  <div className="card-top-row">
                    <span className="intro-card-badge" style={{ color: card.accentColor, borderColor: `${card.accentColor}40` }}>
                      {card.badge}
                    </span>
                    <div className="card-icon-bubble" style={{ background: `${card.accentColor}18`, color: card.accentColor }}>
                      <IconComp size={22} />
                    </div>
                  </div>

                  <motion.h3 
                    className="intro-card-title"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                  >
                    {card.title}
                  </motion.h3>

                  <motion.p 
                    className="intro-card-desc"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                  >
                    {idx === 0
                      ? renderInlineText(lang === 'de' ? 'p1_de' : 'p1_en', p1, card.text, 'span')
                      : idx === 1
                      ? renderInlineText(lang === 'de' ? 'p2_de' : 'p2_en', p2, card.text, 'span')
                      : renderInlineText(lang === 'de' ? 'p3_de' : 'p3_en', p3, card.text, 'span')}
                  </motion.p>

                  <div className="card-bottom-footer">
                    <span className="card-counter">PILLAR 0{card.id} / 03</span>
                    <div className={`pulse-active-dot ${isActive ? 'active-dot' : ''}`} style={{ backgroundColor: card.accentColor }} />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export const DynamicSectionRenderer = ({
  section,
  pageKey = 'home',
  isBuilderMode = null,
  isSelected = null,
  onSelect = null,
  onInlineChange = null,
  activeViewport = 'desktop'
}) => {
  const { lang, t } = useLanguage();
  const { cmsConfig } = useSite();
  const editorCtx = useEditor();
  const [openFaqId, setOpenFaqId] = useState(null);
  const [testingVideoMap, setTestingVideoMap] = useState({});
  const [hoveredServiceCardId, setHoveredServiceCardId] = useState(null);

  const isEditorActive = isBuilderMode !== null ? isBuilderMode : editorCtx.editorMode;
  const isSectionSelected = isSelected !== null ? isSelected : (editorCtx.selectedSectionId === section?.id);
  const curViewport = activeViewport || editorCtx.viewport || 'desktop';

  if (!section || (section.enabled === false && !isEditorActive)) {
    return null;
  }

  // Animation settings for section
  const sectionAnimations = cmsConfig?.animations?.sections || {};
  const anim = section.animation || sectionAnimations[section.id] || {
    type: 'up',
    duration: 0.55,
    delay: 0.1
  };

  // Section style overrides with responsive cascade
  const customPaddingTop = getResponsiveValue(section, 'padding_top', curViewport);
  const customPaddingBottom = getResponsiveValue(section, 'padding_bottom', curViewport);
  const customPaddingLeft = getResponsiveValue(section, 'padding_left', curViewport);
  const customPaddingRight = getResponsiveValue(section, 'padding_right', curViewport);
  const customMarginTop = getResponsiveValue(section, 'margin_top', curViewport);
  const customMarginBottom = getResponsiveValue(section, 'margin_bottom', curViewport);
  const customMarginLeft = getResponsiveValue(section, 'margin_left', curViewport);
  const customMarginRight = getResponsiveValue(section, 'margin_right', curViewport);
  const customMinHeight = getResponsiveValue(section, 'min_height', curViewport);
  const customTextAlign = getResponsiveValue(section, 'text_align', curViewport);

  const padTopVal = customPaddingTop !== '' && customPaddingTop !== undefined && customPaddingTop !== null ? customPaddingTop : (section.padding_top !== undefined ? section.padding_top : undefined);
  const padBottomVal = customPaddingBottom !== '' && customPaddingBottom !== undefined && customPaddingBottom !== null ? customPaddingBottom : (section.padding_bottom !== undefined ? section.padding_bottom : undefined);
  const padLeftVal = customPaddingLeft !== '' && customPaddingLeft !== undefined && customPaddingLeft !== null ? customPaddingLeft : (section.padding_left !== undefined ? section.padding_left : undefined);
  const padRightVal = customPaddingRight !== '' && customPaddingRight !== undefined && customPaddingRight !== null ? customPaddingRight : (section.padding_right !== undefined ? section.padding_right : undefined);

  const customStyle = {
    backgroundColor: section.bg_color || section.background_color || undefined,
    color: section.text_color || undefined,
    paddingTop: padTopVal !== undefined ? `${padTopVal}px` : undefined,
    paddingBottom: padBottomVal !== undefined ? `${padBottomVal}px` : undefined,
    paddingLeft: padLeftVal !== undefined ? `${padLeftVal}px` : undefined,
    paddingRight: padRightVal !== undefined ? `${padRightVal}px` : undefined,
    marginTop: customMarginTop !== '' && customMarginTop !== undefined && customMarginTop !== null ? `${customMarginTop}px` : (section.margin_top !== undefined ? `${section.margin_top}px` : undefined),
    marginBottom: customMarginBottom !== '' && customMarginBottom !== undefined && customMarginBottom !== null ? `${customMarginBottom}px` : (section.margin_bottom !== undefined ? `${section.margin_bottom}px` : undefined),
    marginLeft: customMarginLeft !== '' && customMarginLeft !== undefined && customMarginLeft !== null ? `${customMarginLeft}px` : (section.margin_left !== undefined ? `${section.margin_left}px` : undefined),
    marginRight: customMarginRight !== '' && customMarginRight !== undefined && customMarginRight !== null ? `${customMarginRight}px` : (section.margin_right !== undefined ? `${section.margin_right}px` : undefined),
    minHeight: customMinHeight !== '' && customMinHeight !== undefined && customMinHeight !== null ? (String(customMinHeight).includes('px') || String(customMinHeight).includes('vh') ? customMinHeight : `${customMinHeight}px`) : (section.min_height ? (String(section.min_height).includes('px') ? section.min_height : `${section.min_height}px`) : undefined),
    borderWidth: section.border_width ? `${section.border_width}px` : undefined,
    borderStyle: section.border_style || (section.border_width ? 'solid' : undefined),
    borderColor: section.border_color || undefined,
    borderRadius: section.border_radius ? `${section.border_radius}px` : undefined,
    boxShadow: section.shadow || undefined,
    opacity: (section.opacity !== undefined && section.opacity !== null && section.opacity !== '') ? section.opacity : undefined,
    textAlign: customTextAlign || section.text_align || undefined,
    '--section-heading-color': section.heading_color || undefined
  };

  // Inline text editing helper
  const renderInlineText = (fieldKey, value, fallback, tag = 'span', className = '', style = {}) => {
    const textVal = value !== undefined && value !== null && value !== '' ? value : fallback;
    if (isEditorActive) {
      return (
        <span
          contentEditable
          suppressContentEditableWarning
          className={`builder-inline-editable ${className}`}
          style={{ ...style, outline: 'none' }}
          onBlur={(e) => {
            const newVal = e.currentTarget.innerText;
            if (onInlineChange) {
              onInlineChange(section.id, fieldKey, newVal);
            } else {
              editorCtx.updateSectionField(section.id, fieldKey, newVal);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            editorCtx.setSelectedSectionId(section.id);
            editorCtx.setSelectedElement({ sectionId: section.id, fieldKey, value: textVal });
          }}
          title="Click to edit text directly"
        >
          {textVal}
        </span>
      );
    }
    const Tag = tag;
    return <Tag className={className} style={style}>{textVal}</Tag>;
  };

  // Clickable image replacement in editor mode
  const renderEditableImage = (imgField, src, alt, className = '', style = {}) => {
    if (isEditorActive) {
      return (
        <div
          className="editable-image-wrapper"
          style={{ position: 'relative', display: 'inline-block', width: '100%', height: '100%', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            editorCtx.setSelectedSectionId(section.id);
            editorCtx.triggerMediaPicker((newUrl) => {
              if (onInlineChange) {
                onInlineChange(section.id, imgField, newUrl);
              } else {
                editorCtx.updateSectionField(section.id, imgField, newUrl);
              }
            });
          }}
          title="Click to replace image"
        >
          <img src={src} alt={alt} className={className} style={style} loading="lazy" decoding="async" />
          <div className="editable-image-overlay">
            <Upload size={14} />
            <span>Replace</span>
          </div>
        </div>
      );
    }
    return <img src={src} alt={alt} className={className} style={style} loading="lazy" decoding="async" />;
  };

  // Clickable button with styling, links, and property inspector integration
  const renderEditableButton = ({
    fieldPrefix = 'cta_button',
    fallbackText = 'Get Free Consultation',
    defaultLink = '/en/Contact/',
    className = 'btn-red-pill',
    icon = <ArrowRight size={16} />,
    wrapperStyle = {}
  }) => {
    const textEn = section[`${fieldPrefix}_text_en`] || section[`${fieldPrefix}_text`] || fallbackText;
    const textDe = section[`${fieldPrefix}_text_de`] || section[`${fieldPrefix}_text`] || fallbackText;
    const resolvedText = lang === 'de' ? (textDe || textEn) : textEn;
    const resolvedLink = section[`${fieldPrefix}_link`] || section[`${fieldPrefix}_url`] || defaultLink;
    const resolvedLinkType = section[`${fieldPrefix}_link_type`] || 'internal';
    const resolvedTarget = section[`${fieldPrefix}_target`] || '_self';

    const bg = section[`${fieldPrefix}_bg_color`];
    const textColor = section[`${fieldPrefix}_text_color`];
    const hoverBg = section[`${fieldPrefix}_hover_bg_color`];
    const hoverTextColor = section[`${fieldPrefix}_hover_text_color`];
    const borderRadius = section[`${fieldPrefix}_border_radius`];
    const padding = section[`${fieldPrefix}_padding`];
    const borderColor = section[`${fieldPrefix}_border_color`];
    const fontSize = section[`${fieldPrefix}_font_size`];
    const fontWeight = section[`${fieldPrefix}_font_weight`];
    const hoverAnim = section[`${fieldPrefix}_hover_animation`] || 'scale';

    const isSelected = isEditorActive && !editorCtx.isPreviewMode &&
      editorCtx.selectedElement?.sectionId === section.id &&
      editorCtx.selectedElement?.fieldPrefix === fieldPrefix;

    const btnStyle = {
      '--btn-custom-bg': bg || undefined,
      '--btn-custom-color': textColor || undefined,
      '--btn-custom-hover-bg': hoverBg || undefined,
      '--btn-custom-hover-color': hoverTextColor || undefined,
      background: bg ? bg : undefined,
      backgroundColor: bg || undefined,
      backgroundImage: bg ? 'none' : undefined,
      color: textColor || undefined,
      borderRadius: borderRadius ? (borderRadius.includes('px') || borderRadius.includes('%') ? borderRadius : `${borderRadius}px`) : undefined,
      padding: padding || undefined,
      border: borderColor ? `2px solid ${borderColor}` : undefined,
      fontSize: fontSize || undefined,
      fontWeight: fontWeight || undefined,
      boxShadow: bg ? `0 4px 14px ${bg}44` : undefined
    };

    const handleClick = (e) => {
      if (isEditorActive && !editorCtx.isPreviewMode) {
        e.preventDefault();
        e.stopPropagation();
        editorCtx.setSelectedSectionId(section.id);
        editorCtx.setSelectedElement({
          type: 'button',
          sectionId: section.id,
          fieldPrefix,
          text_en: textEn,
          text_de: textDe,
          link: resolvedLink,
          link_type: resolvedLinkType,
          target: resolvedTarget,
          bg_color: bg || '#ff0000',
          text_color: textColor || '#ffffff',
          hover_bg_color: hoverBg || '#cc0000',
          hover_text_color: hoverTextColor || '#ffffff',
          border_color: borderColor || '',
          border_radius: borderRadius || '50px',
          padding: padding || '14px 32px',
          font_size: fontSize || '1rem',
          font_weight: fontWeight || 700,
          hover_animation: hoverAnim
        });
      }
    };

    return (
      <div style={wrapperStyle}>
        <NavLink
          to={isEditorActive && !editorCtx.isPreviewMode ? '#' : resolvedLink}
          target={isEditorActive && !editorCtx.isPreviewMode ? undefined : resolvedTarget}
          className={`${className} btn-magnetic ${isSelected ? 'builder-element-selected' : ''}`}
          style={btnStyle}
          onClick={handleClick}
          onMouseMove={handleMagnetMove}
          onMouseLeave={handleMagnetLeave}
          title={isEditorActive && !editorCtx.isPreviewMode ? 'Click to customize button link, text, and colors' : undefined}
        >
          <span>
            {renderInlineText(
              lang === 'de' ? `${fieldPrefix}_text_de` : `${fieldPrefix}_text_en`,
              resolvedText,
              fallbackText,
              'span'
            )}
          </span>
          {icon}
        </NavLink>
      </div>
    );
  };

  const icons = [Globe2, Trophy, Users, ShieldCheck];

  const AboutStoryCarousel = ({ defaultPhoto, isEditing, editorCtx, sectionId }) => {
    const slides = [
      {
        src: defaultPhoto || '/assets/images/about_hockey_referee.jpeg',
        caption: lang === 'de' ? 'Marc Knuelle – Internationaler Schiedsrichter' : 'Marc Knuelle – International Referee'
      },
      {
        src: '/assets/images/service_hero_bg.jpg',
        caption: lang === 'de' ? 'Marc Knuelle – Spitzensport Logistik' : 'Marc Knuelle – High Performance Sports Logistics'
      },
      {
        src: '/assets/images/service_teambuilding.png',
        caption: lang === 'de' ? 'K-Consulting – Globale Delegationsbetreuung' : 'K-Consulting – Global Delegation & MICE Events'
      }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 3500);
      return () => clearInterval(timer);
    }, [slides.length]);

    return (
      <div className="story-carousel-outer-wrapper">
        <div 
          className="story-photo-card liquid-glass-carousel-frame" 
          onClick={(e) => {
            if (isEditing) {
              e.stopPropagation();
              editorCtx.setSelectedSectionId(sectionId);
              editorCtx.setSelectedElement({ type: 'image', sectionId, fieldKey: 'photo', src: slides[currentIndex].src });
            }
          }}
        >
          {/* Specular gloss top curved shine */}
          <div className="liquid-glass-gloss-shine" />

          <div className="story-carousel-viewport">
            {slides.map((slide, idx) => (
              <img
                key={idx}
                src={slide.src}
                alt={slide.caption}
                className="story-founder-img"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: idx === currentIndex ? 1 : 0,
                  transform: idx === currentIndex ? 'scale(1)' : 'scale(1.06)',
                  transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'block'
                }}
              />
            ))}
          </div>

          {/* FLOATING LIQUID GLASS CAPTION & DOTS PILL BAR */}
          <div className="story-caption-glass-pill">
            <div className="caption-left">
              <Award size={18} className="caption-award-icon" />
              <span className="caption-text">{slides[currentIndex].caption}</span>
            </div>
            
            {/* Carousel Navigation Dots */}
            <div className="caption-dots">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                  className={`caption-dot-btn ${idx === currentIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // SECTION RENDERERS EVALUATION
  const renderSectionInner = () => {
    // 1. HOME HERO (Only on Home page)
    if (section.id === 'home_hero' || (pageKey === 'home' && (section.type === 'hero' || section.type === 'hero_banner'))) {
      return <Cinematic3DHero section={section} pageKey={pageKey} />;
    }

    // 2. HOME INTRO EXPLANATION SECTION (Interactive Card Deck)
    if (section.id === 'home_intro' || section.type === 'home_intro') {
      return (
        <HomeIntroCardDeck
          section={section}
          isBuilderMode={isBuilderMode}
          isEditorActive={isEditorActive}
          editorCtx={editorCtx}
          lang={lang}
          renderInlineText={renderInlineText}
          customStyle={customStyle}
          anim={anim}
        />
      );
    }

    // 2. STATS SECTION
    if (section.id === 'home_stats' || section.type === 'stats') {
      const stat1Num = parseInt(section.stat1_num) || 15;
      const stat2Num = parseInt(section.stat2_num) || 500;
      const stat3Num = parseInt(section.stat3_num) || 35;
      const stat4Num = parseInt(section.stat4_num) || 100;

      return (
        <section className={`home-stats-section ${isBuilderMode ? 'builder-section-preview' : ''}`} style={customStyle}>
          <div className="container">
            <div className="stats-grid">
              <AnimatedCard index={0} className="stat-item">
                <div className="stat-icon-wrap"><Clock size={24} /></div>
                <div>
                  <div className="stat-number">
                    {isBuilderMode ? `${stat1Num}${section.stat1_suffix || '+'}` : <AnimatedCounter end={stat1Num} suffix={section.stat1_suffix || '+'} />}
                  </div>
                  <div className="stat-label">
                    {renderInlineText(
                      lang === 'de' ? 'stat1_label_de' : 'stat1_label_en',
                      lang === 'de' ? section.stat1_label_de : section.stat1_label_en,
                      'Years in High-Performance Sport',
                      'span'
                    )}
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard index={1} className="stat-item">
                <div className="stat-icon-wrap"><Trophy size={24} /></div>
                <div>
                  <div className="stat-number">
                    {isBuilderMode ? `${stat2Num}${section.stat2_suffix || '+'}` : <AnimatedCounter end={stat2Num} suffix={section.stat2_suffix || '+'} />}
                  </div>
                  <div className="stat-label">
                    {renderInlineText(
                      lang === 'de' ? 'stat2_label_de' : 'stat2_label_en',
                      lang === 'de' ? section.stat2_label_de : section.stat2_label_en,
                      'Tailor-Made Sports & MICE Events',
                      'span'
                    )}
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard index={2} className="stat-item">
                <div className="stat-icon-wrap"><MapPin size={24} /></div>
                <div>
                  <div className="stat-number">
                    {isBuilderMode ? `${stat3Num}${section.stat3_suffix || '+'}` : <AnimatedCounter end={stat3Num} suffix={section.stat3_suffix || '+'} />}
                  </div>
                  <div className="stat-label">
                    {renderInlineText(
                      lang === 'de' ? 'stat3_label_de' : 'stat3_label_en',
                      lang === 'de' ? section.stat3_label_de : section.stat3_label_en,
                      'Global Destinations Worldwide',
                      'span'
                    )}
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard index={3} className="stat-item">
                <div className="stat-icon-wrap"><CheckCircle2 size={24} /></div>
                <div>
                  <div className="stat-number">
                    {isBuilderMode ? `${stat4Num}${section.stat4_suffix || '%'}` : <AnimatedCounter end={stat4Num} suffix={section.stat4_suffix || '%'} />}
                  </div>
                  <div className="stat-label">
                    {renderInlineText(
                      lang === 'de' ? 'stat4_label_de' : 'stat4_label_en',
                      lang === 'de' ? section.stat4_label_de : section.stat4_label_en,
                      'Personal Consultation & Execution',
                      'span'
                    )}
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </section>
      );
    }

    // 3. 3 PILLARS / FEATURE CARDS (the home page's own pillars section keeps its
    // existing bento-dashboard visual treatment; any other cards/features section
    // renders its actual `cards` collection, in a carousel once it has more than
    // MAX_CARDS_PER_ROW items or the admin explicitly chose "Create Carousel")
    if (section.id === 'home_cards') {
      return <BentoSportsSection section={section} />;
    }
    if (section.type === 'cards' || section.type === 'features') {
      const cards = (section.cards || []).filter(c => c.enabled !== false);
      // 4 cards per row is the admin's own "normal content" limit (AdminWebsiteBuilder's
      // MAX_CARDS_PER_ROW) — past that, or once the admin opts in via "Create Carousel",
      // the row becomes a horizontally scrollable carousel instead of growing sideways.
      const useCarousel = section.display_mode === 'carousel' || cards.length > 4;

      const cardEls = cards.map((card, idx) => (
        <div key={card.id || idx} className="generic-feature-card">
          {card.image && <img src={card.image} alt={card.title_en || ''} className="generic-feature-card-img" loading="lazy" />}
          {card.num && <span className="generic-feature-card-num">{card.num}</span>}
          <h3 className="generic-feature-card-title">
            {lang === 'de' ? (card.title_de || card.title_en) : (card.title_en || card.title_de)}
          </h3>
          <p className="generic-feature-card-desc">
            {lang === 'de' ? (card.desc_de || card.desc_en) : (card.desc_en || card.desc_de)}
          </p>
        </div>
      ));

      return (
        <section className={`generic-feature-section ${isBuilderMode ? 'builder-section-preview' : ''}`} style={customStyle}>
          <div className="container">
            {useCarousel ? (
              <div className="generic-feature-carousel">{cardEls}</div>
            ) : (
              <div className="generic-feature-grid">{cardEls}</div>
            )}
          </div>
        </section>
      );
    }

    // 4. HOME EXPERTISE SECTION (Use our expertise for your sporting success!)
    if (section.id === 'home_expertise' || section.type === 'expertise') {
      const title = lang === 'de' ? (section.title_de || section.title_en) : (section.title_en || section.title_de);
      const p1 = lang === 'de' ? (section.p1_de || section.p1_en) : (section.p1_en || section.p1_de);
      const p2 = lang === 'de' ? (section.p2_de || section.p2_en) : (section.p2_en || section.p2_de);
      const p3 = lang === 'de' ? (section.p3_de || section.p3_en) : (section.p3_en || section.p3_de);
      const p4 = lang === 'de' ? (section.p4_de || section.p4_en) : (section.p4_en || section.p4_de);

      return (
        <section
          className={`home-expertise-text-section ${isBuilderMode ? 'builder-section-preview' : ''}`}
          style={customStyle}
          onClick={() => {
            if (isEditorActive && !editorCtx.isPreviewMode) {
              editorCtx.setSelectedSectionId(section.id);
              editorCtx.setSelectedElement({ type: 'section', sectionId: section.id, section });
            }
          }}
        >
          {/* Soft lavender glowing ambient glass orbs */}
          <div className="spatial-bg-glow glow-purple"></div>
          <div className="spatial-bg-glow glow-cyan"></div>

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <motion.h2 
              className="section-main-title expertise-main-title" 
              style={{ color: section.heading_color || undefined }}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderInlineText(
                lang === 'de' ? 'title_de' : 'title_en',
                title,
                'Use our expertise for your sporting success!',
                'span'
              )}
            </motion.h2>

            <div className="expertise-paragraphs-grid">
              {/* Card 1: Top-Left (Parallel Slide from Left) */}
              <AnimatedCard index={0} direction="right" distance={65}>
                <div className="expertise-text-card">
                  <p className="expertise-text-para">
                    {renderInlineText(
                      lang === 'de' ? 'p1_de' : 'p1_en',
                      p1,
                      'Unlike large companies, sports associations usually do not have their own department specializing in trips to competitions for national teams or sports officials to conferences.',
                      'span'
                    )}
                  </p>
                </div>
              </AnimatedCard>

              {/* Card 2: Top-Right (Parallel Slide from Right) */}
              <AnimatedCard index={1} direction="left" distance={65}>
                <div className="expertise-text-card">
                  <p className="expertise-text-para">
                    {renderInlineText(
                      lang === 'de' ? 'p2_de' : 'p2_en',
                      p2,
                      'We take care of the search for the right team hotel for you, organize transport from the airport and to the competition venue, or find the right team building activity.',
                      'span'
                    )}
                  </p>
                </div>
              </AnimatedCard>

              {/* Card 3: Bottom-Left (Parallel Slide from Left) */}
              <AnimatedCard index={2} direction="right" distance={65}>
                <div className="expertise-text-card">
                  <p className="expertise-text-para">
                    {renderInlineText(
                      lang === 'de' ? 'p3_de' : 'p3_en',
                      p3,
                      'We will look for suitable conference options for your conferences and meetings that suit your sports officials and their needs.',
                      'span'
                    )}
                  </p>
                </div>
              </AnimatedCard>

              {/* Card 4: Bottom-Right (Parallel Slide from Right - Highlight Card) */}
              {p4 && (
                <AnimatedCard index={3} direction="left" distance={65}>
                  <div className="expertise-text-card highlight-card">
                    <p className="expertise-text-para">
                      {renderInlineText(
                        lang === 'de' ? 'p4_de' : 'p4_en',
                        p4,
                        'We will only propose conference locations with access to suitable sporting facilities. With our many years of experience, we will find exactly the right thing for you.',
                        'span'
                      )}
                    </p>
                  </div>
                </AnimatedCard>
              )}
            </div>
          </div>
        </section>
      );
    }

    // 4b. TRUST BADGES
    if (section.id === 'home_trust' || section.type === 'trust_badges') {
      const badges = section.badges || [
        { title_en: 'Global Network', desc_en: 'Vetted team hotels & conference venues across 5 continents' },
        { title_en: 'Athletic Expertise', desc_en: 'Tailored nutrition, fitness facilities & match proximity' },
        { title_en: 'Complete Logistics', desc_en: 'Airport transfers, luggage routing & local support' },
        { title_en: 'Cost Transparency', desc_en: 'Clear budgets and negotiated group association rates' }
      ];

      return (
        <section className={`trust-badges-section ${isBuilderMode ? 'builder-section-preview' : ''}`} style={customStyle}>
          <div className="container">
            <div className="trust-badges-grid">
              {badges.map((badge, idx) => {
                const IconComponent = icons[idx % icons.length];
                return (
                  <AnimatedCard key={idx} index={idx} className="trust-badge-item">
                    <div className="trust-badge-icon"><IconComponent size={22} /></div>
                    <div>
                      <h4 className="trust-badge-title">
                        {lang === 'de' ? (badge.title_de || badge.title_en || badge.title) : (badge.title_en || badge.title_de || badge.title)}
                      </h4>
                      <p className="trust-badge-desc">
                        {lang === 'de' ? (badge.desc_de || badge.desc_en || badge.desc) : (badge.desc_en || badge.desc_de || badge.desc)}
                      </p>
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    // 5. VIDEO & HIGH PERFORMANCE
    if (section.id === 'home_video' || section.type === 'video_showcase' || section.type === 'video') {
      return (
        <div 
          key={section.id} 
          onClick={() => {
            if (isEditorActive && !editorCtx.isPreviewMode) {
              editorCtx.setSelectedSectionId(section.id);
              editorCtx.setSelectedElement({ type: 'section', sectionId: section.id, section });
            }
          }}
        >
          <SportsVideoShowcase
            section={section}
            isEditorActive={isEditorActive}
            editorCtx={editorCtx}
            renderInlineText={renderInlineText}
          />
        </div>
      );
    }

    // 5b. MULTI-TRACK PARALLEL SCROLL SHOWCASE
    if (section.type === 'parallel' || section.type === 'gallery_parallel' || section.type === 'scrubber') {
      return <ParallelSportsShowcase />;
    }

    // 6. SERVICE HERO VIDEO & INTERACTIVE HERO
    if (section.id === 'service_hero_video') {
      const videoUrl = section.video_url || 'https://www.youtube.com/embed/aXREXtsXonE?controls=1';
      const bgImage = section.bg_image !== undefined ? section.bg_image : '/assets/images/service_hero_bg.jpg';
      const heading = lang === 'de' 
        ? (section.title_de || section.title_en || 'Maßgeschneiderte MICE & Sportlogistik')
        : (section.title_en || section.title_de || 'Tailored Logistics for High-Performance Teams & Events');
      const subtitle = lang === 'de'
        ? (section.subtitle_de || section.subtitle_en || 'Wir finden die perfekten Teamhotels, organisieren reibungslose Flughafentransfers und betreuen Sportverbände weltweit.')
        : (section.subtitle_en || section.subtitle_de || 'From hotel selection and ground transport to on-site coordination, we empower international sports delegations with turnkey logistics.');

      return (
        <section
          className={`service-hero ${isBuilderMode ? 'builder-section-preview' : ''}`}
          style={{ ...customStyle, backgroundImage: bgImage ? `url('${bgImage}')` : undefined }}
        >
          <div className="container service-hero-container">
            <div className="service-hero-split-grid">
              {/* LEFT SIDE: Category, Heading, Description, Dual CTAs */}
              <AnimatedSection direction="up" distance={20} className="service-hero-text-col">
                <div className="hero-category-pill animate-float">
                  <Sparkles size={14} color="#a855f7" />
                  <span>{lang === 'de' ? 'SPORTS & MICE EXZELLENZ' : 'SPORTS & MICE EXCELLENCE'}</span>
                </div>

                <h1 className="service-hero-main-title" style={{ color: section.heading_color || undefined }}>
                  {renderInlineText(
                    lang === 'de' ? 'title_de' : 'title_en',
                    heading,
                    'Tailored Logistics for High-Performance Teams & Events',
                    'span'
                  )}
                </h1>

                <p className="service-hero-subtitle">
                  {renderInlineText(
                    lang === 'de' ? 'subtitle_de' : 'subtitle_en',
                    subtitle,
                    'From hotel selection and ground transport to on-site coordination, we empower international sports delegations with turnkey logistics.',
                    'span'
                  )}
                </p>

                <div className="service-hero-btn-group">
                  {renderEditableButton({
                    fieldPrefix: 'cta',
                    fallbackText: lang === 'de' ? 'Kostenlose Beratung' : 'Get Consultation',
                    defaultLink: '/en/Contact/',
                    className: 'btn-red-pill'
                  })}
                  <NavLink
                    to="/en/Contact/"
                    className="btn-secondary-glass"
                  >
                    <span>{lang === 'de' ? 'Kontakt aufnehmen' : 'Direct Contact'}</span>
                    <ArrowRight size={16} />
                  </NavLink>
                </div>
              </AnimatedSection>

              {/* RIGHT SIDE: Video Card with VideoFacade */}
              {(section.video_enabled !== false || isEditorActive) && (
              <AnimatedSection direction="up" distance={20} delay={0.15} className="service-hero-video-col">
                <div className="service-hero-video-card-glow">
                  <div className="service-hero-video-card">
                    <VideoFacade
                      videoUrl={videoUrl}
                      posterImage={section.poster_image || bgImage}
                      title="Sports & MICE Service Video"
                      badgeText={lang === 'de' ? '🏆 15+ Jahre Spitzensport-Expertise' : '🏆 15+ Years Athletic Expertise'}
                    />
                  </div>
                </div>
              </AnimatedSection>
              )}
            </div>
          </div>
        </section>
      );
    }

    // 7. SERVICE INTRO TEXT WITH CIRCULAR IMAGE & PARALLEL SCROLL REVEAL
    if (section.id === 'service_intro' || section.type === 'text_block' || section.type === 'content') {
      const title = lang === 'de' ? (section.title_de || section.title_en) : (section.title_en || section.title_de);
      const p1 = lang === 'de' ? (section.p1_de || section.p1_en) : (section.p1_en || section.p1_de);
      const p2 = lang === 'de' ? (section.p2_de || section.p2_en) : (section.p2_en || section.p2_de);
      const p3 = lang === 'de' ? (section.p3_de || section.p3_en) : (section.p3_en || section.p3_de);
      const circleImg = section.image || section.photo || '/assets/images/service_teamtrips.jpeg';

      return (
        <section className={`service-intro-section ${isBuilderMode ? 'builder-section-preview' : ''}`} style={customStyle}>
          <div className="container">
            <div className="service-intro-grid">
              
              {/* LEFT SIDE: Heading & Staggered Paragraph Text */}
              <AnimatedSection direction="right" distance={50} duration={0.7} className="service-intro-text-col">
                <h2 className="service-main-heading" style={{ color: section.heading_color || undefined }}>
                  {renderInlineText(
                    lang === 'de' ? 'title_de' : 'title_en',
                    title,
                    'With our commitment we support your sporting success!',
                    'span'
                  )}
                </h2>
                <div className="service-intro-text">
                  <AnimatedSection direction="up" distance={20} delay={0.1}>
                    <p>{renderInlineText(lang === 'de' ? 'p1_de' : 'p1_en', p1, 'Our team ensures the right selection of venues and hotels for your MICE activities. Sports teams and sports officials have special requirements, which guide us in our recommendations for you.', 'span')}</p>
                  </AnimatedSection>
                  <AnimatedSection direction="up" distance={20} delay={0.25}>
                    <p>{renderInlineText(lang === 'de' ? 'p2_de' : 'p2_en', p2, 'When selecting hotels, we ensure that they are suitable for sports teams and that they have staff who are familiar with dealing with sports teams. Our targeted advice to the selected hotel ensures high-quality services for you. The facilities need to be right; the fitness center shouldn\'t be the smallest room in the hotel. We also value attractive running routes near the hotel.', 'span')}</p>
                  </AnimatedSection>
                  <AnimatedSection direction="up" distance={20} delay={0.4}>
                    <p>{renderInlineText(lang === 'de' ? 'p3_de' : 'p3_en', p3, 'We make sure that you are in a good location and distance from the competition site and can ensure that transport is looked after. We check the conference facilities for meetings, seminars and assemblies that your teams or your sports officials need to meet your needs. It is our strength that we have made a picture for ourselves on site.', 'span')}</p>
                  </AnimatedSection>
                </div>
              </AnimatedSection>

              {/* RIGHT SIDE: Circular Image Frame with Ambient Glow Ring & Motion Entrance */}
              <AnimatedSection direction="left" distance={60} duration={0.75} className="service-intro-circle-col">
                <div className="service-intro-circle-container">
                  {/* Rotating Ambient Glowing Ring */}
                  <div className="circle-glowing-ring" />

                  {/* Motion Floating Circle Image */}
                  <motion.div 
                    className="circle-image-frame"
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <img 
                      src={circleImg} 
                      alt="Sports & MICE Service Commitment" 
                    />
                  </motion.div>
                </div>
              </AnimatedSection>

            </div>
          </div>
        </section>
      );
    }

    // 8. SERVICE CARDS GRID
    if (section.id === 'service_cards' || section.type === 'services') {
      const secHeading = lang === 'de' ? (section.title_de || section.title_en) : (section.title_en || section.title_de);
      const secSub = lang === 'de'
        ? (section.subtitle_de || 'Maßgeschneiderte MICE-Lösungen für Ihr Team, Ihre Events und Ihre Ziele – entdecken Sie unsere Spezialdienste')
        : (section.subtitle_en || 'Tailored MICE solutions designed for your team, events, and ambitions — explore our specialized services');

      const servicesList = cmsConfig?.services?.filter(s => s.active !== false) || [
        { 
          id: 'svc_1', 
          title_en: 'Meetings and Conferences', 
          title_de: 'Meetings und Konferenzen', 
          image: '/assets/images/service_meeting.jpg', 
          icon: 'calendar',
          tags_en: 'Executive conference rooms • State-of-the-art AV tech • Quiet meeting environment • 24/7 coordinator',
          tags_de: 'Executive Tagungsräume • Moderne Medientechnik • Ruhige Arbeitsatmosphäre • 24/7 Service'
        },
        { 
          id: 'svc_2', 
          title_en: 'Team building & Incentives', 
          title_de: 'Team building & Incentives', 
          image: '/assets/images/service_teambuilding.png', 
          icon: 'handshake',
          tags_en: 'Custom team events • Outdoor sports challenges • Motivation & team bonding • Exclusive venues',
          tags_de: 'Maßgeschneiderte Teamevents • Outdoor-Challenges • Motivation & Teamgeist • Exklusive Locations'
        },
        { 
          id: 'svc_3', 
          title_en: 'Team trips and events', 
          title_de: 'Teamreisen und Events', 
          image: '/assets/images/service_teamtrips.jpeg', 
          featured: true,
          tags_en: 'Custom itineraries • Wellness retreats • Group travel coordination • 50+ destinations worldwide',
          tags_de: 'Maßgeschneiderte Routen • Wellness-Retreats • Gruppenreise-Koordination • 50+ Ziele weltweit'
        },
        { 
          id: 'svc_4', 
          title_en: 'International sports congresses', 
          title_de: 'Internationale Sportkongresse', 
          image: '/assets/images/congress_icon.png', 
          icon: 'trophy',
          tags_en: 'International logistics • VIP delegate management • Congress infrastructure & simultaneous translation',
          tags_de: 'Internationale Logistik • VIP-Betreuung • Kongressinfrastruktur & Simultandolmetscher'
        }
      ];

      const renderCardIcon = (svc, idx) => {
        if (svc.id === 'svc_1' || idx === 0) return <Calendar size={20} />;
        if (svc.id === 'svc_2' || idx === 1) return <Handshake size={20} />;
        if (svc.id === 'svc_4' || idx === 3) return <Trophy size={20} />;
        return <Building2 size={20} />;
      };

      return (
        <section className={`service-cards-section ${isBuilderMode ? 'builder-section-preview' : ''}`} style={customStyle}>
          <div className="container">
            <AnimatedSection direction="up" distance={20} className="service-header-wrapper">
              <h2 className="service-sub-heading" style={{ color: section.heading_color || undefined }}>
                {renderInlineText(
                  lang === 'de' ? 'title_de' : 'title_en',
                  secHeading,
                  'The right answers to your needs',
                  'span'
                )}
              </h2>
              <p className="service-sub-desc">
                {renderInlineText(
                  lang === 'de' ? 'subtitle_de' : 'subtitle_en',
                  secSub,
                  'Tailored MICE solutions designed for your team, events, and ambitions — explore our specialized services',
                  'span'
                )}
              </p>
            </AnimatedSection>

            <div className="service-cards-grid" onMouseLeave={() => setHoveredServiceCardId(null)}>
              {servicesList.map((svc, idx) => {
                const title = lang === 'de' ? (svc.title_de || svc.title_en) : (svc.title_en || svc.title_de);
                const isCongressIcon = svc.image?.includes('congress_icon');
                
                // Only when card is hovered or selected, it becomes the vibrant glowing purple card
                const isFeatured = hoveredServiceCardId !== null 
                  ? (hoveredServiceCardId === svc.id) 
                  : (svc.id === 'svc_3' || idx === 2);

                const isCardSelected = isEditorActive && !editorCtx.isPreviewMode && (editorCtx.selectedElement?.serviceId === svc.id || editorCtx.selectedElement?.cardId === svc.id);
                const isImgSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.type === 'service_card_image' && (editorCtx.selectedElement?.serviceId === svc.id || editorCtx.selectedElement?.cardId === svc.id);
                const isTitleSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.type === 'service_card_title' && (editorCtx.selectedElement?.serviceId === svc.id || editorCtx.selectedElement?.cardId === svc.id);

                const cardTags = lang === 'de' 
                  ? (svc.tags_de || 'Maßgeschneiderte Routen • Wellness-Retreats • Gruppenreise-Koordination • 50+ Ziele weltweit')
                  : (svc.tags_en || 'Custom itineraries • Wellness retreats • Group travel coordination • 50+ destinations worldwide');

                return (
                  <AnimatedCard 
                    key={svc.id || idx} 
                    index={idx}
                    direction="asymmetrical"
                    totalCards={servicesList.length}
                  >
                    <div
                      className={`service-img-card ${isFeatured ? 'featured-service-card' : ''} ${isCardSelected ? 'builder-element-selected' : ''}`}
                      onMouseEnter={() => setHoveredServiceCardId(svc.id)}
                      onMouseMove={handleTiltMove}
                      onMouseLeave={handleTiltLeave}
                      onClick={(e) => {
                        setHoveredServiceCardId(svc.id);
                        if (isEditorActive && !editorCtx.isPreviewMode) {
                          e.stopPropagation();
                          editorCtx.setSelectedSectionId(section.id);
                          editorCtx.setSelectedElement({
                            type: 'service_card',
                            serviceId: svc.id,
                            cardId: svc.id,
                            sectionId: section.id,
                            service: svc,
                            title_en: svc.title_en,
                            title_de: svc.title_de,
                            image: svc.image
                          });
                        }
                      }}
                    >
                      <div
                        className={`card-img-wrapper ${isCongressIcon ? 'congress-icon-wrap' : ''} ${isImgSelected ? 'builder-element-selected' : ''}`}
                        onClick={(e) => {
                          if (isEditorActive && !editorCtx.isPreviewMode) {
                            e.stopPropagation();
                            editorCtx.setSelectedSectionId(section.id);
                            editorCtx.setSelectedElement({
                              type: 'service_card_image',
                              serviceId: svc.id,
                              cardId: svc.id,
                              sectionId: section.id,
                              service: svc,
                              src: svc.image,
                              alt: title
                            });
                          }
                        }}
                      >
                        <img src={svc.image} alt={title} className={isCongressIcon ? 'congress-icon-img' : ''} loading="lazy" decoding="async" />
                      </div>

                      {isFeatured ? (
                        <div className="featured-card-content">
                          <h3
                            className={`featured-card-title ${isTitleSelected ? 'builder-element-selected' : ''}`}
                            onClick={(e) => {
                              if (isEditorActive && !editorCtx.isPreviewMode) {
                                e.stopPropagation();
                                editorCtx.setSelectedSectionId(section.id);
                                editorCtx.setSelectedElement({
                                  type: 'service_card_title',
                                  serviceId: svc.id,
                                  cardId: svc.id,
                                  sectionId: section.id,
                                  service: svc,
                                  text_en: svc.title_en,
                                  text_de: svc.title_de
                                });
                              }
                            }}
                          >
                            {title}
                          </h3>
                          <p className="featured-card-tags">
                            {cardTags}
                          </p>
                          <NavLink to={svc.link || '/en/Contact/'} className="featured-explore-btn">
                            {lang === 'de' ? 'Entdecken' : 'Explore'} <ArrowRight size={16} />
                          </NavLink>
                        </div>
                      ) : (
                        <div className="card-bottom-tile">
                          <div className="card-icon-box">
                            {renderCardIcon(svc, idx)}
                          </div>
                          <h3
                            className={`img-card-title ${isTitleSelected ? 'builder-element-selected' : ''}`}
                            onClick={(e) => {
                              if (isEditorActive && !editorCtx.isPreviewMode) {
                                e.stopPropagation();
                                editorCtx.setSelectedSectionId(section.id);
                                editorCtx.setSelectedElement({
                                  type: 'service_card_title',
                                  serviceId: svc.id,
                                  cardId: svc.id,
                                  sectionId: section.id,
                                  service: svc,
                                  text_en: svc.title_en,
                                  text_de: svc.title_de
                                });
                              }
                            }}
                          >
                            {title}
                          </h3>
                        </div>
                      )}
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>

            <div className="service-bottom-tagline">
              Sports & MICE &bull; Tailored experiences &bull; Global reach &bull; 24/7 support
            </div>
          </div>
        </section>
      );
    }

    // 9. WORKFLOW PROCESS STEPS
    if (section.id === 'service_workflow' || section.type === 'workflow') {
      const title = lang === 'de' ? (section.title_de || 'Unser 4-Schritte Erfolgsablauf') : (section.title_en || 'Our 4-Step MICE Success Formula');
      const workflowSteps = lang === 'de' ? [
        { num: '01', title: 'Bedarfsanalyse', desc: 'Detaillierte Erfassung aller sportlichen und organisatorischen Vorgaben Ihres Teams.', icon: Search },
        { num: '02', title: 'Location-Scouting', desc: 'Prüfung geprüfter Hotels mit kurzen Wegen, gesunder Küche und optimalen Trainingsbedingungen.', icon: Building2 },
        { num: '03', title: 'Logistik & Transfer', desc: 'Reibungsloser Ablauf von Flughafen, Teamtransporten bis hin zur Betreuung vor Ort.', icon: Compass },
        { num: '04', title: 'Erfolgsbegleitung', desc: 'Persönliche Rundum-Betreuung für Sportfunktionäre, Trainer und Athleten.', icon: ShieldCheck }
      ] : [
        { num: '01', title: 'Requirement Analysis', desc: 'Thorough evaluation of athletic, schedule, and logistical needs for your delegation.', icon: Search },
        { num: '02', title: 'Venue & Hotel Scouting', desc: 'Handpicked hotels with proven sports-readiness, nutrition, and fitness facilities.', icon: Building2 },
        { num: '03', title: 'Seamless Logistics', desc: 'Effortless airport transfers, equipment handling, and on-site coordination.', icon: Compass },
        { num: '04', title: 'Dedicated Support', desc: 'Proactive personal service from start to finish for athletes and officials.', icon: ShieldCheck }
      ];

      return (
        <section className={`service-workflow-section ${isBuilderMode ? 'builder-section-preview' : ''}`} style={customStyle}>
          <div className="container">
            <AnimatedSection direction="up" distance={20}>
              <h2 className="service-sub-heading" style={{ color: section.heading_color || undefined }}>
                {renderInlineText(
                  lang === 'de' ? 'title_de' : 'title_en',
                  title,
                  'Our 4-Step MICE Success Formula',
                  'span'
                )}
              </h2>
            </AnimatedSection>

            <div className="workflow-grid">
              {workflowSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <AnimatedCard key={idx} index={idx} className="workflow-card">
                    <div className="workflow-step-num">
                      <Icon size={20} />
                      <span>{step.num}</span>
                    </div>
                    <h4 className="workflow-title">{step.title}</h4>
                    <p className="workflow-desc">{step.desc}</p>
                  </AnimatedCard>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    // 10. CALL TO ACTION BANNER
    if (section.id === 'service_cta' || section.type === 'cta' || section.type === 'button') {
      const ctaTitle = lang === 'de' ? (section.title_de || section.title_en) : (section.title_en || section.title_de);
      const btnText = lang === 'de' ? (section.button_text_de || 'Kontaktformular') : (section.button_text_en || 'Contact Form');
      const btnLink = section.button_link || '/en/Contact/';

      return (
        <section
          className={`service-cta-banner service-cta-banner-spatial ${isBuilderMode ? 'builder-section-preview' : ''}`}
          style={customStyle}
          onClick={() => {
            if (isEditorActive && !editorCtx.isPreviewMode) {
              editorCtx.setSelectedSectionId(section.id);
              editorCtx.setSelectedElement({ type: 'section', sectionId: section.id, section });
            }
          }}
        >
          {/* Glowing purple ambient orbs */}
          <div className="spatial-bg-glow glow-purple"></div>
          <div className="spatial-bg-glow glow-cyan"></div>

          <div className="container">
            <AnimatedSection direction="up" distance={20}>
              <div className="cta-glass-card">
                <h3 className="cta-text-spatial">
                  {renderInlineText(
                    lang === 'de' ? 'title_de' : 'title_en',
                    ctaTitle,
                    'Write to us with your request!',
                    'span'
                  )}
                </h3>
                {renderEditableButton({
                  fieldPrefix: 'button',
                  fallbackText: 'Contact Form',
                  defaultLink: '/en/Contact/',
                  className: 'btn-liquid-purple-pill cta-btn'
                })}
              </div>
            </AnimatedSection>
          </div>
        </section>
      );
    }

    // 11. PAGE HERO BANNER (About Us, Hotels & more, Contact, Imprint, Dynamic Pages)
    if (
      section.id === 'about_hero' || 
      section.id === 'hotels_hero' || 
      section.id === 'contact_hero' || 
      section.id === 'imprint_hero' ||
      section.type === 'page_hero' ||
      (section.type === 'hero' && section.id !== 'home_hero' && pageKey !== 'home')
    ) {
      const fallbackTitle = section.id === 'hotels_hero' ? 'Hotels & more' : section.id === 'contact_hero' ? 'Contact' : 'About Us';
      const title = lang === 'de' ? (section.title_de || section.title_en || fallbackTitle) : (section.title_en || section.title_de || fallbackTitle);
      const defaultBg = section.id === 'hotels_hero' 
        ? '/assets/images/hotels_hero_bg.jpg' 
        : section.id === 'contact_hero' 
          ? '/assets/images/contact_hero_bg.jpg' 
          : '/assets/images/about_hero_bg.jpg';
      const bgImage = section.bg_image !== undefined ? section.bg_image : defaultBg;

      return (
        <section
          className={`about-hero-banner ${isBuilderMode ? 'builder-section-preview' : ''}`}
          style={{ ...customStyle, backgroundImage: bgImage ? `url('${bgImage}')` : undefined }}
        >
          <div className="container">
            <AnimatedSection direction="up" distance={30}>
              <h1 className="about-hero-title" style={{ color: section.heading_color || undefined }}>
                {renderInlineText(
                  lang === 'de' ? 'title_de' : 'title_en',
                  title,
                  fallbackTitle,
                  'span'
                )}
              </h1>
            </AnimatedSection>
          </div>
        </section>
      );
    }

    // 11.5 TROPHY & CHAMPIONSHIP SECTION
    if (section.type === 'trophy' || section.type === 'championship') {
      return <TrophySection title={section.title_en} subtitle={section.subtitle_en} />;
    }

    // 12. ABOUT STORY / FOUNDER
    if (section.id === 'about_story' || section.type === 'story' || section.type === 'team') {
      const title = lang === 'de' ? (section.title_de || section.title_en) : (section.title_en || section.title_de);
      const photo = section.photo || '/assets/images/about_hockey_referee.jpeg';
      const p1 = lang === 'de' ? (section.p1_de || section.p1_en) : (section.p1_en || section.p1_de);
      const p2 = lang === 'de' ? (section.p2_de || section.p2_en) : (section.p2_en || section.p2_de);

      const defaultFounderTitle = lang === 'de' 
        ? 'Marc Knuelle — Internationaler Schiedsrichter seit 2000' 
        : 'Marc Knuelle — International Referee since 2000';
      const founderTitle = lang === 'de' ? (section.founder_title_de || defaultFounderTitle) : (section.founder_title_en || defaultFounderTitle);

      const defaultP1 = lang === 'de'
        ? 'Marc Knuelle ist der Gründer von Sports & MICE K-Consulting und bringt über 25 Jahre Erfahrung als internationaler Feldhockeyschiedsrichter mit. Seit dem Jahr 2000 hat Marc auf höchstem Niveau des Sports gepfiffen, darunter Weltmeisterschaften, Olympia-Qualifikationen und die FIH Pro League, wodurch er tiefgreifende Expertise in der Betreuung von Spitzenwettbewerben und Fairplay erworben hat.'
        : 'Marc Knuelle is the founder of Sports & MICE K-Consulting, bringing over 25 years of experience as an international field hockey referee. Since the year 2000, Marc has officiated at the highest level of the sport, including World Championships, Olympic qualifiers, and the FIH Pro League, building deep expertise in elite competition management and fair play.';

      const defaultP2 = lang === 'de'
        ? 'Heute wendet Marc dieselbe Präzision und leistungsorientierte Herangehensweise auf die Sport- und MICE-Beratung an. Wir unterstützen Verbände, Eventorganisatoren und Unternehmenskunden mit professionellem Management für Tagungen, Incentives, Konferenzen und Events – und kombinieren Branchenwissen mit strategischer Planung, um nahtlose, erstklassige Erlebnisse auf globaler Ebene zu liefern.'
        : 'Today, Marc applies that same precision and performance-driven approach to sports and MICE consulting. We support federations, event organizers, and corporate clients with professional management for meetings, incentives, conferences, and events—combining sport-industry knowledge with strategic planning to deliver seamless, high-quality experiences on a global scale.';

      return (
        <section className={`about-story-liquid-section ${isBuilderMode ? 'builder-section-preview' : ''}`} style={customStyle}>
          {/* Soft Ambient Purple Background Glow Orbs */}
          <div className="about-story-ambient-glow orb-left" />
          <div className="about-story-ambient-glow orb-right" />

          <div className="container relative z-10">
            {/* TOP HEADER: Badge & Main Title */}
            <AnimatedSection direction="up" distance={20} className="about-story-header-col">
              <span className="about-pill-badge">
                <Sparkles size={13} className="badge-sparkle" />
                {lang === 'de' ? 'ÜBER UNS' : 'ABOUT US'}
              </span>
              <h2 className="story-main-heading" style={{ color: section.heading_color || undefined }}>
                {renderInlineText(
                  lang === 'de' ? 'title_de' : 'title_en',
                  title,
                  'Active in high-performance sport',
                  'span'
                )}
              </h2>
            </AnimatedSection>

            {/* MAIN 2-COLUMN GRID */}
            <div className="about-story-liquid-grid">
              {/* LEFT COLUMN: Carousel inside 3D Liquid Glass Frame */}
              <AnimatedSection direction="right" distance={40} duration={0.7} className="story-photo-col">
                <AboutStoryCarousel
                  defaultPhoto={photo}
                  isEditing={isEditorActive && !editorCtx.isPreviewMode}
                  editorCtx={editorCtx}
                  sectionId={section.id}
                />
              </AnimatedSection>

              {/* RIGHT COLUMN: 3D Translucent Liquid Glass Card Container */}
              <AnimatedSection direction="left" distance={40} duration={0.7} className="story-card-col">
                <div className="founder-liquid-glass-card">
                  <div className="founder-card-header">
                    <span className="founder-subhead">{lang === 'de' ? 'DER GRÜNDER' : 'MEET THE FOUNDER'}</span>
                    <h3 className="founder-title">
                      {renderInlineText(
                        lang === 'de' ? 'founder_title_de' : 'founder_title_en',
                        founderTitle,
                        defaultFounderTitle,
                        'span'
                      )}
                    </h3>
                  </div>

                  <div className="founder-card-body">
                    <p className="story-para">
                      {renderInlineText(
                        lang === 'de' ? 'p1_de' : 'p1_en',
                        p1,
                        defaultP1,
                        'span'
                      )}
                    </p>
                    <p className="story-para">
                      {renderInlineText(
                        lang === 'de' ? 'p2_de' : 'p2_en',
                        p2,
                        defaultP2,
                        'span'
                      )}
                    </p>
                  </div>

                  {/* 3 STATS SUB-CARDS */}
                  <div className="founder-stats-grid">
                    <div className="founder-stat-box">
                      <div className="stat-icon-wrapper">
                        <Calendar size={20} />
                      </div>
                      <div className="stat-title">{lang === 'de' ? '25+ JAHRE' : '25+ YEARS'}</div>
                      <div className="stat-subtitle">{lang === 'de' ? 'Internationales Schiedsrichterwesen' : 'International Refereeing'}</div>
                    </div>

                    <div className="founder-stat-box">
                      <div className="stat-icon-wrapper">
                        <Globe2 size={20} />
                      </div>
                      <div className="stat-title">{lang === 'de' ? '50+ EVENTS' : '50+ EVENTS'}</div>
                      <div className="stat-subtitle">{lang === 'de' ? 'MICE & Sportprojekte' : 'MICE & Sports Projects'}</div>
                    </div>

                    <div className="founder-stat-box">
                      <div className="stat-icon-wrapper">
                        <Target size={20} />
                      </div>
                      <div className="stat-title">{lang === 'de' ? 'GLOBALE REICHWEITE' : 'GLOBAL REACH'}</div>
                      <div className="stat-subtitle">{lang === 'de' ? 'Europa · Asien · Amerika' : 'Europe · Asia · Americas'}</div>
                    </div>
                  </div>

                  {/* BOTTOM BUTTON */}
                  <div className="founder-card-action">
                    <NavLink
                      to={section.button_link || '/en/Services/'}
                      className="btn-founder-liquid-glass"
                    >
                      <span>{lang === 'de' ? 'Unsere Leistungen entdecken' : 'Explore Our Services'}</span>
                      <ArrowRight size={16} />
                    </NavLink>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      );
    }

    // 13. TOURS & GALLERY
    if (section.id === 'hotels_tours' || section.id === 'about_travel' || section.type === 'gallery' || section.type === 'tours') {
      const title = lang === 'de' ? (section.title_de || section.title_en) : (section.title_en || section.title_de);
      const rawGallery = cmsConfig?.gallery || [
        {
          id: 'tour_cancun',
          title: 'Tour - Mexico - Cancún',
          title_de: 'Tour - Mexiko - Cancún',
          hotel_name: 'Hotel Fairmont Mayakoba "Riviera Maya"',
          location: 'Cancún, Mexico',
          image: '/assets/images/hotel_cancun.jpg',
          external_url: 'https://www.fairmont.com/mayakoba-riviera-maya/?goto=fiche_hotel&code_hotel=A573&merchantid=seo-maps-MX-A573&sourceid=aw-cen&utm_medium=seo+maps&utm_source=google+Maps&utm_campaign=seo+maps&y_source=1_MTIzNjEzOTgtNzE1LWxvY2F0aW9uLmdvb2dsZV93ZWJzaXRlX292ZXJyaWRl',
          button_text_en: 'Fairmont Mayakoba "Riviera Maya"',
          button_text_de: 'Fairmont Mayakoba "Riviera Maya"',
          desc_en: 'The Yucatán peninsula not only inspires with its breathtaking beaches, but also with its excellent hotel infrastructure. Meetings with a view of the sea or events on the beach are easily possible here. Mexico also impresses with a wide range of sports, very special for water sports. It is a perfect location, especially for team building. We were particularly impressed by the Hotel Fairmont Myakoba "Riviera Maya", a great place to meet and relax.',
          desc_de: 'Die Halbinsel Yucatán begeistert nicht nur mit ihren atemberaubenden Stränden, sondern auch mit ihrer hervorragenden Hotelinfrastruktur. Tagen mit Blick aufs Meer oder Veranstaltungen am Strand sind hier problemlos möglich. Auch sportlich besticht Mexiko mit einem vielfältigen Angebot, ganz besondere für den Wassersport. Gerade für Teambildung ist es ein perfektes Ziel. Besonders beeindruckt hat uns das Hotel Fairmont Myakoba "Riviera Maya", ein toller Ort zum Tagen und Entspannen.',
          active: true
        },
        {
          id: 'tour_dubai',
          title: 'Tour - UAE - Dubai',
          title_de: 'Tour - VAE - Dubai',
          hotel_name: 'Sofitel The Palm Dubai',
          location: 'Dubai, UAE',
          image: '/assets/images/hotel_dubai.jpg',
          external_url: 'https://www.sofitel-dubai-thepalm.com',
          button_text_en: 'Sofitel The Palm Dubai',
          button_text_de: 'Sofitel The Palm Dubai',
          desc_en: 'All events can happy here - Dubai is a year-round destination with extensive conference facilities. It offers a high level of security as well as a wide range of sports infrastructure. There are also various options for team building activities. We were particularly impressed by the Sofitel The Palm Dubai hotel, with its great location and a perfect mix of meeting and relaxing.',
          desc_de: 'Kein Event, was hier nicht realisiert werden kann - Dubai ist ein Ganzjahresziel mit weitreichenden Tagungsmöglichkeiten. Es bietet ein hohes Maß an Sicherheit wie auch ein breites Angebot an Sportinfrastruktur. Dazu gibt es vielfältige Möglichkeiten für Teambildungs-Aktivitäten. Besonders beeindruckt hat uns das Hotel Sofitel The Palm Dubai, durch seine tolle Lage und eine perfekte Mischung zum Tagen und Wohlfühlen.',
          active: true
        },
        {
          id: 'tour_kenya',
          title: 'Tour - Kenya - Nairobi',
          title_de: 'Tour - Kenia - Nairobi',
          hotel_name: 'Fairmont The Norfolk Nairobi',
          location: 'Nairobi, Kenya',
          image: '/assets/images/service_hero_bg.jpg',
          external_url: 'https://www.fairmont.com/norfolk-hotel-nairobi/',
          button_text_en: 'Fairmont The Norfolk Nairobi',
          button_text_de: 'Fairmont The Norfolk Nairobi',
          desc_en: 'High-altitude training facilities and world-class luxury hotels make Kenya an exceptional destination for athletic delegations and international MICE events.',
          desc_de: 'Höhentrainingslager und erstklassige Luxushotels machen Kenia zu einem außergewöhnlichen Ziel für Sportdelegationen und internationale MICE-Events.',
          active: true
        },
        {
          id: 'tour_japan',
          title: 'Tour - Japan - Tokyo',
          title_de: 'Tour - Japan - Tokio',
          hotel_name: 'The Grand Hyatt Tokyo',
          location: 'Tokyo, Japan',
          image: '/assets/images/service_teambuilding.png',
          external_url: 'https://www.hyatt.com/en-US/hotel/japan/grand-hyatt-tokyo/tokgh',
          button_text_en: 'The Grand Hyatt Tokyo',
          button_text_de: 'The Grand Hyatt Tokyo',
          desc_en: 'State-of-the-art Olympic sports facilities combined with ultra-modern MICE conference venues. Perfect for elite team preparations and global congresses.',
          desc_de: 'Hochmoderne olympische Sportstätten kombiniert mit hochmodernen MICE-Konferenzzentren. Perfekt für die Vorbereitung von Spitzenteams und globale Kongresse.',
          active: true
        },
        {
          id: 'travel_havana',
          title: 'Havana - Cuba',
          title_de: 'Havana - Kuba',
          location: 'Havana, Cuba',
          image: '/assets/images/about_havana.jpeg',
          desc_en: 'The Caribbean passion of sport, for meeting with a view of the sea and ideal for motivational trips.',
          desc_de: 'Die karibische Leidenschaft des Sports, für Meetings mit Blick aufs Meer und ideal für Motivationsreisen.',
          active: true
        },
        {
          id: 'travel_beijing',
          title: 'Beijing - China',
          title_de: 'Peking - China',
          location: 'Beijing, China',
          image: '/assets/images/about_beijing.jpg',
          desc_en: 'A country where sport is very important - ideally suited for large sport competitions.',
          desc_de: 'Ein Land, in dem Sport einen hohen Stellenwert hat - bestens geeignet für große Sportwettkämpfe.',
          active: true
        },
        {
          id: 'travel_joburg',
          title: 'Johannesburg - South Africa',
          title_de: 'Johannesburg - Südafrika',
          location: 'Johannesburg, South Africa',
          image: '/assets/images/about_johannesburg.jpg',
          desc_en: 'Ideal for sport thanks to its good hotels, good sports event infrastructure and great team building activities.',
          desc_de: 'Ideal für den Sport dank guter Hotels, guter Sport-Event-Infrastruktur und toller Teambuilding-Aktivitäten.',
          active: true
        },
        {
          id: 'travel_rio',
          title: 'Rio de Janeiro - Brazil',
          title_de: 'Rio de Janeiro - Brasilien',
          location: 'Rio de Janeiro, Brazil',
          image: '/assets/images/about_rio.jpg',
          desc_en: 'Vibrant beach sports culture, World Cup venue infrastructure, and coastal conference facilities.',
          desc_de: 'Lebendige Strandsportkultur, WM-Stadioninfrastruktur und erstklassige Tagungsmöglichkeiten an der Küste.',
          active: true
        }
      ];

      let filteredItems = rawGallery;
      if (section.id === 'hotels_tours') {
        filteredItems = rawGallery.filter(g => !g.id || g.id.startsWith('tour_'));
      } else if (section.id === 'about_travel') {
        filteredItems = rawGallery.filter(g => !g.id || g.id.startsWith('travel_'));
      }

      const galleryItems = (isEditorActive && !editorCtx.isPreviewMode) 
        ? filteredItems 
        : filteredItems.filter(g => g.active !== false);

      return (
        <section
          className={`hotels-tours-section hotels-tours-spatial-section ${isBuilderMode ? 'builder-section-preview' : ''}`}
          style={customStyle}
          onClick={() => {
            if (isEditorActive && !editorCtx.isPreviewMode) {
              editorCtx.setSelectedSectionId(section.id);
              editorCtx.setSelectedElement({ type: 'section', sectionId: section.id, section });
            }
          }}
        >
          {/* Spatial Glow Orbs */}
          <div className="spatial-bg-glow glow-purple"></div>
          <div className="spatial-bg-glow glow-cyan"></div>
          <div className="spatial-bg-glow glow-blue"></div>

          <div className="container hotels-tours-container">
            {/* Header Row */}
            <AnimatedSection direction="up" distance={20}>
              <div className="hotels-tours-header-flex">
                <div className="hotels-header-left">
                  <div className="hotels-badge-pill">
                    <Sparkles size={14} color="#38bdf8" />
                    <span>Q4 2026 • Live Inspections Active</span>
                  </div>
                  <h2 className="section-main-title hotels-sec-heading-spatial">
                    Hotels & Sights <span className="text-gradient-cyan-purple">Inspection Tours</span>
                  </h2>
                  <p className="hotels-header-sub">
                    Curated on-site inspections for MICE planners — vetted hotels, landmark sights, compliant venues for meetings, incentives, conferences, exhibitions.
                  </p>
                </div>

                <div className="hotels-top-pill-bar">
                  <div className="top-feature-pill">
                    <Compass size={16} color="#38bdf8" />
                    <span>18 Venues Vetted</span>
                  </div>
                  <div className="top-feature-pill">
                    <Calendar size={16} color="#c084fc" />
                    <span>Custom Itineraries</span>
                  </div>
                  <div className="top-feature-pill">
                    <ShieldCheck size={16} color="#60a5fa" />
                    <span>Compliance & Sustainability</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Tours Grid */}
            <div 
              className="tours-grid tours-spatial-grid"
              style={{
                gridTemplateColumns: galleryItems.length > 0 && galleryItems.length <= 4 
                  ? `repeat(${galleryItems.length}, minmax(0, 1fr))` 
                  : undefined
              }}
            >
              {galleryItems.map((item, idx) => {
                const isCardSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.cardId === item.id && editorCtx.selectedElement?.type === 'gallery_card';
                const isImgSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.cardId === item.id && editorCtx.selectedElement?.type === 'card_image';
                const isTitleSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.cardId === item.id && editorCtx.selectedElement?.type === 'card_title';
                const isLocationSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.cardId === item.id && editorCtx.selectedElement?.type === 'card_location';
                const isDescSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.cardId === item.id && editorCtx.selectedElement?.type === 'card_desc';
                const isBtnSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.cardId === item.id && editorCtx.selectedElement?.type === 'card_button';

                const cardTitle = lang === 'de' ? (item.title_de || item.title) : (item.title || item.title_de);
                const resolvedDesc = lang === 'de' ? (item.desc_de || item.desc_en) : (item.desc_en || item.desc_de);
                const btnText = lang === 'de' ? (item.button_text_de || item.button_text_en || 'View Full Tour Plan') : (item.button_text_en || 'View Full Tour Plan');
                const btnLink = item.button_link || item.external_url || '/en/Contact/';
                const btnTarget = item.button_target || (item.external_url ? '_blank' : '_self');

                return (
                  <AnimatedCard 
                    key={item.id || idx} 
                    index={idx}
                    direction="asymmetrical"
                    totalCards={galleryItems.length}
                  >
                    <div
                      data-card-id={item.id}
                      className={`tour-card tour-glass-blob-card ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isCardSelected ? 'element-selected-active' : ''} ${item.active === false ? 'card-hidden-draft' : ''}`}
                      onMouseMove={handleTiltMove}
                      onMouseLeave={handleTiltLeave}
                      onClick={(e) => {
                        if (isEditorActive && !editorCtx.isPreviewMode) {
                          e.stopPropagation();
                          editorCtx.setSelectedSectionId(section.id);
                          editorCtx.setSelectedElement({
                            type: 'gallery_card',
                            cardId: item.id,
                            card: item,
                            sectionId: section.id
                          });
                        }
                      }}
                    >
                      {/* Floating Location Tag Pill */}
                      <div className="tour-floating-header-tag">
                        <MapPin size={13} color="#a5f3fc" />
                        <span>Tour • {item.location || cardTitle}</span>
                      </div>

                      {/* Floating Card Toolbar in Edit Mode */}
                      {isEditorActive && !editorCtx.isPreviewMode && (
                        <div className="floating-card-toolbar" onClick={(e) => e.stopPropagation()}>
                          <span className="card-toolbar-label">CARD {idx + 1}</span>
                          <button
                            type="button"
                            className="card-tool-btn"
                            onClick={() => editorCtx.reorderGalleryCard(item.id, 'left')}
                            disabled={idx === 0}
                            title="Move Card Left"
                          >
                            <MoveLeft size={12} />
                          </button>
                          <button
                            type="button"
                            className="card-tool-btn"
                            onClick={() => editorCtx.reorderGalleryCard(item.id, 'right')}
                            disabled={idx === galleryItems.length - 1}
                            title="Move Card Right"
                          >
                            <MoveRight size={12} />
                          </button>
                          <button
                            type="button"
                            className="card-tool-btn"
                            onClick={() => editorCtx.duplicateGalleryCard(item.id)}
                            title="Duplicate Card"
                          >
                            <Copy size={12} /> <span>Duplicate</span>
                          </button>
                          <button
                            type="button"
                            className="card-tool-btn"
                            onClick={() => editorCtx.toggleGalleryCardVisibility(item.id)}
                            title={item.active === false ? "Show Card on Website" : "Hide Card from Website"}
                          >
                            {item.active === false ? <EyeOff size={12} /> : <Eye size={12} />} <span>{item.active === false ? 'Hidden' : 'Hide'}</span>
                          </button>
                          <button
                            type="button"
                            className="card-tool-btn delete-tool-btn"
                            onClick={() => editorCtx.deleteGalleryCard(item.id)}
                            title="Delete Card"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}

                      {/* 1. CARD IMAGE FRAME */}
                      <div
                        className={`tour-card-image-box spatial-img-frame ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isImgSelected ? 'element-selected-active' : ''}`}
                        onClick={(e) => {
                          if (isEditorActive && !editorCtx.isPreviewMode) {
                            e.stopPropagation();
                            editorCtx.setSelectedSectionId(section.id);
                            editorCtx.setSelectedElement({
                              type: 'card_image',
                              cardId: item.id,
                              card: item,
                              sectionId: section.id,
                              src: item.image,
                              alt: item.title,
                              height: item.image_height || '240px',
                              object_fit: item.image_object_fit || 'cover'
                            });
                          }
                        }}
                      >
                        {isEditorActive && !editorCtx.isPreviewMode && (
                          <span className="element-badge-tag">IMAGE</span>
                        )}
                        <img
                          src={item.image}
                          alt={item.title}
                        />

                        {/* Floating Detail Badges */}
                        <div className="tour-side-badges-stack">
                          <div className="glass-badge-pill">
                            <Building2 size={13} color="#38bdf8" />
                            <span>{idx === 0 ? '4 Hotels • 6 Sights' : idx === 1 ? '5 Hotels • 5 Landmarks' : '3 Hotels • 4 Sights'}</span>
                          </div>
                          <div className="glass-badge-pill">
                            <Calendar size={13} color="#c084fc" />
                            <span>{idx === 0 ? '3-Day Inspection • Q4 2026' : idx === 1 ? '4-Day Inspection • Nov 2026' : '5-Day Inspection • 2026'}</span>
                          </div>
                          <div className="glass-badge-pill">
                            <Award size={13} color="#60a5fa" />
                            <span>Site Audit Complete</span>
                          </div>
                        </div>

                        {isEditorActive && !editorCtx.isPreviewMode && (
                          <button
                            type="button"
                            className="btn-card-quick-replace-img"
                            onClick={(e) => {
                              e.stopPropagation();
                              editorCtx.setSelectedSectionId(section.id);
                              editorCtx.setSelectedElement({
                                type: 'card_image',
                                cardId: item.id,
                                card: item,
                                sectionId: section.id,
                                src: item.image,
                                alt: item.title
                              });
                              editorCtx.triggerMediaPicker((newUrl) => {
                                editorCtx.updateGalleryCard(item.id, { image: newUrl });
                              });
                            }}
                            title="Replace Card Image"
                          >
                            <Upload size={12} />
                            <span>Replace Image</span>
                          </button>
                        )}
                      </div>

                      {/* Card Spatial Content Area */}
                      <div className="tour-card-spatial-content">
                        {/* Title */}
                        <div
                          className={`tour-card-title-box ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isTitleSelected ? 'element-selected-active' : ''}`}
                          onClick={(e) => {
                            if (isEditorActive && !editorCtx.isPreviewMode) {
                              e.stopPropagation();
                              editorCtx.setSelectedSectionId(section.id);
                              editorCtx.setSelectedElement({
                                type: 'card_title',
                                cardId: item.id,
                                card: item,
                                sectionId: section.id,
                                text_en: item.title,
                                text_de: item.title_de || item.title
                              });
                            }
                          }}
                        >
                          {isEditorActive && !editorCtx.isPreviewMode && (
                            <span className="element-badge-tag">TITLE</span>
                          )}
                          <h3 className="tour-spatial-title">
                            {isEditorActive && !editorCtx.isPreviewMode ? (
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                className="builder-inline-editable"
                                onBlur={(e) => {
                                  const val = e.currentTarget.innerText;
                                  editorCtx.updateGalleryCard(item.id, { title: val });
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.currentTarget.blur();
                                  }
                                }}
                              >
                                {cardTitle}
                              </span>
                            ) : (
                              cardTitle
                            )}
                          </h3>
                        </div>

                        {/* Location */}
                        <div
                          className={`tour-card-loc-box ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isLocationSelected ? 'element-selected-active' : ''}`}
                          onClick={(e) => {
                            if (isEditorActive && !editorCtx.isPreviewMode) {
                              e.stopPropagation();
                              editorCtx.setSelectedSectionId(section.id);
                              editorCtx.setSelectedElement({
                                type: 'card_location',
                                cardId: item.id,
                                card: item,
                                sectionId: section.id,
                                location: item.location
                              });
                            }
                          }}
                        >
                          {isEditorActive && !editorCtx.isPreviewMode && (
                            <span className="element-badge-tag">LOCATION</span>
                          )}
                          <div className="tour-loc-badge-inner">
                            <MapPin size={13} color="#38bdf8" />
                            {isEditorActive && !editorCtx.isPreviewMode ? (
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                className="builder-inline-editable"
                                onBlur={(e) => {
                                  const val = e.currentTarget.innerText;
                                  editorCtx.updateGalleryCard(item.id, { location: val });
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.currentTarget.blur();
                                  }
                                }}
                              >
                                {item.location || 'Featured Destination'}
                              </span>
                            ) : (
                              <span>{item.location || 'Featured Destination'}</span>
                            )}
                          </div>
                        </div>

                        {/* Description / Highlights */}
                        <div
                          className={`tour-card-desc-box ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isDescSelected ? 'element-selected-active' : ''}`}
                          onClick={(e) => {
                            if (isEditorActive && !editorCtx.isPreviewMode) {
                              e.stopPropagation();
                              editorCtx.setSelectedSectionId(section.id);
                              editorCtx.setSelectedElement({
                                type: 'card_desc',
                                cardId: item.id,
                                card: item,
                                sectionId: section.id,
                                desc_en: item.desc_en,
                                desc_de: item.desc_de
                              });
                            }
                          }}
                        >
                          {isEditorActive && !editorCtx.isPreviewMode && (
                            <span className="element-badge-tag">DESCRIPTION</span>
                          )}
                          <p className="tour-spatial-desc">
                            <span className="highlight-tag">Highlights:</span>{' '}
                            {isEditorActive && !editorCtx.isPreviewMode ? (
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                className="builder-inline-editable"
                                onBlur={(e) => {
                                  const val = e.currentTarget.innerText;
                                  editorCtx.updateGalleryCard(item.id, { [lang === 'de' ? 'desc_de' : 'desc_en']: val });
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.currentTarget.blur();
                                  }
                                }}
                              >
                                {resolvedDesc}
                              </span>
                            ) : (
                              resolvedDesc
                            )}
                          </p>
                        </div>

                        {/* Action Button */}
                        <div
                          className={`tour-card-btn-box ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isBtnSelected ? 'element-selected-active' : ''}`}
                          onClick={(e) => {
                            if (isEditorActive && !editorCtx.isPreviewMode) {
                              e.preventDefault();
                              e.stopPropagation();
                              editorCtx.setSelectedSectionId(section.id);
                              editorCtx.setSelectedElement({
                                type: 'card_button',
                                cardId: item.id,
                                card: item,
                                sectionId: section.id,
                                text_en: item.button_text_en || 'View Full Tour Plan',
                                text_de: item.button_text_de || 'Reiseziel entdecken',
                                link: btnLink,
                                target: btnTarget
                              });
                            }
                          }}
                        >
                          {isEditorActive && !editorCtx.isPreviewMode && (
                            <span className="element-badge-tag">BUTTON</span>
                          )}
                          <NavLink
                            to={isEditorActive && !editorCtx.isPreviewMode ? '#' : btnLink}
                            target={isEditorActive && !editorCtx.isPreviewMode ? undefined : btnTarget}
                            className="btn-liquid-tour-plan"
                            onClick={(e) => {
                              if (isEditorActive && !editorCtx.isPreviewMode) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <span>{btnText === 'Explore Destination' ? 'View Full Tour Plan' : btnText}</span>
                            <ArrowRight size={15} />
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                );
              })}

              {/* [ + Add Card ] slot at the end of gallery in Edit Mode */}
              {isEditorActive && !editorCtx.isPreviewMode && (
                <div
                  className="tour-card-add-placeholder"
                  onClick={(e) => {
                    e.stopPropagation();
                    editorCtx.addGalleryCard();
                  }}
                  title="Add a new card to this gallery section"
                >
                  <div className="add-card-circle">
                    <Plus size={26} color="#38bdf8" />
                  </div>
                  <span className="add-card-title">+ Add Card</span>
                  <span className="add-card-sub">Create new destination showcase</span>
                </div>
              )}
            </div>

            {/* Bottom MICE Specialization Glass Capsule Bar */}
            <div className="mice-spec-glass-bar">
              <div className="mice-spec-label">
                <span className="pulsing-dot"></span>
                <span>MICE Specialization</span>
              </div>
              <div className="mice-spec-items">
                <span className="spec-item">• RFP & Procurement Support</span>
                <span className="spec-item">• On-Site Photolog & Report Delivered</span>
                <span className="spec-item">• Sustainability Scoring Included</span>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // 13b. UPCOMING DESTINATIONS BANNER (SPATIAL LIQUID GLASS CAPSULE TICKER)
    if (section.id === 'hotels_upcoming' || section.type === 'upcoming') {
      const title = lang === 'de' ? (section.title_de || section.title_en) : (section.title_en || section.title_de);
      const badgeText = lang === 'de' ? 'KOMMENDE TOUREN' : 'UPCOMING TOURS';
      const upcomingText = title || 'Next: Kenya - Mexico - USA - Brazil - Japan';

      return (
        <section
          className={`hotels-upcoming-section ${isBuilderMode ? 'builder-section-preview' : ''}`}
          style={customStyle}
          onClick={() => {
            if (isEditorActive && !editorCtx.isPreviewMode) {
              editorCtx.setSelectedSectionId(section.id);
              editorCtx.setSelectedElement({ type: 'section', sectionId: section.id, section });
            }
          }}
        >
          <div className="container">
            <AnimatedSection direction={anim.type} distance={20}>
              <SportsMarqueeTicker badgeText={badgeText} upcomingText={upcomingText} />
            </AnimatedSection>
          </div>
        </section>
      );
    }

    // 14. TESTIMONIALS SECTION
    if (section.type === 'testimonials') {
      const title = lang === 'de' ? (section.title_de || 'Kundenstimmen & Referenzen') : (section.title_en || 'Client Testimonials & Trust');
      const testimonialsList = cmsConfig?.testimonials?.filter(t => t.active !== false) || [
        { id: 'test_1', name: 'National Hockey Delegation', role: 'Team Manager', review: 'Flawless hotel selection and logistical execution for our international training camp.', rating: 5 },
        { id: 'test_2', name: 'European Sports Federation', role: 'Congress Organizer', review: 'The venue scouting was outstanding. The facilities matched all athletic needs perfectly.', rating: 5 }
      ];

      return (
        <section className={`testimonials-section ${isBuilderMode ? 'builder-section-preview' : ''}`} style={customStyle}>
          <div className="container">
            <AnimatedSection direction="up" distance={20}>
              <h2 className="section-main-title" style={{ textAlign: 'center', marginBottom: '40px', color: section.heading_color || undefined }}>
                {renderInlineText(lang === 'de' ? 'title_de' : 'title_en', title, 'Client Testimonials & Trust', 'span')}
              </h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {testimonialsList.map((item, idx) => (
                <AnimatedCard key={item.id || idx} index={idx}>
                  <div style={{ background: '#faf5fa', padding: '30px', borderRadius: '12px', border: '1px solid #ede4ed', height: '100%' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', color: '#ffb703' }}>
                      {[...Array(item.rating || 5)].map((_, i) => <Star key={i} size={16} fill="#ffb703" />)}
                    </div>
                    <p style={{ fontStyle: 'italic', color: '#333', marginBottom: '20px', lineHeight: 1.6 }}>"{item.review}"</p>
                    <div>
                      <h4 style={{ fontWeight: 700, color: '#1f242d', margin: 0 }}>{item.name}</h4>
                      <span style={{ fontSize: '0.85rem', color: '#777' }}>{item.role}</span>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // 15. FAQ ACCORDION SECTION
    if (section.type === 'faq' || section.type === 'faqs') {
      const title = lang === 'de' ? (section.title_de || 'Häufig gestellte Fragen (FAQ)') : (section.title_en || 'Frequently Asked Questions (FAQ)');
      const faqsList = cmsConfig?.faqs?.filter(f => f.active !== false) || [
        { id: 'faq_1', question_en: 'How does Sports & MICE select team hotels?', answer_en: 'We personally inspect hotels on site to ensure they meet athletic dietary requirements.' },
        { id: 'faq_2', question_en: 'Can you handle emergency travel changes for large delegations?', answer_en: 'Yes, our 24/7 coordination team handles flight delays and room reallocations promptly.' }
      ];

      return (
        <section className={`faq-section ${isBuilderMode ? 'builder-section-preview' : ''}`} style={customStyle}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <AnimatedSection direction="up" distance={20}>
              <h2 className="section-main-title" style={{ textAlign: 'center', marginBottom: '35px', color: section.heading_color || undefined }}>
                {renderInlineText(lang === 'de' ? 'title_de' : 'title_en', title, 'Frequently Asked Questions', 'span')}
              </h2>
            </AnimatedSection>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faqsList.map((faq, idx) => {
                const isOpen = openFaqId === (faq.id || idx);
                const q = lang === 'de' ? (faq.question_de || faq.question_en) : (faq.question_en || faq.question_de);
                const a = lang === 'de' ? (faq.answer_de || faq.answer_en) : (faq.answer_en || faq.answer_de);

                return (
                  <AnimatedCard key={faq.id || idx} index={idx}>
                    <div
                      style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', overflow: 'hidden' }}
                    >
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : (faq.id || idx))}
                        style={{ width: '100%', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, fontSize: '1.05rem', color: '#1f242d', cursor: 'pointer' }}
                      >
                        <span>{q}</span>
                        <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 24px 20px', color: '#555', lineHeight: 1.6, borderTop: '1px solid #f3f4f6', paddingTop: '14px' }}>
                          {a}
                        </div>
                      )}
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    // 16. CONTACT FORM SECTION
    if (section.id === 'contact_form_section' || section.type === 'contact') {
      const title = lang === 'de' ? (section.title_de || 'contact form') : (section.title_en || 'contact form');
      const subtitle = lang === 'de' 
        ? (section.subtitle_de || 'Haben Sie Fragen zu unseren Sports & MICE Beratungsleistungen? Kontaktieren Sie unser Team und wir antworten innerhalb von 24 Stunden.') 
        : (section.subtitle_en || 'Have questions about our sports & MICE consulting services? Get in touch with our team and we\'ll respond within 24 hours.');

      const isFormSelected = isEditorActive && !editorCtx.isPreviewMode &&
        editorCtx.selectedElement?.type === 'form' && editorCtx.selectedElement?.sectionId === section.id;

      const handleFormClick = (e) => {
        if (isEditorActive && !editorCtx.isPreviewMode) {
          e.preventDefault();
          e.stopPropagation();
          editorCtx.setSelectedSectionId(section.id);
          editorCtx.setSelectedElement({
            type: 'form',
            sectionId: section.id,
            title_en: section.title_en || 'contact form',
            title_de: section.title_de || 'kontaktformular',
            subtitle_en: section.subtitle_en || 'Have questions about our sports & MICE consulting services?',
            subtitle_de: section.subtitle_de || 'Haben Sie Fragen zu unseren Sports & MICE Beratungsleistungen?'
          });
        }
      };

      return (
        <section className={`contact-page ${isBuilderMode ? 'builder-section-preview' : ''}`} style={customStyle}>
          {/* Floating 3D Liquid Orbs Background */}
          <div className="contact-liquid-orbs">
            <div className="contact-orb contact-orb-1" />
            <div className="contact-orb contact-orb-2" />
            <div className="contact-orb contact-orb-3" />
            <div className="contact-orb contact-orb-4" />
          </div>

          <div className="contact-glass-container">
            <div className="contact-glass-grid">

              {/* LEFT MASTER GLASS CARD: Consultation Info Panel */}
              <AnimatedSection direction="left" distance={30} className="contact-glass-card">
                <div>
                 
                  <h2 className="contact-master-title" style={{ color: section.heading_color || undefined }}>
                    {renderInlineText(lang === 'de' ? 'title_de' : 'title_en', title, 'contact form', 'span')}
                  </h2>
                  <p className="contact-master-subtitle">
                    {renderInlineText(lang === 'de' ? 'subtitle_de' : 'subtitle_en', subtitle, 'Have questions about our sports & MICE consulting services? Get in touch with our team and we\'ll respond within 24 hours.', 'span')}
                  </p>
                </div>

                {/* Inset Liquid Glass Contact Detail Pills */}
                <div className="contact-inset-pills-list">
                  <div className="contact-inset-pill">
                    <div className="contact-spherical-icon">
                      <Phone size={20} />
                    </div>
                    <div className="contact-pill-content">
                      <span className="contact-pill-label">Phone</span>
                      <a href="tel:+492241343320" className="contact-pill-value">+49 2241 343320</a>
                    </div>
                  </div>

                  <div className="contact-inset-pill">
                    <div className="contact-spherical-icon">
                      <Printer size={20} />
                    </div>
                    <div className="contact-pill-content">
                      <span className="contact-pill-label">Fax</span>
                      <span className="contact-pill-value">+49 2241 344316</span>
                    </div>
                  </div>

                  <div className="contact-inset-pill">
                    <div className="contact-spherical-icon">
                      <Mail size={20} />
                    </div>
                    <div className="contact-pill-content">
                      <span className="contact-pill-label">Email</span>
                      <a href="mailto:contact@sportsandmice.com" className="contact-pill-value">contact@sportsandmice.com</a>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* RIGHT MASTER GLASS CARD: Interactive Liquid Form Panel */}
              <AnimatedSection direction="right" distance={30} className="contact-glass-card">
                <div
                  className={isFormSelected ? 'builder-element-selected' : ''}
                  onClick={handleFormClick}
                  style={{ cursor: isEditorActive && !editorCtx.isPreviewMode ? 'pointer' : 'default' }}
                >
                  <h3 className="contact-form-heading">
                    {lang === 'de' ? 'Nachricht senden' : 'Send us a message'}
                  </h3>
                  <p className="contact-form-subtext">
                    {lang === 'de'
                      ? 'Füllen Sie das Formular aus und unser Berater wird Sie in Kürze kontaktieren.'
                      : 'Fill out the form and our consultant will contact you shortly.'
                    }
                  </p>

                  <form
                    onSubmit={(e) => {
                      if (isEditorActive && !editorCtx.isPreviewMode) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    className="glass-form-layout"
                  >
                    {/* Row 1: Surname & e-mail */}
                    <div className="glass-form-row-2col">
                      <div className="glass-form-group">
                        <label className="glass-form-label">Surname</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Marc" 
                          className="glass-form-input"
                          readOnly={isEditorActive && !editorCtx.isPreviewMode}
                        />
                      </div>

                      <div className="glass-form-group">
                        <label className="glass-form-label">e-mail</label>
                        <input 
                          type="email" 
                          placeholder="you@email.com" 
                          className="glass-form-input"
                          readOnly={isEditorActive && !editorCtx.isPreviewMode}
                        />
                      </div>
                    </div>

                    {/* Row 2: Country & City */}
                    <div className="glass-form-row-2col">
                      <div className="glass-form-group">
                        <label className="glass-form-label">Country</label>
                        <input 
                          type="text" 
                          placeholder="Germany" 
                          className="glass-form-input"
                          readOnly={isEditorActive && !editorCtx.isPreviewMode}
                        />
                      </div>

                      <div className="glass-form-group">
                        <label className="glass-form-label">City</label>
                        <input 
                          type="text" 
                          placeholder="Sankt Augustin" 
                          className="glass-form-input"
                          readOnly={isEditorActive && !editorCtx.isPreviewMode}
                        />
                      </div>
                    </div>

                    {/* Row 3: Address */}
                    <div className="glass-form-group">
                      <label className="glass-form-label">Address</label>
                      <input 
                        type="text" 
                        placeholder="Fritz-Pullig-Strasse 9, 53757 Sankt Augustin" 
                        className="glass-form-input"
                        readOnly={isEditorActive && !editorCtx.isPreviewMode}
                      />
                    </div>

                    {/* Row 4: Message */}
                    <div className="glass-form-group">
                      <label className="glass-form-label">Message</label>
                      <textarea 
                        rows="3"
                        placeholder="Tell us about your project, event, or consultation needs..." 
                        className="glass-form-textarea"
                        readOnly={isEditorActive && !editorCtx.isPreviewMode}
                      />
                    </div>

                    {/* Row 5: Action Submit Button */}
                    <div className="glass-form-action-bar">
                      <button 
                        type={isEditorActive && !editorCtx.isPreviewMode ? 'button' : 'submit'}
                        className="btn-glass-purple-submit"
                        onClick={(e) => {
                          if (isEditorActive && !editorCtx.isPreviewMode) {
                            handleFormClick(e);
                          }
                        }}
                      >
                        <span>Send Message</span>
                        <Send size={16} />
                      </button>
                    </div>
                  </form>
                </div>
              </AnimatedSection>

            </div>
          </div>
        </section>
      );
    }

    // 18. CUSTOM ROW & MULTI-COLUMN LAYOUT SYSTEM
    if (section.type === 'row' || section.type === 'columns' || section.type === 'custom_row' || section.type === 'grid' || section.columns) {
      const rawCols = section.columns || [
        { id: 'col_1', width: '50%', blocks: [{ id: 'b_1', type: 'heading', level: 'h2', text_en: 'Empowering Sports Excellence', text_de: 'Exzellenz im Sport fördern' }, { id: 'b_2', type: 'text', text_en: 'Comprehensive solutions for athletes, delegations, and sports federations.', text_de: 'Umfassende Lösungen für Sportler, Delegationen und Verbände.' }] },
        { id: 'col_2', width: '50%', blocks: [{ id: 'b_3', type: 'image', src: '/assets/images/home_hero_bg.jpg', alt: 'Sports & MICE' }] }
      ];

      const getColWidthPercent = (col, idx, total) => {
        if (col.width) {
          if (typeof col.width === 'number') return `${col.width}%`;
          if (col.width.includes('%')) return col.width;
        }
        if (section.layout === '33-33-33') return '33.333%';
        if (section.layout === '25-25-25-25') return '25%';
        if (section.layout === '66-33') return idx === 0 ? '66.666%' : '33.333%';
        if (section.layout === '33-66') return idx === 0 ? '33.333%' : '66.666%';
        if (section.layout === '75-25') return idx === 0 ? '75%' : '25%';
        if (section.layout === '25-75') return idx === 0 ? '25%' : '75%';
        if (section.layout === '25-50-25') return idx === 1 ? '50%' : '25%';
        if (section.layout === '100') return '100%';
        return `${Math.floor(100 / total)}%`;
      };

      const ICON_LOOKUP = {
        Star, Trophy, Users, ShieldCheck, CheckCircle2, Globe2, Zap, Building2, Sparkles, Phone, Mail, Compass, HelpCircle, Clock, MapPin, Award, Heart
      };

      const renderBlockToolbar = (block, colId, bIdx, totalBlocks) => {
        if (!isEditorActive || editorCtx.isPreviewMode) return null;
        const bType = (block.type || 'block').toLowerCase();

        return (
          <div className="builder-block-floating-toolbar" onClick={(e) => e.stopPropagation()}>
            <div className={`block-drag-handle-badge badge-${bType}`} title="Drag to reorder block">
              <GripVertical size={11} />
              <span className="block-type-name">{(block.type || 'block').toUpperCase()}</span>
            </div>

            <div className="block-toolbar-actions">
              <button
                type="button"
                className={`editor-icon-btn btn-move ${bIdx === 0 ? 'disabled' : ''}`}
                onClick={() => bIdx > 0 && editorCtx.moveBlock(section.id, colId, block.id, 'up')}
                title="Move Block Up"
                disabled={bIdx === 0}
              >
                <MoveUp size={11} />
              </button>

              <button
                type="button"
                className={`editor-icon-btn btn-move ${bIdx >= totalBlocks - 1 ? 'disabled' : ''}`}
                onClick={() => bIdx < totalBlocks - 1 && editorCtx.moveBlock(section.id, colId, block.id, 'down')}
                title="Move Block Down"
                disabled={bIdx >= totalBlocks - 1}
              >
                <MoveDown size={11} />
              </button>

              <button
                type="button"
                className="editor-icon-btn btn-dup"
                onClick={() => editorCtx.duplicateBlock(section.id, colId, block.id)}
                title="Duplicate Block"
              >
                <Copy size={11} />
              </button>

              <button
                type="button"
                className="editor-icon-btn btn-settings"
                onClick={() => {
                  editorCtx.setSelectedSectionId(section.id);
                  editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: block.type });
                }}
                title="Block Settings"
              >
                <Settings size={11} />
              </button>

              <button
                type="button"
                className="editor-icon-btn btn-del"
                onClick={() => {
                  if (window.confirm(`Delete this ${block.type || 'block'} element?`)) {
                    editorCtx.removeBlock(section.id, colId, block.id);
                  }
                }}
                title="Delete Block"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        );
      };

      const renderBlock = (block, colId, bIdx, totalBlocks = 1) => {
        if (!block) return null;
        const bType = block.type || 'text';
        const isBlockSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.blockId === block.id;

        // 1. Heading block (H1-H6)
        if (bType === 'heading') {
          const Tag = block.level || 'h2';
          const headText = lang === 'de' ? (block.text_de || block.text_en || block.text) : (block.text_en || block.text_de || block.text);

          const headSize = getResponsiveValue(block, 'font_size', curViewport) || getResponsiveValue(block, 'size', curViewport) || (Tag === 'h1' ? '2.4rem' : Tag === 'h2' ? '2rem' : Tag === 'h3' ? '1.5rem' : '1.2rem');
          const headAlign = getResponsiveValue(block, 'align', curViewport) || 'left';
          const headMarginBottom = getResponsiveValue(block, 'margin_bottom', curViewport, '16');

          const headStyle = {
            color: block.color || section.heading_color || '#1f242d',
            fontSize: headSize.includes('px') || headSize.includes('rem') || headSize.includes('em') ? headSize : `${headSize}px`,
            fontWeight: block.weight || 700,
            textAlign: headAlign,
            marginBottom: `${headMarginBottom}px`,
            lineHeight: 1.25
          };

          if (isEditorActive) {
            return (
              <div
                key={block.id || bIdx}
                className={`builder-block-item ${isBlockSelected ? 'builder-element-selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  editorCtx.setSelectedSectionId(section.id);
                  editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: 'heading' });
                }}
              >
                {renderBlockToolbar(block, colId, bIdx, totalBlocks)}
                <Tag style={headStyle}>
                  {renderInlineText(
                    `block_${block.id}_${lang === 'de' ? 'text_de' : 'text_en'}`,
                    headText,
                    'Add Heading Here...',
                    Tag,
                    '',
                    { color: 'inherit' }
                  )}
                </Tag>
              </div>
            );
          }
          return <Tag key={block.id || bIdx} style={headStyle}>{headText || 'Heading'}</Tag>;
        }

        // 2. Paragraph / Text block
        if (bType === 'text' || bType === 'paragraph') {
          const textContent = lang === 'de' ? (block.text_de || block.text_en || block.text) : (block.text_en || block.text_de || block.text);

          const textSize = getResponsiveValue(block, 'font_size', curViewport) || getResponsiveValue(block, 'size', curViewport) || '1.05rem';
          const textAlign = getResponsiveValue(block, 'align', curViewport) || 'left';
          const textLineHeight = getResponsiveValue(block, 'line_height', curViewport, '1.65');
          const textMarginBottom = getResponsiveValue(block, 'margin_bottom', curViewport, '16');

          const textStyle = {
            color: block.color || '#555555',
            fontSize: textSize.includes('px') || textSize.includes('rem') || textSize.includes('em') ? textSize : `${textSize}px`,
            lineHeight: textLineHeight,
            textAlign: textAlign,
            marginBottom: `${textMarginBottom}px`
          };

          if (isEditorActive) {
            return (
              <div
                key={block.id || bIdx}
                className={`builder-block-item ${isBlockSelected ? 'builder-element-selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  editorCtx.setSelectedSectionId(section.id);
                  editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: 'text' });
                }}
              >
                {renderBlockToolbar(block, colId, bIdx, totalBlocks)}
                <p style={textStyle}>
                  {renderInlineText(
                    `block_${block.id}_${lang === 'de' ? 'text_de' : 'text_en'}`,
                    textContent,
                    'Click to edit paragraph text...',
                    'span',
                    '',
                    { color: 'inherit' }
                  )}
                </p>
              </div>
            );
          }
          return <p key={block.id || bIdx} style={textStyle}>{textContent}</p>;
        }

        // 3. Image Block
        if (bType === 'image') {
          const imgSrc = block.src || block.image || '/assets/images/home_hero_bg.jpg';
          const imgAlt = block.alt || 'Website Image';

          const imgWidth = getResponsiveValue(block, 'width', curViewport) || '100%';
          const imgHeight = getResponsiveValue(block, 'height', curViewport) || '420px';
          const imgRadius = getResponsiveValue(block, 'border_radius', curViewport) || '12px';
          const imgAlign = getResponsiveValue(block, 'align', curViewport) || 'center';

          const imgStyle = {
            width: imgWidth,
            maxHeight: imgHeight,
            objectFit: block.object_fit || 'cover',
            borderRadius: imgRadius.includes('px') ? imgRadius : `${imgRadius}px`,
            boxShadow: block.shadow ? '0 10px 25px rgba(0,0,0,0.08)' : 'none',
            display: 'block',
            marginBottom: '16px'
          };

          if (isEditorActive) {
            return (
              <div
                key={block.id || bIdx}
                className={`builder-block-item ${isBlockSelected ? 'builder-element-selected' : ''}`}
                style={{ position: 'relative', marginBottom: '16px', textAlign: imgAlign }}
                onClick={(e) => {
                  e.stopPropagation();
                  editorCtx.setSelectedSectionId(section.id);
                  editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: 'image' });
                }}
              >
                {renderBlockToolbar(block, colId, bIdx, totalBlocks)}
                {renderEditableImage(`block_${block.id}_src`, imgSrc, imgAlt, '', imgStyle)}
              </div>
            );
          }
          return (
            <div key={block.id || bIdx} style={{ marginBottom: '16px', textAlign: imgAlign }}>
              <img src={imgSrc} alt={imgAlt} style={imgStyle} loading="lazy" decoding="async" />
            </div>
          );
        }

        // 4. Button Block
        if (bType === 'button' || bType === 'cta') {
          if (block.enabled === false && !isEditorActive) return null;
          const btnTextEn = block.text_en || block.text || 'Click Here';
          const btnTextDe = block.text_de || block.text || 'Hier klicken';
          const resolvedBtnText = lang === 'de' ? (btnTextDe || btnTextEn) : btnTextEn;
          const btnLink = block.link || block.url || '/en/Contact/';
          const btnLinkType = block.link_type || 'internal';
          const btnTarget = block.target || '_self';
          const isPrimary = block.style !== 'secondary' && block.style !== 'outline';

          const btnPadding = getResponsiveValue(block, 'padding', curViewport) || '12px 28px';
          const btnFontSize = getResponsiveValue(block, 'font_size', curViewport) || '0.95rem';
          const btnWidth = getResponsiveValue(block, 'width', curViewport) || (curViewport === 'mobile' && block.mobile_full_width ? '100%' : 'auto');
          const btnRadius = getResponsiveValue(block, 'border_radius', curViewport) || '50px';
          const btnAlign = getResponsiveValue(block, 'align', curViewport) || 'left';

          const btnStyle = {
            display: btnWidth === '100%' ? 'flex' : 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: btnWidth,
            gap: '8px',
            '--btn-custom-bg': block.bg_color || undefined,
            '--btn-custom-color': block.text_color || undefined,
            '--btn-custom-hover-bg': block.hover_bg_color || undefined,
            '--btn-custom-hover-color': block.hover_text_color || undefined,
            background: block.bg_color || (isPrimary ? '#ff0000' : 'transparent'),
            backgroundColor: block.bg_color || (isPrimary ? '#ff0000' : 'transparent'),
            backgroundImage: block.bg_color ? 'none' : undefined,
            color: block.text_color || (isPrimary ? '#ffffff' : '#1f242d'),
            border: block.border_color ? `2px solid ${block.border_color}` : (isPrimary ? 'none' : '2px solid #1f242d'),
            padding: btnPadding,
            borderRadius: btnRadius ? (btnRadius.includes('px') || btnRadius.includes('%') ? btnRadius : `${btnRadius}px`) : '50px',
            fontWeight: block.font_weight || 700,
            fontSize: btnFontSize.includes('px') || btnFontSize.includes('rem') ? btnFontSize : `${btnFontSize}px`,
            textDecoration: 'none',
            cursor: 'pointer',
            marginBottom: '16px',
            transition: 'all 0.2s ease',
            boxShadow: block.bg_color ? `0 4px 14px ${block.bg_color}44` : undefined
          };

          const handleBlockButtonClick = (e) => {
            if (isEditorActive && !editorCtx.isPreviewMode) {
              e.preventDefault();
              e.stopPropagation();
              editorCtx.setSelectedSectionId(section.id);
              editorCtx.setSelectedElement({
                type: 'button',
                sectionId: section.id,
                colId,
                blockId: block.id,
                block,
                text_en: btnTextEn,
                text_de: btnTextDe,
                link: btnLink,
                link_type: btnLinkType,
                target: btnTarget,
                enabled: block.enabled !== false
              });
            }
          };

          if (isEditorActive) {
            return (
              <div
                key={block.id || bIdx}
                className={`builder-block-item ${isBlockSelected ? 'builder-element-selected' : ''}`}
                style={{ textAlign: btnAlign, marginBottom: '16px' }}
                onClick={handleBlockButtonClick}
              >
                {renderBlockToolbar(block, colId, bIdx, totalBlocks)}
                <NavLink
                  to={editorCtx.isPreviewMode ? btnLink : '#'}
                  target={editorCtx.isPreviewMode ? btnTarget : undefined}
                  className="btn-red-pill"
                  style={btnStyle}
                  onClick={handleBlockButtonClick}
                >
                  <span>{resolvedBtnText}</span>
                  <ArrowRight size={16} />
                </NavLink>
              </div>
            );
          }

          return (
            <div key={block.id || bIdx} style={{ textAlign: btnAlign, marginBottom: '16px' }}>
              <NavLink
                to={btnLink}
                target={btnTarget}
                className="btn-red-pill"
                style={btnStyle}
              >
                <span>{resolvedBtnText}</span>
                <ArrowRight size={16} />
              </NavLink>
            </div>
          );
        }

        // 5. Card Block
        if (bType === 'card') {
          if (block.enabled === false && !isEditorActive) return null;
          const cardTitle = lang === 'de' ? (block.title_de || block.title_en || block.title) : (block.title_en || block.title_de || block.title);
          const cardDesc = lang === 'de' ? (block.desc_de || block.desc_en || block.desc) : (block.desc_en || block.desc_de || block.desc);
          const IconC = block.icon ? (ICON_LOOKUP[block.icon] || Star) : null;

          const cardContent = (
            <div
              style={{
                background: block.bg || '#faf5fa',
                border: `1px solid ${block.border_color || '#ede4ed'}`,
                borderRadius: block.border_radius || '12px',
                padding: block.padding || '24px',
                marginBottom: '16px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                textAlign: block.align || 'left'
              }}
            >
              {block.image && <img src={block.image} alt={cardTitle} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '14px' }} loading="lazy" decoding="async" />}
              {IconC && (
                <div style={{ width: '44px', height: '44px', borderRadius: '50px', background: 'rgba(255,0,0,0.1)', color: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <IconC size={22} />
                </div>
              )}
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f242d', marginBottom: '8px' }}>{cardTitle || 'Card Title'}</h4>
              <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: block.button_text ? '14px' : 0 }}>{cardDesc || 'Card description goes here.'}</p>
              {block.button_text && (
                <NavLink to={isEditorActive && !editorCtx.isPreviewMode ? '#' : (block.button_link || '#')} className="btn-red-pill" style={{ padding: '8px 18px', fontSize: '0.85rem', marginTop: '12px', display: 'inline-flex' }} onClick={isEditorActive && !editorCtx.isPreviewMode ? e => e.preventDefault() : undefined}>
                  <span>{block.button_text}</span>
                </NavLink>
              )}
            </div>
          );

          if (isEditorActive) {
            return (
              <div
                key={block.id || bIdx}
                className={`builder-block-item ${isBlockSelected ? 'builder-element-selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  editorCtx.setSelectedSectionId(section.id);
                  editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: 'card' });
                }}
              >
                {renderBlockToolbar(block, colId, bIdx, totalBlocks)}
                {cardContent}
              </div>
            );
          }
          return <div key={block.id || bIdx}>{cardContent}</div>;
        }

        // 6. Icon Block
        if (bType === 'icon') {
          const IconC = ICON_LOOKUP[block.icon] || Star;
          const iconSize = parseInt(block.size) || 36;
          const iconBox = (
            <div style={{ textAlign: block.align || 'left', marginBottom: '16px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${iconSize + 22}px`, height: `${iconSize + 22}px`, background: block.bg_color || 'rgba(255,0,0,0.1)', color: block.color || '#ff0000', borderRadius: block.border_radius || '50px' }}>
                <IconC size={iconSize} />
              </div>
            </div>
          );

          if (isEditorActive) {
            return (
              <div
                key={block.id || bIdx}
                className={`builder-block-item ${isBlockSelected ? 'builder-element-selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  editorCtx.setSelectedSectionId(section.id);
                  editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: 'icon' });
                }}
              >
                {renderBlockToolbar(block, colId, bIdx, totalBlocks)}
                {iconBox}
              </div>
            );
          }
          return <div key={block.id || bIdx}>{iconBox}</div>;
        }

        // 7. Badge Block
        if (bType === 'badge') {
          const badgeContent = (
            <div style={{ textAlign: block.align || 'left', marginBottom: '14px' }}>
              <span style={{ display: 'inline-block', padding: '5px 16px', background: block.bg_color || 'rgba(255, 0, 0, 0.12)', color: block.text_color || '#ff0000', borderRadius: block.border_radius || '50px', fontWeight: 700, fontSize: '0.84rem', letterSpacing: '0.5px' }}>
                {block[lang === 'de' ? 'text_de' : 'text_en'] || block.text_en || 'Premium Badge'}
              </span>
            </div>
          );

          if (isEditorActive) {
            return (
              <div
                key={block.id || bIdx}
                className={`builder-block-item ${isBlockSelected ? 'builder-element-selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  editorCtx.setSelectedSectionId(section.id);
                  editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: 'badge' });
                }}
              >
                {renderBlockToolbar(block, colId, bIdx, totalBlocks)}
                {badgeContent}
              </div>
            );
          }
          return <div key={block.id || bIdx}>{badgeContent}</div>;
        }

        // 8. Quote Block
        if (bType === 'quote') {
          const quoteBox = (
            <div style={{ background: block.bg || '#f8fafc', borderLeft: '4px solid #ff0000', padding: '20px 24px', borderRadius: '8px', marginBottom: '16px' }}>
              <p style={{ fontStyle: 'italic', color: '#334155', fontSize: '1.05rem', marginBottom: '10px' }}>"{block.quote_en || 'Quote text goes here...'}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, color: '#1f242d', fontSize: '0.9rem' }}>{block.author || 'Author Name'}</span>
                {block.role && <span style={{ color: '#64748b', fontSize: '0.85rem' }}>— {block.role}</span>}
              </div>
            </div>
          );

          if (isEditorActive) {
            return (
              <div
                key={block.id || bIdx}
                className={`builder-block-item ${isBlockSelected ? 'builder-element-selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  editorCtx.setSelectedSectionId(section.id);
                  editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: 'quote' });
                }}
              >
                {renderBlockToolbar(block, colId, bIdx, totalBlocks)}
                {quoteBox}
              </div>
            );
          }
          return <div key={block.id || bIdx}>{quoteBox}</div>;
        }

        // 9. Feature Box Block
        if (bType === 'feature') {
          const FeatureIcon = ICON_LOOKUP[block.icon] || ShieldCheck;
          const isIconSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.blockId === block.id && editorCtx.selectedElement?.type === 'feature_icon';
          const isHeadSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.blockId === block.id && editorCtx.selectedElement?.type === 'feature_heading';
          const isDescSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.blockId === block.id && editorCtx.selectedElement?.type === 'feature_desc';
          const isBtnSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.blockId === block.id && editorCtx.selectedElement?.type === 'feature_button';

          const featureBox = (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                marginBottom: '18px',
                background: block.bg_color || block.bg || '#ffffff',
                padding: block.padding || '24px',
                borderRadius: block.border_radius || '14px',
                border: `1px solid ${block.border_color || '#ede4ed'}`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                position: 'relative'
              }}
            >
              {/* Feature Icon */}
              <div
                className={`feature-icon-box ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isIconSelected ? 'element-selected-active' : ''}`}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: block.icon_bg || 'rgba(255,0,0,0.1)',
                  color: block.icon_color || '#ff0000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative'
                }}
                onClick={(e) => {
                  if (isEditorActive && !editorCtx.isPreviewMode) {
                    e.stopPropagation();
                    editorCtx.setSelectedSectionId(section.id);
                    editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: 'feature_icon' });
                  }
                }}
              >
                {isEditorActive && !editorCtx.isPreviewMode && <span className="element-badge-tag">ICON</span>}
                <FeatureIcon size={24} />
              </div>

              {/* Feature Heading */}
              <div
                className={`feature-heading-box ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isHeadSelected ? 'element-selected-active' : ''}`}
                style={{ position: 'relative' }}
                onClick={(e) => {
                  if (isEditorActive && !editorCtx.isPreviewMode) {
                    e.stopPropagation();
                    editorCtx.setSelectedSectionId(section.id);
                    editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: 'feature_heading' });
                  }
                }}
              >
                {isEditorActive && !editorCtx.isPreviewMode && <span className="element-badge-tag">HEADING</span>}
                <h4 style={{ fontWeight: 700, color: block.heading_color || '#1f242d', fontSize: '1.2rem', margin: 0 }}>
                  {isEditorActive && !editorCtx.isPreviewMode ? (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      className="builder-inline-editable"
                      onBlur={(e) => {
                        const val = e.currentTarget.innerText;
                        editorCtx.updateBlock(section.id, colId, block.id, lang === 'de' ? 'title_de' : 'title_en', val);
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                    >
                      {lang === 'de' ? (block.title_de || block.title_en) : (block.title_en || block.title_de || 'Feature Heading')}
                    </span>
                  ) : (
                    lang === 'de' ? (block.title_de || block.title_en) : (block.title_en || block.title_de || 'Feature Heading')
                  )}
                </h4>
              </div>

              {/* Feature Description */}
              <div
                className={`feature-desc-box ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isDescSelected ? 'element-selected-active' : ''}`}
                style={{ position: 'relative' }}
                onClick={(e) => {
                  if (isEditorActive && !editorCtx.isPreviewMode) {
                    e.stopPropagation();
                    editorCtx.setSelectedSectionId(section.id);
                    editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: 'feature_desc' });
                  }
                }}
              >
                {isEditorActive && !editorCtx.isPreviewMode && <span className="element-badge-tag">DESC</span>}
                <p style={{ color: block.desc_color || '#64748b', fontSize: '0.94rem', margin: 0, lineHeight: 1.55 }}>
                  {isEditorActive && !editorCtx.isPreviewMode ? (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      className="builder-inline-editable"
                      onBlur={(e) => {
                        const val = e.currentTarget.innerText;
                        editorCtx.updateBlock(section.id, colId, block.id, lang === 'de' ? 'desc_de' : 'desc_en', val);
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                    >
                      {lang === 'de' ? (block.desc_de || block.desc_en) : (block.desc_en || block.desc_de || 'Feature description details.')}
                    </span>
                  ) : (
                    lang === 'de' ? (block.desc_de || block.desc_en) : (block.desc_en || block.desc_de || 'Feature description details.')
                  )}
                </p>
              </div>

              {/* Feature Button */}
              {(block.button_text_en || block.button_text) && (
                <div
                  className={`feature-btn-box ${isEditorActive && !editorCtx.isPreviewMode ? 'element-selectable' : ''} ${isBtnSelected ? 'element-selected-active' : ''}`}
                  style={{ position: 'relative', marginTop: '6px' }}
                  onClick={(e) => {
                    if (isEditorActive && !editorCtx.isPreviewMode) {
                      e.preventDefault();
                      e.stopPropagation();
                      editorCtx.setSelectedSectionId(section.id);
                      editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: 'feature_button' });
                    }
                  }}
                >
                  {isEditorActive && !editorCtx.isPreviewMode && <span className="element-badge-tag">BUTTON</span>}
                  <NavLink
                    to={isEditorActive && !editorCtx.isPreviewMode ? '#' : (block.button_link || '/en/Contact/')}
                    className="btn-red-pill"
                    style={{ padding: '8px 22px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                    onClick={isEditorActive && !editorCtx.isPreviewMode ? e => e.preventDefault() : undefined}
                  >
                    <span>{lang === 'de' ? (block.button_text_de || block.button_text_en || block.button_text) : (block.button_text_en || block.button_text)}</span>
                    <ArrowRight size={13} />
                  </NavLink>
                </div>
              )}
            </div>
          );

          if (isEditorActive) {
            return (
              <div
                key={block.id || bIdx}
                className={`builder-block-item ${isBlockSelected ? 'builder-element-selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  editorCtx.setSelectedSectionId(section.id);
                  editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: 'feature' });
                }}
              >
                {renderBlockToolbar(block, colId, bIdx, totalBlocks)}
                {featureBox}
              </div>
            );
          }
          return <div key={block.id || bIdx}>{featureBox}</div>;
        }

        // 10. Video & Dedicated YouTube Block
        if (bType === 'video' || bType === 'youtube') {
          if (block.video_enabled === false && !isEditorActive) return null;
          const vUrl = block.video_url || block.url || 'https://www.youtube.com/embed/dD_FThvzO9I?controls=1';
          const isTestingThisVideo = !!testingVideoMap[block.id];

          const videoBox = (
            <div style={{ marginBottom: '16px' }}>
              <div
                className={`responsive-video-container ${isEditorActive && !editorCtx.isPreviewMode ? 'video-edit-container element-selectable' : ''} ${isBlockSelected ? 'element-selected-active' : ''}`}
                style={{
                  borderRadius: block.border_radius || '12px',
                  boxShadow: block.shadow || '0 8px 24px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                onClick={(e) => {
                  if (isEditorActive && !editorCtx.isPreviewMode && !isTestingThisVideo) {
                    e.stopPropagation();
                    editorCtx.setSelectedSectionId(section.id);
                    editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: bType });
                  }
                }}
              >
                {isEditorActive && !editorCtx.isPreviewMode && (
                  <div className="video-builder-overlay">
                    <span className="element-badge-tag">{bType === 'youtube' ? 'YOUTUBE VIDEO' : 'VIDEO'}</span>
                    <div className="video-overlay-actions">
                      <button
                        type="button"
                        className="btn-video-tool"
                        onClick={(e) => {
                          e.stopPropagation();
                          editorCtx.setSelectedSectionId(section.id);
                          editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: bType });
                        }}
                      >
                        <Settings size={13} />
                        <span>Video Settings</span>
                      </button>
                      <button
                        type="button"
                        className="btn-video-tool btn-video-play"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTestingVideoMap(prev => ({ ...prev, [block.id]: !prev[block.id] }));
                        }}
                      >
                        <Play size={13} />
                        <span>{isTestingThisVideo ? 'Stop Playing' : 'Test / Play Video'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <iframe
                  src={vUrl}
                  title="Video Block"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    border: 'none',
                    pointerEvents: (isEditorActive && !editorCtx.isPreviewMode && !isTestingThisVideo) ? 'none' : 'auto'
                  }}
                />
              </div>
            </div>
          );

          if (isEditorActive) {
            return (
              <div
                key={block.id || bIdx}
                className={`builder-block-item ${isBlockSelected ? 'builder-element-selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  editorCtx.setSelectedSectionId(section.id);
                  editorCtx.setSelectedElement({ sectionId: section.id, colId, blockId: block.id, block, type: bType });
                }}
              >
                {renderBlockToolbar(block, colId, bIdx, totalBlocks)}
                {videoBox}
              </div>
            );
          }
          return <div key={block.id || bIdx}>{videoBox}</div>;
        }

        // 13. Embedded existing component inside column
        if (bType === 'component') {
          const compType = block.component_type || 'services';
          const dummySec = { id: `embed_${compType}`, type: compType, enabled: true };
          return (
            <div key={block.id || bIdx} style={{ marginBottom: '20px' }}>
              <DynamicSectionRenderer section={dummySec} pageKey={pageKey} isBuilderMode={isEditorActive} />
            </div>
          );
        }

        return null;
      };

      const containerMaxWidth = section.container_width === 'narrow' ? '900px' : section.container_width === 'full' ? '100%' : '1240px';

      return (
        <section
          className={`custom-row-section ${isBuilderMode ? 'builder-section-preview' : ''}`}
          style={{ ...customStyle, position: 'relative' }}
        >
          <div className="container" style={{ maxWidth: containerMaxWidth }}>
            {section.title_en && (
              <div style={{ textAlign: section.text_align || 'center', marginBottom: '35px' }}>
                <h2 className="section-main-title" style={{ color: section.heading_color || undefined }}>
                  {renderInlineText(lang === 'de' ? 'title_de' : 'title_en', lang === 'de' ? (section.title_de || section.title_en) : section.title_en, 'Row Section Title', 'span')}
                </h2>
                {section.subtitle_en && (
                  <p style={{ color: '#666', fontSize: '1.05rem', marginTop: '8px' }}>
                    {renderInlineText(lang === 'de' ? 'subtitle_de' : 'subtitle_en', lang === 'de' ? (section.subtitle_de || section.subtitle_en) : section.subtitle_en, '', 'span')}
                  </p>
                )}
              </div>
            )}

            <div
              className="row-columns-container"
              style={{
                display: 'flex',
                flexWrap: curViewport === 'mobile' ? 'wrap' : 'nowrap',
                gap: `${section.gap || 30}px`,
                alignItems: section.vertical_align || 'stretch',
                position: 'relative'
              }}
            >
              {rawCols.map((col, idx) => {
                const width = curViewport === 'mobile' ? '100%' : getColWidthPercent(col, idx, rawCols.length);
                const isColSelected = isEditorActive && !editorCtx.isPreviewMode && editorCtx.selectedElement?.colId === col.id;
                const blocksList = col.blocks || [];

                return (
                  <React.Fragment key={col.id || idx}>
                    <div
                      className={`layout-column-item ${isEditorActive ? 'builder-column-outline' : ''} ${isColSelected ? 'builder-column-selected' : ''}`}
                      style={{
                        flex: curViewport === 'mobile' ? '1 1 100%' : `0 0 ${width}`,
                        maxWidth: curViewport === 'mobile' ? '100%' : width,
                        background: col.bg_color || undefined,
                        padding: col.padding ? `${col.padding}px` : undefined,
                        borderRadius: col.border_radius ? `${col.border_radius}px` : undefined,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onDragOver={(e) => {
                        if (isEditorActive) {
                          e.preventDefault();
                          e.currentTarget.classList.add('builder-col-dragover');
                        }
                      }}
                      onDragLeave={(e) => {
                        if (isEditorActive) {
                          e.currentTarget.classList.remove('builder-col-dragover');
                        }
                      }}
                      onDrop={(e) => {
                        if (isEditorActive) {
                          e.preventDefault();
                          e.currentTarget.classList.remove('builder-col-dragover');
                          try {
                            const raw = e.dataTransfer.getData('application/json');
                            if (raw) {
                              const data = JSON.parse(raw);
                              if (data.kind === 'move_block') {
                                editorCtx.moveBlockTo(data.sourceSectionId, data.sourceColId, data.blockId, section.id, col.id, blocksList.length);
                              } else if (data.kind === 'block') {
                                editorCtx.insertBlockAt(section.id, col.id, data.type, data.defaultProps || {}, blocksList.length);
                              }
                            }
                          } catch (err) {
                            console.error('Drop error:', err);
                          }
                        }
                      }}
                      onClick={isEditorActive ? (e) => {
                        e.stopPropagation();
                        editorCtx.setSelectedSectionId(section.id);
                        editorCtx.setSelectedElement({ sectionId: section.id, colId: col.id, col, type: 'column' });
                      } : undefined}
                    >
                      {/* Column Top Drop Zone */}
                      {isEditorActive && blocksList.length > 0 && (
                        <BlockDropZone sectionId={section.id} colId={col.id} targetIndex={0} label="Drop at Top" />
                      )}

                      {/* Blocks in Column */}
                      {blocksList.map((block, bIdx) => (
                        <React.Fragment key={block.id || bIdx}>
                          {renderBlock(block, col.id, bIdx, blocksList.length)}
                          {isEditorActive && (
                            <BlockDropZone sectionId={section.id} colId={col.id} targetIndex={bIdx + 1} label="Drop Here" />
                          )}
                        </React.Fragment>
                      ))}

                      {/* Empty Column State */}
                      {isEditorActive && blocksList.length === 0 && (
                        <div className="builder-empty-column-state">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                            <Plus size={16} />
                            <span>Empty Column</span>
                          </div>
                          <span className="empty-col-hint" style={{ marginBottom: '10px' }}>Select an element to add:</span>
                          <QuickAddGrid onSelectElement={(type) => editorCtx.addBlockToColumn(section.id, col.id, type)} />
                        </div>
                      )}

                      {/* Contextual "+ Add Element" button inside column */}
                      {isEditorActive && blocksList.length > 0 && (
                        <div className="builder-col-add-container">
                          <button
                            type="button"
                            className="builder-col-add-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenFaqId(openFaqId === `quick_${col.id}` ? null : `quick_${col.id}`);
                            }}
                            title="Add Element to this column"
                          >
                            <Plus size={13} />
                            <span>Add Element</span>
                          </button>

                          {openFaqId === `quick_${col.id}` && (
                            <div className="quick-element-picker-dropdown" onClick={(e) => e.stopPropagation()}>
                              <div className="popover-header">
                                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#f8fafc' }}>Add Element</span>
                                <button type="button" onClick={() => setOpenFaqId(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}>×</button>
                              </div>
                              <QuickAddGrid 
                                onSelectElement={(type) => { 
                                  editorCtx.addBlockToColumn(section.id, col.id, type); 
                                  setOpenFaqId(null); 
                                }} 
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Resizable Divider Handle between adjacent columns */}
                    {isEditorActive && curViewport !== 'mobile' && idx < rawCols.length - 1 && (
                      <div
                        className="builder-col-resizer-handle"
                        title="Drag to resize column widths"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const startX = e.clientX;
                          const rowEl = e.currentTarget.parentElement;
                          if (!rowEl) return;
                          const totalW = rowEl.offsetWidth;
                          const leftCol = rawCols[idx];
                          const rightCol = rawCols[idx + 1];
                          const leftCurrent = parseFloat(leftCol.width || (100 / rawCols.length));
                          const rightCurrent = parseFloat(rightCol.width || (100 / rawCols.length));
                          const combined = leftCurrent + rightCurrent;

                          const onMove = (moveEvt) => {
                            const diffX = moveEvt.clientX - startX;
                            const diffPercent = (diffX / totalW) * 100;
                            const newLeft = Math.max(12, Math.min(combined - 12, leftCurrent + diffPercent));
                            const newRight = combined - newLeft;

                            const updatedWidths = rawCols.map((c, i) => {
                              if (i === idx) return `${Math.round(newLeft)}%`;
                              if (i === idx + 1) return `${Math.round(newRight)}%`;
                              return c.width || `${Math.floor(100 / rawCols.length)}%`;
                            });
                            editorCtx.updateColumnWidths(section.id, updatedWidths);
                          };

                          const onUp = () => {
                            window.removeEventListener('mousemove', onMove);
                            window.removeEventListener('mouseup', onUp);
                          };

                          window.addEventListener('mousemove', onMove);
                          window.addEventListener('mouseup', onUp);
                        }}
                      >
                        <div className="resizer-knob">↔</div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    return null;
  };
  const rawSectionNode = renderSectionInner();
  if (!rawSectionNode) return null;

  if (!isEditorActive || editorCtx.isPreviewMode) {
    return rawSectionNode;
  }

  const currentSections = cmsConfig?.sections?.[pageKey] || [];
  const secIdx = currentSections.findIndex(s => s.id === section.id);
  const isFirst = secIdx === 0;
  const isLast = secIdx === currentSections.length - 1;
  const targetIdx = secIdx !== -1 ? secIdx : 0;

  return (
    <div className="builder-section-container-block" key={section.id}>
      {/* Top Section Drop Zone (before first section) */}
      {isFirst && (
        <SectionDropZone
          pageKey={pageKey}
          targetIndex={0}
          label="Drop Section Above"
        />
      )}

      {/* Interactive Section Wrapper */}
      <div
        className={`builder-section-wrapper ${isSectionSelected ? 'builder-section-selected' : ''}`}
        id={`builder_sec_${section.id}`}
        draggable={isEditorActive && !editorCtx.isPreviewMode}
        onDragStart={(e) => {
          e.dataTransfer.setData('application/json', JSON.stringify({
            kind: 'move_section',
            sourceSectionId: section.id,
            sourceIndex: targetIdx
          }));
          e.dataTransfer.effectAllowed = 'move';
        }}
        onClick={(e) => {
          e.stopPropagation();
          editorCtx.setSelectedSectionId(section.id);
          editorCtx.setSelectedElement({ sectionId: section.id, type: section.type || 'section', section });
        }}
      >
        {/* Floating Section Toolbar on Top Left */}
        <div className="builder-section-floating-toolbar" onClick={(e) => e.stopPropagation()}>
          <div className="section-drag-handle-badge" title="Drag section to reorder on page">
            <GripVertical size={13} />
            <span className="section-type-title">SECTION: {section.name || section.type?.toUpperCase() || section.id}</span>
          </div>

          <div className="section-toolbar-actions">
            <button
              type="button"
              className={`editor-icon-btn btn-move ${isFirst ? 'disabled' : ''}`}
              onClick={() => !isFirst && editorCtx.moveSection(section.id, 'up')}
              title="Move Section Up"
              disabled={isFirst}
            >
              <MoveUp size={13} />
            </button>

            <button
              type="button"
              className={`editor-icon-btn btn-move ${isLast ? 'disabled' : ''}`}
              onClick={() => !isLast && editorCtx.moveSection(section.id, 'down')}
              title="Move Section Down"
              disabled={isLast}
            >
              <MoveDown size={13} />
            </button>

            <button
              type="button"
              className="editor-icon-btn btn-dup"
              onClick={() => editorCtx.duplicateSection(section.id)}
              title="Duplicate Section"
            >
              <Copy size={13} />
            </button>

            <button
              type="button"
              className="editor-icon-btn btn-vis"
              onClick={() => editorCtx.toggleSectionVisibility(section.id)}
              title={section.enabled === false ? "Show Section" : "Hide Section"}
            >
              {section.enabled === false ? <EyeOff size={13} color="#f87171" /> : <Eye size={13} />}
            </button>

            <button
              type="button"
              className="editor-icon-btn btn-settings"
              onClick={() => {
                editorCtx.setSelectedSectionId(section.id);
                editorCtx.setSelectedElement({ sectionId: section.id, type: section.type || 'section', section });
              }}
              title="Section Settings"
            >
              <Settings size={13} />
            </button>

            <button
              type="button"
              className="editor-icon-btn btn-del"
              onClick={() => editorCtx.deleteSection(section.id)}
              title="Delete Section"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {rawSectionNode}
      </div>

      {/* Bottom Section Drop Zone (between sections or at the end) */}
      <SectionDropZone
        pageKey={pageKey}
        targetIndex={targetIdx + 1}
        label={isLast ? "Drop Section at Bottom" : "Drop Section Here"}
        isLast={isLast}
      />
    </div>
  );
};

export default DynamicSectionRenderer;
