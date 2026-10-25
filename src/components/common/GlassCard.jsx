import React, { useRef, useState } from 'react';

export default function GlassCard({
  children,
  className = '',
  enableTilt = true,
  enableSpotlight = true,
  glowColor = 'rgba(245, 158, 11, 0.14)', // Warm Amber Gold
  onClick = null,
  ...props
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5.5; // max 5.5 deg
      const rotateY = ((x - centerX) / centerX) * 5.5;  // max 5.5 deg
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`,
        transition: 'transform 0.1s ease-out'
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (enableTilt) {
      setTiltStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        ...tiltStyle,
        transformStyle: 'preserve-3d'
      }}
      className={`relative rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-[#0B0F19]/80 border border-white/[0.08] shadow-[0_15px_35px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-amber-500/50 hover:shadow-[0_20px_45px_rgba(245,158,11,0.18)]' : ''
      } ${className}`}
      {...props}
    >
      {/* Dynamic Radial Spotlight Glow on Mouse Movement */}
      {enableSpotlight && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100 z-0"
          style={{
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 45%)`
          }}
        />
      )}

      {/* Top Subtle Rim Light in Warm Amber */}
      <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none z-10" />

      {/* Card Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
