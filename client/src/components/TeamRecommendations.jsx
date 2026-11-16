import { useState } from 'react';
import { AlertCircle, CheckCircle2, LoaderCircle, Search, ShieldAlert, Users } from 'lucide-react';
import { fetchTeamRecommendations, getTeamRecommendationsErrorMessage } from '../lib/teamRecommendationsApi';

function SkillBadges({ skills, tone = 'amber' }) {
  const color = tone === 'green'
    ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
    : tone === 'red'
      ? 'border-rose-400/20 bg-rose-400/10 text-rose-100'
      : 'border-amber-400/20 bg-amber-400/10 text-amber-100';
  return skills?.length
    ? <ul className="mt-2 flex flex-wrap gap-2">{skills.map((skill, index) => (
        <li key={`${typeof skill === 'string' ? skill : skill.name}-${index}`} className={`rounded-lg border px-2.5 py-1 text-xs ${color}`}>
          {typeof skill === 'string' ? skill : skill.name || skill.requiredSkill}
          {skill.studentSkill && skill.studentSkill !== skill.name && <span className="ml-1 text-slate-300">via {skill.studentSkill}</span>}
        </li>
      ))}</ul>
    : <p className="mt-2 text-sm text-slate-400">None</p>;
}

function CoverageMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-bold tabular-nums text-white">{value == null ? 'Not included' : `${value.toFixed(1)}%`}</div>
      {value != null && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-amber-400" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>}
    </div>
  );
}

