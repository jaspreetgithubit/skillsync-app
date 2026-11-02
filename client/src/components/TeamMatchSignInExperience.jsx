import { useState, useEffect, useRef, useCallback } from 'react';
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
  BrainCircuit, 
  Brain, 
  ChevronDown, 
  Zap, 
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
import ResumeProfileReview from './ResumeProfileReview';

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

  // Form Fields
  // Form Fields (Sign In: strictly email and password; Profile is retrieved upon sign in)
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    experience: '',
    interests: [],
    previousProjects: []
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

  // CV Upload & AI Skill Extraction State
  const [cvFile, setCvFile] = useState(null);
  const [cvUploadPhase, setCvUploadPhase] = useState('idle');
  const [cvAnalysisStep, setCvAnalysisStep] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [resumeProfile, setResumeProfile] = useState(null);
  const [resumeDraftToken, setResumeDraftToken] = useState(null);
  const [resumeConsent, setResumeConsent] = useState(false);
  const [resumeConfig, setResumeConfig] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [resumeWarnings, setResumeWarnings] = useState([]);
  const [resumeConfigError, setResumeConfigError] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [isCvDragOver, setIsCvDragOver] = useState(false);
  const cvFileInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    fetch('/api/resumes/config')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error('Resume parser configuration is unavailable.');
        if (active) setResumeConfig(result.data);
      })
      .catch(() => {
        if (active) setResumeConfigError('Could not check resume analysis availability. You can still continue with manual entry.');
      });
    return () => { active = false; };
  }, []);

  const handleProfileChange = (nextProfile) => {
    setResumeProfile(nextProfile);
    setExtractedSkills(nextProfile.skills.map((skill) => ({
      name: skill.name,
      level: skill.proficiency || 'Not specified'
    })));
    setSignUpData((previous) => ({
      ...previous,
      fullName: nextProfile.personalInformation.fullName || previous.fullName,
      email: previous.email.trim() || nextProfile.personalInformation.email || ''
    }));
    setResumeWarnings([
      ...(!nextProfile.personalInformation.fullName ? ['Add your full name before saving.'] : []),
      ...(nextProfile.skills.length === 0 ? ['No skills were found; add any skills you want to include.'] : []),
      ...(nextProfile.projects.length === 0 ? ['No projects were found; add them if applicable.'] : [])
    ]);
  };

  const cancelResumeDraft = async (token) => {
    if (!token) return true;
    try {
      const response = await fetch(`/api/onboarding/drafts/${encodeURIComponent(token)}`, { method: 'DELETE' });
      if (response.ok || response.status === 404) return true;
      setResumeError('The previous temporary draft could not be removed and will expire automatically.');
      return false;
    } catch {
      setResumeError('The previous temporary draft could not be removed and will expire automatically.');
      return false;
    }
  };

  const handleProcessCvFile = (file) => {
    if (!file) return;
    const extension = file.name.split('.').pop().toLowerCase();
    const maxFileSizeBytes = resumeConfig?.maxFileSizeBytes || 5 * 1024 * 1024;
    if (!['pdf', 'docx'].includes(extension)) {
      setResumeError('Choose a PDF or DOCX resume.');
      setCvUploadPhase('error');
      return;
    }
    if (file.size === 0 || file.size > maxFileSizeBytes) {
      setResumeError(file.size === 0 ? 'The selected file is empty.' : `Choose a file smaller than ${(maxFileSizeBytes / (1024 * 1024)).toFixed(0)} MB.`);
      setCvUploadPhase('error');
      return;
    }
    if (resumeDraftToken) cancelResumeDraft(resumeDraftToken);
    setCvFile(file);
    setCvUploadPhase('selected');
    setResumeConsent(false);
    setResumeError('');
    setResumeWarnings([]);
    if (resumeProfile) setExtractedSkills([]);
    setResumeProfile(null);
    setResumeDraftToken(null);
  };

  const handleExtractResume = async () => {
    if (!cvFile) return;
    if (!resumeConsent) {
      setResumeError('Please consent before sending resume text to the selected AI provider.');
      return;
    }
    setResumeError('');
    setCvUploadPhase('uploading');
    setCvAnalysisStep('Uploading your resume securely…');
    const formData = new FormData();
    formData.append('resume', cvFile);
    formData.append('consent', 'true');

    try {
      const result = await new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('POST', '/api/resumes/parse');
        request.responseType = 'json';
        request.timeout = 45000;
        request.upload.addEventListener('load', () => {
          setCvUploadPhase('extracting');
          setCvAnalysisStep('Resume received. Extracting profile details with the selected AI provider…');
        });
        request.addEventListener('load', () => {
          if (!request.response) {
            reject(new Error('The server returned an unreadable response. Please retry.'));
            return;
          }
          resolve({ status: request.status, body: request.response });
        });
        request.addEventListener('error', () => reject(new Error('Could not reach the resume service. Check your connection and retry.')));
        request.addEventListener('timeout', () => reject(new Error('Resume analysis took too long. Retry or continue with manual entry.')));
        request.send(formData);
      });

      if (result.status < 200 || result.status >= 300 || !result.body.success) {
        throw new Error(result.body.error?.message || 'Resume analysis failed. Please retry or continue manually.');
      }

      const { profileDraft, draftToken, warnings } = result.body.data;
      setResumeDraftToken(draftToken);
      handleProfileChange(profileDraft);
      setCvUploadPhase('extracted');
      setCvAnalysisStep(`${result.body.data.sectionsExtracted.length} profile sections are ready for review.`);
      setResumeWarnings(warnings);
    } catch (error) {
      setCvUploadPhase('error');
      setResumeError(error.message || 'Resume analysis failed. Please retry or continue manually.');
    }
  };

  const handleRemoveExtractedSkill = (skillIndex) => {
    setExtractedSkills(prev => prev.filter((_, idx) => idx !== skillIndex));
    setResumeProfile((prev) => prev
      ? { ...prev, skills: prev.skills.filter((_, index) => index !== skillIndex) }
      : prev);
  };

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const clean = customSkillInput.trim();
    if (!extractedSkills.some(s => s.name.toLowerCase() === clean.toLowerCase())) {
      setExtractedSkills(prev => [...prev, { name: clean, level: 'User Added' }]);
      setResumeProfile((prev) => prev
        ? {
            ...prev,
            skills: [...prev.skills, {
              name: clean,
              category: null,
              proficiency: null,
              evidence: null,
              confidence: null,
              originalName: null
            }]
          }
        : prev);
    }
    setCustomSkillInput('');
  };

  const handleRemoveCvFile = () => {
    cancelResumeDraft(resumeDraftToken);
    setCvFile(null);
    setCvUploadPhase('idle');
    if (resumeProfile) setExtractedSkills([]);
    setResumeProfile(null);
    setResumeDraftToken(null);
    setResumeConsent(false);
    setResumeError('');
    setResumeWarnings([]);
    if (cvFileInputRef.current) cvFileInputRef.current.value = '';
  };

  // DOM & Experience Refs
  const experienceContainerRef = useRef(null);
  const scene6ContainerRef = useRef(null);
  const signInContainerRef = useRef(null);
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

  // Smooth Mouse Position Tracking
  const handleMouseMove = useCallback((e) => {
    if (currentStage === 7) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setMousePos({ x, y });
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
    if (pass.length >= 12) score++;
    if (pass.length >= 14 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (pass.length >= 16 && /[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400', percent: '33%' };
    if (score === 2) return { score: 2, label: 'Medium', color: 'bg-[#F59E0B]', text: 'text-[#F59E0B]', percent: '66%' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-400', text: 'text-emerald-400', percent: '100%' };
  };

  const currentPassword = authMode === 'signin' ? signInData.password : signUpData.password;
  const currentEmail = authMode === 'signin' ? signInData.email : signUpData.email;
  const passwordStrength = getPasswordStrength(currentPassword);

  const createProfileDraft = () => {
    const emptyProfile = {
      personalInformation: {
        fullName: null,
        email: null,
        phone: null,
        location: null,
        headline: null,
        professionalSummary: null
      },
      skills: [],
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [],
      interests: []
    };
    const profile = resumeProfile || emptyProfile;
    return {
      ...profile,
      personalInformation: {
        ...profile.personalInformation,
        fullName: signUpData.fullName.trim() || profile.personalInformation.fullName || null,
        headline: profile.personalInformation.headline || signUpData.role
      },
      skills: resumeProfile
        ? profile.skills
        : extractedSkills.map((skill) => ({
            name: skill.name,
            category: null,
            proficiency: null,
            evidence: null,
            confidence: null,
            originalName: null
          })),
      projects: resumeProfile
        ? profile.projects
        : signUpData.previousProjects.map((project) => ({
            title: project.title,
            description: project.desc || null,
            technologies: (project.tech || '').split(',').map((technology) => technology.trim()).filter(Boolean),
            category: null,
            role: null,
            startDate: null,
            endDate: null,
            achievements: [],
            evidence: null
          })),
      interests: resumeProfile ? profile.interests : [...signUpData.interests]
    };
  };

  const handleExecuteAuth = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');

    if (!currentEmail || !isEmailValid(currentEmail)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (!currentPassword || currentPassword.length > 128) {
      setAuthError('Please enter a password no longer than 128 characters.');
      return;
    }

    setAuthPhase('authenticating');
    try {
      if (authMode === 'signup' && !signUpData.fullName.trim()) {
        throw new Error('Please enter your full name.');
      }
      if (authMode === 'signup' && signUpData.password.length < 12) {
        throw new Error('Choose a password with at least 12 characters.');
      }
      if (authMode === 'signup' && cvFile && cvUploadPhase !== 'extracted') {
        throw new Error('Extract the selected resume or remove it before continuing.');
      }

      const requestBody = authMode === 'signin'
        ? { email: currentEmail, password: currentPassword, rememberMe: signInData.rememberMe }
        : {
            name: signUpData.fullName.trim(),
            email: currentEmail,
            password: currentPassword,
            role: signUpData.role,
            experience: signUpData.experience,
            goalTrack: selectedPurpose,
            profileDraft: createProfileDraft(),
            ...(cvFile && resumeDraftToken ? { resumeDraftToken } : {})
          };
      const response = await fetch(`/api/auth/${authMode === 'signin' ? 'login' : 'register'}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.data?.user) {
        throw new Error(result.error?.message || 'The account request could not be completed. Please try again.');
      }

      setResumeDraftToken(null);
      setAuthPhase('complete');
      onAuthenticated?.(result.data.user);
    } catch (error) {
      setAuthPhase('idle');
      setAuthError(error.message || 'The account request could not be completed. Please try again.');
    }
  };

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
        className={`absolute inset-0 pointer-events-none ${currentStage === 7 ? '' : 'transition-opacity duration-1000'}`}
        style={{
          background: currentStage === 7
            ? 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.08) 0%, #080B12 62%)'
            : `radial-gradient(circle at ${50 + mousePos.x * 20}% ${40 + mousePos.y * 20}%, rgba(245, 158, 11, 0.15) 0%, rgba(124, 58, 237, 0.08) 45%, #080B12 85%)`
        }}
      />

      {/* WebGL Three.js Particle & AI Neural Network (Amber Gold & Violet) */}
      {currentStage !== 7 && (
        <AIGraphicCanvas
          stage={currentStage}
          mousePos={mousePos}
          accentColor="#F59E0B"
          className="opacity-70"
        />
      )}

      {/* Micro Grid Overlay for High-Tech Awwwards Aesthetic */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Cursor-Following Ambient Warm Amber Glow */}
      {currentStage !== 7 && (
        <div
          className="absolute w-[450px] h-[450px] rounded-full pointer-events-none blur-[140px] opacity-20 transition-transform duration-300 ease-out hidden md:block"
          style={{
            backgroundColor: '#F59E0B',
            transform: `translate(${mousePos.x * 180 + window.innerWidth / 2 - 225}px, ${mousePos.y * 180 + window.innerHeight / 2 - 225}px)`
          }}
        />
      )}

      {/* =========================================================================
          TOP NAVIGATION HUD (BACK TO HOME & STAGE PROGRESS)
          Strictly preserves "Back to Home" routing
          ========================================================================= */}
      <header className="relative z-30 px-5 sm:px-8 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-[#080B12]/80">
        {/* Back to Home Button */}
        <button
          onClick={onBackToHome}
          onMouseMove={currentStage === 7 ? undefined : handleMagneticMove}
          onMouseLeave={currentStage === 7 ? undefined : handleMagneticLeave}
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
      <main className={`relative flex-1 w-full min-h-0 overflow-hidden flex ${currentStage === 7 ? 'items-stretch' : 'items-center justify-center'} px-4 sm:px-6`}>
        
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
            className="relative z-20 w-full h-full min-h-0 overflow-y-auto px-4 py-5 sm:px-6 sm:py-8 flex flex-col items-center justify-start"
            style={{ overscrollBehavior: 'contain' }}
            onWheel={(e) => e.stopPropagation()}
          >
            <div className={`relative w-full mx-auto flex flex-col items-center ${authMode === 'signup' ? 'max-w-3xl' : 'max-w-lg'}`}>
              
              <div className="mb-5 w-full text-center">
                <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStage(6)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 hover:border-amber-500/40 hover:text-amber-300 cursor-pointer"
                    title="Change building objective track"
                  >
                    <span>Track: <strong className="text-white">{currentConfig.label}</strong></span>
                    <span className="text-amber-400">Change</span>
                  </button>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {currentConfig.welcomeHeading}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {authMode === 'signup' ? 'Create your profile and find teammates with complementary skills.' : currentConfig.welcomeSubheadline}
                </p>
              </div>

              <div className="relative w-full">
                <div 
                  data-lenis-prevent="true"
                  className="relative rounded-2xl border border-white/10 bg-slate-950/95 p-5 shadow-xl sm:p-7"
                >
                  {/* Auth Mode Toggle (Sign In / Sign Up) */}
                  <div className="mx-auto mb-6 flex w-full max-w-sm items-center rounded-xl border border-white/10 bg-white/[0.03] p-1">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                        authMode === 'signin' 
                          ? 'bg-amber-400 text-slate-950 font-semibold'
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
                          ? 'bg-amber-400 text-slate-950 font-semibold'
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

                  {authMode === 'signup' && (
                    <p className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-100/80">
                      Your account and profile are saved to the database. Passwords are stored as salted scrypt hashes, and sign-in uses a secure server-managed session.
                    </p>
                  )}

                  {/* Form Component */}
                  <form key={authMode} onSubmit={handleExecuteAuth} className="space-y-3.5">
                    
                    {authMode === 'signup' ? (
                      /* =======================================================
                         Single-column create-account layout
                         ======================================================= */
                      <div className="grid grid-cols-1 gap-5">
                        {/* LEFT COLUMN: Identity & Credentials */}
                        <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                          <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-sm font-semibold text-white">
                            <User className="w-3 h-3 text-[#F59E0B]" />
                            <span>Account details</span>
                          </div>

                          {/* Full Name */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                              <span>Full Name</span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                required
                                autoComplete="name"
                                value={signUpData.fullName}
                                onChange={(e) => {
                                  const fullName = e.target.value;
                                  setSignUpData({ ...signUpData, fullName });
                                  if (resumeProfile) {
                                    setResumeProfile((previous) => ({
                                      ...previous,
                                      personalInformation: { ...previous.personalInformation, fullName }
                                    }));
                                  }
                                }}
                                placeholder="Your full name"
                                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 pl-9 text-sm text-white outline-none focus:border-amber-400"
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
                                  {isEmailValid(signUpData.email) ? 'Valid email' : 'Enter a valid email'}
                                </span>
                              )}
                            </div>
                            <div className="relative">
                              <input
                                type="email"
                                required
                                autoComplete="email"
                                value={signUpData.email}
                                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                                placeholder="you@university.edu"
                                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 pl-9 text-sm text-white outline-none focus:border-amber-400"
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
                                required
                                minLength={12}
                                maxLength={128}
                                autoComplete="new-password"
                                value={signUpData.password}
                                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                                placeholder="At least 12 characters"
                                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 pl-9 pr-9 text-sm text-white outline-none focus:border-amber-400"
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
                            {signUpData.password && (
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

                          {!cvFile && !resumeProfile && (
                          <div className="space-y-4">
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
                                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                              >
                                <option value="">Select a role (optional)</option>
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
                                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400"
                              >
                                <option value="">Select experience (optional)</option>
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
                          )}
                        </div>

                        {/* RIGHT COLUMN: CV Upload Dropzone & Extracted Skills */}
                        <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                            <span className="flex items-center gap-1.5">
                              <UploadCloud className="w-3 h-3 text-[#F59E0B]" />
                              <span className="text-sm font-semibold text-white">Profile information</span>
                            </span>
                            <span className="text-xs text-slate-400">PDF or DOCX · up to {((resumeConfig?.maxFileSizeBytes || 5 * 1024 * 1024) / (1024 * 1024)).toFixed(0)} MB</span>
                          </div>

                          <div className="space-y-3">
                            <input
                              ref={cvFileInputRef}
                              type="file"
                              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleProcessCvFile(e.target.files[0]);
                                }
                                e.target.value = '';
                              }}
                            />

                            {!cvFile ? (
                              <div
                                onDragOver={(e) => { e.preventDefault(); setIsCvDragOver(true); }}
                                onDragLeave={() => setIsCvDragOver(false)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  setIsCvDragOver(false);
                                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    handleProcessCvFile(e.dataTransfer.files[0]);
                                  }
                                }}
                                className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                                  isCvDragOver
                                    ? 'border-[#F59E0B] bg-amber-500/10'
                                    : 'border-white/15 bg-white/[0.02]'
                                }`}
                              >
                                <UploadCloud className="mx-auto mb-2 h-7 w-7 text-amber-400" />
                                <div className="text-sm font-semibold text-white">
                                  Upload your resume
                                </div>
                                <div className="mt-1 text-xs text-slate-400">
                                  PDF or DOCX. You can review and edit extracted details before saving.
                                </div>
                                <button
                                  type="button"
                                  onClick={() => cvFileInputRef.current?.click()}
                                  className="mt-3 rounded-lg border border-amber-400/40 px-4 py-2 text-sm font-medium text-amber-200 hover:bg-amber-400/10"
                                >
                                  Browse file
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                                  <div className="flex items-center gap-2 truncate mr-2">
                                    <FileText className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                                    <div className="truncate">
                                      <span className="text-xs font-semibold text-white truncate block">{cvFile.name}</span>
                                      <span className="text-[10px] text-slate-400">{(cvFile.size / 1024).toFixed(1)} KB</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => cvFileInputRef.current?.click()}
                                      className="text-[10px] font-semibold text-amber-300 hover:text-amber-200"
                                    >
                                      Replace
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleRemoveCvFile}
                                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                                      aria-label="Remove resume"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {['uploading', 'extracting'].includes(cvUploadPhase) && (
                                  <div role="status" aria-live="polite" className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full border-2 border-[#F59E0B] border-t-transparent animate-spin" />
                                    <span>{cvAnalysisStep}</span>
                                  </div>
                                )}

                                {['selected', 'error'].includes(cvUploadPhase) && (
                                  <label className="flex items-start gap-2 rounded-lg bg-white/[0.03] p-2 text-[10px] leading-relaxed text-slate-300">
                                    <input
                                      type="checkbox"
                                      checked={resumeConsent}
                                      onChange={(event) => setResumeConsent(event.target.checked)}
                                      className="mt-0.5 accent-amber-400"
                                    />
                                    <span>
                                      I consent to sending the text extracted from this resume to the selected AI provider
                                      {resumeConfig?.provider ? ` (${resumeConfig.provider})` : ''} for profile extraction.
                                      The provider name is shown without exposing its API key.
                                    </span>
                                  </label>
                                )}

                                {['selected', 'error'].includes(cvUploadPhase) && (
                                  <button
                                    type="button"
                                    onClick={handleExtractResume}
                                    disabled={!resumeConsent || resumeConfig?.providerConfigured === false}
                                    className="w-full rounded-lg bg-amber-400 px-3 py-2 text-[11px] font-bold text-[#080B12] disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {cvUploadPhase === 'error' ? 'Retry extraction' : 'Extract profile'}
                                  </button>
                                )}
                              </div>
                            )}

                            {resumeConfig?.providerConfigured === false && (
                              <p className="text-[10px] text-amber-200" role="status">
                                Resume analysis is not configured on the server. You can continue with manual profile entry.
                              </p>
                            )}
                            {resumeConfigError && <p className="text-[10px] text-amber-200">{resumeConfigError}</p>}
                            {resumeError && <p className="rounded-lg bg-rose-500/10 p-2 text-[10px] text-rose-200" role="alert">{resumeError}</p>}
                            {resumeWarnings.length > 0 && cvUploadPhase === 'extracted' && (
                              <ul className="list-disc space-y-0.5 pl-4 text-[10px] text-amber-200" aria-label="Profile sections to complete">
                                {resumeWarnings.map((warning) => <li key={warning}>{warning}</li>)}
                              </ul>
                            )}

                            <p className="text-[10px] leading-relaxed text-slate-500">
                              Resume text is sent to the configured third-party AI provider only after your consent. The resume file is not retained.
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                if (cvFile || resumeDraftToken || resumeProfile) {
                                  handleRemoveCvFile();
                                } else {
                                  setCvUploadPhase('idle');
                                  setResumeError('');
                                  setResumeWarnings([]);
                                }
                              }}
                              className="text-[10px] font-semibold text-slate-400 underline underline-offset-2 hover:text-white"
                            >
                              Continue with manual profile entry
                            </button>
                          </div>

                          {resumeProfile && (
                            <>
                              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2 text-[10px] text-emerald-200">
                                Extraction complete. Review and edit the details below before saving.
                              </div>
                              <ResumeProfileReview profile={resumeProfile} onChange={handleProfileChange} />
                            </>
                          )}

                          {!cvFile && !resumeProfile && <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3 text-[#F59E0B]" />
                                <span>Skills ({extractedSkills.length})</span>
                              </span>
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
                                  No skills added yet.
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
                          </div>}

                          {!cvFile && !resumeProfile && (
                          <>
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
                                  No projects added yet. Add them manually or import a resume.
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
                          </>
                          )}
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
                        
                        {/* Email Address */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm font-medium text-slate-300">
                            <span>Email Address</span>
                            {signInData.email && (
                              <span className={isEmailValid(signInData.email) ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                                {isEmailValid(signInData.email) ? 'Valid email' : 'Enter a valid email'}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              autoComplete="email"
                              value={signInData.email}
                              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                              placeholder="you@university.edu"
                              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-3 pl-10 text-sm text-white outline-none focus:border-amber-400"
                            />
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          </div>
                        </div>

                        {/* Password Field with Show/Hide Toggle */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm font-medium text-slate-300">
                            <span>Password</span>
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
                              required
                              maxLength={128}
                              autoComplete="current-password"
                              minLength={4}
                              value={signInData.password}
                              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                              placeholder="Enter your password"
                              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-3 pl-10 pr-10 text-sm text-white outline-none focus:border-amber-400"
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

                        {/* Session preference */}
                        <div className="pt-1 flex items-center justify-between text-xs">
                          <label className="flex items-center gap-2 text-slate-400 hover:text-slate-300 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={signInData.rememberMe}
                              onChange={(e) => setSignInData({ ...signInData, rememberMe: e.target.checked })}
                              className="w-3.5 h-3.5 rounded bg-black/40 border border-white/20 accent-[#F59E0B] cursor-pointer"
                            />
                            <span className="text-sm">Keep me signed in</span>
                          </label>
                        </div>

                        <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-relaxed text-amber-100/80">
                          Sign in uses your account password and a server-managed session. Keep me signed in extends the session to seven days.
                        </div>
                      </div>
                    )}
                    {/* Interactive Holographic Virtual Deck */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={authPhase !== 'idle' || ['uploading', 'extracting'].includes(cvUploadPhase)}
                        className={`w-full rounded-lg px-4 py-3 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer ${
                          authPhase === 'idle'
                            ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                            : 'bg-amber-500/20 text-amber-200 cursor-wait'
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
                        <span>Continuing...</span>
                          </>
                        )}
                        {authPhase === 'verifying' && (
                          <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-[#F59E0B] border-t-transparent animate-spin" />
                        <span>Saving profile...</span>
                          </>
                        )}
                        {authPhase === 'complete' && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Complete</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>

                  {/* Security Guarantee Badge */}
                  <div className="mt-4 border-t border-white/10 pt-4 text-center text-xs text-slate-400">
                    {authMode === 'signup'
                      ? 'The uploaded resume file is processed in memory and is not retained. The reviewed profile is saved with your account.'
                      : 'Sessions are revocable and expire automatically after seven days.'}
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          BOTTOM HUD BAR (STAGE NAVIGATION PILLS)
          ========================================================================= */}
      {currentStage !== 7 && (
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
      )}

    </div>
  );
}
