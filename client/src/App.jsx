import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import HowItWorks from './components/HowItWorks';
import BentoGrid from './components/BentoGrid';
import SquadSimulator from './components/SquadSimulator';
import ImpactMetrics from './components/ImpactMetrics';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import TeamMatchSignInExperience from './components/TeamMatchSignInExperience';
import AuthSuccessDashboard from './components/AuthSuccessDashboard';
import AdminCreateProject from './components/AdminCreateProject';

export default function App() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Read initial view from URL query param (?page=admin or ?type=...)
  const getInitialView = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('page') === 'admin' || params.get('admin') === 'true') {
        return 'admin';
      }
      if (params.get('type') || params.get('purpose')) {
        return 'auth';
      }
    } catch (e) {}
    return 'landing';
  };

  // Navigation & Authentication View State: 'landing' | 'auth' | 'dashboard' | 'admin'
  const [currentView, setCurrentView] = useState(getInitialView());
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [currentUser, setCurrentUser] = useState(null);

  // Read initial purpose from URL query param if present (e.g. ?type=company or ?type=college)
  const getInitialPurpose = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const type = params.get('type') || params.get('purpose');
      if (type && ['company', 'college', 'capstone', 'hackathon'].includes(type.toLowerCase())) {
        return type.toLowerCase();
      }
    } catch (e) {}
    return 'capstone';
  };

  const [selectedPurpose, setSelectedPurpose] = useState(getInitialPurpose());

  // Listen for browser navigation changes
  React.useEffect(() => {
    const handlePopState = () => {
      const p = getInitialPurpose();
      if (p) setSelectedPurpose(p);
      const v = getInitialView();
      setCurrentView(v);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Triggered when user clicks Login, Sign In, or Purpose Cards from the Home page:
  const handleOpenAuth = (mode = 'signin', purpose = null) => {
    setAuthMode(mode);
    const resolvedPurpose = purpose || selectedPurpose || 'capstone';
    setSelectedPurpose(resolvedPurpose);

    // Update URL query parameters cleanly
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('type', resolvedPurpose);
      window.history.pushState({}, '', url);
    } catch (e) {}

    setCurrentView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('page', 'admin');
      window.history.pushState({}, '', url);
    } catch (e) {}

    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('type');
      url.searchParams.delete('purpose');
      url.searchParams.delete('page');
      url.searchParams.delete('admin');
      window.history.pushState({}, '', url);
    } catch (e) {}

    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthenticated = (userData) => {
    setCurrentUser(userData);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentView('auth');
  };

  return (
    <div className="relative min-h-screen bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] antialiased overflow-x-hidden">
      
      {/* =========================================================================
          VIEW 0: ADMIN "CREATE PROJECT" CONFIGURATION EXPERIENCE
          ========================================================================= */}
      {currentView === 'admin' && (
        <AdminCreateProject 
          onBackToHome={handleBackToLanding}
          onProjectCreated={(newProject) => {
            console.log('Project registered in SyncSkills.AI Engine:', newProject);
          }}
        />
      )}

      {/* =========================================================================
          VIEW 1: CINEMATIC SCROLL-DRIVEN SIGN IN EXPERIENCE (SYNCSKILLS.AI)
          "Welcome Back → Scroll → Image 01 → Image 02 → Image 03 → Image 04 → Image 05 → Purpose Cards → Purpose-Specific Sign In"
          ========================================================================= */}
      {currentView === 'auth' && (
        <TeamMatchSignInExperience 
          initialMode={authMode}
          initialPurpose={selectedPurpose}
          onPurposeChange={(newPurpose) => {
            setSelectedPurpose(newPurpose);
            try {
              const url = new URL(window.location.href);
              url.searchParams.set('type', newPurpose);
              window.history.pushState({}, '', url);
            } catch (e) {}
          }}
          onAuthenticated={handleAuthenticated}
          onBackToHome={handleBackToLanding}
        />
      )}

      {/* =========================================================================
          VIEW 3: AUTHENTICATED ACTIVE AI MATCHING DASHBOARD
          ========================================================================= */}
      {currentView === 'dashboard' && (
        <AuthSuccessDashboard 
          user={currentUser}
          onSignOut={handleSignOut}
          onBackToHome={handleBackToLanding}
        />
      )}

      {/* =========================================================================
          VIEW 4: COMPLETE ORIGINAL LANDING PAGE (WITH ALL SECTIONS & VIDEO)
          ========================================================================= */}
      {currentView === 'landing' && (
        <>
          {/* =====================================================================
              USER'S CINEMATIC CORPORATE OFFICE VIDEO (PUBLIC FOLDER)
              PRESERVED IN FULL-SCREEN LOOPING GLORY ACROSS THE ENTIRE WEBSITE
              ===================================================================== */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <video
              key="user-cinematic-corporate-v1"
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover filter contrast-105 brightness-105 transition-opacity duration-1000 ${
                videoLoaded ? 'opacity-100' : 'opacity-70'
              }`}
            >
              <source src="/videos/Cinematic_K_corporate_office.mp4" type="video/mp4" />
              <source src="/videos/office-loop.mp4" type="video/mp4" />
              <source src="/videos/cinematic-demo.mp4" type="video/mp4" />
            </video>

            {/* Lightweight translucent vignette: allows video motion to shine */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 pointer-events-none" />
            
            {/* Ambient Warm Amber & Soft Violet Bleeds Harmonized with the Video Lighting */}
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

          {/* =====================================================================
              WEBSITE CONTENT LAYER (FULL ORIGINAL LANDING PAGE)
              ===================================================================== */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Top Navigation Bar with Sign In / Sign Up Connected */}
            <Navbar onOpenAuth={handleOpenAuth} onOpenAdmin={handleOpenAdmin} />
            
            <main className="flex-1">
              {/* Hero Section with Live Squad Formation Visualizer */}
              <Hero onOpenAuth={handleOpenAuth} />

              {/* Verified Ingestion & Integrations Marquee */}
              <TechMarquee />

              {/* 4-Step Autonomous Pipeline */}
              <HowItWorks />

              {/* Core Capability Matrix (Bento Grid) */}
              <BentoGrid onOpenAuth={handleOpenAuth} />

              {/* Interactive Live Squad Simulator */}
              <SquadSimulator />

              {/* Measurable Results & Impact Metrics */}
              <ImpactMetrics />

              {/* Student Leads & Faculty Testimonials */}
              <Testimonials />
            </main>

            {/* Parallax High-Impact Animated Footer */}
            <Footer onOpenAuth={handleOpenAuth} />
          </div>
        </>
      )}

    </div>
  );
}
