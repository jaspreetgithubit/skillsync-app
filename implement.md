# MASTER IMPLEMENTATION PROMPT — FEATURE 3: TEAM COMPATIBILITY, TEAM FORMATION & TOP 5 TEAM RECOMMENDATIONS

## 1. Your Role

Act as a senior full-stack software architect, backend engineer, frontend engineer, database engineer, and applied AI engineer.

Your task is to inspect my existing SyncSkills.AI repository and implement **Feature 3: Team Compatibility and Team Recommendations** end-to-end.

You must implement the feature directly in the existing codebase, integrate it with the existing frontend and backend, use the existing MongoDB database, and verify that everything works.

Do not just provide a plan, pseudocode, or sample implementation. Complete the implementation, run the available tests, fix errors, and provide a detailed completion report.

Prioritize:

1. Correct team formation.
2. Accurate and explainable team compatibility scoring.
3. Complementary skill distribution.
4. Fair and meaningful team ranking.
5. Efficient team combination search.
6. Integration with existing Features 1 and 2.
7. Production-quality architecture, validation, security, and testing.

---

# 2. Existing Project Context

The project is **SyncSkills.AI**, a student project collaboration platform.

The purpose of the application is to help students form suitable teams based on their technical skills and project requirements.

The existing technology stack is:

- Frontend: React + Vite.
- Backend: Node.js + Express.
- Database: MongoDB.
- Database integration: Existing Mongoose models and database configuration.
- Authentication: Existing authentication implementation.
- AI integration: Existing AI provider abstraction, where applicable.

The repository has already implemented two features.

### Feature 1: Resume Parsing and Student Profile Extraction

Students can upload their resumes.

The system extracts and stores structured student information, including:

- Technical skills.
- Skill proficiency, where available.
- Education.
- Experience.
- Projects.
- Certifications.
- Other relevant profile information.

Students can review and confirm their extracted information.

### Feature 2: Individual Student–Project Compatibility

The system compares one student's profile against one project's requirements.

It calculates an explainable compatibility score based on:

- Required skills.
- Preferred skills.
- Skill matching.
- Skill proficiency.
- Missing requirements.
- Partial matches.

It also contains skill normalization and a reusable compatibility scoring mechanism.

**Feature 3 must reuse the existing functionality from Features 1 and 2 wherever appropriate. Do not independently recreate the same functionality.**

Before implementation, inspect the actual code to understand how these features work.

Do not assume that the existing models, field names, APIs, or scoring functions match the examples in this prompt. Discover their actual implementation first.

---

# 3. Feature 3 — Objective

Implement a system that can identify and recommend the best possible combinations of students for a particular project.

Unlike Feature 2, which evaluates one student against one project, Feature 3 evaluates a group of students together against the project's requirements.

The system must answer:

- Which combination of students is most suitable for a project?
- Does the combined team possess the required technical skills?
- Are the students' skills complementary?
- Does the team have suitable coverage of the project's technical roles?
- Which requirements are still missing?
- How suitable is each individual team member?
- Which are the top five team combinations for the project?

The system must calculate a team compatibility score and rank the best five distinct team combinations.

**The goal is to recommend teams that can collectively execute a project, not simply teams containing students with the highest individual compatibility scores.**

---

# 4. Example Scenario

Suppose a project requires the following skills:

**Required skills:**

- React.
- Node.js.
- MongoDB.
- Python.
- Machine Learning.

**Preferred skills:**

- Docker.
- PostgreSQL.
- TensorFlow.

The project requires a team of three students.

Assume the available students have these profiles:

| Student | Skills |
|---|---|
| Student A | React, JavaScript, CSS, Tailwind CSS |
| Student B | Node.js, Express, MongoDB, Docker |
| Student C | Python, Machine Learning, TensorFlow |
| Student D | React, Node.js, MongoDB |
| Student E | Java, Spring Boot, MySQL |
| Student F | Python, Machine Learning, PostgreSQL |

The system should evaluate different combinations of three students.

For example:

**Team 1: Student A + Student B + Student C**

- Frontend coverage: Strong.
- Backend coverage: Strong.
- Database coverage: Strong.
- AI/ML coverage: Strong.
- Required skill coverage: Complete.
- Preferred skill coverage: Strong.

**Team 2: Student A + Student D + Student E**

- Frontend coverage: Strong.
- Backend coverage: Partial.
- Database coverage: Strong.
- AI/ML coverage: Missing.
- Required skill coverage: Incomplete.

The first team should generally rank higher because it covers more of the actual project requirements.

The system must calculate the actual result through its scoring algorithm. The example above is only for understanding the expected behavior.

---

# 5. Project Team Size Configuration

Team size must be explicitly configurable.

Inspect the existing project creation and editing functionality.

Add or adapt the project configuration to support:

