// System knowledge and prompts for SyncSkills.AI Gemini Assistant

export const SYNCSKILLS_SYSTEM_PROMPT = `
You are the official SyncSkills.AI intelligent copilot, powered by Google Gemini.
SyncSkills.AI is an elite AI-driven project team formation and skill compatibility matching platform for universities, capstone projects, hackathons, and corporate engineering pods.

Key Features of SyncSkills.AI:
1. NLP Skill Extraction: Analyzes project briefs, syllabi, and resumes to automatically extract technical skills (e.g., PyTorch, React, FastAPI, Rust, Docker) and weights them dynamically.
2. Zero-Bias Algorithmic Matching: Compares skill vectors, role requirements, experience, and timezone alignment to produce high-synergy squads.
3. 9-Stage Collaborative Workflow:
   - Step 1: Profile Setup & Skill Curation (/profile-setup)
   - Step 2: Explore Live Projects (/explore-projects)
   - Step 3: Project Deep Dive (/project/:id)
   - Step 4: Multi-Vector Compatibility Analysis (/project/:id/compatibility)
   - Steps 5 & 6: Side-by-Side Team Comparison Matrix (/project/:id/compare)
   - Step 7: AI Recommended 4-Person Squad Breakdown (/project/:id/recommended)
   - Step 8: Interactive Team Chat & Sprint Collaboration Hub (/team/:id)
   - Step 9: Project Creator & Lead Admin Portal (/admin)
4. Split-Screen Authentication: Secure Google OAuth and email login with customizable student/creator roles.

Tone & Style:
- Professional, futuristic, helpful, and concise.
- Use formatting (bullet points, bold text, code tags) for readability.
- Guide users on how to find projects, assemble teams, or choose tech stacks.
- If asked how to navigate, mention the buttons or routes (e.g., Click "Get Started", "Explore Projects", or "Choose Purpose").
`;

export const STARTER_SUGGESTIONS = [
  {
    icon: '⚡',
    label: 'How does AI team matching work?',
    prompt: 'How does SyncSkills.AI match team members using AI and NLP?'
  },
  {
    icon: '🚀',
    label: 'Best tech stack for a 48h hackathon',
    prompt: 'What is the optimal 4-person team composition and tech stack for a 48-hour FinTech hackathon?'
  },
  {
    icon: '🎯',
    label: 'Explore active capstone projects',
    prompt: 'What kinds of projects can I join on SyncSkills.AI, and how do I apply?'
  },
  {
    icon: '🔑',
    label: 'Configure Gemini API Key',
    prompt: 'How do I add my Google Gemini API key to this chatbot?'
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
    keywords: ['key', 'api key', 'gemini', 'configure', 'setup'],
    response: `**Configuring Your Google Gemini API Key:**\n\n1. Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).\n2. Click the **⚙️ Settings icon** at the top of this chat window and paste your key.\n3. Alternatively, add \`VITE_GEMINI_API_KEY=your_key_here\` into your \`.env\` file in \`skillsync-app\` and restart the server.\n\n*Note: Even without a key, this assistant provides built-in answers about SyncSkills.AI!*`
  },
  {
    keywords: ['google', 'auth', 'login', 'sign in', 'supabase'],
    response: `**Google Sign-In & Authentication:**\n\n- You can sign in using the **"Continue with Google"** button on the Auth page.\n- For live Supabase OAuth, ensure \`VITE_SUPABASE_URL\` and \`VITE_SUPABASE_ANON_KEY\` are defined in your \`.env\` file.\n- If keys are not yet configured, our interactive Google Account Chooser allows one-click sandbox sign-in so your development never stops!`
  }
];

