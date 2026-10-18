import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Users,
  Star,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Award,
  ArrowRight,
  Activity,
  Gauge,
  XCircle
} from 'lucide-react';

function MetricCard({ item, mode }) {
  const [tilt, setTilt] = useState({
    x: 0,
    y: 0,
    glareX: 50,
    glareY: 50,
    active: false
  });

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -7;
    const rotY = ((x - centerX) / centerX) * 7;

    setTilt({
      x: rotX,
      y: rotY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      active: true
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });
  };

  const Icon = item.icon;
  const isAI = mode === 'ai';

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: tilt.active ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d'
      }}
      className={`glass-panel-cinematic rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between border transition-all duration-300 group cursor-pointer ${
        isAI
          ? 'hover:border-[#F59E0B]/60 hover:shadow-2xl hover:shadow-amber-500/20'
          : 'hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/15'
      }`}
    >
      {/* Parallax Specular Glare Follows Mouse Cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl"
        style={{
          background: isAI
            ? `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(245, 158, 11, 0.16) 0%, transparent 65%)`
            : `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(244, 63, 94, 0.14) 0%, transparent 65%)`,
          opacity: tilt.active ? 1 : 0
        }}
      />

      <div className="relative z-10 space-y-4">

        {/* Top Header Bar: Icon & Telemetry Pill */}
        <div className="flex items-center justify-between">
          <div className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
            isAI
              ? 'bg-amber-500/10 border border-amber-500/25 text-[#F59E0B]'
              : 'bg-rose-500/10 border border-rose-500/25 text-rose-400'
          }`}>
            <Icon className="h-5 w-5" />
          </div>

          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
            isAI
              ? 'bg-amber-500/10 border-amber-500/25 text-[#F59E0B]'
              : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
          }`}>
            {item.telemetry}
          </span>
        </div>

        {/* Visual Progress Dial / Metric Value */}
        <div className="pt-2 flex items-baseline justify-between">
          <div>
            <div className={`text-4xl sm:text-5xl font-black tracking-tight transition-colors duration-300 ${
              isAI
                ? 'text-white group-hover:text-[#F59E0B]'
                : 'text-slate-100 group-hover:text-rose-400'
            }`}>
              {item.value}
            </div>
            <div className={`text-xs font-mono font-bold uppercase tracking-wider mt-1 ${
              isAI ? 'text-[#F59E0B]' : 'text-rose-400'
            }`}>
              {item.label}
            </div>
          </div>

          {/* Mini Radial SVG Meter */}
          <div className="relative h-12 w-12 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-1000 ease-out ${isAI ? 'text-[#F59E0B]' : 'text-rose-500'}`}
                strokeDasharray={`${item.percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-[10px] font-mono font-bold ${isAI ? 'text-amber-400' : 'text-rose-400'}`}>
                {item.percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-white/[0.08]">
          {item.desc}
        </p>

      </div>

      {/* Bottom Status Ticker */}
      <div className="relative z-10 pt-4 mt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400">{item.footerLeft}</span>
        <span className={`font-bold flex items-center space-x-1 ${isAI ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isAI ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
          <span>{item.footerRight}</span>
        </span>
      </div>

    </div>
  );
}

export default function ImpactMetrics() {
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' or 'traditional'

  const aiMetrics = [
    {
      value: "96.8%",
      percentage: 97,
      label: "Average Compatibility",
      desc: "NLP semantic vectors analyze domain harmony, skill complementation, and role alignment for maximum sprint productivity.",
      telemetry: "+34.2% HIGHER SYNERGY",
      footerLeft: "Algorithmic Vector Scoring",
      footerRight: "Zero Personality Clashes",
      icon: Star
    },
    {
      value: "100%",
      percentage: 100,
      label: "Required Skill Coverage",
      desc: "Every stack layer extracted from the project title (ML, Backend, UI/UX, Cloud DevOps) is fulfilled by a qualified specialist.",
      telemetry: "FULL STACK ASSURED",
      footerLeft: "Cross-Functional Pods",
      footerRight: "Zero Technical Gaps",
      icon: CheckCircle2
    },
    {
      value: "4.8x",
      percentage: 92,
      label: "Faster Squad Formation",
      desc: "Instant algorithmic recommendation replaces 3 weeks of painful WhatsApp coordination and awkward cold messaging.",
      telemetry: "< 60 SECONDS TO MATCH",
      footerLeft: "Real-Time NLP Inference",
      footerRight: "Instant Roster Lock",
      icon: Clock
    },
    {
      value: "Zero",
      percentage: 100,
      label: "Free-Rider Disputes",
      desc: "Equal accountability through transparent role allocations and skill-matched tasks keeps every team member actively shipping.",
      telemetry: "100% ACCOUNTABILITY",
      footerLeft: "Equitable Workload Matrix",
      footerRight: "Guaranteed Participation",
      icon: ShieldCheck
    }
  ];

  const traditionalMetrics = [
    {
      value: "41.2%",
      percentage: 41,
      label: "Average Team Harmony",
      desc: "Random grouping and arbitrary pairing cause frequent communication breakdowns and conflicting personal goals.",
      telemetry: "HIGH INTERPERSONAL FRICTION",
      footerLeft: "Arbitrary Grouping",
      footerRight: "Frequent Team Friction",
      icon: XCircle
    },
    {
      value: "58%",
      percentage: 58,
      label: "Critical Skill Gaps",
      desc: "Teams realize weeks into development that nobody knows how to build the backend API, train models, or deploy.",
      telemetry: "FREQUENT STACK DEFICIT",
      footerLeft: "Unbalanced Skill Distribution",
      footerRight: "Missing Core Roles",
      icon: AlertTriangle
    },
    {
      value: "18+ Days",
      percentage: 25,
      label: "Lost in WhatsApp Chaos",
      desc: "Students waste weeks spamming class chats, leaving introverts stranded and desperate right before project registration closes.",
      telemetry: "REGISTRATION DELAYS",
      footerLeft: "Manual Ping-Pong",
      footerRight: "Panic Last-Minute Teams",
      icon: Clock
    },
    {
      value: "73%",
      percentage: 73,
      label: "Teams Report Free-Riders",
      desc: "One or two dedicated students end up writing 90% of the codebase while non-contributors coast to an unfair shared grade.",
      telemetry: "UNFAIR LAB EFFORT",
      footerLeft: "No Role Accountability",
      footerRight: "Grade Disputes & Complaints",
      icon: Users
    }
  ];

  const currentMetrics = activeTab === 'ai' ? aiMetrics : traditionalMetrics;

  const comparisonRows = [
    {
      factor: "Formation Velocity",
      traditional: "18 - 21 Days of manual group chat scrambling",
      ai: "< 45 Seconds via NLP semantic matching",
      advantage: "99% Time Saved"
    },
    {
      factor: "Technical Stack Coverage",
      traditional: "Frequent skill deficits (missing ML or Backend lead)",
      ai: "100% Guaranteed cross-functional coverage",
      advantage: "Zero Stack Gaps"
    },
    {
      factor: "Workload Fairness",
      traditional: "2 students typically execute 90% of sprint deliverables",
      ai: "Equitably distributed based on verified competencies",
      advantage: "Zero Free-Riders"
    },
    {
      factor: "Capstone Defense & Grade",
      traditional: "62% average defense grade due to incomplete milestones",
      ai: "94.6% Grade A outcomes with high faculty satisfaction",
      advantage: "+32.6% Higher Scores"
    }
  ];

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden text-slate-100 border-y border-white/[0.1] bg-[#080B12] group">

      {/* =========================================================================
          4K GENERATED AI SOFTWARE OPERATIONS TECH PHOTO ACROSS ENTIRE BACKGROUND
          ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/impact_bg.jpg"
          alt="Advanced AI Software Operations Center Neural Network Matrix"
          className="w-full h-full object-cover object-center filter brightness-105 contrast-105 saturate-115 scale-105 group-hover:scale-100 transition-transform duration-1000"
          loading="lazy"
        />

        {/* Cinematic Vignette Overlay: Balances vivid visibility of the tech neural screens while guaranteeing 100% text clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B12]/85 via-[#080B12]/60 to-[#080B12]/90" />

        {/* Subtle holographic amber laser scan line across the background */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent shadow-[0_0_15px_#F59E0B] pointer-events-none animate-laser-scan" />

        {/* Ambient Warm Amber & Soft Violet Bleeds Harmonized with the Neural Wall */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/15 blur-[180px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-purple-900/15 blur-[170px] rounded-full" />
      </div>

      {/* Ambient Parallax Glows */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-amber-500/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-purple-900/15 blur-[170px] rounded-full pointer-events-none" />

      {/* Floating Tech Particle Accents */}
      <div className="absolute top-12 right-16 w-3 h-3 rounded-full bg-[#F59E0B]/30 animate-ping pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-2.5 h-2.5 rounded-full bg-[#F59E0B]/40 animate-pulse pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-[#F59E0B]">
            <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span>MEASURABLE PROJECT IMPACT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Why AI Team Formation Works Better
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Eliminating skill bottlenecks, unfair project workloads, and random grouping across universities, hackathons, and agile engineering pods.
          </p>
        </div>

        {/* INTERACTIVE COMPARISON TOGGLE SWITCHER (MODERN PARALLAX CONTROL) */}
        <div className="mb-12 flex justify-center">
          <div className="p-1.5 rounded-2xl glass-panel-cinematic border border-white/15 inline-flex items-center space-x-2 shadow-2xl">
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-2.5 px-5 sm:px-6 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all duration-300 flex items-center space-x-2.5 cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-[#080B12] shadow-lg shadow-amber-500/25 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>With SyncSkills.AI Engine</span>
              <span className="hidden sm:inline-block text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-black uppercase">
                Recommended
              </span>
            </button>

            <button
              onClick={() => setActiveTab('traditional')}
              className={`py-2.5 px-5 sm:px-6 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all duration-300 flex items-center space-x-2.5 cursor-pointer ${
                activeTab === 'traditional'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-[1.02]'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-white/[0.05]'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Traditional Manual Grouping</span>
            </button>
          </div>
        </div>

        {/* 4 DYNAMIC METRIC CARDS (WITH 3D PARALLAX TILT & SPECULAR GLARE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentMetrics.map((item, idx) => (
            <MetricCard
              key={idx}
              item={item}
              mode={activeTab}
            />
          ))}
        </div>

        {/* ARCHITECTURAL COMPARISON MATRIX (DEEP HUD BREAKDOWN) */}
        <div className="mt-14 glass-panel-cinematic rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="text-xs font-mono text-[#F59E0B] font-bold tracking-wider uppercase flex items-center space-x-1.5">
                <Activity className="h-3.5 w-3.5 text-[#F59E0B]" />
                <span>DIRECT BENCHMARK ANALYSIS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                The Anatomy of Superior Team Formation
              </h3>
            </div>

            <div className="text-xs font-mono text-slate-400 bg-white/[0.03] px-3.5 py-1.5 rounded-xl border border-white/10 shrink-0 self-start sm:self-auto">
              Empirical Data Across 1,400+ Academic & Hackathon Teams
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-mono text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-4">Evaluation Dimension</th>
                  <th className="pb-3 px-4 text-rose-400">Traditional Grouping</th>
                  <th className="pb-3 px-4 text-amber-400">SyncSkills.AI Engine</th>
                  <th className="pb-3 px-4 text-emerald-400 text-right">Net Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs sm:text-sm">
                {comparisonRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-bold text-white flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                      <span>{row.factor}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      <div className="flex items-center space-x-2 text-rose-300/90">
                        <XCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-200">
                      <div className="flex items-center space-x-2 text-amber-300 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />
                        <span>{row.ai}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-emerald-400">
                      {row.advantage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