- `teamSize`: Exact number of students required for the team.

For example:

```json
{
  "teamSize": 3
}
```

### Team size rules

1. A team must contain exactly the configured number of distinct students.
2. A student cannot appear twice in the same team.
3. Do not generate teams with fewer or more members than the configured size.
4. Validate that the configured team size is a positive integer.
5. Establish a reasonable configurable maximum team size, with an initial default maximum of 8.
6. If an existing project has no team size configured, use a configurable application default of 3 and clearly indicate that the default is being used.
7. When a project is created or edited, allow the owner to configure its team size.

Do not silently use an arbitrary team size without communicating it in the interface.

---

# 6. Eligible Student Selection

The system needs to identify which students are eligible to participate in team recommendations.

Inspect the existing authentication, student profile, and user models.

Use the following eligibility rules:

A student is eligible if:

1. The student has an existing account.
2. The student has a confirmed or reviewed profile.
3. The student has a valid student profile.
4. The student is eligible for discovery under the existing application's privacy and account rules.
5. The student's account is active, if the application has account status management.

Do not include:

- Students without a usable confirmed profile.
- Duplicate student records.
- Inactive or deleted accounts.
- Profiles that cannot be safely accessed.

If the application already has student availability or team participation fields, respect them.

Do not invent a new availability workflow unnecessarily.

### Candidate pool

For each project:

1. Retrieve eligible student profiles.
2. Retrieve their confirmed technical skills.
3. Normalize skills using the existing normalization service.
4. Prepare the candidate pool for team generation.
5. Exclude duplicate profiles.

The system must not expose private student information to unauthorized users.

Do not send complete resumes or unnecessary personal information to the frontend.

Only retrieve the profile fields required for compatibility calculations.

### Team creator

Do not automatically exclude the project owner from the candidate pool.

If the project owner has an eligible student profile, they can participate unless an existing application rule explicitly prevents it.

---

# 7. Team Compatibility Engine

Implement the team compatibility engine as a separate, reusable backend service.

Do not put the algorithm inside React components or Express controllers.

The engine should evaluate the following four components:

1. Combined skill coverage.
2. Role coverage.
3. Individual member relevance.
4. Skill complementarity.

Use the following default weights.

| Component | Weight |
|---|---:|
| Combined skill coverage | 60% |
| Role coverage | 15% |
| Individual member relevance | 15% |
| Skill complementarity | 10% |
| **Total** | **100%** |

Keep these weights centralized in a configuration file.

They must not be scattered across controllers, components, and utility functions.

The weights should be configurable so that they can be calibrated later.

---

# 8. Component 1 — Combined Skill Coverage

This is the most important part of the team compatibility calculation.

The system must evaluate whether the team collectively possesses the skills required by the project.

### A. Required skill coverage

Suppose the project requires:

- React: Weight 5.
- Node.js: Weight 5.
- MongoDB: Weight 4.
- Python: Weight 4.
- Machine Learning: Weight 5.

The team should receive credit for each requirement if at least one member possesses the corresponding skill.

Use the strongest valid member match for each project requirement.

For example:

- Student A knows React.
- Student B knows Node.js.
- Student C knows MongoDB and Python.
- Student D knows Machine Learning.

A team containing A, B, C, and D covers all five requirements.

**Important: Do not add the same skill multiple times just because several team members possess it.**

If all three students know React, the team still receives credit for React only once.

### B. Preferred skill coverage

Evaluate preferred skills separately.

Preferred skills should improve the team's score, but missing a preferred skill should not have the same impact as missing a mandatory skill.

### C. Coverage calculation

Calculate weighted coverage.

For each skill requirement:

- Determine whether the team has an exact or approved alias match.
- Determine whether it has a valid partial match.
- Determine the strongest matching strength among all members.
- Apply the project's skill importance weight.

Use this formula:

`Required Coverage = (Sum of required skill weights × best team match strength) / (Sum of all required skill weights) × 100`

Use the equivalent calculation for preferred skills.

For the combined skill coverage component, use:

`Combined Skill Coverage = (Required Coverage × 0.80) + (Preferred Coverage × 0.20)`

If the project has no preferred skills, use the required coverage as the complete skill coverage score.

If the project has no required skills, use preferred coverage as the available skill coverage score and clearly identify the absence of mandatory requirements.

If the project has no configured skill requirements at all, do not generate a misleading compatibility score. Return a clear configuration error or incomplete-requirements state.

### D. Skill matching strength

Reuse the normalization and skill matching rules from Feature 2.

Follow these rules:

- Exact canonical match: Full credit.
- Trusted alias match: Full credit after normalization.
- Approved related skill: Configured partial credit.
- Unverified semantic similarity: No automatic full credit.
- Unrelated skill: Zero credit.

Examples:

