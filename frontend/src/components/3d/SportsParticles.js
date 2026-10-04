import * as THREE from 'three';

/**
 * Creates multi-depth sports particle field for stadium atmosphere
 */
export function createSportsParticles(count = 140) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Spread across 3D space
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    const rand = Math.random();
    if (rand > 0.7) {
      // Royal blue particle
      colors[i * 3] = 0.18;
      colors[i * 3 + 1] = 0.42;
      colors[i * 3 + 2] = 1.0;
    } else if (rand > 0.45) {
      // Athletic lime particle
      colors[i * 3] = 0.54;
      colors[i * 3 + 1] = 1.0;
      colors[i * 3 + 2] = 0.24;
    } else {
      // Ambient warm light dust
      colors[i * 3] = 0.95;
      colors[i * 3 + 1] = 0.95;
      colors[i * 3 + 2] = 0.98;
    }

    scales[i] = Math.random() * 0.08 + 0.03;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.07,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  return { points, geometry, material };
}
