import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  User,
  Building2,
  ShieldCheck,
  BrainCircuit,
  Brain,
  Check,
  Cpu,
  Network,
  Users,
  Layers,
  Zap,
  CheckCircle2,
  Flame
} from 'lucide-react';

const TECH_PREVIEWS = [
  {
    title: 'AI Vector Profiling & AST Code Parsing',
    tag: 'Phase 01 // 768-D Biometric & Git Analysis',
    image: '/images/step1_profile.jpg',
    metric: '100% Bias Mitigated'
  },
  {
    title: 'NLP Semantic Requirement Matrix',
    tag: 'Phase 02 // Stack & Framework Extraction',
    image: '/images/step2_project.jpg',
    metric: '18ms Heuristic Latency'
  },
  {
    title: 'Mathematical Equilibrium Matching',
    tag: 'Phase 03 // Hungarian Algorithmic Core',
    image: '/images/step3_nlp.jpg',
    metric: '98.4% Pairing Accuracy'
  },
  {
    title: 'High-Velocity Hackathon Arena',
    tag: 'Phase 04 // 60s Cross-Functional Matching',
    image: '/images/usecase_hackathon.jpg',
    metric: '4/4 Roles Covered'
  },
  {
    title: 'Autonomous AI Squad Finalization',
    tag: 'Phase 05 // Zero Skill Mismatch Guarantee',
    image: '/images/step4_team.jpg',
    metric: 'Ready to Deploy'
  }
];

