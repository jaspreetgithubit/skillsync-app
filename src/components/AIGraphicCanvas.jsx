import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * AIGraphicCanvas
 * High-performance WebGL canvas powered by Three.js
 * Renders an interactive 3D AI neural network (People → Skills → AI → Team)
 * with glowing nodes, dynamic connecting splines, traveling data pulses, and mouse parallax.
 */
export default function AIGraphicCanvas({
  stage = 0,
  mousePos = { x: 0, y: 0 },
  accentColor = '#06B6D4',
  className = ''
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const nodesRef = useRef([]);
  const linesMeshRef = useRef(null);
  const pulsesRef = useRef([]);
  const animFrameIdRef = useRef(null);
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });

  // Update target mouse coordinates smoothly
  useEffect(() => {
    targetMouseRef.current = {
      x: (mousePos.x || 0) * 0.8,
      y: (mousePos.y || 0) * 0.8
    };
  }, [mousePos]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 85;

    // 2. WebGL Renderer with Alpha
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to 2D context', e);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Node Generation (Device-responsive density)
    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 32 : 72;
    const nodes = [];
    const nodePositions = new Float32Array(nodeCount * 3);

    // Color parsing (Harmonized with Landing Page Obsidian & Amber-Gold Palette)
    const threeAccent = new THREE.Color(accentColor || '#F59E0B');
    const threeCore = new THREE.Color('#FBBF24');
    const threeViolet = new THREE.Color('#8B5CF6');

    // Create a circular glowing sprite texture for points
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(245, 158, 11, 0.9)');
      grad.addColorStop(0.55, 'rgba(139, 92, 246, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const glowTexture = createGlowTexture();

    for (let i = 0; i < nodeCount; i++) {
      const radius = 35 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.7; // slightly flatter
      const z = (Math.random() - 0.5) * 50;

      nodes.push({
        x, y, z,
        originX: x, originY: y, originZ: z,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        vz: (Math.random() - 0.5) * 0.03,
        size: 1.2 + Math.random() * 2.4,
        phase: Math.random() * Math.PI * 2
      });

      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;
    }
    nodesRef.current = nodes;

    // Node Points Material & Geometry
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 4.5,
      map: glowTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: threeAccent
    });

    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointsMesh);

    // 4. Connecting Lines Buffer Setup
    const maxLines = nodeCount * 4;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);
    linesMeshRef.current = linesMesh;

    // 5. Data Pulses (traveling packets of light along lines)
    const pulses = [];
    for (let p = 0; p < (isMobile ? 6 : 14); p++) {
      pulses.push({
        from: Math.floor(Math.random() * nodeCount),
        to: Math.floor(Math.random() * nodeCount),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012
      });
    }
    pulsesRef.current = pulses;

    const pulsePositions = new Float32Array(pulses.length * 3);
    const pulseGeometry = new THREE.BufferGeometry();
    pulseGeometry.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));

    const pulseMaterial = new THREE.PointsMaterial({
      size: 6.0,
      map: glowTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color('#FFFFFF')
    });

    const pulseMesh = new THREE.Points(pulseGeometry, pulseMaterial);
    scene.add(pulseMesh);

    // 6. Central AI Core Orb (activates in higher stages)
    const coreGeometry = new THREE.SphereGeometry(1.8, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: threeCore,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // 7. Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop with Stage Energy
    const startTime = performance.now();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse interpolation (lerp)
      currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.06;
      currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.06;

      // Parallax camera rotation and tilt
      camera.position.x = currentMouseRef.current.x * 12;
      camera.position.y = -currentMouseRef.current.y * 10;
      camera.lookAt(0, 0, 0);

      // Core rotation
      coreMesh.rotation.x = elapsedTime * 0.2;
      coreMesh.rotation.y = elapsedTime * 0.3;

      // Dynamic energy multiplier based on stage (0 to 7)
      const stageEnergy = 0.4 + (stage / 7) * 0.8;
      pointsMaterial.opacity = 0.5 + (stage / 7) * 0.45;
      linesMaterial.opacity = 0.2 + (stage / 7) * 0.35;
      coreMesh.scale.setScalar(1 + (stage / 7) * 1.5);

      // Update node positions with gentle floating drift
      const positions = pointsGeometry.attributes.position.array;
      let lineIndex = 0;
      const colorArray = linesGeometry.attributes.color.array;
      const posArray = linesGeometry.attributes.position.array;

      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];
        node.originX += node.vx * stageEnergy;
        node.originY += node.vy * stageEnergy;
        node.originZ += node.vz * stageEnergy;

        // Soft boundary reflection
        if (Math.abs(node.originX) > 60) node.vx *= -1;
        if (Math.abs(node.originY) > 40) node.vy *= -1;
        if (Math.abs(node.originZ) > 30) node.vz *= -1;

        // Subtle mouse repulsion / bend
        const dx = node.originX - currentMouseRef.current.x * 30;
        const dy = node.originY - (-currentMouseRef.current.y * 25);
        const dist = Math.sqrt(dx * dx + dy * dy);
        let offsetX = 0;
        let offsetY = 0;
        if (dist < 25) {
          const force = (25 - dist) / 25;
          offsetX = (dx / dist) * force * 4;
          offsetY = (dy / dist) * force * 4;
        }

        const currentX = node.originX + offsetX;
        const currentY = node.originY + offsetY;
        const currentZ = node.originZ + Math.sin(elapsedTime * 1.5 + node.phase) * 1.2;

        positions[i * 3] = currentX;
        positions[i * 3 + 1] = currentY;
        positions[i * 3 + 2] = currentZ;

        // Connect nearby nodes
        const maxConnectDist = isMobile ? 22 : 26;
        for (let j = i + 1; j < nodeCount; j++) {
          const n2 = nodes[j];
          const distNodes = Math.hypot(
            currentX - n2.originX,
            currentY - n2.originY,
            currentZ - n2.originZ
          );

          if (distNodes < maxConnectDist && lineIndex < maxLines) {
            const alpha = (1 - distNodes / maxConnectDist) * stageEnergy;

            // From Node
            posArray[lineIndex * 6] = currentX;
            posArray[lineIndex * 6 + 1] = currentY;
            posArray[lineIndex * 6 + 2] = currentZ;

            // To Node
            posArray[lineIndex * 6 + 3] = n2.originX;
            posArray[lineIndex * 6 + 4] = n2.originY;
            posArray[lineIndex * 6 + 5] = n2.originZ;

            // Vertex Colors
            colorArray[lineIndex * 6] = threeAccent.r * alpha;
            colorArray[lineIndex * 6 + 1] = threeAccent.g * alpha;
            colorArray[lineIndex * 6 + 2] = threeAccent.b * alpha;

            colorArray[lineIndex * 6 + 3] = threeViolet.r * alpha;
            colorArray[lineIndex * 6 + 4] = threeViolet.g * alpha;
            colorArray[lineIndex * 6 + 5] = threeViolet.b * alpha;

            lineIndex++;
          }
        }
      }

      pointsGeometry.attributes.position.needsUpdate = true;
      linesGeometry.setDrawRange(0, lineIndex * 2);
      linesGeometry.attributes.position.needsUpdate = true;
      linesGeometry.attributes.color.needsUpdate = true;

      // Update traveling data pulses
      const pulsePos = pulseGeometry.attributes.position.array;
      for (let p = 0; p < pulses.length; p++) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed * stageEnergy;
        if (pulse.progress >= 1) {
          pulse.progress = 0;
          pulse.from = Math.floor(Math.random() * nodeCount);
          pulse.to = Math.floor(Math.random() * nodeCount);
        }

        const nodeA = nodes[pulse.from];
        const nodeB = nodes[pulse.to];
        if (nodeA && nodeB) {
          pulsePos[p * 3] = nodeA.originX + (nodeB.originX - nodeA.originX) * pulse.progress;
          pulsePos[p * 3 + 1] = nodeA.originY + (nodeB.originY - nodeA.originY) * pulse.progress;
          pulsePos[p * 3 + 2] = nodeA.originZ + (nodeB.originZ - nodeA.originZ) * pulse.progress;
        }
      }
      pulseGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      pulseGeometry.dispose();
      pulseMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      glowTexture.dispose();
      renderer.dispose();
    };
  }, [accentColor]);

  // Dynamically update colors when track changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const newColor = new THREE.Color(accentColor || '#06B6D4');
    sceneRef.current.traverse((child) => {
      if (child.isPoints && child.material && child.material.color) {
        child.material.color = newColor;
      }
    });
  }, [accentColor]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
