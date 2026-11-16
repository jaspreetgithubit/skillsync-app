import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, FolderGit2, LoaderCircle, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import { fetchProjectCompatibility, getCompatibilityErrorMessage } from '../lib/compatibilityApi';
import TeamRecommendations from './TeamRecommendations';

const fieldClassName = 'w-full rounded-xl border border-white/15 bg-[#10141e] px-3 py-3 text-sm text-white outline-none transition focus:border-amber-400';

function SkillList({ title, skills, emptyText, tone = 'amber' }) {
  const colorClasses = {
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
    green: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
    red: 'border-rose-400/20 bg-rose-400/10 text-rose-100',
    violet: 'border-violet-400/20 bg-violet-400/10 text-violet-100'
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">{title}</h3>
      {skills.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill, index) => {
            const name = typeof skill === 'string' ? skill : skill.name || skill.requiredSkill;
            return (
              <li key={`${name}-${index}`} className={`rounded-lg border px-2.5 py-1.5 text-xs ${colorClasses[tone]}`}>
                {name}
                {skill.studentSkill && skill.studentSkill !== name && (
                  <span className="ml-1 text-slate-300">via {skill.studentSkill}</span>
                )}
                {skill.strength != null && <span className="ml-1">({Math.round(skill.strength * 100)}% credit)</span>}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-400">{emptyText}</p>
      )}
    </section>
  );
}

function BreakdownItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-bold tabular-nums text-white">
        {value == null ? 'Not enough data' : `${value.toFixed(1)}%`}
      </div>
      {value != null && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-amber-400" style={{ width: `${value}%` }} />
        </div>
      )}
    </div>
  );
}

