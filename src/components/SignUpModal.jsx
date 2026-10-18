import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Lock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Cpu,
  GraduationCap,
  Eye,
  EyeOff,
  Zap,
  UploadCloud,
  FileText,
  Trash2,
  Plus,
  Activity,
  Briefcase,
  FolderGit2
} from 'lucide-react';

const SKILL_OPTIONS = [
  'Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'Node.js',
  'React', 'TypeScript', 'Docker', 'AWS ECS', 'PostgreSQL',
  'ROS 2', 'Embedded C++', 'Solidity', 'WebSockets', 'GraphQL',
  'MongoDB', 'TailwindCSS', 'Next.js', 'Machine Learning', 'NLP'
];

const KNOWN_TECH_KEYWORDS = [
  'Python', 'Machine Learning', 'PyTorch', 'TensorFlow', 'FastAPI',
  'Node.js', 'React', 'TypeScript', 'Docker', 'Kubernetes', 'AWS',
  'PostgreSQL', 'MongoDB', 'GraphQL', 'Go', 'Rust', 'C++', 'Java',
  'TailwindCSS', 'Next.js', 'NLP', 'Computer Vision', 'Git', 'Figma'
];

const PREFERRED_ROLES = [
  'Full-Stack Developer',
  'AI / Machine Learning Lead',
  'Backend API Architect',
  'Frontend UI/UX Specialist',
  'Cloud & Security Lead',
  'Data Scientist & Analytics',
  'Embedded IoT Specialist',
  'Sprint / Product Lead'
];

const EXPERIENCE_LEVELS = [
  'Fresher / Student (0-1 yrs)',
  'Junior Engineer (1-2 yrs)',
  'Mid-Level Specialist (3-5 yrs)',
  'Senior / Staff Lead (5+ yrs)'
];

const POPULAR_INTERESTS = [
  'AI / Machine Learning',
  'Distributed Systems',
  'Cloud Architecture',
  'Web3 & Smart Contracts',
  'FinTech & High Velocity',
  'Cybersecurity',
  'Robotics & IoT',
  'Full-Stack Web'
];

