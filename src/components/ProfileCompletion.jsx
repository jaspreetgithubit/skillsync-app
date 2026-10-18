import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, LogOut, Sparkles, UserRound } from 'lucide-react';

const splitList = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);

export default function ProfileCompletion({ user, loading, error, onSubmit, onSignOut }) {
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'Innovator');
  const [experience, setExperience] = useState(user?.experience || 'Beginner');
  const [interests, setInterests] = useState(Array.isArray(user?.interests) ? user.interests.join(', ') : (user?.interests || ''));
  const [skills, setSkills] = useState(Array.isArray(user?.skills) ? user.skills.map((skill) => typeof skill === 'string' ? skill : skill.name).join(', ') : (user?.skills || ''));
  const [projects, setProjects] = useState(user?.projects || user?.previousProjects || '');
  const [validationError, setValidationError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim() || !role || !experience) {
      setValidationError('Please complete your name, role, and experience level.');
      return;
    }
    setValidationError('');
    onSubmit({ name, role, experience, interests: splitList(interests), skills: splitList(skills), projects });
  };

  const fieldClass = 'mt-2 w-full rounded-xl border border-white/10 bg-[#0b1220] px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400';
  const labelClass = 'block text-sm font-medium text-slate-200';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080B12] px-4 py-12 text-slate-100 sm:px-6">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-amber-400/10 p-3 text-amber-300"><Sparkles size={22} /></div><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">SyncSkills.AI</p><p className="mt-1 text-sm text-slate-400">Your profile, your opportunities</p></div></div>
          <button type="button" onClick={onSignOut} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"><LogOut size={15} /> Sign out</button>
        </div>
        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 sm:p-10">
          <div className="mb-8 flex items-start gap-4"><div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300"><UserRound size={25} /></div><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">One last step</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Complete your profile</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Tell us a little about your experience, interests, and skills so we can personalize your SyncSkills experience.</p></div></div>
          <div className="mb-7 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300"><CheckCircle2 size={20} /></div><div className="min-w-0"><p className="text-sm font-medium text-white">Google account connected</p><p className="truncate text-sm text-slate-400">{user?.email}</p></div></div>
          <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>Full name<input className={fieldClass} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required /></label>
            <label className={labelClass}>Your role<select className={fieldClass} value={role} onChange={(e) => setRole(e.target.value)}><option>Innovator</option><option>Student</option><option>Developer</option><option>Team Lead</option><option>Faculty</option><option>Recruiter</option><option>Company Admin</option></select></label>
            <label className={labelClass}>Experience level<select className={fieldClass} value={experience} onChange={(e) => setExperience(e.target.value)}><option>Beginner</option><option>Less than 1 year</option><option>1–2 years</option><option>3–5 years</option><option>5+ years</option></select></label>
            <label className={labelClass}>Interests <span className="font-normal text-slate-500">(comma-separated)</span><input className={fieldClass} value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="AI, web development, cloud" /></label>
            <label className={`${labelClass} sm:col-span-2`}>Skills <span className="font-normal text-slate-500">(comma-separated)</span><input className={fieldClass} value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Java, React, SQL, Python" /></label>
            <label className={`${labelClass} sm:col-span-2`}>Projects or experience summary<textarea className={`${fieldClass} min-h-28 resize-y`} value={projects} onChange={(e) => setProjects(e.target.value)} placeholder="Share a project you have built or what you would like to work on." /></label>
            {(validationError || error) && <p role="alert" className="sm:col-span-2 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{validationError || error}</p>}
            <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-slate-500">Your profile is saved securely to your account.</p><button disabled={loading} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60">{loading ? 'Saving profile…' : 'Save profile and continue'} <ArrowRight size={17} /></button></div>
          </form>
        </section>
      </div>
    </main>
  );
}
