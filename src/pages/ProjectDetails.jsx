import { 
  ArrowLeft, 
  ArrowRight, 
  Home,
  Sparkles, 
  Clock, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Target, 
  UserCheck, 
  Zap
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { MOCK_PROJECTS } from '../data/mockProjects';
import SpotlightCard from '../components/common/SpotlightCard';
import FloatingBadge from '../components/common/FloatingBadge';
import NeuralConstellationBackground from '../components/common/NeuralConstellationBackground';

export default function ProjectDetails({ projectId, onNavigate, onBack }) {
  const { userProfile } = useUserProfile();

  const project = MOCK_PROJECTS.find(p => p.id === projectId) || MOCK_PROJECTS[0];

  const handleCheckCompatibility = () => {
    if (onNavigate) {
      onNavigate(`/project/${project.id}/compatibility`, { project });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] pb-24">
      {/* 2026 Interactive Neural Constellation & Synapse Mesh Background */}
      <NeuralConstellationBackground />

      {/* Top Header Bar */}
      <div className="relative z-20 border-b border-white/[0.08] bg-[#080B12]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-400 hover:text-white px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer group"
              title="Return to Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button
              type="button"
              onClick={onBack || (() => onNavigate('/explore-projects'))}
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Back to Projects</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">
              Stage 03 // Project Specifications
            </span>
          </div>

          <div className="text-xs font-mono text-amber-400 font-bold">
            Step 3 of 9
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-10">
        
        {/* Floating Telemetry Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Project Specification Dossier
            </span>
          </div>
          <FloatingBadge
            icon={Target}
            title="Bipartite Vector Evaluator"
            subtitle="Automated Skill & Synergy Scoring"
            badgeText="Stage 03"
            badgeColor="amber"
            animationClass="animate-float-card"
          />
        </div>

        {/* Cinematic Hero Header Card with Beam Border & Yellow Spotlight */}
        <SpotlightCard
          enableBeam={true}
          beamDuration={10}
          spotlightColor="rgba(245, 158, 11, 0.16)"
          className="p-8 sm:p-12 border-white/15 bg-[#0B0F19]/90 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Project Goal & Metadata */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-amber-500/30 text-[#F59E0B] text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                  {project.domain} Track
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                  project.status === 'Open'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}>
                  ● {project.status} ({project.openSlots} Open Vacancies)
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase leading-tight">
                {project.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {project.description}
              </p>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Duration</div>
                  <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{project.duration}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Squad Size</div>
                  <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>{project.teamSize} Members</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Open Slots</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{project.openSlots} Positions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual & Mentor Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 h-48 shadow-xl">
                <img 
                  src={project.bannerImage} 
                  alt={project.title}
                  className="w-full h-full object-cover filter contrast-105 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-transparent to-transparent" />
              </div>

              {/* Lead Mentor Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
                <img 
                  src={project.leadAvatar} 
                  alt={project.leadName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg"
                />
                <div>
                  <div className="text-xs font-bold text-white">{project.leadName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{project.leadRole}</div>
                  <div className="text-[9px] font-mono text-amber-400 mt-0.5 font-bold">Project Sponsor & Reviewer</div>
                </div>
              </div>
            </div>

          </div>
        </SpotlightCard>

        {/* Structured Details: Required Skills Matrix & Roles Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Required Skills Matrix (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <SpotlightCard enableBeam={true} beamDuration={12} className="p-6 sm:p-8 border-white/10 bg-[#0B0F19]/85 backdrop-blur-xl h-full">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  <Zap className="w-4 h-4 text-[#F59E0B]" />
                  <span>Required Skills & Target Proficiency</span>
                </div>
                <span className="text-[10px] font-mono text-amber-300 font-semibold bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Weighted Matrix
                </span>
              </div>

              <div className="space-y-3.5">
                {project.requiredSkills.map((skill) => {
                  const userHas = (userProfile.skills || []).find(
                    s => s.name.toLowerCase() === skill.name.toLowerCase()
                  );

                  return (
                    <div 
                      key={skill.name}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/30 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{skill.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                            Min: {skill.minLevel}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-1">
                          Algorithm Weight: <strong className="text-slate-200">{skill.weight}%</strong> of project competency
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {userHas ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>You: {userHas.level}</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 text-xs font-mono">
                            <span>Not in Profile</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SpotlightCard>
          </div>

          {/* Required Roles & Roadmap (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Required Roles Checklist */}
            <SpotlightCard enableBeam={true} beamDuration={14} className="p-6 sm:p-8 border-white/10 bg-[#0B0F19]/85 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold border-b border-white/[0.08] pb-4 mb-5">
                <Briefcase className="w-4 h-4 text-[#F59E0B]" />
                <span>Required Roles Checklist</span>
              </div>

              <div className="space-y-2.5">
                {project.requiredRoles.map((role, idx) => {
                  const isUserRole = (userProfile.role || '').toLowerCase() === role.toLowerCase();

                  return (
                    <div
                      key={role}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        isUserRole 
                          ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
                          : 'bg-white/[0.02] border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[11px] font-mono text-slate-400 font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white">{role}</span>
                      </div>

                      {isUserRole ? (
                        <span className="text-[10px] font-mono font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                          ★ Your Target Role
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">
                          Open Slot
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </SpotlightCard>

            {/* Milestones Roadmap */}
            <SpotlightCard enableBeam={false} className="p-6 sm:p-8 border-white/10 bg-[#0B0F19]/85 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold border-b border-white/[0.08] pb-4 mb-4">
                <Target className="w-4 h-4 text-[#F59E0B]" />
                <span>Delivery Milestones</span>
              </div>

              <div className="space-y-3">
                {project.milestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 border border-amber-500/30 font-bold">
                      {i + 1}
                    </span>
                    <span className="text-slate-300 leading-relaxed">{m}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>

        </div>

        {/* Primary Action Banner with Beam Border & Stable CTA */}
        <SpotlightCard
          enableBeam={true}
          beamDuration={8}
          spotlightColor="rgba(245, 158, 11, 0.2)"
          className="p-6 sm:p-8 border-amber-500/40 bg-gradient-to-r from-[#080B12]/95 via-[#0B0F19]/95 to-[#080B12]/95 shadow-[0_20px_50px_rgba(245,158,11,0.15)]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="font-bold">Ready for Algorithmic Analysis?</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase">
                Calculate Real-Time Compatibility
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                TeamMatch AI will simulate full bipartite matrix match, evaluate skill gaps, and suggest top candidate squads.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCheckCompatibility}
              className="relative w-full sm:w-auto px-8 py-4 rounded-2xl btn-amber-gold uppercase tracking-wider flex items-center justify-center gap-2 text-xs sm:text-sm font-black cursor-pointer shadow-xl shadow-amber-500/25 shrink-0 overflow-hidden transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-light-sweep pointer-events-none" />
              <span>Check My Compatibility</span>
              <ArrowRight className="w-4 h-4 text-[#080B12]" />
            </button>
          </div>
        </SpotlightCard>

      </div>
    </div>
  );
}
