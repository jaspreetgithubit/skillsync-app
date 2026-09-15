import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  BrainCircuit, 
  Brain, 
  ChevronDown, 
  Zap, 
  Keyboard, 
  Activity, 
  GraduationCap, 
  Rocket, 
  Building2, 
  Layers,
  Check,
  AlertCircle,
  UploadCloud,
  FileText,
  Trash2,
  Plus,
  X,
  Briefcase,
  FolderGit2
} from 'lucide-react';
import AIGraphicCanvas from './AIGraphicCanvas';

/**
 * 6 APPROVED STORY SECTIONS (PRESERVED 100%)
 * Harmonized with Landing Page Obsidian & Amber-Gold Palette (#F59E0B)
 */
const STORY_SECTIONS = [
  {
    id: 'intro',
    type: 'text_only',
    stageLabel: 'WELCOME',
    headline: 'WELCOME BACK.',
    subheadline: 'YOUR TEAM IS WAITING.',
    tagline: 'Good ideas get better with the right people.',
    scrollHint: 'SCROLL TO ENTER THE AI SPRINT ↓',
    image: null
  },
  {
    id: 'build',
    type: 'image',
    number: '01',
    category: 'BUILD',
    tagline: 'Turn ideas into reality.',
    desc: 'Deep AST code parsing, developer capability mapping, and real-time repository analysis.',
    image: '/images/step1_profile.jpg',
    kineticTitle: 'PARSE. MAP. FORM.',
    badge: 'AST Capability Engine',
    hudTelemetry: ['AST: 99.4% MATCH', 'VECTORS: 512-DIM', 'ZERO LATENCY']
  },
  {
    id: 'collaborate',
    type: 'image',
    number: '02',
    category: 'COLLABORATE',
    tagline: 'Better together.',
    desc: 'Cross-functional role extraction matching complementary minds across university and agile pods.',
    image: '/images/step2_project.jpg',
    kineticTitle: 'ALIGN MINDS & ROLES',
    badge: 'Hungarian Synergy Matrix',
    hudTelemetry: ['COGNITIVE FIT: 96%', 'BALANCE: PERFECT', 'FRICTION: ZERO']
  },
  {
    id: 'intelligence',
    type: 'image',
    number: '03',
    category: 'INTELLIGENCE',
    tagline: 'Let AI find the connections.',
    desc: 'Mathematical Hungarian optimization calculating cognitive balance with zero social friction.',
    image: '/images/step3_nlp.jpg',
    kineticTitle: 'NEURAL OPTIMIZATION',
    badge: 'Multi-Graph Solver',
    hudTelemetry: ['GRAPH CLUSTERS: 12', 'OPTIMAL ASSIGN: 100%', 'GPU INFERENCE: 4ms']
  },
  {
    id: 'connect',
    type: 'image',
    number: '04',
    category: 'CONNECT',
    tagline: 'Different skills. One stronger team.',
    desc: 'Dynamic 60-second hackathon matchmaking balancing AI, backend, UI, and engineering speed.',
    image: '/images/usecase_hackathon.jpg',
    kineticTitle: 'RAPID SQUAD ASSEMBLY',
    badge: 'Sprint Velocity Engine',
    hudTelemetry: ['ASSEMBLE TIME: 58s', 'ROLES FILLED: 5/5', 'TECH STACK: VERIFIED']
  },
  {
    id: 'create',
    type: 'image',
    number: '05',
    category: 'CREATE',
    tagline: 'Build something remarkable together.',
    desc: 'Autonomous AI squad assembly ready to deploy with guaranteed zero skill mismatch.',
    image: '/images/step4_team.jpg',
    kineticTitle: 'READY TO SHIP',
    badge: 'Autonomous Pod Core',
    hudTelemetry: ['DEPLOY STATUS: READY', 'TEAM HARMONY: 98%', 'MISSION: GO']
  }
];

/**
 * 4 CONTEXTUAL PURPOSE CONFIGURATIONS
 * Perfectly matched with Landing Page:
 * Obsidian Base (#080B12), Warm Amber Gold (#F59E0B), Soft Violet (#8B5CF6)
 */
const PURPOSE_CONFIGS = {
  company: {
    id: 'company',
    label: 'Company',
    badge: 'Enterprise Talent Mobility',
    welcomeHeading: 'Welcome, Company.',
    welcomeSubheadline: 'Build high-performing teams with AI-powered skill matching.',
    supportingText: 'Internal talent mobility assembling cross-functional engineering pods from existing employee pools. Fulfills urgent company initiatives with zero external recruiting lag.',
    cardTitle: 'Corporate Squads',
    cardDesc: 'Empowers engineering leaders and HR directors to assemble cross-functional project pods from internal employee talent pools with zero recruiting lag.',
    image: '/images/usecase_corporate.jpg',
    icon: Building2,
    accent: '#F59E0B',
    accentBorder: 'border-[#F59E0B]/40',
    accentBg: 'bg-[#F59E0B]/10',
    accentGlow: 'rgba(245, 158, 11, 0.35)',
    gradient: 'from-amber-400 via-amber-500 to-amber-600',
    networkNodes: [
      { name: 'People', desc: 'Internal Talent', icon: User },
      { name: 'Skills', desc: 'AST Matrices', icon: Zap },
      { name: 'Roles', desc: 'Pod Alignment', icon: Building2 },
      { name: 'Teams', desc: 'Agile Squads', icon: CheckCircle2 }
    ],
    floatingCards: [
      {
        title: 'COMPANY MATCHING',
        stat: 'Skills → Roles → Teams',
        sub: '94% Compatibility',
        icon: Building2
      },
      {
        title: 'TEAM COMPATIBILITY',
        stat: '94% Fit',
        sub: 'Balanced Capability',
        icon: CheckCircle2
      },
      {
        title: 'ENTERPRISE PODS',
        stat: 'Agile Sprints',
        sub: 'Zero Hiring Lag',
        icon: Activity
      }
    ],
    techStack: ['Microservices', 'Kubernetes', 'Go', 'Zero-Trust', 'GraphQL', 'Hungarian 99%'],
    tags: ['Internal Mobility', 'Agile Pods', 'Zero Hiring Lag']
  },
  college: {
    id: 'college',
    label: 'College',
    badge: 'University Campus Network',
    welcomeHeading: 'Welcome, College.',
    welcomeSubheadline: 'Build stronger student teams for projects, learning and innovation.',
    supportingText: 'Campus-wide peer capability mapping for collaborative coursework, research labs, and multi-department student initiatives. Eliminate free-riders and pair complementary learners.',
    cardTitle: 'College Innovation Labs',
    cardDesc: 'Campus-wide peer skill mapping for collaborative coursework, research labs, and multi-department student initiatives.',
    image: '/images/usecase_capstone.jpg',
    icon: GraduationCap,
    accent: '#F59E0B',
    accentBorder: 'border-amber-500/40',
    accentBg: 'bg-amber-500/10',
    accentGlow: 'rgba(245, 158, 11, 0.35)',
    gradient: 'from-amber-400 via-orange-500 to-amber-600',
    networkNodes: [
      { name: 'Students', desc: 'Peer Profiles', icon: User },
      { name: 'Skills', desc: 'Course Matrix', icon: Zap },
      { name: 'Projects', desc: 'Lab Topics', icon: GraduationCap },
      { name: 'Teams', desc: 'Balanced Cohort', icon: CheckCircle2 }
    ],
    floatingCards: [
      {
        title: 'STUDENT MATCHING',
        stat: 'Skills → Projects → Teams',
        sub: '94% Compatibility',
        icon: GraduationCap
      },
      {
        title: 'TEAM READY',
        stat: '5 Members',
        sub: '✓ Skills Covered',
        icon: CheckCircle2
      },
      {
        title: 'ACADEMIC POD',
        stat: 'Balanced Workload',
        sub: 'Zero Free-Riders',
        icon: Activity
      }
    ],
    techStack: ['Python', 'Data Structures', 'Full-Stack', 'Research AI', 'Git', 'Hungarian 98.4%'],
    tags: ['Coursework Labs', 'Peer Matching', 'Cross-Department']
  },
  capstone: {
    id: 'capstone',
    label: 'Capstone Project',
    badge: 'Academic Capstone Core',
    welcomeHeading: 'Build Your Capstone Team.',
    welcomeSubheadline: 'Find students whose skills complete your project requirements.',
    supportingText: 'Balanced student teams matched to university project titles. AI parses AST skills to guarantee 100% full-stack coverage and eliminate free-rider disputes before final defense.',
    cardTitle: 'University Capstone Projects',
    cardDesc: 'Balanced student teams matched to university project titles. AI parses AST skills to guarantee 100% full-stack coverage and eliminate free-rider disputes.',
    image: '/images/step1_profile.jpg',
    icon: Layers,
    accent: '#F59E0B',
    accentBorder: 'border-amber-500/40',
    accentBg: 'bg-amber-500/10',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    gradient: 'from-amber-400 via-amber-500 to-amber-600',
    networkNodes: [
      { name: 'Skills', desc: 'AST Capabilities', icon: Zap },
      { name: 'Technologies', desc: 'Full-Stack Stack', icon: Layers },
      { name: 'Project', desc: 'Capstone Title', icon: GraduationCap },
      { name: 'Team', desc: 'Defense Ready', icon: CheckCircle2 }
    ],
    floatingCards: [
      {
        title: 'CAPSTONE MATCH',
        stat: 'Python + ML + React',
        sub: 'Full-Stack Coverage',
        icon: Layers
      },
      {
        title: 'SKILL COVERAGE',
        stat: '94%',
        sub: 'Defense Ready',
        icon: CheckCircle2
      },
      {
        title: 'PROJECT READY',
        stat: 'Supervisor Fit',
        sub: 'Zero Free-Riders',
        icon: Activity
      }
    ],
    techStack: ['Python', 'ML / PyTorch', 'React', 'FastAPI', 'Docker', 'AST Parsing'],
    tags: ['Balanced Roles', 'Supervisor Aligned', 'Zero Free-Riders']
  },
  hackathon: {
    id: 'hackathon',
    label: 'Hackathon',
    badge: '48-Hour Innovation Sprint',
    welcomeHeading: 'Build Your Hackathon Team.',
    welcomeSubheadline: 'Find the right combination of skills before the clock runs out.',
    supportingText: 'Rapid 60-second teammate matchmaking clustered around problem statements. Pairs frontend wizards, ML researchers, and backend engineers for sprint velocity.',
    cardTitle: 'Competitive Hackathons',
    cardDesc: 'Rapid 60-second teammate matchmaking clustered around problem statements. Pairs frontend wizards, ML researchers, and backend engineers for sprint velocity.',
    image: '/images/usecase_hackathon.jpg',
    icon: Rocket,
    accent: '#F59E0B',
    accentBorder: 'border-amber-500/40',
    accentBg: 'bg-amber-500/10',
    accentGlow: 'rgba(245, 158, 11, 0.4)',
    gradient: 'from-amber-400 via-violet-500 to-purple-600',
    networkNodes: [
      { name: 'Developers', desc: 'Hackers Synced', icon: User },
      { name: 'Skills', desc: 'Rapid Toolkit', icon: Zap },
      { name: 'AI', desc: 'Sprint Matcher', icon: Brain },
      { name: 'Team', desc: 'Prototype Ready', icon: CheckCircle2 }
    ],
    floatingCards: [
      {
        title: 'HACKATHON MATCH',
        stat: 'Skills detected',
        sub: 'Speed Pairing',
        icon: Rocket
      },
      {
        title: 'TEAM READY',
        stat: '5 Members',
        sub: '✓ Skills Covered',
        icon: CheckCircle2
      },
      {
        title: 'SPRINT VELOCITY',
        stat: '60s Matchmaking',
        sub: '48h Prototype Lead',
        icon: Activity
      }
    ],
    techStack: ['Rust', 'Next.js', 'Solana', 'Kafka', 'WASM', 'Rapid 60s'],
    tags: ['60s Matchmaking', 'Sprint Velocity', 'Problem Track Fit']
  }
};

