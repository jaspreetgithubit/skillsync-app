import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Zap
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import AIGraphicCanvas from './AIGraphicCanvas';



const ROLES = [
  'Full Stack Developer',
  'AI / ML Researcher',
  'UI / UX Designer',
  'Backend & Cloud Lead',
  'Sprint Lead & PM',
  'Data & NLP Engineer'
];

export default function TeamMatchSignInExperience({
  onAuthenticated,
  onBackToHome,
  initialMode = 'signin',
  purpose = 'join-project'
}) {
  const { updateProfile } = useUserProfile();

  const [mode, setMode] = useState(initialMode || 'signin'); // 'signin' | 'signup'

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [error, setError] = useState('');

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('alex.chen@university.edu');
  const [signInPassword, setSignInPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Create Account Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState('Full Stack Developer');

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX / window.innerWidth) * 2 - 1,
      y: (clientY / window.innerHeight) * 2 - 1
    });
  };

  const isCreatorTrack = purpose === 'create-project';

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    submitSignIn('alex.rivera@university.edu');
  };

  // Handle Quick Demo Login
  const handleQuickDemo = () => {
    setSignInEmail('alex.chen@university.edu');
    setSignInPassword('password123');
    submitSignIn('alex.chen@university.edu');
  };

  // Submit Sign In
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!signInEmail.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!signInPassword) {
      setError('Please enter your password.');
      return;
    }
    submitSignIn(signInEmail);
  };

  const submitSignIn = (email) => {
    setError('');
    setIsSubmitting(true);

    const resolvedName = email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
    updateProfile({
      name: resolvedName || 'Alex Chen',
      email: email,
      role: isCreatorTrack ? 'Project Creator' : 'Full Stack Developer'
    });

    setTimeout(() => {
      setIsSubmitting(false);
      if (onAuthenticated) {
        onAuthenticated({
          name: resolvedName || 'Alex Chen',
          email: email,
          role: isCreatorTrack ? 'Project Creator' : 'Full Stack Developer',
          purpose
        });
      }
    }, 600);
  };

  // Submit Create Account
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!signUpName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setError('Please enter a valid institutional or work email.');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    updateProfile({
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      role: signUpRole
    });

    setTimeout(() => {
      setIsSubmitting(false);
      if (onAuthenticated) {
        onAuthenticated({
          name: signUpName.trim(),
          email: signUpEmail.trim(),
          role: signUpRole,
          purpose
        });
      }
    }, 600);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative h-screen max-h-screen bg-[#080B12] text-slate-100 font-sans selection:bg-[#F59E0B] selection:text-[#080B12] flex flex-col justify-between overflow-hidden"
    >
      {/* =========================================================================
          BACKGROUND LAYERS
          ========================================================================= */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 20}% ${30 + mousePos.y * 20}%, rgba(245, 158, 11, 0.10) 0%, rgba(124, 58, 237, 0.05) 45%, #080B12 85%)`
        }}
      />

      {/* Ambient Neural Particle Canvas (Subtle background, opacity-40) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <AIGraphicCanvas stage={6} mousePos={mousePos} accentColor="#F59E0B" />
      </div>

      {/* Grid Pattern Texture */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Cursor Ambient Warm Amber Light */}
      <div 
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none blur-[150px] opacity-15 transition-transform duration-300 ease-out hidden md:block z-0"
        style={{
          backgroundColor: '#F59E0B',
          transform: `translate(${mousePos.x * 180 + (typeof window !== 'undefined' ? window.innerWidth / 2 - 250 : 0)}px, ${mousePos.y * 180 + (typeof window !== 'undefined' ? window.innerHeight / 2 - 250 : 0)}px)`
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-1 sm:pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-400 hover:text-white px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Back to Home</span>
          </button>

          <span className="text-white/20 hidden sm:inline">|</span>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">TeamMatch AI</span>
            <span className="text-[#F59E0B]">· {isCreatorTrack ? 'Project Creator Mode' : 'Candidate Track'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="text-xs font-mono text-slate-400 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all cursor-pointer"
        >
          Exit to Home
        </button>
      </header>

      {/* Main Workspace Split Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex-1 flex items-center justify-center min-h-0">
        <div className="relative w-full rounded-3xl bg-[#0B0F19]/90 border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden flex flex-col lg:flex-row max-h-[84vh] max-w-5xl">
          
          {/* =========================================================================
              SLIDING CINEMATIC 4K VIDEO DOOR (DESKTOP)
              Slides Left/Right dynamically depending on mode
              When mode === 'signin': Video is on the LEFT (0%) -> Form is on the RIGHT
              When mode === 'signup': Video slides to the RIGHT (100%) -> Form is on the LEFT
              ========================================================================= */}
          <div
            className={`hidden lg:block absolute top-0 bottom-0 w-1/2 z-20 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mode === 'signin'
                ? 'left-0 rounded-r-3xl border-r border-white/20'
                : 'left-1/2 rounded-l-3xl border-l border-white/20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]'
            }`}
          >
            {/* The Real 4K Video Background */}
            <video
              ref={videoRef}
              key="auth-cinematic-video"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover filter contrast-110 brightness-95"
            >
              <source src="/videos/A_cinematic_medium_wide_tracki.mp4" type="video/mp4" />
              <source src="/videos/Option_Active_Morning_Colla.mp4" type="video/mp4" />
            </video>

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-[#080B12]/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-60" />

            {/* Video Interior Content */}
            <div className="relative h-full flex flex-col justify-between p-5 sm:p-7 select-none">
              
              {/* Top Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#080B12]/80 border border-amber-500/30 text-[#F59E0B] text-[11px] font-mono uppercase tracking-wider backdrop-blur-md shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-bold">TeamMatch AI · Autonomous Pod Assembly</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/40 font-bold">
                  ● Realtime Sync
                </span>
              </div>

              {/* Center Dynamic Visual Messaging */}
              <div className="space-y-3 max-w-md">
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
                  {mode === 'signin' ? '// RETURN TO WORKSPACE' : '// JOIN THE TALENT MATRIX'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                  {mode === 'signin' ? (
                    <>
                      Form The Perfect{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-[#F59E0B] to-amber-500">
                        Project Team
                      </span>
                    </>
                  ) : (
                    <>
                      Unlock Next-Gen{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-[#F59E0B] to-amber-500">
                        Squad Synergy
                      </span>
                    </>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {mode === 'signin'
                    ? 'Access your matched project teams, inspect candidate compatibility vectors, and review live milestone velocity.'
                    : 'Bipartite Hungarian algorithmic allocation matches your exact skills with open engineering slots in seconds.'}
                </p>
              </div>

              {/* Bottom Telemetry Card */}
              <div className="p-4 rounded-2xl bg-[#080B12]/85 border border-white/10 backdrop-blur-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Hungarian Optimization</div>
                  <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <span className="text-amber-400 font-mono">98.4%</span>
                    <span className="text-slate-400 text-xs font-normal">Matching Accuracy</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Track Mode</div>
                  <div className="text-xs font-mono text-amber-300 font-bold mt-0.5">
                    {isCreatorTrack ? 'Admin / Project Lead' : 'Engineering Candidate'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              MOBILE VIDEO BANNER (Hidden on Desktop)
              ========================================================================= */}
          <div className="lg:hidden relative h-48 w-full overflow-hidden border-b border-white/10">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover filter contrast-115 brightness-95"
            >
              <source src="/videos/A_cinematic_medium_wide_tracki.mp4" type="video/mp4" />
              <source src="/videos/Option_Active_Morning_Colla.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-black/40" />
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-[#080B12]/80 border border-amber-500/30 text-[#F59E0B] text-[10px] font-mono font-bold uppercase">
                ✦ SyncSkills AI
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                Live Video
              </span>
            </div>
          </div>

          {/* =========================================================================
              LEFT COLUMN: CREATE ACCOUNT FORM
              ========================================================================= */}
          <div 
            className={`w-full lg:w-1/2 p-4 sm:p-6 lg:p-7 flex flex-col justify-center overflow-y-auto transition-all duration-500 ${
              mode === 'signup'
                ? 'opacity-100 pointer-events-auto z-10'
                : 'lg:opacity-0 lg:pointer-events-none lg:translate-x-4 hidden lg:flex'
            }`}
          >
            <div className="space-y-5 max-w-md mx-auto w-full">
              {/* Form Heading */}
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1.5">
                  <User className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Registration // New Account</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Sign Up
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {isCreatorTrack 
                    ? 'Register to publish projects, review applicants, and coordinate delivery.'
                    : 'Set up your candidate credentials to discover projects and join balanced squads.'}
                </p>
              </div>

              {error && mode === 'signup' && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full py-3.5 px-5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/15 hover:border-amber-500/50 text-white text-sm font-mono font-bold flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 shadow-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] font-mono text-slate-500 uppercase">Or with email</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-white/[0.03] border border-white/10 focus:border-amber-500 focus:bg-white/[0.06] text-white text-xs sm:text-sm outline-none transition-all placeholder:text-slate-600"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                    Institutional / Work Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="alex.rivera@tech.edu"
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-white/[0.03] border border-white/10 focus:border-amber-500 focus:bg-white/[0.06] text-white text-xs sm:text-sm outline-none transition-all placeholder:text-slate-600"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 pl-9 pr-9 rounded-xl bg-white/[0.03] border border-white/10 focus:border-amber-500 focus:bg-white/[0.06] text-white text-xs sm:text-sm outline-none transition-all placeholder:text-slate-600"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Preferred Role Chips */}
                <div className="space-y-1 pt-0.5">
                  <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                    Target Primary Role
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSignUpRole(role)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          signUpRole === role
                            ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#080B12] font-black shadow-sm'
                            : 'bg-white/[0.03] hover:bg-white/[0.07] text-slate-400 border border-white/10'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="pt-2 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl btn-amber-gold uppercase tracking-wider flex items-center justify-center gap-2.5 text-sm sm:text-base font-black shadow-2xl shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-75 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-[#080B12] border-t-transparent animate-spin" />
                        <span>Creating Profile...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign Up & Continue</span>
                        <ArrowRight className="w-4 h-4 text-[#080B12]" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Switch to Sign In link */}
              <div className="text-center pt-2 border-t border-white/[0.06]">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError('');
                    }}
                    className="text-[#F59E0B] hover:text-amber-300 font-bold ml-1 cursor-pointer transition-colors"
                  >
                    Sign In →
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: SIGN IN FORM
              ========================================================================= */}
          <div 
            className={`w-full lg:w-1/2 p-6 sm:p-12 flex flex-col justify-center transition-all duration-500 ${
              mode === 'signin'
                ? 'opacity-100 pointer-events-auto z-10'
                : 'lg:opacity-0 lg:pointer-events-none lg:-translate-x-4 hidden lg:flex'
            }`}
          >
            <div className="space-y-5 max-w-md mx-auto w-full">
              {/* Form Heading */}
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Secure Authentication // Workspace Login</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {isCreatorTrack 
                    ? 'Sign in to access your Project Creation console & manage team rosters.'
                    : 'Sign in to review compatible projects and collaborate with your squad.'}
                </p>
              </div>

              {error && mode === 'signin' && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full py-3.5 px-5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/15 hover:border-amber-500/50 text-white text-sm font-mono font-bold flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 shadow-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] font-mono text-slate-500 uppercase">Or with email</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                    Institutional / Work Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="alex.chen@university.edu"
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-white/[0.03] border border-white/10 focus:border-amber-500 focus:bg-white/[0.06] text-white text-xs sm:text-sm outline-none transition-all placeholder:text-slate-600"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset link dispatched to your email address.')}
                      className="text-[10px] font-mono text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 pl-9 pr-9 rounded-xl bg-white/[0.03] border border-white/10 focus:border-amber-500 focus:bg-white/[0.06] text-white text-xs sm:text-sm outline-none transition-all placeholder:text-slate-600"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox & Quick Demo Action */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-[#F59E0B] cursor-pointer"
                    />
                    <span>Remember this device</span>
                  </label>

                  {/* 1-Click Demo Fill Action */}
                  <button
                    type="button"
                    onClick={handleQuickDemo}
                    className="text-[10px] font-mono text-amber-400/90 hover:text-amber-300 cursor-pointer flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
                  >
                    <Zap className="w-3 h-3 text-[#F59E0B]" />
                    <span>⚡ Quick Demo Login</span>
                  </button>
                </div>

                {/* Submit CTA */}
                <div className="pt-3 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl btn-amber-gold uppercase tracking-wider flex items-center justify-center gap-2.5 text-sm sm:text-base font-black shadow-2xl shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-75 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-[#080B12] border-t-transparent animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In & Continue</span>
                        <ArrowRight className="w-4 h-4 text-[#080B12]" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Switch to Create Account link */}
              <div className="text-center pt-2 border-t border-white/[0.06]">
                <p className="text-xs text-slate-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError('');
                    }}
                    className="text-[#F59E0B] hover:text-amber-300 font-bold ml-1 cursor-pointer transition-colors"
                  >
                    Sign Up / Create Account →
                  </button>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-2 text-center text-[10px] sm:text-xs font-mono text-slate-500">
        <span>SyncSkills AI Engineering Engine · Encrypted SSL Authentication · Zero Data Leakage</span>
      </footer>

          </div>
  );
}
