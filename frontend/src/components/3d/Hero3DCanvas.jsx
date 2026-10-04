import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Procedural Football Texture Generator
 * Creates realistic soccer ball pentagon/hexagon pattern on canvas for WebGL sphere
 */
function createFootballTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base white leather
  ctx.fillStyle = '#F4F7F5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle leather grain texture
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(210, 221, 216, 0.4)' : 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(x, y, 2, 2);
  }

  // Draw dark pentagon patches
  ctx.fillStyle = '#10202A';
  ctx.strokeStyle = '#CAD5D0';
  ctx.lineWidth = 4;

  const patches = [
    { x: 200, y: 150, r: 42 },
    { x: 512, y: 120, r: 46 },
    { x: 824, y: 150, r: 42 },
    { x: 350, y: 340, r: 44 },
    { x: 674, y: 340, r: 44 },
    { x: 100, y: 420, r: 38 },
    { x: 924, y: 420, r: 38 },
    { x: 512, y: 450, r: 40 }
  ];

  patches.forEach(({ x, y, r }) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const px = x + r * Math.cos(angle);
      const py = y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Seam lines connecting outward
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const px = x + r * Math.cos(angle);
      const py = y + r * Math.sin(angle);
      const extX = x + r * 1.6 * Math.cos(angle);
      const extY = y + r * 1.6 * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(extX, extY);
      ctx.stroke();
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * HERO 3D WEBGL SCENE
 * - 3D Floating Football with real specular lighting & shadow
 * - 3D Metallic Trophy with ambient sheen
 * - 3D Stadium architectural light rings
 * - 3D Particle dust field with motion trails
 * - Smooth cursor-tracking camera lerp & scroll-scrubbed motion
 */
export const Hero3DCanvas = ({ className = '' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 3. Lighting (Stadium floodlight feel)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(5, 8, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x2f6bff, 1.6);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const sportAccentLight = new THREE.PointLight(0x8bff3d, 1.2, 15);
    sportAccentLight.position.set(4, -2, 3);
    scene.add(sportAccentLight);

    // 4. 3D Football
    const footballTexture = createFootballTexture();
    const footballGeo = new THREE.SphereGeometry(1.4, 48, 48);
    const footballMat = new THREE.MeshStandardMaterial({
      map: footballTexture,
      roughness: 0.35,
      metalness: 0.1,
      bumpScale: 0.05
    });
    const football = new THREE.Mesh(footballGeo, footballMat);
    football.position.set(isMobile ? 1.5 : 3.8, isMobile ? 1.2 : 1.1, 1.2);
    scene.add(football);

    // 5. 3D Stadium Light Rings (Architectural Geometry)
    const ringGroup = new THREE.Group();
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x2f6bff, transparent: true, opacity: 0.25, wireframe: true });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x8bff3d, transparent: true, opacity: 0.2, wireframe: true });
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0xd7a93d, transparent: true, opacity: 0.18, wireframe: true });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.03, 16, 80), ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.position.set(3.8, 1.1, 0.5);
    ringGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(4.4, 0.02, 16, 80), ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    ring2.position.set(3.8, 1.1, -0.2);
    ringGroup.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.02, 16, 80), ringMat3);
    ring3.rotation.z = Math.PI / 5;
    ring3.position.set(3.8, 1.1, -0.8);
    ringGroup.add(ring3);

    scene.add(ringGroup);

    // 6. 3D Particles Field (Stadium Atmosphere Dust)
    const particleCount = isMobile ? 40 : 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const isLime = Math.random() > 0.6;
      colors[i * 3] = isLime ? 0.54 : 0.95;
      colors[i * 3 + 1] = isLime ? 1.0 : 0.95;
      colors[i * 3 + 2] = isLime ? 0.24 : 0.98;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Mouse and Scroll Tracking
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x * 0.6;
      mouse.targetY = y * 0.4;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // 8. Resize Handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // 9. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!prefersReducedMotion) {
        // Camera parallax
        camera.position.x = mouse.x * 1.2;
        camera.position.y = mouse.y * 0.8;
        camera.lookAt(0, 0, 0);

        // Football idle floating & rotation
        football.rotation.y += 0.3 * delta;
        football.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2;
        football.position.y = (isMobile ? 1.2 : 1.1) + Math.sin(elapsedTime * 0.8) * 0.18;

        // Scroll influence (football smoothly approaches & translates)
        const scrollFactor = Math.min(scrollY / 600, 1);
        football.position.z = 1.2 + scrollFactor * 0.8;
        football.rotation.z += scrollFactor * 0.02;

        // Architectural rings rotation
        ring1.rotation.z += 0.2 * delta;
        ring2.rotation.y -= 0.15 * delta;
        ring3.rotation.x += 0.1 * delta;

        // Particles float
        particles.rotation.y = elapsedTime * 0.02;
        particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      footballGeo.dispose();
      footballMat.dispose();
      footballTexture.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`hero-3d-canvas-container ${className}`}
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
