import React, { useState } from 'react';

/**
 * SportImage Component
 * Premium sports image wrapper with custom motion styles per sport:
 * - football: horizontal parallax + subtle zoom
 * - basketball: vertical movement + small scale
 * - tennis: diagonal movement
 * - athletics: horizontal motion
 * - swimming: vertical parallax
 * - cycling: horizontal travel
 * - volleyball: upward reveal
 * - hockey: fast subtle horizontal reveal
 * - stadium: slow cinematic zoom
 * - team: depth/parallax
 * - events / travel: depth / travel movement
 */
export default function SportImage({
  src,
  alt = "Sports Photography",
  title = "",
  category = "sports",
  animation = "depth-parallax",
  photographer = "",
  license = "CC BY",
  className = "",
  aspectRatio = "16/10",
  priority = false,
  showBadge = true,
  onClick = null
}) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Determine motion class based on animation type or sport category
  const getMotionClass = () => {
    switch (animation) {
      case 'horizontal-parallax':
        return 'hover:scale-105 hover:-translate-x-1 transition-all duration-700 ease-out';
      case 'subtle-zoom':
        return 'hover:scale-110 transition-transform duration-1000 ease-out';
      case 'vertical-parallax':
        return 'hover:scale-105 hover:-translate-y-2 transition-all duration-700 ease-out';
      case 'diagonal-reveal':
        return 'hover:scale-105 hover:translate-x-1 hover:-translate-y-1 transition-all duration-700 ease-out';
      case 'horizontal-motion':
        return 'hover:scale-105 hover:translate-x-2 transition-all duration-700 ease-out';
      case 'horizontal-travel':
        return 'hover:scale-105 hover:translate-x-3 transition-all duration-1000 ease-out';
      case 'upward-reveal':
        return 'hover:scale-105 hover:-translate-y-3 transition-all duration-700 ease-out';
      case 'horizontal-reveal':
        return 'hover:scale-105 hover:translate-x-2 transition-all duration-500 ease-out';
      case 'small-scale':
        return 'hover:scale-105 transition-transform duration-500 ease-out';
      case 'depth-parallax':
      default:
        return 'hover:scale-108 hover:-translate-y-1 transition-all duration-700 ease-out';
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat.toLowerCase()) {
      case 'football': return 'bg-emerald-500/80 text-emerald-100 border-emerald-400/30';
      case 'basketball': return 'bg-amber-500/80 text-amber-100 border-amber-400/30';
      case 'tennis': return 'bg-lime-500/80 text-lime-100 border-lime-400/30';
      case 'athletics': return 'bg-orange-500/80 text-orange-100 border-orange-400/30';
      case 'cycling': return 'bg-cyan-500/80 text-cyan-100 border-cyan-400/30';
      case 'swimming': return 'bg-blue-500/80 text-blue-100 border-blue-400/30';
      case 'volleyball': return 'bg-yellow-500/80 text-yellow-100 border-yellow-400/30';
      case 'hockey': return 'bg-rose-500/80 text-rose-100 border-rose-400/30';
      case 'team': return 'bg-indigo-500/80 text-indigo-100 border-indigo-400/30';
      case 'stadium': return 'bg-purple-500/80 text-purple-100 border-purple-400/30';
      case 'events': return 'bg-violet-500/80 text-violet-100 border-violet-400/30';
      case 'travel': return 'bg-teal-500/80 text-teal-100 border-teal-400/30';
      default: return 'bg-primary-500/80 text-white border-white/20';
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl transition-all duration-500 hover:border-white/30 hover:shadow-cyan-500/10 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ aspectRatio }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* 3D Light Sheen */}
      <div 
        className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
        style={{ transform: hovered ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 1s ease-out, opacity 0.5s' }}
      />

      {/* Main Image with Sport-Specific Motion */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover object-center ${getMotionClass()} ${loaded ? 'opacity-100 filter-none' : 'opacity-0 blur-sm'} transition-opacity duration-700`}
      />

      {/* Cinematic Vignette & Depth Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity duration-500" />

      {/* Content Badges & Information Overlay */}
      {showBadge && (
        <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between pointer-events-none">
          <div className="flex items-center justify-between gap-2">
            <span className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full backdrop-blur-md border ${getCategoryColor(category)} shadow-lg`}>
              {category}
            </span>
            {photographer && (
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] text-neutral-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                📷 {photographer.slice(0, 24)}
              </span>
            )}
          </div>

          {title && (
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h4 className="text-white font-semibold text-sm sm:text-base leading-snug drop-shadow-md">
                {title}
              </h4>
              {alt && (
                <p className="text-xs text-neutral-300 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {alt}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
