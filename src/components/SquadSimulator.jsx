import React, { useState } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Search,
  Layers,
  ShieldCheck,
  Cpu,
  Zap,
  FolderGit2,
  Terminal,
  Activity,
  ArrowRight,
  RotateCcw,
  Users,
  Code2,
  Clock,
  Check
} from 'lucide-react';

const DUMMY_PROJECTS = [
  {
    id: "health",
    title: "AI-Based Smart Healthcare Diagnostic System",
    category: "University Capstone Track",
    status: "Live Ingestion Active",
    statusColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    extractedSkills: ['Python', 'PyTorch / TensorFlow', 'Computer Vision (OpenCV)', 'FastAPI Backend', 'React Dashboard', 'Docker & HIPAA'],
    squad: [
      { name: "Aryan Gupta", role: "AI / Deep Learning Lead", skills: "Python, PyTorch, ResNet, OpenCV", exp: "2 Years • 4 Projects", score: "98.4%", avatarBg: "bg-amber-500/20 text-[#F59E0B]" },
      { name: "Rhea Sen", role: "Backend API Architect", skills: "FastAPI, PostgreSQL, Redis, Docker", exp: "1.5 Years • 3 Projects", score: "96.8%", avatarBg: "bg-blue-500/20 text-blue-400" },
      { name: "Karan Malhotra", role: "Frontend UI Specialist", skills: "React, TypeScript, Tailwind, Recharts", exp: "2 Years • 5 Projects", score: "97.2%", avatarBg: "bg-purple-500/20 text-purple-400" },
      { name: "Divya Nair", role: "Cloud & Security Engineer", skills: "AWS ECS, Docker, OAuth2, CI/CD", exp: "1 Year • 2 Projects", score: "95.6%", avatarBg: "bg-emerald-500/20 text-emerald-400" }
    ],
    overall: "97.0%",
    latency: "22ms"
  },
  {
    id: "ev",
    title: "Real-Time Campus EV Smart Charging Network",
    category: "Hackathon 48-Hour Sprint",
    status: "Squad Synthesized",
    statusColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    extractedSkills: ['Embedded C++', 'ESP32 / Microcontrollers', 'MQTT & WebSockets', 'Node.js Backend', 'Next.js Client UI', 'Stripe/UPI Gateway'],
    squad: [
      { name: "Manish Joshi", role: "IoT Firmware Specialist", skills: "Embedded C++, ESP32, MQTT, CAN Bus", exp: "2.5 Years • 5 Hackathons", score: "99.1%", avatarBg: "bg-amber-500/20 text-[#F59E0B]" },
      { name: "Pooja Varma", role: "Real-Time Telemetry Lead", skills: "Node.js, WebSockets, TimescaleDB", exp: "2 Years • 4 Projects", score: "96.4%", avatarBg: "bg-blue-500/20 text-blue-400" },
      { name: "Siddharth Rao", role: "Mobile PWA Lead", skills: "Next.js, Tailwind, Stripe/UPI Webhook", exp: "1.5 Years • 4 Hackathons", score: "97.8%", avatarBg: "bg-purple-500/20 text-purple-400" },
      { name: "Tanvi Saxena", role: "Cloud Infra & Security", skills: "GCP IoT Core, Docker, Redis", exp: "1.5 Years • 2 Projects", score: "95.1%", avatarBg: "bg-emerald-500/20 text-emerald-400" }
    ],
    overall: "97.1%",
    latency: "18ms"
  },
  {
    id: "drone",
    title: "Autonomous Drone Delivery & Route Optimization Platform",
    category: "Corporate R&D Track",
    status: "Live Ingestion Active",
    statusColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    extractedSkills: ['Python / C++', 'ROS 2 (Robot OS)', 'Pathfinding Algorithms (A*)', 'Go Microservices', 'React Mapbox GL', 'Kubernetes'],
    squad: [
      { name: "Aditya Roy", role: "Autonomous Pathfinding Lead", skills: "Python, C++, ROS 2, Dijkstra/A* Path", exp: "3 Years • R&D Lab", score: "98.7%", avatarBg: "bg-amber-500/20 text-[#F59E0B]" },
      { name: "Meenakshi Iyer", role: "Telemetry Core Architect", skills: "Go, Kafka, Redis, gRPC Microservices", exp: "2.5 Years • Enterprise", score: "96.9%", avatarBg: "bg-blue-500/20 text-blue-400" },
      { name: "Rohan Kapoor", role: "Geospatial Dashboard UI", skills: "React, Mapbox GL, Deck.gl, TypeScript", exp: "2 Years • Web Platforms", score: "97.4%", avatarBg: "bg-purple-500/20 text-purple-400" },
      { name: "Simran Kaur", role: "Edge Containerization Lead", skills: "Kubernetes, Helm, Docker, AWS IoT", exp: "2 Years • Cloud Ops", score: "96.2%", avatarBg: "bg-emerald-500/20 text-emerald-400" }
    ],
    overall: "97.3%",
    latency: "28ms"
  },
  {
    id: "web3",
    title: "Decentralized Web3 Voting & Identity Verification Ledger",
    category: "Hackathon 48-Hour Sprint",
    status: "Live Ingestion Active",
    statusColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    extractedSkills: ['Solidity', 'Web3.js / Ethers.js', 'Rust / Go Backend', 'Next.js 14 UI', 'IPFS Distributed Storage', 'Hardhat'],
    squad: [
      { name: "Vikram Singhania", role: "Smart Contract Lead", skills: "Solidity, EVM, ZK-Rollups, Hardhat", exp: "2 Years • 6 Hackathons", score: "99.3%", avatarBg: "bg-amber-500/20 text-[#F59E0B]" },
      { name: "Tanya Mehta", role: "Distributed Protocol Dev", skills: "Go, gRPC, PostgreSQL, Cryptography", exp: "2 Years • 3 Projects", score: "96.5%", avatarBg: "bg-blue-500/20 text-blue-400" },
      { name: "Kabir Joshi", role: "DeFi Frontend Architect", skills: "Next.js, Wagmi, Tailwind, WebGL", exp: "1.5 Years • 4 Projects", score: "97.5%", avatarBg: "bg-purple-500/20 text-purple-400" },
      { name: "Ananya Deshpande", role: "Security & Auditing", skills: "Slither, Docker, Node.js, Linux", exp: "1 Year • 2 Hackathons", score: "95.8%", avatarBg: "bg-emerald-500/20 text-emerald-400" }
    ],
    overall: "97.3%",
    latency: "19ms"
  },
  {
    id: "agri",
    title: "IoT Smart Agriculture & Precision Irrigation System",
    category: "University Capstone Track",
    status: "Squad Synthesized",
    statusColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    extractedSkills: ['Microcontroller Sensors', 'Python Analytics', 'LoRaWAN Wireless', 'FastAPI Backend', 'Mobile React Native', 'AWS IoT Core'],
    squad: [
      { name: "Naveen Kumar", role: "Sensor & Hardware Lead", skills: "C++, LoRaWAN, Soil Moisture Sensors", exp: "2 Years • 3 Projects", score: "98.5%", avatarBg: "bg-amber-500/20 text-[#F59E0B]" },
      { name: "Sneha Joshi", role: "Telemetry Backend Architect", skills: "Python, FastAPI, InfluxDB, Redis", exp: "2 Years • 4 Projects", score: "96.7%", avatarBg: "bg-blue-500/20 text-blue-400" },
      { name: "Alok Sengupta", role: "Mobile Farmer Dashboard", skills: "React Native, Tailwind, Offline Sync", exp: "1.5 Years • 3 Projects", score: "97.3%", avatarBg: "bg-purple-500/20 text-purple-400" },
      { name: "Tarun Nair", role: "Cloud IoT Infrastructure", skills: "AWS IoT Core, Lambda, Docker", exp: "1 Year • 2 Projects", score: "95.4%", avatarBg: "bg-emerald-500/20 text-emerald-400" }
    ],
    overall: "97.0%",
    latency: "25ms"
  },
  {
    id: "ecommerce",
    title: "Real-Time E-Commerce Recommendation Engine",
    category: "Corporate Agile Pod",
    status: "Live Ingestion Active",
    statusColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    extractedSkills: ['Python Machine Learning', 'Collaborative Filtering', 'FastAPI & Node.js', 'PostgreSQL & Redis', 'Next.js 14 Client', 'Stripe API'],
    squad: [
      { name: "Devika Raman", role: "Recommendation ML Lead", skills: "Python, Scikit-Learn, LightGBM, Pandas", exp: "2 Years • 4 Projects", score: "98.2%", avatarBg: "bg-amber-500/20 text-[#F59E0B]" },
      { name: "Harsh Vardhan", role: "Transactional Backend Lead", skills: "FastAPI, PostgreSQL, Redis Caching", exp: "2 Years • 5 Projects", score: "97.1%", avatarBg: "bg-blue-500/20 text-blue-400" },
      { name: "Sanya Kapoor", role: "Client Storefront UI", skills: "Next.js, Tailwind, Framer Motion", exp: "2 Years • 6 Projects", score: "98.0%", avatarBg: "bg-purple-500/20 text-purple-400" },
      { name: "Aman Preet", role: "Cloud Deployment Specialist", skills: "Docker, AWS Lambda, CloudFront, Terraform", exp: "1.5 Years • 3 Projects", score: "95.5%", avatarBg: "bg-emerald-500/20 text-emerald-400" }
    ],
    overall: "97.2%",
    latency: "21ms"
  }
];