- React.js = React.
- NodeJS = Node.js.
- JS = JavaScript.
- Java ≠ JavaScript.
- React ≠ React Native.
- MongoDB ≠ PostgreSQL.
- Machine Learning ≠ Deep Learning.

Never give a team full credit for a skill it does not actually possess.

---

# 9. Component 2 — Role Coverage

Projects often require people with different technical responsibilities.

For example, a project may need:

- Frontend Developer.
- Backend Developer.
- Database Developer.
- AI/ML Developer.
- DevOps Engineer.

The system should evaluate whether the combined team can cover these responsibilities.

### A. Project role requirements

Add or adapt structured role requirements to the project model.

Example:

```json
{
  "roles": [
    {
      "name": "Frontend Developer",
      "requiredSkills": [
        "React",
        "JavaScript",
        "CSS"
      ],
      "weight": 3
    },
    {
      "name": "Backend Developer",
      "requiredSkills": [
        "Node.js",
        "Express",
        "MongoDB"
      ],
      "weight": 3
    },
    {
      "name": "AI/ML Developer",
      "requiredSkills": [
        "Python",
        "Machine Learning"
      ],
      "weight": 2
    }
  ]
}
```

This is an illustrative structure. Adapt it to the existing project requirements model.

### B. Role matching

For each role:

1. Evaluate the required skills for that role.
2. Evaluate each team member's relevant skills.
3. Determine the strongest valid role coverage.
4. Calculate the role's weighted coverage.
5. Aggregate the role results.

A role should not be considered fully covered merely because one loosely related skill is present.

### C. Role assignment

For the initial version:

- A student may contribute to multiple roles.
- A role may be supported by multiple students.
- Do not force every student into exactly one role.
- Do not assume a student can only work in one technical area.

The frontend should show each member's strongest relevant contributions.

### D. Missing role requirements

Clearly identify missing roles or incomplete role requirements.

For example:

- Frontend Developer: Covered.
- Backend Developer: Covered.
- AI/ML Developer: Partially covered.
- DevOps Engineer: Not covered.

### E. When roles are not configured

If a project has no explicit role requirements:

- Mark role coverage as unavailable.
- Do not infer role requirements from the project description using arbitrary rules.
- Recalculate the final score using the remaining available components proportionally.
- Clearly indicate that role coverage was not included.

---

# 10. Component 3 — Individual Member Relevance

A team should not receive a high score simply because it contains one extremely skilled student and several completely unrelated students.

Evaluate each member's individual relevance to the project.

**Reuse the existing Feature 2 compatibility engine.**

For every candidate student:

1. Retrieve the confirmed student profile.
2. Calculate individual student–project compatibility.
3. Reuse the existing compatibility scoring service.
4. Store the individual result temporarily for the team evaluation.
5. Use it to calculate the team's individual relevance component.

For the initial implementation, calculate:

`Individual Member Relevance = Average of all team members' individual compatibility scores`

Example:

| Member | Individual compatibility |
|---|---:|
| Student A | 85% |
| Student B | 90% |
| Student C | 80% |

`Individual Member Relevance = (85 + 90 + 80) / 3 = 85%`

Use this as the default team component.

Do not recalculate individual compatibility using a different formula.

The individual compatibility score must come from Feature 2's actual implementation.

This ensures that Features 2 and 3 use consistent scoring logic.

---

# 11. Component 4 — Skill Complementarity

This component evaluates whether team members bring different, useful skills to the project.

A good team should contain members who complement one another rather than unnecessarily duplicating the same skills.

Example:

**Team A:**

- Student 1: React, CSS, JavaScript.
- Student 2: Node.js, Express, MongoDB.
- Student 3: Python, Machine Learning, TensorFlow.

**Team B:**

- Student 1: React, JavaScript.
- Student 2: React, JavaScript.
- Student 3: React, JavaScript.

Both teams may have individually capable members, but Team A provides more complementary project-relevant capabilities.

### Complementarity calculation

Use the project's configured required and preferred skills as the reference.

Calculate the proportion of covered requirement weight for which at least one team member contributes a skill that no other member of that team possesses.

Use the following approach:

1. Identify project requirements covered by the team.
2. Identify which team members provide each relevant skill.
3. Identify useful unique skill contributions.
4. Calculate the weighted proportion of covered requirement weight supported by unique contributions.
5. Normalize the result to a 0–100 score.

Do not award points for unrelated extra skills.

Do not reward duplicate possession of the same skill.

Do not penalize a team excessively simply because two members share some useful skills.

Keep complementarity at 10% of the default overall score so that it does not outweigh actual project skill coverage.

Document the exact calculation in the scoring service and README.

---

# 12. Final Team Compatibility Formula

Use the following formula:

`Team Compatibility = (Combined Skill Coverage × 0.60) + (Role Coverage × 0.15) + (Individual Member Relevance × 0.15) + (Skill Complementarity × 0.10)`

