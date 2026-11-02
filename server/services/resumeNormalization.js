const { resumeProfileSchema } = require('./resumeProfileSchema');

const SKILL_ALIASES = new Map([
  ['react.js', 'React'],
  ['reactjs', 'React'],
  ['nodejs', 'Node.js'],
  ['node js', 'Node.js'],
  ['postgresql', 'PostgreSQL'],
  ['postgre sql', 'PostgreSQL'],
  ['mongo db', 'MongoDB'],
  ['js', 'JavaScript'],
  ['ts', 'TypeScript']
]);

function normalizeSkillName(value) {
  const trimmed = value.trim().replace(/\s+/g, ' ');
  return SKILL_ALIASES.get(trimmed.toLowerCase()) || trimmed;
}

function normalizeStringList(values, normalizer = (value) => value.trim().replace(/\s+/g, ' ')) {
  const seen = new Set();
  return values.reduce((items, value) => {
    const normalized = normalizer(value);
    const key = normalized.toLocaleLowerCase();
    if (!normalized || seen.has(key)) return items;
    seen.add(key);
    items.push(normalized);
    return items;
  }, []);
}

function normalizeResumeProfile(input) {
  const profile = resumeProfileSchema.parse(input);
  const seenSkills = new Set();

  profile.skills = profile.skills.reduce((skills, skill) => {
    const name = normalizeSkillName(skill.name);
    const key = name.toLocaleLowerCase();
    if (seenSkills.has(key)) return skills;
    seenSkills.add(key);
    skills.push({
      ...skill,
      name,
      originalName: skill.originalName || (name === skill.name ? null : skill.name)
    });
    return skills;
  }, []);

  for (const project of profile.projects) {
    project.technologies = normalizeStringList(project.technologies, normalizeSkillName);
  }
  for (const job of profile.experience) {
    job.technologies = normalizeStringList(job.technologies, normalizeSkillName);
  }

  return profile;
}

function getExtractedSections(profile) {
  const sections = [];
  const personal = profile.personalInformation;
  if (Object.values(personal).some(Boolean)) sections.push('personalInformation');
  for (const section of ['skills', 'education', 'experience', 'projects', 'certifications', 'achievements', 'languages', 'interests']) {
    const value = profile[section];
    if (Array.isArray(value) && value.length > 0) sections.push(section);
  }
  return sections;
}

function getProfileWarnings(profile) {
  const warnings = [];
  if (!profile.personalInformation.fullName) warnings.push('Add your full name before saving.');
  if (profile.skills.length === 0) warnings.push('No skills were found; add any skills you want to include.');
  if (profile.projects.length === 0) warnings.push('No projects were found; add them if applicable.');
  return warnings;
}

module.exports = {
  getExtractedSections,
  getProfileWarnings,
  normalizeResumeProfile,
  normalizeSkillName,
  normalizeStringList
};
