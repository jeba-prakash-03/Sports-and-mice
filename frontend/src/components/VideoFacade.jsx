import React, { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { parseYouTubeUrl } from '../context/EditorContext';

export const VideoFacade = ({
  videoUrl,
  title = "Sports & MICE Video",
  posterImage,
  className = "",
  style = {},
  allowDirectPlay = true,
  badgeText = "🏆 Sports & MICE Expertise"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { isYouTube, videoId, embedUrl } = parseYouTubeUrl(videoUrl);

  // Compute fallback thumbnail from YouTube video ID if available
  const defaultThumbnail = isYouTube && videoId 
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : (posterImage || '/assets/images/service_hero_bg.jpg');

  const [currentThumb, setCurrentThumb] = useState(posterImage || defaultThumbnail);

  const handlePlay = (e) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  if (isPlaying) {
    const finalSrc = isYouTube 
      ? `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0`
      : embedUrl;

    return (
      <div
        className={`video-facade-container is-active ${className}`}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#000000',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.55)',
          ...style
        }}
      >
        <iframe
          src={finalSrc}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            border: 'none',
            borderRadius: '24px'
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`video-facade-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        borderRadius: '24px',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#0a0d14',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.12)',
        ...style
      }}
      onClick={handlePlay}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePlay(e); } }}
      role="button"
      tabIndex={0}
      aria-label={`Play ${title}`}
    >
      {/* Video Poster Image with lazy loading and fallback */}
      <img
        src={currentThumb}
        alt={title}
        loading="lazy"
        decoding="async"
        onError={() => setCurrentThumb('/assets/images/service_hero_bg.jpg')}
        className="video-facade-poster"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease',
          filter: 'brightness(0.92)'
        }}
      />

      {/* Cinematic Dark Gradient & Glow Overlay */}
      <div
        className="video-facade-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.15) 0%, rgba(10,15,30,0.72) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.35s ease',
          gap: '12px'
        }}
      >
        {/* Pulsing Play Button with animated halo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            className="video-pulse-halo"
            style={{
              position: 'absolute',
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'rgba(255, 0, 0, 0.28)',
              animation: 'pulseRing 2.2s cubic-bezier(0.25, 0.1, 0.25, 1) infinite'
            }}
          />
          <div
            className="video-facade-play-btn"
            style={{
              position: 'relative',
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
              boxShadow: '0 0 28px rgba(255, 0, 0, 0.7), 0 8px 24px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              border: '2px solid rgba(255, 255, 255, 0.45)',
              transition: 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease'
            }}
          >
            <Play size={28} style={{ transform: 'translateX(2px)', fill: 'currentColor' }} />
          </div>
        </div>

        {/* Watch Video Floating Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            color: '#ffffff',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '6px 16px',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff3333', boxShadow: '0 0 8px #ff3333' }} />
          <span>Watch Video</span>
        </div>
      </div>

      {/* Floating corner info badge */}
      {badgeText && (
        <div
          className="video-facade-corner-badge"
          style={{
            position: 'absolute',
            bottom: '14px',
            right: '14px',
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '6px 12px',
            color: '#ffffff',
            fontSize: '11.5px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
            pointerEvents: 'none'
          }}
        >
          <Sparkles size={13} color="#ffb703" />
          <span>{badgeText}</span>
        </div>
      )}
    </div>
  );
};

export default VideoFacade;
