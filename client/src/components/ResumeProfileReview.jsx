const fieldClass = 'w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none';
const labelClass = 'mb-1 block text-xs font-medium text-slate-300';

const emptyItems = {
  skills: { name: '', category: '', proficiency: null, evidence: '', confidence: null },
  education: { degree: '', fieldOfStudy: '', institution: '', startDate: '', endDate: '', grade: '', details: '' },
  experience: { company: '', title: '', employmentType: '', startDate: '', endDate: '', currentlyWorking: null, responsibilities: [], achievements: [], technologies: [] },
  projects: { title: '', description: '', technologies: [], category: null, role: '', startDate: '', endDate: '', achievements: [], evidence: '' },
  certifications: { name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', verificationUrl: '' }
};

function Field({ label, value, onChange, multiline = false, type = 'text', placeholder = '' }) {
  const Control = multiline ? 'textarea' : 'input';
  return (
    <label className="block min-w-0">
      <span className={labelClass}>{label}</span>
      <Control
        type={multiline ? undefined : type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={multiline ? 3 : undefined}
        className={`${fieldClass} ${multiline ? 'resize-y' : ''}`}
      />
    </label>
  );
}

function ListField({ label, values, onChange, placeholder }) {
  return (
    <Field
      label={label}
      multiline
      value={(values || []).join('\n')}
      onChange={(value) => onChange(value.split('\n').map((item) => item.trim()).filter(Boolean))}
      placeholder={placeholder}
    />
  );
}

export default function ResumeProfileReview({ profile, onChange }) {
  if (!profile) return null;

  const updatePersonal = (key, value) => onChange({
    ...profile,
    personalInformation: { ...profile.personalInformation, [key]: value }
  });

  const updateItem = (section, index, key, value) => onChange({
    ...profile,
    [section]: profile[section].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item)
  });

  const removeItem = (section, index) => onChange({
    ...profile,
    [section]: profile[section].filter((_, itemIndex) => itemIndex !== index)
  });

  const addItem = (section) => onChange({
    ...profile,
    [section]: [...profile[section], { ...emptyItems[section] }]
  });

  const updateStringList = (section, value) => onChange({
    ...profile,
    [section]: value.split('\n').map((item) => item.trim()).filter(Boolean)
  });

  const renderFields = (section, index, fields) => fields.map(([key, label, multiline = false]) => (
    <Field
      key={key}
      label={label}
      value={profile[section][index][key]}
      multiline={multiline}
      onChange={(value) => updateItem(section, index, key, value)}
    />
  ));

  const renderSimpleSection = (section, label, placeholder) => (
    <details className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3" key={section}>
      <summary className="cursor-pointer text-sm font-semibold text-slate-100">
        {label} <span className="ml-1 text-xs font-normal text-slate-400">({profile[section].length})</span>
      </summary>
      <div className="mt-3 space-y-3">
        <ListField
          label={label}
          values={profile[section]}
          onChange={(value) => updateStringList(section, value)}
          placeholder={placeholder}
        />
      </div>
    </details>
  );

  return (
    <section className="space-y-2.5" aria-labelledby="resume-review-heading">
      <div>
        <h3 id="resume-review-heading" className="text-base font-semibold text-white">Review your profile</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">
          Check every section before saving. Extracted details are suggestions, not verified account information.
        </p>
      </div>

      <details open className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
        <summary className="cursor-pointer text-sm font-semibold text-slate-100">Personal information</summary>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Field label="Full name" value={profile.personalInformation.fullName} onChange={(value) => updatePersonal('fullName', value)} />
          <Field label="Resume contact email (not account email)" type="email" value={profile.personalInformation.email} onChange={(value) => updatePersonal('email', value)} />
          <Field label="Phone" value={profile.personalInformation.phone} onChange={(value) => updatePersonal('phone', value)} />
          <Field label="Location" value={profile.personalInformation.location} onChange={(value) => updatePersonal('location', value)} />
          <Field label="Professional headline" value={profile.personalInformation.headline} onChange={(value) => updatePersonal('headline', value)} />
          <div className="sm:col-span-2">
            <Field label="Professional summary" multiline value={profile.personalInformation.professionalSummary} onChange={(value) => updatePersonal('professionalSummary', value)} />
          </div>
        </div>
      </details>

      {[
        ['skills', 'Technical skills'],
        ['education', 'Education'],
        ['experience', 'Work experience / internships'],
        ['projects', 'Projects'],
        ['certifications', 'Certifications']
      ].map(([section, title]) => (
        <details open={section === 'skills' || section === 'projects'} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3" key={section}>
          <summary className="cursor-pointer text-sm font-semibold text-slate-100">
            {title} <span className="ml-1 text-xs font-normal text-slate-400">({profile[section].length})</span>
          </summary>
          <div className="mt-3 space-y-2.5">
            {profile[section].map((item, index) => (
              <fieldset key={`${section}-${index}`} className="rounded-lg border border-white/10 p-4">
                <legend className="px-1 text-xs font-medium text-amber-200">{title.slice(0, -1)} {index + 1}</legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {section === 'skills' && renderFields(section, index, [
                    ['name', 'Skill name'],
                    ['category', 'Category']
                  ])}
                  {section === 'skills' && (
                    <>
                      <label className="block">
                        <span className={labelClass}>Proficiency (only if stated)</span>
                        <select
                          className={fieldClass}
                          value={item.proficiency || ''}
                          onChange={(event) => updateItem(section, index, 'proficiency', event.target.value || null)}
                        >
                          <option value="">Not specified</option>
                          {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => <option key={level}>{level}</option>)}
                        </select>
                      </label>
                      <Field label="Resume evidence" value={item.evidence} onChange={(value) => updateItem(section, index, 'evidence', value)} />
                    </>
                  )}
                  {section === 'education' && renderFields(section, index, [
                    ['degree', 'Degree'],
                    ['fieldOfStudy', 'Field of study'],
                    ['institution', 'Institution'],
                    ['startDate', 'Start date'],
                    ['endDate', 'End / expected date'],
                    ['grade', 'Grade / CGPA']
                  ])}
                  {section === 'education' && <div className="sm:col-span-2">{renderFields(section, index, [['details', 'Additional details', true]])}</div>}
                  {section === 'experience' && renderFields(section, index, [
                    ['company', 'Company'],
                    ['title', 'Job title'],
                    ['employmentType', 'Employment type'],
                    ['startDate', 'Start date'],
                    ['endDate', 'End date']
                  ])}
                  {section === 'experience' && (
                    <>
                      <ListField label="Responsibilities" values={item.responsibilities} onChange={(value) => updateItem(section, index, 'responsibilities', value)} />
                      <ListField label="Achievements" values={item.achievements} onChange={(value) => updateItem(section, index, 'achievements', value)} />
                      <ListField label="Technologies" values={item.technologies} onChange={(value) => updateItem(section, index, 'technologies', value)} />
                      <label className="flex items-center gap-2 self-end pb-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={item.currentlyWorking === true}
                          onChange={(event) => updateItem(section, index, 'currentlyWorking', event.target.checked)}
                        />
                        Currently working
                      </label>
                    </>
                  )}
                  {section === 'projects' && renderFields(section, index, [
                    ['title', 'Project title'],
                    ['role', 'Role / contribution'],
                    ['startDate', 'Start date'],
                    ['endDate', 'End date']
                  ])}
                  {section === 'projects' && (
                    <>
                      <label className="block">
                        <span className={labelClass}>Project type</span>
                        <select className={fieldClass} value={item.category || ''} onChange={(event) => updateItem(section, index, 'category', event.target.value || null)}>
                          <option value="">Not specified</option>
                          {['Academic', 'Personal', 'Professional'].map((category) => <option key={category}>{category}</option>)}
                        </select>
                      </label>
                      <div className="sm:col-span-2">{renderFields(section, index, [['description', 'Description', true]])}</div>
                      <ListField label="Technologies" values={item.technologies} onChange={(value) => updateItem(section, index, 'technologies', value)} />
                      <ListField label="Achievements" values={item.achievements} onChange={(value) => updateItem(section, index, 'achievements', value)} />
                      <div className="sm:col-span-2">{renderFields(section, index, [['evidence', 'Resume evidence', true]])}</div>
                    </>
                  )}
                  {section === 'certifications' && renderFields(section, index, [
                    ['name', 'Certification'],
                    ['issuer', 'Issuing organization'],
                    ['issueDate', 'Issue date'],
                    ['expiryDate', 'Expiry date'],
                    ['credentialId', 'Credential ID'],
                    ['verificationUrl', 'Verification URL']
                  ])}
                </div>
                <button type="button" onClick={() => removeItem(section, index)} className="mt-3 text-xs font-medium text-rose-300 hover:text-rose-200">
                  Remove entry
                </button>
              </fieldset>
            ))}
            <button type="button" onClick={() => addItem(section)} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-white/5">
              + Add {title.slice(0, -1).toLowerCase()}
            </button>
          </div>
        </details>
      ))}

      {renderSimpleSection('achievements', 'Achievements', 'One achievement per line')}
      {renderSimpleSection('languages', 'Languages', 'One language per line')}
      {renderSimpleSection('interests', 'Interests', 'One interest per line')}
    </section>
  );
}
