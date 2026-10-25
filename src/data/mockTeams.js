import { MOCK_CANDIDATES } from './mockCandidates';

export const MOCK_TEAMS_DATA = {
  'proj-1': [
    {
      id: 'team-1',
      projectId: 'proj-1',
      name: 'Apex Syndicate',
      badge: 'Algorithm Leader',
      isRecommended: true,
      overallScore: 96,
      skillCoverage: 96,
      roleCoverage: 100,
      skillDiversity: 'High',
      teamBalance: 94,
      currentMembers: 4,
      maxMembers: 5,
      openRole: 'Full Stack',
      members: [
        {
          id: 'cand-3',
          name: 'Karthik Raja',
          avatar: '/images/avatars/karthik.jpg',
          assignedRole: 'ML Engineer',
          coreSkills: ['Python', 'Computer Vision', 'PyTorch'],
          experience: '4.2 yrs',
          compatibility: 97
        },
        {
          id: 'cand-4',
          name: 'Sneha Patel',
          avatar: '/images/avatars/sneha.jpg',
          assignedRole: 'DevOps',
          coreSkills: ['Docker', 'Kubernetes', 'AWS'],
          experience: '3.8 yrs',
          compatibility: 93
        },
        {
          id: 'cand-6',
          name: 'Prof. Kulkarni',
          avatar: '/images/avatars/prof_kulkarni.jpg',
          assignedRole: 'Backend',
          coreSkills: ['Go', 'ROS2', 'Distributed Systems'],
          experience: '7.0 yrs',
          compatibility: 95
        },
        {
          id: 'cand-2',
          name: 'Pooja Sundaram',
          avatar: '/images/avatars/pooja.jpg',
          assignedRole: 'UI/UX Designer',
          coreSkills: ['React', 'Figma', 'TailwindCSS'],
          experience: '4.0 yrs',
          compatibility: 94
        }
      ],
      synergies: [
        '✓ 100% of primary technical roles covered with zero overlap waste',
        '✓ High skill diversity index with complementary algorithmic & systems proficiency',
        '✓ Zero free-rider tolerance verified via past sprint output telemetry',
        '✓ Cognitive equilibrium: 1 senior mentor, 2 experienced leads, 1 high-velocity contributor'
      ],
      skillGaps: [
        '⚠ React/Frontend depth is currently held by 1 member. Adding you as Full Stack brings frontend coverage to 100%!'
      ],
      chatMessages: [
        { id: 1, sender: 'Prof. Kulkarni', avatar: '/images/avatars/prof_kulkarni.jpg', time: '09:30 AM', text: 'Welcome team! I have set up our drone simulator repository and the ROS2 interface.' },
        { id: 2, sender: 'Karthik Raja', avatar: '/images/avatars/karthik.jpg', time: '09:34 AM', text: 'Awesome. I am benchmarking the spatial YOLOv8 vision pipeline for real-time obstacle avoidance.' },
        { id: 3, sender: 'Pooja Sundaram', avatar: '/images/avatars/pooja.jpg', time: '09:42 AM', text: 'Telemetry console wireframes are done. Excited to integrate with the incoming full-stack engineer!' }
      ]
    },
    {
      id: 'team-2',
      projectId: 'proj-1',
      name: 'Vortex Mesh',
      badge: 'Contender',
      isRecommended: false,
      overallScore: 90,
      skillCoverage: 91,
      roleCoverage: 92,
      skillDiversity: 'Medium',
      teamBalance: 88,
      currentMembers: 4,
      maxMembers: 5,
      openRole: 'Backend Lead',
      members: [
        {
          id: 'cand-1',
          name: 'Aditya Verma',
          avatar: '/images/avatars/aditya.jpg',
          assignedRole: 'Full Stack',
          coreSkills: ['React', 'Node.js', 'Python'],
          experience: '3.5 yrs',
          compatibility: 92
        },
        {
          id: 'cand-7',
          name: 'Elena Rostova',
          avatar: '/images/avatars/pooja.jpg',
          assignedRole: 'Frontend',
          coreSkills: ['React', 'TypeScript', 'TailwindCSS'],
          experience: '2.5 yrs',
          compatibility: 89
        },
        {
          id: 'cand-3',
          name: 'Karthik Raja',
          avatar: '/images/avatars/karthik.jpg',
          assignedRole: 'ML Engineer',
          coreSkills: ['Python', 'PyTorch', 'FastAPI'],
          experience: '4.2 yrs',
          compatibility: 94
        },
        {
          id: 'cand-4',
          name: 'Sneha Patel',
          avatar: '/images/avatars/sneha.jpg',
          assignedRole: 'DevOps',
          coreSkills: ['Docker', 'Kubernetes'],
          experience: '3.8 yrs',
          compatibility: 90
        }
      ],
      synergies: [
        '✓ Strong web & telemetry stack delivery speed',
        '✓ High full-stack cohesion with proven past collaboration',
        '✓ Fast initial prototyping capability'
      ],
      skillGaps: [
        '⚠ Distributed low-level robotics (ROS2/Go) is slightly under-indexed compared to Team 1.'
      ],
      chatMessages: [
        { id: 1, sender: 'Aditya Verma', avatar: '/images/avatars/aditya.jpg', time: '10:05 AM', text: 'Hey everyone, working on the WebSocket relay for telemetry.' },
        { id: 2, sender: 'Elena Rostova', avatar: '/images/avatars/pooja.jpg', time: '10:12 AM', text: 'Telemetry graph charts are ready to plug into the backend.' }
      ]
    },
    {
      id: 'team-3',
      projectId: 'proj-1',
      name: 'Quantum Flight Pod',
      badge: 'Experimental',
      isRecommended: false,
      overallScore: 85,
      skillCoverage: 87,
      roleCoverage: 90,
      skillDiversity: 'High',
      teamBalance: 84,
      currentMembers: 4,
      maxMembers: 5,
      openRole: 'ML Researcher',
      members: [
        {
          id: 'cand-8',
          name: 'Marcus Vance',
          avatar: '/images/avatars/karthik.jpg',
          assignedRole: 'Backend',
          coreSkills: ['Node.js', 'Python', 'PostgreSQL'],
          experience: '3.2 yrs',
          compatibility: 88
        },
        {
          id: 'cand-5',
          name: 'Dr. Sunita Sharma',
          avatar: '/images/avatars/dr_sunita.jpg',
          assignedRole: 'Data Science',
          coreSkills: ['Python', 'Data Science', 'FastAPI'],
          experience: '6.5 yrs',
          compatibility: 91
        },
        {
          id: 'cand-2',
          name: 'Pooja Sundaram',
          avatar: '/images/avatars/pooja.jpg',
          assignedRole: 'UI/UX Designer',
          coreSkills: ['React', 'Figma', 'TailwindCSS'],
          experience: '4.0 yrs',
          compatibility: 92
        },
        {
          id: 'cand-4',
          name: 'Sneha Patel',
          avatar: '/images/avatars/sneha.jpg',
          assignedRole: 'DevOps',
          coreSkills: ['Docker', 'AWS'],
          experience: '3.8 yrs',
          compatibility: 87
        }
      ],
      synergies: [
        '✓ Deep research rigor and data engineering foundation',
        '✓ Reliable operational pipeline and container security'
      ],
      skillGaps: [
        '⚠ Computer vision domain depth is below desired threshold. Recommended for data-heavy tracks.'
      ],
      chatMessages: [
        { id: 1, sender: 'Dr. Sunita Sharma', avatar: '/images/avatars/dr_sunita.jpg', time: '11:00 AM', text: 'Looking forward to structuring our data pipeline specs.' }
      ]
    }
  ]
};