All components must be normalized to a 0–100 range.

### Handling unavailable components

If a project has no configured roles:

- Exclude role coverage from the calculation.
- Redistribute the remaining component weights proportionally.
- Do not treat unavailable role coverage as zero.

If a project has no preferred skills:

- Use required skill coverage as the full skill coverage score.

If proficiency data is unavailable:

- Follow Feature 2's existing treatment of unknown proficiency.
- Do not automatically assume a student is a beginner or expert.

### Critical skill requirements

If the project has critical requirements, evaluate whether the team collectively satisfies them.

Return a separate status:

`criticalRequirementsSatisfied`

If any critical requirement is missing:

- Identify the missing requirement.
- Mark the team as not satisfying all critical requirements.
- Explain the impact.
- Do not hide this information behind a high overall score.

A high team compatibility score must not automatically mean that every mandatory or critical requirement is satisfied.

### Score classification

Use configurable classification thresholds.

For example:

- 80–100: Highly Compatible.
- 65–79.99: Moderately Compatible.
- 50–64.99: Low Compatibility.
- Below 50: Poor Compatibility.

These are initial display categories, not measured accuracy claims.

Keep the thresholds configurable and document them.

---

# 13. Team Generation Algorithm

This is one of the most important parts of Feature 3.

The system must generate different possible combinations of eligible students and evaluate them.

Suppose there are:

- 20 eligible students.
- Required team size: 3.

The number of possible combinations is:

`20 choose 3 = 1140`

The system should evaluate valid combinations and rank them.

### A. Team generation rules

1. A team must contain exactly the configured team size.
2. No student can appear more than once in a team.
3. Each team must have a unique combination of student IDs.
4. Team ordering must not create duplicate combinations.
5. Do not create teams containing ineligible students.
6. Do not include incomplete or unconfirmed profiles.
7. Evaluate teams against the same project requirements.
8. Do not calculate team scores using randomly generated values.

### B. Search algorithm

Implement an efficient and deterministic combination-search algorithm.

For manageable candidate pools, use exact combination enumeration with pruning where useful.

For larger candidate pools, use an efficient bounded search strategy such as:

- Branch and bound.
- Beam search.
- Another well-documented deterministic optimization approach.

Use configurable limits.

A suggested initial configuration:

- Maximum candidate pool: 50 students.
- Maximum team size: 8 students.
- Maximum returned recommendations: 5.

The implementation must not freeze the server while generating combinations.

Use an asynchronous job or background processing approach only if the actual search workload requires it. Do not introduce unnecessary infrastructure for small candidate pools.

If a bounded search strategy is used:

- Make it deterministic.
- Document its limits.
- Avoid claiming that it finds the mathematically global top five combinations when it does not guarantee that.
- Ensure it returns the best combinations found within its documented search strategy.

If the candidate pool is too small to form the requested team size, return an appropriate response rather than generating incomplete teams.

### C. Duplicate teams

Treat these teams as identical:

- Student A + Student B + Student C.
- Student C + Student A + Student B.

Only return one copy of the combination.

### D. Top five recommendations

Return at most five highest-ranked distinct teams.

If fewer than five valid teams exist, return the available number.

If no valid team can be generated, return a clear explanation.

**For this initial implementation, different recommended teams are allowed to share members.**

For example:

- Team 1: A + B + C.
- Team 2: A + B + D.
- Team 3: A + C + E.

This is intentional. Each recommendation is an independently evaluated alternative.

Do not enforce non-overlapping teams unless a future requirement explicitly introduces that constraint.

---

# 14. Ranking and Tie-Breaking

Sort all evaluated teams by final compatibility score in descending order.

If two teams have the same score, use the following tie-breaking rules in order:

1. Team satisfying all critical requirements ranks higher.
2. Team with higher required skill coverage ranks higher.
3. Team with higher role coverage ranks higher.
4. Team with higher individual member relevance ranks higher.
5. Team with higher complementarity ranks higher.
6. If still tied, use a deterministic ordering based on the sorted student IDs.

This ensures that repeated requests produce consistent rankings for unchanged data.

Do not use randomness to determine team rankings.

---

# 15. Explainable Team Results

Every recommended team must have a detailed explanation based on the actual scoring output.

Do not simply return a percentage.

For each team, show:

### A. Overall compatibility

Example:

`92.5% — Highly Compatible`

### B. Team members

For every member, display:

- Name.
- Profile image, if available.
- Relevant technical skills.
- Individual project compatibility score.
- Main contribution to the team.

Do not expose private information unnecessarily.

### C. Combined skills

Show the team's combined relevant skills.

For example:

- React.
- Node.js.
- MongoDB.
- Python.
- Machine Learning.
- Docker.

### D. Skill coverage

