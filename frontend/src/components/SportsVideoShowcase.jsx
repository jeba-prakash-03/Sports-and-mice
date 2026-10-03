import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/sports-video-showcase.css';

export default function SportsVideoShowcase({
  section = {},
  isEditorActive = false,
  editorCtx = null,
  renderInlineText = null
}) {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef(null);

  // Parallax Scroll Hooks for Video Card movement over static background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Video Card scrolls/moves smoothly up over the static background
  const cardY = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -60]);
  const cardScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.03, 0.96]);

  // Dynamic Content Props
  const tagText = lang === 'de' 
    ? (section.tag_de || section.tag1_de || 'Video') 
    : (section.tag_en || section.tag1_en || 'Video');

  const title = lang === 'de' 
    ? (section.title_de || section.title_en || '360° Sports Experience Showcase') 
    : (section.title_en || section.title_de || '360° Sports Experience Showcase');

  const subtitle = lang === 'de'
    ? (section.subtitle_de || section.p1_de || 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam')
    : (section.subtitle_en || section.p1_en || 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam');

  const videoUrl = section.video_url || 'https://www.youtube.com/embed/dD_FThvzO9I?start=76&autoplay=1';
  const embedUrl = videoUrl.includes('autoplay') ? videoUrl : `${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`;
  const bgImage = section.bg_image || '/assets/images/3d_sports_balls_panorama.jpg';
  const cardThumb = section.video_thumb || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80';

  return (
    <section className="sports-video-section" ref={containerRef}>
      {/* Header with decorative accent line */}
      <div className="sports-video-header">
        <div className="title-badge-wrapper">
          <span className="header-line"></span>
          <span className="section-tag">
            {renderInlineText ? renderInlineText('tag_en', tagText, 'Video', 'span') : tagText}
          </span>
          <span className="header-line"></span>
        </div>
        <p className="section-subtitle">
          {renderInlineText ? renderInlineText('subtitle_en', subtitle, subtitle, 'span') : subtitle}
        </p>
      </div>

      {/* Container with STATIC 3D Sports Panorama Background */}
      <div className="sports-video-showcase-container">
        <div 
          className="sports-video-panorama-bg static-bg"
          style={{ backgroundImage: `url("${bgImage}")` }}
        />

        {/* Center Floating Video Card Moving Over Static Background on Scroll */}
        <motion.div 
          className="sports-video-center-card"
          style={{ y: cardY, scale: cardScale }}
          onClick={() => setIsPlaying(true)}
        >
          {isPlaying ? (
            <div className="sports-video-iframe-wrapper">
              <iframe
                src={embedUrl}
                title="Sports Highlight Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <>
              <img 
                src={cardThumb} 
                alt="Sports Action Video Thumbnail" 
                className="sports-video-thumbnail" 
              />
              <div className="sports-video-play-overlay">
                <button type="button" className="sports-video-play-btn" aria-label="Play Sports Video">
                  <Play className="sports-video-play-icon" size={32} fill="currentColor" />
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
