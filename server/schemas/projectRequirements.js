const { z } = require('zod');

const projectSkillRequirementSchema = z.object({
  name: z.string().trim().min(1).max(80),
  priority: z.enum(['required', 'preferred']).default('required'),
  weight: z.coerce.number().finite().min(1).max(100).default(20),
  critical: z.boolean().default(false)
});

const projectSkillRequirementsSchema = z.array(projectSkillRequirementSchema).min(1).max(100);

module.exports = { projectSkillRequirementSchema, projectSkillRequirementsSchema };
