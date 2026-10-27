import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, FolderGit2, LoaderCircle, Plus, Users, XCircle } from 'lucide-react';
import { DEMO_STUDENTS } from '../data/demoStudents';
import { matchStudentToProject } from '../lib/skillMatching';

const selectClassName = 'w-full rounded-xl border border-white/15 bg-[#10141e] px-3 py-3 text-sm text-white outline-none transition focus:border-amber-400';

export default function SkillMatchDemo() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(DEMO_STUDENTS[0].id);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects', { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Project service returned HTTP ${response.status}.`);
        }

        const data = await response.json();
        if (!Array.isArray(data.projects)) {
          throw new Error('Project service returned an invalid project list.');
        }

        setProjects(data.projects);
        setSelectedProjectId(data.projects[0]?.id ?? '');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setLoadError(error.message || 'Could not load projects.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadProjects();
    return () => controller.abort();
  }, []);

  const selectedProject = projects.find((project) => String(project.id) === selectedProjectId);
  const selectedStudent = DEMO_STUDENTS.find((student) => student.id === selectedStudentId);
  const result = useMemo(() => (
    selectedProject && selectedStudent
      ? matchStudentToProject(selectedStudent, selectedProject)
      : null
  ), [selectedProject, selectedStudent]);

  return (
    <div className="mb-12 rounded-3xl border border-amber-400/30 bg-black/35 p-5 shadow-2xl shadow-amber-950/20 backdrop-blur-xl sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Individual skills match
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Student–Project Compatibility
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            Compare a demo student&apos;s listed skills with a project&apos;s saved requirements. Results are calculated directly from these inputs.
          </p>
        </div>
        <div className="max-w-sm rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs leading-relaxed text-slate-300">
          Demo student profiles only—sign-in and student profiles are not connected to persistent accounts.
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300" role="status">
          <LoaderCircle className="h-4 w-4 animate-spin text-amber-400" />
          Loading saved projects…
        </div>
      )}

      {!isLoading && loadError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Could not load project data: {loadError} Start the Vite development server and try again.</span>
        </div>
      )}

      {!isLoading && !loadError && projects.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          No projects are available from <code>/api/projects</code>. Create a project in the admin screen, then return here.
        </div>
      )}

      {!isLoading && !loadError && projects.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <Users className="h-4 w-4 text-amber-400" />
                Demo student
              </span>
              <select
                className={selectClassName}
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
              >
                {DEMO_STUDENTS.map((student) => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <FolderGit2 className="h-4 w-4 text-amber-400" />
                Saved project
              </span>
              <select
                className={selectClassName}
                value={selectedProjectId}
                onChange={(event) => setSelectedProjectId(event.target.value)}
              >
                {projects.map((project, index) => (
                  <option key={project.id ?? `${project.projectTitle}-${index}`} value={String(project.id)}>
                    {project.projectTitle || 'Untitled project'}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedStudent && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Student skills</div>
              <div className="flex flex-wrap gap-2">
                {selectedStudent.skills.map((skill) => (
                  <span key={skill} className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result && (
            result.compatibilityScore === null ? (
              <div className="mt-5 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">
                {result.explanation}
              </div>
            ) : (
              <div className="mt-5 space-y-5 rounded-2xl border border-white/10 bg-[#080b12]/70 p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Skills Compatibility Score</div>
                    <div className="mt-1 text-4xl font-black tabular-nums text-amber-300">
                      {result.compatibilityScore.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex gap-5 text-sm">
                    <div><span className="font-bold text-white">{result.matchedRequirementCount}/{result.totalRequirementCount}</span><span className="ml-1 text-slate-400">matched</span></div>
                    <div><span className="font-bold text-white">{result.skillCoveragePercentage.toFixed(1)}%</span><span className="ml-1 text-slate-400">skill coverage</span></div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{result.explanation}</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-200">
                      <CheckCircle2 className="h-4 w-4" />
                      Matched requirements
                    </h3>
                    {result.matchedRequirements.length > 0 ? (
                      <ul className="space-y-2 text-sm">
                        {result.matchedRequirements.map((match) => (
                          <li key={match.requiredSkill} className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-slate-200">
                            <span>{match.requiredSkill}<span className="text-slate-500"> ← {match.studentSkill}</span></span>
                            <span className="text-[10px] uppercase tracking-wide text-emerald-300">
                              {match.matchMethod === 'exact' ? 'Exact' : 'Known alias'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">No required skills matched.</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-200">
                      <XCircle className="h-4 w-4" />
                      Missing requirements
                    </h3>
                    {result.missingRequirements.length > 0 ? (
                      <ul className="space-y-2 text-sm text-slate-200">
                        {result.missingRequirements.map((skill) => <li key={skill}>{skill}</li>)}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">No missing required skills.</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <Plus className="h-3.5 w-3.5" />
                    Additional student skills
                  </h3>
                  <p className="text-sm text-slate-300">
                    {result.additionalSkills.length > 0 ? result.additionalSkills.join(', ') : 'None'}
                  </p>
                </div>

                <p className="border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-500">
                  Structured skill matching only. Project descriptions are not used for semantic similarity; this score is not a prediction of project success.
                </p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
