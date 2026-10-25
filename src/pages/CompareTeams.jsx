import { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Home,
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Scale
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { MOCK_PROJECTS } from '../data/mockProjects';
import { getTeamsForProject } from '../data/mockTeams';
import SpotlightCard from '../components/common/SpotlightCard';
import FloatingBadge from '../components/common/FloatingBadge';
import NeuralConstellationBackground from '../components/common/NeuralConstellationBackground';

export default function CompareTeams({ projectId, onNavigate, onBack }) {
  const { userProfile, setActiveTeamId } = useUserProfile();

  const project = MOCK_PROJECTS.find(p => p.id === projectId) || MOCK_PROJECTS[0];
  const teams = getTeamsForProject(project.id, userProfile);

  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);

  const handleInspectTeam = (team) => {
    setActiveTeamId(team.id);
    if (onNavigate) {
      onNavigate(`/project/${project.id}/recommended`, { project, team });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] pb-24">
      {/* 2026 Interactive Neural Constellation & Synapse Mesh Background */}
      <NeuralConstellationBackground />

      {/* Top Header Bar */}
      <div className="relative z-20 border-b border-white/[0.08] bg-[#080B12]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
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
              onClick={onBack || (() => onNavigate(`/project/${project.id}/compatibility`))}
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Back to Compatibility</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">
              Stages 05 & 06 // Multi-Squad Formation Matrix
            </span>
          </div>

          <div className="text-xs font-mono text-amber-400 font-bold">
            Step 5 & 6 of 9
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-10">

        {/* Section Heading with Text Scramble and Floating Badge */}
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-amber-500/30 text-[#F59E0B] text-[11px] font-mono uppercase tracking-wider mb-3 shadow-lg shadow-amber-500/10 backdrop-blur-md">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">Comparative Synergy Benchmark</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              Side-by-Side Squad Matrix
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
              We evaluated 3 distinct squad architectures for <span className="text-amber-300 font-bold">{project.title}</span>. Compare skill coverage, balance, and member roles before inspecting your optimal squad.
            </p>
          </div>

          {/* Floating Element */}
          <FloatingBadge
            icon={Scale}
            title="Tri-Squad Synthesis"
            subtitle="Automated Combinatorial Benchmark"
            badgeText="Top 3 Squads"
            badgeColor="amber"
            animationClass="animate-float-slow"
          />
        </div>

        {/* Squad Cards Grid Preview with Beam Borders & Yellow Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teams.map((team, idx) => {
            const isLeading = team.isRecommended;

            return (
              <SpotlightCard
                key={team.id}
                onClick={() => setSelectedTeamIndex(idx)}
                enableBeam={isLeading || selectedTeamIndex === idx}
                beamDuration={9 + idx * 2}
                spotlightColor="rgba(245, 158, 11, 0.18)"
                className={`p-6 cursor-pointer bg-[#0B0F19]/85 backdrop-blur-xl ${
                  selectedTeamIndex === idx 
                    ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-[0_20px_45px_rgba(245,158,11,0.25)]' 
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isLeading 
                        ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#080B12] shadow-md shadow-amber-500/30 font-black' 
                        : 'bg-white/[0.04] text-slate-400 border border-white/10'
                    }`}>
                      {isLeading ? '★ Top Recommendation' : `Squad 0${idx + 1}`}
                    </span>

                    <span className="text-sm font-mono font-bold text-amber-400">
                      {team.overallScore}% Score
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">{team.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Looking for: <strong className="text-amber-300">{team.openRole}</strong>
                    </p>
                  </div>

                  {/* Member Avatars */}
                  <div className="flex items-center -space-x-2 pt-1">
                    {team.members.map((m) => (
                      <img
                        key={m.id}
                        src={m.avatar}
                        alt={m.name}
                        title={`${m.name} (${m.assignedRole})`}
                        className="w-8 h-8 rounded-full object-cover border-2 border-[#080B12] ring-1 ring-white/10"
                      />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-[#080B12] text-amber-300 flex items-center justify-center text-[10px] font-mono font-bold">
                      +1
                    </div>
                  </div>

                  {/* Quick Metric Bars */}
                  <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Skill Coverage</span>
                      <span className="text-white font-bold">{team.skillCoverage}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full" 
                        style={{ width: `${team.skillCoverage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {/* SIDE-BY-SIDE COMPARISON TABLE / MATRIX with Frosted Glass */}
        <SpotlightCard enableBeam={false} className="p-6 sm:p-10 border-white/15 bg-[#0B0F19]/85 backdrop-blur-xl overflow-x-auto">
          <div className="min-w-[650px]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 border-b border-white/[0.08] pb-4 mb-6">
              <Layers className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-bold">Full Algorithmic Telemetry Matrix</span>
            </div>

            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-4 w-1/4 font-medium">Evaluation Metric</th>
                  {teams.map((t) => (
                    <th 
                      key={t.id} 
                      className={`pb-4 px-4 w-1/4 ${t.isRecommended ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{t.name}</span>
                        {t.isRecommended && <span className="text-amber-400">★</span>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.06] text-slate-300">
                {/* 1. Overall Score */}
                <tr>
                  <td className="py-3.5 text-white font-bold">Overall Match Score</td>
                  {teams.map((t) => (
                    <td key={t.id} className="py-3.5 px-4 font-bold">
                      <span className={t.isRecommended ? 'text-amber-400 text-sm' : 'text-slate-300'}>
                        {t.overallScore}%
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 2. Skill Coverage */}
                <tr>
                  <td className="py-3.5 text-white font-bold">Skill Matrix Coverage</td>
                  {teams.map((t) => (
                    <td key={t.id} className="py-3.5 px-4">
                      <span>{t.skillCoverage}%</span>
                    </td>
                  ))}
                </tr>

                {/* 3. Role Coverage */}
                <tr>
                  <td className="py-3.5 text-white font-bold">Target Role Coverage</td>
                  {teams.map((t) => (
                    <td key={t.id} className="py-3.5 px-4">
                      <span>{t.roleCoverage}%</span>
                    </td>
                  ))}
                </tr>

                {/* 4. Diversity Index */}
                <tr>
                  <td className="py-3.5 text-white font-bold">Cognitive Diversity Index</td>
                  {teams.map((t) => (
                    <td key={t.id} className="py-3.5 px-4">
                      <span className="text-purple-300">{t.diversityIndex}%</span>
                    </td>
                  ))}
                </tr>

                {/* 5. Free-rider Risk */}
                <tr>
                  <td className="py-3.5 text-white font-bold">Free-Rider Social Friction Risk</td>
                  {teams.map((t) => (
                    <td key={t.id} className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>0% (Zero Risk)</span>
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 6. Open Role Assigned to You */}
                <tr>
                  <td className="py-3.5 text-white font-bold">Your Potential Role</td>
                  {teams.map((t) => (
                    <td key={t.id} className="py-3.5 px-4">
                      <span className="text-amber-300 font-bold">{t.openRole}</span>
                    </td>
                  ))}
                </tr>

                {/* 7. Action Row */}
                <tr>
                  <td className="py-5 text-slate-400">Action</td>
                  {teams.map((t) => (
                    <td key={t.id} className="py-5 px-4">
                      <button
                        type="button"
                        onClick={() => handleInspectTeam(t)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                          t.isRecommended
                            ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#080B12] shadow-md shadow-amber-500/25 hover:brightness-110 font-black'
                            : 'bg-white/[0.05] hover:bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        Inspect Team →
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </SpotlightCard>

        {/* Primary CTA Bottom Bar with Beam Border & Stable Button */}
        <SpotlightCard
          enableBeam={true}
          beamDuration={8}
          spotlightColor="rgba(245, 158, 11, 0.2)"
          className="p-6 sm:p-8 border-amber-500/40 shadow-[0_20px_50px_rgba(245,158,11,0.15)] bg-gradient-to-r from-[#080B12]/95 via-[#0B0F19]/95 to-[#080B12]/95"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-bold">Optimal Match Ready</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase">
                Proceed with Recommended Squad: {teams[0].name}
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Highest synergy index ({teams[0].overallScore}%), 100% role coverage, and verified zero free-rider risk.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleInspectTeam(teams[0])}
              className="relative w-full sm:w-auto px-8 py-4 rounded-2xl btn-amber-gold uppercase tracking-wider flex items-center justify-center gap-2 text-xs sm:text-sm font-black cursor-pointer shadow-xl shadow-amber-500/25 shrink-0 overflow-hidden transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-light-sweep pointer-events-none" />
              <span>Inspect Recommended Team</span>
              <ArrowRight className="w-4 h-4 text-[#080B12]" />
            </button>
          </div>
        </SpotlightCard>

      </div>
    </div>
  );
}