// Fallback generator for projects that don't have static teams hardcoded
export function getTeamsForProject(projectId, userProfile = null) {
  if (MOCK_TEAMS_DATA[projectId]) {
    return MOCK_TEAMS_DATA[projectId];
  }

  // Dynamically synthesize 3 realistic teams matching the project
  const team1 = {
    id: `${projectId}-team-1`,
    projectId,
    name: 'Neural Syndicate',
    badge: 'Algorithm Leader',
    isRecommended: true,
    overallScore: 96,
    skillCoverage: 95,
    roleCoverage: 100,
    skillDiversity: 'High',
    teamBalance: 94,
    currentMembers: 4,
    maxMembers: 5,
    openRole: userProfile?.role || 'Full Stack Developer',
    members: [
      {
        id: 'cand-1',
        name: 'Aditya Verma',
        avatar: '/images/avatars/aditya.jpg',
        assignedRole: 'Full Stack',
        coreSkills: ['React', 'TypeScript', 'Node.js'],
        experience: '3.5 yrs',
        compatibility: 96
      },
      {
        id: 'cand-3',
        name: 'Karthik Raja',
        avatar: '/images/avatars/karthik.jpg',
        assignedRole: 'ML Engineer',
        coreSkills: ['Python', 'PyTorch', 'FastAPI'],
        experience: '4.2 yrs',
        compatibility: 95
      },
      {
        id: 'cand-2',
        name: 'Pooja Sundaram',
        avatar: '/images/avatars/pooja.jpg',
        assignedRole: 'UI/UX Designer',
        coreSkills: ['Figma', 'TailwindCSS', 'React'],
        experience: '4.0 yrs',
        compatibility: 94
      },
      {
        id: 'cand-4',
        name: 'Sneha Patel',
        avatar: '/images/avatars/sneha.jpg',
        assignedRole: 'DevOps',
        coreSkills: ['Docker', 'Kubernetes', 'AWS'],
        experience: '3.8 yrs',
        compatibility: 93
      }
    ],
    synergies: [
      '✓ Complete required roles checklist satisfied with verified senior mentorship',
      '✓ Multi-disciplinary skill matrix with zero free-rider risk',
      '✓ High individual synergy scores across technical and collaborative axes'
    ],
    skillGaps: [
      '⚠ Secondary documentation & testing coverage can be reinforced during onboarding.'
    ],
    chatMessages: [
      { id: 1, sender: 'Aditya Verma', avatar: '/images/avatars/aditya.jpg', time: '10:00 AM', text: 'Welcome! We have the repository scaffolded and ready for our new team member.' },
      { id: 2, sender: 'Pooja Sundaram', avatar: '/images/avatars/pooja.jpg', time: '10:04 AM', text: 'Design tokens and component architecture are published on Figma.' }
    ]
  };

  const team2 = {
    id: `${projectId}-team-2`,
    projectId,
    name: 'Velocity Core',
    badge: 'High Velocity',
    isRecommended: false,
    overallScore: 91,
    skillCoverage: 91,
    roleCoverage: 92,
    skillDiversity: 'Medium',
    teamBalance: 88,
    currentMembers: 4,
    maxMembers: 5,
    openRole: 'Backend Lead',
    members: [
      {
        id: 'cand-6',
        name: 'Prof. Kulkarni',
        avatar: '/images/avatars/prof_kulkarni.jpg',
        assignedRole: 'Backend',
        coreSkills: ['Go', 'Rust', 'Distributed Systems'],
        experience: '7.0 yrs',
        compatibility: 92
      },
      {
        id: 'cand-7',
        name: 'Elena Rostova',
        avatar: '/images/avatars/pooja.jpg',
        assignedRole: 'Frontend',
        coreSkills: ['React', 'TypeScript', 'TailwindCSS'],
        experience: '2.5 yrs',
        compatibility: 90
      },
      {
        id: 'cand-8',
        name: 'Marcus Vance',
        avatar: '/images/avatars/karthik.jpg',
        assignedRole: 'Backend',
        coreSkills: ['Node.js', 'PostgreSQL', 'Python'],
        experience: '3.2 yrs',
        compatibility: 89
      },
      {
        id: 'cand-4',
        name: 'Sneha Patel',
        avatar: '/images/avatars/sneha.jpg',
        assignedRole: 'DevOps',
        coreSkills: ['Docker', 'AWS', 'Kubernetes'],
        experience: '3.8 yrs',
        compatibility: 88
      }
    ],
    synergies: [
      '✓ Strong infrastructure reliability and microservices scalability',
      '✓ Exceptional systems depth and fault-tolerance focus'
    ],
    skillGaps: [
      '⚠ UI/UX design specialism is shared across developers rather than dedicated designer.'
    ],
    chatMessages: [
      { id: 1, sender: 'Prof. Kulkarni', avatar: '/images/avatars/prof_kulkarni.jpg', time: '11:15 AM', text: 'Database replication schema is ready for peer review.' }
    ]
  };

  const team3 = {
    id: `${projectId}-team-3`,
    projectId,
    name: 'Horizon Pod',
    badge: 'Emerging',
    isRecommended: false,
    overallScore: 86,
    skillCoverage: 87,
    roleCoverage: 90,
    skillDiversity: 'High',
    teamBalance: 84,
    currentMembers: 4,
    maxMembers: 5,
    openRole: 'Frontend Developer',
    members: [
      {
        id: 'cand-5',
        name: 'Dr. Sunita Sharma',
        avatar: '/images/avatars/dr_sunita.jpg',
        assignedRole: 'Data Science',
        coreSkills: ['Python', 'Data Science', 'PostgreSQL'],
        experience: '6.5 yrs',
        compatibility: 90
      },
      {
        id: 'cand-3',
        name: 'Karthik Raja',
        avatar: '/images/avatars/karthik.jpg',
        assignedRole: 'ML Engineer',
        coreSkills: ['Python', 'PyTorch', 'Computer Vision'],
        experience: '4.2 yrs',
        compatibility: 88
      },
      {
        id: 'cand-8',
        name: 'Marcus Vance',
        avatar: '/images/avatars/karthik.jpg',
        assignedRole: 'Backend',
        coreSkills: ['Node.js', 'FastAPI', 'Redis'],
        experience: '3.2 yrs',
        compatibility: 87
      },
      {
        id: 'cand-2',
        name: 'Pooja Sundaram',
        avatar: '/images/avatars/pooja.jpg',
        assignedRole: 'UI/UX Designer',
        coreSkills: ['Figma', 'TailwindCSS'],
        experience: '4.0 yrs',
        compatibility: 89
      }
    ],
    synergies: [
      '✓ High analytical intelligence and algorithmic model accuracy',
      '✓ Solid design thinking framework'
    ],
    skillGaps: [
      '⚠ DevOps container orchestration pipeline needs early setup support.'
    ],
    chatMessages: [
      { id: 1, sender: 'Dr. Sunita Sharma', avatar: '/images/avatars/dr_sunita.jpg', time: '02:20 PM', text: 'Model weights benchmarked against baseline dataset.' }
    ]
  };

  return [team1, team2, team3];
}

