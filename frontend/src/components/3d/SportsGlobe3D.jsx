import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Calculates 3D Cartesian Vector on a Sphere from Latitude and Longitude
 */
function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/**
 * Creates 3D Parabolic Curved Spline Arc between two spherical coordinates
 */
function createTravelArc(v1, v2, altitude = 1.35) {
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
  const distance = v1.distanceTo(v2);
  mid.setLength(v1.length() + distance * 0.28 * altitude);

  const curve = new THREE.CatmullRomCurve3([v1, mid, v2]);
  const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.018, 8, false);
  return { curve, tubeGeo };
}

/**
 * Generates High-Resolution Earth Landmass Canvas Texture
 */
function createEarthLandmassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep architectural ocean base
  ctx.fillStyle = '#0E1C24';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Delicate grid lines (latitude & longitude)
  ctx.strokeStyle = 'rgba(47, 107, 255, 0.15)';
  ctx.lineWidth = 1.5;
  for (let lat = 0; lat < canvas.height; lat += canvas.height / 12) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(canvas.width, lat);
    ctx.stroke();
  }
  for (let lon = 0; lon < canvas.width; lon += canvas.width / 24) {
    ctx.beginPath();
    ctx.moveTo(lon, 0);
    ctx.lineTo(lon, canvas.height);
    ctx.stroke();
  }

  // Continent Landmass Shapes (Stylized High-End Cartography)
  ctx.fillStyle = '#1D333F';
  ctx.strokeStyle = 'rgba(74, 137, 255, 0.4)';
  ctx.lineWidth = 2;

  // North America
  ctx.beginPath();
  ctx.ellipse(420, 320, 180, 140, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // South America
  ctx.beginPath();
  ctx.ellipse(600, 680, 110, 180, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Europe
  ctx.beginPath();
  ctx.ellipse(1080, 280, 95, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Africa
  ctx.beginPath();
  ctx.ellipse(1120, 560, 130, 190, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Asia
  ctx.beginPath();
  ctx.ellipse(1480, 340, 260, 170, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Australia
  ctx.beginPath();
  ctx.ellipse(1720, 720, 100, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * HIGH-END SPORTS GLOBE 3D (HOTELS & MORE DESTINATIONS)
 * - True 3D Earth Landmass Sphere
 * - Real 3D sports destination beacons (Cancún, Dubai, Havana, Beijing, Johannesburg)
 * - 3D Parabolic flight trajectory arcs with travelling energy photons
 * - Atmospheric Fresnel scattering halo
 * - Smooth rotation and mouse interaction
 */
export const SportsGlobe3D = ({ className = '', size = 380 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 2. Globe Sphere & Material
    const globeRadius = 2.2;
    const earthTexture = createEarthLandmassTexture();
    const globeGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const globeMat = new THREE.MeshPhysicalMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.12,
      clearcoat: 0.2,
      clearcoatRoughness: 0.3
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);

    // Atmospheric Halo (Outer Glow)
    const haloGeo = new THREE.SphereGeometry(globeRadius * 1.14, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x2F6BFF,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    scene.add(haloMesh);

    // 3. Real Destination Coordinates
    const hqCoord = { name: 'HQ Europe', lat: 50.11, lon: 8.68 };
    const hqVec = latLongToVector3(hqCoord.lat, hqCoord.lon, globeRadius * 1.01);

    const destinations = [
      { name: 'Cancún', lat: 21.16, lon: -86.85, color: 0x8BFF3D },
      { name: 'Dubai', lat: 25.20, lon: 55.27, color: 0x2F6BFF },
      { name: 'Havana', lat: 23.11, lon: -82.36, color: 0xD7A93D },
      { name: 'Beijing', lat: 39.90, lon: 116.40, color: 0x8BFF3D },
      { name: 'Johannesburg', lat: -26.20, lon: 28.04, color: 0xD7A93D }
    ];

    const markersGroup = new THREE.Group();
    const arcsGroup = new THREE.Group();
    const photonsGroup = new THREE.Group();
    const travelCurves = [];

    // HQ Marker (Crown Dot)
    const hqDotGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const hqDotMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const hqDot = new THREE.Mesh(hqDotGeo, hqDotMat);
    hqDot.position.copy(hqVec);
    markersGroup.add(hqDot);

    // Build Destination Beacons and Flight Arcs
    destinations.forEach((dest) => {
      const destVec = latLongToVector3(dest.lat, dest.lon, globeRadius * 1.01);

      // Destination 3D Pin
      const pinGeo = new THREE.SphereGeometry(0.065, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: dest.color });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(destVec);
      markersGroup.add(pinMesh);

      // Pulsing 3D Ring
      const ringGeo = new THREE.RingGeometry(0.08, 0.13, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: dest.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(destVec);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      markersGroup.add(ringMesh);

      // 3D Parabolic Flight Arc
      const { curve, tubeGeo } = createTravelArc(hqVec, destVec, 1.25);
      travelCurves.push(curve);

      const arcMat = new THREE.MeshBasicMaterial({
        color: dest.color,
        transparent: true,
        opacity: 0.4
      });
      const arcMesh = new THREE.Mesh(tubeGeo, arcMat);
      arcsGroup.add(arcMesh);

      // Travelling Energy Photon
      const photonGeo = new THREE.SphereGeometry(0.045, 12, 12);
      const photonMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const photonMesh = new THREE.Mesh(photonGeo, photonMat);
      photonsGroup.add(photonMesh);
    });

    globeMesh.add(markersGroup);
    globeMesh.add(arcsGroup);
    globeMesh.add(photonsGroup);
    scene.add(globeMesh);

    // 4. Studio Lighting
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.6);
    dirLight.position.set(6, 6, 6);
    scene.add(dirLight);

    const blueLight = new THREE.DirectionalLight(0x2F6BFF, 1.2);
    blueLight.position.set(-6, -3, -4);
    scene.add(blueLight);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
    scene.add(ambientLight);

    // 5. Mouse Interaction
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x * 0.5;
      mouse.targetY = y * 0.35;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // 6. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!prefersReducedMotion) {
        // Continuous slow rotation + cursor influence
        globeMesh.rotation.y += 0.0035;
        globeMesh.rotation.x = 0.22 + mouse.y * 0.4;
        globeMesh.rotation.z = mouse.x * 0.25;

        // Animate travelling photons along trajectory curves
        travelCurves.forEach((curve, idx) => {
          const photon = photonsGroup.children[idx];
          if (photon) {
            const progress = (time * 0.35 + idx * 0.2) % 1.0;
            const pt = curve.getPointAt(progress);
            photon.position.copy(pt);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      earthTexture.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      hqDotGeo.dispose();
      hqDotMat.dispose();
      arcsGroup.children.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      photonsGroup.children.forEach((p) => {
        p.geometry.dispose();
        p.material.dispose();
      });
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      className={`sports-globe-3d-wrapper ${className}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      aria-label="3D Interactive Destinations Globe"
    />
  );
};
