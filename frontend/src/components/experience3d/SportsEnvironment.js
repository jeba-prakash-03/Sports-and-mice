import * as THREE from 'three';

/**
 * SPORTS STADIUM LIGHTING & ENVIRONMENTAL ATMOSPHERE
 * Professional multi-point architectural lighting:
 * - Key Stadium Floodlights with soft PCF shadows
 * - Sports Royal Blue Rim Light (#2F6BFF)
 * - Athletic Lime Energy Accent (#8BFF3D)
 * - Volumetric depth fog & soft shadow plane
 */
export class SportsEnvironment {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.lights = [];
    this.disposables = [];

    // 1. Environmental Fog (Architectural Soft Neutral)
    this.scene.fog = new THREE.FogExp2(0xE9EFEC, options.fogDensity || 0.032);

    // 2. Ambient Fill
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.95);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);

    // 3. Key Stadium Floodlight
    const keyFloodlight = new THREE.DirectionalLight(0xFFFFFF, 1.65);
    keyFloodlight.position.set(7.5, 9.5, 6.5);
    keyFloodlight.castShadow = true;
    keyFloodlight.shadow.mapSize.width = 1024;
    keyFloodlight.shadow.mapSize.height = 1024;
    keyFloodlight.shadow.camera.near = 0.5;
    keyFloodlight.shadow.camera.far = 25;
    keyFloodlight.shadow.bias = -0.0005;
    this.scene.add(keyFloodlight);
    this.lights.push(keyFloodlight);

    // 4. Royal Blue Rim Lighting
    const blueRim = new THREE.DirectionalLight(0x2F6BFF, 1.55);
    blueRim.position.set(-7.5, -3.2, -4.5);
    this.scene.add(blueRim);
    this.lights.push(blueRim);

    // 5. Athletic Lime Accent Fill
    const limeFill = new THREE.PointLight(0x8BFF3D, 1.2, 18);
    limeFill.position.set(3.8, -2.6, 2.8);
    this.scene.add(limeFill);
    this.lights.push(limeFill);

    // 6. Contact Soft Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x10202A,
      transparent: true,
      opacity: 0.14,
      depthWrite: false
    });
    this.shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.position.set(3.4, -1.2, -1.2);
    this.scene.add(this.shadowPlane);

    this.disposables.push(shadowGeo, shadowMat);
  }

  updateShadow(x, y, z, opacity = 0.14) {
    if (!this.shadowPlane) return;
    this.shadowPlane.position.set(x, y, z);
    this.shadowPlane.material.opacity = opacity;
  }

  dispose() {
    this.lights.forEach(light => {
      this.scene.remove(light);
      if (light.dispose) light.dispose();
    });
    if (this.shadowPlane) {
      this.scene.remove(this.shadowPlane);
    }
    this.disposables.forEach(d => d.dispose());
  }
}