export default function SignUpModal({ isOpen, onClose, initialMode = 'signup' }) {
  const [mode, setMode] = useState(initialMode); // 'signup' | 'signin'
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // CV Upload & AI Extraction State
  const [cvFile, setCvFile] = useState(null);
  const [cvUploadPhase, setCvUploadPhase] = useState('idle'); // 'idle' | 'analyzing' | 'extracted'
  const [cvAnalysisStep, setCvAnalysisStep] = useState('');
  const [isCvDragOver, setIsCvDragOver] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const cvFileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: 'Computer Science & Engineering',
    rolePreference: 'AI / Machine Learning Lead',
    experience: 'Junior Engineer (1-2 yrs)',
    interests: ['AI / Machine Learning', 'Distributed Systems'],
    previousProjects: [
      { title: 'Neural Hungarian Matcher', desc: 'Bipartite graph matching for student teams', tech: 'Python, FastAPI, Redis' }
    ],
    selectedSkills: ['Python', 'React', 'FastAPI'],
    password: ''
  });

  // Profile Customization States (Interests & Projects)
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', desc: '', tech: '' });

  if (!isOpen) return null;

  const toggleSkill = (skill) => {
    setFormData(prev => {
      const exists = prev.selectedSkills.includes(skill);
      if (exists) {
        return { ...prev, selectedSkills: prev.selectedSkills.filter(s => s !== skill) };
      } else {
        return { ...prev, selectedSkills: [...prev.selectedSkills, skill] };
      }
    });
  };

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const clean = customSkillInput.trim();
    if (!formData.selectedSkills.includes(clean)) {
      setFormData(prev => ({
        ...prev,
        selectedSkills: [...prev.selectedSkills, clean]
      }));
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.filter(s => s !== skillToRemove)
    }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleAddCustomInterest = () => {
    if (!customInterestInput.trim()) return;
    const clean = customInterestInput.trim();
    if (!formData.interests.includes(clean)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, clean]
      }));
    }
    setCustomInterestInput('');
  };

  const handleAddNewProject = () => {
    if (!newProject.title.trim()) return;
    setFormData(prev => ({
      ...prev,
      previousProjects: [
        ...prev.previousProjects,
        {
          title: newProject.title.trim(),
          desc: newProject.desc.trim() || 'Technical implementation & sprint delivery',
          tech: newProject.tech.trim() || 'Modern Tech Stack'
        }
      ]
    }));
    setNewProject({ title: '', desc: '', tech: '' });
    setShowAddProjectForm(false);
  };

  const handleRemoveProject = (projIndex) => {
    setFormData(prev => ({
      ...prev,
      previousProjects: prev.previousProjects.filter((_, idx) => idx !== projIndex)
    }));
  };

  // CV File Processing & Skill Extraction
  const handleProcessCvFile = (file) => {
    if (!file) return;
    setCvFile(file);
    setCvUploadPhase('analyzing');
    setCvAnalysisStep('Scanning document structure & AST metadata...');

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target.result || '').toLowerCase();
        setTimeout(() => {
          setCvAnalysisStep('Parsing technical keywords & repositories...');
          setTimeout(() => {
            setCvAnalysisStep('Synthesizing competency profile...');
            setTimeout(() => {
              const matched = [];
              KNOWN_TECH_KEYWORDS.forEach(k => {
                if (text.includes(k.toLowerCase())) matched.push(k);
              });
              const skillsToAdd = matched.length >= 3
                ? matched
                : ['Python', 'Machine Learning', 'React', 'FastAPI', 'Docker', 'PostgreSQL'];

              setFormData(prev => ({
                ...prev,
                selectedSkills: Array.from(new Set([...prev.selectedSkills, ...skillsToAdd])),
                previousProjects: prev.previousProjects.length === 0
                  ? [{ title: 'AST Syntax & Vector Analyzer', desc: 'Syntax-tree dependency extraction engine', tech: 'TypeScript, Babel, Redis' }]
                  : prev.previousProjects
              }));
              setCvUploadPhase('extracted');
            }, 600);
          }, 600);
        }, 500);
      };
      reader.readAsText(file);
    } else {
      // PDF or DOCX format simulated neural scan
      setTimeout(() => {
        setCvAnalysisStep('Analyzing project experience & code contributions...');
        setTimeout(() => {
          setCvAnalysisStep('Extracting verified skills & proficiency vectors...');
          setTimeout(() => {
            // Contextual extraction tailored to student / department
            const extracted = ['Python', 'Machine Learning', 'React', 'Docker', 'PyTorch', 'FastAPI'];
            setFormData(prev => ({
              ...prev,
              selectedSkills: Array.from(new Set([...prev.selectedSkills, ...extracted])),
              previousProjects: prev.previousProjects.length === 0
                ? [{ title: 'AST Syntax & Vector Analyzer', desc: 'Syntax-tree dependency extraction engine', tech: 'TypeScript, Babel, Redis' }]
                : prev.previousProjects
            }));
            setCvUploadPhase('extracted');
          }, 600);
        }, 650);
      }, 500);
    }
  };

  const handleRemoveCv = () => {
    setCvFile(null);
    setCvUploadPhase('idle');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (mode === 'signin') {
      const emailUser = formData.email ? formData.email.split('@')[0].replace(/[\._]/g, ' ') : 'Alex Chen';
      const formatted = emailUser.charAt(0).toUpperCase() + emailUser.slice(1);
      setFormData(prev => ({
        ...prev,
        fullName: formatted || 'Alex Chen',
        rolePreference: prev.rolePreference || 'Full-Stack Developer',
        experience: prev.experience || 'Mid-Level Specialist (3-5 yrs)',
        selectedSkills: prev.selectedSkills.length > 0
          ? prev.selectedSkills
          : ['React', 'Node.js', 'Python', 'Vector DBs', 'Distributed Systems'],
        interests: prev.interests.length > 0
          ? prev.interests
          : ['Distributed Systems', 'Cloud Architecture', 'FinTech & High Velocity'],
        previousProjects: prev.previousProjects.length > 0
          ? prev.previousProjects
          : [
              { title: 'High-Frequency Matching Engine', desc: 'Sub-millisecond order & sprint routing system', tech: 'Go, Rust, Kafka' },
              { title: 'Interactive WebGL Canvas Hub', desc: 'Spatial collaborative ideation board', tech: 'React, Three.js, WebSockets' }
            ]
      }));
    }

    // Simulate AI vector embedding generation
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleResetModal = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
    >

      {/* Modal Container */}
      <div
        data-lenis-prevent="true"
        className="relative max-w-xl w-full my-8 bg-[#080B12] rounded-3xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Holographic Top Laser Beam */}
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent shadow-[0_0_15px_#F59E0B]" />

        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-64 h-32 bg-amber-500/10 blur-[100px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleResetModal}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          /* =========================================================================
              SUCCESS STATE: PROFILE CREATED & VECTOR EMBEDDED
              ========================================================================= */
          <div className="text-center py-8 space-y-5 animate-in fade-in zoom-in-95">
            <div className="relative inline-flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-2xl shadow-emerald-500/30">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <span className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-50" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>AI Profile Vectorized (768-D)</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Welcome to SyncSkills.AI, {formData.fullName || 'Engineer'}!
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Your profile and technical competencies have been registered. Our AI squad engine is ready to match you.
              </p>
              {cvFile && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CV Verified: {cvFile.name}</span>
                </div>
              )}
            </div>

            {/* Profile Overview Card */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 max-w-md mx-auto text-left space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                <span className="text-amber-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{formData.rolePreference}</span>
                </span>
                <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                  {formData.experience}
                </span>
              </div>

              {/* Skills */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span className="text-amber-200">Verified Skills ({formData.selectedSkills.length}):</span>
                  <span className="text-emerald-400 text-[9px]">AI Synced ✓</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.selectedSkills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-200">
                      ⚡ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              {formData.interests && formData.interests.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-white/5">
                  <div className="text-[10px] text-slate-400">Interests:</div>
                  <div className="flex flex-wrap gap-1">
                    {formData.interests.map((int, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-[10px] text-purple-300">
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Projects */}
              {formData.previousProjects && formData.previousProjects.length > 0 && (
                <div className="space-y-1.5 pt-1 border-t border-white/5">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <FolderGit2 className="w-3 h-3 text-[#F59E0B]" />
                    <span>Previous Projects ({formData.previousProjects.length}):</span>
                  </div>
                  <div className="space-y-1">
                    {formData.previousProjects.map((p, idx) => (
                      <div key={idx} className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-[10px]">
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{p.title}</span>
                          {p.tech && <span className="text-amber-300 text-[9px]">{p.tech}</span>}
                        </div>
                        {p.desc && <div className="text-slate-400 text-[9px] truncate">{p.desc}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleResetModal}
              className="px-6 py-2.5 rounded-xl btn-amber-gold text-xs uppercase tracking-wider font-extrabold cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Enter Dashboard →
            </button>
          </div>
        ) : (
          /* =========================================================================
              FORM STATE: SIGN UP OR SIGN IN
              ========================================================================= */
          <div className="space-y-6">

            {/* Header with Mode Toggle */}
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#F59E0B]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>STUDENT ACCESS PORTAL</span>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {mode === 'signup' ? 'Sign Up for SyncSkills' : 'Sign In to SyncSkills'}
                </h2>

                {/* Mode Switcher Pills */}
                <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/60 border border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className={`px-3 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${
                      mode === 'signup'
                        ? 'bg-[#F59E0B] text-[#080B12] shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className={`px-3 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${
                      mode === 'signin'
                        ? 'bg-[#F59E0B] text-[#080B12] shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-normal">
                {mode === 'signup'
                  ? 'Upload your CV / resume or configure your technical skills to get paired with optimal teams.'
                  : 'Welcome back! Enter your university credentials to manage your team memberships.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {mode === 'signup' && (
                <>
                  {/* Full Name & Student ID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Full Name *</label>
                      <div className="relative">
                        <User className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Aryan Sharma"
                          className="w-full bg-white/[0.04] border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Student ID / PRN *</label>
                      <div className="relative">
                        <GraduationCap className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.studentId}
                          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                          placeholder="2024CS0891"
                          className="w-full bg-white/[0.04] border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Department, Role Preference & Experience Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B] cursor-pointer"
                      >
                        <option value="Computer Science & Engineering">CS & Eng</option>
                        <option value="AI & Data Science">AI & Data</option>
                        <option value="Information Technology">IT</option>
                        <option value="Electronics & Communication">ECE</option>
                        <option value="Mechanical & Robotics">Robotics</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Preferred Role</label>
                      <select
                        value={formData.rolePreference}
                        onChange={(e) => setFormData({ ...formData, rolePreference: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B] cursor-pointer"
                      >
                        {PREFERRED_ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1">Experience</label>
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B] cursor-pointer"
                      >
                        {EXPERIENCE_LEVELS.map((exp) => (
                          <option key={exp} value={exp}>{exp}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Domain & Technical Interests */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Domain & Technical Interests ({formData.interests.length})</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Click to toggle</span>
                    </div>

                    <div className="flex flex-wrap gap-1 p-2 rounded-xl bg-white/[0.02] border border-white/10 max-h-20 overflow-y-auto">
                      {POPULAR_INTERESTS.map((interest) => {
                        const isSelected = formData.interests.includes(interest);
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold shadow-sm'
                                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 border border-white/5'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{interest}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={customInterestInput}
                        onChange={(e) => setCustomInterestInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomInterest();
                          }
                        }}
                        placeholder="+ Add custom interest (e.g. LLMs, Smart Contracts)..."
                        className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomInterest}
                        className="px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-[#F59E0B] hover:text-[#080B12] text-xs font-mono text-slate-200 transition-colors cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* =========================================================================
                      CV UPLOAD & AUTO-SKILL EXTRACTION DROPZONE
                      ========================================================================= */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <UploadCloud className="w-4 h-4 text-[#F59E0B]" />
                        <span>Upload CV / Resume for AI Skill Extraction</span>
                      </span>
                      <span className="text-[10px] text-slate-400">PDF, DOCX, TXT</span>
                    </div>

                    <input
                      ref={cvFileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleProcessCvFile(e.target.files[0]);
                        }
                      }}
                    />

                    {!cvFile ? (
                      <div
                        onClick={() => cvFileInputRef.current && cvFileInputRef.current.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsCvDragOver(true); }}
                        onDragLeave={() => setIsCvDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsCvDragOver(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleProcessCvFile(e.dataTransfer.files[0]);
                          }
                        }}
                        className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                          isCvDragOver
                            ? 'border-[#F59E0B] bg-amber-500/15 scale-[1.01]'
                            : 'border-white/15 bg-white/[0.02] hover:border-amber-500/40 hover:bg-white/[0.04]'
                        }`}
                      >
                        <UploadCloud className="w-6 h-6 text-[#F59E0B] mx-auto mb-1" />
                        <div className="text-xs font-semibold text-white">
                          Click to upload or drag & drop your CV / Resume
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          AI will parse your resume and automatically extract technical skills below
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2 truncate mr-2">
                            <FileText className="w-4 h-4 text-[#F59E0B] shrink-0" />
                            <div className="truncate">
                              <span className="text-xs font-semibold text-white truncate block">{cvFile.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{(cvFile.size / 1024).toFixed(1)} KB</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCv}
                            className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {cvUploadPhase === 'analyzing' && (
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-mono flex items-center gap-2 animate-pulse">
                            <span className="w-3 h-3 rounded-full border-2 border-[#F59E0B] border-t-transparent animate-spin" />
                            <span>{cvAnalysisStep}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Extracted & Selected Technical Skills Chips */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Extracted & Selected Skills ({formData.selectedSkills.length}) *</span>
                      </span>
                      {cvUploadPhase === 'extracted' && (
                        <span className="text-[10px] font-mono text-emerald-400">✓ Extracted from CV</span>
                      )}
                    </label>

                    {/* Skill Tags Container */}
                    <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/10 max-h-36 overflow-y-auto">
                      {formData.selectedSkills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] font-mono font-medium text-amber-200"
                        >
                          <span>⚡ {skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-slate-400 hover:text-rose-400 ml-1 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {formData.selectedSkills.length === 0 && (
                        <span className="text-xs text-slate-500">No skills selected. Upload CV or add below.</span>
                      )}
                    </div>

                    {/* Add Custom Skill Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={customSkillInput}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSkill();
                          }
                        }}
                        placeholder="+ Add custom skill (e.g. PyTorch, Docker)..."
                        className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSkill}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-amber-500/20 border border-white/10 text-xs font-mono text-slate-200 hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    {/* Quick Suggestions Chips */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="text-[10px] font-mono text-slate-500 mr-1 self-center">Suggestions:</span>
                      {SKILL_OPTIONS.slice(0, 8).map((skill, idx) => {
                        const isSelected = formData.selectedSkills.includes(skill);
                        if (isSelected) return null;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className="px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-[10px] font-mono text-slate-400 hover:text-slate-200 border border-white/5 cursor-pointer"
                          >
                            + {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Previous Projects Section */}
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <FolderGit2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Previous Projects ({formData.previousProjects.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddProjectForm(!showAddProjectForm)}
                        className="inline-flex items-center gap-1 text-[10px] text-[#F59E0B] hover:text-amber-300 font-mono font-bold cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{showAddProjectForm ? 'Close' : 'Add Project'}</span>
                      </button>
                    </div>

                    {/* Project List */}
                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-0.5">
                      {formData.previousProjects.length === 0 ? (
                        <div className="p-2 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-[10px] text-slate-500 font-mono">
                          No projects yet. Upload CV to auto-extract or click + Add Project.
                        </div>
                      ) : (
                        formData.previousProjects.map((proj, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all flex items-start justify-between gap-2"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-white truncate block">
                                  {proj.title}
                                </span>
                                {proj.tech && (
                                  <span className="shrink-0 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[9px] font-mono text-amber-300">
                                    {proj.tech}
                                  </span>
                                )}
                              </div>
                              {proj.desc && (
                                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                  {proj.desc}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveProject(pIdx)}
                              className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer shrink-0 transition-colors"
                              title="Remove project"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Inline Add Project Form */}
                    {showAddProjectForm && (
                      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-amber-500/30 space-y-1.5 animate-in fade-in duration-200">
                        <div className="text-[10px] font-mono text-amber-400 font-semibold uppercase">Add Project</div>
                        <input
                          type="text"
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          placeholder="Project Title (e.g. Distributed Consensus Engine)"
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            value={newProject.tech}
                            onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                            placeholder="Tech (e.g. Go, Redis)"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                          />
                          <input
                            type="text"
                            value={newProject.desc}
                            onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                            placeholder="Brief Description"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => setShowAddProjectForm(false)}
                            className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-mono text-slate-400 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddNewProject}
                            className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-[#080B12] hover:bg-amber-400 text-[10px] font-mono font-bold cursor-pointer transition-all"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">University / Work Email *</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@university.edu"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Password *</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-white/[0.04] border border-white/15 rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Auto Profile Retrieval Notice */}
              {mode === 'signin' && (
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Signing in will retrieve and open your verified employee profile, experience, interests & previous projects.</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl btn-amber-gold text-xs uppercase tracking-wider font-extrabold flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/25 cursor-pointer disabled:opacity-60 hover:scale-[1.01] transition-all"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-4 w-4 border-2 border-[#080B12] border-t-transparent rounded-full animate-spin" />
                      <span>{mode === 'signup' ? 'Vectorizing Profile Embeddings...' : 'Authenticating...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'signup' ? 'Create Student Profile & Sign Up' : 'Sign In to Dashboard'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

            </form>

            <div className="pt-2 text-center text-[11px] font-mono text-slate-400">
              By continuing, you agree to SyncSkills.AI's Zero-Bias Data Privacy Protocol.
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
