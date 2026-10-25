import React, { useState } from 'react';

export default function BackgroundVideo({ 
  videoSrc = '/videos/Option_Active_Morning_Colla.mp4',
  fallbackSrc = '/videos/Cinematic_K_corporate_office.mp4',
  opacity = 'opacity-40 sm:opacity-50',
  showAtmosphere = true
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Cinematic Looping HTML5 Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover filter contrast-110 brightness-95 saturate-110 transition-opacity duration-1000 ${
          loaded ? opacity : 'opacity-20'
        }`}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={fallbackSrc} type="video/mp4" />
      </video>

      {/* 80% Radial Dark Mask Vignette for Razor-Sharp Card Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/90 via-[#0B0F19]/80 to-[#030712]/95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#030712_85%)] pointer-events-none" />

      {/* Atmospheric Electric Blue, Cyan & Violet Aura Bleeds */}
      {showAtmosphere && (
        <>
          <div className="absolute top-1/4 -left-20 w-[650px] h-[500px] bg-blue-600/10 blur-[180px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 -right-20 w-[650px] h-[550px] bg-cyan-500/10 blur-[200px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 left-1/3 w-[700px] h-[450px] bg-indigo-600/10 blur-[220px] rounded-full pointer-events-none" />
        </>
      )}

      {/* Micro Matrix Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}

