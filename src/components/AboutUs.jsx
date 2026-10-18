import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function AboutUs() {
  const [comparisonMode, setComparisonMode] = useState('skillsync');

  return (
    <section id="about" className="py-28 lg:py-32 relative overflow-hidden text-slate-100">

      {/* Soft Ambient Glow */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-purple-950/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">

        {/* Mission Manifesto Header */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-[#D4AF37]">
            <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>THE SYNCSKILLS.AI MISSION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Why SyncSkills.AI Was Born: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#D4AF37]">
              Eradicating Bias & Friction in Team Formation
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal max-w-3xl mx-auto">
            Traditional software team assembly relies on inflated resume claims, arbitrary manager assignments, or awkward social cliques. SyncSkills.AI replaces guesswork with
            <span className="text-[#D4AF37] font-semibold"> mathematical vector equilibrium</span> to engineer high-velocity agile squads.
          </p>
        </div>

        {/* INTERACTIVE BEFORE VS. AFTER COMPARISON SWITCHER */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/[0.08] bg-[#0A0C10]/80 relative overflow-hidden">

          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              SYSTEMIC IMPACT COMPARISON
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Traditional Guesswork vs. SyncSkills.AI Precision
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Toggle between the modes below to observe the operational difference between legacy team formation and our AI vector engine.
            </p>

            {/* Toggle Switch */}
            <div className="inline-flex p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] mt-3">
              <button
                onClick={() => setComparisonMode('traditional')}
                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  comparisonMode === 'traditional'
                    ? 'bg-rose-950/70 text-rose-300 border border-rose-700/50 shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Traditional Methods (Broken)
              </button>
              <button
                onClick={() => setComparisonMode('skillsync')}
                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  comparisonMode === 'skillsync'
                    ? 'btn-gold text-[#0A0C10] shadow-[0_0_20px_rgba(212,175,55,0.3)] font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SyncSkills.AI (AI Engineered)
              </button>
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparisonMode === 'traditional' ? (
              <>
                <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/30 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold uppercase">
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    <span>Keyword Resume Bias</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">Inflated Skill Claims</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Self-reported resumes exaggerate proficiencies. Projects stall when developers lack verified AST code comprehension.
                  </p>
                  <div className="text-[11px] font-mono text-rose-400/90 pt-2 border-t border-rose-900/40">
                    Result: 42% project stall rate
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/30 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold uppercase">
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    <span>Social Clique Pairing</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">Redundant Skill Clusters</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Colleagues pair up arbitrarily, causing 4 frontend engineers to work together with zero backend or cloud architects.
                  </p>
                  <div className="text-[11px] font-mono text-rose-400/90 pt-2 border-t border-rose-900/40">
                    Result: Severe interpersonal friction
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/30 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold uppercase">
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    <span>Manual Sorting Overhead</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">Weeks of Allocation Lag</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Engineering leads waste 30+ hours per quarter rebalancing spreadsheets and resolving capability mismatch escalations.
                  </p>
                  <div className="text-[11px] font-mono text-rose-400/90 pt-2 border-t border-rose-900/40">
                    Result: Significant enterprise overhead
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#D4AF37]/30 space-y-3">
                  <div className="flex items-center space-x-2 text-[#D4AF37] font-mono text-xs font-bold uppercase">
                    <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                    <span>AST Code Verification</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">Objective Code Stamina</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Evaluates verified GitHub commit cadence, syntax tree depth, and real execution speed—bypassing resume buzzwords.
                  </p>
                  <div className="text-[11px] font-mono text-[#D4AF37] pt-2 border-t border-white/[0.08]">
                    Result: Zero false capability assumptions
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#D4AF37]/30 space-y-3">
                  <div className="flex items-center space-x-2 text-[#D4AF37] font-mono text-xs font-bold uppercase">
                    <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                    <span>Vector Synergy</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">100% Full-Stack Equilibrium</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Every squad is mathematically engineered with frontend, distributed backend, database, and DevOps roles distributed cleanly.
                  </p>
                  <div className="text-[11px] font-mono text-[#D4AF37] pt-2 border-t border-white/[0.08]">
                    Result: +340% milestone velocity
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-[#D4AF37]/30 space-y-3">
                  <div className="flex items-center space-x-2 text-[#D4AF37] font-mono text-xs font-bold uppercase">
                    <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                    <span>Sub-Second Partitioning</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">Instant Cohort Rosters</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    The Kuhn-Munkres algorithm partitions 200+ engineers into balanced 4-person pods in 1.2s with verified synergy rationale.
                  </p>
                  <div className="text-[11px] font-mono text-[#D4AF37] pt-2 border-t border-white/[0.08]">
                    Result: 99.4% engineering lead approval
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
