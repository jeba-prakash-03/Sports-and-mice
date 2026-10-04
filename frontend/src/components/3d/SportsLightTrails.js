import * as THREE from 'three';

/**
 * Creates dynamic 3D spline trajectory light trails in sports accent colors
 */
export function createSportsLightTrails() {
  const group = new THREE.Group();

  // Curve 1: Blue Athletic Trajectory Line
  const curve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4, -2, -3),
    new THREE.Vector3(-1, 0.5, -1),
    new THREE.Vector3(2.5, 1.2, 0),
    new THREE.Vector3(4.2, 0.8, -1.5),
    new THREE.Vector3(6, -1.5, -3)
  ]);
  const tubeGeo1 = new THREE.TubeGeometry(curve1, 64, 0.02, 8, false);
  const tubeMat1 = new THREE.MeshBasicMaterial({
    color: 0x2f6bff,
    transparent: true,
    opacity: 0.35
  });
  const trail1 = new THREE.Mesh(tubeGeo1, tubeMat1);
  group.add(trail1);

  // Curve 2: Gold/Lime Energy Line
  const curve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5, 2, -4),
    new THREE.Vector3(0, 1.8, -2),
    new THREE.Vector3(3.2, 0.2, 0.5),
    new THREE.Vector3(5.5, -0.5, -1)
  ]);
  const tubeGeo2 = new THREE.TubeGeometry(curve2, 64, 0.015, 8, false);
  const tubeMat2 = new THREE.MeshBasicMaterial({
    color: 0x8bff3d,
    transparent: true,
    opacity: 0.28
  });
  const trail2 = new THREE.Mesh(tubeGeo2, tubeMat2);
  group.add(trail2);

  return { group, geometries: [tubeGeo1, tubeGeo2], materials: [tubeMat1, tubeMat2] };
}
