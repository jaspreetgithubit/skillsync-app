const assert = require('node:assert/strict');
const { test } = require('node:test');
const { normalizeResumeProfile } = require('../services/resumeNormalization');
const { resumeProfileSchema } = require('../services/resumeProfileSchema');
const { validProfile } = require('../test-support/resumeFixtures');

test('normalizes conservative skill aliases and removes only duplicate normalized skills', () => {
  const profile = normalizeResumeProfile(validProfile());
  assert.deepEqual(profile.skills.map((skill) => skill.name), ['React', 'Java', 'JavaScript']);
  assert.equal(profile.skills[0].originalName, 'React.js');
  assert.deepEqual(profile.projects[0].technologies, ['Node.js', 'MongoDB']);
});

test('preserves the meaning of project descriptions and does not conflate Java with JavaScript', () => {
  const profile = normalizeResumeProfile(validProfile());
  assert.equal(profile.projects[0].description, 'Original project description.');
  assert.notEqual(profile.skills[1].name, profile.skills[2].name);
});

test('fills absent sections with empty arrays and optional scalar values with null', () => {
  const profile = normalizeResumeProfile({
    personalInformation: { fullName: 'Ada Student' }
  });
  assert.equal(profile.personalInformation.email, null);
  assert.deepEqual(profile.skills, []);
  assert.deepEqual(profile.education, []);
  assert.deepEqual(profile.projects, []);
});

test('rejects invalid proficiency, malformed email, and invalid confidence values', () => {
  assert.throws(() => normalizeResumeProfile(validProfile({
    skills: [{ name: 'React', proficiency: 'Guru' }]
  })));
  assert.throws(() => normalizeResumeProfile(validProfile({
    personalInformation: { fullName: 'Ada', email: 'not-an-email' }
  })));
  assert.throws(() => normalizeResumeProfile(validProfile({
    skills: [{ name: 'React', confidence: 2 }]
  })));
});

test('strips unsupported fields before persistence and preserves resume contact email separately', () => {
  const profile = normalizeResumeProfile(validProfile({
    accountEmail: 'not-allowed@example.edu',
    personalInformation: {
      fullName: 'Ada Student',
      email: 'resume@example.edu',
      phone: null,
      location: null,
      headline: null,
      professionalSummary: null,
      password: 'should-not-be-saved'
    }
  }));
  assert.equal(profile.accountEmail, undefined);
  assert.equal(profile.personalInformation.email, 'resume@example.edu');
  assert.equal(profile.personalInformation.password, undefined);
  assert.equal(resumeProfileSchema.safeParse(profile).success, true);
});

test('normalization does not infer a proficiency level', () => {
  const profile = normalizeResumeProfile(validProfile());
  assert.equal(profile.skills[0].proficiency, null);
});

test('allows optional contact emails and credential URLs to be cleared during review', () => {
  const profile = normalizeResumeProfile(validProfile({
    personalInformation: {
      fullName: 'Ada Student',
      email: '',
      phone: null,
      location: null,
      headline: null,
      professionalSummary: null
    },
    certifications: [{
      name: 'Cloud Certificate',
      issuer: null,
      issueDate: null,
      expiryDate: null,
      credentialId: null,
      verificationUrl: ''
    }]
  }));
  assert.equal(profile.personalInformation.email, null);
  assert.equal(profile.certifications[0].verificationUrl, null);
});
