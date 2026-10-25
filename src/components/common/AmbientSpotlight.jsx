import React, { useEffect, useRef } from 'react';

/**
 * AmbientSpotlight
 * 2026 Trailing Cursor Radial Spotlight
 * Generates an ambient glow that glides smoothly behind glassmorphic surfaces
 * with lerp inertia and subtle violet/amber atmospheric aura.
 */
export default function AmbientSpotlight({
  radius = 650,
  amberAlpha = 0.07,
  violetAlpha = 0.04
}) {
  const spotlightRef = useRef(null);

  useEffect(() => {
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let rafId;

    const handleMouseMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const updatePosition = () => {
      // Lerp for heavy, luxurious fluid trailing
      mouse.x += (target.x - mouse.x) * 0.08;
      mouse.y += (target.y - mouse.y) * 0.08;

      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(${radius}px circle at ${mouse.x}px ${mouse.y}px, rgba(245, 158, 11, ${amberAlpha}), rgba(147, 51, 234, ${violetAlpha}) 40%, transparent 75%)`;
      }

      rafId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [radius, amberAlpha, violetAlpha]);

  return (
    <div
      ref={spotlightRef}
      className="fixed inset-0 pointer-events-none z-0 select-none transition-opacity duration-500"
      style={{
        background: `radial-gradient(${radius}px circle at 50% 50%, rgba(245, 158, 11, ${amberAlpha}), rgba(147, 51, 234, ${violetAlpha}) 40%, transparent 75%)`
      }}
    />
  );
}

