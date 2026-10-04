import * as THREE from 'three';
import { createRealisticFootball } from '../3d/Football3D';

/**
 * FOOTBALL 3D SCENE (PeachWeb-style Physics-Inspired Hero Object)
 * - Realistic soccer ball with physical materials, bump seams, leather micro-grain
 * - Aspect-Ratio-Aware Catmull-Rom 3D trajectory curve (Prevents overflowing canvas in editor & mobile)
 * - Velocity-responsive rotation & hover tilt
 * - Reversible timeline scrubbing
 */
export class FootballScene {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.isMobile = options.isMobile || false;
    this.aspect = options.aspect || 1.6;
    this.radius = this.isMobile ? 0.72 : (this.aspect < 1.2 ? 0.8 : 0.96);

    // 1. Create realistic 3D Football Mesh
    const { mesh, geometry, material, textures } = createRealisticFootball(this.radius);
    this.mesh = mesh;
    this.geometry = geometry;
    this.material = material;
    this.textures = textures;

    // 2. Build Aspect-Aware Trajectory Curve
    this.buildTrajectory();

    const startPos = this.trajectoryPath.getPointAt(0);
    this.mesh.position.copy(startPos);
    this.scene.add(this.mesh);

    // Hover state
    this.hoverTarget = { x: 0, y: 0 };
    this.currentHover = { x: 0, y: 0 };
  }

  buildTrajectory() {
    // Dynamic X span scaling based on aspect ratio
    const xFactor = Math.min(1.0, Math.max(0.45, (this.aspect - 0.4) / 1.2));

    const p0 = new THREE.Vector3(this.isMobile ? 1.1 : 3.2 * xFactor, this.isMobile ? 0.5 : 0.35, -1.2);
    const p1 = new THREE.Vector3(this.isMobile ? 1.3 : 3.4 * xFactor, this.isMobile ? 0.8 : 0.75, -0.4);
    const p2 = new THREE.Vector3(this.isMobile ? 1.6 : 3.8 * xFactor, this.isMobile ? 0.4 : 0.25, 0.8);
    const p3 = new THREE.Vector3(this.isMobile ? 2.0 : 4.2 * xFactor, this.isMobile ? 0.0 : -0.2, 2.2);
    const p4 = new THREE.Vector3(this.isMobile ? 2.6 : 5.0 * xFactor, this.isMobile ? -0.7 : -0.9, 3.8);

    this.trajectoryPath = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4]);
  }

  setAspect(newAspect) {
    this.aspect = newAspect;
    this.buildTrajectory();
  }

  setHover(normalizedX, normalizedY) {
    this.hoverTarget.x = normalizedX * 0.35;
    this.hoverTarget.y = normalizedY * 0.25;
  }

  update(progress, time, delta, velocity = 0, prefersReducedMotion = false) {
    if (!this.mesh) return;

    // Scrub position along 3D Catmull-Rom Trajectory
    const clampedP = Math.max(0, Math.min(1, progress * 1.1));
    const point = this.trajectoryPath.getPointAt(clampedP);

    if (prefersReducedMotion) {
      this.mesh.position.set(point.x, point.y, point.z);
      return;
    }

    // Hover lerping
    this.currentHover.x += (this.hoverTarget.x - this.currentHover.x) * 0.08;
    this.currentHover.y += (this.hoverTarget.y - this.currentHover.y) * 0.08;

    // Natural hover bobbing
    const hoverBob = Math.sin(time * 0.8) * 0.06;

    this.mesh.position.set(
      point.x + this.currentHover.x,
      point.y + hoverBob + this.currentHover.y,
      point.z
    );

    // Natural physics spin based on time, velocity, and scroll progress
    const spinMultiplier = 1 + Math.abs(velocity) * 10;
    this.mesh.rotation.y += (0.32 * delta + progress * 0.015) * spinMultiplier;
    this.mesh.rotation.x = Math.sin(time * 0.45) * 0.18 + progress * 0.45 + this.currentHover.y * 0.4;
    this.mesh.rotation.z += (progress * 0.01 + this.currentHover.x * 0.25);
  }

  getPosition() {
    return this.mesh ? this.mesh.position : new THREE.Vector3();
  }

  dispose() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.textures) {
      this.textures.forEach(t => t.dispose());
    }
  }
}
