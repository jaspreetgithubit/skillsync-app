import React, { useState, useEffect, useRef } from 'react';
import { FastForward, Sparkles, ChevronDown, RotateCcw } from 'lucide-react';

const TECH_IMAGES = [
  {
    src: '/images/step1_profile.jpg',
    direction: 'left',
    label: '01. AI Vector Profiling'
  },
  {
    src: '/images/step2_project.jpg',
    direction: 'right',
    label: '02. NLP Semantic Matrix'
  },
  {
    src: '/images/step3_nlp.jpg',
    direction: 'left',
    label: '03. Algorithmic Equilibrium'
  },
  {
    src: '/images/usecase_hackathon.jpg',
    direction: 'right',
    label: '04. High-Velocity Arena'
  },
  {
    src: '/images/step4_team.jpg',
    direction: 'center',
    label: '05. Autonomous Squad Assembly'
  }
];

export default function TechDeepDivePortal({ onComplete, onCancel }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState(null);
  const [exitDirection, setExitDirection] = useState(null); // 'left' | 'right'
  const [isZoomingOut, setIsZoomingOut] = useState(false);
  const [headingSpinKey, setHeadingSpinKey] = useState(0);
  const lastScrollTime = useRef(0);
  const touchStartY = useRef(0);

  // Advance to next photo with alternating Left/Right peel
  const goToNext = () => {
    if (isZoomingOut) return;
    if (currentIndex < TECH_IMAGES.length - 1) {
      const dir = currentIndex % 2 === 0 ? 'left' : 'right';
      setExitingIndex(currentIndex);
      setExitDirection(dir);
      setCurrentIndex((prev) => prev + 1);

      setTimeout(() => {
        setExitingIndex(null);
        setExitDirection(null);
      }, 500);
    } else {
      handleFinalZoomOut();
    }
  };

  // Step backward to previous photo
  const goToPrev = () => {
    if (isZoomingOut) return;
    if (currentIndex > 0) {
      const dir = currentIndex % 2 === 0 ? 'right' : 'left';
      setExitingIndex(currentIndex);
      setExitDirection(dir);
      setCurrentIndex((prev) => prev - 1);

      setTimeout(() => {
        setExitingIndex(null);
        setExitDirection(null);
      }, 500);
    }
  };

  // Final zoom out exit to open Sign In page
  const handleFinalZoomOut = () => {
    if (isZoomingOut) return;
    setIsZoomingOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  // Mouse wheel scroll handler
  const handleWheel = (e) => {
    if (isZoomingOut) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 400) return; // Smooth deliberate debounce

    if (e.deltaY > 25) {
      lastScrollTime.current = now;
      goToNext();
    } else if (e.deltaY < -25) {
      lastScrollTime.current = now;
      goToPrev();
    }
  };

  // Touch handlers for mobile / trackpad
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (isZoomingOut) return;
    const diffY = touchStartY.current - e.touches[0].clientY;
    const now = Date.now();
    if (now - lastScrollTime.current < 400) return;

    if (diffY > 35) {
      lastScrollTime.current = now;
      goToNext();
    } else if (diffY < -35) {
      lastScrollTime.current = now;
      goToPrev();
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isZoomingOut) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Escape') {
        if (onCancel) {
          onCancel();
        } else {
          onComplete();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isZoomingOut]);

  const isFinalStep = currentIndex === TECH_IMAGES.length - 1;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#080B12] text-slate-100 flex flex-col justify-between p-3 sm:p-5 overflow-hidden select-none transition-all duration-500 ${
        isZoomingOut ? 'animate-zoom-out-exit' : ''
      }`}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Background Glow Nebulas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[600px] bg-amber-500/12 blur-[260px] rounded-full pointer-events-none" />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-purple-900/18 blur-[220px] rounded-full pointer-events-none" />

      {/* Downward Warp Speed Light Streams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <div className="absolute left-[15%] top-0 w-[1px] h-96 bg-gradient-to-b from-transparent via-amber-400 to-transparent animate-warp-speed" style={{ animationDuration: '0.45s' }} />
        <div className="absolute left-[38%] top-0 w-[1.5px] h-[500px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-warp-speed" style={{ animationDuration: '0.35s', animationDelay: '0.1s' }} />
        <div className="absolute left-[62%] top-0 w-[1.5px] h-[500px] bg-gradient-to-b from-transparent via-amber-300 to-transparent animate-warp-speed" style={{ animationDuration: '0.38s', animationDelay: '0.2s' }} />
        <div className="absolute left-[85%] top-0 w-[1px] h-96 bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-warp-speed" style={{ animationDuration: '0.42s', animationDelay: '0.15s' }} />
      </div>

      {/* Futuristic Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #F59E0B 1px, transparent 0)',
          backgroundSize: '44px 44px'
        }}
      />

      {/* TOP BAR: BRAND + 360 RE-SPIN + INSTANT SKIP */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex items-center justify-between pb-1">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-xl bg-white/[0.05] border border-white/15 flex items-center justify-center shadow-lg">
            <Sparkles className="h-4 w-4 text-[#F59E0B]" />
          </div>
          <span className="text-base font-black tracking-tight text-white">
            SyncSkills<span className="text-[#F59E0B]">.AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Button to Re-trigger 360° Spin */}
          <button
            type="button"
            onClick={() => setHeadingSpinKey((prev) => prev + 1)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs font-mono font-semibold text-amber-300 transition-all cursor-pointer"
            title="Re-spin Heading 360°"
          >
            <RotateCcw className="h-3 w-3 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">360° Spin</span>
          </button>

          {/* Instant Skip Button */}
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-[#F59E0B] hover:text-[#080B12] border border-white/15 hover:border-[#F59E0B] text-xs font-mono font-bold text-slate-200 transition-all cursor-pointer shadow-lg group"
          >
            <span>Skip to Sign In</span>
            <FastForward className="h-3.5 w-3.5 text-[#F59E0B] group-hover:text-[#080B12] transition-colors" />
          </button>
        </div>
      </div>

      {/* ULTRA-BOLD HEADING WITH 360-DEGREE ROTATION */}
      <div
        key={`spin-heading-${headingSpinKey}`}
        className="relative z-30 text-center px-4 max-w-4xl mx-auto my-1 animate-spin-360"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F59E0B] text-[11px] font-mono font-extrabold uppercase tracking-widest mb-1.5">
          <Sparkles className="h-3 w-3 animate-pulse" />
          <span>LAYER 0{currentIndex + 1} OF 05 // {TECH_IMAGES[currentIndex].direction.toUpperCase()} SWEEP</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none drop-shadow-2xl">
          SYNCSKILLS.AI
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 font-extrabold text-lg sm:text-2xl md:text-3xl mt-1 tracking-wide">
            THE FUTURE OF AUTONOMOUS SQUAD FORMATION
          </span>
        </h1>

        {isFinalStep ? (
          <p
            onClick={handleFinalZoomOut}
            className="text-amber-300 text-xs sm:text-sm font-mono font-bold flex items-center justify-center space-x-1.5 cursor-pointer hover:text-white transition-colors animate-pulse mt-1"
          >
            <span>Final Layer Reached: Scroll down or click to Zoom Out & Open Sign Page</span>
            <ChevronDown className="h-4 w-4 text-[#F59E0B] animate-bounce" />
          </p>
        ) : (
          <p className="text-slate-400 text-xs sm:text-sm font-mono flex items-center justify-center space-x-2 mt-1">
            <span>Scroll down to peel images: Left ⇄ Right</span>
            <ChevronDown className="h-4 w-4 text-[#F59E0B] animate-bounce" />
          </p>
        )}
      </div>

      {/* MAIN 3D STAGE: LARGE IMMERSIVE PHOTOS PEELING ALTERNATELY LEFT & RIGHT */}
      <div className="relative z-20 my-auto w-full max-w-6xl mx-auto flex items-center justify-center perspective-deep py-2">

        {/* EXITED PHOTO (Sweeping Left or Right in 3D) */}
        {exitingIndex !== null && (
          <div
            key={`exiting-${exitingIndex}`}
            className={`absolute w-[92vw] max-w-5xl h-[52vh] sm:h-[62vh] md:h-[66vh] rounded-3xl overflow-hidden border border-white/20 bg-black shadow-2xl pointer-events-none z-10 ${
              exitDirection === 'left' ? 'animate-exit-left' : 'animate-exit-right'
            }`}
          >
            <img
              src={TECH_IMAGES[exitingIndex].src}
              alt="Exiting layer"
              className="w-full h-full object-contain sm:object-cover filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
          </div>
        )}

        {/* ACTIVE MAIN PHOTO (LARGE & FULL RESOLUTION) */}
        <div
          key={`active-${currentIndex}`}
          onClick={isFinalStep ? handleFinalZoomOut : goToNext}
          className="relative w-[94vw] max-w-5xl h-[54vh] sm:h-[64vh] md:h-[68vh] rounded-3xl overflow-hidden border border-amber-500/50 bg-[#05070D] shadow-[0_30px_90px_rgba(245,158,11,0.35)] cursor-pointer transition-all duration-300 hover:scale-[1.01] animate-enter-center group z-20"
        >
          {/* Full High-Resolution Tech Image */}
          <img
            src={TECH_IMAGES[currentIndex].src}
            alt={TECH_IMAGES[currentIndex].label}
            className="w-full h-full object-contain sm:object-cover object-center filter contrast-110 brightness-105 transition-transform duration-500 group-hover:scale-102"
          />

          {/* Cinematic Shading Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />

          {/* Holographic Laser Scanner */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="w-full h-full bg-[linear-gradient(to_bottom,transparent_0%,rgba(245,158,11,0.4)_50%,transparent_100%)] animate-scan-laser" />
          </div>

          {/* Glowing Top & Bottom Laser Borders */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent shadow-[0_0_18px_#F59E0B]" />
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_18px_#F59E0B]" />

          {/* Left / Right Peel Indicator Badge */}
          <div className="absolute top-3.5 left-4 pointer-events-none">
            <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-white flex items-center space-x-2 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B] animate-ping" />
              <span>{TECH_IMAGES[currentIndex].label}</span>
              <span className="text-[#F59E0B] uppercase">({TECH_IMAGES[currentIndex].direction.toUpperCase()})</span>
            </span>
          </div>

          {/* Bottom Action Prompt */}
          <div className="absolute bottom-3.5 right-4 pointer-events-none">
            <span className="px-3.5 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-500/40 text-xs font-mono text-amber-300 font-bold flex items-center space-x-2 shadow-xl">
              <span>
                {isFinalStep
                  ? 'Final Stage: Click or Scroll to Zoom Out ➔'
                  : `Next Photo peels to ${TECH_IMAGES[(currentIndex + 1) % TECH_IMAGES.length].direction.toUpperCase()} ▾`}
              </span>
            </span>
          </div>
        </div>

      </div>

      {/* BOTTOM: 5-DOT PROGRESSION CONTROLS */}
      <div className="relative z-30 max-w-md mx-auto w-full flex flex-col items-center space-y-2 pb-2">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {TECH_IMAGES.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const dir = idx > currentIndex ? 'left' : 'right';
                setExitingIndex(currentIndex);
                setExitDirection(dir);
                setCurrentIndex(idx);
                setTimeout(() => {
                  setExitingIndex(null);
                  setExitDirection(null);
                }, 500);
              }}
              className={`h-2.5 transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center ${
                idx === currentIndex
                  ? 'w-12 bg-[#F59E0B] shadow-[0_0_14px_#F59E0B]'
                  : idx < currentIndex
                    ? 'w-5 bg-amber-500/50 hover:bg-amber-500/80'
                    : 'w-3.5 bg-white/20 hover:bg-white/40'
              }`}
              title={`Jump to Layer 0${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Button on Final Step */}
        {isFinalStep && (
          <button
            type="button"
            onClick={handleFinalZoomOut}
            className="px-6 py-2 rounded-xl btn-amber-gold text-xs font-mono font-extrabold uppercase tracking-wider shadow-2xl shadow-amber-500/40 cursor-pointer animate-pulse hover:scale-105 transition-transform"
          >
            Zoom Out & Enter Sign In →
          </button>
        )}
      </div>
    </div>
  );
}
