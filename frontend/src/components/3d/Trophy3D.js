import * as THREE from 'three';

/**
 * Photorealistic 3D Metallic Gold Trophy Generator
 * Uses physical gold material with clearcoat, sculpted handles, and pedestal base.
 */
export function createRealisticTrophy(scale = 1.0) {
  const trophyGroup = new THREE.Group();

  // Gold Material
  const goldMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xD7A93D,
    emissive: 0x3A2A08,
    metalness: 0.92,
    roughness: 0.16,
    clearcoat: 0.35,
    clearcoatRoughness: 0.15,
    reflectivity: 0.95
  });

  // Dark Obsidian Pedestal Material
  const pedestalMaterial = new THREE.MeshStandardMaterial({
    color: 0x10202A,
    roughness: 0.3,
    metalness: 0.2
  });

  const geometries = [];

  // 1. Trophy Cup Goblet (Lathe Geometry)
  const cupPoints = [];
  cupPoints.push(new THREE.Vector2(0, 0));
  cupPoints.push(new THREE.Vector2(0.25, 0.05));
  cupPoints.push(new THREE.Vector2(0.18, 0.6));
  cupPoints.push(new THREE.Vector2(0.45, 1.1));
  cupPoints.push(new THREE.Vector2(0.85, 1.8));
  cupPoints.push(new THREE.Vector2(0.88, 2.0));
  cupPoints.push(new THREE.Vector2(0.82, 2.0));
  cupPoints.push(new THREE.Vector2(0.78, 1.75));
  cupPoints.push(new THREE.Vector2(0.38, 1.05));
  cupPoints.push(new THREE.Vector2(0.12, 0.55));
  cupPoints.push(new THREE.Vector2(0, 0.45));

  const cupGeo = new THREE.LatheGeometry(cupPoints, 48);
  geometries.push(cupGeo);
  const cupMesh = new THREE.Mesh(cupGeo, goldMaterial);
  cupMesh.castShadow = true;
  cupMesh.position.y = 0.4;
  trophyGroup.add(cupMesh);

  // 2. Sculpted Handles (Torus arcs on left and right)
  const handleGeo = new THREE.TorusGeometry(0.55, 0.065, 16, 32, Math.PI * 1.15);
  geometries.push(handleGeo);

  const leftHandle = new THREE.Mesh(handleGeo, goldMaterial);
  leftHandle.position.set(-0.75, 1.6, 0);
  leftHandle.rotation.z = Math.PI * 0.42;
  leftHandle.castShadow = true;
  trophyGroup.add(leftHandle);

  const rightHandle = new THREE.Mesh(handleGeo, goldMaterial);
  rightHandle.position.set(0.75, 1.6, 0);
  rightHandle.rotation.z = -Math.PI * 0.42;
  rightHandle.rotation.y = Math.PI;
  rightHandle.castShadow = true;
  trophyGroup.add(rightHandle);

  // 3. Tiered Pedestal Base
  const baseStemGeo = new THREE.CylinderGeometry(0.35, 0.5, 0.35, 32);
  geometries.push(baseStemGeo);
  const baseStem = new THREE.Mesh(baseStemGeo, goldMaterial);
  baseStem.position.y = 0.25;
  trophyGroup.add(baseStem);

  const pedestalGeo = new THREE.BoxGeometry(1.2, 0.35, 1.2);
  geometries.push(pedestalGeo);
  const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMaterial);
  pedestalMesh.position.y = -0.1;
  pedestalMesh.receiveShadow = true;
  trophyGroup.add(pedestalMesh);

  // Gold Plaque on Pedestal
  const plaqueGeo = new THREE.PlaneGeometry(0.8, 0.18);
  geometries.push(plaqueGeo);
  const plaqueMesh = new THREE.Mesh(plaqueGeo, goldMaterial);
  plaqueMesh.position.set(0, -0.1, 0.61);
  trophyGroup.add(plaqueMesh);

  trophyGroup.scale.set(scale, scale, scale);

  return {
    group: trophyGroup,
    geometries,
    materials: [goldMaterial, pedestalMaterial]
  };
}
