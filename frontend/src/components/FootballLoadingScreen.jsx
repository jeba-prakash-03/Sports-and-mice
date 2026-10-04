import React, { useState, useEffect, useRef } from 'react';
import { useLoading } from '../context/LoadingContext';
import '../styles/FootballLoadingScreen.css';

/**
 * FootballLoadingScreen — Global Reusable Hero Football Loading Screen
 * Sports & MICE Brand Identity
 * 
 * Features:
 * - 100% Focused on the Hero Football Animation
 * - Reusable across all genuine loading states (initial boot, page loads, config refresh)
 * - Zero "first-visit only" restrictions (sessionStorage/localStorage limits removed)
 * - Auto-dismisses immediately when content is ready (with a subtle 180ms anti-flicker threshold)
 * - Built-in 3000ms safety timeout to prevent hanging indefinitely
 * - Smooth 500ms GPU fade and lift exit transition (opacity: 0, scale: 1.03)
 * - Unmounts completely from DOM when inactive
 */
export default function FootballLoadingScreen({ 
  isLoading: propLoading, 
  minDisplayTime = 180, 
  maxTimeout = 3000, 
  onFinished 
}) {
  const { isLoading: contextLoading } = useLoading();
  const isCurrentlyLoading = propLoading !== undefined ? propLoading : contextLoading;

  const [shouldRender, setShouldRender] = useState(isCurrentlyLoading);
  const [isExiting, setIsExiting] = useState(false);
  const loadStartTimeRef = useRef(Date.now());
  const exitTimeoutRef = useRef(null);
  const safetyTimeoutRef = useRef(null);
  const dismissDelayRef = useRef(null);

  useEffect(() => {
    // Clear any pending timers
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    if (dismissDelayRef.current) clearTimeout(dismissDelayRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    if (isCurrentlyLoading) {
      // Loading is actively running
      setShouldRender(true);
      setIsExiting(false);
      loadStartTimeRef.current = Date.now();

      // Absolute safety timeout: never remain stuck for > maxTimeout (3000ms)
      safetyTimeoutRef.current = setTimeout(() => {
        setIsExiting(true);
        exitTimeoutRef.current = setTimeout(() => {
          setShouldRender(false);
          if (onFinished) onFinished();
        }, 500);
      }, maxTimeout);

    } else {
      // Loading finished: check minimum anti-flicker threshold
      const elapsed = Date.now() - loadStartTimeRef.current;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);

      const triggerSmoothExit = () => {
        setIsExiting(true);
        exitTimeoutRef.current = setTimeout(() => {
          setShouldRender(false);
          if (onFinished) onFinished();
        }, 500);
      };

      if (remainingTime > 0) {
        dismissDelayRef.current = setTimeout(triggerSmoothExit, remainingTime);
      } else {
        triggerSmoothExit();
      }
    }

    return () => {
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
      if (dismissDelayRef.current) clearTimeout(dismissDelayRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, [isCurrentlyLoading, minDisplayTime, maxTimeout, onFinished]);

  if (!shouldRender) return null;

  return (
    <aside 
      className={`football-loading-overlay ${isExiting ? 'is-exiting' : ''}`}
      role="status"
      aria-label="Loading Sports & MICE"
      aria-live="polite"
    >
      {/* Subtle Ambient Radial Lighting Glow */}
      <div className="football-ambient-glow" aria-hidden="true" />

      {/* Floating Energy Particles */}
      <div className="football-particles-field" aria-hidden="true">
        <span className="football-particle p-1" />
        <span className="football-particle p-2" />
        <span className="football-particle p-3" />
        <span className="football-particle p-4" />
        <span className="football-particle p-5" />
        <span className="football-particle p-6" />
        <span className="football-particle p-7" />
        <span className="football-particle p-8" />
      </div>

      {/* Main Centered Loading Composition */}
      <div className="football-loader-composition">
        {/* Large Hero Football Stage */}
        <div className="football-hero-stage">
          <svg
            className="football-hero-svg"
            viewBox="0 0 500 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Pitch Radial Glow Base */}
              <radialGradient id="ballPitchGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#B65345" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#641F35" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#3F2335" stopOpacity="0" />
              </radialGradient>

              {/* Dynamic Ground Contact Shadow */}
              <radialGradient id="ballGroundShadowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(20, 9, 16, 0.75)" />
                <stop offset="65%" stopColor="rgba(35, 18, 29, 0.25)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Football Sphere Shading Gradient (Rich 3D Curvature) */}
              <radialGradient id="ballSphere3D" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#F8F3EC" />
                <stop offset="65%" stopColor="#E5DACD" />
                <stop offset="85%" stopColor="#B6A390" />
                <stop offset="100%" stopColor="#6B5949" />
              </radialGradient>

              {/* Pentagon Leather Texture / Shading */}
              <linearGradient id="pentagonShade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A263C" />
                <stop offset="60%" stopColor="#351B2B" />
                <stop offset="100%" stopColor="#220F1B" />
              </linearGradient>

              {/* Aerodynamic Speed Trail Gradient */}
              <linearGradient id="speedTrailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B65345" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#B9825A" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#B65345" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Pitch Ground Glow Base */}
            <ellipse cx="250" cy="365" rx="180" ry="22" fill="url(#ballPitchGlow)" />

            {/* Ground Impact Shockwave Pulse (Expands on Bounce Impact) */}
            <ellipse 
              className="anim-impact-ring"
              cx="250" 
              cy="365" 
              rx="90" 
              ry="16" 
              stroke="#B65345" 
              strokeWidth="2.5" 
              fill="none" 
            />

            {/* Dynamic Ground Shadow (Scales Synchronously with Ball Vertical Bounce) */}
            <g className="anim-ground-shadow">
              <ellipse cx="250" cy="365" rx="80" ry="18" fill="url(#ballGroundShadowGrad)" />
            </g>

            {/* ========================================================
                MAIN HERO FOOTBALL (Bounce & 3D Spin Articulation)
                ======================================================== */}
            <g id="hero-ball-bounce-group" className="anim-ball-bounce">
              
              {/* Dynamic Aerodynamic Energy Speed Trails */}
              <g className="anim-energy-trail">
                <path 
                  d="M165 140 C140 180 145 240 175 270" 
                  stroke="url(#speedTrailGrad)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  fill="none" 
                />
                <path 
                  d="M335 140 C360 180 355 240 325 270" 
                  stroke="url(#speedTrailGrad)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  fill="none" 
                />
              </g>

              {/* Spinning Ball Core (Radius: 75px, Diameter: 150px) */}
              <g id="hero-ball-spin-group" className="anim-ball-rotation">
                {/* 3D Sphere Surface */}
                <circle cx="250" cy="200" r="75" fill="url(#ballSphere3D)" stroke="#351B2B" strokeWidth="2.5" />

                {/* Central Pentagon Panel */}
                <polygon
                  points="250,162 284,186 271,225 229,225 216,186"
                  fill="url(#pentagonShade)"
                  stroke="#220F1B"
                  strokeWidth="2"
                />

                {/* Seam Lines Radiating to Surrounding Hexagon Facets */}
                <line x1="250" y1="162" x2="250" y2="132" stroke="#220F1B" strokeWidth="3" strokeLinecap="round" />
                <line x1="284" y1="186" x2="314" y2="174" stroke="#220F1B" strokeWidth="3" strokeLinecap="round" />
                <line x1="271" y1="225" x2="295" y2="250" stroke="#220F1B" strokeWidth="3" strokeLinecap="round" />
                <line x1="229" y1="225" x2="205" y2="250" stroke="#220F1B" strokeWidth="3" strokeLinecap="round" />
                <line x1="216" y1="186" x2="186" y2="174" stroke="#220F1B" strokeWidth="3" strokeLinecap="round" />

                {/* Outer Peripheral Pentagons / Facets */}
                {/* Top facet */}
                <polygon points="250,132 234,129 240,126 260,126 266,129" fill="url(#pentagonShade)" />
                {/* Top-Right facet */}
                <polygon points="314,174 322,186 324,166 314,158" fill="url(#pentagonShade)" />
                {/* Bottom-Right facet */}
                <polygon points="295,250 312,242 316,258 298,266" fill="url(#pentagonShade)" />
                {/* Bottom-Left facet */}
                <polygon points="205,250 202,266 184,258 188,242" fill="url(#pentagonShade)" />
                {/* Top-Left facet */}
                <polygon points="186,174 186,158 176,166 178,186" fill="url(#pentagonShade)" />

                {/* Burnt Coral & Copper Dynamic Kinetic Insets */}
                <path 
                  d="M236 176 L250 166 L264 176" 
                  stroke="#B65345" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  fill="none" 
                />
                <circle cx="250" cy="190" r="4.5" fill="#B9825A" />
                <circle cx="250" cy="190" r="2" fill="#F4EEE5" />

                {/* Secondary Seam Highlights (Subtle Ivory Accents) */}
                <path 
                  d="M232 223 L248 223 L268 223" 
                  stroke="rgba(244, 238, 229, 0.4)" 
                  strokeWidth="1.5" 
                />

                {/* Specular Glint Sunlight Highlight */}
                <ellipse cx="228" cy="172" rx="16" ry="9" fill="#FFFFFF" opacity="0.65" transform="rotate(-25 228 172)" />
                <circle cx="218" cy="165" r="4" fill="#FFFFFF" opacity="0.85" />
              </g>
            </g>
          </svg>
        </div>

        {/* Brand Identity Section (Below Football Animation) */}
        <div className="football-brand-block">
          <h1 className="football-brand-title">
            SPORTS &amp; MICE
          </h1>
          <span className="football-brand-subtitle">
            K-CONSULTING
          </span>

          {/* Minimalist Pulsing Sequential 3-Dot Loader */}
          <div className="football-dots-progress" aria-hidden="true">
            <span className="dot dot-1" />
            <span className="dot dot-2" />
            <span className="dot dot-3" />
          </div>
        </div>
      </div>
    </aside>
  );
}
