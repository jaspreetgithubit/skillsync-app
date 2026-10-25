import { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Home,
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  ShieldCheck, 
  Award, 
  Check
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { MOCK_PROJECTS } from '../data/mockProjects';
import { getTeamsForProject } from '../data/mockTeams';
import SpotlightCard from '../components/common/SpotlightCard';
import FloatingBadge from '../components/common/FloatingBadge';
import NeuralConstellationBackground from '../components/common/NeuralConstellationBackground';

// Deterministic confetti particles (pure & idempotent for React strict mode)
const CONFETTI_PARTICLES = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  top: `${((i * 17) % 80) + 10}%`,
  left: `${((i * 29) % 80) + 10}%`,
  color: ['#F59E0B', '#FBBF24', '#10B981', '#8B5CF6', '#3B82F6'][i % 5],
  duration: `${((i * 37) % 15) / 10 + 0.8}s`
}));

export default function RecommendedTeam({ projectId, teamId, onNavigate, onBack }) {
  const { userProfile, joinTeam } = useUserProfile();

  const project = MOCK_PROJECTS.find(p => p.id === projectId) || MOCK_PROJECTS[0];
  const allTeams = getTeamsForProject(project.id, userProfile);
  const team = allTeams.find(t => t.id === teamId) || allTeams[0];

  // Join Flow States: 'idle' | 'checking' | 'confirmed' | 'full'
  const [joinState, setJoinState] = useState('idle');
  const [simulateFullEdgeCase, setSimulateFullEdgeCase] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleConfirmAndJoin = () => {
    if (simulateFullEdgeCase) {
      setJoinState('full');
      return;
    }

    setJoinState('checking');

    setTimeout(() => {
      setJoinState('confirmed');
      setShowConfetti(true);
      joinTeam(team);

      // Auto-navigate to Team Dashboard (/team/:teamId) after 1.5 seconds
      setTimeout(() => {
        if (onNavigate) {
          onNavigate(`/team/${team.id}`, { project, team });
        }
      }, 1500);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] pb-24">
      {/* 2026 Interactive Neural Constellation & Synapse Mesh Background */}
      <NeuralConstellationBackground />

      {/* Subtle Confetti / Particle Burst */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
          <div className="w-full h-full relative">
            {CONFETTI_PARTICLES.map((particle) => (
              <span
                key={particle.id}
                className="absolute w-2.5 h-2.5 rounded-full animate-ping"
                style={{
                  top: particle.top,
                  left: particle.left,
                  backgroundColor: particle.color,
                  animationDuration: particle.duration
                }}
              />
            ))}
          </div>
        </div>
      )}

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
              onClick={onBack || (() => onNavigate(`/project/${project.id}/compare`))}
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Back to Matrix</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">
              Stages 07 & 08 // Recommended Squad & Verification
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Edge-Case Tester Toggle */}
            <label className="flex items-center gap-2 text-[10px] font-mono text-slate-400 cursor-pointer bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/10">
              <input
                type="checkbox"
                checked={simulateFullEdgeCase}
                onChange={(e) => {
                  setSimulateFullEdgeCase(e.target.checked);
                  if (joinState === 'full') setJoinState('idle');
                }}
                className="rounded accent-rose-500 cursor-pointer"
              />
              <span className="text-slate-400">Simulate "Team Full"</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-10">

        {/* Spotlight Banner Header with Text Scramble and Floating Badge */}
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-amber-500/30 text-[#F59E0B] text-[11px] font-mono uppercase tracking-wider mb-3 shadow-lg shadow-amber-500/10 backdrop-blur-md">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">Algorithmic Prime Pick // {team.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              {team.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Project: <strong className="text-amber-300">{project.title}</strong> · Matching slot: <strong className="text-white">{team.openRole}</strong>.
            </p>
          </div>

          {/* Floating Element */}
          <FloatingBadge
            icon={Award}
            title="Algorithmic Prime Pick"
            subtitle="98.4% Squad Synergy Vector"
            badgeText="Rank #1"
            badgeColor="emerald"
            animationClass="animate-float-slow"
          />
        </div>

        {/* 4 Key Metric Cards Row with Spotlight */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SpotlightCard enableBeam={false} className="p-4 sm:p-5 text-center border-white/10 bg-[#0B0F19]/85 backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase text-slate-400">Team Compatibility</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-1">
              {team.overallScore}%
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Weighted Synergy</div>
          </SpotlightCard>

          <SpotlightCard enableBeam={false} className="p-4 sm:p-5 text-center border-white/10 bg-[#0B0F19]/85 backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase text-slate-400">Skill Coverage</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono mt-1">
              {team.skillCoverage}%
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Stack Requirements</div>
          </SpotlightCard>

          <SpotlightCard enableBeam={false} className="p-4 sm:p-5 text-center border-white/10 bg-[#0B0F19]/85 backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase text-slate-400">Role Coverage</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
              {team.roleCoverage}%
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Zero Gaps</div>
          </SpotlightCard>

          <SpotlightCard enableBeam={false} className="p-4 sm:p-5 text-center border-white/10 bg-[#0B0F19]/85 backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase text-slate-400">Team Balance</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono mt-1">
              {team.teamBalance}%
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Cognitive Harmony</div>
          </SpotlightCard>
        </div>

        {/* Team Roster Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Users className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-bold">Squad Roster ({team.members.length + 1} / {team.maxMembers} Members)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">All Credentials Verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Existing Squad Members */}
            {team.members.map((member) => (
              <SpotlightCard 
                key={member.id} 
                enableBeam={true}
                beamDuration={12}
                className="p-5 border-white/10 bg-[#0B0F19]/85 backdrop-blur-xl hover:border-amber-500/30 transition-all space-y-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-12 h-12 rounded-2xl object-cover border border-white/20 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#080B12]" />
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm truncate">{member.name}</div>
                    <div className="text-[11px] font-mono text-amber-400 truncate">{member.assignedRole}</div>
                    <div className="text-[10px] font-mono text-slate-400">{member.experience} exp</div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Core Skills:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.coreSkills.map(sk => (
                      <span key={sk} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400">
                  <span>Match Potential:</span>
                  <span className="text-amber-400 font-bold">{member.compatibility}%</span>
                </div>
              </SpotlightCard>
            ))}

            {/* Reserved Open Slot Card (Candidate's Slot) with Beam Border */}
            <SpotlightCard 
              enableBeam={true}
              beamDuration={8}
              spotlightColor="rgba(245, 158, 11, 0.25)"
              className="p-5 border-dashed border-2 border-amber-500/60 bg-amber-950/20 backdrop-blur-xl space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[9px] font-mono font-bold uppercase">
                  Reserved for You
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img 
                    src={userProfile.avatar || '/images/avatars/aditya.jpg'} 
                    alt={userProfile.name} 
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-md shadow-amber-500/30"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 ring-2 ring-[#080B12] animate-ping" />
                </div>

                <div className="min-w-0">
                  <div className="font-bold text-white text-sm truncate">{userProfile.name}</div>
                  <div className="text-[11px] font-mono text-amber-300 font-bold truncate">{team.openRole}</div>
                  <div className="text-[10px] font-mono text-slate-400">{userProfile.experience} yrs exp</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Your Active Skills:</div>
                <div className="flex flex-wrap gap-1.5">
                  {(userProfile.skills || []).slice(0, 4).map(sk => (
                    <span key={sk.name} className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-200">
                      {sk.name} ({sk.level})
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400">
                <span>Individual Synergy:</span>
                <span className="text-emerald-400 font-bold">98.4%</span>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Synergies & Skill Gap Alert */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Why This Team? Synergies */}
          <SpotlightCard enableBeam={false} className="p-6 sm:p-8 border-white/10 bg-[#0B0F19]/85 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 border-b border-white/[0.08] pb-3 mb-4">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-bold">Why This Team? Verified Synergies</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 font-sans">
              {team.synergies.map((syn, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{syn}</span>
                </div>
              ))}
            </div>
          </SpotlightCard>

          {/* Skill Gap Alert */}
          <SpotlightCard enableBeam={false} className="p-6 sm:p-8 border-amber-500/30 bg-[#0B0F19]/90 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 border-b border-white/[0.08] pb-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="font-bold">Skill Gap & Accelerated Learning Telemetry</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              {team.skillGaps.map((gap, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-200 flex items-start gap-2.5">
                  <span className="text-amber-400 font-mono font-bold mt-0.5">!</span>
                  <span>{gap}</span>
                </div>
              ))}

              <p className="text-xs text-slate-400 font-mono leading-relaxed pt-2">
                TeamMatch AI recommends a 30-minute sprint zero alignment call to pair up on architecture setup.
              </p>
            </div>
          </SpotlightCard>
        </div>

        {/* Fallback Edge Case Alert (if simulated) */}
        {joinState === 'full' && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <strong className="block text-white font-bold">This squad is now full.</strong>
                <span>Another candidate confirmed their position seconds ago. Explore Team 2 or return to project discovery.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate(`/project/${project.id}/compare`)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase transition-all shrink-0 cursor-pointer"
            >
              View Alternate Squads
            </button>
          </div>
        )}

        {/* Primary Multi-State Action CTA (Page 8) with Beam Border & Stable Button */}
        <SpotlightCard
          enableBeam={true}
          beamDuration={8}
          spotlightColor="rgba(245, 158, 11, 0.2)"
          className="p-6 sm:p-8 border-amber-500/40 shadow-[0_20px_50px_rgba(245,158,11,0.2)] bg-gradient-to-r from-[#080B12]/95 via-[#0B0F19]/95 to-[#080B12]/95"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center justify-center sm:justify-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Zero-Commitment Trial Period · Instant Slack/GitHub Access</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase">
                Lock In Your Position in {team.name}
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Clicking confirm initializes your workspace integration, team channel invite, and project milestones dashboard.
              </p>
            </div>

            {/* Multi-State Interactive Button with Zero Displacement */}
            <div className="w-full sm:w-auto shrink-0 flex justify-center">
              {joinState === 'idle' ? (
                <button
                  type="button"
                  onClick={handleConfirmAndJoin}
                  className="relative w-full sm:w-64 py-4 rounded-2xl btn-amber-gold uppercase tracking-wider flex items-center justify-center gap-2 text-xs sm:text-sm font-black cursor-pointer shadow-xl shadow-amber-500/30 overflow-hidden transition-colors"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-light-sweep pointer-events-none" />
                  <span>Confirm & Join Team</span>
                  <ArrowRight className="w-4 h-4 text-[#080B12]" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className={`w-full sm:w-64 py-4 rounded-2xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
                    joinState === 'checking'
                      ? 'bg-amber-500/20 border border-amber-400 text-amber-300 cursor-wait'
                      : joinState === 'confirmed'
                      ? 'bg-emerald-500 text-[#080B12] font-black shadow-emerald-500/40 scale-105'
                      : 'bg-white/10 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {joinState === 'checking' && (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                      <span>Checking Availability...</span>
                    </>
                  )}

                  {joinState === 'confirmed' && (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#080B12]" />
                      <span>Team Confirmed ✓</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </SpotlightCard>

      </div>
    </div>
  );
}
