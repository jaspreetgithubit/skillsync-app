import React from 'react';

/**
 * BorderBeam Component
 * Tracing laser beam border effect (Yellow/Amber glow on black)
 * Wraps around rounded cards to provide an ultra-modern cybernetic glow.
 */
export default function BorderBeam({
  className = '',
  duration = 8,
  colorFrom = '#F59E0B', // Warm Amber Gold
  colorTo = 'transparent',
  borderWidth = 1.5,
  glow = true
}) {
  return (
    <div 
      className={`pointer-events-none absolute -inset-[${borderWidth}px] rounded-[inherit] overflow-hidden z-0 ${className}`}
      style={{
        padding: `${borderWidth}px`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
      }}
    >
      <div 
        className="absolute inset-[-150%] animate-conic-rotate"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, ${colorTo} 0deg, ${colorTo} 260deg, ${colorFrom} 320deg, #FCD34D 350deg, ${colorTo} 360deg)`,
          animationDuration: `${duration}s`,
          filter: glow ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.8))' : 'none'
        }}
      />
    </div>
  );
}

