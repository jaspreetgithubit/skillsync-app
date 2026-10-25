import { useEffect, useRef } from 'react';

/**
 * NeuralConstellationBackground
 * 2026 High-Performance Interactive Neural Constellation Canvas
 * Features:
 * - Luminous floating nodes (Warm Amber #F59E0B, Cyan #06B6D4, Violet #8B5CF6)
 * - Proximity-based synaptic constellation lines with dynamic gradient tension
 * - Traveling electrical synaptic pulses along active connections
 * - Interactive cursor gravitation & magnetic spiderwebbing
 * - Ambient obsidian nebula background glow with breathing keyframes
 */
export default function NeuralConstellationBackground({
  particleCount = 65,
  connectionDistance = 140,
  mouseRadius = 180,
  showNebula = true,
  className = ''
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovered: false
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.isHovered = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Color palette precisely harmonized with SkillSync Home Page:
    // Warm Amber Gold (#F59E0B), Radiant Sun Gold (#FBBF24), Deep Molten Amber (#D97706),
    // Royal Violet (#8B5CF6), Deep Purple Bleed (#7C3AED), and Precision Emerald (#10B981)
    const nodePalettes = [
      { r: 245, g: 158, b: 11, hex: '#F59E0B' }, // Warm Amber Gold (Primary Brand)
      { r: 251, g: 191, b: 36, hex: '#FBBF24' }, // Radiant Sun Gold
      { r: 217, g: 119, b: 6, hex: '#D97706' },  // Deep Molten Amber
      { r: 139, g: 92, b: 246, hex: '#8B5CF6' }, // Royal Violet
      { r: 124, g: 58, b: 237, hex: '#7C3AED' }, // Deep Purple Bleed
      { r: 16, g: 185, b: 129, hex: '#10B981' }  // Subtle Emerald Accent
    ];

    // Initialize particles
    const effectiveCount = width < 768 ? Math.floor(particleCount * 0.55) : particleCount;
    const particles = Array.from({ length: effectiveCount }, (_, i) => {
      const color = nodePalettes[i % nodePalettes.length];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: Math.random() * 2.2 + 1.2,
        baseRadius: Math.random() * 2.2 + 1.2,
        color,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03
      };
    });

    // Synaptic electrical data pulses traveling between connections
    const pulses = Array.from({ length: 12 }, () => ({
      p1Index: Math.floor(Math.random() * particles.length),
      p2Index: Math.floor(Math.random() * particles.length),
      progress: Math.random(),
      speed: 0.008 + Math.random() * 0.014
    }));

    let lastTime = performance.now();

    const render = (now) => {
      animId = requestAnimationFrame(render);

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // 1. Move and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic floating
        p.x += p.vx * 60 * delta;
        p.y += p.vy * 60 * delta;

        // Gentle boundary bounce
        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;

        // Subtle pulsation
        p.pulsePhase += p.pulseSpeed;
        p.radius = p.baseRadius + Math.sin(p.pulsePhase) * 0.6;

        // Mouse Gravitation / Repulsion
        if (mouse.isHovered) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius && dist > 0) {
            const force = (1 - dist / mouseRadius) * 0.8;
            // Gentle orbital attraction
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        }
      }

      // 2. Draw Synaptic Constellation Lines between nearby nodes
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Mouse connection web
        if (mouse.isHovered) {
          const dxM = mouse.x - p1.x;
          const dyM = mouse.y - p1.y;
          const distM = Math.sqrt(dxM * dxM + dyM * dyM);

          if (distM < mouseRadius) {
            const alphaM = (1 - distM / mouseRadius) * 0.38;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${alphaM})`;
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // 3. Draw Traveling Electrical Synapse Pulses
      for (let i = 0; i < pulses.length; i++) {
        const pulse = pulses[i];
        const p1 = particles[pulse.p1Index];
        const p2 = particles[pulse.p2Index];

        if (!p1 || !p2) continue;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance * 1.3) {
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1) {
            pulse.progress = 0;
            pulse.p1Index = Math.floor(Math.random() * particles.length);
            pulse.p2Index = Math.floor(Math.random() * particles.length);
          }

          const pulseX = p1.x + dx * pulse.progress;
          const pulseY = p1.y + dy * pulse.progress;

          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#F59E0B';
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Re-route pulse if particles drift too far
          pulse.p1Index = Math.floor(Math.random() * particles.length);
          pulse.p2Index = Math.floor(Math.random() * particles.length);
          pulse.progress = 0;
        }
      }

      // 4. Draw Glowing Neural Nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Soft outer glow halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.08)`;
        ctx.fill();

        // Solid luminous core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.hex;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color.hex;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 5. Ambient Cursor Halo
      // 5. Ambient Cursor Halo (Amber Gold & Royal Violet matching Home Page)
      if (mouse.isHovered && mouse.x > 0 && mouse.y > 0) {
        const radGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 90);
        radGrad.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
        radGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.06)');
        radGrad.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
        radGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)');
        radGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 90, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [particleCount, connectionDistance, mouseRadius]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Dynamic Ambient Nebula Glows & Micro Grid Texture (1:1 with Home Page) */}
      {showNebula && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top-Left Purple 900 Ambient Bleed (Home Page: bg-purple-900/15 blur-[180px]) */}
          <div className="absolute top-12 left-1/4 w-[750px] h-[500px] bg-purple-900/15 rounded-full blur-[180px] animate-pulse-glow" />
          
          {/* Center-Right Amber 500 Ambient Bleed (Home Page: bg-amber-500/10 blur-[190px]) */}
          <div className="absolute top-1/2 right-12 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[190px] animate-pulse-glow" style={{ animationDelay: '2.5s' }} />

          {/* Bottom-Left Amber 600 Ambient Bleed (Home Page: bg-amber-600/10 blur-[170px]) */}
          <div className="absolute bottom-12 left-12 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[170px] animate-pulse-glow" style={{ animationDelay: '5s' }} />

          {/* Home Page Micro Grid Texture */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>
      )}

      {/* Interactive 60fps Neural Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

