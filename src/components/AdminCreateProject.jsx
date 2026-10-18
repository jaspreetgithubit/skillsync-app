import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import {
  Sparkles,
  Briefcase,
  Users,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Search,
  Zap,
  X,
  FolderCheck,
  FolderOpen,
  BrainCircuit,
  Minus,
  Check,
  FileText
} from 'lucide-react';
import AIGraphicCanvas from './AIGraphicCanvas';
const API_BASE_URL = 'http://localhost:5000';

// Standard library of popular tech skills for autocomplete & recommendations
const SKILL_SUGGESTIONS = [
  'Python', 'Machine Learning', 'React', 'Node.js', 'FastAPI',
  'PyTorch', 'TypeScript', 'Docker', 'Kubernetes', 'AWS',
  'GraphQL', 'Go', 'Rust', 'TailwindCSS', 'PostgreSQL',
  'MongoDB', 'Solana', 'TensorFlow', 'NLP', 'Computer Vision'
];

// Standard professional team roles
const ROLE_SUGGESTIONS = [
  'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
  'ML Engineer', 'Data Scientist', 'UI/UX Designer',
  'DevOps Engineer', 'Cloud Architect', 'Product Manager', 'QA Engineer'
];

// Project inspirational templates
const TEMPLATE_INSPIRATIONS = [
  {
    title: 'AI Healthcare Assistant',
    description: 'Multimodal patient diagnostic and clinical workflow triage system utilizing HIPAA-compliant LLMs and real-time medical image parsing.',
    teamSize: 5,
    skills: [
      { name: 'Python', weight: 40 },
      { name: 'Machine Learning', weight: 30 },
      { name: 'React', weight: 20 },
      { name: 'Node.js', weight: 10 }
    ],
    roles: [
      { role: 'ML Engineer', count: 2 },
      { role: 'Frontend Developer', count: 1 },
      { role: 'Backend Developer', count: 1 },
      { role: 'Data Scientist', count: 1 }
    ]
  },
  {
    title: 'Autonomous Drone Swarm Coordinator',
    description: 'Distributed real-time aerial mesh networking engine enabling autonomous flight synchronization and obstacle avoidance.',
    teamSize: 6,
    skills: [
      { name: 'Rust', weight: 40 },
      { name: 'Computer Vision', weight: 30 },
      { name: 'Go', weight: 20 },
      { name: 'Docker', weight: 10 }
    ],
    roles: [
      { role: 'Backend Developer', count: 2 },
      { role: 'ML Engineer', count: 2 },
      { role: 'DevOps Engineer', count: 1 },
      { role: 'Full Stack Developer', count: 1 }
    ]
  },
  {
    title: 'DeFi Yield Optimizer',
    description: 'Algorithmic liquidity routing protocol maximizing vault yields across decentralized automated market makers.',
    teamSize: 4,
    skills: [
      { name: 'Solana', weight: 40 },
      { name: 'Rust', weight: 30 },
      { name: 'TypeScript', weight: 20 },
      { name: 'GraphQL', weight: 10 }
    ],
    roles: [
      { role: 'Backend Developer', count: 2 },
      { role: 'Full Stack Developer', count: 1 },
      { role: 'UI/UX Designer', count: 1 }
    ]
  }
];