export default function TeamMatchAuth({ onAuthenticated, onBackToHome, initialMode = 'signin', onReplayPortal }) {
  // Mode: 'signin' | 'signup'
  const [mode, setMode] = useState(initialMode || 'signin');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTechIndex, setActiveTechIndex] = useState(0);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // Form State
  const [signInData, setSignInData] = useState({
    email: 'alex.chen@university.edu',
    password: '••••••••••••',
    rememberMe: true,
  });

  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Button Loading Micro-Sequence State
  // null | 'authenticating' | 'ai_verify' | 'welcome'
  const [signInStage, setSignInStage] = useState(null);
  // null | 'creating_profile' | 'setting_ai' | 'welcome'
  const [signUpStage, setSignUpStage] = useState(null);

  // Mouse tilt state for 3D card interaction
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef(null);
  const canvasRef = useRef(null);

  // Switch between Sign In and Sign Up with smooth cinematic morph
  const switchMode = (newMode) => {
    if (mode === newMode || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setMode(newMode);
      setIsTransitioning(false);
    }, 320);
  };

  // Cursor tracking for canvas light and 3D card tilt
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMousePos({ x: clientX, y: clientY });

      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        const diffX = (clientX - cardCenterX) / (rect.width / 2);
        const diffY = (clientY - cardCenterY) / (rect.height / 2);

        // Clamp rotation between -6deg and 6deg
        const rotY = Math.max(-6, Math.min(6, diffX * 6));
        const rotX = Math.max(-6, Math.min(6, -diffY * 6));
        setCardTilt({ rotateX: rotX, rotateY: rotY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Interactive 4K Canvas Particle Constellation Harmonized with Landing Page Palette
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Amber-Gold (#F59E0B) and Violet (#9333EA) particle nodes
    const particleCount = window.innerWidth < 768 ? 35 : 75;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      baseColor: Math.random() > 0.4 ? 'rgba(245, 158, 11,' : 'rgba(147, 51, 234,',
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect particles within proximity
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Move
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p1.baseColor} ${p1.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p1.baseColor.includes('245, 158') ? '#F59E0B' : '#9333EA';
        ctx.fill();

        // Check distance to mouse for soft magnetic glow
        const dxMouse = mousePos.x - p1.x;
        const dyMouse = mousePos.y - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 140) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.25 * (1 - distMouse / 140)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Connect with nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.16 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.75;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  // Handle Sign In Submit with multi-stage animation sequence
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (signInStage) return;

    // Stage 1: Authenticating...
    setSignInStage('authenticating');

    // Stage 2: AI Verification (after 750ms)
    setTimeout(() => {
      setSignInStage('ai_verify');
    }, 800);

    // Stage 3: Welcome Back (after 1600ms)
    setTimeout(() => {
      setSignInStage('welcome');
    }, 1650);

    // Stage 4: Enter Dashboard (after 2300ms)
    setTimeout(() => {
      if (onAuthenticated) {
        onAuthenticated({
          name: 'Alex Chen',
          email: signInData.email,
          role: 'Full Stack & AI Engineer',
          mode: 'signin'
        });
      }
    }, 2350);
  };

  // Handle Sign Up Submit with multi-stage animation sequence
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (signUpStage) return;

    // Stage 1: Creating Profile...
    setSignUpStage('creating_profile');

    // Stage 2: Setting Up AI Profile (after 850ms)
    setTimeout(() => {
      setSignUpStage('setting_ai');
    }, 850);

    // Stage 3: Welcome to SkillSync.AI (after 1750ms)
    setTimeout(() => {
      setSignUpStage('welcome');
    }, 1800);

    // Stage 4: Enter Dashboard (after 2450ms)
    setTimeout(() => {
      if (onAuthenticated) {
        onAuthenticated({
          name: signUpData.fullName || 'New Engineer',
          email: signUpData.email || 'student@university.edu',
          organization: signUpData.organization || 'MIT / Stanford Innovation Lab',
          role: 'AI / Full Stack Lead',
          mode: 'signup'
        });
      }
    }, 2500);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#080B12] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-x-hidden selection:bg-[#F59E0B] selection:text-[#080B12]">

      {/* Top Left: Return to Landing Page Button (Harmonized with Landing Page Navbar styling) */}
      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="fixed top-5 left-4 sm:left-8 z-50 px-4 py-2.5 rounded-2xl bg-[#080B12]/85 hover:bg-[#0D121E] border border-white/15 hover:border-[#F59E0B]/60 text-xs font-mono font-bold text-slate-200 hover:text-white flex items-center space-x-2 backdrop-blur-2xl transition-all cursor-pointer shadow-2xl hover:scale-[1.02] group"
        >
          <ArrowLeft className="h-4 w-4 text-[#F59E0B] group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Home</span>
        </button>
      )}

      {/* =========================================================================
          BACKGROUND FX: CANVAS PARTICLES + AMBER/PURPLE NEBULA (MATCHING LANDING HERO)
          ========================================================================= */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-80"
      />

      {/* Soft Amber & Violet Ambient Radial Bleeds (Harmonized with Landing Video Ambience) */}
      <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-900/15 blur-[180px] rounded-full pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[650px] h-[650px] bg-amber-500/10 blur-[190px] rounded-full pointer-events-none" />

      {/* Cursor Spotlight Glow Following Mouse (Amber Gold) */}
      <div
        className="fixed pointer-events-none z-0 w-[500px] h-[500px] rounded-full opacity-35 blur-[120px] transition-all duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(147,51,234,0.1) 50%, transparent 70%)',
          left: `${mousePos.x - 250}px`,
          top: `${mousePos.y - 250}px`,
        }}
      />

      {/* Micro Grid Texture Matching Landing Page */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* =========================================================================
          MAIN AUTHENTICATION CONTAINER (TWO-COLUMN DESKTOP / PRECISE LEFT ALIGNMENT)
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center pt-8 sm:pt-0">

        {/* =======================================================================
            LEFT COLUMN: AI VISUAL EXPERIENCE (EXACT LANDING COLOR & TYPOGRAPHY)
            ======================================================================= */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8 text-left">

          {/* Brand Identity Header Matching Navbar Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center">
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#F59E0B] shadow-[0_0_10px_#F59E0B] animate-pulse" />
              <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center shadow-lg group-hover:border-[#F59E0B]/60 transition-colors">
                <Sparkles className="h-5 w-5 text-[#F59E0B] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  SyncSkills
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#F59E0B]">
                  .AI
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5 font-semibold">
                AI Team Formation & Skill Matching
              </span>
            </div>
          </div>

          {/* Dynamic Headline & Copy (Matching Hero.jsx Font & Gradients) */}
          <div className="space-y-4">

            {/* Top Badge with Pulsing Beacon */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-amber-500/30 text-xs font-mono text-[#F59E0B] shadow-lg shadow-amber-500/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]" />
              </span>
              <span className="tracking-wide uppercase font-bold text-[11px]">
                {mode === 'signin'
                  ? '768-D Vector Equilibrium'
                  : 'Student Capstone & Hackathon Network'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
              {mode === 'signin' ? (
                <>
                  Find the right people. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-[#F59E0B]">
                    Build better teams.
                  </span>
                </>
              ) : (
                <>
                  Create your profile. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-300 to-[#F59E0B]">
                    Discover your possibilities.
                  </span>
                </>
              )}
            </h1>

            {/* Description Body Text */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
              {mode === 'signin'
                ? 'AI-powered skill matching and intelligent team formation for your projects. Balance skillsets, eliminate social friction, and pair complementary engineers.'
                : 'Join the verified student and developer ecosystem. Build your high-dimensional skill profile and get matched with zero skill mismatch.'}
            </p>
          </div>

          {/* Dynamic Animated AI Pipeline Flow (People → Skills → AI Matching → Team) */}
          <div className="p-4 rounded-2xl bg-[#080B12]/75 border border-white/10 backdrop-blur-xl space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{mode === 'signin' ? 'Intelligent Matching Flow' : 'Profile Synthesis Flow'}</span>
              <span className="text-[#F59E0B] font-bold">NLP Heuristic</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono font-bold text-white overflow-x-auto pb-1 gap-2">
              {mode === 'signin' ? (
                <>
                  <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-200 shrink-0">
                    People
                  </span>
                  <span className="text-[#F59E0B] font-bold">→</span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#F59E0B] shrink-0">
                    Skills
                  </span>
                  <span className="text-[#F59E0B] font-bold">→</span>
                  <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 shrink-0">
                    AI Matching
                  </span>
                  <span className="text-[#F59E0B] font-bold">→</span>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                    Team
                  </span>
                </>
              ) : (
                <>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#F59E0B] shrink-0">
                    Your Skills
                  </span>
                  <span className="text-[#F59E0B] font-bold">→</span>
                  <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 shrink-0">
                    Your Profile
                  </span>
                  <span className="text-[#F59E0B] font-bold">→</span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-200 shrink-0">
                    AI Matching
                  </span>
                  <span className="text-[#F59E0B] font-bold">→</span>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                    Opportunities
                  </span>
                </>
              )}
            </div>
          </div>

                    {/* Interactive 3D Tech Photos Deck (Deep Dive Viewport) */}
          <div className="rounded-2xl bg-[#080B12]/90 border border-white/10 p-3.5 backdrop-blur-xl space-y-3 shadow-xl">
            {/* Top Stage Header: Title + Replay Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B] animate-ping" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Tech Deep Dive Matrix ({activeTechIndex + 1}/5)
                </span>
              </div>

              {onReplayPortal && (
                <button
                  type="button"
                  onClick={onReplayPortal}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] font-mono font-bold text-[#F59E0B] flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Replay 3D Dive</span>
                </button>
              )}
            </div>

            {/* Featured 3D Tech Photo Viewport */}
            <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-lg group">
              <img
                src={TECH_PREVIEWS[activeTechIndex].image}
                alt={TECH_PREVIEWS[activeTechIndex].title}
                className="w-full h-full object-cover object-center filter contrast-110 brightness-105 transition-transform duration-500 group-hover:scale-105"
              />

              {/* Shading Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

              {/* Laser Scan Line */}
              <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="w-full h-full bg-[linear-gradient(to_bottom,transparent_0%,rgba(245,158,11,0.35)_50%,transparent_100%)] animate-scan-laser" />
              </div>

              {/* Overlay Badges */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                <span className="px-2 py-0.5 rounded-md bg-black/70 border border-white/20 text-[9px] font-mono font-bold text-amber-300">
                  {TECH_PREVIEWS[activeTechIndex].tag}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-[9px] font-mono text-[#F59E0B] font-extrabold">
                  {TECH_PREVIEWS[activeTechIndex].metric}
                </span>
              </div>

              {/* Bottom Title */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none text-left">
                <div className="text-xs font-bold text-white drop-shadow-md">
                  {TECH_PREVIEWS[activeTechIndex].title}
                </div>
              </div>
            </div>

            {/* 5-Step Tab Selector */}
            <div className="grid grid-cols-5 gap-1.5 font-mono text-[10px]">
              {TECH_PREVIEWS.map((tp, pIdx) => {
                const isSelected = pIdx === activeTechIndex;
                return (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setActiveTechIndex(pIdx)}
                    className={`py-1.5 px-1 rounded-lg transition-all text-center truncate cursor-pointer font-bold ${
                      isSelected
                        ? 'bg-[#F59E0B] text-[#080B12] shadow-md shadow-amber-500/30'
                        : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    0{pIdx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Micro Security & Precision HUD Badges */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-1.5 text-amber-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Zero-Bias Pairing Protocol</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Flame className="h-3.5 w-3.5 text-[#F59E0B]" />
              <span>18ms Matching Latency</span>
            </div>
          </div>

        </div>

        {/* =======================================================================
            RIGHT COLUMN: AUTHENTICATION CARD (LANDING COLOR PALETTE & 3D TILT)
            ======================================================================= */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto" style={{ perspective: '1200px' }}>

          <div
            ref={cardRef}
            className={`rounded-3xl p-6 sm:p-9 relative overflow-hidden bg-[#080B12]/85 backdrop-blur-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-300 ${
              isTransitioning ? 'opacity-40 scale-95 blur-xs' : 'opacity-100 scale-100'
            }`}
            style={{
              transform: `rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`,
            }}
          >
            {/* Signature Top Amber Laser Beam (Matching Landing Page Cards) */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent shadow-[0_0_15px_#F59E0B]" />

            {/* Warm Ambient Internal Light Ray */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* ===================================================================
                VIEW A: SIGN IN CARD
                =================================================================== */}
            {mode === 'signin' && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200 text-left">

                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Welcome Back
                    </h2>
                    <div className="h-2 w-2 rounded-full bg-[#F59E0B] shadow-[0_0_10px_#F59E0B] animate-ping" />
                  </div>
                  <p className="text-xs text-slate-400 font-normal">
                    Sign in to continue to SyncSkills.AI
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignInSubmit} className="space-y-4">

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-300 font-medium">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-[#F59E0B] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                      <input
                        type="email"
                        required
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        placeholder="developer@university.edu"
                        className="w-full bg-white/[0.04] border border-white/15 focus:border-[#F59E0B] focus:bg-white/[0.07] rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/50 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-300 font-medium">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-[#F59E0B] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full bg-white/[0.04] border border-white/15 focus:border-[#F59E0B] focus:bg-white/[0.07] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/50 transition-all font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Options: Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center space-x-2 text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={signInData.rememberMe}
                        onChange={(e) => setSignInData({ ...signInData, rememberMe: e.target.checked })}
                        className="rounded border-white/20 bg-white/5 text-[#F59E0B] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#F59E0B]"
                      />
                      <span className="font-mono text-[11px]">Remember Me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => alert("Password reset link has been dispatched to your institutional email.")}
                      className="text-[11px] font-mono text-[#F59E0B] hover:text-amber-300 transition-colors cursor-pointer hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Primary Submit Button: Harmonized btn-amber-gold with Multi-Stage Loading */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!!signInStage}
                      className="w-full py-3.5 rounded-xl btn-amber-gold text-xs uppercase tracking-wider font-extrabold flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-90 transition-all shadow-xl shadow-amber-500/25 hover:scale-[1.01]"
                    >
                      {signInStage === 'authenticating' && (
                        <>
                          <div className="h-4 w-4 border-2 border-[#080B12] border-t-transparent rounded-full animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      )}

                      {signInStage === 'ai_verify' && (
                        <>
                          <Brain className="h-4 w-4 text-[#080B12] animate-pulse" />
                          <span>AI Verification</span>
                        </>
                      )}

                      {signInStage === 'welcome' && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-[#080B12] animate-bounce" />
                          <span>Welcome Back</span>
                        </>
                      )}

                      {!signInStage && (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-white/10 w-full" />
                  <span className="bg-[#080B12] px-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest relative z-10">
                    OR
                  </span>
                </div>

                {/* Secondary Button: Continue with Google */}
                <button
                  type="button"
                  onClick={() => {
                    handleSignInSubmit({ preventDefault: () => {} });
                  }}
                  className="w-full py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-200 flex items-center justify-center space-x-3 transition-all cursor-pointer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Switch to Sign Up */}
                <div className="pt-2 text-center text-xs text-slate-400">
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="font-bold text-[#F59E0B] hover:text-amber-300 transition-colors cursor-pointer hover:underline ml-1"
                  >
                    Create Account
                  </button>
                </div>

              </div>
            )}

            {/* ===================================================================
                VIEW B: SIGN UP CARD
                =================================================================== */}
            {mode === 'signup' && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200 text-left">

                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Create Your Account
                    </h2>
                    <div className="h-2 w-2 rounded-full bg-[#F59E0B] shadow-[0_0_10px_#F59E0B] animate-ping" />
                  </div>
                  <p className="text-xs text-slate-400 font-normal">
                    Join SyncSkills.AI and find the right team for your next project.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignUpSubmit} className="space-y-3">

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-slate-300 font-medium">
                      Full Name *
                    </label>
                    <div className="relative group">
                      <User className="h-4 w-4 text-slate-400 group-focus-within:text-[#F59E0B] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                      <input
                        type="text"
                        required
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        placeholder="Dr. Maya Patel"
                        className="w-full bg-white/[0.04] border border-white/15 focus:border-[#F59E0B] focus:bg-white/[0.07] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/50 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-slate-300 font-medium">
                      Email Address *
                    </label>
                    <div className="relative group">
                      <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-[#F59E0B] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                      <input
                        type="email"
                        required
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        placeholder="maya.patel@university.edu"
                        className="w-full bg-white/[0.04] border border-white/15 focus:border-[#F59E0B] focus:bg-white/[0.07] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/50 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Passwords (Side by side on sm) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

                    {/* Password */}
                    <div className="space-y-1">
                      <label className="block text-xs font-mono text-slate-300 font-medium">
                        Password *
                      </label>
                      <div className="relative group">
                        <Lock className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-[#F59E0B] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full bg-white/[0.04] border border-white/15 focus:border-[#F59E0B] focus:bg-white/[0.07] rounded-xl pl-8 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/50 transition-all font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <label className="block text-xs font-mono text-slate-300 font-medium">
                        Confirm Password *
                      </label>
                      <div className="relative group">
                        <Lock className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-[#F59E0B] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full bg-white/[0.04] border border-white/15 focus:border-[#F59E0B] focus:bg-white/[0.07] rounded-xl pl-8 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/50 transition-all font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Optional: College / Organization */}
                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-slate-300 flex items-center justify-between font-medium">
                      <span>College / Organization</span>
                      <span className="text-[10px] text-slate-500">Optional</span>
                    </label>
                    <div className="relative group">
                      <Building2 className="h-4 w-4 text-slate-400 group-focus-within:text-[#F59E0B] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
                      <input
                        type="text"
                        value={signUpData.organization}
                        onChange={(e) => setSignUpData({ ...signUpData, organization: e.target.value })}
                        placeholder="Stanford AI Lab / MIT / IIT Delhi"
                        className="w-full bg-white/[0.04] border border-white/15 focus:border-[#F59E0B] focus:bg-white/[0.07] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/50 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Checkbox: Terms & Privacy */}
                  <div className="pt-1">
                    <label className="flex items-start space-x-2 text-xs text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required
                        checked={signUpData.agreeTerms}
                        onChange={(e) => setSignUpData({ ...signUpData, agreeTerms: e.target.checked })}
                        className="mt-0.5 rounded border-white/20 bg-white/5 text-[#F59E0B] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#F59E0B]"
                      />
                      <span className="text-[11px] leading-relaxed text-slate-400">
                        I agree to the <a href="#" className="text-[#F59E0B] hover:underline">Terms of Service</a> & <a href="#" className="text-[#F59E0B] hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                  </div>

                  {/* Primary Submit Button: btn-amber-gold with Multi-Stage Loading */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={!!signUpStage}
                      className="w-full py-3.5 rounded-xl btn-amber-gold text-xs uppercase tracking-wider font-extrabold flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-90 transition-all shadow-xl shadow-amber-500/25 hover:scale-[1.01]"
                    >
                      {signUpStage === 'creating_profile' && (
                        <>
                          <div className="h-4 w-4 border-2 border-[#080B12] border-t-transparent rounded-full animate-spin" />
                          <span>Creating Profile...</span>
                        </>
                      )}

                      {signUpStage === 'setting_ai' && (
                        <>
                          <Brain className="h-4 w-4 text-[#080B12] animate-pulse" />
                          <span>Setting Up AI Profile</span>
                        </>
                      )}

                      {signUpStage === 'welcome' && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-[#080B12] animate-bounce" />
                          <span>Welcome to SyncSkills.AI</span>
                        </>
                      )}

                      {!signUpStage && (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-white/10 w-full" />
                  <span className="bg-[#080B12] px-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest relative z-10">
                    OR
                  </span>
                </div>

                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={() => {
                    handleSignUpSubmit({ preventDefault: () => {} });
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-200 flex items-center justify-center space-x-3 transition-all cursor-pointer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Switch to Sign In */}
                <div className="pt-1 text-center text-xs text-slate-400">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className="font-bold text-[#F59E0B] hover:text-amber-300 transition-colors cursor-pointer hover:underline ml-1"
                  >
                    Sign In
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
