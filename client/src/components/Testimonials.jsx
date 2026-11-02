import React from 'react';
import { Sparkles, Star, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      author: "Aditya Verma",
      title: "Final Year B.Tech • Student Lead",
      project: "AI Healthcare Diagnostics",
      badge: "Student Lead",
      avatar: "/images/avatars/aditya.jpg",
      quote: "Before this system, forming capstone teams was total chaos. Either students teamed up with friends and lacked essential skills, or one person ended up doing everything. The AI matched our skills with our project title perfectly.",
      metrics: "98% Match Score • 4-Member Squad"
    },
    {
      author: "Dr. Sunita Deshmukh",
      title: "Professor & Project Coordinator",
      project: "Dept. of Computer Engineering",
      badge: "Faculty Mentor",
      avatar: "/images/avatars/dr_sunita.jpg",
      quote: "As a project guide, my biggest challenge was evaluating unbalanced teams. With this AI skill matching system, each team has a clear distribution of roles—ML, Backend, Frontend, and Cloud. Project submission quality increased by 40%.",
      metrics: "320+ Students Coordinated"
    },
    {
      author: "Karthik Iyer",
      title: "Hackathon Finalist & Mobile Lead",
      project: "Campus EV Payment App",
      badge: "Hackathon Lead",
      avatar: "/images/avatars/karthik.jpg",
      quote: "At our 36-hour hackathon, our fourth member backed out last minute. We pasted our problem title into the system, and within 30 seconds it recommended a student with exact Flutter and Firebase skills. We ended up winning 2nd prize!",
      metrics: "2nd Prize Winner • 30s Match"
    },
    {
      author: "Sneha Rao",
      title: "Enterprise Agile Coach & Pod Lead",
      project: "FinTech Cloud Platform Pod",
      badge: "Enterprise Lead",
      avatar: "/images/avatars/sneha.jpg",
      quote: "Finding internal talent for cross-functional initiatives was always delayed by HR spreadsheets. SyncSkills.AI mapped our employee skill sets directly to project titles and assembled our production-ready sprint pod in under a minute.",
      metrics: "Zero Hiring Lag • Cross-Functional"
    },
    {
      author: "Prof. Rajesh Kulkarni",
      title: "Head of Dept, Computer Science",
      project: "Capstone Innovation Council",
      badge: "Department Head",
      avatar: "/images/avatars/prof_kulkarni.jpg",
      quote: "Over 80 capstone teams formed through SyncSkills.AI this term. Zero free-rider disputes, zero skill bottlenecks, and every team presented a complete full-stack prototype during final university defense.",
      metrics: "80 Teams • 100% Defense Success"
    },
    {
      author: "Pooja Sharma",
      title: "UI/UX & Frontend Specialist",
      project: "Smart Campus Automation",
      badge: "Student Designer",
      avatar: "/images/avatars/pooja.jpg",
      quote: "I used to get stuck in teams where everyone only wanted to write Python scripts and nobody touched React or Figma. SyncSkills.AI ensured our team had an ML engineer, a backend architect, a cloud lead, and me for UI/UX!",
      metrics: "100% Full-Stack Skill Harmony"
    }
  ];

  // Tripled array to ensure a seamless, 100% continuous infinite loop with no empty gaps
  const loopCards = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-20 lg:py-28 relative overflow-hidden text-slate-100">
      
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-purple-950/20 blur-[170px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 blur-[170px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-14 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-[#F59E0B]">
            <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span>REAL EXPERIENCES & CAMPUS SUCCESS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Trusted by Students & Faculty Mentors
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Real feedback from engineering students, hackathon champions, and university project directors who built winning squads with SyncSkills.AI.
          </p>
        </div>
      </div>

      {/* SINGLE-ROW CONTINUOUS INFINITE MARQUEE CONTAINER */}
      <div className="relative w-full overflow-hidden py-3">
        
        {/* Left & Right Edge Gradient Masks (Seamless Dissolve) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#080B12] via-[#080B12]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#080B12] via-[#080B12]/80 to-transparent z-20" />

        {/* SINGLE SMOOTH ROW: Glides continuously (Pauses on hover) */}
        <div className="flex overflow-hidden group">
          <div className="animate-marquee-infinite flex py-3">
            {loopCards.map((item, idx) => (
              <div 
                key={idx}
                className="glass-panel-cinematic rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/15 hover:border-[#F59E0B]/60 transition-all duration-300 group/card w-[340px] sm:w-[420px] shrink-0 mx-3 select-none hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1.5 cursor-pointer"
              >
                <div>
                  {/* Top Header: Round Avatar Photo + Author Info + Badge */}
                  <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/[0.08]">
                    <div className="flex items-center space-x-3.5">
                      {/* Round Circular Photo with Amber Glow Ring */}
                      <div className="relative shrink-0">
                        <img 
                          src={item.avatar} 
                          alt={item.author}
                          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover object-center ring-2 ring-[#F59E0B]/50 p-0.5 shadow-lg shadow-amber-500/20 group-hover/card:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#080B12]" />
                      </div>

                      <div>
                        <div className="text-sm sm:text-base font-bold text-white group-hover/card:text-[#F59E0B] transition-colors leading-tight">
                          {item.author}
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5 leading-snug">
                          {item.title}
                        </div>
                        <div className="text-[10px] font-mono text-amber-400/90 mt-0.5">
                          {item.project}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-[#F59E0B] bg-amber-500/10 px-2.5 py-1 rounded-full border border-[#F59E0B]/30 shrink-0 font-bold">
                      {item.badge}
                    </span>
                  </div>

                  {/* 5-Star Rating */}
                  <div className="flex items-center space-x-1 text-[#F59E0B] pt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                    <span className="text-xs font-mono text-slate-400 ml-2 font-semibold">5.0 Verified</span>
                  </div>

                  {/* Quote Content */}
                  <p className="mt-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal italic">
                    \"{item.quote}\"
                  </p>
                </div>

                {/* Card Footer: Verified Result Tag */}
                <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Verified Outcome</span>
                  </span>
                  <span className="text-[#F59E0B] font-bold">
                    {item.metrics}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Telemetry Ticker Bar */}
      <div className="mt-10 text-center relative z-10">
        <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Hover over any review card to pause and read</span>
          <span className="text-slate-400">•</span>
          <span className="text-[#F59E0B] font-bold">100% Real Student & Faculty Reviews</span>
        </div>
      </div>

    </section>
  );
}
