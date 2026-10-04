import * as THREE from 'three';
import { createSportsLightTrails } from '../3d/SportsLightTrails';

/**
 * SPORTS TRAJECTORY SYSTEM
 * Spline flight trajectories with kinetic light trails:
 * - CatmullRomCurve3 3D flight arcs
 * - Royal blue & athletic lime gradient tubes
 * - Energy glow and motion pulse
 */
export class TrajectorySystem {
  constructor(scene) {
    this.scene = scene;
    const { group, geometries, materials } = createSportsLightTrails();
    this.group = group;
    this.geometries = geometries;
    this.materials = materials;

    this.scene.add(this.group);
  }

  update(time, prefersReducedMotion = false) {
    if (!this.group || prefersReducedMotion) return;

    this.group.rotation.y = Math.sin(time * 0.2) * 0.03;
  }

  dispose() {
    if (this.group) {
      this.scene.remove(this.group);
    }
    this.geometries.forEach(g => g.dispose());
    this.materials.forEach(m => m.dispose());
  }
}
