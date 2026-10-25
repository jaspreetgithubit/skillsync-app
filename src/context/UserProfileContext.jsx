import React, { createContext, useContext, useState, useEffect } from 'react';

const UserProfileContext = createContext(null);

const DEFAULT_PROFILE = {
  name: 'Alex Rivera',
  email: 'alex.rivera@tech.edu',
  role: 'Full Stack',
  experience: 3,
  skills: [
    { name: 'React', level: 'Strong' },
    { name: 'Node.js', level: 'Strong' },
    { name: 'TypeScript', level: 'Medium' },
    { name: 'Python', level: 'Medium' },
    { name: 'TailwindCSS', level: 'Strong' },
    { name: 'PostgreSQL', level: 'Medium' }
  ],
  interests: ['AI/ML', 'Web Development', 'Cloud'],
  previousProjects: 'Real-time collaborative workspace canvas, Distributed event-driven ledger engine, Multimodal vector search pipeline',
  avatar: '/images/avatars/aditya.jpg'
};

export function UserProfileProvider({ children }) {
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('teammatch_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved user profile:', e);
    }
    return DEFAULT_PROFILE;
  });

  const [activeProjectId, setActiveProjectId] = useState(() => {
    try {
      return localStorage.getItem('teammatch_active_project_id') || 'proj-1';
    } catch (e) {
      return 'proj-1';
    }
  });

  const [activeTeamId, setActiveTeamId] = useState(() => {
    try {
      return localStorage.getItem('teammatch_active_team_id') || 'team-1';
    } catch (e) {
      return 'team-1';
    }
  });

  const [joinedTeams, setJoinedTeams] = useState(() => {
    try {
      const saved = localStorage.getItem('teammatch_joined_teams');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Save to localStorage whenever userProfile changes
  useEffect(() => {
    try {
      localStorage.setItem('teammatch_user_profile', JSON.stringify(userProfile));
    } catch (e) {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('teammatch_active_project_id', activeProjectId);
    } catch (e) {}
  }, [activeProjectId]);

  useEffect(() => {
    try {
      localStorage.setItem('teammatch_active_team_id', activeTeamId);
    } catch (e) {}
  }, [activeTeamId]);

  const updateProfile = (updates) => {
    setUserProfile(prev => ({
      ...prev,
      ...updates
    }));
  };

  const addSkill = (skillName, level = 'Medium') => {
    setUserProfile(prev => {
      if (prev.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
        return {
          ...prev,
          skills: prev.skills.map(s => 
            s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, level } : s
          )
        };
      }
      return {
        ...prev,
        skills: [...prev.skills, { name: skillName, level }]
      };
    });
  };

  const removeSkill = (skillName) => {
    setUserProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.name.toLowerCase() !== skillName.toLowerCase())
    }));
  };

  const setSkillLevel = (skillName, level) => {
    setUserProfile(prev => ({
      ...prev,
      skills: prev.skills.map(s => 
        s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, level } : s
      )
    }));
  };

  const toggleInterest = (interest) => {
    setUserProfile(prev => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists 
          ? prev.interests.filter(i => i !== interest)
          : [...prev.interests, interest]
      };
    });
  };

  const joinTeam = (team) => {
    setJoinedTeams(prev => {
      const exists = prev.some(t => t.id === team.id);
      const updated = exists ? prev : [...prev, team];
      try {
        localStorage.setItem('teammatch_joined_teams', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setActiveTeamId(team.id);
  };

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        updateProfile,
        addSkill,
        removeSkill,
        setSkillLevel,
        toggleInterest,
        activeProjectId,
        setActiveProjectId,
        activeTeamId,
        setActiveTeamId,
        joinedTeams,
        joinTeam
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}

