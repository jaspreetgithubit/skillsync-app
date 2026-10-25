import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Users, 
  Zap, 
  CheckCircle2, 
  Layers, 
  BrainCircuit, 
  FolderPlus, 
  UserCheck, 
  Target, 
  ChevronRight,
  ShieldCheck,
  Flame,
  Award
} from 'lucide-react';

export default function ChoosePurposePage({ onSelectPurpose, onBackToHome }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null); // 'join-project' | 'create-project'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Auto-play blocked, waiting for user interaction:', err);
      });
    }
  }, []);

  const handleCardClick = (purposeId) => {
    if (isTransitioning) return;
    setSelectedCard(purposeId);
    setIsTransitioning(true);

    setTimeout(() => {
      onSelectPurpose(purposeId);
    }, 450);
  };

  return (
    <div className="relative min-h-screen bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] flex flex-col justify-between overflow-x-hidden">
      
      {/* =========================================================================
          BACKGROUND VIDEO: Option_Active_Morning_Colla.mp4
          Super-bright, clear & vibrant with luminous soft vignette
          ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          ref={videoRef}
          key="purpose-bg-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover filter contrast-110 brightness-125 saturate-110 opacity-95 sm:opacity-100"
        >
          <source src="/videos/Option_Active_Morning_Colla.mp4" type="video/mp4" />
          <source src="/videos/Cinematic_K_corporate_office.mp4" type="video/mp4" />
        </video>

        {/* Luminous Framing: Leaves the center clear & bright while framing top & bottom gently */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B12]/60 via-transparent to-[#080B12]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(8,11,18,0.65)_100%)] pointer-events-none" />

        {/* Ambient Warm Amber & Soft Violet Bleeds Harmonized with the Landing Page Palette */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-amber-500/10 blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-[650px] h-[400px] bg-purple-900/15 blur-[220px] rounded-full pointer-events-none" />

        {/* Micro Grid Texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* =========================================================================
          TOP NAVBAR: BRAND LOGO + BACK TO HOME
          ========================================================================= */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 flex items-center justify-between">
        <div className="flex items-center space-x-3 bg-[#080B12]/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 shadow-xl">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-black/50">
            <Sparkles className="h-4 w-4 text-[#F59E0B]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="text-lg font-black tracking-tight text-white">
                SyncSkills
              </span>
              <span className="text-lg font-black tracking-tight text-[#F59E0B]">
                .AI
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-slate-300 uppercase -mt-0.5 font-medium">
              Autonomous Team Formation
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#080B12]/80 hover:bg-[#080B12] backdrop-blur-md border border-white/15 hover:border-amber-500/40 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all cursor-pointer shadow-xl group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform text-[#F59E0B]" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* =========================================================================
          MAIN EDITORIAL CONTENT: HEADLINE + PINTEREST-INSPIRED PURPOSE PINS
          ========================================================================= */}
      <main className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 flex flex-col justify-center">
        
        {/* Editorial Kinetic Title with High-Contrast Frosted Pills */}
        <div className="text-center space-y-3.5 mb-8 sm:mb-10 max-w-2xl mx-auto">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#080B12]/85 border border-amber-500/40 text-[#F59E0B] text-xs font-mono font-bold uppercase tracking-widest shadow-2xl shadow-black/60 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-[#F59E0B] animate-pulse" />
            <span>AI Purpose Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            Why are you{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-[#F59E0B] to-amber-500 drop-shadow-[0_0_35px_rgba(245,158,11,0.6)]">
              here?
            </span>
          </h1>

          <div className="inline-block px-5 py-2 rounded-2xl bg-[#080B12]/75 backdrop-blur-md border border-white/15 shadow-xl">
            <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Choose how you want to use <strong className="text-[#F59E0B] font-bold">TeamMatch AI</strong>.
            </p>
          </div>

        </div>

        {/* 2 Grand Pinterest-Style Interactive Purpose Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto w-full items-stretch">
          
          {/* =====================================================================
              CARD 1: "I WANT TO JOIN A PROJECT"
              Pinterest-Inspired Pin with Image Header & Visual Storytelling
              ===================================================================== */}
          <div
            onClick={() => handleCardClick('join-project')}
            className={`group relative rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-2xl flex flex-col justify-between ${
              selectedCard === 'join-project'
                ? 'scale-[1.02] border-[#F59E0B] shadow-[0_25px_60px_rgba(245,158,11,0.4)] ring-2 ring-[#F59E0B]/60'
                : selectedCard === 'create-project'
                  ? 'opacity-30 scale-95 filter blur-xs'
                  : 'bg-[#0D121E]/92 border-white/15 hover:border-[#F59E0B]/60 hover:bg-[#101626] hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:shadow-[0_25px_60px_rgba(245,158,11,0.22)]'
            }`}
          >
            {/* Top Visual Image Header (Pinterest Pin Style - High Clarity) */}
            <div className="relative h-52 sm:h-56 w-full overflow-hidden border-b border-white/10">
              <img 
                src="/images/usecase_hackathon.jpg" 
                alt="Join a Project" 
                className="w-full h-full object-cover filter contrast-105 brightness-115 saturate-110 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Clean bottom-only blend so the photo stays 100% visible & bright */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D121E] via-transparent to-transparent pointer-events-none" />

              {/* Floating Pill Badges on Image */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[#F59E0B] text-[11px] font-mono font-bold uppercase tracking-wider shadow-xl">
                  <UserCheck className="h-3 w-3 text-[#F59E0B]" />
                  <span>Talent & Squad Member</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-slate-200 shadow-md">
                  01 // JOIN
                </span>
              </div>

              {/* Live Metric Overlay */}
              <div className="absolute bottom-3 left-3.5 flex items-center space-x-1.5 text-xs font-mono text-emerald-400 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/40 shadow-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>1,200+ Student & Dev Profiles</span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:text-amber-200 transition-colors">
                  I want to join a project
                </h2>

                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mt-2 font-normal">
                  Find the right project and team based on your skills.
                </p>

                {/* Visual Pipeline: People → Skills → AI → Team */}
                <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 group-hover:border-amber-500/30 transition-colors">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#F59E0B] font-bold mb-2 flex items-center justify-between">
                    <span>Talent Matching Flow</span>
                    <span className="text-slate-400 font-normal">Hungarian Algo</span>
                  </div>

                  <div className="flex items-center justify-between text-center gap-1 text-[11px] font-mono">
                    <div className="flex-1 py-1 px-1 rounded-lg bg-white/[0.04] border border-white/10">
                      <User className="h-3.5 w-3.5 text-[#F59E0B] mx-auto mb-0.5" />
                      <div className="font-bold text-white text-[10px]">People</div>
                    </div>
                    <ChevronRight className="h-3 w-3 text-amber-500/60 shrink-0" />
                    <div className="flex-1 py-1 px-1 rounded-lg bg-white/[0.04] border border-white/10">
                      <Zap className="h-3.5 w-3.5 text-amber-400 mx-auto mb-0.5" />
                      <div className="font-bold text-white text-[10px]">Skills</div>
                    </div>
                    <ChevronRight className="h-3 w-3 text-amber-500/60 shrink-0" />
                    <div className="flex-1 py-1 px-1 rounded-lg bg-white/[0.04] border border-white/10">
                      <BrainCircuit className="h-3.5 w-3.5 text-[#F59E0B] mx-auto mb-0.5" />
                      <div className="font-bold text-white text-[10px]">AI</div>
                    </div>
                    <ChevronRight className="h-3 w-3 text-amber-500/60 shrink-0" />
                    <div className="flex-1 py-1 px-1 rounded-lg bg-amber-500/20 border border-amber-500/40">
                      <Users className="h-3.5 w-3.5 text-amber-300 mx-auto mb-0.5" />
                      <div className="font-bold text-amber-200 text-[10px]">Team</div>
                    </div>
                  </div>
                </div>

                {/* Value Checkpoints */}
                <ul className="mt-4 space-y-1.5 text-xs text-slate-200">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />
                    <span>Showcase skills, experience & past projects</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />
                    <span>AI pairs you with complementary peers</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />
                    <span>Interactive skill level selection</span>
                  </li>
                </ul>
              </div>

              {/* Bottom Action CTA Button */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-300">
                  Next: Sign In & Add Skills
                </span>

                <div className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl btn-amber-gold text-xs uppercase tracking-wider font-extrabold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <span>Find Squad & Join</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              CARD 2: "I WANT TO CREATE A PROJECT"
              Pinterest-Inspired Pin with Image Header & Visual Storytelling
              ===================================================================== */}
          <div
            onClick={() => handleCardClick('create-project')}
            className={`group relative rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-2xl flex flex-col justify-between ${
              selectedCard === 'create-project'
                ? 'scale-[1.02] border-[#F59E0B] shadow-[0_25px_60px_rgba(245,158,11,0.4)] ring-2 ring-[#F59E0B]/60'
                : selectedCard === 'join-project'
                  ? 'opacity-30 scale-95 filter blur-xs'
                  : 'bg-[#0D121E]/92 border-white/15 hover:border-[#F59E0B]/60 hover:bg-[#101626] hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:shadow-[0_25px_60px_rgba(245,158,11,0.22)]'
            }`}
          >
            {/* Top Visual Image Header (Pinterest Pin Style - High Clarity) */}
            <div className="relative h-52 sm:h-56 w-full overflow-hidden border-b border-white/10">
              <img 
                src="/images/step2_project.jpg" 
                alt="Create a Project" 
                className="w-full h-full object-cover filter contrast-105 brightness-115 saturate-110 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Clean bottom-only blend so the photo stays 100% visible & bright */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D121E] via-transparent to-transparent pointer-events-none" />

              {/* Floating Pill Badges on Image */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[#F59E0B] text-[11px] font-mono font-bold uppercase tracking-wider shadow-xl">
                  <Target className="h-3 w-3 text-[#F59E0B]" />
                  <span>Project Creator & Lead</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-slate-200 shadow-md">
                  02 // CREATE
                </span>
              </div>

              {/* Live Metric Overlay */}
              <div className="absolute bottom-3 left-3.5 flex items-center space-x-1.5 text-xs font-mono text-amber-400 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/40 shadow-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                <span>Autonomous AI Squad Assembly</span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:text-amber-200 transition-colors">
                  I want to create a project
                </h2>

                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mt-2 font-normal">
                  Define your project requirements and build your ideal team.
                </p>

                {/* Visual Pipeline: Project → Requirements → AI → Team */}
                <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 group-hover:border-amber-500/30 transition-colors">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#F59E0B] font-bold mb-2 flex items-center justify-between">
                    <span>Assembly Pipeline</span>
                    <span className="text-slate-400 font-normal">NLP Requirement Matrix</span>
                  </div>

                  <div className="flex items-center justify-between text-center gap-1 text-[11px] font-mono">
                    <div className="flex-1 py-1 px-1 rounded-lg bg-white/[0.04] border border-white/10">
                      <FolderPlus className="h-3.5 w-3.5 text-[#F59E0B] mx-auto mb-0.5" />
                      <div className="font-bold text-white text-[10px]">Project</div>
                    </div>
                    <ChevronRight className="h-3 w-3 text-amber-500/60 shrink-0" />
                    <div className="flex-1 py-1 px-1 rounded-lg bg-white/[0.04] border border-white/10">
                      <Layers className="h-3.5 w-3.5 text-amber-400 mx-auto mb-0.5" />
                      <div className="font-bold text-white text-[10px]">Specs</div>
                    </div>
                    <ChevronRight className="h-3 w-3 text-amber-500/60 shrink-0" />
                    <div className="flex-1 py-1 px-1 rounded-lg bg-white/[0.04] border border-white/10">
                      <BrainCircuit className="h-3.5 w-3.5 text-[#F59E0B] mx-auto mb-0.5" />
                      <div className="font-bold text-white text-[10px]">AI</div>
                    </div>
                    <ChevronRight className="h-3 w-3 text-amber-500/60 shrink-0" />
                    <div className="flex-1 py-1 px-1 rounded-lg bg-amber-500/20 border border-amber-500/40">
                      <Users className="h-3.5 w-3.5 text-amber-300 mx-auto mb-0.5" />
                      <div className="font-bold text-amber-200 text-[10px]">Team</div>
                    </div>
                  </div>
                </div>

                {/* Value Checkpoints */}
                <ul className="mt-4 space-y-1.5 text-xs text-slate-200">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />
                    <span>Set project title, specs & desired team size</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />
                    <span>Configure skill weights (e.g. Python 40%, React 30%)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />
                    <span>Allocate specific roles for optimal coverage</span>
                  </li>
                </ul>
              </div>

              {/* Bottom Action CTA Button */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-300">
                  Next: Sign In & Open Creator Console
                </span>

                <div className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl btn-amber-gold text-xs uppercase tracking-wider font-extrabold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                  <span>Create & Assemble Pod</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* =========================================================================
          FOOTER BAR
          ========================================================================= */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 mb-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 border border-white/10 gap-2 bg-[#080B12]/80 backdrop-blur-xl rounded-2xl shadow-xl">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-[#F59E0B]" />
          <span>TeamMatch AI — Zero-Bias Algorithmic Team Optimization</span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          SyncSkills.AI System Core v2.4
        </div>
      </footer>

    </div>
  );
}
