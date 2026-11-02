import React from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  BrainCircuit, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Terminal, 
  Database, 
  Globe2 
} from 'lucide-react';

export default function TechMarquee() {
  const challenges = [
    {
      id: "skills",
      icon: Layers,
      title: "Skill Imbalance & Missing Roles",
      badge: "Stack Imbalance Solved",
      problemTitle: "The Traditional Problem:",
      problem: "Students team up with close friends, resulting in 4 frontend coders with nobody to build the backend API, train the ML model, or configure cloud databases.",
      solutionTitle: "How SyncSkills.AI Solves It:",
      solution: "Our NLP model parses the project title to identify every technical dependency and matches students with complementary skills so all roles are covered.",
      outcome: "100% Full-Stack Coverage",
      accent: "text-[#F59E0B] border-amber-500/30 bg-amber-500/10"
    },
    {
      id: "freeriders",
      icon: ShieldCheck,
      title: "Free-Rider Disputes & Unfair Workload",
      badge: "Accountability Ensured",
      problemTitle: "The Traditional Problem:",
      problem: "In over 70% of university capstones, 1 or 2 dedicated students write 95% of the codebase while non-contributors coast to an unfair shared grade.",
      solutionTitle: "How SyncSkills.AI Solves It:",
      solution: "Each squad member is assigned clear, transparent responsibilities matched to their verified proficiencies, past experience, and preferred career roles.",
      outcome: "Zero Free-Riders",
      accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    },
    {
      id: "speed",
      icon: Clock,
      title: "Weeks Lost in WhatsApp Chaos",
      badge: "Instant Matchmaking",
      problemTitle: "The Traditional Problem:",
      problem: "Students waste 2 to 3 weeks spamming class WhatsApp groups, leaving introverted developers and late registrants stranded without teammates.",
      solutionTitle: "How SyncSkills.AI Solves It:",
      solution: "Simply submit your project title or candidate skills. Our NLP algorithm evaluates semantic compatibility and recommends your 4-member squad in under 60 seconds.",
      outcome: "< 60s Squad Assembly",
      accent: "text-amber-300 border-amber-400/30 bg-amber-500/10"
    }
  ];

  const techStream = [
    { name: "Python & PyTorch", tag: "AI / ML Core", icon: Cpu },
    { name: "React 19 & Next.js", tag: "Frontend UI/UX", icon: Sparkles },
    { name: "FastAPI & Node.js", tag: "Backend APIs", icon: Terminal },
    { name: "Docker & AWS Cloud", tag: "DevOps & Cloud", icon: Layers },
    { name: "PostgreSQL & VectorDB", tag: "Database", icon: Database },
    { name: "BERT / Transformer", tag: "NLP Skill Parser", icon: BrainCircuit },
    { name: "Flutter & Mobile", tag: "Cross-Platform", icon: Globe2 },
    { name: "Zero Free-Rider Protocol", tag: "Workload Balance", icon: ShieldCheck }
  ];

  const loopStream = [...techStream, ...techStream, ...techStream];

  return (
    <section className="relative z-10 py-16 lg:py-24 border-y border-white/[0.08] overflow-hidden text-slate-100">
      
      {/* Background Soft Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[650px] h-[350px] bg-amber-500/10 blur-[170px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-purple-900/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-[#F59E0B]">
            <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span>THE PROBLEM WE SOLVE</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Why Traditional Grouping Fails & How AI Fixes It
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            College capstone projects and hackathons suffer from the same 3 team formation disasters. Here is how our NLP algorithm solves each one:
          </p>
        </div>

        {/* =========================================================================
            COMBINED BACKGROUND PHOTO WRAPPER WITH 3 FROSTED GLASS CARDS FLOATING ON TOP
            ========================================================================= */}
        <div className="relative rounded-3xl overflow-hidden border border-white/20 p-6 sm:p-8 lg:p-10 shadow-2xl mb-12 group">
          
          {/* 1 SINGLE COMBINED HIGH-DEFINITION PHOTO BEHIND ALL CARDS */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/challenges_backdrop.jpg" 
              alt="University Computer Science Lab and Collaborative Software Engineering Environment" 
              className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 brightness-110 contrast-105 saturate-115"
              loading="lazy"
            />
            {/* Dark gradient overlay to keep cards perfectly crisp and readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/65 via-[#080B12]/35 to-[#080B12]/50" />
            
            {/* Subtle animated laser scan beam sweeping across the combined backdrop */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent shadow-[0_0_15px_#F59E0B] pointer-events-none animate-laser-scan" />
          </div>

          {/* Top Telemetry Pill on the Combined Backdrop */}
          <div className="relative z-10 flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
              <span className="h-2 w-2 rounded-full bg-[#F59E0B] animate-ping" />
              <span className="font-bold text-[#F59E0B] tracking-wider uppercase">
                AI Collaborative Lab Ecosystem
              </span>
              <span className="hidden sm:inline text-slate-400">• Real-Time Team Formation Telemetry</span>
            </div>

            <div className="text-[11px] font-mono text-slate-400 bg-black/60 px-3 py-1 rounded-full border border-white/10">
              3 Critical Challenges Solved
            </div>
          </div>

          {/* 3 FROSTED GLASS CARDS (NO PHOTOS INSIDE CARDS — FLOATING ON TOP OF COMBINED PHOTO) */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.id}
                  className="bg-[#080B12]/85 backdrop-blur-2xl shadow-2xl rounded-2xl p-6 sm:p-7 border border-white/15 hover:border-[#F59E0B]/60 transition-all duration-300 group/card flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer"
                >
                  <div className="space-y-5">
                    
                    {/* Card Header: Icon & Category Badge */}
                    <div className="flex items-center justify-between">
                      <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover/card:scale-110 ${item.accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/[0.06] border border-white/10 text-slate-300">
                        {item.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black text-white group-hover/card:text-[#F59E0B] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* The Problem Box (Red warning tint) */}
                    <div className="p-3.5 rounded-2xl bg-rose-500/[0.08] border border-rose-500/20 space-y-1">
                      <div className="text-[11px] font-mono font-bold text-rose-400 flex items-center space-x-1.5 uppercase tracking-wide">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span>{item.problemTitle}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {item.problem}
                      </p>
                    </div>

                    {/* The AI Solution Box (Amber tint) */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 space-y-1">
                      <div className="text-[11px] font-mono font-bold text-[#F59E0B] flex items-center space-x-1.5 uppercase tracking-wide">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#F59E0B]" />
                        <span>{item.solutionTitle}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-normal">
                        {item.solution}
                      </p>
                    </div>

                  </div>

                  {/* Card Footer: Guaranteed Outcome Metric */}
                  <div className="pt-4 mt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Guaranteed Result:</span>
                    <span className="text-[#F59E0B] font-bold bg-amber-500/15 px-3 py-1 rounded-lg border border-amber-500/30">
                      {item.outcome}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* BOTTOM TECH COMPATIBILITY STREAM */}
        <div className="pt-4 border-t border-white/[0.08]">
          <div className="text-center text-xs font-mono text-slate-400 mb-3.5 flex items-center justify-center space-x-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            <span>Supported Technologies Extracted Automatically by NLP Model:</span>
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#080B12] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#080B12] to-transparent z-10" />

            <div className="flex overflow-hidden group">
              <div className="animate-marquee-infinite flex py-1">
                {loopStream.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#F59E0B]/50 transition-colors mx-2 shrink-0 select-none cursor-pointer"
                    >
                      <Icon className="h-3.5 w-3.5 text-[#F59E0B]" />
                      <span className="text-xs text-slate-200 font-semibold">{item.name}</span>
                      <span className="text-[10px] font-mono text-amber-400/80 bg-white/[0.04] px-1.5 py-0.5 rounded">
                        {item.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
