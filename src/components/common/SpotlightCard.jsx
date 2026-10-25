import React, { useRef, useState } from 'react';
import BorderBeam from './BorderBeam';

/**
 * SpotlightCard Component
 * Implements the user's top-pick combination:
 * 1. Beam Borders (luminous amber/yellow tracing laser border)
 * 2. Spotlight Mouse Tracker (warm yellow glow on obsidian black)
 * 3. Translucent glass surface (preserves background image visibility)
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(245, 158, 11, 0.18)', // Warm Amber/Yellow
  spotlightSize = 400,
  enableBeam = true,
  beamDuration = 9,
  onClick = null,
  ...props
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group relative rounded-2xl sm:rounded-3xl bg-black/25 backdrop-blur-md border border-white/20 overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.5)] transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-amber-500/50' : ''
      } ${className}`}
      {...props}
    >
      {/* 1. BEAM BORDER (Yellow / Amber tracing beam) */}
      {enableBeam && (
        <BorderBeam 
          duration={beamDuration} 
          colorFrom="#F59E0B"
          colorTo="transparent"
          borderWidth={1.5}
        />
      )}

      {/* 2. SPOTLIGHT MOUSE TRACKER (Yellow glow on black) */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(${spotlightSize}px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />

      {/* Top Subtle Amber Rim Light */}
      <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-10" />

      {/* Card Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

