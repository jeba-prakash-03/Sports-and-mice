import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createRealisticFootball } from './Football3D';
import { createSportsParticles } from './SportsParticles';
import { createSportsLightTrails } from './SportsLightTrails';

/**
 * ADVANCED CINEMATIC SPORTS SCENE (HERO SECTION)
 * Rebuilt as a Film Director Camera & Spatial Environment:
 * - Real 3D Football Asset with physical materials & contact shadows
 * - Catmull-Rom 3D Flight Trajectory with kinetic energy light trails
 * - Multi-depth volumetric stadium dust & light scattering
 * - Directional stadium floodlight illumination
 * - Scroll-scrubbed Director Camera with velocity & momentum
 * - Spring-damped cursor parallax
 */
export const SportsScene = ({ className = '' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024 && !isMobile;

    // 1. Scene & Environmental Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xE9EFEC, 0.035);

    // 2. Camera Setup (Cinematic 38° FOV for deep perspective)
    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8.8);

    // 3. WebGL Renderer with ACES Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Stadium Lighting System
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.9);
    scene.add(ambientLight);

    // Main stadium floodlight array
    const keyFloodlight = new THREE.DirectionalLight(0xFFFFFF, 1.6);
    keyFloodlight.position.set(7, 9, 6);
    keyFloodlight.castShadow = true;
    keyFloodlight.shadow.mapSize.width = 1024;
    keyFloodlight.shadow.mapSize.height = 1024;
    scene.add(keyFloodlight);

    // Royal Blue rim light (Sports Accent)
    const blueRimLight = new THREE.DirectionalLight(0x2F6BFF, 1.5);
    blueRimLight.position.set(-7, -3, -4);
    scene.add(blueRimLight);

    // Athletic Lime soft point light (Energy Accent)
    const limePoint = new THREE.PointLight(0x8BFF3D, 1.1, 18);
    limePoint.position.set(3.5, -2.5, 2.5);
    scene.add(limePoint);

    // 5. 3D Football Asset (Properly scaled in 3D midground)
    const footballRadius = isMobile ? 0.72 : isTablet ? 0.85 : 1.0;
    const { mesh: football, geometry: footGeo, material: footMat, textures: footTexs } = createRealisticFootball(footballRadius);

    // 3D Ball Trajectory Curve (Smooth Catmull-Rom flight path)
    const trajectoryPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(isMobile ? 1.2 : 3.4, isMobile ? 0.6 : 0.4, -1.2),
      new THREE.Vector3(isMobile ? 1.4 : 3.6, isMobile ? 0.9 : 0.8, -0.4),
      new THREE.Vector3(isMobile ? 1.8 : 4.1, isMobile ? 0.5 : 0.3, 0.8),
      new THREE.Vector3(isMobile ? 2.2 : 4.8, isMobile ? 0.1 : -0.2, 2.2),
      new THREE.Vector3(isMobile ? 3.0 : 6.0, isMobile ? -0.8 : -1.0, 3.8)
    ]);

    const initialPoint = trajectoryPath.getPointAt(0);
    football.position.copy(initialPoint);
    scene.add(football);

    // Contact Soft Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(2.8, 2.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x10202A,
      transparent: true,
      opacity: 0.14,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(initialPoint.x, initialPoint.y - footballRadius * 1.5, initialPoint.z);
    scene.add(shadowPlane);

    // 6. Kinetic Trajectory Light Trails
    const { group: lightTrails, geometries: trailGeos, materials: trailMats } = createSportsLightTrails();
    scene.add(lightTrails);

    // 7. Volumetric Stadium Dust & Light Particles
    const { points: particles, geometry: partGeo, material: partMat } = createSportsParticles(isMobile ? 40 : 140);
    scene.add(particles);

    // 8. Mouse Tracking with Physics Damping
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollProgress = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x * 0.45;
      mouse.targetY = y * 0.35;
    };

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalDist = window.innerHeight * 1.2;
      const curDist = -rect.top;
      scrollProgress = Math.max(0, Math.min(1, curDist / totalDist));
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // 9. Resize Handling
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // 10. Cinematic Director Animation Loop
    let animId;
    let clock = new THREE.Clock();
    let currentScrollT = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.055;
      mouse.y += (mouse.targetY - mouse.y) * 0.055;

      // Smooth scroll lerping
      currentScrollT += (scrollProgress - currentScrollT) * 0.08;

      if (!prefersReducedMotion) {
        // Director Camera Dolly & Parallax
        const cameraZ = 8.8 - currentScrollT * 2.8;
        const cameraY = mouse.y * 0.45 - currentScrollT * 0.4;
        const cameraX = mouse.x * 0.7 + currentScrollT * 0.3;

        camera.position.set(cameraX, cameraY, cameraZ);
        camera.lookAt(currentScrollT * 0.8, -currentScrollT * 0.2, 0);

        // Football Movement along 3D Catmull-Rom Trajectory
        const ballPos = trajectoryPath.getPointAt(Math.min(currentScrollT * 1.1, 1));
        
        // Add subtle floating sine hover
        const hoverOffset = Math.sin(time * 0.8) * 0.08;
        football.position.set(ballPos.x, ballPos.y + hoverOffset, ballPos.z);
        
        // Natural physics spin based on velocity & time
        football.rotation.y += 0.25 * delta + currentScrollT * 0.02;
        football.rotation.x = Math.sin(time * 0.45) * 0.18 + currentScrollT * 0.5;
        football.rotation.z += currentScrollT * 0.015;

        // Dynamic shadow tracking
        shadowPlane.position.set(ballPos.x, ballPos.y + hoverOffset - footballRadius * 1.5, ballPos.z);
        shadowPlane.material.opacity = Math.max(0.04, 0.14 * (1 - currentScrollT * 0.7));

        // Atmospheric stadium particles floating
        particles.rotation.y = time * 0.012;
        particles.position.y = Math.sin(time * 0.25) * 0.15;

        // Kinetic light trails gentle trajectory pulse
        lightTrails.rotation.y = Math.sin(time * 0.2) * 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 11. Resource Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      footGeo.dispose();
      footMat.dispose();
      footTexs.forEach((t) => t.dispose());
      shadowGeo.dispose();
      shadowMat.dispose();
      partGeo.dispose();
      partMat.dispose();
      trailGeos.forEach((g) => g.dispose());
      trailMats.forEach((m) => m.dispose());
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`sports-3d-scene-viewport ${className}`}
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
