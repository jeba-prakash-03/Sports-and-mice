import * as THREE from 'three';
import { createRealisticTrophy } from '../3d/Trophy3D';

/**
 * TROPHY 3D SCENE (About / Heritage / Milestone Scene)
 * - Metallic gold trophy with obsidian base
 * - MeshPhysicalMaterial with high clearcoat and specular sheen
 * - Cursor-responsive rotation and light reflection
 */
export class TrophyScene {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.isMobile = options.isMobile || false;
    const scale = this.isMobile ? 0.75 : 1.0;

    const { group, geometries, materials } = createRealisticTrophy(scale);
    this.group = group;
    this.geometries = geometries;
    this.materials = materials;

    this.group.position.set(options.posX || 2.5, options.posY || -0.2, options.posZ || 0);
    this.scene.add(this.group);

    this.targetRotationY = 0;
    this.currentRotationY = 0;
  }

  setHover(normalizedX) {
    this.targetRotationY = normalizedX * 0.45;
  }

  update(time, delta, prefersReducedMotion = false) {
    if (!this.group) return;

    if (prefersReducedMotion) {
      return;
    }

    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.06;
    
    // Slow majestic continuous idle rotation + cursor bias
    this.group.rotation.y = time * 0.15 + this.currentRotationY;
    this.group.position.y = (this.group.position.y || 0) + Math.sin(time * 0.6) * 0.002;
  }

  dispose() {
    if (this.group) {
      this.scene.remove(this.group);
    }
    this.geometries.forEach(g => g.dispose());
    this.materials.forEach(m => m.dispose());
  }
}