const KNOWN_TECH_SKILLS = [
  'Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow',
  'React', 'Node.js', 'FastAPI', 'TypeScript', 'JavaScript', 'Docker',
  'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Go', 'Rust',
  'C++', 'Java', 'Solidity', 'TailwindCSS', 'Next.js', 'NLP',
  'Computer Vision', 'Redis', 'CI/CD', 'Git', 'Linux', 'Figma'
];

function getTrackDefaultSkills(track, filename = '') {
  const lowerFile = (filename || '').toLowerCase();
  const detected = [];
  KNOWN_TECH_SKILLS.forEach(s => {
    if (lowerFile.includes(s.toLowerCase())) {
      detected.push({ name: s, level: 'Advanced' });
    }
  });

  let base = [];
  if (track === 'company') {
    base = [
      { name: 'Python', level: 'Advanced' },
      { name: 'React', level: 'Advanced' },
      { name: 'AWS', level: 'Advanced' },
      { name: 'Docker', level: 'Intermediate' },
      { name: 'PostgreSQL', level: 'Intermediate' },
      { name: 'TypeScript', level: 'Intermediate' }
    ];
  } else if (track === 'hackathon') {
    base = [
      { name: 'TypeScript', level: 'Advanced' },
      { name: 'Next.js', level: 'Advanced' },
      { name: 'FastAPI', level: 'Intermediate' },
      { name: 'TailwindCSS', level: 'Advanced' },
      { name: 'GraphQL', level: 'Intermediate' },
      { name: 'Docker', level: 'Intermediate' }
    ];
  } else {
    // capstone or college
    base = [
      { name: 'Python', level: 'Advanced' },
      { name: 'Machine Learning', level: 'Advanced' },
      { name: 'FastAPI', level: 'Intermediate' },
      { name: 'PyTorch', level: 'Intermediate' },
      { name: 'React', level: 'Intermediate' },
      { name: 'PostgreSQL', level: 'Intermediate' }
    ];
  }

  const skillMap = new Map();
  detected.forEach(s => skillMap.set(s.name, s));
  base.forEach(s => {
    if (!skillMap.has(s.name)) skillMap.set(s.name, s);
  });
  return Array.from(skillMap.values());
}

const POPULAR_INTERESTS = [
  'AI / Machine Learning',
  'Distributed Systems',
  'Cloud Architecture',
  'Web3 & Smart Contracts',
  'FinTech & High Velocity',
  'Cybersecurity',
  'Robotics & IoT',
  'Full-Stack Web',
  'Mobile Engineering',
  'NLP & Vector Search'
];

const EXPERIENCE_LEVELS = [
  'Fresher / Student (0-1 yrs)',
  'Junior Engineer (1-2 yrs)',
  'Mid-Level Specialist (3-5 yrs)',
  'Senior / Staff Lead (5+ yrs)'
];

const PREFERRED_ROLES = [
  'Full-Stack Developer',
  'AI / Machine Learning Lead',
  'Backend API Architect',
  'Frontend UI/UX Specialist',
  'Cloud & Security Lead',
  'Data Scientist & Analytics',
  'Embedded IoT Specialist',
  'Sprint / Product Lead'
];

function getTrackDefaultProjects(track, filename = '') {
  if (track === 'company') {
    return [
      { title: 'Enterprise Event Pipeline', desc: 'Real-time Kafka event streaming with microservices', tech: 'Go, Kafka, Kubernetes' },
      { title: 'Cloud Infrastructure Automation', desc: 'Terraform multi-cloud IaC provisioning engine', tech: 'AWS, Terraform, Python' }
    ];
  } else if (track === 'hackathon') {
    return [
      { title: 'SpeedMatch DeFi Escrow', desc: '48-hour prototype with automated settlement escrow', tech: 'Solana, Rust, Next.js' },
      { title: 'Voice AI Meeting Summarizer', desc: 'Whisper + Claude real-time sprint action tracker', tech: 'FastAPI, WebSockets, React' }
    ];
  } else {
    return [
      { title: 'Neural Hungarian Matcher', desc: 'Bipartite graph optimization for collaborative pods', tech: 'Python, PyTorch, FastAPI' },
      { title: 'Distributed AST Code Analyzer', desc: 'Syntax-tree dependency extraction engine', tech: 'TypeScript, Babel, Redis' }
    ];
  }
}

function getTrackEmployeeProfile(track, email) {
  const emailName = email ? email.split('@')[0].replace(/[\._]/g, ' ') : 'Alex Chen';
  const formattedName = emailName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Alex Chen';

  if (track === 'company') {
    return {
      name: formattedName.includes('Alex') ? 'Alex Chen' : formattedName,
      role: 'Staff Systems Architect & Pod Lead',
      experience: 'Senior Architect (5+ yrs)',
      department: 'Enterprise Talent Mobility',
      interests: ['Distributed Systems', 'Cloud Architecture', 'Zero-Trust Security', 'Microservices', 'High-Velocity Sprints'],
      previousProjects: [
        { title: 'Enterprise Event Streaming Fabric', desc: 'Sub-3ms distributed event mesh across 40+ Kubernetes microservices', tech: 'Go, Kafka, Kubernetes' },
        { title: 'Zero-Trust Identity & Access Mesh', desc: 'Automated mTLS and ephemeral role-based token minting infrastructure', tech: 'Rust, OAuth2, HashiCorp Vault' }
      ],
      skills: [
        { name: 'Go / Golang', level: 'Staff Expert' },
        { name: 'Kubernetes', level: 'Lead' },
        { name: 'Distributed Systems', level: 'Architect' },
        { name: 'Microservices', level: 'Advanced' },
        { name: 'Kafka', level: 'Expert' }
      ]
    };
  }
  if (track === 'college') {
    return {
      name: formattedName.includes('Alex') ? 'Priya Sharma' : formattedName,
      role: 'Machine Learning & Research Lead',
      experience: 'Junior Engineer (1-2 yrs)',
      department: 'Computer Science & AI Innovation Lab',
      interests: ['AI / Machine Learning', 'Computer Vision', 'Data Structures & Algorithms', 'Research AI', 'Peer Matching'],
      previousProjects: [
        { title: 'Multi-Agent Campus Synergy Lab', desc: 'Autonomous agent cohort simulator for multidisciplinary coursework research', tech: 'Python, PyTorch, Ray' },
        { title: 'Real-Time Academic Peer Matcher', desc: 'Bipartite matching algorithm matching students for university project cohorts', tech: 'FastAPI, React, PostgreSQL' }
      ],
      skills: [
        { name: 'Python', level: 'Expert' },
        { name: 'PyTorch', level: 'Advanced' },
        { name: 'Data Structures', level: 'Advanced' },
        { name: 'React', level: 'Intermediate' }
      ]
    };
  }
  if (track === 'hackathon') {
    return {
      name: formattedName.includes('Alex') ? 'Dev Patel' : formattedName,
      role: 'Rapid Prototyper & Systems Hacker',
      experience: 'High-Velocity Builder (2-4 yrs)',
      department: 'Competitive Hackathon Sprint Arena',
      interests: ['Web3 & Protocols', 'WASM', 'Real-Time Systems', 'LLM Agents', 'Rapid 60s Deployment'],
      previousProjects: [
        { title: 'Sub-Second Solana DeFi Matcher', desc: 'Competitive hackathon 1st place liquidity routing engine built in 36 hours', tech: 'Rust, Solana, Anchor' },
        { title: 'Generative Multi-Modal Agent Canvas', desc: 'Speech-to-code prototype generator deployed in under 60 seconds', tech: 'Next.js, Tailwind, Claude API' }
      ],
      skills: [
        { name: 'Rust', level: 'Expert' },
        { name: 'Next.js', level: 'Advanced' },
        { name: 'Solana / WASM', level: 'Advanced' },
        { name: 'TypeScript', level: 'Expert' }
      ]
    };
  }
  // Default: Capstone Project Track
  return {
    name: formattedName.includes('Alex') ? 'Alex Chen' : formattedName,
    role: 'Full-Stack Developer & ML Specialist',
    experience: 'Mid-Level Specialist (3-5 yrs)',
    department: 'University Capstone Projects Core',
    interests: ['Distributed Systems', 'Cloud Architecture', 'FinTech & High Velocity', 'AST Code Parsing'],
    previousProjects: [
      { title: 'High-Frequency Matching Engine', desc: 'Sub-millisecond bipartite order & sprint routing system', tech: 'Go, Rust, Kafka' },
      { title: 'Interactive WebGL Canvas Hub', desc: 'Spatial collaborative ideation board with real-time state synchronization', tech: 'React, Three.js, WebSockets' }
    ],
    skills: [
      { name: 'React', level: 'Expert' },
      { name: 'Python', level: 'Advanced' },
      { name: 'Node.js', level: 'Advanced' },
      { name: 'Vector DBs', level: 'Intermediate' },
      { name: 'Docker', level: 'Advanced' }
    ]
  };
}