Show:

- Required skills covered.
- Required skills missing.
- Preferred skills covered.
- Preferred skills missing.
- Partial matches.

### E. Role distribution

Show the role coverage results, if configured.

### F. Complementarity

Explain which members contribute unique project-relevant skills.

### G. Critical requirement status

Clearly show whether all critical requirements are satisfied.

### H. Explanation

Generate a concise explanation using actual calculated data.

For example:

"This team ranks highly because it collectively covers the project's frontend, backend, database, and AI/ML requirements. The members contribute complementary technical skills, and all critical requirements are satisfied."

If requirements are missing, explicitly mention them.

Use deterministic explanation templates initially.

An LLM may optionally improve the wording, but it must not invent members, skills, scores, or matching results.

**The LLM must never be the authoritative team scoring or ranking engine.**

---

# 16. Backend Architecture

Inspect the existing backend architecture and follow its conventions.

Implement the necessary reusable services.

Suggested logical structure:

```text
server/
├── models/
│   ├── User.js
│   ├── Project.js
│   └── ...
├── routes/
│   ├── projectRoutes.js
│   └── teamRoutes.js
├── controllers/
│   └── teamController.js
├── services/
│   ├── skillNormalizationService.js
│   ├── individualCompatibilityService.js
│   ├── teamCompatibilityService.js
│   ├── teamGenerationService.js
│   └── teamRankingService.js
├── validators/
│   └── teamValidators.js
├── middleware/
└── tests/
```

This is an illustrative logical structure. Adapt it to the existing codebase.

Do not create unnecessary duplicate files if equivalent services already exist.

### A. Team compatibility service

Responsible for:

- Retrieving the required project data.
- Evaluating individual member compatibility using Feature 2.
- Calculating combined skill coverage.
- Calculating role coverage.
- Calculating individual relevance.
- Calculating complementarity.
- Calculating the final team score.
- Generating missing requirement information.
- Producing the structured team evaluation result.

### B. Team generation service

Responsible for:

- Retrieving eligible candidates.
- Validating candidate pool size.
- Generating unique combinations.
- Applying search limits.
- Evaluating valid combinations.
- Avoiding duplicate combinations.

### C. Team ranking service

Responsible for:

- Sorting evaluated teams.
- Applying tie-breaking rules.
- Returning the top five teams.
- Producing deterministic rankings.

Keep these responsibilities separated.

---

# 17. API Design

Implement authenticated API endpoints that follow the existing API naming conventions.

Suggested endpoint:

`GET /api/projects/:projectId/team-recommendations`

This endpoint should:

1. Authenticate the requesting user.
2. Validate the project ID.
3. Retrieve the project and its requirements.
4. Retrieve eligible student profiles.
5. Read the configured team size.
6. Generate candidate team combinations.
7. Evaluate each team.
8. Rank the teams.
9. Return the top five results.

Suggested response structure:

```json
{
  "success": true,
  "projectId": "project-id",
  "teamSize": 3,
  "eligibleStudentCount": 20,
  "totalTeamsEvaluated": 1140,
  "recommendations": [
    {
      "rank": 1,
      "teamId": "deterministic-team-id",
      "compatibilityScore": 92.5,
      "classification": "HIGHLY_COMPATIBLE",
      "criticalRequirementsSatisfied": true,
      "members": [],
      "combinedSkills": [],
      "scoreBreakdown": {
        "combinedSkillCoverage": 100,
        "roleCoverage": 90,
        "individualMemberRelevance": 85,
        "skillComplementarity": 90
      },
      "matchedRequiredSkills": [],
      "missingRequiredSkills": [],
      "matchedPreferredSkills": [],
      "missingPreferredSkills": [],
      "partialMatches": [],
      "roleCoverage": [],
      "uniqueContributions": [],
      "explanation": "..."
    }
  ],
  "metadata": {
    "algorithmVersion": "1.0.0",
    "searchStrategy": "EXACT",
    "generatedAt": "ISO-8601 timestamp"
  }
}
```

This is an illustrative response contract. Adapt field names to existing project conventions.

### API error cases

Handle:

- Invalid project ID.
- Project not found.
- Unauthorized request.
- Insufficient eligible students.
- Missing confirmed student profiles.
- Invalid team size.
- Missing project skill requirements.
- Invalid project requirements.
- No valid combinations.
- Search limit exceeded.
- Database errors.
- Unexpected server errors.

Use appropriate HTTP status codes and consistent error responses.

### Authorization

Use the existing authentication middleware.

Do not trust a user ID supplied by the frontend.

Use the authenticated user's identity.

Respect the existing project's visibility and access permissions.

Do not expose private student profile information to unauthorized users.

---

# 18. Frontend Implementation

Integrate Feature 3 into the existing SyncSkills.AI interface.

Before implementation, inspect:

