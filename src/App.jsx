import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import HowItWorks from './components/HowItWorks';
import BentoGrid from './components/BentoGrid';
import SquadSimulator from './components/SquadSimulator';
import ImpactMetrics from './components/ImpactMetrics';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ChoosePurposePage from './components/ChoosePurposePage';
import TeamMatchSignInExperience from './components/TeamMatchSignInExperience';
import AdminCreateProject from './components/AdminCreateProject';
import { supabase } from './lib/supabase';




// User Profile Context
import { UserProfileProvider, useUserProfile } from './context/UserProfileContext';

// 2026 Multi-Step User Flow Pages (Pages 1 to 9)
import ProfileSetup from './pages/ProfileSetup';
import ExploreProjects from './pages/ExploreProjects';
import ProjectDetails from './pages/ProjectDetails';
import CompatibilityAnalysis from './pages/CompatibilityAnalysis';
import CompareTeams from './pages/CompareTeams';
import RecommendedTeam from './pages/RecommendedTeam';
import TeamDashboard from './pages/TeamDashboard';
import useLenis from './hooks/useLenis';

// Google Gemini AI Assistant (Dedicated Feature Folder)
import GeminiChatbot from './components/gemini-chatbot/GeminiChatbot';
// Full-page secure Gemini chat app (route: /chat)
import ChatApp from './components/chat-app/ChatApp';

