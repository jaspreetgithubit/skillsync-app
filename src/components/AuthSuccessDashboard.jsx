import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Users,
  Zap,
  LogOut,
  ArrowLeft,
  Briefcase,
  Activity,
  FolderGit2,
  Plus,
  Edit3,
  X,
  Target
} from 'lucide-react';

export default function AuthSuccessDashboard({ user, onSignOut, onBackToHome }) {
  // Local editable state populated with user's verified employee details upon sign-in
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'experience' | 'projects' | 'interests' | 'squad'

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alex Chen',
    email: user?.email || 'alex.chen@university.edu',
    role: user?.role || 'Full-Stack Developer & ML Specialist',
    experience: user?.experience || 'Mid-Level Specialist (3-5 yrs)',
    department: user?.department || (user?.goalTrack === 'company' ? 'Enterprise Talent Mobility' : 'Computer Science & AI'),
    goalTrack: user?.goalTrack || 'capstone',
    interests: user?.interests && user.interests.length > 0
      ? [...user.interests]
      : ['Distributed Systems', 'Cloud Architecture', 'FinTech & High Velocity', 'AST Code Parsing'],
    previousProjects: user?.previousProjects && user.previousProjects.length > 0
      ? [...user.previousProjects]
      : [
          { title: 'High-Frequency Matching Engine', desc: 'Sub-millisecond bipartite order & sprint routing system', tech: 'Go, Rust, Kafka' },
          { title: 'Interactive WebGL Canvas Hub', desc: 'Spatial collaborative ideation board with real-time state synchronization', tech: 'React, Three.js, WebSockets' }
        ],
    skills: user?.skills && user.skills.length > 0
      ? [...user.skills]
      : [
          { name: 'React', level: 'Expert' },
          { name: 'Python', level: 'Advanced' },
          { name: 'Node.js', level: 'Advanced' },
          { name: 'Vector DBs', level: 'Intermediate' },
          { name: 'Docker', level: 'Advanced' }
        ],
    cvName: user?.cvName || null
  });

  // State for dynamic additions
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', desc: '', tech: '' });
  const [newInterestInput, setNewInterestInput] = useState('');
  const [showEditRole, setShowEditRole] = useState(false);
  const [tempRole, setTempRole] = useState(profileData.role);
  const [tempExperience, setTempExperience] = useState(profileData.experience);

  const handleAddProject = () => {
    if (!newProject.title.trim()) return;
    setProfileData(prev => ({
      ...prev,
      previousProjects: [
        ...prev.previousProjects,
        {
          title: newProject.title.trim(),
          desc: newProject.desc.trim() || 'Verified project delivery in sprint arena',
          tech: newProject.tech.trim() || 'Full-Stack'
        }
      ]
    }));
    setNewProject({ title: '', desc: '', tech: '' });
    setShowAddProject(false);
  };

  const handleRemoveProject = (index) => {
    setProfileData(prev => ({
      ...prev,
      previousProjects: prev.previousProjects.filter((_, i) => i !== index)
    }));
  };

  const handleAddInterest = () => {
    if (!newInterestInput.trim()) return;
    if (!profileData.interests.includes(newInterestInput.trim())) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterestInput.trim()]
      }));
    }
    setNewInterestInput('');
  };

  const handleRemoveInterest = (interestToRemove) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(item => item !== interestToRemove)
    }));
  };

  const handleSaveRoleAndExp = () => {
    setProfileData(prev => ({
      ...prev,
      role: tempRole.trim() || prev.role,
      experience: tempExperience || prev.experience
    }));
    setShowEditRole(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#080B12] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden selection:bg-[#F59E0B] selection:text-[#080B12]">

      {/* Background Ambient Glows */}
      <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-900/15 blur-[180px] rounded-full pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[650px] h-[650px] bg-amber-500/10 blur-[190px] rounded-full pointer-events-none" />

      {/* Micro Grid Texture */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-400">

        {/* Top Bar Harmonized with Navbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-[#080B12]/85 border border-white/10 backdrop-blur-xl gap-3 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#F59E0B] shadow-[0_0_10px_#F59E0B] animate-pulse" />
              <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-[#F59E0B]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-lg font-black text-white">SyncSkills</span>
                <span className="text-lg font-black text-[#F59E0B]">.AI</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Employee Profile Session • Zero Skill Mismatch Engine
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 hover:border-[#F59E0B]/50 text-xs font-mono font-semibold text-[#F59E0B] flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>← Back to Landing Page</span>
              </button>
            )}

            <button
              type="button"
              onClick={onSignOut}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Hero Success Card */}
        <div className="rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden bg-[#080B12]/90 backdrop-blur-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">

          {/* Top Laser Accent (Amber Gold) */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent shadow-[0_0_15px_#F59E0B]" />

          {/* Profile Welcome Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-white/10">
            <div className="space-y-1.5 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>EMPLOYEE PROFILE OPENED UPON SIGN IN</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back, {profileData.name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-mono">
                {profileData.email} • {profileData.department}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-right font-mono shrink-0">
                <div className="text-[10px] text-amber-300 uppercase font-bold">AI Vector Profile</div>
                <div className="text-lg font-black text-white">768-D Indexed</div>
                <div className="text-[10px] text-emerald-400 font-semibold">✓ Zero Skill Mismatch</div>
              </div>
            </div>
          </div>

          {/* Navigation Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#F59E0B] text-[#080B12] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Profile Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('experience')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'experience'
                  ? 'bg-[#F59E0B] text-[#080B12] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Role & Experience ({profileData.experience.split(' ')[0]})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#F59E0B] text-[#080B12] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Previous Projects ({profileData.previousProjects.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('interests')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'interests'
                  ? 'bg-[#F59E0B] text-[#080B12] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interests & Skills ({profileData.interests.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('squad')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'squad'
                  ? 'bg-[#F59E0B] text-[#080B12] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Squad Match (98.4%)
            </button>
          </div>

          {/* =========================================================================
              1. PREFERRED ROLE & EXPERIENCE OVERVIEW (HERO CARDS)
              ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'experience') && (
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                  <Briefcase className="h-3.5 w-3.5 text-[#F59E0B]" />
                  <span>Employee Preferred Role & Experience Level</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowEditRole(!showEditRole)}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-[#F59E0B] transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{showEditRole ? 'Cancel' : 'Edit Role & Exp'}</span>
                </button>
              </div>

              {showEditRole ? (
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#F59E0B]/40 space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Preferred Role</label>
                      <input
                        type="text"
                        value={tempRole}
                        onChange={(e) => setTempRole(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Experience Level</label>
                      <select
                        value={tempExperience}
                        onChange={(e) => setTempExperience(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
                      >
                        <option value="Student / Fresher (0-1 yr)" className="bg-[#080B12]">Student / Fresher (0-1 yr)</option>
                        <option value="Junior Engineer (1-2 yrs)" className="bg-[#080B12]">Junior Engineer (1-2 yrs)</option>
                        <option value="Mid-Level Specialist (3-5 yrs)" className="bg-[#080B12]">Mid-Level Specialist (3-5 yrs)</option>
                        <option value="Senior Architect (5+ yrs)" className="bg-[#080B12]">Senior Architect (5+ yrs)</option>
                        <option value="Staff / Principal Lead (8+ yrs)" className="bg-[#080B12]">Staff / Principal Lead (8+ yrs)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowEditRole(false)}
                      className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveRoleAndExp}
                      className="px-4 py-1 rounded-lg bg-[#F59E0B] hover:bg-amber-400 text-xs font-mono font-bold text-[#080B12] cursor-pointer shadow-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                      <span>Preferred Role</span>
                      <Briefcase className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div className="text-base font-bold text-white pt-0.5">
                      {profileData.role}
                    </div>
                    <div className="text-[10px] font-mono text-amber-300">
                      Primary sprint allocation
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                      <span>Experience Level</span>
                      <Activity className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-base font-bold text-purple-200 pt-0.5">
                      {profileData.experience}
                    </div>
                    <div className="text-[10px] font-mono text-purple-400">
                      Verified competency tier
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                      <span>Operational Track</span>
                      <Target className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-base font-bold text-emerald-300 pt-0.5 uppercase">
                      {profileData.goalTrack} POD
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400">
                      {profileData.department}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              2. PREVIOUS PROJECTS SHOWCASE (WITH TITLE, TECH, DESC)
              ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'projects') && (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3.5 text-left">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                  <FolderGit2 className="h-4 w-4 text-[#F59E0B]" />
                  <span>Previous Projects & Sprint Deliveries ({profileData.previousProjects.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddProject(!showAddProject)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 text-[11px] text-amber-300 transition-all cursor-pointer font-mono"
                >
                  <Plus className="w-3 h-3" />
                  <span>{showAddProject ? 'Close' : 'Add Project'}</span>
                </button>
              </div>

              {/* Dynamic Add Project Input Form */}
              {showAddProject && (
                <div className="p-3.5 rounded-xl bg-black/50 border border-amber-500/30 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-white">Record New Previous Project</span>
                    <button type="button" onClick={() => setShowAddProject(false)} className="text-slate-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="Project Title (e.g. Distributed Event Mesh)"
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newProject.tech}
                      onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                      placeholder="Tech Stack (e.g. Go, Kafka, Kubernetes)"
                      className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                    />
                    <input
                      type="text"
                      value={newProject.desc}
                      onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                      placeholder="Key Impact / Description"
                      className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleAddProject}
                      className="px-3 py-1 rounded-lg bg-[#F59E0B] text-[#080B12] font-mono text-xs font-bold hover:bg-amber-400 cursor-pointer shadow-md"
                    >
                      + Save Project to Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {profileData.previousProjects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                          {proj.title}
                        </h4>
                        {proj.tech && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-[10px] font-mono text-amber-300">
                            {proj.tech}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer p-1"
                        title="Remove project"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {proj.desc && (
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {proj.desc}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 pt-1 border-t border-white/5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Sprint Production Delivery</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              3. TECHNICAL INTERESTS & SKILLS SHOWCASE
              ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'interests') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">

              {/* Technical Interests Card */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-purple-300 font-bold uppercase tracking-wider text-[11px]">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span>Technical & Domain Interests ({profileData.interests.length})</span>
                  </span>
                  <span className="text-purple-400 text-[10px]">Cognitive Fit ✓</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {profileData.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-200 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span className="font-semibold text-white">{interest}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="text-purple-400 hover:text-white transition-colors cursor-pointer text-xs ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Inline Add Interest */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddInterest(); }}
                    placeholder="+ Add domain interest (e.g. Distributed Consensus)"
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-mono cursor-pointer transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Verified Extracted Skills Card */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                    <Zap className="h-4 w-4 text-[#F59E0B]" />
                    <span>Verified Skills Portfolio ({profileData.skills.length})</span>
                  </span>
                  <span className="text-emerald-400 text-[10px]">AI Synced ✓</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {profileData.skills.map((skill, idx) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    const skillLevel = typeof skill === 'object' && skill.level ? skill.level : 'Verified';
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-200"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                        <span className="font-semibold text-white">{skillName}</span>
                        <span className="text-[10px] text-amber-400/80">({skillLevel})</span>
                      </span>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Extracted from verified profile AST & CV repository</span>
                  <span className="text-[#F59E0B] font-bold">100% Vector Fit</span>
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              4. ACTIVE AI SQUAD MATCHING MATRIX
              ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'squad') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Assigned Role</span>
                  <Sparkles className="h-4 w-4 text-[#F59E0B]" />
                </div>
                <div className="text-sm font-bold text-white">
                  {profileData.role}
                </div>
                <div className="text-[10px] font-mono text-[#F59E0B]">
                  High-demand sprint specialization
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Active Squad Match</span>
                  <Users className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-sm font-bold text-white">
                  {profileData.goalTrack === 'company'
                    ? 'Distributed Core Mesh Pod'
                    : profileData.goalTrack === 'college'
                    ? 'AI Peer Innovation Squad'
                    : profileData.goalTrack === 'hackathon'
                    ? 'Sub-Second DeFi Velocity Pod'
                    : 'Capstone Distributed Ledger Pod'}
                </div>
                <div className="text-[10px] font-mono text-purple-400">
                  4/4 Complementary engineers found
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Team Compatibility</span>
                  <Zap className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-sm font-bold text-emerald-400">
                  98.4% Match Score
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Balanced tech stack & velocity
                </div>
              </div>

            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 text-xs font-mono">
            <span className="text-slate-400">
              Authentication active across all SyncSkills.AI institutional nodes.
            </span>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/15 text-xs text-white font-mono transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Landing</span>
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-amber-gold text-xs uppercase tracking-wider font-extrabold cursor-pointer shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2"
              >
                <LogOut className="h-3.5 w-3.5 text-[#080B12]" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