export default function AdminCreateProject({ onBackToHome, onProjectCreated }) {
  // Navigation View: 'create' | 'list'
  const [activeTab, setActiveTab] = useState('create');
  const [existingProjects, setExistingProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Form Fields State - Starts clean without hardcoded placeholder data
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamSize, setTeamSize] = useState(5);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [requiredRoles, setRequiredRoles] = useState([]);

  // Skill Search State
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  // Role Search / Custom Input State
  const [roleSearch, setRoleSearch] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Submission & Validation States
  const [creationPhase, setCreationPhase] = useState('idle'); // 'idle' | 'creating' | 'validating' | 'saving' | 'complete'
  const [formError, setFormError] = useState('');
  const [successPayload, setSuccessPayload] = useState(null);

  // Mouse Parallax & 3D Tilt Refs
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const card3DRef = useRef(null);
  const preview3DRef = useRef(null);
  const magneticBtnRef = useRef(null);
  const introHeadlineRef = useRef(null);

  // Fetch Existing Projects from API
  const loadExistingProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setExistingProjects(data.projects || []);
      }
    } catch (e) {
      console.warn('Could not connect to /api/projects:', e);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    loadExistingProjects();
  }, [loadExistingProjects]);

  // Kinetic Typography Reveal Animation on Mount
  useEffect(() => {
    if (introHeadlineRef.current) {
      const words = introHeadlineRef.current.querySelectorAll('.kinetic-word');
      gsap.fromTo(words,
        { y: 35, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.09, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  // Mouse Tracking & Subtle 3D Card Tilt
  const handleMouseMove = useCallback((e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setMousePos({ x, y });

    if (card3DRef.current && window.innerWidth > 768) {
      gsap.to(card3DRef.current, {
        rotateX: -y * 2.5,
        rotateY: x * 2.5,
        transformPerspective: 1200,
        ease: 'power2.out',
        duration: 0.3
      });
    }

    if (preview3DRef.current && window.innerWidth > 768) {
      gsap.to(preview3DRef.current, {
        rotateX: -y * 3,
        rotateY: x * 3,
        transformPerspective: 1200,
        ease: 'power2.out',
        duration: 0.3
      });
    }
  }, []);

  // Magnetic Button Physics
  const handleMagneticMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.3;

    gsap.to(btn, {
      x,
      y,
      scale: 1.02,
      duration: 0.25,
      ease: 'power2.out'
    });
  };

  const handleMagneticLeave = (e) => {
    const btn = e.currentTarget;
    gsap.to(btn, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: 'elastic.out(1.2, 0.4)'
    });
  };

  // Skill Management
  const handleAddSkill = (skillName) => {
    if (!skillName || !skillName.trim()) return;
    const clean = skillName.trim();
    if (requiredSkills.some(s => s.name.toLowerCase() === clean.toLowerCase())) {
      setSkillSearch('');
      setShowSkillDropdown(false);
      return;
    }

    // Allocate default initial weight
    const newWeight = Math.max(10, Math.floor(100 / (requiredSkills.length + 1)));
    const updated = [...requiredSkills, { name: clean, weight: newWeight }];
    setRequiredSkills(updated);
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const handleRemoveSkill = (skillIndex) => {
    setRequiredSkills(prev => prev.filter((_, idx) => idx !== skillIndex));
  };

  const handleUpdateSkillWeight = (skillIndex, newWeight) => {
    setRequiredSkills(prev => {
      const updated = [...prev];
      updated[skillIndex] = { ...updated[skillIndex], weight: Number(newWeight) };
      return updated;
    });
  };

  // Role Management
  const handleAddRole = (roleName) => {
    if (!roleName || !roleName.trim()) return;
    const clean = roleName.trim();
    if (requiredRoles.some(r => r.role.toLowerCase() === clean.toLowerCase())) {
      setRoleSearch('');
      setShowRoleDropdown(false);
      return;
    }
    setRequiredRoles(prev => [...prev, { role: clean, count: 1 }]);
    setRoleSearch('');
    setShowRoleDropdown(false);
  };

  const handleRemoveRole = (roleIndex) => {
    setRequiredRoles(prev => prev.filter((_, idx) => idx !== roleIndex));
  };

  const handleUpdateRoleCount = (roleIndex, delta) => {
    setRequiredRoles(prev => {
      const updated = [...prev];
      const current = updated[roleIndex].count;
      const nextCount = Math.max(1, Math.min(15, current + delta));
      updated[roleIndex] = { ...updated[roleIndex], count: nextCount };
      return updated;
    });
  };

  // Quick Preset Inspiration
  const handleApplyTemplate = (tpl) => {
    setProjectTitle(tpl.title);
    setDescription(tpl.description);
    setTeamSize(tpl.teamSize);
    setRequiredSkills(tpl.skills);
    setRequiredRoles(tpl.roles);
    setFormError('');
  };

  // Elegant Form Completion Status Calculation
  const getStatusInfo = () => {
    if (!projectTitle.trim()) {
      return { text: 'Add project title', isReady: false };
    }
    if (requiredSkills.length === 0) {
      return { text: 'Add required skills', isReady: false };
    }
    if (requiredRoles.length === 0) {
      return { text: 'Add required roles', isReady: false };
    }
    return { text: 'Ready to Create Project', isReady: true };
  };

  const statusInfo = getStatusInfo();
  const totalConfiguredRoles = requiredRoles.reduce((sum, r) => sum + r.count, 0);

  // Form Submission Execution with 4-Phase Transition & Real API Persistence
  const handleCreateProject = async (e) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!projectTitle.trim()) {
      setFormError('Please enter a descriptive Project Title.');
      return;
    }
    if (teamSize < 2) {
      setFormError('Team size must be at least 2 members.');
      return;
    }
    if (requiredSkills.length === 0) {
      setFormError('Please add at least one Required Skill.');
      return;
    }
    if (requiredRoles.length === 0) {
      setFormError('Please configure at least one Required Role.');
      return;
    }

    const skillWeightsMap = {};
    requiredSkills.forEach(s => {
      skillWeightsMap[s.name] = s.weight;
    });

    const payload = {
      projectTitle: projectTitle.trim(),
      description: description.trim(),
      teamSize: Number(teamSize),
      requiredSkills,
      requiredRoles,
      skillWeights: skillWeightsMap,
      createdBy: 'Admin Lead',
      createdAt: new Date().toISOString()
    };

    // Phase 1: Creating Project
    setCreationPhase('creating');

    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server rejected project creation.');
      }

      const result = await res.json();
      const savedProject = result.project || payload;

      // Phase 2: Validating Requirements
      setTimeout(() => {
        setCreationPhase('validating');

        // Phase 3: Saving Project
        setTimeout(() => {
          setCreationPhase('saving');

          // Phase 4: Complete
          setTimeout(() => {
            setCreationPhase('complete');
            setSuccessPayload(savedProject);
            loadExistingProjects();

            if (onProjectCreated) {
              onProjectCreated(savedProject);
            }
          }, 600);
        }, 600);
      }, 500);

    } catch (err) {
      setCreationPhase('idle');
      setFormError(err.message || 'Failed to persist project. Please check backend connection.');
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] overflow-x-hidden flex flex-col"
    >
      {/* =========================================================================
          BACKGROUND LAYERS (OBSIDIAN #080B12, WARM AMBER & SUBTLE CYAN/VIOLET MESH)
          ========================================================================= */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 20}% ${30 + mousePos.y * 20}%, rgba(245, 158, 11, 0.10) 0%, rgba(124, 58, 237, 0.05) 45%, #080B12 85%)`
        }}
      />

      {/* Ambient Neural Particle Canvas (Subtle background, opacity-40) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <AIGraphicCanvas stage={6} mousePos={mousePos} accentColor="#F59E0B" />
      </div>

      {/* Grid Pattern Texture */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Cursor Ambient Warm Amber Light */}
      <div
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none blur-[150px] opacity-15 transition-transform duration-300 ease-out hidden md:block z-0"
        style={{
          backgroundColor: '#F59E0B',
          transform: `translate(${mousePos.x * 180 + window.innerWidth / 2 - 250}px, ${mousePos.y * 180 + window.innerHeight / 2 - 250}px)`
        }}
      />

      {/* =========================================================================
          ADMIN TOP NAVBAR
          ========================================================================= */}
      <header className="sticky top-0 z-40 px-5 sm:px-8 py-3.5 border-b border-white/5 backdrop-blur-xl bg-[#080B12]/85 flex items-center justify-between">
        {/* Left: Back to Home + Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToHome}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-[11px] uppercase tracking-widest text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Return to Home Page"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F59E0B] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-4">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-violet-600 p-[1px] shadow-md shadow-amber-500/20">
              <div className="w-full h-full bg-[#080B12] rounded-[7px] flex items-center justify-center">
                <BrainCircuit className="w-3.5 h-3.5 text-[#F59E0B]" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold tracking-wider text-white">SyncSkills<span className="text-[#F59E0B]">.AI</span></span>
              <span className="text-[10px] font-mono tracking-widest text-[#F59E0B] uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">Admin</span>
            </div>
          </div>
        </div>

        {/* Center: Live Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
          <span>PROJECT ARCHITECT // LIVE REQUIREMENTS</span>
        </div>

        {/* Right: Workspace Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] font-bold shadow-md'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            + Create Project
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] font-bold shadow-md'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <FolderCheck className="w-3.5 h-3.5" />
            <span>Projects ({existingProjects.length})</span>
          </button>
        </div>
      </header>

      {/* Top Gold Accent Line */}
      <div className="relative z-30 w-full h-[2px] bg-gradient-to-r from-amber-400 via-amber-500 to-violet-600" />

      {/* =========================================================================
          MAIN WORKSPACE CONTENT AREA
          ========================================================================= */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* -----------------------------------------------------------------------
            TAB 1: CREATE PROJECT WORKSPACE
            ----------------------------------------------------------------------- */}
        {activeTab === 'create' && (
          <div className="space-y-6">

            {/* Cinematic Page Intro */}
            <div className="text-center max-w-2xl mx-auto mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 font-mono text-[10px] text-[#F59E0B] uppercase tracking-widest mb-2.5">
                <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                <span>AI Project Architect Studio</span>
              </div>

              <div ref={introHeadlineRef} className="space-y-1 mb-2">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase overflow-hidden">
                  <span className="kinetic-word inline-block">CREATE</span>{' '}
                  <span className="kinetic-word inline-block bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">YOUR PROJECT.</span>
                </h1>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                Define the skills, roles and team you need.<br className="hidden sm:inline" />
                <span className="text-slate-400">SyncSkills.AI will take it from here.</span>
              </p>

              {/* Quick Preset Inspirations */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-[11px] font-mono text-slate-500 mr-1">Inspirations:</span>
                {TEMPLATE_INSPIRATIONS.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/40 text-[11px] text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    ⚡ {tpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Notification Alert */}
            {formError && (
              <div className="max-w-4xl mx-auto p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{formError}</span>
                </div>
                <button onClick={() => setFormError('')} className="text-rose-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Success Banner when Created */}
            {successPayload && (
              <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-in">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Project Successfully Initialized!</h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      <strong>{successPayload.projectTitle}</strong> is now registered in the SyncSkills.AI database.
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] font-mono text-emerald-300">
                      <span>Target Team: {successPayload.teamSize} Members</span>
                      <span>•</span>
                      <span>{successPayload.requiredSkills?.length || 0} Skills Configured</span>
                      <span>•</span>
                      <span>{successPayload.requiredRoles?.length || 0} Roles Configured</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    View in Project List →
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuccessPayload(null)}
                    className="p-2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 2-COLUMN DESKTOP WORKSPACE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* ===================================================================
                  LEFT COLUMN: THE INTERACTIVE CONFIGURATION FORM (7 COLS)
                  =================================================================== */}
              <div className="lg:col-span-7 space-y-5">

                <div
                  ref={card3DRef}
                  className="rounded-3xl p-6 sm:p-7 backdrop-blur-2xl bg-[#0D121E]/90 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
                >
                  {/* Glowing Top Amber Accent Border */}
                  <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent" />

                  <form onSubmit={handleCreateProject} className="space-y-5">

                    {/* 1. PROJECT TITLE */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>Project Title <span className="text-[#F59E0B]">*</span></span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Required</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          placeholder="e.g. AI Healthcare Assistant"
                          maxLength={120}
                          className="w-full px-4 py-3 pl-10 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#F59E0B] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#F59E0B]/50 text-white text-sm outline-none transition-all placeholder:text-slate-600"
                        />
                        <Sparkles className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        {projectTitle.length > 0 && (
                          <span className="absolute right-3.5 top-3.5 text-[10px] font-mono text-slate-500">
                            {projectTitle.length}/120
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2. PROJECT DESCRIPTION */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center justify-between">
                        <span>Project Description / Objectives</span>
                        <span className="text-[10px] text-slate-500 font-mono">Recommended</span>
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detail key technical deliverables, research goals, or deployment targets to help matching..."
                        rows={3}
                        maxLength={800}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#F59E0B] focus:bg-white/[0.07] focus:ring-1 focus:ring-[#F59E0B]/50 text-white text-xs sm:text-sm outline-none transition-all resize-none placeholder:text-slate-600"
                      />
                    </div>

                    {/* 3. TEAM SIZE (INTERACTIVE STEPPER) */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-mono uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>Target Team Size <span className="text-[#F59E0B]">*</span></span>
                          </label>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            How many members do you need for this project?
                          </p>
                        </div>

                        {/* Squad Typology Badge */}
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300">
                          {teamSize <= 4 ? 'Agile Squad (2-4)' : teamSize <= 7 ? 'Balanced Pod (5-7)' : 'Enterprise Cluster (8+)'}
                        </span>
                      </div>

                      {/* Stepper Controls */}
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setTeamSize(prev => Math.max(2, prev - 1))}
                          className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-lg font-bold flex items-center justify-center transition-all cursor-pointer"
                        >
                          −
                        </button>

                        <div className="flex-1 py-2 px-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center gap-2">
                          <span className="text-2xl font-black text-[#F59E0B] font-mono">{teamSize}</span>
                          <span className="text-xs uppercase font-mono text-slate-400">Members</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setTeamSize(prev => Math.min(20, prev + 1))}
                          className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-lg font-bold flex items-center justify-center transition-all cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* 4. REQUIRED SKILLS & IMPORTANCE WEIGHTS */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>Required Skills & Weights <span className="text-[#F59E0B]">*</span></span>
                        </label>
                        <span className="text-[10px] font-mono text-slate-400">
                          {requiredSkills.length} Added
                        </span>
                      </div>

                      {/* Skill Autocomplete Input & Search */}
                      <div className="relative">
                        <input
                          type="text"
                          value={skillSearch}
                          onFocus={() => setShowSkillDropdown(true)}
                          onChange={(e) => {
                            setSkillSearch(e.target.value);
                            setShowSkillDropdown(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSkill(skillSearch);
                            }
                          }}
                          placeholder="Search or type skill (e.g. Python, Machine Learning, React)..."
                          className="w-full px-4 py-2.5 pl-9 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#F59E0B] text-white text-xs sm:text-sm outline-none transition-all placeholder:text-slate-600"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />

                        {skillSearch.trim() && (
                          <button
                            type="button"
                            onClick={() => handleAddSkill(skillSearch)}
                            className="absolute right-2 top-1.5 px-2.5 py-1 rounded-lg bg-[#F59E0B] text-[#080B12] text-xs font-bold uppercase cursor-pointer hover:brightness-110"
                          >
                            Add
                          </button>
                        )}

                        {/* Suggestions Dropdown */}
                        {showSkillDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1.5 p-2 rounded-xl bg-[#0D121E] border border-white/15 shadow-2xl z-30 max-h-48 overflow-y-auto">
                            <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono uppercase text-slate-400">
                              <span>Recommended Technologies</span>
                              <button
                                type="button"
                                onClick={() => setShowSkillDropdown(false)}
                                className="text-slate-500 hover:text-slate-300"
                              >
                                Close
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 p-1">
                              {SKILL_SUGGESTIONS
                                .filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()))
                                .map((skill) => {
                                  const isSelected = requiredSkills.some(s => s.name.toLowerCase() === skill.toLowerCase());
                                  return (
                                    <button
                                      key={skill}
                                      type="button"
                                      onClick={() => handleAddSkill(skill)}
                                      disabled={isSelected}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                                        isSelected
                                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 opacity-60 cursor-default'
                                          : 'bg-white/[0.05] hover:bg-[#F59E0B]/20 hover:text-[#F59E0B] text-slate-200 border-white/5'
                                      }`}
                                    >
                                      {isSelected ? '✓ ' : '+ '} {skill}
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Selected Skill Chips with Importance Weight Slider */}
                      {requiredSkills.length === 0 ? (
                        <div className="p-4 rounded-xl border border-dashed border-white/10 text-center bg-white/[0.01]">
                          <p className="text-xs text-slate-400">No skills added yet.</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Search above or click suggestions to add technical requirements.</p>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          {requiredSkills.map((skill, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3 hover:border-amber-500/30 transition-all"
                            >
                              <div className="flex items-center gap-2 min-w-[130px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                                <span className="text-xs font-semibold text-white">{skill.name}</span>
                              </div>

                              {/* Weight Slider */}
                              <div className="flex-1 flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-400 w-12 text-right">{skill.weight}%</span>
                                <input
                                  type="range"
                                  min={5}
                                  max={80}
                                  value={skill.weight}
                                  onChange={(e) => handleUpdateSkillWeight(idx, e.target.value)}
                                  className="flex-1 accent-[#F59E0B] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(idx)}
                                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title="Remove skill"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 5. REQUIRED ROLES WITH QUANTITY */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>Required Roles & Headcounts <span className="text-[#F59E0B]">*</span></span>
                        </label>
                        <span className="text-[10px] font-mono text-slate-400">
                          Configured: <strong className={totalConfiguredRoles === teamSize ? 'text-emerald-400' : 'text-amber-400'}>{totalConfiguredRoles}</strong>/{teamSize}
                        </span>
                      </div>

                      {/* Custom Role Input */}
                      <div className="relative">
                        <input
                          type="text"
                          value={roleSearch}
                          onFocus={() => setShowRoleDropdown(true)}
                          onChange={(e) => {
                            setRoleSearch(e.target.value);
                            setShowRoleDropdown(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddRole(roleSearch);
                            }
                          }}
                          placeholder="Search or type custom role (e.g. ML Engineer, Frontend Dev)..."
                          className="w-full px-4 py-2.5 pl-9 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#F59E0B] text-white text-xs sm:text-sm outline-none transition-all placeholder:text-slate-600"
                        />
                        <Layers className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />

                        {roleSearch.trim() && (
                          <button
                            type="button"
                            onClick={() => handleAddRole(roleSearch)}
                            className="absolute right-2 top-1.5 px-2.5 py-1 rounded-lg bg-[#F59E0B] text-[#080B12] text-xs font-bold uppercase cursor-pointer hover:brightness-110"
                          >
                            Add
                          </button>
                        )}
                      </div>

                      {/* Role Suggestions Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {ROLE_SUGGESTIONS.map((role) => {
                          const isAdded = requiredRoles.some(r => r.role.toLowerCase() === role.toLowerCase());
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => isAdded ? null : handleAddRole(role)}
                              disabled={isAdded}
                              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                isAdded
                                  ? 'bg-amber-500/20 text-[#F59E0B] border border-amber-500/40 opacity-70 cursor-default'
                                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 hover:border-amber-500/30'
                              }`}
                            >
                              {isAdded ? '✓' : '+'} {role}
                            </button>
                          );
                        })}
                      </div>

                      {/* Configured Roles Stepper List */}
                      {requiredRoles.length === 0 ? (
                        <div className="p-4 rounded-xl border border-dashed border-white/10 text-center bg-white/[0.01]">
                          <p className="text-xs text-slate-400">No roles added yet.</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Click a suggestion above or type a role to assign positions.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {requiredRoles.map((r, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between hover:border-amber-500/30 transition-all"
                            >
                              <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                                {r.role}
                              </span>

                              {/* Stepper Count */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateRoleCount(idx, -1)}
                                  className="w-6 h-6 rounded bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-white flex items-center justify-center cursor-pointer"
                                >
                                  −
                                </button>
                                <span className="text-xs font-mono font-bold text-[#F59E0B] px-1">×{r.count}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateRoleCount(idx, 1)}
                                  className="w-6 h-6 rounded bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-white flex items-center justify-center cursor-pointer"
                                >
                                  +
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRole(idx)}
                                  className="ml-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* MAGNETIC SUBMIT CTA BUTTON */}
                    <div className="pt-2">
                      <button
                        ref={magneticBtnRef}
                        type="submit"
                        disabled={creationPhase !== 'idle'}
                        onMouseMove={handleMagneticMove}
                        onMouseLeave={handleMagneticLeave}
                        className={`w-full py-4 rounded-xl font-extrabold text-xs tracking-widest uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 cursor-pointer ${
                          creationPhase === 'idle'
                            ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#080B12] hover:brightness-110 shadow-amber-500/25'
                            : 'bg-amber-500/20 border border-[#F59E0B] text-amber-300 cursor-wait'
                        }`}
                      >
                        {creationPhase === 'idle' && (
                          <>
                            <span>Create Project →</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                        {creationPhase === 'creating' && (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#F59E0B] border-t-transparent animate-spin" />
                            <span>Creating Project...</span>
                          </>
                        )}
                        {creationPhase === 'validating' && (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] animate-pulse" />
                            <span>Validating Requirements...</span>
                          </>
                        )}
                        {creationPhase === 'saving' && (
                          <>
                            <BrainCircuit className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                            <span>Saving Project...</span>
                          </>
                        )}
                        {creationPhase === 'complete' && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Project Created ✓</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>

              </div>

              {/* ===================================================================
                  RIGHT COLUMN: LIVE "PROJECT REQUIREMENTS" LIST PANEL (5 COLS)
                  Clean, interactive, zero complicated graphs or node diagrams
                  =================================================================== */}
              <div className="lg:col-span-5 space-y-4">

                <div
                  ref={preview3DRef}
                  className="p-6 rounded-3xl backdrop-blur-2xl bg-[#0D121E]/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden space-y-5"
                >
                  {/* Subtle Top Glow Accent */}
                  <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B]/60 to-transparent" />

                  {/* Panel Header & Dynamic Status */}
                  <div className="space-y-3 border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                        <h2 className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
                          PROJECT REQUIREMENTS
                        </h2>
                      </div>

                      {/* Small Elegant Completion Status Indicator */}
                      <div className={`px-2.5 py-1 rounded-full border text-[10px] font-mono flex items-center gap-1.5 transition-all duration-300 ${
                        statusInfo.isReady
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}>
                        {statusInfo.isReady ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>✓ {statusInfo.text}</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span>● {statusInfo.text}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Compact Live Summary Counters */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Team</div>
                        <div className="text-xs sm:text-sm font-bold text-amber-400 font-mono mt-0.5">
                          {teamSize} Members
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Skills</div>
                        <div className="text-xs sm:text-sm font-bold text-cyan-400 font-mono mt-0.5">
                          {requiredSkills.length} Added
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Roles</div>
                        <div className="text-xs sm:text-sm font-bold text-purple-400 font-mono mt-0.5">
                          {requiredRoles.length} Added
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1. PROJECT CARD */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      PROJECT
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all">
                      <h3 className={`text-base font-bold tracking-tight ${projectTitle.trim() ? 'text-white' : 'text-slate-500 italic'}`}>
                        {projectTitle.trim() || 'Untitled Project'}
                      </h3>
                      {description.trim() ? (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {description}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-600 mt-0.5 italic">
                          No description specified
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 2. TEAM SIZE CARD */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      TEAM SIZE
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between hover:border-amber-500/30 transition-all">
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-bold text-white font-mono">{teamSize} Members</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/[0.05] border border-white/5">
                        {teamSize <= 4 ? 'Agile Squad' : teamSize <= 7 ? 'Balanced Pod' : 'Cluster'}
                      </span>
                    </div>
                  </div>

                  {/* 3. REQUIRED SKILLS LIVE LIST */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      <span>REQUIRED SKILLS</span>
                      <span>({requiredSkills.length})</span>
                    </div>

                    {requiredSkills.length === 0 ? (
                      <div className="p-4 rounded-2xl border border-dashed border-white/10 text-center bg-white/[0.01]">
                        <p className="text-xs text-slate-500">No skills added yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {requiredSkills.map((skill, idx) => (
                          <div
                            key={idx}
                            className="group p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-amber-500/40 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                                <span className="text-xs font-semibold text-white">{skill.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-amber-400">{skill.weight}%</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(idx)}
                                  className="text-slate-500 hover:text-rose-400 transition-colors p-0.5 cursor-pointer"
                                  title="Remove skill"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            {/* Weight Progress Bar */}
                            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                                style={{ width: `${skill.weight}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. REQUIRED ROLES LIVE LIST */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      <span>REQUIRED ROLES</span>
                      <span>({requiredRoles.length})</span>
                    </div>

                    {requiredRoles.length === 0 ? (
                      <div className="p-4 rounded-2xl border border-dashed border-white/10 text-center bg-white/[0.01]">
                        <p className="text-xs text-slate-500">No roles added yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {requiredRoles.map((r, idx) => (
                          <div
                            key={idx}
                            className="group p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-500/40 flex items-center justify-between transition-all duration-200"
                          >
                            <div className="flex items-center gap-2 truncate mr-2">
                              <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                              <span className="text-xs font-semibold text-white truncate">{r.role}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <div className="flex items-center bg-white/[0.06] rounded-lg border border-white/10 px-1 py-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateRoleCount(idx, -1)}
                                  className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
                                  title="Decrease count"
                                >
                                  −
                                </button>
                                <span className="px-1.5 text-xs font-mono font-bold text-purple-300">×{r.count}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateRoleCount(idx, 1)}
                                  className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
                                  title="Increase count"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveRole(idx)}
                                className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                                title="Remove role"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* -----------------------------------------------------------------------
            TAB 2: ALL PROJECTS DATABASE VIEW
            ----------------------------------------------------------------------- */}
        {activeTab === 'list' && (
          <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Active Projects Registry</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Stored in MongoDB / Local Data Store for real-time SyncSkills.AI execution.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={loadExistingProjects}
                  className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs text-slate-300 font-mono transition-colors cursor-pointer"
                >
                  Refresh Data
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 text-[#080B12] text-xs font-bold uppercase transition-all cursor-pointer hover:brightness-110"
                >
                  + Create New Project
                </button>
              </div>
            </div>

            {isLoadingProjects ? (
              <div className="py-16 text-center text-slate-400 font-mono text-sm animate-pulse">
                Fetching registered projects from API...
              </div>
            ) : existingProjects.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <FolderOpen className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No projects created yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click "+ Create Project" above to define your first squad requirements.
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-[#080B12] text-xs font-bold uppercase cursor-pointer hover:brightness-110"
                >
                  Create Project Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {existingProjects.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-5 rounded-2xl bg-[#0D121E]/80 border border-white/10 hover:border-amber-500/40 transition-all space-y-3 shadow-lg group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#F59E0B] uppercase tracking-wider">
                          Project #{idx + 1}
                        </span>
                        <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                          {p.projectTitle}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300 shrink-0">
                        {p.teamSize} Members
                      </span>
                    </div>

                    {p.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    )}

                    {/* Skills Badges */}
                    {p.requiredSkills && p.requiredSkills.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono uppercase text-slate-500">Skills</div>
                        <div className="flex flex-wrap gap-1">
                          {p.requiredSkills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-[10px] font-mono text-slate-300">
                              {s.name} {s.weight ? `(${s.weight}%)` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Roles Badges */}
                    {p.requiredRoles && p.requiredRoles.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono uppercase text-slate-500">Roles</div>
                        <div className="flex flex-wrap gap-1">
                          {p.requiredRoles.map((r, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono text-purple-300">
                              {r.role} ×{r.count}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Created: {new Date(p.createdAt || Date.now()).toLocaleDateString()}</span>
                      <span className="text-emerald-400">● Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
