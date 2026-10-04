import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MotionTracker } from './timelineEngine';
import { CameraRig } from './CameraRig';
import { SportsEnvironment } from './SportsEnvironment';
import { FootballScene } from './FootballScene';
import { ParticleSystem } from './ParticleSystem';
import { TrajectorySystem } from './TrajectorySystem';

/**
 * MASTER SCENE MANAGER (PeachWeb-style Hybrid 2D + 3D Engine)
 * - Container-isolated WebGL Rendering
 * - Adapts gracefully to Public, Editor, and Preview modes
 * - Aspect-ratio aware camera and trajectory framing
 * - Reversible Bi-directional Scroll Synchronization
 * - Physics-damped Cursor Parallax & Hover Interaction
 */
export const SceneManager = ({ className = '', activeScene = 'hero', isBuilderMode = false }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect if nested in builder viewport
    const inBuilder = isBuilderMode || Boolean(
      container.closest('.builder-canvas-viewport') || 
      container.closest('.builder-canvas-container') ||
      container.closest('.real-page-editor-wrapper')
    );

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const initialWidth = container.clientWidth || 1200;
    const initialHeight = container.clientHeight || 700;
    const aspect = initialWidth / initialHeight;
    const isMobile = initialWidth < 640;

    // 1. WebGL Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    camera.position.set(0, 0, 8.8);

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile || inBuilder ? 1.0 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !inBuilder;
    if (!inBuilder) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    container.appendChild(renderer.domElement);

    // 3. Modular Systems Initialization
    const cameraRig = new CameraRig(camera, { baseFov: 38 });
    const environment = new SportsEnvironment(scene, { fogDensity: 0.032 });
    const footballScene = new FootballScene(scene, { isMobile, aspect });
    const particleSystem = new ParticleSystem(scene, { count: isMobile || inBuilder ? 35 : 120 });
    const trajectorySystem = new TrajectorySystem(scene);

    // 4. Motion & Input Trackers
    const scrollTracker = new MotionTracker(0.08);
    const mouseXTracker = new MotionTracker(0.06);
    const mouseYTracker = new MotionTracker(0.06);

    let mouse = { x: 0, y: 0 };

    // Scoped Mouse Tracker (Listens on nearest viewport container or window)
    const eventTarget = inBuilder ? (container.closest('.builder-canvas-container') || container) : window;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Bound within [-1.2, 1.2]
      const clampedNx = Math.max(-1.2, Math.min(1.2, nx));
      const clampedNy = Math.max(-1.2, Math.min(1.2, ny));

      mouseXTracker.setTarget(clampedNx * 0.45);
      mouseYTracker.setTarget(clampedNy * 0.35);

      // Raycast hover influence on football
      footballScene.setHover(clampedNx, clampedNy);
    };

    // Scoped Scroll Tracker
    const scrollContainer = inBuilder ? (container.closest('.builder-canvas-container') || window) : window;

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const parentHeight = inBuilder 
        ? (container.closest('.builder-canvas-container')?.clientHeight || 800)
        : window.innerHeight;

      const totalDist = parentHeight * 1.3;
      const curDist = -rect.top;
      const progress = Math.max(0, Math.min(1, curDist / totalDist));
      scrollTracker.setTarget(progress);
    };

    eventTarget.addEventListener('mousemove', onMouseMove, { passive: true });
    scrollContainer.addEventListener('scroll', onScroll, { passive: true });

    // 5. Container-Aware Resize Observer
    const updateSize = () => {
      if (!container) return;
      const w = container.clientWidth || 1200;
      const h = container.clientHeight || 700;
      const curAspect = w / h;

      camera.aspect = curAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      footballScene.setAspect(curAspect);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    window.addEventListener('resize', updateSize);

    // 6. Animation Loop (60fps Director Engine)
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Update smooth inputs
      const { current: smoothScroll, velocity: scrollVel } = scrollTracker.update();
      const { current: smoothMouseX } = mouseXTracker.update();
      const { current: smoothMouseY } = mouseYTracker.update();
      mouse = { x: smoothMouseX, y: smoothMouseY };

      // 6.1 Update Camera Rig Keyframes & Parallax
      cameraRig.update(smoothScroll, mouse, scrollVel, prefersReducedMotion || inBuilder);

      // 6.2 Update Football 3D Trajectory & Spin
      footballScene.update(smoothScroll, time, delta, scrollVel, prefersReducedMotion);

      // 6.3 Update Dynamic Contact Shadow Plane
      const ballPos = footballScene.getPosition();
      const shadowOpacity = Math.max(0.04, 0.14 * (1 - smoothScroll * 0.7));
      environment.updateShadow(ballPos.x, ballPos.y - (isMobile ? 1.0 : 1.35), ballPos.z, shadowOpacity);

      // 6.4 Update Atmospheric Particles & Light Trails
      particleSystem.update(time, delta, scrollVel, mouse, prefersReducedMotion);
      trajectorySystem.update(time, prefersReducedMotion);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Clean Cleanup & WebGL Resource Disposal
    return () => {
      cancelAnimationFrame(animId);
      eventTarget.removeEventListener('mousemove', onMouseMove);
      scrollContainer.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateSize);
      resizeObserver.disconnect();

      footballScene.dispose();
      environment.dispose();
      particleSystem.dispose();
      trajectorySystem.dispose();

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeScene, isBuilderMode]);

  return (
    <div
      ref={mountRef}
      className={`peachweb-scene-manager-viewport ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    />
  );
};
