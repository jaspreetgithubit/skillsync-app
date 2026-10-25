import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Home,
  Sparkles, 
  BrainCircuit, 
  Layers, 
  Activity, 
  BarChart3
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { MOCK_PROJECTS } from '../data/mockProjects';
import { calculateCompatibility } from '../utils/compatibilityEngine';
import SpotlightCard from '../components/common/SpotlightCard';
import FloatingBadge from '../components/common/FloatingBadge';
import NeuralConstellationBackground from '../components/common/NeuralConstellationBackground';

export default function CompatibilityAnalysis({ projectId, onNavigate, onBack }) {
  const { userProfile } = useUserProfile();

  const project = MOCK_PROJECTS.find(p => p.id === projectId) || MOCK_PROJECTS[0];
  const compatibility = calculateCompatibility(userProfile, project);

  // Animated Count-up State for the Circular Gauge and Dimension Bars
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedSkills, setAnimatedSkills] = useState(0);
  const [animatedRole, setAnimatedRole] = useState(0);
  const [animatedExp, setAnimatedExp] = useState(0);
  const [animatedInterest, setAnimatedInterest] = useState(0);

  useEffect(() => {
    // Count-up animation
    const targetScore = compatibility.overallScore;
    const targetSkill = compatibility.skillMatch;
    const targetRole = compatibility.roleMatch;
    const targetExp = compatibility.experienceMatch;
    const targetInterest = compatibility.interestMatch;

    const duration = 1200; // ms
    const frameRate = 30;
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = Math.min(1, frame / totalFrames);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setAnimatedScore(Math.round(targetScore * ease));
      setAnimatedSkills(Math.round(targetSkill * ease));
      setAnimatedRole(Math.round(targetRole * ease));
      setAnimatedExp(Math.round(targetExp * ease));
      setAnimatedInterest(Math.round(targetInterest * ease));

      if (frame >= totalFrames) {
        clearInterval(timer);
      }
    }, 1000 / frameRate);

    return () => clearInterval(timer);
  }, [compatibility]);

  const handleViewTeams = () => {
    if (onNavigate) {
      onNavigate(`/project/${project.id}/compare`, { project, compatibility });
    }
  };

  // SVG Circular Gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

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
              onClick={onBack || (() => onNavigate(`/project/${project.id}`))}
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Back to Project Specs</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">
              Stage 04 // Dynamic Compatibility Analysis
            </span>
          </div>

          <div className="text-xs font-mono text-amber-400 font-bold">
            Step 4 of 9
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-10">

        {/* Section Title with Text Scramble and Floating Badge */}
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-amber-500/30 text-[#F59E0B] text-[11px] font-mono uppercase tracking-wider mb-3 shadow-lg shadow-amber-500/10 backdrop-blur-md">
              <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">Hungarian Bipartite Compatibility Vector</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              Candidate Alignment Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Evaluation for <strong className="text-white">{userProfile.name}</strong> against <span className="text-amber-300 font-bold">{project.title}</span>.
            </p>
          </div>

          {/* Floating Element */}
          <FloatingBadge
            icon={Activity}
            title="Equilibrium Vector"
            subtitle="Normalized 4-Dimension Synergy"
            badgeText="98.4% Precision"
            badgeColor="emerald"
            animationClass="animate-float-slow"
          />
        </div>

        {/* Top Split Card: SVG Circular Gauge (Left) + 4-Dimensional Breakdown (Right) */}
        <SpotlightCard
          enableBeam={true}
          beamDuration={9}
          spotlightColor="rgba(245, 158, 11, 0.18)"
          className="p-8 sm:p-10 border-white/15 bg-[#0B0F19]/90 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left 5 cols: Circular Gauge */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-4 border-b lg:border-b-0 lg:border-r border-white/[0.08]">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* SVG Gauge */}
                <svg className="w-full h-full transform -rotate-90">
                  {/* Track Circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  {/* Progress Arc */}
                  <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="url(#amber-gold-gradient)"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-300"
                  />
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="amber-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FBBF24" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                    {animatedScore}%
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mt-1 font-bold">
                    Overall Synergy
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <div className="text-xs font-bold text-slate-200">
                  {animatedScore >= 90 ? 'Exceptional Fit // Tier 1 Match' : 'Strong Alignment // High Synergy'}
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Calculated across {project.requiredSkills.length} core stacks & {project.requiredRoles.length} squad roles
                </p>
              </div>
            </div>

            {/* Right 7 cols: 4 Dimensional Progress Bars */}
            <div className="lg:col-span-7 space-y-5">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#F59E0B]" />
                <span className="font-bold">Dimensional Compatibility Breakdown</span>
              </div>

              {/* Dimension 1: Skill Match */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">1. Technical Stack Proficiency Match</span>
                  <span className="text-amber-400 font-bold">{animatedSkills}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
                    style={{ width: `${animatedSkills}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Weighted overlap of your proficiency (Basic/Medium/Strong) against project requirement tiers.
                </div>
              </div>

              {/* Dimension 2: Role Match */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">2. Preferred Sprint Role Alignment</span>
                  <span className="text-purple-400 font-bold">{animatedRole}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${animatedRole}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Matching target role: <strong className="text-white">{userProfile.role}</strong> against squad requirements.
                </div>
              </div>

              {/* Dimension 3: Experience Match */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">3. Engineering Experience Level</span>
                  <span className="text-emerald-400 font-bold">{animatedExp}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${animatedExp}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Evaluated for project velocity ({userProfile.experience} years recorded).
                </div>
              </div>

              {/* Dimension 4: Domain Interest Match */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">4. Domain Interest & Track Synergy</span>
                  <span className="text-amber-300 font-bold">{animatedInterest}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${animatedInterest}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Direct alignment with {project.domain} industry focus.
                </div>
              </div>

            </div>

          </div>
        </SpotlightCard>

        {/* Explainable AI Panel ("Why This Match?") with Beam Border */}
        <SpotlightCard enableBeam={true} beamDuration={12} className="p-6 sm:p-8 border-amber-500/30 bg-[#080C14]/90 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 border-b border-white/[0.08] pb-3 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-bold">Explainable AI // Algorithmic Rationalization</span>
          </div>

          <div className="space-y-3">
            {compatibility.explainableAI.map((point, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs sm:text-sm text-slate-200 leading-relaxed font-sans flex items-start gap-3"
              >
                <span className="text-[#F59E0B] font-mono font-bold mt-0.5">[{idx + 1}]</span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Detailed Skill-by-Skill Breakdown Table / Cards with Beam Border */}
        <SpotlightCard enableBeam={true} beamDuration={15} className="p-6 sm:p-8 border-white/10 bg-[#0B0F19]/85 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Layers className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-bold">Skill-by-Skill Proficiency Audit</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Candidate vs Required Spec</span>
          </div>

          <div className="space-y-3">
            {compatibility.skillBreakdown.map((item) => (
              <div
                key={item.skillName}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                    {item.skillName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{item.skillName}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Target Level: <span className="text-slate-200 font-bold">{item.requiredLevel}</span>
                      <span className="mx-2 text-white/20">|</span>
                      Your Level: <span className="text-amber-300 font-bold">{item.userLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${item.badgeColor}`}>
                    {item.status}
                  </span>
                  <div className="w-16 text-right font-mono text-xs font-bold text-slate-300">
                    {item.score}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Primary CTA: View Matching Teams with Beam Border & Stable Button */}
        <SpotlightCard
          enableBeam={true}
          beamDuration={8}
          spotlightColor="rgba(245, 158, 11, 0.2)"
          className="p-6 sm:p-8 border-amber-500/40 shadow-[0_20px_50px_rgba(245,158,11,0.15)] bg-gradient-to-r from-[#080B12]/95 via-[#0B0F19]/95 to-[#080B12]/95"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-black text-white uppercase">
                Explore Matching Teams for This Project
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                We have generated 3 evaluated squads for this project. Review side-by-side matrices and inspect individual member synergies.
              </p>
            </div>

            <button
              type="button"
              onClick={handleViewTeams}
              className="relative w-full sm:w-auto px-8 py-4 rounded-2xl btn-amber-gold uppercase tracking-wider flex items-center justify-center gap-2 text-xs sm:text-sm font-black cursor-pointer shadow-xl shadow-amber-500/25 shrink-0 overflow-hidden transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-light-sweep pointer-events-none" />
              <span>View Matching Teams</span>
              <ArrowRight className="w-4 h-4 text-[#080B12]" />
            </button>
          </div>
        </SpotlightCard>

      </div>
    </div>
  );
}