function AppContent() {
  useLenis();
  const { updateProfile, setActiveProjectId, setActiveTeamId } = useUserProfile();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const hasHandledOAuthRef = useRef(false);







  // Pathname & Query-Aware Route Resolver
  const resolveCurrentRoute = useCallback(() => {
    try {
      const path = (window.location.pathname || '').toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');

      if (path === '/chat' || path.startsWith('/chat/') || page === 'chat') {
        return { view: 'chat' };
      }

      if (path.includes('/profile-setup') || page === 'profile-setup') {
        return { view: 'profile-setup' };
      }
      if (path.includes('/explore-projects') || page === 'explore-projects') {
        return { view: 'explore-projects' };
      }
      if (path.includes('/compatibility') || page === 'compatibility') {
        const idMatch = path.match(/\/project\/([^/]+)\/compatibility/);
        const pId = idMatch ? idMatch[1] : params.get('projectId') || 'proj-1';
        return { view: 'compatibility', projectId: pId };
      }
      if (path.includes('/compare') || page === 'compare') {
        const idMatch = path.match(/\/project\/([^/]+)\/compare/);
        const pId = idMatch ? idMatch[1] : params.get('projectId') || 'proj-1';
        return { view: 'compare-teams', projectId: pId };
      }
      if (path.includes('/recommended') || page === 'recommended') {
        const idMatch = path.match(/\/project\/([^/]+)\/recommended/);
        const pId = idMatch ? idMatch[1] : params.get('projectId') || 'proj-1';
        return { view: 'recommended-team', projectId: pId, teamId: params.get('teamId') || 'team-1' };
      }
      if (path.startsWith('/project/') || page === 'project-details' || page === 'project') {
        const idMatch = path.match(/\/project\/([^/]+)/);
        const pId = idMatch ? idMatch[1] : params.get('projectId') || 'proj-1';
        return { view: 'project-details', projectId: pId };
      }
      if (path.startsWith('/team/') || page === 'team-dashboard' || page === 'dashboard' || page === 'team') {
        const idMatch = path.match(/\/team\/([^/]+)/);
        const tId = idMatch ? idMatch[1] : params.get('teamId') || 'team-1';
        return { view: 'team-dashboard', teamId: tId, projectId: params.get('projectId') || 'proj-1' };
      }
      if (path.includes('/admin') || page === 'admin' || params.get('admin') === 'true') {
        return { view: 'admin' };
      }
      if (path.includes('/choose-purpose') || page === 'choose-purpose' || page === 'purpose') {
        return { view: 'purpose' };
      }
      if (path.includes('/auth') || page === 'auth') {
        const purpose = params.get('purpose') || (path.includes('create') ? 'create-project' : 'join-project');
        const mode = params.get('mode') || 'signin';
        return { view: 'auth', purpose, mode };
      }
    } catch {
      // ignore
    }
    return { view: 'landing' };
  }, []);

  const [routeState, setRouteState] = useState(resolveCurrentRoute);

  // Sync with browser Back and Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const resolved = resolveCurrentRoute();
      setRouteState(resolved);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [resolveCurrentRoute]);

  // Synchronous route navigator supporting paths and state
  const navigateTo = (toUrl, routeData = {}) => {
    try {
      window.history.pushState(routeData, '', toUrl);
    } catch {
      // ignore
    }

    const resolved = resolveCurrentRoute();
    if (routeData.projectId) {
      resolved.projectId = routeData.projectId;
      setActiveProjectId(routeData.projectId);
    }
    if (routeData.project) {
      resolved.project = routeData.project;
    }
    if (routeData.teamId) {
      resolved.teamId = routeData.teamId;
      setActiveTeamId(routeData.teamId);
    }
    if (routeData.mode) {
      resolved.mode = routeData.mode;
    }
    if (routeData.purpose) {
      resolved.purpose = routeData.purpose;
    }

    setRouteState(resolved);
    try {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } catch {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  
    // Restore Google Auth session and redirect to profile-setup
  useEffect(() => {
    if (!supabase) return undefined;

    let active = true;
    const applySupabaseUser = (user) => {
      if (!user || !active) return;
      const metadata = user.user_metadata || {};
      const googleName = metadata.full_name || metadata.name || user.email?.split('@')[0] || 'SyncSkills User';
      const baseUser = {
        id: user.id,
        name: googleName,
        email: user.email || '',
        avatar: metadata.avatar_url || metadata.picture || null,
        role: 'Full Stack Developer',
        authenticatedAt: new Date().toLocaleTimeString()
      };

      updateProfile(baseUser);

      const currentPath = (window.location.pathname || '').toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      const hasOAuthParams = window.location.hash.includes('access_token') || searchParams.has('code');

      // Strip hash from address bar immediately so subsequent pages (like explore-projects) are never trapped
      if (hasOAuthParams) {
        try {
          window.history.replaceState(null, '', window.location.pathname);
        } catch {}
      }

      // Redirect to profile-setup only ONCE immediately upon OAuth completion
      if (!hasHandledOAuthRef.current && (hasOAuthParams || currentPath === '/auth')) {
        hasHandledOAuthRef.current = true;
        navigateTo('/profile-setup');
      }
    };

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('Unable to restore Supabase session:', error.message);
      if (data?.session?.user) applySupabaseUser(data.session.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
        Promise.resolve().then(() => applySupabaseUser(session.user));
      }
    });

    return () => {
      active = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Open the "Choose Your Purpose" page
  const handleOpenAuth = (mode = 'signin', purpose = 'join-project') => {
    navigateTo('/auth?mode=' + mode + '&purpose=' + purpose, { mode, purpose });
  };

  // User decision on Choose Your Purpose page: routes to Auth first!
  const handleSelectPurpose = (purposeId) => {
    if (purposeId === 'create-project') {
      navigateTo('/auth?purpose=create-project', { purpose: 'create-project' });
    } else {
      navigateTo('/auth?purpose=join-project', { purpose: 'join-project' });
    }
  };

  const handleProfileComplete = (profileData) => {
    updateProfile(profileData);
    navigateTo('/profile-setup');
  };

  const handleSignOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    updateProfile({
      name: 'Alex Chen',
      email: '',
      role: 'Full Stack Developer'
    });
    navigateTo('/');
  };

  return (
    <div className="relative min-h-screen bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] antialiased overflow-x-hidden">

      {/* =========================================================================
          VIEW 1: CHOOSE YOUR PURPOSE ("Why are you here?")
          ========================================================================= */}
      {/* SECURE GEMINI CHAT APP (/chat) */}
      {routeState.view === 'chat' && (
        <ChatApp onBackToHome={() => navigateTo('/')} />
      )}

      {routeState.view === 'purpose' && (
        <ChoosePurposePage 
          onSelectPurpose={handleSelectPurpose}
          onBackToHome={() => navigateTo('/')}
        />
      )}

      {/* =========================================================================
          PAGE 1: PROFILE SETUP / ONBOARDING (/profile-setup)
          ========================================================================= */}
      {routeState.view === 'profile-setup' && (
        <ProfileSetup 
          onNavigate={navigateTo}
          onBack={() => navigateTo('/choose-purpose')}
          onSignOut={handleSignOut}
        />
      )}

      {/* =========================================================================
          PAGE 2: EXPLORE PROJECTS (/explore-projects)
          ========================================================================= */}
      {routeState.view === 'explore-projects' && (
        <ExploreProjects 
          onNavigate={navigateTo}
        />
      )}

      {/* =========================================================================
          PAGE 3: PROJECT DETAILS (/project/:projectId)
          ========================================================================= */}
      {routeState.view === 'project-details' && (
        <ProjectDetails 
          projectId={routeState.projectId || 'proj-1'}
          project={routeState.project}
          onNavigate={navigateTo}
          onBack={() => navigateTo('/explore-projects')}
        />
      )}

      {/* =========================================================================
          PAGE 4: DYNAMIC COMPATIBILITY ANALYSIS (/project/:projectId/compatibility)
          ========================================================================= */}
      {routeState.view === 'compatibility' && (
        <CompatibilityAnalysis 
          projectId={routeState.projectId || 'proj-1'}
          project={routeState.project}
          onNavigate={navigateTo}
          onBack={() => navigateTo(`/project/${routeState.projectId || 'proj-1'}`)}
        />
      )}

      {/* =========================================================================
          PAGES 5 & 6: SQUAD MATRIX & COMPARISON (/project/:projectId/compare)
          ========================================================================= */}
      {routeState.view === 'compare-teams' && (
        <CompareTeams 
          projectId={routeState.projectId || 'proj-1'}
          onNavigate={navigateTo}
          onBack={() => navigateTo(`/project/${routeState.projectId || 'proj-1'}/compatibility`)}
        />
      )}

      {/* =========================================================================
          PAGES 7 & 8: RECOMMENDED TEAM & JOIN FLOW (/project/:projectId/recommended)
          ========================================================================= */}
      {routeState.view === 'recommended-team' && (
        <RecommendedTeam 
          projectId={routeState.projectId || 'proj-1'}
          teamId={routeState.teamId || 'team-1'}
          onNavigate={navigateTo}
          onBack={() => navigateTo(`/project/${routeState.projectId || 'proj-1'}/compare`)}
        />
      )}

      {/* =========================================================================
          PAGE 9: TEAM DASHBOARD & COLLABORATION HUB (/team/:teamId)
          ========================================================================= */}
      {routeState.view === 'team-dashboard' && (
        <TeamDashboard 
          projectId={routeState.projectId || 'proj-1'}
          teamId={routeState.teamId || 'team-1'}
          onNavigate={navigateTo}
        />
      )}

      {/* =========================================================================
          ADMIN: CREATE PROJECT (/admin/create-project)
          ========================================================================= */}
      {routeState.view === 'admin' && (
        <AdminCreateProject 
          currentUser={{ name: 'Admin Lead', role: 'Project Creator' }}
          onBackToHome={() => navigateTo('/')}
          onProjectCreated={(newProject) => {
            console.log('Project registered:', newProject);
            navigateTo('/explore-projects');
          }}
        />
      )}

      {/* =========================================================================
          CINEMATIC 2026 SLIDING SPLIT-SCREEN AUTHENTICATION
          ========================================================================= */}
      {routeState.view === 'auth' && (
        <TeamMatchSignInExperience 
          key={`${routeState.mode || 'signin'}-${routeState.purpose || 'join-project'}`}
          initialMode={routeState.mode || 'signin'}
          purpose={routeState.purpose || 'join-project'}
          onAuthenticated={(userData) => {
            if (routeState.purpose === 'create-project' || userData?.purpose === 'create-project') {
              navigateTo('/admin');
            } else {
              navigateTo('/profile-setup');
            }
          }}
          onBackToHome={() => navigateTo('/')}
          onBackToPurpose={() => navigateTo('/choose-purpose')}
        />
      )}

      {/* =========================================================================
          100% PRESERVED ORIGINAL LANDING PAGE (WITH ALL SECTIONS & VIDEO)
          ========================================================================= */}
      {routeState.view === 'landing' && (
        <>
          {/* USER'S CINEMATIC CORPORATE OFFICE VIDEO (PUBLIC FOLDER) */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <video
              key="user-cinematic-corporate-v1"
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover filter contrast-105 brightness-105 transition-opacity duration-1000 ${
                videoLoaded ? 'opacity-90' : 'opacity-80'
              }`}
            >
              <source src="/videos/Cinematic_K_corporate_office.mp4" type="video/mp4" />
              <source src="/videos/office-loop.mp4" type="video/mp4" />
              <source src="/videos/cinematic-demo.mp4" type="video/mp4" />
            </video>

            {/* Lightweight translucent vignette */}
            {/* Balanced Vignette: Preserves Rich Video Motion While Framing Text */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#080B12]/50 via-transparent to-[#080B12]/65 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(8,11,18,0.55)_100%)] pointer-events-none" />
            
            {/* Ambient Lighting Bleeds */}
            <div className="absolute top-12 left-1/4 w-[750px] h-[500px] bg-purple-900/15 blur-[180px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 right-12 w-[650px] h-[650px] bg-amber-500/10 blur-[190px] rounded-full pointer-events-none" />
            <div className="absolute bottom-12 left-12 w-[600px] h-[600px] bg-amber-600/10 blur-[170px] rounded-full pointer-events-none" />

            {/* Micro Grid Texture */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          {/* WEBSITE CONTENT LAYER (FULL ORIGINAL LANDING PAGE - 100% UNCHANGED) */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar onOpenAuth={(mode = 'signin', purpose = 'join-project') => handleOpenAuth(mode, purpose)} onOpenAdmin={() => navigateTo('/admin')} />
            
            <main className="flex-1">
              <Hero onOpenAuth={(mode = 'signin', purpose = 'join-project') => handleOpenAuth(mode, purpose)} />
              <TechMarquee />
              <HowItWorks />
              <BentoGrid onOpenAuth={(mode = 'signin', purpose = 'join-project') => handleOpenAuth(mode, purpose)} />
              <SquadSimulator />
              <ImpactMetrics />
              <Testimonials />
            </main>

            <Footer onOpenAuth={(mode = 'signin', purpose = 'join-project') => handleOpenAuth(mode, purpose)} />

            {/* Google Gemini AI Intelligent Copilot */}
            <GeminiChatbot onNavigate={navigateTo} />
          </div>
        </>
      )}

    </div>
  );
}

export default function App() {
  return (
    <UserProfileProvider>
      <AppContent />
    </UserProfileProvider>
  );
}
