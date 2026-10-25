import React, { useState } from 'react';
import {
  GraduationCap,
  Rocket,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Maximize2,
  X,
  Layers,
  Cpu
} from 'lucide-react';

function UseCaseCard({ item, onExpand, onOpenAuth }) {
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

    const rotX = ((y - centerY) / centerY) * -6;
    const rotY = ((x - centerX) / centerX) * 6;

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

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: tilt.active ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d'
      }}
      className="glass-panel-cinematic rounded-3xl p-6 border border-white/15 flex flex-col justify-between hover:border-[#F59E0B]/60 hover:shadow-2xl hover:shadow-amber-500/20 group relative overflow-hidden"
    >
      {/* Specular Glare Follows Mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl"
        style={{
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(245, 158, 11, 0.14) 0%, transparent 65%)`,
          opacity: tilt.active ? 1 : 0
        }}
      />

      <div className="relative z-10 space-y-5">

        {/* Card Header: Category & Icon */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#F59E0B]">
            <Icon className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span className="uppercase tracking-wider font-bold">{item.badge}</span>
          </div>

          <span className="text-xs font-mono text-slate-400 font-bold">
            {item.track}
          </span>
        </div>

        {/* 4K Tech Photo with Laser Scanner Beam & Parallax Container */}
        <div
          onClick={() => onExpand(item)}
          className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/70 shadow-xl h-52 sm:h-56 w-full group/img cursor-pointer"
        >
          <img
            src={item.image}
            alt={item.alt}
            className="w-full h-full object-cover object-center group-hover/img:scale-108 transition-transform duration-700 brightness-95 group-hover/img:brightness-105"
            loading="lazy"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/80 via-transparent to-transparent pointer-events-none" />

          {/* HOLOGRAPHIC LASER SCANNER BEAM ANIMATION */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent shadow-[0_0_15px_#F59E0B] pointer-events-none animate-laser-scan" />

          {/* Top Scanner Telemetry Pill */}
          <div className="absolute top-3 left-3 flex items-center space-x-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 pointer-events-none shadow-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-ping" />
            <span className="text-[9px] font-mono text-[#F59E0B] font-bold tracking-wider">{item.scanLabel}</span>
          </div>

          {/* Expand 4K Button */}
          <div className="absolute bottom-2.5 right-2.5">
            <button
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/80 text-white text-[11px] font-mono border border-white/20 hover:border-[#F59E0B] hover:text-[#F59E0B] transition-colors backdrop-blur-md shadow-lg"
              title="Click to view full 4K photo"
            >
              <Maximize2 className="h-3 w-3" />
              <span>4K</span>
            </button>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="text-xl font-black text-slate-200 group-hover:text-[#F59E0B] transition-colors leading-snug mb-1">
            {item.title}
          </h3>
          <p className="text-xs font-mono text-amber-400/90 font-medium">
            {item.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          {item.desc}
        </p>

        {/* Key Highlights */}
        <div className="space-y-2 pt-3 border-t border-white/10">
          {item.highlights.map((point, pIdx) => (
            <div key={pIdx} className="flex items-start space-x-2 text-xs text-slate-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
              <span className="leading-snug">{point}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Action CTA */}
      <div className="relative z-10 pt-5 mt-4 border-t border-white/[0.08]">
        <button
          onClick={() => onOpenAuth && onOpenAuth('signin', item.id === 'corporate' ? 'company' : item.id)}
          className="w-full py-2.5 px-4 rounded-xl btn-glass-outline text-xs font-mono font-bold flex items-center justify-center space-x-2 group-hover:border-[#F59E0B]/50 group-hover:text-[#F59E0B] transition-all cursor-pointer"
        >
          <span>{item.actionText}</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}

export default function BentoGrid({ onOpenAuth }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const useCases = [
    {
      id: "capstone",
      badge: "Academic Core",
      track: "Track 01",
      title: "University Capstone Projects",
      subtitle: "Balanced Student Teams • Zero Free-Riders",
      desc: "Eliminates chaotic random grouping and peer disputes. Students submit verified skills and role preferences. When professors publish project titles, the NLP engine forms balanced 4-student teams with 100% skill coverage across AI, backend, and frontend.",
      image: "/images/usecase_capstone.jpg",
      alt: "University Capstone Engineering Lab Collaborating on AI Software",
      icon: GraduationCap,
      scanLabel: "ACADEMIC TALENT MATRIX ACTIVE",
      highlights: [
        "Balanced workload & zero free-rider disputes",
        "Roles matched to students' authentic career goals",
        "Full stack coverage on all project milestones"
      ],
      actionText: "Form Capstone Squad"
    },
    {
      id: "hackathon",
      badge: "48-Hour Innovation",
      track: "Track 02",
      title: "Competitive Hackathons",
      subtitle: "60-Second Matchmaking • High Velocity",
      desc: "Assemble your winning hackathon squad in seconds. Hackers specify their problem statement track and target prototype. The AI instantly clusters frontend wizards, backend architects, and ML engineers for maximum velocity and synergy.",
      image: "/images/usecase_hackathon.jpg",
      alt: "High-Energy 48-Hour Competitive Hackathon Arena",
      icon: Rocket,
      scanLabel: "RAPID SPRINT MATCHER ACTIVE",
      highlights: [
        "Rapid 60-second teammate matchmaking",
        "Clustered by hackathon problem statement tracks",
        "Significantly higher prototype completion rates"
      ],
      actionText: "Match Hackathon Team"
    },
    {
      id: "corporate",
      badge: "Enterprise Agile",
      track: "Track 03",
      title: "Corporate Agile Squads",
      subtitle: "Internal Talent Mobility • Zero Hiring Lag",
      desc: "Empowers engineering leaders and HR directors to assemble cross-functional project pods from internal employee talent pools. The NLP engine scans internal skill profiles to deploy agile teams instantly without expensive external recruiting lag.",
      image: "/images/usecase_corporate.jpg",
      alt: "Corporate Agile Engineering Squad Sprint Planning",
      icon: Building2,
      scanLabel: "ENTERPRISE POD SYNCHRONIZER ACTIVE",
      highlights: [
        "Internal talent mobility & optimal skill utilization",
        "Zero hiring lag for urgent company initiatives",
        "Guaranteed cross-functional capability & sprint velocity"
      ],
      actionText: "Assemble Corporate Squad"
    }
  ];

  return (
    <section id="use-cases" className="py-16 lg:py-24 relative overflow-hidden text-slate-100">

      {/* Soft Ambient Background Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-purple-950/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-[#F59E0B]">
            <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span>BUILT FOR STUDENTS, HACKATHONS & ENTERPRISES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-200 tracking-tight">
            Where Our AI Team Formation Excels
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            A versatile NLP engine designed for academic coursework, 48-hour competitive hackathons, and enterprise agile engineering squads.
          </p>
        </div>

        {/* WISE & BALANCED 3-COLUMN PANORAMIC CARD DECK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {useCases.map((item) => (
            <UseCaseCard
              key={item.id}
              item={item}
              onExpand={(card) => setSelectedImage(card)}
              onOpenAuth={onOpenAuth}
            />
          ))}
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
