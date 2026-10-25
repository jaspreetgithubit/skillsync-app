// System knowledge and prompts for SyncSkills.AI Gemini Assistant

export const SYNCSKILLS_SYSTEM_PROMPT = `
You are the official SyncSkills Gemini Copilot, powered by Google Gemini.
You have unrestricted intelligence and can answer ANY question the user asks, including:

1. Mathematics & Science:
   - Solve algebraic equations, calculus, arithmetic, geometry, matrices, and discrete math step-by-step with clear derivations.
   - Answer physics, science, and engineering questions with precise formulas and explanations.

2. Software Engineering & Programming:
   - Write, debug, and explain code in Python, JavaScript, TypeScript, Rust, Go, C++, SQL, HTML/CSS, etc.
   - Explain algorithms, system design, data structures, and best practices.

3. SyncSkills.AI Platform Guidance:
   - Explain our zero-bias algorithmic team formation and Hungarian bipartite matching.
   - Explain NLP-based skill extraction from project briefs and resumes.
   - Guide users through the 9-stage workflow:
     * Step 1: Profile Setup & Skill Curation (/profile-setup)
     * Step 2: Explore Live Projects (/explore-projects)
     * Step 3: Project Deep Dive (/project/:id)
     * Step 4: Multi-Vector Compatibility Analysis (/project/:id/compatibility)
     * Steps 5 & 6: Side-by-Side Team Comparison Matrix (/project/:id/compare)
     * Step 7: AI Recommended 4-Person Squad Breakdown (/project/:id/recommended)
     * Step 8: Interactive Team Chat & Sprint Collaboration Hub (/team/:id)
     * Step 9: Project Creator & Lead Admin Portal (/admin)

4. General Knowledge & Everyday Queries:
   - Answer general knowledge, logic puzzles, summaries, and creative questions politely and thoroughly.

Formatting Rules:
- Use bolding, bullet points, and code formatting (\`code\` or code blocks) for clean readability.
- When solving equations, show the step-by-step resolution clearly.
`;

export const STARTER_SUGGESTIONS = [
  {
    icon: '📐',
    label: 'Solve a Math Equation',
    prompt: 'Solve this equation step-by-step: 4x + 12 = 36'
  },
  {
    icon: '⚡',
    label: 'How does AI team matching work?',
    prompt: 'How does SyncSkills.AI match team members using AI and NLP?'
  },
  {
    icon: '💻',
    label: 'Write a Python QuickSort',
    prompt: 'Write an optimized QuickSort algorithm in Python with an explanation.'
  },
  {
    icon: '🚀',
    label: 'Optimal Hackathon Squad Stack',
    prompt: 'What is the optimal 4-person team composition and tech stack for a 48-hour FinTech hackathon?'
  }
];

export const FALLBACK_RESPONSES = [
  {
    keywords: ['how', 'match', 'matching', 'algorithm', 'work', 'nlp'],
    response: `**How SyncSkills.AI Matching Works:**\n\n1. **NLP Skill Extraction**: When a project is created, our engine parses the brief using NLP to identify required programming languages, frameworks, and architecture patterns.\n2. **Multi-Vector Compatibility**: We score candidate profiles against 3 dimensions:\n   - **Skill Coverage (40%)**: Core languages & frameworks.\n   - **Role Synergy (35%)**: Eliminates redundancy (e.g. 4 backend devs, 0 frontend).\n   - **Timezone & Cadence (25%)**: Ensures synchronous collaboration windows.\n3. **Balanced Pod Formation**: Generates an optimized 4-person squad ready for immediate kickoff with zero skill gaps.`
  },
  {
    keywords: ['hackathon', 'stack', 'tech stack', 'composition', 'team'],
    response: `**Optimal 4-Person Hackathon Squad Composition:**\n\n- **Member 1 (Lead / Architect)**: Full Stack + API design (FastAPI / Next.js).\n- **Member 2 (Frontend Specialist)**: React / Tailwind / Motion for a breathtaking pitch demo.\n- **Member 3 (Core AI / Logic)**: Python / PyTorch / LangChain / Gemini API integration.\n- **Member 4 (Cloud & DevOps / Demo Prep)**: Docker, Supabase, Presentation slide deck & demo staging.\n\n*Tip: SyncSkills automatically balances these roles when recommending squads!*`
  },
  {
    keywords: ['project', 'explore', 'capstone', 'join', 'apply'],
    response: `**Finding and Joining Projects on SyncSkills.AI:**\n\n1. Click **Get Started** on the top navigation bar or hero section.\n2. Choose **"Join an Existing Project"**.\n3. Curate your profile with your skills (e.g., React, Python, Docker).\n4. Browse our catalog of vetted Capstone and Hackathon projects.\n5. Click **"Analyze My Fit"** to inspect your compatibility score and join the squad!`
  },
  {
    keywords: ['google', 'auth', 'login', 'sign in', 'supabase'],
    response: `**Google Sign-In & Authentication:**\n\n- You can sign in using the **"Continue with Google"** button on the Auth page.\n- For live Supabase OAuth, ensure \`VITE_SUPABASE_URL\` and \`VITE_SUPABASE_ANON_KEY\` are defined in your \`.env\` file.\n- If keys are not yet configured, our interactive Google Account Chooser allows one-click sandbox sign-in so your development never stops!`
  }
];