- Existing dashboard.
- Project listing page.
- Project detail page.
- Project creation/editing forms.
- Student profile components.
- Existing compatibility UI from Feature 2.
- Existing design system and reusable components.

Do not create a completely separate application or duplicate the existing design.

### A. Team recommendations entry point

On the relevant project detail page, introduce an action:

**Find Best Teams**

When clicked:

1. Validate that project requirements are configured.
2. Retrieve the project team size.
3. Call the team recommendations API.
4. Display a loading state.
5. Show the top five recommendations.
6. Handle errors and insufficient candidates appropriately.

If the project is missing required configuration, show a clear message explaining what must be configured.

### B. Team recommendation page

Create a professional and responsive layout.

At the top, show:

- Project title.
- Configured team size.
- Number of eligible students.
- Number of combinations evaluated.
- Number of recommendations returned.

### C. Top five team cards

Display up to five team recommendation cards.

Each card should show:

- Rank.
- Overall compatibility percentage.
- Compatibility classification.
- Critical requirement status.
- Team members.
- Combined relevant skills.
- Required skill coverage.
- Role coverage.
- Main strengths.
- Missing skills.

Make it easy to compare the recommendations.

### D. Expandable team details

Allow users to expand a team card to view:

- Individual member information.
- Individual compatibility scores.
- Member skill contributions.
- Complete score breakdown.
- Matched skills.
- Missing skills.
- Partial matches.
- Role coverage.
- Complementarity explanation.
- Why this team received its ranking.

### E. Visual design

Follow the existing application styling.

Use:

- Clear typography.
- Consistent spacing.
- Responsive cards.
- Skill badges.
- Progress indicators.
- Accessible colors.
- Loading skeletons.
- Clear success, warning, and error states.

Avoid unnecessary animations or excessive visual complexity.

Do not make the interface look like a generic AI-generated dashboard.

### F. Frontend states

Handle all of the following:

1. Initial state.
2. Loading recommendations.
3. Successful recommendations.
4. No eligible students.
5. Insufficient students for the configured team size.
6. No valid team combinations.
7. Missing project requirements.
8. Project without configured roles.
9. API error.
10. Retry action.

---

# 19. Data Persistence and Team Management

For the initial version, Feature 3 is a **recommendation and ranking system**.

It should generate and display suggested teams.

It should NOT automatically create permanent teams or assign students to projects.

Do not automatically:

- Create team records.
- Assign team members.
- Send invitations.
- Change student availability.
- Modify student profiles.
- Enroll students in projects.

The recommendations should be generated from the latest available confirmed profiles and project requirements.

If caching is introduced:

- Invalidate results when a student profile changes.
- Invalidate results when project requirements change.
- Invalidate results when team size changes.
- Include an algorithm version.
- Never return stale results as if they were freshly calculated.

Do not persist every possible combination in MongoDB.

Persist only what is genuinely needed by the existing architecture.

---

# 20. Performance and Scalability

Team generation involves combinatorial search.

The number of possible combinations grows rapidly as the candidate pool increases.

For example:

- 10 students, team size 3: 120 combinations.
- 20 students, team size 3: 1,140 combinations.
- 30 students, team size 5: 142,506 combinations.
- 50 students, team size 5: 2,118,760 combinations.

Therefore, do not implement an unbounded brute-force algorithm for every possible candidate pool.

Requirements:

1. Use exact combination enumeration for manageable candidate pools.
2. Use pruning where it can safely eliminate combinations that cannot produce valid results.
3. Use a documented bounded search strategy for larger pools.
4. Make candidate and search limits configurable.
5. Avoid repeatedly fetching the same MongoDB profile for each combination.
6. Load the necessary profiles once and reuse them during evaluation.
7. Precompute normalized skill sets and individual Feature 2 scores where appropriate.
8. Avoid unnecessary database queries inside combination loops.
9. Avoid blocking the Node.js event loop with excessively large synchronous computations.
10. Return meaningful search metadata.

### Important

If a search is bounded, do not falsely claim that the returned five teams are the mathematically optimal five teams across all possible combinations.

Clearly distinguish exact search from approximate or bounded search in the response metadata.

For the expected academic project workload, optimize for correctness first and reasonable performance second.

---

# 21. Security and Data Integrity

Follow production-quality security practices.

- Authenticate all recommendation requests.
- Respect project authorization rules.
- Validate all incoming project IDs.
- Validate team size and project requirements.
- Never trust student IDs supplied by the frontend.
- Retrieve candidate profiles through the backend.
- Avoid exposing sensitive resume information.
- Do not expose private profile fields unnecessarily.
- Do not allow users to access profiles they are not authorized to view.
- Do not modify confirmed profiles during recommendation generation.
- Do not expose AI API keys.
- Do not send entire resumes to an LLM for team scoring.
- Do not let an LLM determine the final compatibility score.
- Avoid unsafe MongoDB queries.
- Handle database errors safely.