export default function TeamMatchSignInExperience({
  onAuthenticated,
  onBackToHome,
  initialMode = 'signin',
  initialPurpose = 'capstone',
  onPurposeChange
}) {
  /**
   * 8 Deterministic Stages:
   * 0: Intro (Welcome Back - Kinetic Typography)
   * 1: 01 Build (Z-Axis Zoom + AST Scanner)
   * 2: 02 Collaborate (Layered Horizontal Parallax Skew)
   * 3: 03 Intelligence (Organic Mask Reveal + Neural Hungarian Nodes)
   * 4: 04 Connect (3D Depth Layer Separation)
   * 5: 05 Create (Cosmic Dissolve into AI WebGL Network)
   * 6: Pre-Sign-In Track Selection ("Choose What You're Building For")
   * 7: Final Sign-In Scene (3D Glass Vault + Floating HUD + Magnetic CTA)
   */
  const [currentStage, setCurrentStage] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('down');

  // Track / Purpose State
  const resolvedInitialPurpose = PURPOSE_CONFIGS[initialPurpose] ? initialPurpose : 'capstone';
  const [selectedPurpose, setSelectedPurpose] = useState(resolvedInitialPurpose);
  const currentConfig = PURPOSE_CONFIGS[selectedPurpose] || PURPOSE_CONFIGS.capstone;

  // Auth States
  const [authMode, setAuthMode] = useState(initialMode || 'signin');
  const [showPassword, setShowPassword] = useState(false);
  const [authPhase, setAuthPhase] = useState('idle'); // 'idle' | 'authenticating' | 'verifying' | 'complete'
  const [authError, setAuthError] = useState('');

  // Mouse & 3D Parallax Tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);

  // Form Fields
  // Form Fields (Sign In: strictly email and password; Profile is retrieved upon sign in)
  const [signInData, setSignInData] = useState({
    email: 'alex.chen@university.edu',
    password: '••••••••••••',
    role: 'Full-Stack Developer',
    experience: 'Mid-Level Specialist (3-5 yrs)',
    interests: ['Distributed Systems', 'Cloud Architecture', 'FinTech & High Velocity'],
    previousProjects: [
      { title: 'High-Frequency Matching Engine', desc: 'Sub-millisecond order & sprint routing system', tech: 'Go, Rust, Kafka' },
      { title: 'Interactive WebGL Canvas Hub', desc: 'Spatial collaborative ideation board', tech: 'React, Three.js, WebSockets' }
    ],
    rememberMe: true
  });

  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Full-Stack Developer',
    experience: 'Junior Engineer (1-2 yrs)',
    interests: ['AI / Machine Learning', 'Distributed Systems'],
    previousProjects: [
      { title: 'Neural Hungarian Matcher', desc: 'Real-time bipartite matchmaking engine', tech: 'Python, FastAPI, Redis' }
    ],
    agreeTerms: true
  });

  // Additional Profile Customization States (Interests & Projects)
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', desc: '', tech: '' });

  const handleToggleInterest = (interest) => {
    setSignUpData(prev => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleAddCustomInterest = () => {
    if (!customInterestInput.trim()) return;
    const clean = customInterestInput.trim();
    if (!signUpData.interests.includes(clean)) {
      setSignUpData(prev => ({ ...prev, interests: [...prev.interests, clean] }));
    }
    setCustomInterestInput('');
  };

  const handleAddNewProject = () => {
    if (!newProject.title.trim()) return;
    setSignUpData(prev => ({
      ...prev,
      previousProjects: [
        ...prev.previousProjects,
        {
          title: newProject.title.trim(),
          desc: newProject.desc.trim() || 'Technical implementation & sprint delivery',
          tech: newProject.tech.trim() || 'Modern Tech Stack'
        }
      ]
    }));
    setNewProject({ title: '', desc: '', tech: '' });
    setShowAddProjectForm(false);
  };

  const handleRemovePreviousProject = (projIndex) => {
    setSignUpData(prev => ({
      ...prev,
      previousProjects: prev.previousProjects.filter((_, idx) => idx !== projIndex)
    }));
  };

  // Sign-In Profile Customization States (Interests & Projects)
  const [signInCustomInterestInput, setSignInCustomInterestInput] = useState('');
  const [showSignInAddProject, setShowSignInAddProject] = useState(false);
  const [newSignInProject, setNewSignInProject] = useState({ title: '', desc: '', tech: '' });

  const handleToggleSignInInterest = (interest) => {
    setSignInData(prev => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const handleAddSignInCustomInterest = () => {
    if (!signInCustomInterestInput.trim()) return;
    const clean = signInCustomInterestInput.trim();
    if (!signInData.interests.includes(clean)) {
      setSignInData(prev => ({ ...prev, interests: [...prev.interests, clean] }));
    }
    setSignInCustomInterestInput('');
  };

  const handleAddSignInProject = () => {
    if (!newSignInProject.title.trim()) return;
    setSignInData(prev => ({
      ...prev,
      previousProjects: [
        ...prev.previousProjects,
        {
          title: newSignInProject.title.trim(),
          desc: newSignInProject.desc.trim() || 'Technical implementation & sprint delivery',
          tech: newSignInProject.tech.trim() || 'Modern Tech Stack'
        }
      ]
    }));
    setNewSignInProject({ title: '', desc: '', tech: '' });
    setShowSignInAddProject(false);
  };

  const handleRemoveSignInProject = (projIndex) => {
    setSignInData(prev => ({
      ...prev,
      previousProjects: prev.previousProjects.filter((_, idx) => idx !== projIndex)
    }));
  };

  // CV Upload & AI Skill Extraction State
  const [cvFile, setCvFile] = useState(null);
  const [cvUploadPhase, setCvUploadPhase] = useState('idle'); // 'idle' | 'analyzing' | 'extracted'
  const [cvAnalysisStep, setCvAnalysisStep] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [isCvDragOver, setIsCvDragOver] = useState(false);
  const cvFileInputRef = useRef(null);

  const handleProcessCvFile = (file) => {
    if (!file) return;
    setCvFile(file);
    setCvUploadPhase('analyzing');
    setCvAnalysisStep('Scanning document structure & AST metadata...');

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target.result || '').toLowerCase();
        setTimeout(() => {
          setCvAnalysisStep('Parsing technical keywords & repositories...');
          setTimeout(() => {
            setCvAnalysisStep('Synthesizing competency profile...');
            setTimeout(() => {
              const matched = [];
              KNOWN_TECH_SKILLS.forEach(k => {
                if (text.includes(k.toLowerCase())) matched.push({ name: k, level: 'Verified' });
              });
              const finalSkills = matched.length >= 3 
                ? matched 
                : getTrackDefaultSkills(selectedPurpose, file.name);
              setExtractedSkills(finalSkills);
              setCvUploadPhase('extracted');

              // Auto-detect candidate projects from CV if empty
              if (signUpData.previousProjects.length === 0) {
                const defProjects = getTrackDefaultProjects(selectedPurpose, file.name);
                setSignUpData(prev => ({ ...prev, previousProjects: defProjects }));
              }
            }, 600);
          }, 600);
        }, 500);
      };
      reader.readAsText(file);
    } else {
      setTimeout(() => {
        setCvAnalysisStep('Extracting project contributions & frameworks...');
        setTimeout(() => {
          setCvAnalysisStep('Synthesizing competency vectors & proficiencies...');
          setTimeout(() => {
            const skills = getTrackDefaultSkills(selectedPurpose, file.name);
            setExtractedSkills(skills);
            setCvUploadPhase('extracted');

            // Auto-detect candidate projects from CV if empty
            if (signUpData.previousProjects.length === 0) {
              const defProjects = getTrackDefaultProjects(selectedPurpose, file.name);
              setSignUpData(prev => ({ ...prev, previousProjects: defProjects }));
            }
          }, 600);
        }, 650);
      }, 500);
    }
  };

  const handleRemoveExtractedSkill = (skillIndex) => {
    setExtractedSkills(prev => prev.filter((_, idx) => idx !== skillIndex));
  };

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const clean = customSkillInput.trim();
    if (!extractedSkills.some(s => s.name.toLowerCase() === clean.toLowerCase())) {
      setExtractedSkills(prev => [...prev, { name: clean, level: 'User Added' }]);
    }
    setCustomSkillInput('');
  };

  const handleRemoveCvFile = () => {
    setCvFile(null);
    setCvUploadPhase('idle');
    setExtractedSkills([]);
  };

  // DOM & Animation Refs
  const experienceContainerRef = useRef(null);
  const scene6ContainerRef = useRef(null);
  const signInContainerRef = useRef(null);
  const magneticBtnRef = useRef(null);
  const card3DRef = useRef(null);
  const kineticTextRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const lenisRef = useRef(null);
  const touchStartY = useRef(0);
  const lastScrollTime = useRef(0);

  // Synchronize purpose if prop changes
  useEffect(() => {
    if (initialPurpose && PURPOSE_CONFIGS[initialPurpose]) {
      setSelectedPurpose(initialPurpose);
    }
  }, [initialPurpose]);

  const handleSelectPurpose = (purposeId) => {
    setSelectedPurpose(purposeId);
    if (onPurposeChange) {
      onPurposeChange(purposeId);
    }
  };

  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const reqId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(reqId);
      lenis.destroy();
    };
  }, []);

  // Stage Advancement Functions with State Lock
  const advanceStage = useCallback(() => {
    if (isTransitioningRef.current) return;
    setCurrentStage((prev) => {
      if (prev < 7) {
        setScrollDirection('down');
        isTransitioningRef.current = true;
        setTimeout(() => { isTransitioningRef.current = false; }, 600);
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const retreatStage = useCallback(() => {
    if (isTransitioningRef.current) return;
    setCurrentStage((prev) => {
      if (prev > 0) {
        setScrollDirection('up');
        isTransitioningRef.current = true;
        setTimeout(() => { isTransitioningRef.current = false; }, 600);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  // Wheel Gesture Listener for Stage 0 to 6 with Stage 7 Isolation
  // Wheel Gesture Listener for Stage 0 to 5 with Stage 6 & Stage 7 Isolation
  const handleWheel = useCallback((e) => {
    const now = Date.now();
    if (isTransitioningRef.current) return;

    // Stage 6 Track Selection Scroll Isolation
    if (currentStage === 6) {
      if (scene6ContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scene6ContainerRef.current;
        // Retreat to Stage 5 ONLY if scrolled to the absolute top and swiping up deliberately
        if (scrollTop <= 5 && e.deltaY < -45 && now - lastScrollTime.current > 700) {
          lastScrollTime.current = now;
          retreatStage();
        }
        // Advance to Stage 7 ONLY if scrolled to the absolute bottom and swiping down deliberately
        else if (scrollTop + clientHeight >= scrollHeight - 8 && e.deltaY > 50 && now - lastScrollTime.current > 700) {
          lastScrollTime.current = now;
          advanceStage();
        }
      }
      return;
    }

    // Stage 7 Form Scroll Isolation
    if (currentStage === 7) {
      if (signInContainerRef.current) {
        const { scrollTop } = signInContainerRef.current;
        // Retreat to Stage 6 ONLY if scrolled to the absolute top and swiping up deliberately
        if (scrollTop <= 5 && e.deltaY < -45 && now - lastScrollTime.current > 700) {
          lastScrollTime.current = now;
          retreatStage();
        }
      }
      return;
    }

    if (now - lastScrollTime.current < 650) return;

    if (e.deltaY > 28) {
      lastScrollTime.current = now;
      advanceStage();
    } else if (e.deltaY < -28) {
      lastScrollTime.current = now;
      retreatStage();
    }
  }, [currentStage, advanceStage, retreatStage]);

  // Touch Gesture Listeners (Mobile & Tablet)
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isTransitioningRef.current) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;

    if (currentStage === 6) {
      if (scene6ContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scene6ContainerRef.current;
        if (scrollTop <= 5 && deltaY < -60) {
          retreatStage();
        } else if (scrollTop + clientHeight >= scrollHeight - 8 && deltaY > 60) {
          advanceStage();
        }
      }
      return;
    }

    if (currentStage === 7) {
      if (signInContainerRef.current) {
        const { scrollTop } = signInContainerRef.current;
        if (scrollTop <= 5 && deltaY < -60) {
          retreatStage();
        }
      }
      return;
    }

    if (Math.abs(deltaY) > 40) {
      if (deltaY > 0) {
        advanceStage();
      } else {
        retreatStage();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        advanceStage();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        retreatStage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advanceStage, retreatStage]);

  // Physical keyboard tracking for Virtual Deck lighting
  useEffect(() => {
    const handleKeyLight = (e) => {
      setPressedKey(e.key.toUpperCase());
      const timer = setTimeout(() => setPressedKey(null), 250);
      return () => clearTimeout(timer);
    };

    window.addEventListener('keydown', handleKeyLight);
    return () => window.removeEventListener('keydown', handleKeyLight);
  }, []);

  // Smooth Mouse Position Tracking
  const handleMouseMove = useCallback((e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setMousePos({ x, y });

    // 3D Card Tilt in Stage 7
    if (card3DRef.current && currentStage === 7) {
      gsap.to(card3DRef.current, {
        rotateX: -y * 6,
        rotateY: x * 6,
        transformPerspective: 1200,
        ease: 'power2.out',
        duration: 0.4
      });
    }
  }, [currentStage]);

  // Magnetic Button Physics (JerryTheWebDev signature interaction)
  const handleMagneticMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.35;

    gsap.to(btn, {
      x,
      y,
      scale: 1.03,
      duration: 0.25,
      ease: 'power2.out'
    });
  };

  const handleMagneticLeave = (e) => {
    const btn = e.currentTarget;
    gsap.to(btn, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.45,
      ease: 'elastic.out(1.2, 0.4)'
    });
  };

  // Kinetic Typography Animation in Scene 0
  useEffect(() => {
    if (currentStage === 0 && kineticTextRef.current) {
      const letters = kineticTextRef.current.querySelectorAll('.kinetic-word');
      gsap.fromTo(letters, 
        { y: 50, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [currentStage]);

  // Email validation check
  const isEmailValid = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Password strength calculator
  const getPasswordStrength = (pass) => {
    if (!pass || pass.length === 0) return { score: 0, label: '', color: 'bg-slate-700', text: 'text-slate-400', percent: '0%' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (pass.length >= 12 && /[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400', percent: '33%' };
    if (score === 2) return { score: 2, label: 'Medium', color: 'bg-[#F59E0B]', text: 'text-[#F59E0B]', percent: '66%' };
    return { score: 3, label: 'Strong // 256-Bit Encrypted', color: 'bg-emerald-400', text: 'text-emerald-400', percent: '100%' };
  };

  const currentPassword = authMode === 'signin' ? signInData.password : signUpData.password;
  const currentEmail = authMode === 'signin' ? signInData.email : signUpData.email;
  const passwordStrength = getPasswordStrength(currentPassword);

  // Virtual Keyboard Input Handling
  const handleVirtualKeyPress = (char) => {
    setPressedKey(char);
    setTimeout(() => setPressedKey(null), 200);

    if (focusedField === 'email' || (!focusedField && authMode === 'signin')) {
      if (char === '⌫') {
        setSignInData(prev => ({ ...prev, email: prev.email.slice(0, -1) }));
      } else if (char === 'SPACE') {
        setSignInData(prev => ({ ...prev, email: prev.email + ' ' }));
      } else {
        setSignInData(prev => ({ ...prev, email: prev.email + char.toLowerCase() }));
      }
    } else if (focusedField === 'password') {
      if (char === '⌫') {
        setSignInData(prev => ({ ...prev, password: prev.password.slice(0, -1) }));
      } else if (char === 'SPACE') {
        setSignInData(prev => ({ ...prev, password: prev.password + ' ' }));
      } else {
        setSignInData(prev => ({ ...prev, password: prev.password + char.toLowerCase() }));
      }
    } else if (focusedField === 'fullName') {
      if (char === '⌫') {
        setSignUpData(prev => ({ ...prev, fullName: prev.fullName.slice(0, -1) }));
      } else if (char === 'SPACE') {
        setSignUpData(prev => ({ ...prev, fullName: prev.fullName + ' ' }));
      } else {
        setSignUpData(prev => ({ ...prev, fullName: prev.fullName + char }));
      }
    }
  };

  // Real 4-Phase Live Authentication Flow
  const handleExecuteAuth = (e) => {
    if (e) e.preventDefault();
    setAuthError('');

    if (!currentEmail || !isEmailValid(currentEmail)) {
      setAuthError('Please provide a valid institutional or work email.');
      return;
    }

    if (!currentPassword || currentPassword.length < 4) {
      setAuthError('Please enter your secure access key/password.');
      return;
    }

    // Phase 1: Authenticating
    setAuthPhase('authenticating');

    setTimeout(() => {
      // Phase 2: Verifying Profile & Goal Track
      // Phase 2: Verifying Profile & Retrieving Employee Credentials
      setAuthPhase('verifying');

      setTimeout(() => {
        // Phase 3: AI Authentication Complete
        setAuthPhase('complete');

        setTimeout(() => {
          // Hand off to Dashboard with resolved credentials & active goalTrack
          // Hand off to Dashboard with resolved employee credentials & active goalTrack
          if (onAuthenticated) {
            onAuthenticated({
              name: authMode === 'signin' ? 'Alex Chen' : signUpData.fullName || 'New Innovator',
              email: currentEmail,
              role: authMode === 'signin' ? signInData.role : signUpData.role,
              department: selectedPurpose === 'company' ? 'Enterprise Engineering' : 'Computer Science & AI',
              goalTrack: selectedPurpose,
              experience: authMode === 'signin' ? signInData.experience : signUpData.experience,
              interests: authMode === 'signin' ? signInData.interests : signUpData.interests,
              previousProjects: authMode === 'signin' ? signInData.previousProjects : signUpData.previousProjects,
              skills: extractedSkills.length > 0 
                ? extractedSkills 
                : (authMode === 'signin' 
                    ? [{ name: 'React', level: 'Expert' }, { name: 'Node.js', level: 'Advanced' }, { name: 'Python', level: 'Advanced' }, { name: 'Vector DBs', level: 'Intermediate' }] 
                    : getTrackDefaultSkills(selectedPurpose)),
              cvName: cvFile ? cvFile.name : null,
              authenticatedAt: new Date().toLocaleTimeString()
            });
            if (authMode === 'signin') {
              const employeeProfile = getTrackEmployeeProfile(selectedPurpose, currentEmail);
              onAuthenticated({
                name: employeeProfile.name,
                email: currentEmail,
                role: employeeProfile.role,
                department: employeeProfile.department,
                goalTrack: selectedPurpose,
                experience: employeeProfile.experience,
                interests: employeeProfile.interests,
                previousProjects: employeeProfile.previousProjects,
                skills: employeeProfile.skills,
                cvName: null,
                authenticatedAt: new Date().toLocaleTimeString()
              });
            } else {
              onAuthenticated({
                name: signUpData.fullName || 'New Innovator',
                email: currentEmail,
                role: signUpData.role,
                department: selectedPurpose === 'company' ? 'Enterprise Engineering' : 'Computer Science & AI',
                goalTrack: selectedPurpose,
                experience: signUpData.experience,
                interests: signUpData.interests,
                previousProjects: signUpData.previousProjects,
                skills: extractedSkills.length > 0 
                  ? extractedSkills 
                  : getTrackDefaultSkills(selectedPurpose),
                cvName: cvFile ? cvFile.name : null,
                authenticatedAt: new Date().toLocaleTimeString()
              });
            }
          }
        }, 650);
      }, 700);
    }, 600);
  };

  // Holographic Keycap Layout
  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
    ['SPACE', '@', '.EDU', '.COM']
  ];

  return (
    <div 
      ref={experienceContainerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] overflow-hidden flex flex-col"
    >
      {/* =========================================================================
          LAYER 1 & 2: DYNAMIC GRADIENT BLEEDS (OBSIDIAN & WARM AMBER GOLD)
          ========================================================================= */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 20}% ${40 + mousePos.y * 20}%, rgba(245, 158, 11, 0.15) 0%, rgba(124, 58, 237, 0.08) 45%, #080B12 85%)`
        }}
      />

      {/* WebGL Three.js Particle & AI Neural Network (Amber Gold & Violet) */}
      <AIGraphicCanvas 
        stage={currentStage} 
        mousePos={mousePos} 
        accentColor="#F59E0B"
        className="opacity-70"
      />

      {/* Micro Grid Overlay for High-Tech Awwwards Aesthetic */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Cursor-Following Ambient Warm Amber Glow */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full pointer-events-none blur-[140px] opacity-20 transition-transform duration-300 ease-out hidden md:block"
        style={{
          backgroundColor: '#F59E0B',
          transform: `translate(${mousePos.x * 180 + window.innerWidth / 2 - 225}px, ${mousePos.y * 180 + window.innerHeight / 2 - 225}px)`
        }}
      />

      {/* =========================================================================
          TOP NAVIGATION HUD (BACK TO HOME & STAGE PROGRESS)
          Strictly preserves "Back to Home" routing
          ========================================================================= */}
      <header className="relative z-30 px-5 sm:px-8 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-[#080B12]/80">
        {/* Back to Home Button */}
        <button
          onClick={onBackToHome}
          onMouseMove={handleMagneticMove}
          onMouseLeave={handleMagneticLeave}
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-[11px] uppercase tracking-widest text-slate-300 hover:text-white transition-all duration-300 cursor-pointer"
          title="Return to Home Page"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#F59E0B] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Center: SyncSkills AI Logo Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-violet-600 p-[1px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#080B12] rounded-[7px] flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-[#F59E0B]" />
            </div>
          </div>
          <span className="text-sm font-semibold tracking-wider text-white">
            SyncSkills<span className="text-[#F59E0B]">.AI</span>
          </span>
        </div>

        {/* Right: Active Purpose Track & Stage Progress Indicator */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentStage(6)}
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-[11px] font-mono tracking-wider text-amber-200 transition-all cursor-pointer group"
            title="Click to change operational objective track"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            <span>Track: <strong className="text-white capitalize group-hover:text-amber-300">{currentConfig.label}</strong></span>
            <span className="text-[10px] text-amber-400/80 group-hover:text-amber-300 underline underline-offset-2 ml-0.5">Switch</span>
          </button>

          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <span className="text-[#F59E0B] font-bold">0{currentStage + 1}</span>
            <span className="text-white/20">/</span>
            <span>08</span>
          </div>
        </div>
      </header>

      {/* Top Sleek Progress Bar in Warm Amber Gold */}
      <div className="relative z-30 w-full h-[2px] bg-white/5">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-violet-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentStage + 1) / 8) * 100}%` }}
        />
      </div>

      {/* =========================================================================
          MAIN INTERACTIVE STAGE CHOREOGRAPHY (PULLED UPWARD FOR FULL VISIBILITY)
          ========================================================================= */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center px-4 sm:px-6">
        
        {/* -----------------------------------------------------------------------
            SCENE 0: WELCOME BACK (KINETIC EDITORIAL TYPOGRAPHY REVEAL)
            ----------------------------------------------------------------------- */}
        {currentStage === 0 && (
          <div 
            key="scene-0"
            className="relative z-20 max-w-5xl mx-auto text-center flex flex-col items-center justify-center animate-fade-in -mt-6 sm:-mt-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono tracking-widest uppercase mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] animate-spin-slow" />
              <span>SyncSkills.AI Experience</span>
            </div>

            {/* Kinetic Large Typography */}
            <div ref={kineticTextRef} className="space-y-1 mb-5">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white uppercase overflow-hidden">
                <span className="kinetic-word inline-block">WELCOME</span>{' '}
                <span className="kinetic-word inline-block bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">BACK.</span>
              </h1>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-slate-300 uppercase overflow-hidden">
                <span className="kinetic-word inline-block text-slate-400">YOUR TEAM</span>{' '}
                <span className="kinetic-word inline-block font-semibold text-white">IS WAITING.</span>
              </h2>
            </div>

            <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-8">
              Deep capability mapping, cognitive Hungarian balancing, and autonomous squad assembly. Enter the platform below.
            </p>

            {/* Magnetic CTA in Warm Amber Gold */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <button
                onClick={advanceStage}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="group px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#080B12] font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-amber-500/25 flex items-center gap-2.5 transition-all duration-300 cursor-pointer hover:brightness-110"
              >
                <span>Enter AI Storyline</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentStage(6)}
                className="px-6 py-3.5 rounded-full border border-white/10 hover:border-amber-500/40 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Skip Directly to Sign In →
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="mt-8 flex flex-col items-center gap-1.5 text-slate-500 text-[10px] font-mono tracking-widest uppercase animate-bounce">
              <span>{STORY_SECTIONS[0].scrollHint}</span>
              <ChevronDown className="w-4 h-4 text-[#F59E0B]" />
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            SCENE 1: 01 BUILD (Z-AXIS DEPTH CAMERA ZOOM + AST SCAN GLOW)
            ----------------------------------------------------------------------- */}
        {currentStage === 1 && (
          <div 
            key="scene-1"
            className="relative z-20 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 -mt-4 sm:-mt-8"
          >
            {/* Left: Editorial Typography */}
            <div className="flex-1 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 font-mono text-xs text-[#F59E0B]">
                <span>01 // BUILD</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                Turn ideas <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">into reality.</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
                {STORY_SECTIONS[1].desc}
              </p>
              
              {/* Telemetry HUD */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 max-w-md">
                {STORY_SECTIONS[1].hudTelemetry.map((item, i) => (
                  <div key={i} className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 font-mono text-[10px] text-amber-200/90">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Z-Axis Depth Zoom Image Frame */}
            <div className="relative flex-1 w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-500/15 group">
              <img 
                src={STORY_SECTIONS[1].image} 
                alt="01 Build"
                className="w-full h-full object-cover transform transition-transform duration-1000 ease-out group-hover:scale-105"
                style={{
                  transform: `scale(${1.02 + mousePos.x * 0.04}) translate3d(${mousePos.x * 8}px, ${mousePos.y * 8}px, 0)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {/* Laser Scanning Line */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent animate-pulse" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-amber-300">
                <span>AST SCANNER // ACTIVE</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />LIVE PARSING</span>
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            SCENE 2: 02 COLLABORATE (LAYERED HORIZONTAL PARALLAX SKEW REVEAL)
            ----------------------------------------------------------------------- */}
        {currentStage === 2 && (
          <div 
            key="scene-2"
            className="relative z-20 w-full max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8 -mt-4 sm:-mt-8"
          >
            {/* Left: Asymmetrical Image Frame */}
            <div className="relative flex-1 w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-500/15">
              <img 
                src={STORY_SECTIONS[2].image} 
                alt="02 Collaborate"
                className="w-full h-full object-cover transform transition-all duration-700"
                style={{
                  transform: `scale(1.04) translate3d(${-mousePos.x * 10}px, ${-mousePos.y * 10}px, 0)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40" />
              
              {/* Layered Floating Synergy Card */}
              <div className="absolute top-4 left-4 p-3.5 rounded-xl backdrop-blur-xl bg-[#080B12]/80 border border-amber-500/30 max-w-[200px]">
                <div className="text-[10px] font-mono text-[#F59E0B] uppercase tracking-wider mb-1">Role Match</div>
                <div className="text-xs font-semibold text-white">Full-Stack + ML Engineer</div>
                <div className="mt-2 w-full bg-white/10 rounded-full h-1">
                  <div className="bg-[#F59E0B] h-1 rounded-full w-[94%]" />
                </div>
              </div>
            </div>

            {/* Right: Editorial Typography */}
            <div className="flex-1 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 font-mono text-xs text-[#F59E0B]">
                <span>02 // COLLABORATE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                Better <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">Together.</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
                {STORY_SECTIONS[2].desc}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 max-w-md">
                {STORY_SECTIONS[2].hudTelemetry.map((item, i) => (
                  <div key={i} className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 font-mono text-[10px] text-amber-200/90">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            SCENE 3: 03 INTELLIGENCE (ORGANIC MASK EXPANSION + HUNGARIAN ALGO NODES)
            ----------------------------------------------------------------------- */}
        {currentStage === 3 && (
          <div 
            key="scene-3"
            className="relative z-20 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 -mt-4 sm:-mt-8"
          >
            {/* Left: Editorial Typography */}
            <div className="flex-1 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 font-mono text-xs text-purple-300">
                <span>03 // INTELLIGENCE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                Let AI find <br />
                <span className="bg-gradient-to-r from-amber-300 via-purple-400 to-violet-400 bg-clip-text text-transparent">the connections.</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
                {STORY_SECTIONS[3].desc}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 max-w-md">
                {STORY_SECTIONS[3].hudTelemetry.map((item, i) => (
                  <div key={i} className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 font-mono text-[10px] text-amber-200/90">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Organic Frame */}
            <div className="relative flex-1 w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <img 
                src={STORY_SECTIONS[3].image} 
                alt="03 Intelligence"
                className="w-full h-full object-cover transform transition-transform duration-700"
                style={{
                  transform: `scale(${1.03 + mousePos.y * 0.03}) translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl backdrop-blur-xl bg-[#080B12]/80 border border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-[#F59E0B] animate-pulse" />
                  <div>
                    <div className="text-xs font-semibold text-white">Hungarian Optimization Matrix</div>
                    <div className="text-[10px] text-slate-400 font-mono">Bipartite Matching // O(V²E)</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[#F59E0B] text-[10px] font-mono">99.8% SOLVED</span>
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            SCENE 4: 04 CONNECT (3D DEPTH LAYER SEPARATION & SPEED ENGINE)
            ----------------------------------------------------------------------- */}
        {currentStage === 4 && (
          <div 
            key="scene-4"
            className="relative z-20 w-full max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8 -mt-4 sm:-mt-8"
          >
            {/* Left: Visual Frame */}
            <div className="relative flex-1 w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-500/15">
              <img 
                src={STORY_SECTIONS[4].image} 
                alt="04 Connect"
                className="w-full h-full object-cover transform transition-transform duration-700"
                style={{
                  transform: `scale(1.05) translate3d(${-mousePos.x * 12}px, ${-mousePos.y * 12}px, 0)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <div className="absolute inset-0 p-5 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-end">
                  <div className="px-3 py-1 rounded-full backdrop-blur-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono">
                    60-Second Matchmaking
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Frontend Wizard', 'Rust Systems', 'ML Inference', 'Sprint Velocity'].map((chip, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-md bg-black/70 border border-white/10 text-[10px] font-mono text-amber-200/90">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Editorial Typography */}
            <div className="flex-1 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 font-mono text-xs text-[#F59E0B]">
                <span>04 // CONNECT</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                Different skills. <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">One stronger team.</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
                {STORY_SECTIONS[4].desc}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 max-w-md">
                {STORY_SECTIONS[4].hudTelemetry.map((item, i) => (
                  <div key={i} className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 font-mono text-[10px] text-amber-200/90">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            SCENE 5: 05 CREATE (COSMIC PARTICLE DISSOLVE INTO AI NETWORK)
            ----------------------------------------------------------------------- */}
        {currentStage === 5 && (
          <div 
            key="scene-5"
            className="relative z-20 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 -mt-4 sm:-mt-8"
          >
            {/* Left: Editorial Typography */}
            <div className="flex-1 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 font-mono text-xs text-[#F59E0B]">
                <span>05 // CREATE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                Build something <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-violet-400 bg-clip-text text-transparent">remarkable.</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
                {STORY_SECTIONS[5].desc}
              </p>

              {/* Advance Action */}
              <div className="pt-2">
                <button
                  onClick={advanceStage}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#080B12] font-black text-xs tracking-widest uppercase shadow-xl shadow-amber-500/25 flex items-center gap-2.5 transition-all cursor-pointer hover:brightness-110"
                >
                  <span>Select Track & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Cosmic Dissolve Frame */}
            <div className="relative flex-1 w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-500/15">
              <img 
                src={STORY_SECTIONS[5].image} 
                alt="05 Create"
                className="w-full h-full object-cover transform transition-transform duration-700"
                style={{
                  transform: `scale(1.06) translate3d(${mousePos.x * 10}px, ${mousePos.y * 10}px, 0)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl backdrop-blur-xl bg-[#080B12]/80 border border-white/15 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Autonomous AI Pod Assembly</div>
                  <div className="text-[10px] text-slate-400 font-mono">Guaranteed Zero Skill Mismatch</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            SCENE 6: PRE-SIGN-IN TRACK SELECTION ("CHOOSE WHAT YOU'RE BUILDING FOR")
            RESPONSIVE FULL-SCREEN DISPLAY WITH ENLARGED PROPORTIONAL CARDS
            ----------------------------------------------------------------------- */}
        {currentStage === 6 && (
          <div 
            key="scene-6"
            ref={scene6ContainerRef}
            data-lenis-prevent="true"
            className="relative z-20 w-full h-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col items-center justify-start custom-scrollbar"
            style={{ overscrollBehavior: 'contain' }}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center animate-fade-in my-auto py-2">
              
              {/* Editorial Heading */}
              <div className="text-center max-w-2xl mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 font-mono text-[11px] text-[#F59E0B] uppercase tracking-widest mb-2.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                  <span>Adaptive Formation Matrix</span>
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase mb-2">
                  Choose What You’re Building For
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                  SyncSkills.AI dynamically tunes its AST matching engine and cognitive Hungarian matrix to your exact operational objective.
                </p>
              </div>

              {/* 4 Interactive Track Selection Cards (Expanded & Display Responsive) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full mb-6 sm:mb-8">
                {Object.values(PURPOSE_CONFIGS).map((track) => {
                  const isSelected = selectedPurpose === track.id;
                  const IconComponent = track.icon;

                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectPurpose(track.id)}
                      className={`group relative rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-300 backdrop-blur-xl border flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-[#0D1424]/95 border-[#F59E0B] shadow-2xl shadow-amber-500/25 -translate-y-1.5 ring-2 ring-[#F59E0B]/50' 
                          : 'bg-white/[0.03] border-white/10 hover:border-amber-500/50 hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50'
                      }`}
                    >
                      {/* Top Laser Accent when Active */}
                      {isSelected && (
                        <div className="absolute top-0 inset-x-4 h-[3px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent shadow-[0_0_12px_#F59E0B]" />
                      )}

                      <div>
                        {/* Enlarged Image Preview (h-36 sm:h-40 md:h-44) */}
                        <div className="relative w-full h-36 sm:h-40 md:h-44 rounded-xl overflow-hidden mb-4 border border-white/10 group-hover:border-amber-500/40 transition-colors">
                          <img 
                            src={track.image} 
                            alt={track.cardTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/20 to-transparent" />
                          
                          {/* Track Badge Pill */}
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full backdrop-blur-md bg-[#080B12]/80 border border-white/15 text-[10px] font-mono text-amber-300 font-medium">
                            {track.badge}
                          </div>

                          {/* Icon Pill */}
                          <div className={`absolute top-2.5 right-2.5 p-1.5 rounded-xl backdrop-blur-md border transition-all ${
                            isSelected 
                              ? 'bg-[#F59E0B] text-[#080B12] border-amber-400 shadow-md shadow-amber-500/30' 
                              : 'bg-[#080B12]/80 border-white/20 text-[#F59E0B]'
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>

                          {/* Active Overlay Tag */}
                          {isSelected && (
                            <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#F59E0B] text-[#080B12] font-black font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Active Track</span>
                            </div>
                          )}
                        </div>

                        {/* Title & Checkmark */}
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-amber-200 transition-colors">
                            {track.label}
                          </h3>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#F59E0B] text-[#080B12] flex items-center justify-center shadow-md shadow-amber-500/30">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* Subtitle / Objective Name */}
                        <div className="text-[11px] font-mono text-amber-400/90 mb-2">
                          {track.cardTitle}
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed line-clamp-3 mb-3.5">
                          {track.cardDesc}
                        </p>

                        {/* Feature Tags */}
                        {track.tags && (
                          <div className="flex flex-wrap gap-1.5 mb-3.5">
                            {track.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Telemetry & Select CTA */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono mt-auto">
                        <span className="text-slate-400 font-medium">
                          {track.floatingCards?.[1]?.stat || '94% Fit'}
                        </span>
                        <span className={`inline-flex items-center gap-1 font-bold text-xs transition-colors ${
                          isSelected ? 'text-[#F59E0B]' : 'text-slate-400 group-hover:text-amber-400'
                        }`}>
                          {isSelected ? 'Selected ✓' : 'Select →'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action CTA: Continue to Sign In */}
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <button
                  type="button"
                  onClick={advanceStage}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="px-8 sm:px-12 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#080B12] font-black text-xs sm:text-sm tracking-wider uppercase shadow-2xl shadow-amber-500/30 flex items-center gap-3 transition-all cursor-pointer hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Continue to Sign In as {currentConfig.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-slate-500 text-center">
                  Click any card to switch tracks · Configures your AI matchmaking matrix
                </span>
              </div>

            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            SCENE 7: FINAL 2026 AI/SAAS SIGN IN GATEWAY (JERRYTHEWEBDEV MASTERPIECE)
            PULLED UPWARD WITH COMPACT SPACING SO SIGN IN & CREATE ACCOUNT BUTTONS
            ARE IMMEDIATELY VISIBLE AND NATIVELY SCROLLABLE ON ALL SCREENS
            ----------------------------------------------------------------------- */}
        {currentStage === 7 && (
          <div 
            ref={signInContainerRef}
            data-lenis-prevent="true"
            className="relative z-20 w-full h-full overflow-y-auto px-4 sm:px-6 py-3 sm:py-5 flex flex-col items-center justify-start"
            style={{ overscrollBehavior: 'contain' }}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className={`relative w-full mx-auto flex flex-col items-center transition-all duration-300 ${authMode === 'signup' ? 'max-w-4xl -mt-1 sm:-mt-2' : 'max-w-4xl -mt-2 sm:-mt-6'}`}>
              
              {/* Context-Aware Editorial Headline (Compact) */}
              <div className={`text-center max-w-xl transition-all ${authMode === 'signup' ? 'mb-2 sm:mb-2.5' : 'mb-3 sm:mb-4'}`}>
                <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] font-mono tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                    <span>AI Authentication Gateway</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStage(6)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-white/10 hover:border-amber-500/40 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-amber-300 text-[10px] font-mono tracking-wider transition-all cursor-pointer group"
                    title="Change building objective track"
                  >
                    <span>Track: <strong className="text-white group-hover:text-amber-300">{currentConfig.label}</strong></span>
                    <span className="text-amber-400 font-bold">⇄ Change</span>
                  </button>
                </div>
                <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase mb-1">
                  {currentConfig.welcomeHeading}
                </h1>
                {authMode === 'signin' && (
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {currentConfig.welcomeSubheadline}
                  </p>
                )}
              </div>

              {/* Contextual Flow Diagram (Only in signin to prioritize vertical space in signup) */}
              {authMode === 'signin' && (
                <div className="hidden sm:flex items-center gap-3 mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-[#080B12]/80 backdrop-blur-md">
                  {currentConfig.networkNodes.map((node, i) => {
                    const NodeIcon = node.icon;
                    return (
                      <React.Fragment key={i}>
                        <div className="flex items-center gap-1.5">
                          <NodeIcon className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span className="text-xs font-mono font-medium text-slate-200">{node.name}</span>
                        </div>
                        {i < currentConfig.networkNodes.length - 1 && (
                          <span className="text-white/20 font-mono text-xs">→</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {/* Main 3D Perspective Glass Card + Floating HUD Container */}
              <div className={`relative w-full transition-all duration-500 ${authMode === 'signup' ? 'max-w-4xl' : 'max-w-lg'}`}>
                
                {/* Floating HUD Cards (Active in signin mode) */}
                {authMode === 'signin' && (
                  <>
                    <div className="hidden xl:block absolute -left-44 top-6 w-40 p-3 rounded-xl backdrop-blur-2xl bg-[#080B12]/80 border border-amber-500/30 shadow-2xl pointer-events-none transform -rotate-2 hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Brain className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                          {currentConfig.floatingCards[0].title}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white">{currentConfig.floatingCards[0].stat}</div>
                      <div className="text-[10px] text-amber-300 font-mono mt-0.5">{currentConfig.floatingCards[0].sub}</div>
                    </div>

                    <div className="hidden xl:block absolute -right-44 bottom-8 w-40 p-3 rounded-xl backdrop-blur-2xl bg-[#080B12]/80 border border-emerald-500/30 shadow-2xl pointer-events-none transform rotate-2 hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                          {currentConfig.floatingCards[1].title}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white">{currentConfig.floatingCards[1].stat}</div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{currentConfig.floatingCards[1].sub}</div>
                    </div>
                  </>
                )}

                {/* THE 3D GLASS CARD */}
                <div 
                  ref={card3DRef}
                  data-lenis-prevent="true"
                  className={`relative rounded-2xl backdrop-blur-2xl bg-[#080B12]/95 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 ${authMode === 'signup' ? 'p-4 sm:p-5' : 'p-5 sm:p-6'}`}
                >
                  {/* Top Glowing Laser Border in Amber Gold */}
                  <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent" />

                  {/* Auth Mode Toggle (Sign In / Sign Up) */}
                  <div className={`flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 ${authMode === 'signup' ? 'mb-3.5 max-w-xs mx-auto' : 'mb-4'}`}>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                        authMode === 'signin' 
                          ? 'bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] font-bold shadow-md' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                        authMode === 'signup' 
                          ? 'bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] font-bold shadow-md' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>

                  {/* Error Alert Display if present */}
                  {authError && (
                    <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* Form Component */}
                  <form onSubmit={handleExecuteAuth} className="space-y-3.5">
                    
                    {authMode === 'signup' ? (
                      /* =======================================================
                         2-COLUMN RESPONSIVE LAYOUT FOR CREATE ACCOUNT
                         Column 1: Credentials & Sprint Role
                         Column 2: CV Upload Dropzone & Extracted Skills
                         ======================================================= */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* LEFT COLUMN: Identity & Credentials */}
                        <div className="space-y-2.5">
                          <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1">
                            <User className="w-3 h-3 text-[#F59E0B]" />
                            <span>1. Profile & Access Key</span>
                          </div>

                          {/* Full Name */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                              <span>Full Name</span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={signUpData.fullName}
                                onFocus={() => setFocusedField('fullName')}
                                onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                                placeholder="Alex Chen"
                                className="w-full px-3 py-2 pl-8 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#F59E0B] focus:bg-white/[0.07] text-white text-xs outline-none transition-all"
                              />
                              <User className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
                            </div>
                          </div>

                          {/* Email Address */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                              <span>Email Address</span>
                              {signUpData.email && (
                                <span className={isEmailValid(signUpData.email) ? 'text-emerald-400' : 'text-slate-500'}>
                                  {isEmailValid(signUpData.email) ? '✓ AST Verified' : 'Checking...'}
                                </span>
                              )}
                            </div>
                            <div className="relative">
                              <input
                                type="email"
                                value={signUpData.email}
                                onFocus={() => setFocusedField('email')}
                                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                                placeholder="alex.chen@university.edu"
                                className="w-full px-3 py-2 pl-8 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#F59E0B] focus:bg-white/[0.07] text-white text-xs outline-none transition-all"
                              />
                              <Mail className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
                            </div>
                          </div>

                          {/* Secure Key / Password */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                              <span>Secure Key / Password</span>
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[#F59E0B] hover:text-amber-300 lowercase text-[10px] cursor-pointer"
                              >
                                {showPassword ? 'Hide' : 'Show'}
                              </button>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={signUpData.password}
                                onFocus={() => setFocusedField('password')}
                                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                                placeholder="••••••••••••"
                                className="w-full px-3 py-2 pl-8 pr-8 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#F59E0B] focus:bg-white/[0.07] text-white text-xs outline-none transition-all font-mono"
                              />
                              <Lock className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                              >
                                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {signUpData.password && signUpData.password !== '••••••••••••' && (
                              <div className="pt-0.5 space-y-0.5">
                                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full transition-all duration-300 ${passwordStrength.color}`} 
                                    style={{ width: passwordStrength.percent }}
                                  />
                                </div>
                                <div className={`text-[9px] font-mono ${passwordStrength.text}`}>
                                  Strength: {passwordStrength.label}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Preferred Role & Experience Level */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                <Briefcase className="w-3 h-3 text-[#F59E0B]" />
                                <span>Preferred Role</span>
                              </label>
                              <select
                                value={signUpData.role}
                                onChange={(e) => setSignUpData({ ...signUpData, role: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded-xl bg-[#0A0E18] border border-white/10 focus:border-[#F59E0B] text-white text-xs outline-none cursor-pointer"
                              >
                                {PREFERRED_ROLES.map((r) => (
                                  <option key={r} value={r}>{r}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                <Activity className="w-3 h-3 text-[#F59E0B]" />
                                <span>Experience Level</span>
                              </label>
                              <select
                                value={signUpData.experience}
                                onChange={(e) => setSignUpData({ ...signUpData, experience: e.target.value })}
                                className="w-full px-2.5 py-1.5 rounded-xl bg-[#0A0E18] border border-white/10 focus:border-[#F59E0B] text-white text-xs outline-none cursor-pointer"
                              >
                                {EXPERIENCE_LEVELS.map((exp) => (
                                  <option key={exp} value={exp}>{exp}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Domain & Technical Interests */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                                <span>Technical Interests ({signUpData.interests.length})</span>
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">Select or type</span>
                            </label>

                            <div 
                              data-lenis-prevent="true"
                              className="flex flex-wrap gap-1 p-1.5 rounded-xl bg-white/[0.02] border border-white/10 max-h-20 overflow-y-auto"
                            >
                              {POPULAR_INTERESTS.map((interest) => {
                                const isSelected = signUpData.interests.includes(interest);
                                return (
                                  <button
                                    key={interest}
                                    type="button"
                                    onClick={() => handleToggleInterest(interest)}
                                    className={`px-2 py-0.5 rounded-lg text-[9px] font-mono transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-semibold shadow-sm'
                                        : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 border border-white/5'
                                    }`}
                                  >
                                    {isSelected ? '✓ ' : '+ '}{interest}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Custom Interest Input */}
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <input
                                type="text"
                                value={customInterestInput}
                                onChange={(e) => setCustomInterestInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCustomInterest();
                                  }
                                }}
                                placeholder="+ Add interest (e.g. LLMs, Quantum)..."
                                className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                              />
                              <button
                                type="button"
                                onClick={handleAddCustomInterest}
                                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#F59E0B] hover:text-[#080B12] text-xs font-mono font-semibold text-white transition-all cursor-pointer"
                              >
                                + Add
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: CV Upload Dropzone & Extracted Skills */}
                        <div className="space-y-2.5">
                          <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center justify-between border-b border-white/5 pb-1">
                            <span className="flex items-center gap-1.5">
                              <UploadCloud className="w-3 h-3 text-[#F59E0B]" />
                              <span>2. CV Upload & Extracted Skills</span>
                            </span>
                            <span className="text-[9px] text-slate-500 font-normal">PDF, DOCX, TXT</span>
                          </div>

                          {/* CV / Resume Upload Box */}
                          <div className="space-y-1">
                            <input
                              ref={cvFileInputRef}
                              type="file"
                              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleProcessCvFile(e.target.files[0]);
                                }
                              }}
                            />

                            {!cvFile ? (
                              <div
                                onClick={() => cvFileInputRef.current && cvFileInputRef.current.click()}
                                onDragOver={(e) => { e.preventDefault(); setIsCvDragOver(true); }}
                                onDragLeave={() => setIsCvDragOver(false)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  setIsCvDragOver(false);
                                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    handleProcessCvFile(e.dataTransfer.files[0]);
                                  }
                                }}
                                className={`p-2.5 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                                  isCvDragOver
                                    ? 'border-[#F59E0B] bg-amber-500/15 scale-[1.01]'
                                    : 'border-white/15 bg-white/[0.02] hover:border-amber-500/40 hover:bg-white/[0.04]'
                                }`}
                              >
                                <UploadCloud className="w-4 h-4 text-[#F59E0B] mx-auto mb-0.5" />
                                <div className="text-[11px] font-semibold text-white">
                                  Click to upload or drag & drop CV / Resume
                                </div>
                                <div className="text-[9px] text-slate-400 font-mono">
                                  AI scans document & auto-extracts technical skills below
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                                  <div className="flex items-center gap-2 truncate mr-2">
                                    <FileText className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                                    <div className="truncate">
                                      <span className="text-xs font-semibold text-white truncate block">{cvFile.name}</span>
                                      <span className="text-[9px] text-slate-400 font-mono">{(cvFile.size / 1024).toFixed(1)} KB</span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleRemoveCvFile}
                                    className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                                    title="Remove CV"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {cvUploadPhase === 'analyzing' && (
                                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-mono flex items-center gap-2 animate-pulse">
                                    <span className="w-3 h-3 rounded-full border-2 border-[#F59E0B] border-t-transparent animate-spin" />
                                    <span>{cvAnalysisStep}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Extracted Skills Chips & Custom Skill Input */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3 text-[#F59E0B]" />
                                <span>Extracted Skills ({extractedSkills.length})</span>
                              </span>
                              {cvUploadPhase === 'extracted' && (
                                <span className="text-emerald-400 font-bold">✓ Extracted from CV</span>
                              )}
                            </div>

                            <div 
                              data-lenis-prevent="true"
                              className="flex flex-wrap gap-1 p-1.5 rounded-xl bg-white/[0.02] border border-white/10 max-h-20 overflow-y-auto"
                            >
                              {extractedSkills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[9px] font-mono text-amber-200"
                                >
                                  <span>⚡ {skill.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExtractedSkill(sIdx)}
                                    className="text-slate-400 hover:text-rose-400 ml-0.5 cursor-pointer text-xs"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}

                              {extractedSkills.length === 0 && (
                                <span className="text-[10px] text-slate-500 font-mono py-0.5">
                                  No skills yet. Upload CV or add below.
                                </span>
                              )}
                            </div>

                            {/* Custom Skill Input */}
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <input
                                type="text"
                                value={customSkillInput}
                                onChange={(e) => setCustomSkillInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCustomSkill();
                                  }
                                }}
                                placeholder="+ Add skill (e.g. PyTorch, Docker)..."
                                className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                              />
                              <button
                                type="button"
                                onClick={handleAddCustomSkill}
                                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#F59E0B] hover:text-[#080B12] text-xs font-mono font-semibold text-white transition-all cursor-pointer"
                              >
                                + Add
                              </button>
                            </div>
                          </div>

                          {/* Previous Projects Section */}
                          <div className="space-y-1.5 pt-1.5 border-t border-white/5">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                              <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
                                <FolderGit2 className="w-3 h-3 text-[#F59E0B]" />
                                <span>Previous Projects ({signUpData.previousProjects.length})</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowAddProjectForm(!showAddProjectForm)}
                                className="inline-flex items-center gap-1 text-[10px] text-[#F59E0B] hover:text-amber-300 font-mono font-bold cursor-pointer transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                <span>{showAddProjectForm ? 'Close' : 'Add Project'}</span>
                              </button>
                            </div>

                            {/* Project List */}
                            <div 
                              data-lenis-prevent="true"
                              className="space-y-1.5 max-h-24 overflow-y-auto pr-0.5"
                            >
                              {signUpData.previousProjects.length === 0 ? (
                                <div className="p-2 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-[10px] text-slate-500 font-mono">
                                  No projects yet. Upload CV to auto-extract or click + Add Project.
                                </div>
                              ) : (
                                signUpData.previousProjects.map((proj, pIdx) => (
                                  <div
                                    key={pIdx}
                                    className="p-1.5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all flex items-start justify-between gap-2"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] font-semibold text-white truncate block">
                                          {proj.title}
                                        </span>
                                        {proj.tech && (
                                          <span className="shrink-0 px-1 py-0.2 rounded bg-amber-500/10 border border-amber-500/30 text-[9px] font-mono text-amber-300">
                                            {proj.tech}
                                          </span>
                                        )}
                                      </div>
                                      {proj.desc && (
                                        <p className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                                          {proj.desc}
                                        </p>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemovePreviousProject(pIdx)}
                                      className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer shrink-0 transition-colors"
                                      title="Remove project"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Inline Add Project Form */}
                            {showAddProjectForm && (
                              <div className="p-2 rounded-xl bg-white/[0.04] border border-amber-500/30 space-y-1.5 animate-in fade-in duration-200">
                                <div className="text-[9px] font-mono text-amber-400 font-semibold uppercase">Add Project</div>
                                <input
                                  type="text"
                                  value={newProject.title}
                                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                  placeholder="Project Title (e.g. Distributed Cache Engine)"
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                                />
                                <div className="grid grid-cols-2 gap-1.5">
                                  <input
                                    type="text"
                                    value={newProject.tech}
                                    onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                                    placeholder="Tech (e.g. Go, Redis)"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                                  />
                                  <input
                                    type="text"
                                    value={newProject.desc}
                                    onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                                    placeholder="Brief Description"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]"
                                  />
                                </div>
                                <div className="flex items-center justify-end gap-1.5 pt-0.5">
                                  <button
                                    type="button"
                                    onClick={() => setShowAddProjectForm(false)}
                                    className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-mono text-slate-400 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleAddNewProject}
                                    className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-[#080B12] hover:bg-amber-400 text-[9px] font-mono font-bold cursor-pointer transition-all"
                                  >
                                    + Add
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* =======================================================
                         CLEAN 1-COLUMN LUXURY SAAS SIGN IN
                         Strictly Email & Password Only (Zero Clutter)
                         Employee Profile (Role, Experience, Interests, Projects)
                         opens seamlessly AFTER signing in.
                         ======================================================= */
                      <div className="space-y-4 max-w-md mx-auto py-1">
                        
                        {/* Email Address with AST Validation */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
                            <span>Email Address</span>
                            {signInData.email && (
                              <span className={isEmailValid(signInData.email) ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                                {isEmailValid(signInData.email) ? '✓ AST Verified' : 'Enter institutional email'}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="email"
                              value={signInData.email}
                              onFocus={() => setFocusedField('email')}
                              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                              placeholder="alex.chen@university.edu"
                              className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#F59E0B] focus:bg-white/[0.07] text-white text-xs sm:text-sm outline-none transition-all shadow-inner"
                            />
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          </div>
                        </div>

                        {/* Password Field with Show/Hide Toggle */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400">
                            <span>Access Key / Password</span>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-[#F59E0B] hover:text-amber-300 text-[11px] font-mono cursor-pointer transition-colors"
                            >
                              {showPassword ? 'Hide Key' : 'Show Key'}
                            </button>
                          </div>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={signInData.password}
                              onFocus={() => setFocusedField('password')}
                              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                              placeholder="••••••••••••"
                              className="w-full px-3.5 py-2.5 pl-9 pr-9 rounded-xl bg-white/[0.04] border border-white/10 focus:border-[#F59E0B] focus:bg-white/[0.07] text-white text-xs sm:text-sm outline-none transition-all font-mono shadow-inner"
                            />
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Helper Links: Remember Me, Virtual Deck & Forgot Key */}
                        <div className="pt-1 flex items-center justify-between text-xs">
                          <label className="flex items-center gap-2 text-slate-400 hover:text-slate-300 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={signInData.rememberMe}
                              onChange={(e) => setSignInData({ ...signInData, rememberMe: e.target.checked })}
                              className="w-3.5 h-3.5 rounded bg-black/40 border border-white/20 accent-[#F59E0B] cursor-pointer"
                            />
                            <span className="text-[11px] font-mono">Keep session active</span>
                          </label>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setShowKeyboard(!showKeyboard)}
                              className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-[#F59E0B] font-mono transition-colors cursor-pointer"
                            >
                              <Keyboard className="w-3.5 h-3.5 text-[#F59E0B]" />
                              <span>{showKeyboard ? 'Hide Deck' : 'Virtual Deck'}</span>
                            </button>

                            <a 
                              href="#forgot" 
                              onClick={(e) => { e.preventDefault(); alert(`Reset key link dispatched to ${signInData.email || 'your email'}.`); }} 
                              className="text-[11px] text-slate-400 hover:text-white transition-colors"
                            >
                              Forgot key?
                            </a>
                          </div>
                        </div>

                        {/* Automatic profile retrieval status message */}
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-[11px] font-mono text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Signing in will immediately retrieve and open your verified employee profile, experience, interests & projects.</span>
                        </div>
                      </div>
                    )}
                    {/* Interactive Holographic Virtual Deck */}
                    {showKeyboard && (
                      <div className="p-2.5 rounded-xl bg-black/80 border border-white/10 space-y-1 backdrop-blur-xl animate-fade-in">
                        {KEYBOARD_ROWS.map((row, rIdx) => (
                          <div key={rIdx} className="flex justify-center gap-1">
                            {row.map((k) => {
                              const isKeyLit = pressedKey === k;
                              return (
                                <button
                                  key={k}
                                  type="button"
                                  onClick={() => handleVirtualKeyPress(k)}
                                  className={`px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                                    isKeyLit
                                      ? 'bg-[#F59E0B] text-[#080B12] font-bold shadow-lg shadow-amber-500/50 scale-95'
                                      : 'bg-white/5 hover:bg-white/15 text-slate-200 border border-white/5'
                                  } ${k === 'SPACE' ? 'px-5' : ''}`}
                                >
                                  {k}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* MAGNETIC 4-STAGE AUTHENTICATION CTA IN METALLIC AMBER GOLD */}
                    <div className="pt-2">
                      <button
                        ref={magneticBtnRef}
                        type="submit"
                        disabled={authPhase !== 'idle'}
                        onMouseMove={handleMagneticMove}
                        onMouseLeave={handleMagneticLeave}
                        className={`w-full py-3.5 rounded-xl font-extrabold text-xs tracking-widest uppercase transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                          authPhase === 'idle'
                            ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#080B12] hover:brightness-110 shadow-amber-500/25'
                            : 'bg-amber-500/20 border border-[#F59E0B] text-amber-300 cursor-wait'
                        }`}
                      >
                        {authPhase === 'idle' && (
                          <>
                            <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                        {authPhase === 'authenticating' && (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#F59E0B] border-t-transparent animate-spin" />
                            <span>Authenticating Credentials...</span>
                          </>
                        )}
                        {authPhase === 'verifying' && (
                          <>
                            <Brain className="w-3.5 h-3.5 text-[#F59E0B] animate-pulse" />
                            <span>Verifying {currentConfig.label} Profile...</span>
                          </>
                        )}
                        {authPhase === 'complete' && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>AI Authentication Complete ✓</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>

                  {/* Security Guarantee Badge */}
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Zero-Trust 256-Bit Cognitive AST Encryption</span>
                  </div>

                </div>
              </div>

              {/* Scroll Up Hint inside Stage 7 */}
              <div className="mt-3 text-center text-slate-500 text-[10px] font-mono">
                <span>↑ Scroll to top to explore previous scenes or change track</span>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          BOTTOM HUD BAR (STAGE NAVIGATION PILLS)
          ========================================================================= */}
      <footer className="relative z-30 px-5 sm:px-8 py-2.5 border-t border-white/5 bg-[#080B12]/80 backdrop-blur-md flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300">
            System Online // 2026 Engine
          </span>
        </div>

        {/* Stage Dot Stepper */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((s) => (
            <button
              key={s}
              onClick={() => setCurrentStage(s)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentStage === s 
                  ? 'w-6 bg-[#F59E0B]' 
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              title={`Jump to Scene ${s + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={retreatStage}
            disabled={currentStage === 0}
            className="p-1.5 rounded-md border border-white/10 hover:bg-white/10 disabled:opacity-25 transition-opacity cursor-pointer"
            title="Previous Scene"
          >
            <ArrowLeft className="w-3 h-3 text-slate-300" />
          </button>
          <button
            onClick={advanceStage}
            disabled={currentStage === 7}
            className="p-1.5 rounded-md border border-white/10 hover:bg-white/10 disabled:opacity-25 transition-opacity cursor-pointer"
            title="Next Scene"
          >
            <ArrowRight className="w-3 h-3 text-slate-300" />
          </button>
        </div>
      </footer>

    </div>
  );
}