function TeamCard({ team }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#080b12]/70 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-300">Recommendation #{team.rank}</div>
          <h4 className="mt-1 text-xl font-black text-white">{team.compatibilityScore.toFixed(1)}% · {team.classification.replaceAll('_', ' ')}</h4>
        </div>
        <div className={`inline-flex items-center gap-2 self-start rounded-xl border px-3 py-2 text-xs font-bold ${
          team.criticalRequirementsCount === 0
            ? 'border-white/15 bg-white/[0.03] text-slate-300'
            : team.criticalRequirementsSatisfied
            ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
            : 'border-rose-400/25 bg-rose-400/10 text-rose-200'
        }`}>
          {team.criticalRequirementsSatisfied ? <CheckCircle2 className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
          {team.criticalRequirementsCount === 0
            ? 'No critical skills configured'
            : team.criticalRequirementsSatisfied ? 'Critical skills satisfied' : 'Critical skill gaps'}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CoverageMetric label="Combined skill coverage" value={team.scoreBreakdown.combinedSkillCoverage} />
        <CoverageMetric label="Role coverage" value={team.scoreBreakdown.roleCoverage} />
        <CoverageMetric label="Member relevance" value={team.scoreBreakdown.individualMemberRelevance} />
        <CoverageMetric label="Complementarity" value={team.scoreBreakdown.skillComplementarity} />
      </div>

      <div className="mt-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Team members</h5>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {team.members.map((member, index) => (
            <li key={`${member.name}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white">{member.name}</span>
                <span className="text-xs tabular-nums text-amber-200">{member.individualCompatibilityScore.toFixed(1)}% individual fit</span>
              </div>
              <SkillBadges skills={member.skills} tone="green" />
              {member.contributions.length > 0 && (
                <p className="mt-2 text-xs text-slate-400">
                  Contributes {member.contributions.map(({ requiredSkill }) => requiredSkill).join(', ')}.
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">Combined relevant skills</h5>
        <SkillBadges skills={team.combinedSkills} tone="green" />
      </div>

      <details className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <summary className="cursor-pointer text-sm font-semibold text-amber-200">View matching details and score explanation</summary>
        <div className="mt-4 space-y-4">
          <p className="text-sm leading-relaxed text-slate-300">{team.explanation}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><h5 className="text-xs font-bold text-emerald-200">Matched required skills</h5><SkillBadges skills={team.matchedRequiredSkills} tone="green" /></div>
            <div><h5 className="text-xs font-bold text-rose-200">Missing required skills</h5><SkillBadges skills={team.missingRequiredSkills} tone="red" /></div>
            <div><h5 className="text-xs font-bold text-amber-200">Matched preferred skills</h5><SkillBadges skills={team.matchedPreferredSkills} tone="green" /></div>
            <div><h5 className="text-xs font-bold text-slate-300">Missing preferred skills</h5><SkillBadges skills={team.missingPreferredSkills} /></div>
          </div>
          {team.partialMatches.length > 0 && (
            <div><h5 className="text-xs font-bold text-amber-200">Partial matches (not equivalent)</h5><SkillBadges skills={team.partialMatches} /></div>
          )}
          <div>
            <h5 className="text-xs font-bold text-slate-200">Role coverage</h5>
            {team.roleCoverage.every(({ coverage }) => coverage == null)
              ? <p className="mt-2 text-sm text-slate-400">Not included; no role-specific skills are configured.</p>
              : <ul className="mt-2 space-y-2">{team.roleCoverage.map((role) => (
                  <li key={role.name} className="rounded-lg border border-white/10 p-2 text-sm">
                    <div className="flex justify-between gap-2 text-white"><span>{role.name}</span><span>{role.coverage == null ? 'Not configured' : `${role.coverage.toFixed(1)}% · ${role.status.replaceAll('_', ' ')}`}</span></div>
                    {role.missingSkills.length > 0 && <p className="mt-1 text-xs text-rose-200">Needs: {role.missingSkills.join(', ')}</p>}
                  </li>
                ))}</ul>}
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-200">Unique contributions</h5>
            <SkillBadges skills={team.uniqueContributions.map(({ skill, memberName }) => `${skill} · ${memberName}`)} />
          </div>
          {team.criticalGaps.length > 0 && (
            <div role="alert" className="rounded-xl border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-100">
              Missing critical requirements: {team.criticalGaps.map(({ skill }) => skill).join(', ')}.
            </div>
          )}
          <div>
            <h5 className="text-xs font-bold text-slate-200">Score components</h5>
            <ul className="mt-2 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
              {Object.entries(team.scoreBreakdown).filter(([key]) => key !== 'activeComponentWeights').map(([key, value]) => (
                <li key={key} className="rounded-lg border border-white/10 p-2">
                  {key.replaceAll(/([A-Z])/g, ' $1')}: {value == null ? 'not included' : `${value.toFixed(1)}%`}
                  {team.scoreBreakdown.activeComponentWeights?.[key] != null && ` (weight ${team.scoreBreakdown.activeComponentWeights[key]}%)`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </article>
  );
}

export default function TeamRecommendations({ project }) {
  const projectId = String(project?.id || project?._id || '');
  const hasRequirements = Boolean(
    (Array.isArray(project?.requiredSkills) && project.requiredSkills.length)
    || (Array.isArray(project?.requirements?.skills) && project.requirements.skills.length)
  );
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const findTeams = async () => {
    if (!projectId || !hasRequirements) return;
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await fetchTeamRecommendations(projectId));
    } catch (requestError) {
      setError(getTeamRecommendationsErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-violet-400/20 bg-violet-400/[0.04] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-200">
            <Users className="h-4 w-4" /> Team recommendations
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">
            Find distinct student combinations using combined project skill coverage, member relevance, and complementary contributions.
          </p>
        </div>
        <button
          type="button"
          onClick={findTeams}
          disabled={!projectId || !hasRequirements || isLoading}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {isLoading ? 'Finding teams…' : result ? 'Refresh recommendations' : 'Find Best Teams'}
        </button>
      </div>

      {!hasRequirements && (
        <p role="status" className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">
          This project has no configured skill requirements. Add at least one required or preferred skill before finding teams.
        </p>
      )}
      {!result && !error && !isLoading && hasRequirements && (
        <p className="text-xs text-slate-400">
          Team size: {project?.teamSize || 3}{project?.teamSize ? '' : ' (application default)'} members. Recommendations are alternatives; they do not assign or invite students.
        </p>
      )}
      {isLoading && <div role="status" className="flex items-center gap-2 rounded-xl border border-violet-400/20 p-3 text-sm text-violet-100"><LoaderCircle className="h-4 w-4 animate-spin" /> Evaluating eligible confirmed profiles…</div>}
      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button type="button" onClick={findTeams} className="ml-auto shrink-0 underline">Retry</button>
        </div>
      )}
      {result && (
        <div aria-live="polite" className="space-y-4">
          <div className="grid gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-slate-300 sm:grid-cols-2 lg:grid-cols-5">
            <div>Project: <strong className="text-white">{result.projectTitle}</strong></div>
            <div>Team size: <strong className="text-white">{result.teamSize}{result.teamSizeDefaulted ? ' (default)' : ''}</strong></div>
            <div>Eligible students: <strong className="text-white">{result.eligibleStudentCount}</strong></div>
            <div>Combinations: <strong className="text-white">{result.totalTeamsEvaluated.toLocaleString()} / {result.totalTeamsPossible.toLocaleString()}</strong></div>
            <div>Recommendations: <strong className="text-white">{result.recommendations.length}</strong></div>
          </div>
          {result.metadata.searchStrategy === 'BOUNDED_BEAM' && (
            <p className="text-xs text-amber-200">
              Bounded search evaluated {result.totalTeamsEvaluated} complete teams from {result.totalTeamsPossible.toLocaleString()} possible combinations; these are the best teams found by the deterministic beam search, not a guarantee of the global top five.
            </p>
          )}
          {result.recommendations.length === 0
            ? <p className="rounded-xl border border-white/10 p-4 text-sm text-slate-300">No valid teams could be generated. Check the configured team size and eligible student profiles.</p>
            : <div className="space-y-3">{result.recommendations.map((team) => <TeamCard key={team.teamId} team={team} />)}</div>}
          <p className="text-xs text-slate-400">
            Exact search evaluates every possible team when the candidate count is manageable. Team ranking is deterministic and recommendations are not permanent assignments. Real-world recommendation accuracy has not been independently evaluated with human-labeled team data.
          </p>
        </div>
      )}
    </section>
  );
}