export default function ProjectCompatibility() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectLoadError, setProjectLoadError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [compatibility, setCompatibility] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);

  const loadProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    setProjectLoadError('');
    try {
      const response = await fetch('/api/projects', { credentials: 'include' });
      const body = await response.json();
      if (!response.ok || !Array.isArray(body.projects)) {
        throw new Error(body.error || `Project service returned HTTP ${response.status}.`);
      }
      setProjects(body.projects);
      setSelectedProjectId((current) => (
        current && body.projects.some((project) => String(project.id || project._id) === current)
          ? current
          : String(body.projects[0]?.id || body.projects[0]?._id || '')
      ));
    } catch (loadError) {
      setProjectLoadError(loadError.message || 'Could not load projects.');
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadProjects);
  }, [loadProjects]);

  const checkCompatibility = async () => {
    if (!selectedProjectId) return;
    setIsChecking(true);
    setError(null);
    setCompatibility(null);
    try {
      const result = await fetchProjectCompatibility(selectedProjectId);
      setCompatibility(result.compatibility);
      setSelectedProject(result.project);
    } catch (requestError) {
      setError({ message: getCompatibilityErrorMessage(requestError), code: requestError.code });
    } finally {
      setIsChecking(false);
    }
  };

  const clearResult = () => {
    setCompatibility(null);
    setError(null);
    setSelectedProject(null);
  };
  const selectedProjectForTeams = projects.find(
    (project) => String(project.id || project._id) === selectedProjectId
  ) || null;

  return (
    <section className="space-y-5 rounded-3xl border border-amber-400/25 bg-black/30 p-5 text-left shadow-2xl shadow-amber-950/20 backdrop-blur-xl sm:p-7">
      <header>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-300">
          <Sparkles className="h-3.5 w-3.5" />
          Individual project fit
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Check My Compatibility</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
        Compare your confirmed profile with the selected project&apos;s required and preferred skills. This score is for your signed-in account; it is a skills-fit score, not a probability of success.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1 space-y-2">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <FolderGit2 className="h-4 w-4 text-amber-400" />
            Project
          </span>
          <select
            aria-label="Project"
            className={fieldClassName}
            value={selectedProjectId}
            onChange={(event) => {
              setSelectedProjectId(event.target.value);
              clearResult();
            }}
            disabled={isLoadingProjects || projects.length === 0}
          >
            {projects.length === 0 && <option value="">No projects available</option>}
            {projects.map((project, index) => {
              const id = String(project.id || project._id || '');
              return <option key={id || index} value={id}>{project.projectTitle || 'Untitled project'}</option>;
            })}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={checkCompatibility}
            disabled={!selectedProjectId || isLoadingProjects || isChecking || Boolean(projectLoadError)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isChecking ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isChecking ? 'Checking…' : 'Check My Compatibility'}
          </button>
          <button
            type="button"
            onClick={loadProjects}
            disabled={isLoadingProjects}
            aria-label="Refresh projects"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-3 text-slate-300 transition hover:border-amber-400/50 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingProjects ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {isLoadingProjects && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          <LoaderCircle className="h-4 w-4 animate-spin text-amber-400" />
          Loading available projects…
        </div>
      )}
      {!isLoadingProjects && projectLoadError && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{projectLoadError}</span>
          <button type="button" onClick={loadProjects} className="ml-auto underline">Retry</button>
        </div>
      )}
      {!isLoadingProjects && !projectLoadError && projects.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          No projects are available yet. Check back after a project has been published.
        </p>
      )}
      {isChecking && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-100">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Comparing your confirmed skills with this project&apos;s requirements…
        </div>
      )}
      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error.message}</span>
          <button type="button" onClick={checkCompatibility} className="ml-auto shrink-0 underline">Retry</button>
        </div>
      )}
      {!compatibility && !error && !isChecking && !isLoadingProjects && projects.length > 0 && (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          Choose a project and check your fit. Only your signed-in account profile is used for this calculation.
        </p>
      )}

      {compatibility && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#080b12]/70 p-4 sm:p-5" aria-live="polite">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-4 border-amber-400/70 bg-amber-400/10">
                <span className="text-xl font-black tabular-nums text-amber-200">{compatibility.score.toFixed(1)}%</span>
                <span className="text-[8px] uppercase tracking-wide text-amber-100">fit score</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedProject?.projectTitle || 'Project compatibility'}</h3>
                <div className={`mt-1 inline-flex rounded-lg border px-2 py-1 text-[11px] font-semibold ${
                  compatibility.classification === 'RELEVANT'
                    ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                    : 'border-slate-400/20 bg-white/5 text-slate-300'
                }`}>
                  {compatibility.classification === 'RELEVANT' ? 'Meets relevance threshold' : 'Below relevance threshold'}
                  <span className="ml-1 font-normal">(threshold {compatibility.threshold}%)</span>
                </div>
                <p className="mt-1 text-sm text-slate-300">{compatibility.explanation}</p>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 self-start rounded-xl border px-3 py-2 text-sm font-bold sm:self-center ${
              compatibility.criticalRequirementsCount === 0
                ? 'border-white/15 bg-white/[0.03] text-slate-300'
                : compatibility.criticalRequirementsSatisfied
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                : 'border-rose-400/30 bg-rose-400/10 text-rose-200'
            }`}>
              {compatibility.criticalRequirementsCount > 0 && !compatibility.criticalRequirementsSatisfied
                ? <ShieldAlert className="h-4 w-4" />
                : <CheckCircle2 className="h-4 w-4" />}
              {compatibility.criticalRequirementsCount === 0
                ? 'No critical skills configured'
                : compatibility.criticalRequirementsSatisfied ? 'Critical skills satisfied' : 'Critical skill gaps'}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <BreakdownItem label="Required skill coverage" value={compatibility.breakdown.requiredSkillCoverage} />
            <BreakdownItem label="Preferred skill coverage" value={compatibility.breakdown.preferredSkillCoverage} />
          </div>

          {compatibility.criticalGaps.length > 0 && (
            <div className="rounded-xl border border-rose-400/25 bg-rose-400/10 p-4">
              <h3 className="text-sm font-bold text-rose-100">Critical requirements that need attention</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-rose-100">
                {compatibility.criticalGaps.map((gap) => <li key={gap.skill}>{gap.skill}: {gap.reason}</li>)}
              </ul>
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            <SkillList title="Matched skills" skills={compatibility.matchedSkills} emptyText="No exact required or preferred matches." tone="green" />
            <SkillList title="Missing required skills" skills={compatibility.missingRequiredSkills} emptyText="No required skills are missing." tone="red" />
            <SkillList title="Matched preferred skills" skills={compatibility.matchedPreferredSkills} emptyText="No preferred skills matched exactly." tone="amber" />
            <SkillList title="Partial matches (not equivalent)" skills={compatibility.partialMatches} emptyText="No partial matches were found." tone="violet" />
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            The percentage is a suitability score based on configured skill weights; it is not statistical accuracy or a probability of project success.
          </p>
        </div>
      )}
      {selectedProjectForTeams && (
        <TeamRecommendations key={selectedProjectId} project={selectedProjectForTeams} />
      )}
    </section>
  );
}