export default function SquadSimulator() {
  const [projectTitle, setProjectTitle] = useState("AI-Based Smart Healthcare Diagnostic System");
  const [pipelineStage, setPipelineStage] = useState('idle'); // 'idle' | 'running' | 'complete'
  const [activeStep, setActiveStep] = useState(1); // 1 = NLP extraction, 2 = Vector Matching, 3 = Inference & Squad
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [showSquad, setShowSquad] = useState(false);
  const [matchedProject, setMatchedProject] = useState(DUMMY_PROJECTS[0]);

  // Function to resolve matched project details
  const resolveProjectData = (title) => {
    const lower = title.toLowerCase();
    const existing = DUMMY_PROJECTS.find(p => p.title.toLowerCase() === lower);
    if (existing) return existing;

    if (lower.includes('drone') || lower.includes('robot') || lower.includes('route') || lower.includes('flight')) {
      return { ...DUMMY_PROJECTS[2], title };
    }
    if (lower.includes('ev') || lower.includes('charging') || lower.includes('iot') || lower.includes('vehicle')) {
      return { ...DUMMY_PROJECTS[1], title };
    }
    if (lower.includes('web3') || lower.includes('crypto') || lower.includes('blockchain') || lower.includes('ledger') || lower.includes('vote')) {
      return { ...DUMMY_PROJECTS[3], title };
    }
    if (lower.includes('agri') || lower.includes('farm') || lower.includes('crop') || lower.includes('soil')) {
      return { ...DUMMY_PROJECTS[4], title };
    }
    if (lower.includes('commerce') || lower.includes('shop') || lower.includes('store') || lower.includes('recommend')) {
      return { ...DUMMY_PROJECTS[5], title };
    }
    if (lower.includes('health') || lower.includes('medical') || lower.includes('disease') || lower.includes('doctor')) {
      return { ...DUMMY_PROJECTS[0], title };
    }

    // Default dynamic synthesis
    return {
      id: "custom-" + Date.now(),
      title: title,
      category: "Custom Engineering Capstone",
      status: "Synthesized via NLP",
      statusColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      extractedSkills: ['Python & PyTorch', 'FastAPI Backend Architecture', 'React & TypeScript UI', 'PostgreSQL & Redis DB', 'Docker & CI/CD Pipeline', 'Vector Semantic Embeddings'],
      squad: [
        { name: "Aryan Gupta", role: "AI / ML Algorithm Lead", skills: "Python, NLP Embeddings, Model Tuning", exp: "2 Years • 4 Projects", score: "98.2%", avatarBg: "bg-amber-500/20 text-[#F59E0B]" },
        { name: "Rhea Sen", role: "Backend Systems Architect", skills: "FastAPI, PostgreSQL, Microservices", exp: "1.5 Years • 3 Projects", score: "96.5%", avatarBg: "bg-blue-500/20 text-blue-400" },
        { name: "Karan Malhotra", role: "Frontend UI Specialist", skills: "React, Tailwind, Interactive UX", exp: "2 Years • 5 Projects", score: "97.4%", avatarBg: "bg-purple-500/20 text-purple-400" },
        { name: "Divya Nair", role: "Cloud Infra & Security", skills: "Docker, AWS ECS, OAuth2, CI/CD", exp: "1 Year • 2 Projects", score: "95.8%", avatarBg: "bg-emerald-500/20 text-emerald-400" }
      ],
      overall: "97.2%",
      latency: "21ms"
    };
  };

  // Paced Execution: Step 1 runs with proper time, then Step 2 runs with proper time, then Step 3 & squad!
  const executeNlpPipeline = (titleToRun) => {
    const finalTitle = (titleToRun || projectTitle).trim() || "AI-Based Smart Healthcare Diagnostic System";
    setProjectTitle(finalTitle);
    setPipelineStage('running');
    setActiveStep(1);
    setStep1Done(false);
    setStep2Done(false);
    setStep3Done(false);
    setShowSquad(false);

    // STEP 1 RUNS: Takes 1500ms (1.5 seconds) so user clearly watches Step 1 execute
    setTimeout(() => {
      setStep1Done(true);
      setActiveStep(2); // Now Step 2 starts!
    }, 1500);

    // STEP 2 RUNS: Takes another 1500ms (Total 3000ms) so user clearly watches Step 2 execute
    setTimeout(() => {
      setStep2Done(true);
      setActiveStep(3); // Now Step 3 starts!
    }, 3000);

    // STEP 3 RUNS & INFERENCE COMPLETES: Takes 1000ms (Total 4000ms)
    setTimeout(() => {
      const resolved = resolveProjectData(finalTitle);
      setMatchedProject(resolved);
      setStep3Done(true);
      setPipelineStage('complete');
    }, 4000);

    // GROUP OF PEOPLE REVEALED: Appears right after Inference Complete (Total 4500ms)
    setTimeout(() => {
      setShowSquad(true);
    }, 4500);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeNlpPipeline(projectTitle);
  };

  const handleSelectPreset = (project) => {
    setProjectTitle(project.title);
    executeNlpPipeline(project.title);
  };

  const handleReset = () => {
    setPipelineStage('idle');
    setActiveStep(1);
    setStep1Done(false);
    setStep2Done(false);
    setStep3Done(false);
    setShowSquad(false);
  };

  return (
    <section id="simulator" className="py-20 lg:py-28 relative overflow-hidden text-slate-100">

      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-amber-500/10 blur-[170px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-950/20 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* =========================================================================
            HEADER: "LIVE AI TEAM FORMATION & PROJECT ROSTER"
            HEADER: "DUMMY AI FORMATION & PROJECT ROSTER"
            ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-[#F59E0B]">
            <BrainCircuit className="h-3.5 w-3.5 text-[#F59E0B]" />
            <span>REAL-TIME LIVE AI LAB</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-200 tracking-tight leading-tight">
            Live AI Team Formation & Project Roster
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            A step-by-step interactive simulation: Provide project title, observe Step 1 NLP analysis, Step 2 student pool matching, and Step 3 inference completion with the synthesized group of people.
          </p>
        </div>

        {/* =========================================================================
            ONE UNIFIED PART / CONSOLE (EK HI PART ME SAB)
            ========================================================================= */}
        <div className="glass-panel-cinematic rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 max-w-5xl mx-auto shadow-2xl space-y-8">

          {/* =========================================================================
              STEP PROGRESS TRACKER (REFLECTS REAL TIMING BETWEEN 1, 2, AND 3)
              ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-6 border-b border-white/10">

            {/* STEP 1 TRACKER */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center space-x-3.5 ${
              pipelineStage === 'running' && activeStep === 1
                ? 'bg-amber-500/15 border-[#F59E0B] text-white shadow-lg shadow-amber-500/20 ring-1 ring-[#F59E0B]'
                : step1Done
                ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                : pipelineStage === 'idle'
                ? 'bg-white/[0.04] border-white/20 text-white'
                : 'bg-white/[0.02] border-white/10 text-slate-400'
            }`}>
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                step1Done
                  ? 'bg-emerald-500 text-[#080B12] shadow-md shadow-emerald-500/30'
                  : pipelineStage === 'running' && activeStep === 1
                  ? 'bg-[#F59E0B] text-[#080B12] animate-pulse'
                  : 'bg-white/10 text-white'
              }`}>
                {step1Done ? <Check className="h-4 w-4 stroke-[3]" /> : '1'}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>Step 1: NLP Title Parsing</span>
                  {pipelineStage === 'running' && activeStep === 1 && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {step1Done ? '✓ Competencies Extracted' : pipelineStage === 'running' && activeStep === 1 ? 'Analyzing scope & skills...' : 'Input & ingest project scope'}
                </div>
              </div>
            </div>

            {/* STEP 2 TRACKER */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center space-x-3.5 ${
              pipelineStage === 'running' && activeStep === 2
                ? 'bg-amber-500/15 border-[#F59E0B] text-white shadow-lg shadow-amber-500/20 ring-1 ring-[#F59E0B]'
                : step2Done
                ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                : 'bg-white/[0.02] border-white/10 text-slate-400'
            }`}>
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                step2Done
                  ? 'bg-emerald-500 text-[#080B12] shadow-md shadow-emerald-500/30'
                  : pipelineStage === 'running' && activeStep === 2
                  ? 'bg-[#F59E0B] text-[#080B12] animate-pulse'
                  : 'bg-white/10 text-slate-400'
              }`}>
                {step2Done ? <Check className="h-4 w-4 stroke-[3]" /> : '2'}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>Step 2: Vector Cosine Match</span>
                  {pipelineStage === 'running' && activeStep === 2 && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {step2Done ? '✓ Student Pool Evaluated' : pipelineStage === 'running' && activeStep === 2 ? 'Scanning 1,200+ profiles...' : 'Cosine similarity matching'}
                </div>
              </div>
            </div>

            {/* STEP 3 TRACKER */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center space-x-3.5 ${
              pipelineStage === 'complete'
                ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                : pipelineStage === 'running' && activeStep === 3
                ? 'bg-amber-500/15 border-[#F59E0B] text-white shadow-lg shadow-amber-500/20 ring-1 ring-[#F59E0B]'
                : 'bg-white/[0.02] border-white/10 text-slate-400'
            }`}>
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                pipelineStage === 'complete'
                  ? 'bg-emerald-400 text-[#080B12] shadow-md shadow-emerald-500/40'
                  : pipelineStage === 'running' && activeStep === 3
                  ? 'bg-[#F59E0B] text-[#080B12] animate-pulse'
                  : 'bg-white/10 text-slate-400'
              }`}>
                {pipelineStage === 'complete' ? <Check className="h-4 w-4 stroke-[3]" /> : '3'}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>Step 3: Inference & Squad</span>
                  {pipelineStage === 'running' && activeStep === 3 && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {pipelineStage === 'complete' ? '✓ Group of People Formed' : pipelineStage === 'running' && activeStep === 3 ? 'Assembling squad roles...' : 'Inference & team reveal'}
                </div>
              </div>
            </div>

          </div>

          {/* =========================================================================
              STEP 1: HAM PROJECT TITLE DE (TITLE INPUT & ROSTER PRESETS)
              ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-200 uppercase tracking-wider font-bold flex items-center space-x-2">
                <FolderGit2 className="h-4 w-4 text-[#F59E0B]" />
                <span>1. Provide Project Title & Scope</span>
              </label>
              {pipelineStage === 'complete' && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-mono text-[#F59E0B] hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset & Try Another Title</span>
                </button>
              )}
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Type any project title (e.g. AI Smart Healthcare, Autonomous Drone Delivery)..."
                  disabled={pipelineStage === 'running'}
                  className="w-full bg-black/25 backdrop-blur-sm border border-white/20 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B] transition-colors disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={pipelineStage === 'running'}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl btn-amber-gold text-xs uppercase tracking-wider font-extrabold flex items-center justify-center space-x-2 shrink-0 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${pipelineStage === 'running' ? 'animate-spin' : ''}`} />
                <span>
                  {pipelineStage === 'running'
                    ? activeStep === 1
                      ? 'Step 1: NLP Running...'
                      : activeStep === 2
                      ? 'Step 2: Vector Matching...'
                      : 'Step 3: Assembling Squad...'
                    : pipelineStage === 'complete'
                    ? 'Re-Run NLP Match'
                    : 'Run NLP Team Formation'}
                </span>
                {pipelineStage !== 'running' && <ArrowRight className="h-3.5 w-3.5" />}
              </button>
            </form>

            {/* QUICK 1-CLICK ROSTER PRESETS */}
            <div className="pt-2">
              <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
                <span>Or select from active pipeline presets (1-Click Auto-Fill & Run):</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {DUMMY_PROJECTS.map((proj) => {
                  const isCurrent = projectTitle === proj.title;
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      disabled={pipelineStage === 'running'}
                      onClick={() => handleSelectPreset(proj)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'border-[#F59E0B] bg-white/[0.08] shadow-md shadow-amber-500/15'
                          : 'border-white/10 bg-black/20 backdrop-blur-sm hover:border-white/25 hover:bg-white/[0.04]'
                      } disabled:cursor-not-allowed`}
                    >
                      <div className="text-[10px] font-mono text-amber-400 font-semibold truncate mb-1">
                        {proj.category.split(' ')[0]}
                      </div>
                      <div className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {proj.title}
                      </div>
                      <div className="mt-2 text-[9px] font-mono text-emerald-400 font-bold">
                        {proj.overall} Match
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================================================================
              PACED PROCESSING TERMINAL (SHOWS CLEAR TIME DELAY BETWEEN 1, 2, AND 3)
              ========================================================================= */}
          {pipelineStage === 'running' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-black/35 backdrop-blur-md border border-[#F59E0B]/40 shadow-2xl space-y-6 animate-in fade-in duration-300">

              {/* Header with active phase & animated spinner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#F59E0B] animate-spin">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
                      <span>
                        {activeStep === 1
                          ? 'Step 1: NLP Scope Parsing & Keyword Vectorization'
                          : activeStep === 2
                          ? 'Step 2: Vector Cosine Matching Across Student Database'
                          : 'Step 3: Role Balancing & Inference Verification'}
                      </span>
                      <span className="inline-block w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {activeStep === 1
                        ? 'Extracting domain dependencies, technical keywords & framework needs...'
                        : activeStep === 2
                        ? 'Executing semantic search across 1,200+ verified student skill profiles...'
                        : 'Resolving role conflicts: AI Lead, Backend, Frontend, Cloud...'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Clock className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-[#F59E0B] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                    {activeStep === 1 ? 'Phase 1: Ingesting' : activeStep === 2 ? 'Phase 2: Matching' : 'Phase 3: Synthesizing'}
                  </span>
                </div>
              </div>

              {/* Multi-Step Animated Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Pipeline Execution Progress</span>
                  <span className="text-amber-400 font-bold">
                    {activeStep === 1 ? '35% (Step 1 Active)' : activeStep === 2 ? '70% (Step 2 Active)' : '95% (Step 3 Active)'}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-2.5 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${activeStep === 1 ? 35 : activeStep === 2 ? 70 : 95}%` }}
                  />
                </div>
              </div>

              {/* 3 Step Cards with Live Execution Timing */}
              <div className="space-y-2.5 font-mono text-xs">

                {/* STEP 1 CARD */}
                <div className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
                  activeStep === 1
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-md shadow-amber-500/10'
                    : step1Done
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-black/40 border-white/5 text-slate-500'
                }`}>
                  <span className="mt-0.5 font-bold shrink-0">
                    {step1Done ? '✓' : activeStep === 1 ? '⚡' : '○'}
                  </span>
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center space-x-2">
                      <span>[Step 1] NLP Tokenizer & Semantic Dependency Extraction</span>
                      {activeStep === 1 && <span className="text-[10px] text-amber-400 animate-pulse">(Processing...)</span>}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {step1Done
                        ? `✓ Extracted 6 technical competency vectors for: "${projectTitle}"`
                        : `Ingesting "${projectTitle}" into Transformer NLP model...`}
                    </div>
                  </div>
                </div>

                {/* STEP 2 CARD */}
                <div className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
                  activeStep === 2
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-md shadow-amber-500/10'
                    : step2Done
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-black/40 border-white/5 text-slate-500'
                }`}>
                  <span className="mt-0.5 font-bold shrink-0">
                    {step2Done ? '✓' : activeStep === 2 ? '⚡' : '○'}
                  </span>
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center space-x-2">
                      <span>[Step 2] Cosine Similarity Search Across 1,200+ Student Profiles</span>
                      {activeStep === 2 && <span className="text-[10px] text-amber-400 animate-pulse">(Processing...)</span>}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {step2Done
                        ? '✓ Vector similarity converged: Filtered top 4 candidate profiles with >95% fit'
                        : activeStep === 2
                        ? 'Querying pgvector database & ranking candidate experience...'
                        : 'Pending Step 1 completion...'}
                    </div>
                  </div>
                </div>

                {/* STEP 3 CARD */}
                <div className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
                  activeStep === 3
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-md shadow-amber-500/10'
                    : step3Done
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-black/40 border-white/5 text-slate-500'
                }`}>
                  <span className="mt-0.5 font-bold shrink-0">
                    {step3Done ? '✓' : activeStep === 3 ? '⚡' : '○'}
                  </span>
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center space-x-2">
                      <span>[Step 3] Role Optimization & Inference Synthesis</span>
                      {activeStep === 3 && <span className="text-[10px] text-amber-400 animate-pulse">(Finalizing...)</span>}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {step3Done
                        ? '✓ Balanced 4-person squad formed: Zero skill gaps'
                        : activeStep === 3
                        ? 'Resolving AI Lead, Backend, Frontend & Cloud balance...'
                        : 'Pending Step 2 completion...'}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* =========================================================================
              STEP 3 & RESULTS: INFERENCE COMPLETE & GROUP OF PEOPLE DIKHAO
              ========================================================================= */}
          {pipelineStage === 'complete' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">

              {/* --- 1. INFERENCE COMPLETE BANNER --- */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-emerald-500/10">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>INFERENCE COMPLETE</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {matchedProject.title}
                  </h3>
                  <div className="text-xs font-mono text-slate-300">
                    Track: <span className="text-[#F59E0B] font-semibold">{matchedProject.category}</span> • Latency: <span className="text-emerald-400 font-semibold">{matchedProject.latency}</span> • AI Model: <span className="text-slate-200">BERT-Semantic-V2</span>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-black/60 px-4 py-3 rounded-2xl border border-white/15 self-start sm:self-auto">
                  <div className="text-3xl font-black text-[#F59E0B] font-mono leading-none">
                    {matchedProject.overall}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mt-1">
                    Squad Compatibility
                  </div>
                </div>
              </div>

              {/* --- 2. NLP EXTRACTED TECHNICAL DEPENDENCIES --- */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 space-y-2.5">
                <div className="text-xs font-mono text-slate-300 font-bold flex items-center space-x-2">
                  <Cpu className="h-3.5 w-3.5 text-[#F59E0B]" />
                  <span>Step 1 & 2 Output: NLP Extracted Technical Dependencies:</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {matchedProject.extractedSkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs font-mono text-amber-300 font-medium"
                    >
                      <CheckCircle2 className="h-3 w-3 text-[#F59E0B]" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* --- 3. GROUP OF PEOPLE (SYNTHESIZED 4-MEMBER SQUAD) --- */}
              {showSquad && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="uppercase tracking-wider text-slate-200 font-bold flex items-center space-x-2">
                      <Users className="h-4 w-4 text-emerald-400" />
                      <span>Step 3 Output: Synthesized Group of People (Recommended 4-Person Squad):</span>
                    </span>
                    <span className="text-emerald-400 font-bold text-xs hidden sm:inline">
                      100% Full-Stack Covered • Zero Role Overlap
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {matchedProject.squad.map((member, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/15 hover:border-[#F59E0B]/60 transition-all flex items-start justify-between gap-3 group shadow-lg"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`h-11 w-11 rounded-2xl border border-white/20 flex items-center justify-center font-black text-sm shrink-0 shadow-inner ${member.avatarBg}`}>
                            {member.name.charAt(0)}
                          </div>

                          <div className="space-y-1">
                            <div className="text-sm font-bold text-white group-hover:text-[#F59E0B] transition-colors leading-tight">
                              {member.name}
                            </div>
                            <div className="text-xs font-semibold text-amber-400">
                              {member.role}
                            </div>
                            <div className="text-[11px] text-slate-300 font-mono">
                              {member.skills}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Experience: {member.exp}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 bg-black/50 px-2.5 py-1.5 rounded-xl border border-white/10">
                          <div className="text-sm font-mono font-black text-[#F59E0B]">
                            {member.score}
                          </div>
                          <div className="text-[8px] font-mono text-slate-400 uppercase">
                            Match
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Final Verification Footer */}
                  <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-400 gap-2">
                    <span className="flex items-center space-x-2 text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verified: Zero Skill Gaps • 100% Role Harmony</span>
                    </span>
                    <div className="flex items-center space-x-4">
                      <span className="text-[#F59E0B] font-bold">
                        Status: Squad Ready for Collaboration
                      </span>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-white hover:text-[#F59E0B] underline font-bold cursor-pointer"
                      >
                        Test Another Project Title
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* =========================================================================
              INITIAL / IDLE STATE HELPER
              ========================================================================= */}
          {pipelineStage === 'idle' && (
            <div className="p-8 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#F59E0B] flex items-center justify-center mx-auto">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                Ready for AI Squad Synthesis
              </h4>
              <p className="text-xs text-slate-400 max-w-lg mx-auto font-normal">
                Enter your capstone title above (or click a preset) and click <strong className="text-amber-400">"Run NLP Team Formation"</strong>. Watch Step 1 parse the title, then Step 2 match students, and Step 3 reveal inference completion with your group of people.
              </p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
