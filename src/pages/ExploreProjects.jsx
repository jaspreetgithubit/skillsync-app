import { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Users, 
  Layers, 
  RotateCcw, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { MOCK_PROJECTS, DOMAINS, ROLES_FILTER, TEAM_SIZES, STATUSES } from '../data/mockProjects';
import { calculateCompatibility } from '../utils/compatibilityEngine';
import SpotlightCard from '../components/common/SpotlightCard';
import FloatingBadge from '../components/common/FloatingBadge';
import NeuralConstellationBackground from '../components/common/NeuralConstellationBackground';

export default function ExploreProjects({ onNavigate }) {
  const { userProfile, setActiveProjectId } = useUserProfile();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedSize, setSelectedSize] = useState('All Sizes');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  const [projectsList, setProjectsList] = useState(MOCK_PROJECTS);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Live Projects from Backend API
  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.projects) && data.projects.length > 0) {
            const normalizedBackend = data.projects.map((p, idx) => ({
              id: p.id || `proj-backend-${idx}`,
              title: p.projectTitle || p.title || 'Untitled Project',
              shortDescription: p.description || '',
              description: p.description || 'Collaborative engineering squad.',
              domain: p.domain || 'AI/ML',
              requiredSkills: (p.requiredSkills || []).map(s => typeof s === 'string' ? { name: s, weight: 20 } : s),
              requiredRoles: (p.requiredRoles || []).map(r => typeof r === 'string' ? r : (r.role || 'Full Stack Developer')),
              teamSize: Number(p.teamSize) || 4,
              openSlots: p.openSlots ?? Math.max(1, (Number(p.teamSize) || 4) - 2),
              status: p.status === 'active' ? 'Open' : (p.status || 'Open'),
              bannerImage: p.bannerImage || '/images/usecase_hackathon.jpg',
              leadName: p.leadName || p.createdBy || 'Admin Lead',
              leadAvatar: p.leadAvatar || '/images/avatars/aditya.jpg',
              leadRole: p.leadRole || 'Project Creator',
              milestones: p.milestones || ['Phase 1: Architecture Ingestion', 'Phase 2: Sprint Execution', 'Phase 3: Production Delivery']
            }));

            // Backend projects first!
            const backendIds = new Set(normalizedBackend.map(p => p.id));
            const remainingMocks = MOCK_PROJECTS.filter(m => !backendIds.has(m.id));
            setProjectsList([...normalizedBackend, ...remainingMocks]);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch /api/projects:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadProjects();
    return () => { isMounted = false; };
  }, []);

  // Multi-facet filtering logic
  const filteredProjects = useMemo(() => {
    return projectsList.filter((proj) => {
      // Search query (title, description, skills, domain, roles)
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesTitle = proj.title.toLowerCase().includes(q);
        const matchesDesc = proj.description.toLowerCase().includes(q);
        const matchesDomain = proj.domain.toLowerCase().includes(q);
        const matchesSkill = (proj.requiredSkills || []).some(s => s.name.toLowerCase().includes(q));
        const matchesRole = (proj.requiredRoles || []).some(r => r.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesDomain && !matchesSkill && !matchesRole) {
          return false;
        }
      }

      // Domain filter
      if (selectedDomain !== 'All' && proj.domain !== selectedDomain) {
        return false;
      }

      // Role filter
      if (selectedRole !== 'All Roles') {
        const hasRole = (proj.requiredRoles || []).some(r => r.toLowerCase() === selectedRole.toLowerCase());
        if (!hasRole) return false;
      }

      // Size filter
      if (selectedSize !== 'All Sizes') {
        if (selectedSize === '3–4' && (proj.teamSize < 3 || proj.teamSize > 4)) return false;
        if (selectedSize === '5' && proj.teamSize !== 5) return false;
        if (selectedSize === '6+' && proj.teamSize < 6) return false;
      }

      // Status filter
      if (selectedStatus !== 'All Statuses' && proj.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedDomain, selectedRole, selectedSize, selectedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDomain('All');
    setSelectedRole('All Roles');
    setSelectedSize('All Sizes');
    setSelectedStatus('All Statuses');
  };

  const handleSelectProject = (project) => {
    setActiveProjectId(project.id);
    if (onNavigate) {
      onNavigate(`/project/${project.id}`, { project });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] pb-24">
      {/* 2026 Interactive Neural Constellation & Synapse Mesh Background */}
      <NeuralConstellationBackground />

      {/* Top Header Bar */}
      <div className="relative z-20 border-b border-white/[0.08] bg-[#080B12]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/') : (window.location.href = '/')}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#0B0F19] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#F59E0B]" />
              <span>Back to Home</span>
            </button>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#F59E0B]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-black text-white">TeamMatch AI</span>
                <span className="text-[10px] font-mono text-amber-400 ml-2 uppercase font-bold">Project Explorer</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/profile-setup')}
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer"
            >
              <img 
                src={userProfile.avatar || '/images/avatars/aditya.jpg'} 
                alt="Avatar" 
                className="w-5 h-5 rounded-full object-cover border border-amber-400"
              />
              <span className="hidden sm:inline font-bold text-white">{userProfile.name || 'Candidate'}</span>
              <span className="text-[10px] text-amber-400 font-mono">({userProfile.role || 'Full Stack'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Editorial Section Header with Text Scramble & Floating Element */}
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-amber-500/30 text-[#F59E0B] text-[11px] font-mono uppercase tracking-wider mb-3 shadow-lg shadow-amber-500/10 backdrop-blur-md">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">Autonomous Engineering Opportunities</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              Find Your Next Team
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
              Discover projects that match your skills, interests and preferred role. Every project displays real-time algorithmic compatibility calculated directly from your profile.
            </p>
          </div>

          {/* Floating Element: Live Compatibility Telemetry */}
          <FloatingBadge
            icon={Sparkles}
            title="Real-Time Vector Match"
            subtitle="Calculated from your verified profile"
            badgeText="Active"
            badgeColor="amber"
            animationClass="animate-float-card"
            className="hidden xl:flex"
          />
        </div>

        {/* Live Search & Multi-Facet Filter Bar */}
        <div className="space-y-4 mb-10">
          {/* Instant Search Bar with Glowing Focus Ring */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, required tech skill (e.g. Python, React), role, or domain..."
              className="w-full px-4 py-3.5 pl-11 pr-10 rounded-2xl bg-[#0B0F19]/90 border border-white/[0.12] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-[#0B0F19] text-white text-sm outline-none transition-all shadow-xl shadow-black/50 placeholder:text-slate-500"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white p-0.5 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Interactive Filter Chips Row */}
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
            {/* Domain Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Domain:</span>
              {DOMAINS.map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    selectedDomain === dom
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#080B12] font-black shadow-md shadow-amber-500/25'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>

            {/* Facets: Role & Size & Status Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
              {/* Role Dropdown */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#080C14] border border-white/10 text-xs font-mono text-slate-300 focus:border-amber-500 outline-none cursor-pointer"
              >
                {ROLES_FILTER.map(r => (
                  <option key={r} value={r} className="bg-[#0B0F19]">{r}</option>
                ))}
              </select>

              {/* Team Size Dropdown */}
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#080C14] border border-white/10 text-xs font-mono text-slate-300 focus:border-amber-500 outline-none cursor-pointer"
              >
                {TEAM_SIZES.map(s => (
                  <option key={s} value={s} className="bg-[#0B0F19]">{s} Members</option>
                ))}
              </select>

              {/* Status Dropdown */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#080C14] border border-white/10 text-xs font-mono text-slate-300 focus:border-amber-500 outline-none cursor-pointer"
              >
                {STATUSES.map(st => (
                  <option key={st} value={st} className="bg-[#0B0F19]">{st}</option>
                ))}
              </select>

              {/* Reset Filters */}
              {(selectedDomain !== 'All' || selectedRole !== 'All Roles' || selectedSize !== 'All Sizes' || selectedStatus !== 'All Statuses' || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-[11px] font-mono text-rose-300 border border-rose-500/20 cursor-pointer transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => {
              const compat = calculateCompatibility(userProfile, project);

              return (
                <SpotlightCard
                  key={project.id}
                  onClick={() => handleSelectProject(project)}
                  enableBeam={true}
                  beamDuration={9 + (idx % 3) * 2}
                  spotlightColor="rgba(245, 158, 11, 0.18)"
                  className="group flex flex-col justify-between p-6 cursor-pointer border-white/[0.12] bg-[#0B0F19]/85 backdrop-blur-xl"
                >
                  <div className="space-y-4">
                    {/* Banner Image & Badges */}
                    <div className="relative h-40 -mx-6 -mt-6 overflow-hidden rounded-t-2xl border-b border-white/[0.08]">
                      <img 
                        src={project.bannerImage} 
                        alt={project.title}
                        className="w-full h-full object-cover filter contrast-105 brightness-90 group-hover:scale-105 group-hover:brightness-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-black/40 to-transparent" />

                      {/* Domain Chip & Compatibility Badge */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-[#080B12]/85 backdrop-blur-md border border-white/20 text-slate-200 text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                          {project.domain}
                        </span>

                        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-[#080B12] text-[10px] font-mono font-black tracking-wider shadow-lg shadow-amber-500/30">
                          {compat.overallScore}% MATCH
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase ${
                          project.status === 'Open'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          ● {project.status} ({project.openSlots} Open {project.openSlots === 1 ? 'Slot' : 'Slots'})
                        </span>
                      </div>
                    </div>

                    {/* Project Title & Short Description */}
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Required Skills Badges */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        Required Core Stack:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.requiredSkills.slice(0, 4).map((skill) => (
                          <span
                            key={skill.name}
                            className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300"
                          >
                            {skill.name}
                          </span>
                        ))}
                        {project.requiredSkills.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded-lg bg-white/[0.04] text-[10px] font-mono text-slate-500">
                            +{project.requiredSkills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Team Size & Action */}
                  <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{project.teamSize} Member Squad</span>
                    </div>

                    <div className="inline-flex items-center gap-1 text-[#F59E0B] group-hover:text-white font-bold transition-colors">
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <SpotlightCard className="text-center py-16 px-6 max-w-lg mx-auto border-white/10">
            <div className="h-12 w-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-slate-400 mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No Projects Match Your Current Filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              Try adjusting your search keyword, choosing "All Domains", or resetting the role and team size filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl btn-amber-gold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/25"
            >
              Reset Filters
            </button>
          </SpotlightCard>
        )}
      </div>
    </div>
  );
}
