export const MOCK_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Autonomous Multi-Agent Drone Mesh Engine',
    shortDescription: 'Decentralized drone swarm flight orchestration using distributed consensus, spatial computer vision, and ROS2 edge nodes.',
    description: 'Build an autonomous multi-agent aerial mesh networking platform that coordinates real-time collision avoidance, spatial mapping, and swarm flight path optimization across autonomous quadcopters in contested GPS-denied environments.',
    domain: 'AI/ML',
    requiredSkills: [
      { name: 'Python', minLevel: 'Strong', weight: 30 },
      { name: 'Computer Vision', minLevel: 'Strong', weight: 25 },
      { name: 'React', minLevel: 'Medium', weight: 20 },
      { name: 'ROS2', minLevel: 'Medium', weight: 15 },
      { name: 'Docker', minLevel: 'Basic', weight: 10 }
    ],
    requiredRoles: ['ML Engineer', 'Full Stack', 'Backend', 'DevOps'],
    teamSize: 5,
    openSlots: 2,
    duration: '8 weeks',
    status: 'Open',
    milestones: [
      'Phase 1: Multi-Agent Simulation Sandbox & ROS2 Bridge',
      'Phase 2: Decentralized Bipartite Mesh Consensus Protocol',
      'Phase 3: WebGL Fleet Telemetry Command Console',
      'Phase 4: Field Testing & Swarm Formation Synchronization'
    ],
    bannerImage: '/images/usecase_hackathon.jpg',
    leadName: 'Dr. Sunita Sharma',
    leadAvatar: '/images/avatars/dr_sunita.jpg',
    leadRole: 'Research Lead & Faculty Advisor'
  },
  {
    id: 'proj-2',
    title: 'NeuroPulse Multimodal Health Diagnostics',
    shortDescription: 'HIPAA-compliant clinical diagnostic triage combining biomedical time-series analysis with multimodal vision-language models.',
    description: 'A clinical decision-support engine that analyzes patient vitals, medical imaging scans, and EHR records using fine-tuned medical foundation models to predict critical anomalies with high interpretability and zero data leakage.',
    domain: 'AI/ML',
    requiredSkills: [
      { name: 'Python', minLevel: 'Strong', weight: 35 },
      { name: 'PyTorch', minLevel: 'Strong', weight: 25 },
      { name: 'FastAPI', minLevel: 'Medium', weight: 20 },
      { name: 'React', minLevel: 'Medium', weight: 10 },
      { name: 'PostgreSQL', minLevel: 'Medium', weight: 10 }
    ],
    requiredRoles: ['ML Engineer', 'Backend', 'Frontend', 'Data Science'],
    teamSize: 4,
    openSlots: 1,
    duration: '10 weeks',
    status: 'Almost Full',
    milestones: [
      'Phase 1: Federated Data Ingestion & Privacy Pipeline',
      'Phase 2: Vision-Language Model Fine-Tuning & Quantization',
      'Phase 3: Diagnostic Triage Dashboard & Real-Time Alerts',
      'Phase 4: Clinical Efficacy Benchmark & Latency Profiling'
    ],
    bannerImage: '/images/step3_nlp.jpg',
    leadName: 'Aditya Verma',
    leadAvatar: '/images/avatars/aditya.jpg',
    leadRole: 'Senior ML Systems Engineer'
  },
  {
    id: 'proj-3',
    title: 'Zero-Knowledge Decentralized Identity Vault',
    shortDescription: 'Cryptographic privacy-first identity verification protocol using zk-SNARKs and selective disclosure credentials.',
    description: 'Developing a zero-knowledge sovereign identity verification protocol enabling students and enterprise workers to cryptographically verify certifications, degrees, and institutional access without revealing underlying personal data.',
    domain: 'Cybersecurity',
    requiredSkills: [
      { name: 'Rust', minLevel: 'Strong', weight: 30 },
      { name: 'TypeScript', minLevel: 'Strong', weight: 25 },
      { name: 'React', minLevel: 'Medium', weight: 20 },
      { name: 'Solidity', minLevel: 'Medium', weight: 15 },
      { name: 'Node.js', minLevel: 'Medium', weight: 10 }
    ],
    requiredRoles: ['Backend', 'Full Stack', 'UI/UX', 'DevOps'],
    teamSize: 4,
    openSlots: 2,
    duration: '8 weeks',
    status: 'Open',
    milestones: [
      'Phase 1: zk-SNARK Circuit Architecture & Proof Verification',
      'Phase 2: Biometric Enclave Mobile Authenticator Protocol',
      'Phase 3: Verifier Portal & Institutional Credential Minting',
      'Phase 4: Security Audit & Formal Verification'
    ],
    bannerImage: '/images/step2_project.jpg',
    leadName: 'Karthik Raja',
    leadAvatar: '/images/avatars/karthik.jpg',
    leadRole: 'Cryptography & Protocol Architect'
  },
  {
    id: 'proj-4',
    title: 'Adaptive Agentic Code Review & Synthesis Pod',
    shortDescription: 'Real-time pull request analysis engine that simulates multi-persona peer review, security scanning, and automated test synthesis.',
    description: 'An AI-powered development workflow companion that analyzes incoming pull requests using AST semantic diffing, executes sandbox regression suites, and synthesizes contextual unit tests with explanatory architectural feedback.',
    domain: 'Web',
    requiredSkills: [
      { name: 'TypeScript', minLevel: 'Strong', weight: 30 },
      { name: 'React', minLevel: 'Strong', weight: 25 },
      { name: 'Node.js', minLevel: 'Strong', weight: 20 },
      { name: 'Python', minLevel: 'Medium', weight: 15 },
      { name: 'TailwindCSS', minLevel: 'Medium', weight: 10 }
    ],
    requiredRoles: ['Full Stack', 'Frontend', 'Backend', 'UI/UX'],
    teamSize: 5,
    openSlots: 1,
    duration: '12 weeks',
    status: 'Almost Full',
    milestones: [
      'Phase 1: AST Semantic Tree Parsing & Diff Analyzer',
      'Phase 2: Multi-Persona LLM Prompt Orchestration & Cache',
      'Phase 3: GitHub App Webhooks & Interactive Review UI',
      'Phase 4: Test Synthesis Sandbox & Coverage Heatmaps'
    ],
    bannerImage: '/images/hero_tech_bg.jpg',
    leadName: 'Pooja Sundaram',
    leadAvatar: '/images/avatars/pooja.jpg',
    leadRole: 'Design System & Frontend Architect'
  },
  {
    id: 'proj-5',
    title: 'Cloud-Native Edge Telemetry Stream Grid',
    shortDescription: 'High-throughput time-series event aggregator delivering sub-millisecond metrics routing across geo-distributed Kubernetes clusters.',
    description: 'Architecting an ultrafast event processing engine in Go and Rust capable of ingesting 2.5M telemetry events/sec from IoT nodes and container swarms, with automated anomaly alerting and distributed stream caching.',
    domain: 'Cloud',
    requiredSkills: [
      { name: 'Go', minLevel: 'Strong', weight: 35 },
      { name: 'Kubernetes', minLevel: 'Strong', weight: 25 },
      { name: 'Docker', minLevel: 'Strong', weight: 20 },
      { name: 'React', minLevel: 'Basic', weight: 10 },
      { name: 'PostgreSQL', minLevel: 'Medium', weight: 10 }
    ],
    requiredRoles: ['Backend', 'DevOps', 'Frontend', 'Data Science'],
    teamSize: 6,
    openSlots: 3,
    duration: '8 weeks',
    status: 'Open',
    milestones: [
      'Phase 1: Zero-Copy Ring Buffer & Kafka Stream Partitioning',
      'Phase 2: Geo-Distributed Raft Consensus & Failover Engine',
      'Phase 3: Real-Time Grafana/React Observability Console',
      'Phase 4: Chaos Engineering Resilience Testing'
    ],
    bannerImage: '/images/usecase_corporate.jpg',
    leadName: 'Sneha Patel',
    leadAvatar: '/images/avatars/sneha.jpg',
    leadRole: 'Platform Engineering & DevOps Lead'
  },
  {
    id: 'proj-6',
    title: 'Spatial Collaborative WebGL Canvas Hub',
    shortDescription: 'Infinite canvas collaborative whiteboarding and 3D architectural diagramming tool with multiplayer CRDT sync.',
    description: 'An interactive spatial ideation tool featuring WebGL/Three.js rendering, conflict-free replicated data types (CRDTs) over WebSockets, and real-time audio-spatial presence for high-velocity cross-functional engineering pods.',
    domain: 'Web',
    requiredSkills: [
      { name: 'React', minLevel: 'Strong', weight: 30 },
      { name: 'Three.js', minLevel: 'Medium', weight: 25 },
      { name: 'TypeScript', minLevel: 'Strong', weight: 25 },
      { name: 'WebSockets', minLevel: 'Medium', weight: 10 },
      { name: 'TailwindCSS', minLevel: 'Strong', weight: 10 }
    ],
    requiredRoles: ['Frontend', 'UI/UX', 'Full Stack', 'Backend'],
    teamSize: 4,
    openSlots: 1,
    duration: '6 weeks',
    status: 'Almost Full',
    milestones: [
      'Phase 1: 60FPS Infinite Viewport Canvas & Pan/Zoom Shaders',
      'Phase 2: Yjs / WebRTC Sub-Millisecond Multiplayer Sync',
      'Phase 3: 3D Component Block Library & Wireframe Mode',
      'Phase 4: Export to React Code & Vector Asset Pipeline'
    ],
    bannerImage: '/images/challenges_backdrop.jpg',
    leadName: 'Prof. Kulkarni',
    leadAvatar: '/images/avatars/prof_kulkarni.jpg',
    leadRole: 'Systems Design Faculty & Mentor'
  },
  {
    id: 'proj-7',
    title: 'Predictive Supply Chain Risk Matrix',
    shortDescription: 'Graph neural networks modeling global logistics disruptions, weather telemetry, and multimodal port bottleneck prediction.',
    description: 'A data science powerhouse that maps 40,000+ maritime shipping routes and supplier graphs using Graph Convolutional Networks (GCN) to pinpoint supplier default risks 30 days ahead of schedule.',
    domain: 'Data Science',
    requiredSkills: [
      { name: 'Python', minLevel: 'Strong', weight: 35 },
      { name: 'Data Science', minLevel: 'Strong', weight: 25 },
      { name: 'PostgreSQL', minLevel: 'Medium', weight: 20 },
      { name: 'React', minLevel: 'Medium', weight: 10 },
      { name: 'Docker', minLevel: 'Basic', weight: 10 }
    ],
    requiredRoles: ['Data Science', 'Backend', 'ML Engineer', 'UI/UX'],
    teamSize: 5,
    openSlots: 2,
    duration: '10 weeks',
    status: 'Open',
    milestones: [
      'Phase 1: Maritime AIS Telemetry & Port Ingestion Stream',
      'Phase 2: Graph Convolutional Anomaly Detection Model',
      'Phase 3: Interactive Geospatial Risk Map & Triage View',
      'Phase 4: Scenario Simulation & Stress Testing'
    ],
    bannerImage: '/images/step4_team.jpg',
    leadName: 'Dr. Sunita Sharma',
    leadAvatar: '/images/avatars/dr_sunita.jpg',
    leadRole: 'Data Intelligence Lead'
  },
  {
    id: 'proj-8',
    title: 'CyberShield Autonomous Penetration Engine',
    shortDescription: 'AI-guided ethical red-teaming agent that proactively discovers API vulnerabilities, OWASP Top 10 breaches, and auth flaws.',
    description: 'Constructing an intelligent black-box fuzzer and autonomous penetration testing agent that constructs dynamic attack trees against modern cloud APIs and produces automated remediation pull requests.',
    domain: 'Cybersecurity',
    requiredSkills: [
      { name: 'Python', minLevel: 'Strong', weight: 30 },
      { name: 'Cybersecurity', minLevel: 'Strong', weight: 30 },
      { name: 'Go', minLevel: 'Medium', weight: 20 },
      { name: 'Docker', minLevel: 'Medium', weight: 10 },
      { name: 'React', minLevel: 'Basic', weight: 10 }
    ],
    requiredRoles: ['Backend', 'DevOps', 'Full Stack', 'ML Engineer'],
    teamSize: 4,
    openSlots: 2,
    duration: '8 weeks',
    status: 'Open',
    milestones: [
      'Phase 1: Dynamic OpenAPI Specification Fuzzing Core',
      'Phase 2: Reinforcement Learning Exploitation Pathfinder',
      'Phase 3: Sandboxed Target Deployment with Prometheus Scanners',
      'Phase 4: Executive Remediation & Code Patch Generator'
    ],
    bannerImage: '/images/impact_bg.jpg',
    leadName: 'Karthik Raja',
    leadAvatar: '/images/avatars/karthik.jpg',
    leadRole: 'Security Operations & Red Team Lead'
  }
];

export const DOMAINS = ['All', 'AI/ML', 'Web', 'Cloud', 'Cybersecurity', 'Data Science'];
export const ROLES_FILTER = ['All Roles', 'Frontend', 'Backend', 'Full Stack', 'ML Engineer', 'UI/UX', 'DevOps', 'Data Science'];
export const TEAM_SIZES = ['All Sizes', '3–4', '5', '6+'];
export const STATUSES = ['All Statuses', 'Open', 'Almost Full'];

