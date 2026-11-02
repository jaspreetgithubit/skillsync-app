const { z } = require('zod');

const nullableText = (max = 500) => z.string().trim().max(max).nullable().default(null);
const textList = (maxItems = 40, maxText = 250) =>
  z.array(z.string().trim().min(1).max(maxText)).max(maxItems).default([]);
const dateText = nullableText(40);
const optionalEmail = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? null : value,
  z.string().trim().email().max(254).nullable().default(null)
);
const optionalUrl = z.preprocess(
  (value) => typeof value === 'string' && value.trim() === '' ? null : value,
  z.string().trim().url().max(500).nullable().default(null)
);

const resumeProfileSchema = z.object({
  personalInformation: z.object({
    fullName: nullableText(120),
    email: optionalEmail,
    phone: nullableText(60),
    location: nullableText(160),
    headline: nullableText(160),
    professionalSummary: nullableText(2000)
  }).default({}),
  skills: z.array(z.object({
    name: z.string().trim().min(1).max(80),
    originalName: nullableText(80),
    category: nullableText(60),
    proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).nullable().default(null),
    evidence: nullableText(400),
    confidence: z.number().min(0).max(1).nullable().default(null)
  })).max(100).default([]),
  education: z.array(z.object({
    degree: nullableText(160),
    fieldOfStudy: nullableText(160),
    institution: nullableText(200),
    startDate: dateText,
    endDate: dateText,
    grade: nullableText(80),
    details: nullableText(600)
  })).max(30).default([]),
  experience: z.array(z.object({
    company: nullableText(200),
    title: nullableText(160),
    employmentType: nullableText(80),
    startDate: dateText,
    endDate: dateText,
    currentlyWorking: z.boolean().nullable().default(null),
    responsibilities: textList(30, 800),
    achievements: textList(30, 800),
    technologies: textList(40, 80)
  })).max(30).default([]),
  projects: z.array(z.object({
    title: z.string().trim().min(1).max(160),
    description: nullableText(1200),
    technologies: textList(40, 80),
    category: z.enum(['Academic', 'Personal', 'Professional']).nullable().default(null),
    role: nullableText(160),
    startDate: dateText,
    endDate: dateText,
    achievements: textList(20, 600),
    evidence: nullableText(400)
  })).max(40).default([]),
  certifications: z.array(z.object({
    name: z.string().trim().min(1).max(200),
    issuer: nullableText(160),
    issueDate: dateText,
    expiryDate: dateText,
    credentialId: nullableText(120),
    verificationUrl: optionalUrl
  })).max(40).default([]),
  achievements: textList(50, 600),
  languages: textList(30, 80),
  interests: textList(40, 120)
});

module.exports = { resumeProfileSchema };
