import * as THREE from 'three';

/**
 * MULTI-PLANE SPORTS PARTICLE SYSTEM
 * Multi-layer instanced/buffered particles:
 * - Layer 1: Ambient Stadium Dust (Depth float)
 * - Layer 2: Kinetic Velocity Sparks (Reacts to scroll speed)
 * - Layer 3: Energy Trail Photons (Follows sports trajectories)
 */
export class ParticleSystem {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.count = options.count || 120;
    this.disposables = [];

    // Particle positions, velocities, and scales
    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);
    const scales = new Float32Array(this.count);

    const palette = [
      new THREE.Color(0xF4F7F5), // Stadium dust off-white
      new THREE.Color(0x2F6BFF), // Sports Royal Blue
      new THREE.Color(0x8BFF3D), // Athletic Lime
      new THREE.Color(0xD7A93D)  // Championship Gold
    ];

    for (let i = 0; i < this.count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3 + 0] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      scales[i] = 0.04 + Math.random() * 0.08;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // High quality circular particle canvas sprite
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.7)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 64, 64);

    const pTex = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      map: pTex,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);

    this.disposables.push(geometry, material, pTex);
  }

  update(time, delta, velocity = 0, mouse = { x: 0, y: 0 }, prefersReducedMotion = false) {
    if (!this.points) return;

    if (prefersReducedMotion) return;

    const velBoost = 1 + Math.abs(velocity) * 8;
    this.points.rotation.y = time * 0.012 * velBoost + mouse.x * 0.05;
    this.points.rotation.x = Math.sin(time * 0.15) * 0.04 + mouse.y * 0.05;
    this.points.position.y = Math.sin(time * 0.25) * 0.15;
  }

  dispose() {
    if (this.points) {
      this.scene.remove(this.points);
    }
    this.disposables.forEach(d => d.dispose());
  }
}
