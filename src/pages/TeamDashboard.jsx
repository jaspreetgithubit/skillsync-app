import { useState } from 'react';
import { 
  ArrowLeft, 
  Home,
  Users, 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  UserPlus, 
  Target
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { MOCK_PROJECTS } from '../data/mockProjects';
import { getTeamsForProject } from '../data/mockTeams';
import { MOCK_CANDIDATES } from '../data/mockCandidates';
import SpotlightCard from '../components/common/SpotlightCard';
import FloatingBadge from '../components/common/FloatingBadge';
import NeuralConstellationBackground from '../components/common/NeuralConstellationBackground';
import TeamChatDrawer from '../components/dashboard/TeamChatDrawer';

export default function TeamDashboard({ projectId, teamId, onNavigate }) {
  const { userProfile } = useUserProfile();

  const project = MOCK_PROJECTS.find(p => p.id === projectId) || MOCK_PROJECTS[0];
  const allTeams = getTeamsForProject(project.id, userProfile);
  const initialTeam = allTeams.find(t => t.id === teamId) || allTeams[0];

  // Dynamic Roster State (allowing live member removal & replacement simulation)
  const [roster, setRoster] = useState(() => {
    // Include the user as an active confirmed member!
    const userMember = {
      id: 'user-self',
      name: userProfile.name,
      avatar: userProfile.avatar || '/images/avatars/aditya.jpg',
      assignedRole: initialTeam.openRole || userProfile.role,
      coreSkills: (userProfile.skills || []).map(s => typeof s === 'string' ? s : s.name),
      experience: `${userProfile.experience} yrs`,
      compatibility: 98,
      isSelf: true
    };
    return [...initialTeam.members, userMember];
  });

  const [removedMemberInfo, setRemovedMemberInfo] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [contactModalMember, setContactModalMember] = useState(null);

  // Dynamic metrics based on current roster count
  const isFull = roster.length >= initialTeam.maxMembers;
  const teamHealth = isFull ? initialTeam.overallScore : Math.max(72, initialTeam.overallScore - 18);

  // Candidate pool for replacement (find candidate who matches removed role)
  const replacementCandidate = removedMemberInfo 
    ? MOCK_CANDIDATES.find(c => c.role.toLowerCase() === removedMemberInfo.assignedRole.toLowerCase() && !roster.some(r => r.id === c.id)) || MOCK_CANDIDATES[0]
    : null;

  const handleRemoveMember = (member) => {
    if (member.isSelf) {
      alert('You cannot remove yourself from your confirmed team.');
      return;
    }
    setRemovedMemberInfo(member);
    setRoster(prev => prev.filter(m => m.id !== member.id));
  };

  const handleAddReplacement = (candidate) => {
    const newMember = {
      id: candidate.id,
      name: candidate.name,
      avatar: candidate.avatar,
      assignedRole: candidate.role,
      coreSkills: candidate.skills.map(s => s.name),
      experience: candidate.experience,
      compatibility: candidate.compatibility
    };

    setRoster(prev => [...prev, newMember]);
    setRemovedMemberInfo(null);
  };

  return (
    <div className="relative min-h-screen bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] pb-24">
      {/* 2026 Interactive Code-Based Animations (Zero Video Backgrounds) */}
      <NeuralConstellationBackground />

      {/* Interactive Sliding Chat Drawer */}
      <TeamChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        teamName={initialTeam.name}
        initialMessages={initialTeam.chatMessages}
      />

      {/* Contact Member Modal */}
      {contactModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <SpotlightCard className="max-w-md w-full p-6 border-white/10 space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src={contactModalMember.avatar}
                alt={contactModalMember.name}
                className="w-12 h-12 rounded-2xl object-cover border border-amber-400"
              />
              <div>
                <h4 className="text-base font-bold text-white">{contactModalMember.name}</h4>
                <div className="text-xs font-mono text-amber-400 font-bold">{contactModalMember.assignedRole}</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Institutional email dispatched. You can also message this member directly inside the encrypted squad chat room.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setContactModalMember(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setContactModalMember(null);
                  setIsChatOpen(true);
                }}
                className="px-4 py-2 rounded-xl btn-amber-gold text-xs font-mono uppercase cursor-pointer"
              >
                Open Team Chat
              </button>
            </div>
          </SpotlightCard>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="relative z-20 border-b border-white/[0.08] bg-[#080B12]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer group"
              title="Return to Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/explore-projects')}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Project Hub</span>
            </button>

            <span className="text-white/20 hidden sm:inline">|</span>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-bold">{initialTeam.name}</span>
              <span className="text-slate-400">({project.title})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-amber-gold uppercase text-xs font-mono transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#080B12]" />
              <span>Team Chat ({initialTeam.chatMessages?.length || 3})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8">

        {/* TEAM OVERVIEW HEADER with Text Scramble and Floating Badge */}
        <div className="flex items-center justify-between">
          <div></div>
          <FloatingBadge
            icon={Users}
            title="Active Sprint Node"
            subtitle="Optimal Squad Dynamic Confirmed"
            badgeText="Sprint Live"
            badgeColor="emerald"
            animationClass="animate-float-card"
          />
        </div>

        <SpotlightCard 
          enableBeam={true}
          beamDuration={10}
          spotlightColor="rgba(245, 158, 11, 0.16)"
          className="p-6 sm:p-10 border-white/15 bg-[#0B0F19]/90 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 8 cols: Project Goal & Milestones */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                  ● Active Sprint Squad
                </span>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-amber-500/30 text-amber-300 text-xs font-mono uppercase font-bold">
                  {project.domain} Engineering
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
                {initialTeam.name} // Workspace Hub
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                <strong className="text-white">Project Objective:</strong> {project.description}
              </p>

              {/* Role Coverage Tags */}
              <div className="space-y-1.5 pt-2">
                <div className="text-[10px] font-mono uppercase text-slate-400">Current Role Coverage:</div>
                <div className="flex flex-wrap gap-2">
                  {project.requiredRoles.map((role) => {
                    const isCovered = roster.some(m => m.assignedRole.toLowerCase().includes(role.toLowerCase()) || role.toLowerCase().includes(m.assignedRole.toLowerCase()));

                    return (
                      <span
                        key={role}
                        className={`px-2.5 py-1 rounded-xl text-xs font-mono flex items-center gap-1.5 ${
                          isCovered
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-500/10 border border-rose-500/30 text-rose-300 animate-pulse'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{role}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 4 cols: Team Health Metric */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-center space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Overall Squad Health
              </div>

              <div className="text-4xl sm:text-5xl font-black font-mono text-amber-400">
                {teamHealth}%
              </div>

              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    teamHealth >= 90 ? 'bg-gradient-to-r from-amber-400 to-emerald-400' : 'bg-amber-500'
                  }`}
                  style={{ width: `${teamHealth}%` }}
                />
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                {isFull ? '✓ Full Cognitive Equilibrium' : '⚠ Missing 1 Crucial Role Slot'}
              </div>
            </div>

          </div>
        </SpotlightCard>

        {/* MEMBER SWAP / REPLACEMENT SIMULATOR BANNER */}
        {removedMemberInfo && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-transparent border border-amber-500/40 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Dynamic Recalculation Alert // Squad Incomplete</span>
                </div>
                <div className="text-sm font-bold text-white">
                  Missing Role: <span className="text-amber-300 font-mono">{removedMemberInfo.assignedRole}</span> | Missing Skill: <span className="text-amber-400 font-mono">{removedMemberInfo.coreSkills[0]}</span>
                </div>
                <p className="text-xs text-slate-400">
                  {removedMemberInfo.name} was removed from the squad. Algorithm has located an optimal drop-in replacement candidate.
                </p>
              </div>
            </div>

            {/* Recommended Replacement Candidate Card with Beam Border */}
            {replacementCandidate && (
              <SpotlightCard enableBeam={true} beamDuration={7} className="p-4 sm:p-5 border-amber-500/40 bg-[#080B12]/95 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={replacementCandidate.avatar}
                    alt={replacementCandidate.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{replacementCandidate.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                        {replacementCandidate.compatibility}% Match
                      </span>
                    </div>
                    <div className="text-xs font-mono text-amber-400">{replacementCandidate.role} · {replacementCandidate.experience} exp</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{replacementCandidate.bio}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddReplacement(replacementCandidate)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-amber-gold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <UserPlus className="w-4 h-4 text-[#080B12]" />
                  <span>Add Replacement & Restore Metrics</span>
                </button>
              </SpotlightCard>
            )}
          </div>
        )}

        {/* ACTIVE ROSTER SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Users className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-bold">Active Squad Members ({roster.length} / {initialTeam.maxMembers})</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Hover member to simulate swap or contact
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roster.map((member) => (
              <SpotlightCard
                key={member.id}
                enableBeam={member.isSelf}
                beamDuration={12}
                spotlightColor="rgba(245, 158, 11, 0.16)"
                className={`p-6 border bg-[#0B0F19]/85 backdrop-blur-xl space-y-4 ${
                  member.isSelf 
                    ? 'border-amber-500/60 bg-amber-950/20 shadow-[0_15px_35px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/40' 
                    : 'border-white/10 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-white/20 shadow-md"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#080B12]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{member.name}</span>
                        {member.isSelf && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-amber-400 font-bold">{member.assignedRole}</div>
                      <div className="text-[10px] font-mono text-slate-400">{member.experience}</div>
                    </div>
                  </div>

                  {/* Remove Button for testing replacement simulator */}
                  {!member.isSelf && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member)}
                      title="Simulate member drop-out and recalculate squad"
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Core Skills Chips */}
                <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Core Skills:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.coreSkills.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Member Interaction Controls */}
                <div className="pt-2 flex items-center justify-between border-t border-white/[0.06] text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setContactModalMember(member)}
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Contact Member</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsChatOpen(true)}
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-white font-bold transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* PROJECT MILESTONES & ROADMAP TRACKER */}
        <SpotlightCard enableBeam={false} className="p-6 sm:p-8 border-white/10 bg-[#0B0F19]/85 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 border-b border-white/[0.08] pb-3 mb-5">
            <Target className="w-4 h-4 text-[#F59E0B]" />
            <span className="font-bold">Sprint Roadmap & Milestones Tracker</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {project.milestones.map((m, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2 relative"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-amber-400 font-bold">Phase 0{idx + 1}</span>
                  <span className="text-slate-500">Sprint {idx * 2 + 1}–{(idx + 1) * 2}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{m}</p>
                <div className="pt-1">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono ${
                    idx === 0 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' 
                      : 'bg-white/5 text-slate-500'
                  }`}>
                    {idx === 0 ? '▶ In Progress' : 'Queued'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>

      </div>
    </div>
  );
}