The system must use the latest confirmed profile data.

---

# 22. Testing Requirements

Testing is mandatory.

Use the existing test framework and conventions.

Do not introduce unnecessary testing frameworks.

### A. Unit tests — Skill coverage

Test:

1. Every required skill covered by different members.
2. All required skills covered by one member.
3. Some required skills missing.
4. All required skills missing.
5. Preferred skills coverage.
6. Projects with no preferred skills.
7. Projects with no required skills.
8. Duplicate skills across team members.
9. Exact skill matches.
10. Trusted skill aliases.
11. Approved partial matches.
12. Unrelated skills.
13. Critical skill gaps.
14. Invalid skill weights.

### B. Unit tests — Role coverage

Test:

1. All roles covered.
2. Some roles covered.
3. No roles covered.
4. Projects without configured roles.
5. Multiple members contributing to one role.
6. One member contributing to multiple roles.
7. Partial role coverage.
8. Missing role skills.

### C. Unit tests — Individual relevance

Test:

1. All members have high individual compatibility.
2. One member has low individual compatibility.
3. Different individual scores.
4. Missing profiles.
5. Integration with the actual Feature 2 scoring service.

### D. Unit tests — Complementarity

Test:

1. Every member contributes unique relevant skills.
2. All members possess identical skills.
3. Some members share skills.
4. Some members contribute unique skills.
5. Unrelated additional skills do not increase complementarity.
6. Duplicate skills are not counted multiple times.

### E. Unit tests — Team generation

Test:

1. Correct team size.
2. No duplicate members in one team.
3. No duplicate combinations.
4. Correct number of possible combinations.
5. Fewer than five valid combinations.
6. More than five valid combinations.
7. Insufficient candidate pool.
8. Invalid team size.
9. Deterministic generation.
10. Search limits.
11. Exact versus bounded search behavior.

### F. Unit tests — Ranking

Test:

1. Descending compatibility score.
2. Critical requirement tie-breaker.
3. Required coverage tie-breaker.
4. Role coverage tie-breaker.
5. Individual relevance tie-breaker.
6. Complementarity tie-breaker.
7. Deterministic final tie-breaker.

### G. Backend integration tests

Test:

- Successful recommendation generation.
- Authentication.
- Authorization.
- Missing project.
- Missing student profiles.
- Insufficient eligible students.
- Invalid requirements.
- Database failures.
- Correct response structure.
- Correct top-five limit.

### H. Frontend tests

Test:

- Find Best Teams action.
- Loading state.
- Recommendation cards.
- Team ranking.
- Individual member details.
- Score breakdown.
- Missing skills.
- Critical requirement warnings.
- Empty state.
- Error state.
- Retry behavior.

### I. Regression tests

Verify that the existing application continues to work.

In particular, do not break:

- Resume parsing.
- Profile extraction.
- Profile editing.
- Profile confirmation.
- Authentication.
- Google OAuth, if implemented.
- Project creation.
- Project editing.
- Project listing.
- Feature 2 individual compatibility scoring.

Run the available lint, test, and production build commands.

Fix any regressions caused by the implementation.

---

# 23. Accuracy, Evaluation, and Honest Reporting

Team recommendations must be evaluated honestly.

Do not claim that team recommendations have achieved 90% accuracy merely because individual compatibility in Feature 2 has achieved that result.

Team compatibility is a different prediction task.

If human-labelled team evaluation data is available, evaluate the recommendations against it.

A suitable evaluation dataset should contain:

- Project requirements.
- Team member profiles.
- Human-reviewed team suitability labels.
- The expected ranking or relevance judgments, where available.

Measure appropriate metrics such as:

- Precision at 5.
- Recall at 5, where ground-truth relevant teams are available.
- NDCG at 5, where graded relevance judgments are available.
- Pairwise ranking accuracy, where suitable labels exist.

Do not invent ground-truth labels or evaluation results.

If there is no human-reviewed team dataset, document that the ranking algorithm is implemented and tested using controlled test cases, but its real-world recommendation accuracy has not yet been independently verified.

---

# 24. Documentation

Update the appropriate README or project documentation.

Document:

1. Feature 3 overview.
2. How team generation works.
3. How eligible students are selected.
4. How team size is configured.
5. How combined skill coverage is calculated.
6. How role coverage is calculated.
7. How individual relevance is calculated.
8. How complementarity is calculated.
9. Final scoring formula.
10. Ranking and tie-breaking rules.
11. Exact and bounded search strategies.
12. API endpoints.
13. Response structure.
14. Configuration options.
15. How to run tests.
16. Known limitations.
17. Whether team recommendation accuracy has been independently evaluated.

