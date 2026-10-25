import React, { useRef, useEffect } from 'react';

/**
 * InteractiveDotMatrix
 * 2026 High-Performance Canvas Animation
 * Renders an ambient matrix of cyber grid dots that gently warp, disperse,
 * and brighten when the cursor approaches within radius.
 * Features an idle ambient sine-wave breathing oscillation.
 */
export default function InteractiveDotMatrix({
  dotSpacing = 38,
  dotRadius = 1.3,
  mouseRadius = 170,
  maxDisplacement = 28,
  color = 'rgba(255, 255, 255, 0.08)',
  activeColor = 'rgba(245, 158, 11, 0.55)', // Warm Amber Gold
  lineColor = 'rgba(245, 158, 11, 0.15)',
  className = ''
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovered: false
    };

    // Calculate grid dots
    const createDots = () => {
      const dots = [];
      const cols = Math.ceil(width / dotSpacing) + 2;
      const rows = Math.ceil(height / dotSpacing) + 2;

      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const originX = i * dotSpacing;
          const originY = j * dotSpacing;
          dots.push({
            originX,
            originY,
            x: originX,
            y: originY,
            vx: 0,
            vy: 0,
            phase: Math.random() * Math.PI * 2
          });
        }
      }
      return dots;
    };

    let dots = createDots();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      dots = createDots();
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

    let time = 0;

    const render = () => {
      time += 0.02;

      // Smooth mouse coordinate lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid connections near the cursor
      if (mouse.isHovered) {
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 0.75;
      }

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Ambient idle breathing oscillation
        const waveX = Math.sin(time + dot.phase) * 1.5;
        const waveY = Math.cos(time + dot.phase * 0.8) * 1.5;

        // Interaction with cursor
        const dx = dot.originX - mouse.x;
        const dy = dot.originY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = dot.originX + waveX;
        let targetY = dot.originY + waveY;
        let dotAlpha = 0.08;
        let isNear = false;

        if (dist < mouseRadius && dist > 0) {
          isNear = true;
          // Warping force (push slightly outward with spring resistance)
          const force = (1 - dist / mouseRadius);
          const angle = Math.atan2(dy, dx);
          const displacement = force * maxDisplacement;

          targetX += Math.cos(angle) * displacement;
          targetY += Math.sin(angle) * displacement;
          dotAlpha = 0.08 + force * 0.55;
        }

        // Smooth spring interpolation to target position
        dot.x += (targetX - dot.x) * 0.2;
        dot.y += (targetY - dot.y) * 0.2;

        // Render dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius * (isNear ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fillStyle = isNear ? activeColor : color;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dotSpacing, dotRadius, mouseRadius, maxDisplacement, color, activeColor, lineColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 select-none ${className}`}
      style={{ opacity: 0.95 }}
    />
  );
}

