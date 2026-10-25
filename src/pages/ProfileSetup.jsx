import { useState, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  Briefcase, 
  Activity, 
  Zap, 
  Plus, 
  X, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  FolderGit2, 
  ShieldCheck, 
  Search,
  Target,
  FolderPlus,
  Layers,
  BrainCircuit,
  Users,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import BorderBeam from '../components/common/BorderBeam';
import SpotlightCard from '../components/common/SpotlightCard';
import NeuralConstellationBackground from '../components/common/NeuralConstellationBackground';

const SUGGESTED_SKILLS = [
  'React', 'Node.js', 'Python', 'TypeScript', 'Docker', 
  'Kubernetes', 'Go', 'Rust', 'PyTorch', 'TailwindCSS', 
  'PostgreSQL', 'FastAPI', 'Three.js', 'Computer Vision', 
  'Cybersecurity', 'AWS', 'GraphQL', 'Next.js', 'Solidity', 'Redis'
];

const AVAILABLE_ROLES = [
  'Full Stack Developer',
  'AI / ML Researcher',
  'Backend API Lead',
  'Frontend UI/UX Specialist',
  'Cloud & DevOps Architect',
  'Data & Analytics Lead',
  'Systems & Security Engineer'
];

const INTEREST_TAGS = [
  'AI / Machine Learning',
  'Distributed Systems',
  'Cloud Architecture',
  'Web3 & Protocols',
  'FinTech & High Velocity',
  'Cybersecurity',
  'Robotics & Embedded',
  'Full-Stack Web'
];

export default function ProfileSetup({ onNavigate, onSignOut }) {
  const { userProfile, updateProfile } = useUserProfile();

  const handleBackToHome = () => {
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.location.href = '/';
    }
  };

  // Candidate Name & Email are LOCKED (derived from userProfile / Authentication)
  const candidateName = userProfile?.name || 'Alex Rivera';
  const candidateEmail = userProfile?.email || 'alex.rivera@tech.edu';

  // 1. Target Sprint Roles (Support MULTIPLE Roles)
  const [roles, setRoles] = useState(() => {
    if (Array.isArray(userProfile?.roles) && userProfile.roles.length > 0) {
      return userProfile.roles;
    }
    if (userProfile?.role) {
      const parts = userProfile.role.split(',').map(s => s.trim()).filter(Boolean);
      return parts.length > 0 ? parts : [userProfile.role];
    }
    return ['Full Stack Developer'];
  });

  const [experience, setExperience] = useState(userProfile?.experience ?? 3);

  const [skills, setSkills] = useState(
    userProfile?.skills?.length 
      ? userProfile.skills 
      : [
          { name: 'React', level: 'Strong' },
          { name: 'Node.js', level: 'Strong' },
          { name: 'Python', level: 'Medium' }
        ]
  );

  const [interests, setInterests] = useState(
    userProfile?.interests?.length 
      ? userProfile.interests 
      : ['AI / Machine Learning', 'Distributed Systems']
  );

  // 2. Multiple Projects Worked On
  const [projects, setProjects] = useState(() => {
    if (Array.isArray(userProfile?.projects) && userProfile.projects.length > 0) {
      return userProfile.projects;
    }
    if (Array.isArray(userProfile?.previousProjects) && userProfile.previousProjects.length > 0) {
      return userProfile.previousProjects;
    }
    return [
      {
        id: 'proj-1',
        title: 'Bipartite Matching Engine',
        role: 'Lead Backend & Algorithm Designer',
        techStack: 'Python, FastAPI, Redis, Docker',
        description: 'Engineered a bipartite graph matching pipeline for team formation reducing latency by 45%.'
      },
      {
        id: 'proj-2',
        title: 'Collaborative Code Workspace',
        role: 'Full Stack Engineer',
        techStack: 'React, TypeScript, WebSockets, Node.js',
        description: 'Real-time collaborative editing canvas with operational transform conflict resolution.'
      }
    ];
  });

  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mouse Spotlight Tracking for Main Unified Card
  const mainCardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMainCardMouseMove = (e) => {
    if (!mainCardRef.current) return;
    const rect = mainCardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Compute Candidate Initials (e.g. "AR")
  const initials = useMemo(() => {
    const raw = candidateName.trim();
    const parts = raw.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return raw.slice(0, 2).toUpperCase();
  }, [candidateName]);

  // Multiple Roles Selection Handler
  const handleToggleRole = (r) => {
    setRoles(prev => {
      if (prev.includes(r)) {
        if (prev.length === 1) return prev;
        return prev.filter(item => item !== r);
      } else {
        return [...prev, r];
      }
    });
  };

  // Skill Management Handlers
  const handleAddSkill = (skillName, level = 'Medium') => {
    if (!skillName || !skillName.trim()) return;
    const clean = skillName.trim();
    if (!skills.some(s => s.name.toLowerCase() === clean.toLowerCase())) {
      setSkills(prev => [...prev, { name: clean, level }]);
    }
    setSkillInput('');
    setShowSkillSuggestions(false);
  };

  const handleRemoveSkill = (skillName) => {
    setSkills(prev => prev.filter(s => s.name.toLowerCase() !== skillName.toLowerCase()));
  };

  const handleSkillLevelChange = (skillName, newLevel) => {
    setSkills(prev => prev.map(s => 
      s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, level: newLevel } : s
    ));
  };

  const handleToggleInterest = (tag) => {
    setInterests(prev => {
      const exists = prev.includes(tag);
      return exists ? prev.filter(t => t !== tag) : [...prev, tag];
    });
  };

  // Multiple Projects Handlers
  const handleAddProject = () => {
    const newId = `proj-${Date.now()}`;
    setProjects(prev => [
      ...prev,
      {
        id: newId,
        title: '',
        role: '',
        techStack: '',
        description: ''
      }
    ]);
  };

  const handleUpdateProject = (id, field, value) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleRemoveProject = (id) => {
    setProjects(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(p => p.id !== id);
    });
  };

  // Helper to call profile API with fallback to localhost:5000
  const callProfileApi = async (endpoint, payload) => {
    try {
      return await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      return await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (skills.length === 0) {
      setError('Please select or add at least one technical skill.');
      return;
    }

    if (roles.length === 0) {
      setError('Please select at least one sprint role.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const serializedProjects = projects
      .filter(p => p.title.trim())
      .map(p => `${p.title}${p.role ? ` (${p.role})` : ''}: ${p.description || p.techStack}`)
      .join(' | ');

    const payload = {
      name: candidateName,
      email: candidateEmail,
      roles,
      experience,
      skills,
      interests,
      projects
    };

    try {
      const response = await callProfileApi('/api/profile', payload);
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save profile. Please try again.');
      }

      updateProfile({
        roles,
        role: roles.join(', ') || 'Full Stack Developer',
        experience,
        skills,
        interests,
        projects,
        previousProjects: serializedProjects || 'Engineered scalable full stack systems.',
        isLocked: true
      });

      if (onNavigate) {
        onNavigate('/explore-projects');
      }
    } catch (err) {
      console.warn('Profile save warning (persisting locally):', err.message);
      // Fallback graceful navigation so user is never blocked
      updateProfile({
        roles,
        role: roles.join(', ') || 'Full Stack Developer',
        experience,
        skills,
        interests,
        projects,
        previousProjects: serializedProjects || 'Engineered scalable full stack systems.',
        isLocked: true
      });

      if (onNavigate) {
        onNavigate('/explore-projects');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSuggestions = SUGGESTED_SKILLS.filter(
    s => s.toLowerCase().includes(skillInput.toLowerCase()) && 
         !skills.some(existing => existing.name.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] pb-24 overflow-x-hidden">
      {/* 2026 Interactive Neural Constellation & Synapse Mesh Background */}
      <NeuralConstellationBackground />

      {/* Sleek Top Navigation Header: Back to Home */}
      <header className="relative z-30 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B0F19]/80 hover:bg-[#0B0F19] backdrop-blur-md border border-white/15 hover:border-amber-500/50 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all cursor-pointer shadow-lg group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#F59E0B]" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-mono text-slate-300 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">TeamMatch AI</span>
            <span className="text-amber-400 font-bold">· Stage 01</span>
          </div>

          {/* Right Corner Sign Out / Log Out Button */}
          <button
            type="button"
            onClick={() => {
              if (onSignOut) {
                onSignOut();
              } else if (onNavigate) {
                onNavigate('/');
              }
            }}
            title="Sign Out and Return to Home"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-300 hover:text-rose-200 text-xs font-mono font-bold transition-all cursor-pointer shadow-lg group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        
        {/* =========================================================================
            HERO SECTION: STATIC HEADINGS & CLEAN MODERN TAG
            ========================================================================= */}
        <div className="relative text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-amber-500/30 text-[#F59E0B] text-[11px] font-mono uppercase tracking-wider mb-3 shadow-lg shadow-amber-500/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">Neural Talent Passport · Hungarian Compatible</span>
          </div>

          {/* STATIC TITLE - CRISP & READABLE (NO SHUFFLE) */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-[0_3px_12px_rgba(0,0,0,0.8)]">
            Curate Your Talent Profile
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            Fine-tune your cognitive profile, multi-sprint roles, granular tech proficiencies, and past engineering work. TeamMatch AI calculates real-time bipartite squad equilibrium to eliminate skill gaps and social friction.
          </p>
        </div>

        {/* =========================================================================
            PILLAR 2: BEAM BORDERS + SPOTLIGHT MOUSE TRACKER (YELLOW GLOW ON BLACK)
            Single transparent glass card with:
            1. Yellow laser beam tracing around the border (BorderBeam)
            2. Yellow/Amber mouse spotlight tracking on black
            3. Background photo 100% visible through glass
            ========================================================================= */}
        <div className="space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/30 border border-rose-500/60 text-white text-xs flex items-center gap-2.5 backdrop-blur-md shadow-xl">
              <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ONE SINGLE TRANSPARENT GLASS CARD WITH BEAM BORDER & SPOTLIGHT */}
          <div 
            ref={mainCardRef}
            onMouseMove={handleMainCardMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative rounded-3xl bg-[#0B0F19]/80 backdrop-blur-xl border border-white/15 p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* 1. BEAM BORDER: Continuous Yellow/Amber Laser Beam Tracing Around The Perimeter */}
            <BorderBeam 
              duration={10} 
              colorFrom="#F59E0B"
              colorTo="transparent"
              borderWidth={1.5}
            />

            {/* 2. SPOTLIGHT MOUSE TRACKER: Yellow Glow On Black */}
            <div
              className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-0 hover:opacity-100 z-0"
              style={{
                opacity: isHovered ? 1 : 0,
                background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.16), transparent 75%)`
              }}
            />

            {/* Top Specular Amber Rim Line */}
            <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-10" />

            {/* 1. CANDIDATE IDENTITY (LOCKED & VERIFIED) */}
            <div className="relative z-10 space-y-4 pb-6 border-b border-white/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                  <span>Candidate Identity (Verified Credentials)</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 font-mono font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm">
                  <Lock className="w-3 h-3" />
                  <span>Locked & Verified</span>
                </span>
              </div>

              <div className="flex items-center gap-5">
                {/* Initials Avatar with Conic Glow */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400/30 via-cyan-500/25 to-purple-600/30 border-2 border-amber-400/60 flex items-center justify-center text-xl sm:text-2xl font-black font-mono text-amber-300 shadow-xl backdrop-blur-sm">
                    {initials}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" />
                </div>

                {/* Locked Name, Roles, Email */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-3xl font-black text-white truncate tracking-tight drop-shadow-md">
                      {candidateName}
                    </h2>
                    <span className="shrink-0 text-emerald-400" title="Verified Authentication Identity">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                  </div>

                  {/* Multiple Active Roles */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                    {roles.map((r, i) => (
                      <span key={r} className="text-xs sm:text-sm font-mono font-bold text-amber-300 drop-shadow-sm">
                        {r}{i < roles.length - 1 ? ' • ' : ''}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-xs font-mono text-slate-200 truncate mt-1 flex items-center gap-1.5 drop-shadow-sm">
                    <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    <span className="truncate">{candidateEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM SECTIONS (ALL INTEGRATED INSIDE THIS ONE GLASS CARD) */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8 pt-6">
              
              {/* SECTION 01: MULTIPLE TARGET SPRINT ROLES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    <Briefcase className="w-4 h-4 text-[#F59E0B]" />
                    <span>01 // Target Sprint Roles</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono bg-amber-500/25 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-semibold backdrop-blur-sm">
                    {roles.length} {roles.length === 1 ? 'role' : 'roles'} selected (multi-select)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {AVAILABLE_ROLES.map((r) => {
                    const isSelected = roles.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleToggleRole(r)}
                        className={`group/role relative px-4 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer border backdrop-blur-sm ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#080B12] font-black border-amber-400 shadow-lg shadow-amber-500/35 ring-2 ring-amber-400/50'
                            : 'bg-black/30 hover:bg-black/50 text-white border-white/20 hover:border-amber-500/40'
                        }`}
                      >
                        {isSelected && <span className="mr-1">✓</span>}
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 02: TECHNICAL EXPERIENCE SLIDER */}
              <div className="pt-6 border-t border-white/15 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    <Activity className="w-4 h-4 text-[#F59E0B]" />
                    <span>02 // Years of Technical Experience</span>
                  </div>
                  <span className="text-xs font-mono font-black text-[#F59E0B] bg-amber-500/25 px-3 py-1 rounded-lg border border-amber-500/40 shadow-sm backdrop-blur-sm">
                    ⚡ {experience} {experience === 1 ? 'Year' : 'Years'}
                  </span>
                </div>

                <div className="pt-2 px-1">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={experience}
                    onChange={(e) => setExperience(parseInt(e.target.value, 10))}
                    className="w-full h-2.5 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-200 mt-2 font-medium drop-shadow-sm">
                    <span className={experience <= 1 ? 'text-amber-400 font-bold' : ''}>Beginner (0-1y)</span>
                    <span className={experience >= 2 && experience <= 4 ? 'text-amber-400 font-bold' : ''}>Mid-Level (2-4y)</span>
                    <span className={experience >= 5 ? 'text-amber-400 font-bold' : ''}>Senior / Lead (5y+)</span>
                  </div>
                </div>
              </div>

              {/* SECTION 03: SKILLS & GRANULAR PROFICIENCY GRID */}
              <div className="pt-6 border-t border-white/15 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    <Zap className="w-4 h-4 text-[#F59E0B]" />
                    <span>03 // Skills & Granular Proficiency</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 font-semibold bg-amber-500/25 px-2.5 py-0.5 rounded-full border border-amber-500/40 backdrop-blur-sm">
                    {skills.length} verified tags
                  </span>
                </div>

                {/* Skill Search & Custom Skill Input */}
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.includes(',')) {
                          const parts = val.split(',').map(s => s.trim()).filter(Boolean);
                          parts.forEach(p => handleAddSkill(p, 'Medium'));
                          setSkillInput('');
                        } else {
                          setSkillInput(val);
                          setShowSkillSuggestions(true);
                        }
                      }}
                      onFocus={() => setShowSkillSuggestions(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          if (skillInput.trim()) {
                            handleAddSkill(skillInput.trim(), 'Medium');
                          }
                        }
                      }}
                      placeholder="Type any custom skill (e.g. C++, Solidity, OpenCV) and press Enter or click Add..."
                      className="w-full px-4 py-3 pl-10 pr-24 rounded-xl bg-black/40 border border-white/25 focus:border-amber-400 focus:bg-black/60 text-white text-xs sm:text-sm outline-none transition-colors placeholder:text-slate-300 backdrop-blur-sm"
                    />
                    <Search className="w-4 h-4 text-slate-300 absolute left-3.5 top-3.5 pointer-events-none" />

                    {skillInput.trim() && (
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleAddSkill(skillInput.trim(), 'Medium');
                        }}
                        onClick={() => handleAddSkill(skillInput.trim(), 'Medium')}
                        className="absolute right-2 top-2 z-20 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 border border-amber-400 text-black text-xs font-mono font-semibold cursor-pointer transition-all flex items-center gap-1 shadow-md hover:shadow-amber-500/30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Skill</span>
                      </button>
                    )}
                  </div>

                  {/* Autocomplete & Custom Skill Dropdown */}
                  {showSkillSuggestions && skillInput.trim() && (
                    <div className="absolute left-0 right-0 top-full mt-2 p-3 bg-[#0c101b]/95 border border-amber-500/50 rounded-2xl shadow-2xl z-40 max-h-60 overflow-y-auto space-y-2.5 backdrop-blur-md">
                      
                      {/* 1. Explicit Custom Skill Add Action */}
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleAddSkill(skillInput.trim(), 'Medium');
                        }}
                        onClick={() => handleAddSkill(skillInput.trim(), 'Medium')}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <span className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                          <span>Add custom skill: <strong className="text-white font-semibold">"{skillInput.trim()}"</strong></span>
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                          + Custom
                        </span>
                      </button>

                      {/* 2. Suggested Matching Skills */}
                      {filteredSuggestions.length > 0 && (
                        <div className="pt-1 border-t border-white/10 space-y-1.5">
                          <div className="text-[10px] font-mono text-slate-400 px-1 uppercase tracking-wider">
                            Suggested Matches
                          </div>
                          <div className="flex flex-wrap gap-1.5 p-1">
                            {filteredSuggestions.map((skill) => (
                              <button
                                key={skill}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleAddSkill(skill, 'Medium');
                                }}
                                onClick={() => handleAddSkill(skill, 'Medium')}
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/50 border border-white/10 text-xs font-mono text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3 text-amber-400" />
                                <span>{skill}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Add Suggestions Chips */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-300 uppercase tracking-wider drop-shadow-sm">
                    Quick Suggestions:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_SKILLS.slice(0, 10).map((skill) => {
                      const alreadyAdded = skills.some(s => s.name.toLowerCase() === skill.toLowerCase());
                      if (alreadyAdded) return null;
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleAddSkill(skill, 'Medium')}
                          className="px-2.5 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-xs font-mono text-slate-200 hover:text-white border border-white/15 transition-colors cursor-pointer backdrop-blur-sm"
                        >
                          + {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Skills Grid with Segmented Proficiency Toggle */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-mono text-slate-200 uppercase tracking-wider flex items-center justify-between drop-shadow-sm">
                    <span>Active Skills Matrix ({skills.length})</span>
                    <span className="text-[10px] text-slate-300">Configure proficiency</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl bg-black/30 border border-white/20 min-h-[90px] backdrop-blur-sm">
                    {skills.map((skill) => {
                      const isStrong = skill.level === 'Strong';
                      const isMedium = skill.level === 'Medium';
                      return (
                        <div
                          key={skill.name}
                          className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-colors shadow-sm backdrop-blur-sm ${
                            isStrong
                              ? 'bg-amber-500/30 border-amber-400/70 text-white'
                              : isMedium
                              ? 'bg-cyan-500/25 border-cyan-400/60 text-white'
                              : 'bg-black/30 border-white/20 text-slate-100'
                          }`}
                        >
                          <span className="font-mono text-xs font-bold">{skill.name}</span>
                          <span className="text-white/25">|</span>

                          {/* Segmented iOS-Style Proficiency Toggle */}
                          <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-white/20">
                            {['Basic', 'Medium', 'Strong'].map((lvl) => {
                              const active = skill.level === lvl;
                              return (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => handleSkillLevelChange(skill.name, lvl)}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                                    active && lvl === 'Strong'
                                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#080B12] font-black shadow-sm'
                                      : active && lvl === 'Medium'
                                      ? 'bg-cyan-500/40 text-cyan-200 font-bold border border-cyan-500/50'
                                      : active && lvl === 'Basic'
                                      ? 'bg-white/30 text-white font-bold'
                                      : 'text-slate-300 hover:text-white'
                                  }`}
                                >
                                  {lvl}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill.name)}
                            className="text-slate-300 hover:text-rose-400 p-0.5 cursor-pointer transition-colors"
                            title="Remove skill"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    {skills.length === 0 && (
                      <div className="w-full text-center py-4 text-xs font-mono text-slate-300">
                        No skills selected. Search above or click suggestions to add.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 04: TECHNICAL FOCUS & DOMAIN INTERESTS */}
              <div className="pt-6 border-t border-white/15 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                    <span>04 // Technical Focus & Domain Interests</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-300">Multi-Select</span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {INTEREST_TAGS.map((tag) => {
                    const isSelected = interests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleInterest(tag)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-colors cursor-pointer border backdrop-blur-sm ${
                          isSelected
                            ? 'bg-amber-500/30 border-amber-400/80 text-amber-300 font-bold shadow-md shadow-amber-500/20'
                            : 'bg-black/30 hover:bg-black/50 text-slate-200 border-white/20'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =========================================================================
                  SECTION 05: MULTIPLE PAST PROJECTS WORKED ON
                  PILLAR 2: Each Project Card uses SpotlightCard with Yellow Spotlight Mouse Tracker
                  ========================================================================= */}
              <div className="pt-6 border-t border-white/15 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    <FolderGit2 className="w-4 h-4 text-[#F59E0B]" />
                    <span>05 // Past Projects & Repositories Worked On</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 font-semibold bg-amber-500/25 px-2.5 py-0.5 rounded-full border border-amber-500/40 backdrop-blur-sm">
                    {projects.length} {projects.length === 1 ? 'Project' : 'Projects'} Logged
                  </span>
                </div>

                {/* List of Multiple Projects wrapped in Spotlight Cards */}
                <div className="space-y-4">
                  {projects.map((proj, index) => (
                    <SpotlightCard
                      key={proj.id}
                      enableBeam={true}
                      beamDuration={12 + index * 2}
                      spotlightColor="rgba(245, 158, 11, 0.15)"
                      className="p-4 sm:p-5 border-white/20 space-y-3.5"
                    >
                      <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>Project #{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                        </div>

                        {projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(proj.id)}
                            className="text-slate-300 hover:text-rose-400 transition-colors p-1 cursor-pointer flex items-center gap-1 text-[11px] font-mono"
                            title="Remove project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      {/* Project Name / Title Input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">
                          Project Name *
                        </label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => handleUpdateProject(proj.id, 'title', e.target.value)}
                          placeholder="e.g. Distributed Task Queue, Neural Search Pipeline, FinTech Ledger..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/25 focus:border-amber-400 focus:bg-black/60 text-white text-xs sm:text-sm outline-none transition-colors placeholder:text-slate-400 backdrop-blur-sm"
                        />
                      </div>

                      {/* Role in Project & Tech Stack Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">
                            Your Role in Project
                          </label>
                          <input
                            type="text"
                            value={proj.role}
                            onChange={(e) => handleUpdateProject(proj.id, 'role', e.target.value)}
                            placeholder="e.g. Backend Lead, Full Stack Engineer..."
                            className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/25 focus:border-amber-400 focus:bg-black/60 text-white text-xs outline-none transition-colors placeholder:text-slate-400 backdrop-blur-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">
                            Tech Stack Used
                          </label>
                          <input
                            type="text"
                            value={proj.techStack}
                            onChange={(e) => handleUpdateProject(proj.id, 'techStack', e.target.value)}
                            placeholder="e.g. Python, Docker, Redis, Next.js..."
                            className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/25 focus:border-amber-400 focus:bg-black/60 text-white text-xs outline-none transition-colors placeholder:text-slate-400 backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      {/* Engineering Contributions & Problem Solved */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">
                          Engineering Impact & Contributions
                        </label>
                        <textarea
                          rows="2"
                          value={proj.description}
                          onChange={(e) => handleUpdateProject(proj.id, 'description', e.target.value)}
                          placeholder="Briefly describe what was built, problem solved, and key architectural contributions..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/25 focus:border-amber-400 focus:bg-black/60 text-white text-xs outline-none transition-colors placeholder:text-slate-400 resize-none leading-relaxed backdrop-blur-sm"
                        />
                      </div>
                    </SpotlightCard>
                  ))}

                  {/* Add Another Project Button */}
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="w-full py-3 rounded-2xl border border-dashed border-white/30 hover:border-amber-500/60 bg-black/25 hover:bg-amber-500/[0.1] text-slate-100 hover:text-amber-300 text-xs font-mono font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors backdrop-blur-sm"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>+ Add Another Worked Project</span>
                  </button>
                </div>
              </div>

              {/* PRIMARY SUBMIT CTA - Rock solid, grounded, no hover movement */}
              <div className="pt-4 border-t border-white/15 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full py-4 rounded-2xl btn-amber-gold uppercase tracking-wider flex items-center justify-center gap-2 text-xs sm:text-sm font-black cursor-pointer shadow-xl shadow-amber-500/35 disabled:opacity-70 transition-colors overflow-hidden"
                >
                  {/* Subtle Light Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-light-sweep pointer-events-none" />

                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-[#080B12] border-t-transparent animate-spin" />
                      <span>Synthesizing Talent Vector (768-D)...</span>
                    </>
                  ) : (
                    <>
                      <span>Lock Profile & Explore Projects</span>
                      <ArrowRight className="w-4 h-4 text-[#080B12]" />
                    </>
                  )}
                </button>

                {/* Back to Home Secondary Option */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleBackToHome}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                    <span>Back to Home</span>
                  </button>
                </div>
              </div>

            </form>
          </div>

                </div>

        {/* =========================================================================
            "WANT TO CREATE A PROJECT?" DEDICATED SECTION
            Transferred directly from Why Are You Here with zero re-authentication
            ========================================================================= */}
        <div className="pt-12 border-t border-white/10 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F59E0B] text-xs font-mono uppercase tracking-wider shadow-lg shadow-amber-500/10">
              <Target className="w-3.5 h-3.5" />
              <span className="font-bold">Project Creator & Founder Track</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Want to Create Your Own Project?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Define your project brief, configure role weights, and assemble an autonomous high-synergy 4-person engineering pod.
            </p>
          </div>

          {/* Pinterest Pin Style Card from Why Are You Here */}
          <div 
            onClick={() => onNavigate && onNavigate('/admin')}
            className="group relative rounded-3xl border border-white/20 hover:border-amber-500/60 bg-[#0D121E]/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer transition-colors"
          >
            {/* Clean Header Bar with Badges (Photo Removed) */}
            <div className="p-6 sm:p-8 pb-0 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F59E0B] text-[11px] font-mono font-bold uppercase tracking-wider">
                <Target className="h-3.5 w-3.5 text-[#F59E0B]" />
                <span>Project Creator & Lead Track</span>
              </span>
              <div className="flex items-center space-x-1.5 text-xs font-mono text-amber-400 bg-black/60 px-3 py-1.5 rounded-lg border border-amber-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                <span>Autonomous AI Squad Assembly</span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-200 transition-colors">
                  I want to create a project
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-1.5">
                  Define your project requirements and build your ideal team.
                </p>

                {/* Visual Pipeline: Project → Specs → AI → Team */}
                <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 group-hover:border-amber-500/30 transition-colors">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#F59E0B] font-bold mb-2 flex items-center justify-between">
                    <span>Assembly Pipeline</span>
                    <span className="text-slate-400 font-normal">NLP Requirement Matrix</span>
                  </div>

                  <div className="flex items-center justify-between text-center gap-1.5 text-[11px] font-mono">
                    <div className="flex-1 py-1.5 px-1 rounded-lg bg-white/[0.04] border border-white/10">
                      <FolderPlus className="h-4 w-4 text-[#F59E0B] mx-auto mb-1" />
                      <div className="font-bold text-white text-[10px]">Project</div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-amber-500/60 shrink-0" />
                    <div className="flex-1 py-1.5 px-1 rounded-lg bg-white/[0.04] border border-white/10">
                      <Layers className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                      <div className="font-bold text-white text-[10px]">Specs</div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-amber-500/60 shrink-0" />
                    <div className="flex-1 py-1.5 px-1 rounded-lg bg-white/[0.04] border border-white/10">
                      <BrainCircuit className="h-4 w-4 text-[#F59E0B] mx-auto mb-1" />
                      <div className="font-bold text-white text-[10px]">AI</div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-amber-500/60 shrink-0" />
                    <div className="flex-1 py-1.5 px-1 rounded-lg bg-amber-500/20 border border-amber-500/40">
                      <Users className="h-4 w-4 text-amber-300 mx-auto mb-1" />
                      <div className="font-bold text-amber-200 text-[10px]">Team</div>
                    </div>
                  </div>
                </div>

                {/* Value Checkpoints */}
                <ul className="mt-4 space-y-2 text-xs text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />
                    <span>Set project title, specs & desired team size</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />
                    <span>Configure skill weights (e.g. Python 40%, React 30%)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#F59E0B] shrink-0" />
                    <span>Allocate specific roles for optimal coverage</span>
                  </li>
                </ul>
              </div>

              {/* Bottom Action CTA Button */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Authenticated Lead Mode · Direct Studio Access
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onNavigate) onNavigate('/admin');
                  }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl btn-amber-gold text-xs uppercase tracking-wider font-extrabold shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  <span>Create Project & Assemble Pod</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