The documentation must reflect the actual implementation, not an aspirational design.

---

# 25. Strict Scope Restrictions

Implement Feature 3 only.

Do not rewrite or replace Feature 1 or Feature 2.

Do not change the technology stack.

Do not migrate from MongoDB to another database.

Do not unnecessarily restructure the repository.

Do not remove existing functionality.

Do not introduce a paid AI dependency just to calculate team scores.

Do not use an LLM as the final team scoring or ranking authority.

Do not automatically create teams or assign students.

Do not implement invitation, acceptance, rejection, or team messaging workflows in this task.

Do not implement unrelated dashboard redesigns.

Keep the implementation modular so that permanent team creation and team management can be implemented as future functionality.

---

# 26. Required Implementation Workflow

Follow these phases in order.

## Phase 1 — Inspect the existing repository

Before writing code:

1. Inspect the complete repository structure.
2. Check Git status and preserve existing changes.
3. Inspect the root, client, and server package configurations.
4. Inspect the student profile MongoDB model.
5. Inspect the project MongoDB model.
6. Inspect authentication and authorization.
7. Inspect Feature 1's profile extraction and confirmation flow.
8. Inspect Feature 2's skill normalization implementation.
9. Inspect Feature 2's individual compatibility scoring service.
10. Inspect project creation and editing forms.
11. Inspect the existing frontend design system.
12. Inspect the existing tests and build commands.

Identify exactly which services, schemas, components, and utilities can be reused.

Do not assume any file paths or field names.

Do not overwrite existing work.

## Phase 2 — Design the implementation

Before coding, determine:

- How eligible students will be retrieved.
- How team size will be configured.
- How project skill requirements will be represented.
- How role requirements will be represented.
- How Feature 2 will be reused.
- How team combinations will be generated.
- How each team will be evaluated.
- How top-five ranking will work.
- How search performance will be controlled.
- How the frontend will present the recommendations.

Choose the smallest reasonable set of changes.

## Phase 3 — Database and project configuration

Implement any required schema updates.

Ensure existing projects remain compatible.

Add team size and structured role requirements only where necessary.

Provide safe defaults for existing projects.

Do not delete existing project information.

## Phase 4 — Backend implementation

Implement:

- Eligible candidate retrieval.
- Team combination generation.
- Team compatibility calculation.
- Role coverage calculation.
- Individual relevance calculation through Feature 2.
- Complementarity calculation.
- Team ranking.
- Top-five response generation.
- API validation and authorization.

Test the core algorithm independently before integrating the frontend.

## Phase 5 — Frontend implementation

Integrate the team recommendation functionality into the existing project interface.

Implement:

- Find Best Teams action.
- Loading states.
- Top-five recommendation cards.
- Team member details.
- Skill coverage.
- Role coverage.
- Compatibility breakdown.
- Missing requirements.
- Critical requirement status.
- Error and empty states.

Reuse existing components and design patterns.

## Phase 6 — Testing and optimization

Run all required tests.

Verify:

- Correct combination generation.
- Correct team scoring.
- Correct ranking.
- Correct top-five output.
- Deterministic results.
- No duplicate team members.
- No duplicate combinations.
- Correct search limits.
- No regressions in Features 1 and 2.

Run linting and production builds.

Fix all implementation-related errors.

## Phase 7 — Documentation and final report

Update the documentation and prepare a final implementation report.

---

# 27. Final Completion Report

After implementation, provide a report containing:

1. Overall implementation summary.
2. Files created.
3. Files modified.
4. Database schema changes.
5. Project configuration changes.
6. API endpoints added or modified.
7. Team generation algorithm.
8. Team scoring formula.
9. Skill coverage implementation.
10. Role coverage implementation.
11. Feature 2 integration.
12. Complementarity calculation.
13. Ranking and tie-breaking logic.
14. Search optimization strategy.
15. Frontend implementation details.
16. Unit test results.
17. Backend integration test results.
18. Frontend test results.
19. Lint results.
20. Production build results.
21. Accuracy evaluation status.
22. Known limitations and future improvements.

Clearly distinguish between:

- Implemented.
- Tested.
- Verified.
- Not independently evaluated.

Never report a test as passing unless it was actually executed and passed.

---

# FINAL INSTRUCTION

Start by inspecting the existing SyncSkills.AI repository and the completed implementations of Features 1 and 2.

Then implement Feature 3 completely in the existing codebase.

Do not stop after creating a plan.

Do not create only a UI mockup.

Do not create only a scoring function.

Complete the integration across MongoDB, backend services, APIs, and frontend.

**The most important requirement is that the system must recommend teams based on the collective ability of their members to satisfy a project's actual requirements, rather than simply combining individual compatibility scores.**

The final system must generate, evaluate, explain, and rank the top five distinct team combinations while preserving all existing application functionality.