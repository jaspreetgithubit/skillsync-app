import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import HowItWorks from './components/HowItWorks';
import BentoGrid from './components/BentoGrid';
import ProjectCompatibility from './components/ProjectCompatibility';
import ImpactMetrics from './components/ImpactMetrics';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import TeamMatchSignInExperience from './components/TeamMatchSignInExperience';
import AuthSuccessDashboard from './components/AuthSuccessDashboard';
import AdminCreateProject from './components/AdminCreateProject';

export default function App() {
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
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState('');

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

  React.useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (response) => {
        if (response.status === 401) return;
        const result = await response.json();
        if (!response.ok || !result.success || !result.data?.user) {
          throw new Error(result.error?.message || 'Could not verify the account session.');
        }
        if (active) {
          setCurrentUser(result.data.user);
          if (getInitialView() !== 'admin') {
            setSelectedPurpose(result.data.user.goalTrack || 'capstone');
            setCurrentView('dashboard');
          }
        }
      })
      .catch(() => {
        if (active) setSessionError('Account session could not be checked. Sign-in requires the API and MongoDB to be available.');
      })
      .finally(() => {
        if (active) setIsSessionReady(true);
      });
    return () => { active = false; };
  }, []);

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

  const handleOpenDashboard = () => {
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthenticated = (userData) => {
    setSessionError('');
    setCurrentUser(userData);
    setSelectedPurpose(userData.goalTrack || selectedPurpose);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    setSessionError('');
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error?.message || 'Could not end the account session. Please retry.');
      }
      setCurrentUser(null);
      setCurrentView('auth');
    } catch (error) {
      setSessionError(error.message || 'Could not end the account session. Please retry.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] antialiased overflow-x-hidden">
      {!isSessionReady ? (
        <main className="flex min-h-screen items-center justify-center text-sm text-slate-300">
          Checking your account session…
        </main>
      ) : (
      <>
      {sessionError && (
        <div role="alert" className="fixed left-4 right-4 top-4 z-[100] mx-auto max-w-2xl rounded-xl border border-rose-500/30 bg-slate-950 p-3 text-sm text-rose-200 shadow-xl">
          {sessionError}
        </div>
      )}
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
          VIEW 4: COMPLETE ORIGINAL LANDING PAGE
          ========================================================================= */}
      {currentView === 'landing' && (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background: [
                'radial-gradient(ellipse at 18% 8%, rgba(124, 58, 237, 0.16), transparent 42%)',
                'radial-gradient(ellipse at 88% 28%, rgba(245, 158, 11, 0.10), transparent 38%)',
                'linear-gradient(180deg, #0d111b 0%, #080b12 48%, #0c0a10 100%)'
              ].join(', ')
            }}
          />

          {/* =====================================================================
              WEBSITE CONTENT LAYER (FULL ORIGINAL LANDING PAGE)
              ===================================================================== */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Top Navigation Bar with Sign In / Sign Up Connected */}
            <Navbar
              onOpenAuth={handleOpenAuth}
              onOpenAdmin={handleOpenAdmin}
              currentUser={currentUser}
              onOpenDashboard={handleOpenDashboard}
              onSignOut={handleSignOut}
            />
            
            <main className="flex-1">
              {/* Landing page hero and matching overview */}
              <Hero onOpenAuth={handleOpenAuth} />

              {/* Verified Ingestion & Integrations Marquee */}
              <TechMarquee />

              {/* 4-Step Autonomous Pipeline */}
              <HowItWorks />

              {/* Core Capability Matrix (Bento Grid) */}
              <BentoGrid onOpenAuth={handleOpenAuth} />

              <section id="simulator" className="relative py-20 lg:py-28">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(124,58,237,0.12),transparent_45%),radial-gradient(ellipse_at_85%_70%,rgba(245,158,11,0.08),transparent_42%)]" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {currentUser ? (
                    <ProjectCompatibility />
                  ) : (
                    <div className="mx-auto max-w-4xl rounded-3xl border border-amber-400/25 bg-[#0b0e16]/90 p-6 text-center shadow-2xl shadow-black/30 sm:p-10">
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-300">
                        Real project and team matching
                      </div>
                      <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Match saved student profiles to real projects
                      </h2>
                      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                        Sign in to compare your saved skills with a project, or find ranked team recommendations from confirmed student profiles. Results use your project and account data, not sample profiles.
                      </p>
                      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => handleOpenAuth('signup')}
                          className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
                        >
                          Create an account to get started
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAuth('signin')}
                          className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-amber-400/50 hover:bg-white/5"
                        >
                          Sign in
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>

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
      </>
      )}

    </div>
  );
}
