import React from 'react';
import { BarChart3, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function Features() {
  return (
    <section className="py-24 border-t border-purple-500/20 text-slate-100 relative overflow-hidden" id="features">
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-xs font-mono text-amber-400 mb-3">
            <Sparkles className="h-3 w-3" />
            <span>ALGORITHMIC CORE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for Flawless Team Equilibrium
          </h2>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Eliminate guesswork in team allocation. Our heuristic pipeline balances multi-stack proficiencies, 
            communication velocity, and role ownership with mathematical precision.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="lightning-card p-8 rounded-3xl group border border-purple-500/20 hover:border-amber-400/80 transition-all duration-300">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-fuchsia-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-6 group-hover:scale-110 group-hover:text-amber-300 transition-all">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
              Intelligent Skill Vectorization
            </h3>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Scans Git repositories, commit cadence, and validated code submissions to construct high-dimensional mathematical profiles of technical strengths and development stamina.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-purple-300">
              <span>AST Syntax Analysis</span>
              <span className="text-amber-400">128-D Embedding</span>
            </div>
          </div>

          <div className="lightning-card p-8 rounded-3xl group border border-purple-500/20 hover:border-amber-400/80 transition-all duration-300">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-amber-600/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-6 group-hover:scale-110 group-hover:text-amber-200 transition-all">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
              Objective, Bias-Mitigated Pairing
            </h3>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Filters out vanity resume buzzwords and social cliques. Teams form purely on merit, technical complementarity, and harmonized psychological working styles.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-amber-300">
              <span>Demographic Blindness</span>
              <span className="text-purple-300">Zero Cliques</span>
            </div>
          </div>

          <div className="lightning-card p-8 rounded-3xl group border border-purple-500/20 hover:border-amber-400/80 transition-all duration-300">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-fuchsia-600/20 to-rose-600/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300 mb-6 group-hover:scale-110 group-hover:text-amber-300 transition-all">
              <Zap className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
              Sub-Second Cohort Partitioning
            </h3>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Partitions 200+ students or engineers into 40+ balanced squads in 1.2 seconds, instantly guaranteeing zero missing dependencies across the entire cohort.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-fuchsia-300">
              <span>Execution Time</span>
              <span className="text-amber-400">&lt; 1.4s Roster</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}