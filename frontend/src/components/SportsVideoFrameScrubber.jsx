import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, FastForward, Film, Activity, Gauge, Flame, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/sports-scrubber.css';

const frames = [
  '/assets/sports/sequence/frame_1.svg',
  '/assets/sports/sequence/frame_2.svg',
  '/assets/sports/sequence/frame_3.svg',
  '/assets/sports/sequence/frame_4.svg',
  '/assets/sports/sequence/frame_5.svg'
];

const frameStats = [
  { stage: 'BLOCK START', speed: '0.0 m/s', GForce: '1.0 G', focus: 'Reaction Time' },
  { stage: 'EXPLOSION', speed: '6.4 m/s', GForce: '2.8 G', focus: 'Initial Drive' },
  { stage: 'ACCELERATION', speed: '11.8 m/s', GForce: '3.4 G', focus: 'Stride Frequency' },
  { stage: 'MAX VELOCITY', speed: '12.4 m/s', GForce: '4.1 G', focus: 'Top Speed' },
  { stage: 'FINISH LINE', speed: 'RECORD', GForce: '5.0 G', focus: 'Gold Medal' }
];

const SportsVideoFrameScrubber = () => {
  const { lang } = useLanguage();
  const containerRef = useRef(null);

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Map scroll 0 -> 1 to frame index 0 -> 4
  const frameIndexFloat = useTransform(scrollYProgress, [0, 1], [0, frames.length - 1]);

  useEffect(() => {
    const unsubscribe = frameIndexFloat.on('change', (latest) => {
      if (!isPlaying) {
        setCurrentFrameIndex(Math.min(frames.length - 1, Math.max(0, Math.round(latest))));
      }
    });
    return () => unsubscribe();
  }, [frameIndexFloat, isPlaying]);

  // Auto playback mode
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStat = frameStats[currentFrameIndex] || frameStats[0];

  return (
    <section ref={containerRef} className="video-scrubber-section">
      <div className="scrubber-sticky-wrapper">
        
        {/* Header HUD */}
        <div className="scrubber-hud-header">
          <div className="hud-badge">
            <Film size={15} style={{ color: '#00f0ff' }} />
            <span>FRAME SEQUENCE VIDEO SCRUBBER</span>
          </div>
          <h2 className="scrubber-title">
            SCROLL TO SCRUB <span className="text-cyan-glow">ATHLETE FRAME MOTION</span>
          </h2>
          <p className="scrubber-subtitle">
            Scroll down or drag the scrubber to analyze peak velocity athlete kinematics frame by frame.
          </p>
        </div>

        {/* Main Frame Viewport & Canvas Screen */}
        <div className="scrubber-viewport-card">
          <div className="viewport-screen">
            <img 
              src={frames[currentFrameIndex]} 
              alt={`Frame ${currentFrameIndex + 1}`} 
              className="scrubber-frame-img"
            />
            
            {/* Hologram Telemetry HUD Overlay */}
            <div className="telemetry-overlay">
              <div className="telemetry-box box-top-left">
                <span className="hud-label">STAGE</span>
                <span className="hud-val text-cyan">{currentStat.stage}</span>
              </div>
              <div className="telemetry-box box-top-right">
                <span className="hud-label">VELOCITY</span>
                <span className="hud-val text-gold">{currentStat.speed}</span>
              </div>
              <div className="telemetry-box box-bottom-left">
                <span className="hud-label">LOAD G-FORCE</span>
                <span className="hud-val">{currentStat.GForce}</span>
              </div>
              <div className="telemetry-box box-bottom-right">
                <span className="hud-label">BIOMECHANIC FOCUS</span>
                <span className="hud-val">{currentStat.focus}</span>
              </div>
            </div>
          </div>

          {/* Interactive Control Dock & Frame Scrub Bar */}
          <div className="scrubber-controls-dock">
            <button 
              className="btn-play-toggle"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause Auto-Scrub' : 'Play Frame Sequence'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Frame Buttons */}
            <div className="frame-buttons-list">
              {frames.map((_, idx) => (
                <button
                  key={idx}
                  className={`frame-dot-btn ${idx === currentFrameIndex ? 'active' : ''}`}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentFrameIndex(idx);
                  }}
                >
                  <span>F0{idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Scrub Slider Input */}
            <input 
              type="range"
              min="0"
              max={frames.length - 1}
              value={currentFrameIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentFrameIndex(Number(e.target.value));
              }}
              className="scrubber-range-slider"
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default SportsVideoFrameScrubber;
