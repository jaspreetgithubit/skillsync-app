import React, { useState } from 'react';
import {
  UserPlus,
  FileText,
  BrainCircuit,
  Users,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Maximize2,
  X,
  CheckCircle2,
  Cpu,
  Activity,
  ShieldCheck
} from 'lucide-react';

export default function HowItWorks() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // 3D Parallax Tilt State for the Main Showcase Visual
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    glareX: 50,
    glareY: 50,
    glareOpacity: 0
  });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`,
      glareX,
      glareY,
      glareOpacity: 1
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      glareX: 50,
      glareY: 50,
      glareOpacity: 0
    });
  };

  const steps = [
    {
      step: '01',
      title: 'Create Student Profile',
      subtitle: 'Profile, Skills & Role Preferences',
      category: 'Phase 01: Profile Ingestion',
      icon: UserPlus,
      desc: 'Students create verified profiles detailing technical skills (Python, React, Machine Learning, Cloud DevOps), years of project experience, domain interests, and preferred roles (e.g., AI Developer, Backend Lead, UI/UX Architect).',
      image: '/images/step1_profile.jpg',
      alt: 'Student Developer Profile Creation Interface',
      scanLabel: 'AI SKILL PROFILE SCANNER ACTIVE',
      telemetry: {
        metricA: 'SKILL VECTORS: 24+ DOMAINS',
        metricB: 'VALIDATION: VERIFIED PORTFOLIO',
        status: 'READY FOR INGESTION'
      },
      highlights: [
        'Select primary technical proficiencies and tooling stack',
        'Specify years of project experience & past repositories',
        'Declare preferred sprint roles & domain enthusiasm'
      ]
    },
    {
      step: '02',
      title: 'Provide Project Title & Scope',
      subtitle: 'Project Scope & Requirements Input',
      category: 'Phase 02: Scope Definition',
      icon: FileText,
      desc: 'When a university capstone title, competitive hackathon problem statement, or enterprise corporate initiative is submitted (e.g., "AI HealthTech Diagnostic App"), the system ingests the project scope and sets constraint boundaries.',
      image: '/images/step2_project.jpg',
      alt: 'Project Scope Analyzer and Title Input',
      scanLabel: 'PROJECT SCOPE NLP PARSER ACTIVE',
      telemetry: {
        metricA: 'TITLE PARSING: BERT / TRANSFORMERS',
        metricB: 'STACK EXTRACTION: 4 CORE MODULES',
        status: 'SCOPE BOUNDARIES DEFINED'
      },
      highlights: [
        'Input custom project title, deliverables & constraints',
        'Automatic stack inference for full-stack dependencies',
        'Prepares semantic parameters for vector comparison'
      ]
    },
    {
      step: '03',
      title: 'NLP AI Skill Analysis & Comparison',
      subtitle: 'Semantic NLP Model Matching',
      category: 'Phase 03: Neural Comparison',
      icon: BrainCircuit,
      desc: 'Our NLP model parses the project title to identify all required skills and compares them semantically against candidate student profiles, analyzing domain overlap, skill proficiency levels, and cross-functional role harmony.',
      image: '/images/step3_nlp.jpg',
      alt: 'NLP Semantic Skill Extraction Neural Model',
      scanLabel: 'SEMANTIC VECTOR COMPARATOR LIVE',
      telemetry: {
        metricA: 'COSINE SIMILARITY: HIGH CONFIDENCE',
        metricB: 'LATENT EMBEDDINGS: 1536 DIMENSIONS',
        status: 'ZERO-BIAS NEURAL SCORING'
      },
      highlights: [
        'Extracts technical requirements directly from project titles',
        'Computes semantic similarity vectors with student profiles',
        'Eliminates human bias & evaluates genuine technical depth'
      ]
    },
    {
      step: '04',
      title: 'Best Team Formation & Matching Scores',
      subtitle: 'Recommended Squad with Compatibility Scores',
      category: 'Phase 04: Optimal Assembly',
      icon: Users,
      desc: 'The AI calculates individual and aggregate compatibility scores (e.g., 98%, 97%, 99%) and recommends the best, perfectly balanced team covering every required project skill with zero competency gaps.',
      image: '/images/step4_team.jpg',
      alt: 'Recommended Project Squad with Match Scores',
      scanLabel: 'SQUAD SYNTHESIS ENGINE COMPLETE',
      telemetry: {
        metricA: 'COMPATIBILITY SCORE: 98% MATCH',
        metricB: 'SKILL COVERAGE: 100% BALANCED',
        status: 'DEPLOYMENT SQUAD READY'
      },
      highlights: [
        'Recommends optimal 4-person squad (ML, Backend, Frontend, Cloud)',
        'Displays transparent compatibility matching scores',
        'Guarantees 100% full-stack project requirement coverage'
      ]
    }
  ];

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <section id="how-it-works" className="py-16 lg:py-24 relative overflow-hidden text-slate-100">

      {/* Soft Ambient Background Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-950/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 blur-[170px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-[#F59E0B]">
            <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span>THE 4-PHASE SELECTION PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-200 tracking-tight">
            How Our AI Matches Skills & Forms Teams
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            From student profile ingestion to NLP vector matching, see how our intelligent pipeline synthesizes the winning squad.
          </p>
        </div>

        {/* INTERACTIVE PHASE STEPPER (LEFT ALIGNED) */}
        <div className="mb-8 flex justify-start">
          <div className="p-1.5 rounded-2xl glass-panel-cinematic border border-white/10 inline-flex items-center justify-start gap-1.5 sm:gap-2 shadow-2xl overflow-x-auto max-w-full">
            {steps.map((item, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`py-2.5 sm:py-3 px-3.5 sm:px-5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all duration-300 flex items-center space-x-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#F59E0B] text-[#080B12] shadow-lg shadow-amber-500/25 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-black ${
                    isActive ? 'bg-[#080B12]/20 text-[#080B12]' : 'bg-white/10 text-amber-400'
                  }`}>
                    {item.step}
                  </span>
                  <span className="hidden sm:inline whitespace-nowrap">{item.title}</span>
                  <span className="sm:hidden">Step {item.step}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MASTER SHOWCASE STAGE (BALANCED PROPORTIONS WITH 3D PARALLAX TILT) */}
        <div className="glass-panel-cinematic rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/15 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* LEFT INFORMATION PANEL (5 OF 12 COLUMNS) */}
            <div className="lg:col-span-5 space-y-6">

              {/* Category & Phase Pill */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#F59E0B]">
                  <StepIcon className="h-3.5 w-3.5 text-[#F59E0B]" />
                  <span className="uppercase tracking-wider font-bold">{currentStep.category}</span>
                </div>

                <span className="text-2xl font-mono font-bold text-slate-400">
                  <span className="text-[#F59E0B]">{currentStep.step}</span> / 04
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-200 leading-tight mb-1">
                  {currentStep.title}
                </h3>
                <p className="text-xs font-mono text-amber-400/90 tracking-wide font-medium">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {currentStep.desc}
              </p>

              {/* Checklist Highlights */}
              <div className="space-y-2.5 pt-3 border-t border-white/10">
                {currentStep.highlights.map((point, pIdx) => (
                  <div key={pIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-[#F59E0B] shrink-0 mt-0.5" />
                    <span className="leading-snug">{point}</span>
                  </div>
                ))}
              </div>

              {/* Live Telemetry Card */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400 flex items-center space-x-1.5">
                    <Activity className="h-3.5 w-3.5 text-[#F59E0B]" />
                    <span>{currentStep.telemetry.metricA}</span>
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>{currentStep.telemetry.status}</span>
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  {currentStep.telemetry.metricB}
                </div>
              </div>

              {/* Navigation Actions (Previous / Next Buttons) */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
                  className="flex-1 py-2.5 px-4 rounded-xl btn-glass-outline text-xs font-mono font-bold flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Previous Phase</span>
                </button>
                <button
                  onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
                  className="flex-1 py-2.5 px-4 rounded-xl btn-amber-gold text-xs font-mono font-bold flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Next Phase</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>

            {/* RIGHT VISUAL STUDIO: 3D PARALLAX TILT + LASER SCANNER (7 OF 12 COLUMNS) */}
            <div className="lg:col-span-7">
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setSelectedImage(currentStep)}
                style={{
                  transform: tiltStyle.transform,
                  transition: tiltStyle.glareOpacity === 0 ? 'transform 0.5s ease-out' : 'transform 0.08s ease-out',
                  transformStyle: 'preserve-3d'
                }}
                className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/70 shadow-2xl h-72 sm:h-80 md:h-[380px] w-full group cursor-pointer"
              >
                {/* 4K Tech Image */}
                <img
                  key={currentStep.image}
                  src={currentStep.image}
                  alt={currentStep.alt}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/80 via-transparent to-[#080B12]/30 pointer-events-none" />

                {/* Dynamic Specular Parallax Glare Following Mouse */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${tiltStyle.glareX}% ${tiltStyle.glareY}%, rgba(245, 158, 11, 0.18) 0%, transparent 60%)`,
                    opacity: tiltStyle.glareOpacity
                  }}
                />

                {/* HOLOGRAPHIC LASER SCANNER BEAM ANIMATION */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent shadow-[0_0_15px_#F59E0B] pointer-events-none animate-laser-scan" />

                {/* Top Scanner Telemetry Status Pill */}
                <div className="absolute top-3.5 left-3.5 flex items-center space-x-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 pointer-events-none shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-[#F59E0B] animate-ping" />
                  <span className="text-[10px] font-mono text-[#F59E0B] font-bold tracking-wider">
                    {currentStep.scanLabel}
                  </span>
                </div>

                {/* Bottom Floating Bar on Visual */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 shadow-xl">
                    <Cpu className="h-3.5 w-3.5 text-[#F59E0B]" />
                    <span className="text-xs font-mono text-white font-bold">
                      Phase {currentStep.step} Visual
                    </span>
                  </div>

                  <div className="pointer-events-auto">
                    <button
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/80 text-white text-xs font-mono border border-white/20 hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors backdrop-blur-md shadow-xl cursor-pointer"
                      title="Click to expand 4K photo"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Expand 4K</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SYNCHRONIZED 4-CARD PREVIEW DOCK (ALL STEPS VISIBLE WISELY) */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
          {steps.map((item, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3 sm:p-4 rounded-2xl glass-panel-cinematic border transition-all duration-300 cursor-pointer text-left relative overflow-hidden group hover:-translate-y-1 ${
                  isActive
                    ? 'border-[#F59E0B] bg-white/[0.08] shadow-lg shadow-amber-500/15'
                    : 'border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                }`}
              >
                {/* Mini Thumbnail Preview */}
                <div className="relative h-16 sm:h-20 rounded-xl overflow-hidden mb-2.5 bg-black/60 border border-white/10">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />

                  {/* Step Badge */}
                  <span className={`absolute top-1.5 left-1.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-[#F59E0B] text-[#080B12]' : 'bg-black/30 backdrop-blur-sm text-slate-200'
                  }`}>
                    {item.step}
                  </span>
                </div>

                <div className="text-xs font-bold text-white truncate group-hover:text-[#F59E0B] transition-colors">
                  {item.title}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                  {item.subtitle}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* FULL-SCREEN 4K LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#080B12] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-[#F59E0B] animate-ping" />
                <span className="text-xs font-mono font-bold text-[#F59E0B] tracking-wider">
                  {selectedImage.scanLabel}
                </span>
              </div>

              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 4K Image Container */}
            <div className="relative max-h-[70vh] overflow-hidden bg-black flex items-center justify-center p-2">
              <img
                src={selectedImage.image}
                alt={selectedImage.alt}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Lightbox Footer Bar */}
            <div className="px-6 py-4 bg-black/70 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div>
                <span className="text-white font-bold">{selectedImage.title}</span>
                <span className="text-slate-400 ml-2">• {selectedImage.subtitle}</span>
              </div>
              <span className="text-[#F59E0B] bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                100% Neural Resolution
              </span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
