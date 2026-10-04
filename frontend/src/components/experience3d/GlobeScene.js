import * as THREE from 'three';

/**
 * 3D CARTOGRAPHIC SPORTS GLOBE SCENE
 * - High-res Earth landmass cartography
 * - Latitude/Longitude grid
 * - Atmospheric Fresnel rim glow
 * - Glowing destination pins (Cancún, Dubai, Havana, Beijing, Johannesburg)
 * - 3D Parabolic flight arcs with traveling energy photons
 */

function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function createTravelArc(v1, v2, altitude = 1.35) {
  const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
  const distance = v1.distanceTo(v2);
  mid.setLength(v1.length() + distance * 0.28 * altitude);

  const curve = new THREE.CatmullRomCurve3([v1, mid, v2]);
  const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.018, 8, false);
  return { curve, tubeGeo };
}

function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Ocean
  ctx.fillStyle = '#0E1C24';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Lat/Lon grid
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

  // Continents
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
  return texture;
}

export class GlobeScene {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.radius = options.radius || 2.4;
    this.group = new THREE.Group();
    this.disposables = [];
    this.photons = [];

    // 1. Globe Mesh
    const globeGeo = new THREE.SphereGeometry(this.radius, 64, 64);
    const globeTex = createEarthTexture();
    const globeMat = new THREE.MeshStandardMaterial({
      map: globeTex,
      roughness: 0.45,
      metalness: 0.15
    });
    this.globeMesh = new THREE.Mesh(globeGeo, globeMat);
    this.group.add(this.globeMesh);
    this.disposables.push(globeGeo, globeMat, globeTex);

    // 2. Atmospheric Fresnel Rim Glow
    const atmosGeo = new THREE.SphereGeometry(this.radius * 1.035, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x2F6BFF,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    this.group.add(atmosMesh);
    this.disposables.push(atmosGeo, atmosMat);

    // 3. Key Sports Destinations (from CMS site inspection tours)
    const destinations = [
      { name: 'Cancún, Mexico', lat: 21.1619, lon: -86.8515 },
      { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708 },
      { name: 'Havana, Cuba', lat: 23.1136, lon: -82.3666 },
      { name: 'Beijing, China', lat: 39.9042, lon: 116.4074 },
      { name: 'Johannesburg, South Africa', lat: -26.2041, lon: 28.0473 }
    ];

    const destVectors = destinations.map(d => ({
      ...d,
      vec: latLongToVector3(d.lat, d.lon, this.radius)
    }));

    // Add glowing destination beacon pins
    const pinGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x8BFF3D });
    this.disposables.push(pinGeo, pinMat);

    destVectors.forEach(d => {
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(d.vec);
      this.group.add(pin);
    });

    // 4. Parabolic Flight Arcs with Photons
    const arcRoutes = [
      [destVectors[0], destVectors[1]],
      [destVectors[1], destVectors[3]],
      [destVectors[1], destVectors[4]],
      [destVectors[2], destVectors[0]]
    ];

    const photonGeo = new THREE.SphereGeometry(0.038, 12, 12);
    const photonMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    this.disposables.push(photonGeo, photonMat);

    arcRoutes.forEach(([from, to], idx) => {
      const { curve, tubeGeo } = createTravelArc(from.vec, to.vec, 1.25);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x2F6BFF : 0x8BFF3D,
        transparent: true,
        opacity: 0.45
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      this.group.add(tube);
      this.disposables.push(tubeGeo, tubeMat);

      // Energy photon traveling along the arc
      const photon = new THREE.Mesh(photonGeo, photonMat);
      this.group.add(photon);
      this.photons.push({ mesh: photon, curve, speed: 0.15 + idx * 0.05, offset: idx * 0.25 });
    });

    this.scene.add(this.group);
  }

  update(time, delta, prefersReducedMotion = false) {
    if (!this.group) return;

    if (!prefersReducedMotion) {
      this.globeMesh.rotation.y = time * 0.08;

      // Update traveling energy photons
      this.photons.forEach(p => {
        const t = (time * p.speed + p.offset) % 1;
        const pt = p.curve.getPointAt(t);
        p.mesh.position.copy(pt);
      });
    }
  }

  dispose() {
    if (this.group) {
      this.scene.remove(this.group);
    }
    this.disposables.forEach(d => d.dispose());
  }
}
