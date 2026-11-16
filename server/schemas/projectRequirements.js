const { z } = require('zod');

const projectSkillRequirementSchema = z.object({
  name: z.string().trim().min(1).max(80),
  priority: z.enum(['required', 'preferred']).default('required'),
  weight: z.coerce.number().finite().min(1).max(100).default(20),
  critical: z.boolean().default(false)
});

const projectSkillRequirementsSchema = z.array(projectSkillRequirementSchema).min(1).max(100);
const projectRoleRequirementSchema = z.object({
  role: z.string().trim().min(1).max(80),
  count: z.coerce.number().int().min(1).max(25).default(1),
  requiredSkills: z.array(z.string().trim().min(1).max(80)).max(30).default([])
});
const projectRoleRequirementsSchema = z.array(projectRoleRequirementSchema).max(20).default([])
  .superRefine((roles, context) => {
    const roleNames = new Set();
    roles.forEach((role, index) => {
      const key = role.role.toLowerCase();
      if (roleNames.has(key)) {
        context.addIssue({
          code: 'custom',
          path: [index, 'role'],
          message: 'Project role names must be unique.'
        });
      }
      roleNames.add(key);
    });
  });

module.exports = {
  projectRoleRequirementSchema,
  projectRoleRequirementsSchema,
  projectSkillRequirementSchema,
  projectSkillRequirementsSchema
};
