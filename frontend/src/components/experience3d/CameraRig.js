import * as THREE from 'three';
import { interpolateKeyframes, easings } from './timelineEngine';

/**
 * CINEMATIC CAMERA RIG (PeachWeb-style Camera Director)
 * - Keyframed position & lookAt target
 * - Dynamic FOV transitions
 * - Spring-damped cursor parallax
 * - Velocity-responsive micro-drift
 */
export class CameraRig {
  constructor(camera, options = {}) {
    this.camera = camera;
    this.baseFov = options.baseFov || 38;
    this.mouseInfluence = options.mouseInfluence || { x: 0.65, y: 0.45 };
    
    // Default Camera Keyframe Timeline (0.0 -> 1.0)
    this.timeline = options.timeline || [
      {
        progress: 0.0,
        values: {
          posX: 0.0,
          posY: 0.0,
          posZ: 8.8,
          targetX: 0.0,
          targetY: 0.0,
          targetZ: 0.0,
          fov: 38
        }
      },
      {
        progress: 0.35,
        values: {
          posX: 0.4,
          posY: -0.2,
          posZ: 7.2,
          targetX: 0.8,
          targetY: -0.1,
          targetZ: 0.0,
          fov: 40
        }
      },
      {
        progress: 0.70,
        values: {
          posX: 0.8,
          posY: -0.5,
          posZ: 6.0,
          targetX: 1.5,
          targetY: -0.4,
          targetZ: 0.0,
          fov: 42
        }
      },
      {
        progress: 1.0,
        values: {
          posX: 1.2,
          posY: -0.9,
          posZ: 5.2,
          targetX: 2.2,
          targetY: -0.6,
          targetZ: 0.0,
          fov: 38
        }
      }
    ];

    this.currentLookAt = new THREE.Vector3(0, 0, 0);
  }

  setTimeline(timeline) {
    this.timeline = timeline;
  }

  update(progress, mouse = { x: 0, y: 0 }, velocity = 0, prefersReducedMotion = false) {
    const state = interpolateKeyframes(this.timeline, progress, easings.easeInOutCubic);
    if (!state) return;

    if (prefersReducedMotion) {
      this.camera.position.set(state.posX, state.posY, state.posZ);
      this.camera.lookAt(state.targetX, state.targetY, state.targetZ);
      return;
    }

    // Apply cursor parallax and velocity damping
    const parallaxX = mouse.x * this.mouseInfluence.x;
    const parallaxY = mouse.y * this.mouseInfluence.y;
    const velocityPush = Math.min(Math.max(velocity * 4.0, -0.4), 0.4);

    const finalX = state.posX + parallaxX;
    const finalY = state.posY + parallaxY;
    const finalZ = state.posZ + velocityPush;

    this.camera.position.set(finalX, finalY, finalZ);

    // Smooth LookAt Target
    this.currentLookAt.set(
      state.targetX + parallaxX * 0.3,
      state.targetY + parallaxY * 0.3,
      state.targetZ
    );
    this.camera.lookAt(this.currentLookAt);

    // Subtle FOV update if changed
    if (state.fov && Math.abs(this.camera.fov - state.fov) > 0.1) {
      this.camera.fov = state.fov;
      this.camera.updateProjectionMatrix();
    }
  }
}
