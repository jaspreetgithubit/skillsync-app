import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Rocket,
  Building2,
  BrainCircuit,
  Sparkles,
  UserPlus
} from 'lucide-react';
import SignUpModal from './SignUpModal';

export default function Navbar({ onOpenAuth, onOpenAdmin }) {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const dropdownRef = useRef(null);

  const openAuth = (mode = 'signup') => {
    if (onOpenAuth) {
      onOpenAuth(mode);
    } else {
      setAuthMode(mode);
      setIsAuthOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSolutionsOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const solutions = [
    {
      title: "Student Capstone Teams",
      desc: "Balanced team formation for university final year projects based on skills, experience & preferred roles.",
      icon: GraduationCap,
      href: "#use-cases",
      badge: "University"
    },
    {
      title: "Hackathon Squads",
      desc: "Fast 60-second matchmaking pairing complementary hackers for 48-hour hackathon challenges.",
      icon: Rocket,
      href: "#use-cases",
      badge: "Hackathon"
    },
    {
      title: "Corporate Agile Squads",
      desc: "Assemble cross-functional engineering pods from internal talent pools based on project titles.",
      icon: Building2,
      href: "#use-cases",
      badge: "Corporate"
    },
    {
      title: "NLP Skill Extraction",
      desc: "Semantic AI model extracting technical requirements from project titles & calculating compatibility.",
      icon: BrainCircuit,
      href: "#simulator",
      badge: "AI Model"
    }
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      <nav className={`w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#080B12]/85 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/80 py-3.5'
          : 'bg-[#080B12]/70 backdrop-blur-xl border-b border-white/[0.08] py-4 sm:py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          <a href="#" className="flex items-center space-x-3 group focus:outline-none">
            <div className="relative flex items-center justify-center">
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#F59E0B] shadow-[0_0_10px_#F59E0B] animate-pulse" />
              <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center shadow-lg group-hover:border-[#F59E0B]/60 transition-colors">
                <Sparkles className="h-4 w-4 text-[#F59E0B] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-slate-200 transition-colors">
                  SyncSkills
                </span>
                <span className="text-lg font-black tracking-tight text-[#F59E0B]">
                  .AI
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5 font-medium">
                AI Team Formation & Skill Matching
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <a
              href="#"
              className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              Home
            </a>

            <a
              href="#how-it-works"
              className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              How It Works
            </a>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  solutionsOpen
                    ? 'text-[#F59E0B] bg-white/[0.06] border border-[#F59E0B]/40 shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
                }`}
                aria-expanded={solutionsOpen}
              >
                <span>Tracks</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  solutionsOpen ? 'rotate-180 text-[#F59E0B]' : 'text-slate-400'
                }`} />
              </button>

              {solutionsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-84 sm:w-96 rounded-2xl bg-[#0D121E]/95 backdrop-blur-2xl border border-white/10 p-3 shadow-2xl shadow-black/90 animate-in fade-in zoom-in-95 duration-200 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#F59E0B] font-bold">
                    Team Formation Tracks
                  </div>
                  <div className="mt-1 space-y-1">
                    {solutions.map((item, idx) => {
                      const IconComponent = item.icon;
                      return (
                        <a
                          key={idx}
                          href={item.href}
                          onClick={() => setSolutionsOpen(false)}
                          className="group flex items-start space-x-3.5 p-3 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all duration-200"
                        >
                          <div className="mt-0.5 p-2 rounded-lg bg-white/[0.03] border border-white/10 text-[#F59E0B] group-hover:bg-[#F59E0B]/10 group-hover:border-[#F59E0B]/40 transition-colors shrink-0">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-white group-hover:text-[#F59E0B] transition-colors">
                                {item.title}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/10">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <a
              href="#use-cases"
              className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              Use Cases
            </a>

            <a
              href="#simulator"
              className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              Dummy Demo
            </a>
          </div>

          {/* Right-Side Desktop Auth Action Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => openAuth('signin')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={() => openAuth('signup')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl btn-amber-gold text-xs uppercase tracking-wider font-extrabold focus:outline-none cursor-pointer shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-200 hover:text-white focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="h-6 w-6 text-[#F59E0B]" /> : <Menu className="h-6 w-6 text-[#F59E0B]" />}
            </button>
          </div>

        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#080B12]/98 backdrop-blur-2xl border-b border-white/10 px-5 pt-3 pb-8 space-y-4 shadow-2xl animate-in fade-in duration-200">
            <div className="space-y-1">
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-white/[0.05] hover:text-[#F59E0B]"
              >
                Home
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-white/[0.05] hover:text-[#F59E0B]"
              >
                How It Works
              </a>
              <a
                href="#use-cases"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-white/[0.05] hover:text-[#F59E0B]"
              >
                Use Cases
              </a>
              <a
                href="#simulator"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-200 hover:bg-white/[0.05] hover:text-[#F59E0B]"
              >
                Dummy Demo
              </a>
            </div>

            <div className="pt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuth('signin');
                }}
                className="py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-200 text-xs uppercase tracking-wider font-bold hover:bg-white/10 text-center cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuth('signup');
                }}
                className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl btn-amber-gold text-xs uppercase tracking-wider font-extrabold text-center shadow-lg cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Global Student Sign Up & Authentication Modal */}
      <SignUpModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
}
