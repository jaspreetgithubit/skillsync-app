import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Brain,
  GraduationCap,
  Rocket,
  Building2,
  Cpu,
  Zap,
  ShieldCheck,
  Flame
} from 'lucide-react';

export default function Hero() {
  const [activeTab, setActiveTab] = useState('hackathon');
  const [isMatching, setIsMatching] = useState(false);
  const [matchingScore, setMatchingScore] = useState(98.4);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false, glareX: 50, glareY: 50 });

  const scenarios = {
    student: {
      category: 'University Capstone Project',
      projectTitle: 'AI-Powered HealthTech Diagnostic App',
      nlpExtractedSkills: ['Python', 'PyTorch', 'React', 'FastAPI', 'Docker', 'PostgreSQL'],
      members: [
        {
          name: 'Rahul Sharma',
          role: 'AI / Deep Learning Engineer',
          skills: 'Python, PyTorch, ResNet, OpenCV',
          experience: '2 Years • 4 Projects',
          matchScore: '98%',
          scoreWidth: '98%',
          accent: 'from-amber-400 to-amber-600'
        },
        {
          name: 'Priya Patel',
          role: 'Backend API Architect',
          skills: 'FastAPI, Node.js, PostgreSQL, Redis',
          experience: '1.5 Years • 3 Projects',
          matchScore: '96%',
          scoreWidth: '96%',
          accent: 'from-blue-400 to-blue-600'
        },
        {
          name: 'Amit Verma',
          role: 'Frontend UI/UX Specialist',
          skills: 'React, TypeScript, Tailwind, Recharts',
          experience: '2 Years • 5 Projects',
          matchScore: '97%',
          scoreWidth: '97%',
          accent: 'from-purple-400 to-purple-600'
        },
        {
          name: 'Sneha Reddy',
          role: 'Cloud & Security Lead',
          skills: 'Docker, AWS ECS, CI/CD, OAuth2',
          experience: '1 Year • 2 Projects',
          matchScore: '95%',
          scoreWidth: '95%',
          accent: 'from-emerald-400 to-emerald-600'
        }
      ]
    },
    hackathon: {
      category: '48-Hour Hackathon Challenge',
      projectTitle: 'Real-Time Decentralized FinTech Ledger',
      nlpExtractedSkills: ['Rust', 'WebAssembly', 'Next.js', 'Kafka', 'Smart Contracts'],
      members: [
        {
          name: 'Vikram Singh',
          role: 'Core Blockchain / Rust Lead',
          skills: 'Rust, WASM, Solana, ZK-Rollups',
          experience: '2.5 Years • 6 Hackathons',
          matchScore: '99%',
          scoreWidth: '99%',
          accent: 'from-amber-400 to-amber-600'
        },
        {
          name: 'Tanya Mehta',
          role: 'Event Streaming Engineer',
          skills: 'Node.js, Kafka, Redis, WebSockets',
          experience: '2 Years • 4 Projects',
          matchScore: '95%',
          scoreWidth: '95%',
          accent: 'from-blue-400 to-blue-600'
        },
        {
          name: 'Kabir Joshi',
          role: 'Interactive Trader UI Lead',
          skills: 'Next.js, D3.js, Tailwind, WebGL',
          experience: '1.5 Years • 5 Hackathons',
          matchScore: '97%',
          scoreWidth: '97%',
          accent: 'from-purple-400 to-purple-600'
        },
        {
          name: 'Anika Sen',
          role: 'Rapid Deployment & Cloud',
          skills: 'Docker, GCP, Terraform, Serverless',
          experience: '1 Year • 3 Hackathons',
          matchScore: '96%',
          scoreWidth: '96%',
          accent: 'from-emerald-400 to-emerald-600'
        }
      ]
    },
    corporate: {
      category: 'Corporate Agile Team Formation',
      projectTitle: 'Enterprise Cloud Portal & Microservices',
      nlpExtractedSkills: ['Kubernetes', 'Go', 'GraphQL', 'Microservices', 'Zero-Trust'],
      members: [
        {
          name: 'Devansh Malhotra',
          role: 'Cloud Native Systems Architect',
          skills: 'Kubernetes, Go, Istio, Docker',
          experience: '4 Years • Enterprise R&D',
          matchScore: '99%',
          scoreWidth: '99%',
          accent: 'from-amber-400 to-amber-600'
        },
        {
          name: 'Sneha Rathi',
          role: 'Distributed Database Specialist',
          skills: 'PostgreSQL, Redis Cluster, Cassandra',
          experience: '3.5 Years • High-Scale Apps',
          matchScore: '97%',
          scoreWidth: '97%',
          accent: 'from-blue-400 to-blue-600'
        },
        {
          name: 'Arjun Kapoor',
          role: 'Micro-Frontend Platform Lead',
          skills: 'React, TypeScript, GraphQL, Vite',
          experience: '3 Years • SaaS Products',
          matchScore: '96%',
          scoreWidth: '96%',
          accent: 'from-purple-400 to-purple-600'
        },
        {
          name: 'Nisha Varma',
          role: 'DevSecOps & Compliance Lead',
          skills: 'HashiCorp Vault, AWS, Terraform',
          experience: '3 Years • Security Audits',
          matchScore: '98%',
          scoreWidth: '98%',
          accent: 'from-emerald-400 to-emerald-600'
        }
      ]
    }
  };

  const current = scenarios[activeTab];

  const handleSimulateMatch = () => {
    setIsMatching(true);
    setTimeout(() => {
      setMatchingScore(+(97.2 + Math.random() * 1.8).toFixed(1));
      setIsMatching(false);
    }, 700);
  };

  // 3D Parallax Tilt & Specular Light Follower
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;

    setTilt({
      x: rotateX,
      y: rotateY,
      active: true,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false, glareX: 50, glareY: 50 });
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center py-12 lg:py-20 overflow-hidden">

      {/* Dynamic Ambient Color Orbs to Enhance Video Depth */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[550px] h-[550px] bg-purple-600/10 blur-[190px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* =========================================================================
              LEFT COLUMN: CLASSY HEADLINE, NLP BADGE & MICRO METRICS
              ========================================================================= */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">

            {/* Top Pill with Pulsing Laser Beacon */}
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-amber-500/30 text-xs font-mono text-[#F59E0B] shadow-lg shadow-amber-500/10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]" />
              </span>
              <span className="tracking-wide uppercase font-black text-[11px]">
                AI-Powered Project Team Formation & Skill Matching
              </span>
            </div>

            {/* Glowing High-Impact Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-200 leading-[1.08] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              Form the{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-[#F59E0B] to-amber-500 drop-shadow-[0_0_35px_rgba(245,158,11,0.45)]">
                  Perfect Project Team
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent opacity-80" />
              </span>{' '}
              with AI.
            </h1>

            {/* Subtitle with High-Contrast Typography */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] bg-[#080B12]/40 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              Students create profiles with their <strong className="text-slate-200 font-semibold">skills, experience, interests, and preferred roles</strong>. When a project title is given, our <strong className="text-[#F59E0B] font-bold">NLP AI model</strong> extracts required skills, calculates compatibility scores, and recommends the best balanced team.
            </p>

            {/* 3 Interactive Track Tiles with Subtle Neon Glare */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0">
              <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/15 hover:border-amber-500/50 transition-all duration-300 group hover:-translate-y-0.5 shadow-lg">
                <div className="h-7 w-7 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-[#F59E0B] mx-auto mb-1.5 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-[#F59E0B] transition-colors">Student Projects</div>
                <div className="text-[10px] font-mono text-slate-300">University Capstone</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/15 hover:border-amber-500/50 transition-all duration-300 group hover:-translate-y-0.5 shadow-lg">
                <div className="h-7 w-7 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform">
                  <Rocket className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-[#F59E0B] transition-colors">Hackathons</div>
                <div className="text-[10px] font-mono text-slate-300">48h Rapid Teams</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/15 hover:border-amber-500/50 transition-all duration-300 group hover:-translate-y-0.5 shadow-lg">
                <div className="h-7 w-7 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-[#F59E0B] transition-colors">Corporate</div>
                <div className="text-[10px] font-mono text-slate-300">Agile Squads</div>
              </div>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-2xl btn-amber-gold text-xs uppercase tracking-wider font-black shadow-xl shadow-amber-500/25 focus:outline-none cursor-pointer group"
              >
                <span>Explore Matching Flow</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#simulator"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 hover:border-[#F59E0B]/60 text-xs uppercase tracking-wider font-bold text-slate-200 hover:text-white transition-all backdrop-blur-md cursor-pointer"
              >
                <Brain className="h-4 w-4 text-[#F59E0B] animate-pulse" />
                <span>Try Live NLP Demo</span>
              </a>
            </div>

            {/* Live Micro HUD Metric Pills */}
            <div className="pt-2 flex items-center justify-center lg:justify-start space-x-4 text-xs font-mono text-slate-300">
              <div className="flex items-center space-x-1.5">
                <Zap className="h-3.5 w-3.5 text-[#F59E0B]" />
                <span>18ms Latency</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>98.4% Accuracy</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center space-x-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span>1,200+ Profiles</span>
              </div>
            </div>

          </div>

          {/* =========================================================================
              RIGHT COLUMN: ULTRA-CLASSY SIMULATION CONSOLE WITH 3D TILT & LASER SCAN
              ========================================================================= */}
          <div className="lg:col-span-6 relative">

            {/* Ambient Backlight Glow behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-purple-600/15 to-amber-500/20 rounded-3xl blur-2xl opacity-75 pointer-events-none" />

            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transform: 'none' }}
              className="relative rounded-3xl p-5 sm:p-6 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-md bg-black/25 overflow-hidden"
            >

              {/* Dynamic Specular Glare Follows Cursor */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl z-10"
                style={{
                  background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(245, 158, 11, 0.18) 0%, transparent 60%)`,
                  opacity: tilt.active ? 1 : 0
                }}
              />

              {/* Animated Holographic Laser Scan Line */}
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent animate-laser-scan pointer-events-none shadow-[0_0_15px_#F59E0B] z-20" />

              {/* Card Header Bar: Track Switchers & Match AI Button */}
              <div className="relative z-20 flex items-center justify-between pb-3.5 border-b border-white/10 gap-2">

                {/* 3 Scenario Switcher Pills */}
                <div className="flex items-center space-x-1 sm:space-x-1.5 bg-black/25 backdrop-blur-sm p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setActiveTab('student')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      activeTab === 'student'
                        ? 'bg-[#F59E0B] text-[#080B12] shadow-md shadow-amber-500/20 font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Student Capstone
                  </button>
                  <button
                    onClick={() => setActiveTab('hackathon')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      activeTab === 'hackathon'
                        ? 'bg-[#F59E0B] text-[#080B12] shadow-md shadow-amber-500/20 font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Hackathon
                  </button>
                  <button
                    onClick={() => setActiveTab('corporate')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      activeTab === 'corporate'
                        ? 'bg-[#F59E0B] text-[#080B12] shadow-md shadow-amber-500/20 font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Corporate
                  </button>
                </div>

                {/* Match AI Action Button */}
                <button
                  onClick={handleSimulateMatch}
                  disabled={isMatching}
                  title="Re-run AI Matching Algorithm"
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-[#F59E0B]/40 hover:border-[#F59E0B] text-[#F59E0B] hover:text-amber-300 transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-amber-500/10"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isMatching ? 'animate-spin' : ''}`} />
                  <span className="text-[11px] font-mono font-bold">Match AI</span>
                </button>
              </div>

              {/* 1. Project Title & Extracted Skills Box */}
              <div className="relative z-20 py-3 border-b border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center space-x-1.5">
                    <Cpu className="h-3 w-3 text-[#F59E0B]" />
                    <span>1. Given Project Title</span>
                  </span>

                  <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-[#F59E0B]/40 text-[11px] font-mono text-[#F59E0B] shadow-sm shadow-amber-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                    <span className="font-bold">{matchingScore}% Team Match</span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide">
                  "{current.projectTitle}"
                </div>

                <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 pt-0.5">
                  <span className="text-[10px] font-mono text-[#F59E0B] font-bold">NLP Skills:</span>
                  {current.nlpExtractedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[9.5px] font-mono text-amber-200 bg-white/[0.05] hover:bg-amber-500/15 px-2 py-0.5 rounded-md border border-white/10 hover:border-amber-500/30 transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. Recommended 4-Person Squad with Progress Dials */}
              <div className="relative z-20 mt-3.5">
                <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wider font-bold mb-2.5 flex items-center justify-between">
                  <span>2. AI Recommended Team Members (Matched by Profile):</span>
                  <span className="text-emerald-400 text-[9px] font-mono font-bold">Zero Bias</span>
                </div>

                <div className="space-y-2.5">
                  {current.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-[#F59E0B]/50 transition-all duration-300 flex items-center justify-between gap-3 group shadow-md"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {/* Glowing Avatar Initial */}
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-[#F59E0B]/40 flex items-center justify-center font-black text-xs text-[#F59E0B] shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                          {member.name.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-[#F59E0B] transition-colors truncate">
                              {member.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                              • {member.experience}
                            </span>
                          </div>

                          <div className="text-[11px] text-amber-400 font-semibold truncate">
                            {member.role}
                          </div>

                          <div className="text-[10px] text-slate-300 font-mono truncate">
                            Skills: {member.skills}
                          </div>
                        </div>
                      </div>

                      {/* Match Score & Mini Visual Progress Meter */}
                      <div className="text-right shrink-0 min-w-[70px]">
                        <div className="text-xs font-mono font-black text-[#F59E0B]">
                          {member.matchScore}
                        </div>
                        <div className="text-[8.5px] font-mono text-slate-400 uppercase">
                          Compatibility
                        </div>
                        {/* Mini glowing progress line */}
                        <div className="w-full bg-white/10 rounded-full h-1 mt-1 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-emerald-400 h-1 rounded-full"
                            style={{ width: member.scoreWidth }}
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Status Assurance */}
              <div className="relative z-20 mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="text-[10.5px] text-slate-200">100% Required Skills Covered</span>
                </div>
                <div className="text-[10.5px] text-[#F59E0B] font-bold">
                  Zero Skill Mismatch • Ready
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
