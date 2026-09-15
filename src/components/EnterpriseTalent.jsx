import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Building2, 
  Globe2,
  Play
} from 'lucide-react';

export default function EnterpriseTalent() {
  return (
    <section id="enterprise" className="py-28 lg:py-32 relative overflow-hidden text-slate-100">
      
      {/* Soft Ambient Glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purple-950/10 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-[#D4AF37]">
            <Building2 className="h-3.5 w-3.5" />
            <span>GLOBAL ENTERPRISE INFRASTRUCTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Bridging Top-Tier Indian Tech Talent With Global Agile Scale
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Eliminate traditional offshore hiring lag. SyncSkills.AI equips Fortune 500 engineering directors with pre-synchronized Indian developer squads verified on live code syntax, commit velocity, and collaborative equilibrium.
          </p>
        </div>

        {/* Photography & Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center" id="workspace-tour">
          
          {/* Real Corporate Tech Cabin Photo with Interactive Tour Preview */}
          <div className="lg:col-span-7 relative">
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl group">
              <div className="relative h-[380px] sm:h-[460px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85" 
                  alt="Ultra-modern corporate tech office cabin with glass partitions and developer desks" 
                  className="w-full h-full object-cover filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/40 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-5 left-5 px-3.5 py-1.5 rounded-xl bg-[#0A0C10]/85 backdrop-blur-md border border-white/[0.08] text-xs font-mono text-[#D4AF37] flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span>BENGALURU • HYDERABAD INNOVATION HUBS</span>
                </div>

                {/* Interactive Tour Play Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-16 w-16 rounded-full bg-[#0A0C10]/60 backdrop-blur-md border border-[#D4AF37]/40 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-[#D4AF37] fill-current ml-1" />
                  </div>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl glass-panel bg-[#0A0C10]/90 border border-white/[0.08]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider font-bold">
                        Production Sprint Status
                      </div>
                      <div className="text-sm font-semibold text-white mt-0.5">
                        Agile Pod 04 • Microservices & Distributed Architecture
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
                        Velocity 99.8%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Assurances */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                Enterprise Assurance
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                Engineered for High-Stakes Technical Delivery
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                Avoid the friction of unvetted contract hiring. Every developer in our ecosystem is pre-vetted through deep AST syntax parsing, Git commit velocity, and collaborative psychological assessment.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="p-4 rounded-2xl glass-panel border border-white/[0.08] flex items-start space-x-3.5">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#D4AF37] shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Zero Pedigree Bias</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Evaluation is strictly based on code coverage, AST syntax depth, and execution velocity.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-white/[0.08] flex items-start space-x-3.5">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-300 shrink-0 mt-0.5">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Full-Stack Equilibrium</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Guarantees that frontend, distributed backend, and database skill sets are balanced within each squad.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-white/[0.08] flex items-start space-x-3.5">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#D4AF37] shrink-0 mt-0.5">
                  <Globe2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Timezone Harmonized</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Flexible 4-hour overlap with US & European teams for daily standups, review cycles, and instant resolution.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider"
              >
                <span>Request Enterprise Access</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
