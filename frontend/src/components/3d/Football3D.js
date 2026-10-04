import * as THREE from 'three';

/**
 * High-Precision Geometric Truncated Icosahedron Association Football
 * - 32 Real 3D Panels (12 Regular Pentagons + 20 Regular Hexagons)
 * - Geodesic Spherical Projection with leather panel doming
 * - Real 3D Beveled Seam Crevices between every panel
 * - Synthetic leather micro-grain normal/bump mapping
 * - Realistic physical materials with distinct pentagon and hexagon properties
 */
export function createRealisticFootball(radius = 0.9) {
  const t = (1 + Math.sqrt(5)) / 2; // Golden ratio phi ~ 1.61803398875

  // 1. The 12 Golden Ratio vertices of a regular icosahedron
  const icoVerts = [
    new THREE.Vector3(-1, t, 0),
    new THREE.Vector3(1, t, 0),
    new THREE.Vector3(-1, -t, 0),
    new THREE.Vector3(1, -t, 0),
    new THREE.Vector3(0, -1, t),
    new THREE.Vector3(0, 1, t),
    new THREE.Vector3(0, -1, -t),
    new THREE.Vector3(0, 1, -t),
    new THREE.Vector3(t, 0, -1),
    new THREE.Vector3(t, 0, 1),
    new THREE.Vector3(-t, 0, -1),
    new THREE.Vector3(-t, 0, 1)
  ];

  // 2. The 20 Triangular Faces of the icosahedron
  const icoFaces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
  ];

  // Map icosahedron vertices to adjacent vertices in circular order for the 12 pentagons
  const icoNeighbors = [
    [11, 5, 1, 7, 10],   // 0
    [0, 5, 9, 8, 7],     // 1
    [11, 4, 3, 6, 10],   // 2
    [9, 4, 2, 6, 8],     // 3
    [5, 9, 3, 2, 11],    // 4
    [0, 11, 4, 9, 1],    // 5
    [7, 8, 3, 2, 10],    // 6
    [0, 1, 8, 6, 10],    // 7
    [1, 9, 3, 6, 7],     // 8
    [1, 5, 4, 3, 8],     // 9
    [0, 7, 6, 2, 11],    // 10
    [0, 10, 2, 4, 5]     // 11
  ];

  // Truncation helper: point 1/3 from A to B
  function getThird(a, b) {
    return new THREE.Vector3().copy(a).multiplyScalar(2 / 3).addScaledVector(b, 1 / 3).normalize().multiplyScalar(radius);
  }

  // 3. Construct the 12 Pentagons
  const pentagons = [];
  for (let i = 0; i < 12; i++) {
    const centerIco = icoVerts[i];
    const neighbors = icoNeighbors[i];
    const pts = neighbors.map(nIdx => getThird(centerIco, icoVerts[nIdx]));
    
    // Sort vertices counter-clockwise around center normal
    const normal = centerIco.clone().normalize();
    pts.sort((a, b) => {
      const vA = a.clone().sub(centerIco);
      const vB = b.clone().sub(centerIco);
      const cross = new THREE.Vector3().crossVectors(vA, vB);
      return cross.dot(normal) > 0 ? -1 : 1;
    });

    pentagons.push(pts);
  }

  // 4. Construct the 20 Hexagons
  const hexagons = [];
  for (let f = 0; f < 20; f++) {
    const [iA, iB, iC] = icoFaces[f];
    const vA = icoVerts[iA];
    const vB = icoVerts[iB];
    const vC = icoVerts[iC];

    const pts = [
      getThird(vA, vB),
      getThird(vB, vA),
      getThird(vB, vC),
      getThird(vC, vB),
      getThird(vC, vA),
      getThird(vA, vC)
    ];

    const faceCenter = new THREE.Vector3().add(vA).add(vB).add(vC).divideScalar(3);
    const normal = faceCenter.clone().normalize();
    pts.sort((a, b) => {
      const v1 = a.clone().sub(faceCenter);
      const v2 = b.clone().sub(faceCenter);
      const cross = new THREE.Vector3().crossVectors(v1, v2);
      return cross.dot(normal) > 0 ? -1 : 1;
    });

    hexagons.push(pts);
  }

  // 5. Generate Micro-Texture Leather Bump Canvas
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d');
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const val = Math.random() > 0.5 ? '#8e8e8e' : '#727272';
    bCtx.fillStyle = val;
    bCtx.fillRect(x, y, 2, 2);
  }

  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  bumpTex.wrapS = THREE.RepeatWrapping;
  bumpTex.wrapT = THREE.RepeatWrapping;
  bumpTex.repeat.set(4, 4);

  // 6. Professional Soccer Ball Physical Materials
  // Material 0: Pentagon Synthetic Dark Navy / Obsidian Leather
  const pentagonMat = new THREE.MeshPhysicalMaterial({
    color: 0x111c24,
    roughness: 0.46,
    metalness: 0.05,
    clearcoat: 0.14,
    clearcoatRoughness: 0.35,
    bumpMap: bumpTex,
    bumpScale: 0.008,
    reflectivity: 0.45
  });

  // Material 1: Hexagon Pearl White Leather
  const hexagonMat = new THREE.MeshPhysicalMaterial({
    color: 0xF5F8F6,
    roughness: 0.38,
    metalness: 0.02,
    clearcoat: 0.20,
    clearcoatRoughness: 0.3,
    bumpMap: bumpTex,
    bumpScale: 0.008,
    reflectivity: 0.6
  });

  // Material 2: Deep Recessed Seam Stitch Grooves
  const seamMat = new THREE.MeshStandardMaterial({
    color: 0x070b0e,
    roughness: 0.88,
    metalness: 0.1
  });

  // 7. Assemble Complete 3D Football Mesh with Inset Leather Bevels
  const footballGroup = new THREE.Group();
  const allGeometries = [];

  function buildPanelMesh(pts, isPentagon) {
    const n = pts.length;
    
    // Calculate panel center & dome normal
    const center = new THREE.Vector3();
    pts.forEach(p => center.add(p));
    center.divideScalar(n);
    const centerNormal = center.clone().normalize();
    
    // Slight dome puffing on real inflated ball
    const domeCenter = centerNormal.clone().multiplyScalar(radius * 1.018);

    const vertices = [];
    const normals = [];
    const uvs = [];

    // Inset panel boundary for geometric stitch crevice
    const insetPts = pts.map(p => {
      const dir = p.clone().sub(center);
      return center.clone().addScaledVector(dir, 0.945).normalize().multiplyScalar(radius * 1.012);
    });

    const recessedPts = pts.map(p => {
      return p.clone().normalize().multiplyScalar(radius * 0.988);
    });

    // Main Panel Face (Triangulated Fan from dome center)
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      
      const p1 = domeCenter;
      const p2 = insetPts[i];
      const p3 = insetPts[next];

      const norm = new THREE.Vector3().crossVectors(p2.clone().sub(p1), p3.clone().sub(p1)).normalize();

      vertices.push(p1.x, p1.y, p1.z);
      vertices.push(p2.x, p2.y, p2.z);
      vertices.push(p3.x, p3.y, p3.z);

      normals.push(p1.x / radius, p1.y / radius, p1.z / radius);
      normals.push(norm.x, norm.y, norm.z);
      normals.push(norm.x, norm.y, norm.z);

      uvs.push(0.5, 0.5, 0, 0, 1, 0);
    }

    // Beveled Seam Border (slopes down into the crevice)
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      
      const top1 = insetPts[i];
      const top2 = insetPts[next];
      const bot1 = recessedPts[i];
      const bot2 = recessedPts[next];

      // Quad 1: top1 -> bot1 -> bot2
      vertices.push(top1.x, top1.y, top1.z);
      vertices.push(bot1.x, bot1.y, bot1.z);
      vertices.push(bot2.x, bot2.y, bot2.z);

      // Quad 2: top1 -> bot2 -> top2
      vertices.push(top1.x, top1.y, top1.z);
      vertices.push(bot2.x, bot2.y, bot2.z);
      vertices.push(top2.x, top2.y, top2.z);

      const normBevel = new THREE.Vector3().crossVectors(bot1.clone().sub(top1), bot2.clone().sub(top1)).normalize();

      for (let k = 0; k < 6; k++) {
        normals.push(normBevel.x, normBevel.y, normBevel.z);
        uvs.push(0, 0);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    const mesh = new THREE.Mesh(geo, isPentagon ? pentagonMat : hexagonMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    allGeometries.push(geo);

    return mesh;
  }

  // Add 12 Pentagons
  pentagons.forEach(pts => {
    footballGroup.add(buildPanelMesh(pts, true));
  });

  // Add 20 Hexagons
  hexagons.forEach(pts => {
    footballGroup.add(buildPanelMesh(pts, false));
  });

  // Inner Core Sphere to ensure light occludes through seam gaps
  const innerGeo = new THREE.SphereGeometry(radius * 0.985, 32, 32);
  const innerMesh = new THREE.Mesh(innerGeo, seamMat);
  footballGroup.add(innerMesh);
  allGeometries.push(innerGeo);

  return {
    mesh: footballGroup,
    geometry: {
      dispose: () => allGeometries.forEach(g => g.dispose())
    },
    material: {
      dispose: () => {
        pentagonMat.dispose();
        hexagonMat.dispose();
        seamMat.dispose();
      }
    },
    textures: [bumpTex]
  };
}
