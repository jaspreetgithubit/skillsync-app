import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Mail,
  Phone,
  User,
  MessageSquare,
  Send,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  HelpCircle,
  Copy,
  Check,
  Zap,
  Activity,
  Tag,
  Flame,
  CheckCheck
} from 'lucide-react';

// Crisp SVG Icons for Social Platforms
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const QUICK_PROBLEM_PRESETS = [
  "Need ML / PyTorch Lead for Capstone",
  "Free-Rider Dispute Resolution",
  "Hackathon 48h Teammate Search",
  "College Faculty Portal Integration"
];

export default function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    contactNo: '',
    email: '',
    role: 'Student',
    problem: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [activeField, setActiveField] = useState(null);

  // 3D Tilt for Feedback Card
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false, glareX: 50, glareY: 50 });

  // Calculate live completion progress
  const completionProgress = useMemo(() => {
    let count = 0;
    if (formData.name.trim()) count++;
    if (formData.contactNo.trim()) count++;
    if (formData.email.trim()) count++;
    if (formData.problem.trim()) count++;
    return (count / 4) * 100;
  }, [formData]);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;

    setTilt({
      x: rotateX,
      y: rotateY,
      active: true,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false, glareX: 50, glareY: 50 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTicketId(`SS-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1400);
  };

  const handlePresetClick = (preset) => {
    setFormData(prev => ({
      ...prev,
      problem: prev.problem ? `${prev.problem} • ${preset}` : preset
    }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@syncskills.ai');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2000);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      contactNo: '',
      email: '',
      role: 'Student',
      problem: ''
    });
    setIsSubmitted(false);
  };

  const socialLinks = [
    {
      name: 'Instagram',
      icon: InstagramIcon,
      href: 'https://instagram.com',
      color: 'hover:text-pink-400 hover:border-pink-500/50 hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]'
    },
    {
      name: 'LinkedIn',
      icon: LinkedinIcon,
      href: 'https://linkedin.com',
      color: 'hover:text-blue-400 hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]'
    },
    {
      name: 'Twitter / X',
      icon: TwitterIcon,
      href: 'https://twitter.com',
      color: 'hover:text-[#F59E0B] hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]'
    },
    {
      name: 'GitHub',
      icon: GithubIcon,
      href: 'https://github.com',
      color: 'hover:text-white hover:border-white/50 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]'
    },
    {
      name: 'YouTube',
      icon: YoutubeIcon,
      href: 'https://youtube.com',
      color: 'hover:text-red-400 hover:border-red-500/50 hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]'
    }
  ];

  return (
    <footer id="contact" className="border-t border-white/[0.1] bg-[#080B12]/45 backdrop-blur-xl text-slate-100 pt-20 pb-12 relative overflow-hidden">

      {/* Background Animated Ambient Glows & Drifting Particles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-64 bg-amber-500/10 blur-[160px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-purple-900/15 blur-[170px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-600/10 blur-[180px] rounded-full pointer-events-none" />

      {/* Drifting Floating Neon Particles */}
      <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-amber-400/40 blur-[1px] animate-particle-drift pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-purple-500/30 blur-[2px] animate-particle-drift pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

        {/* =========================================================================
            ROTATING CONIC NEON BORDER WRAPPER FOR FEEDBACK & INQUIRY FORM
            ========================================================================= */}
        <div className="relative rounded-3xl p-[1px] overflow-hidden group shadow-[0_25px_60px_rgba(0,0,0,0.6)]">

          {/* Continuous Rotating Conic Gradient Border */}
          <div className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,#F59E0B,#9333ea,#38bdf8,#F59E0B)] animate-conic-rotate opacity-50 blur-[3px]" />

          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: tilt.active
                ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(1.008, 1.008, 1.008)`
                : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
              transition: tilt.active ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
              transformStyle: 'preserve-3d'
            }}
            className="relative rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/20 bg-[#080B12]/85 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >

            {/* Specular Cursor Glare Effect */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl z-10"
              style={{
                background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(245, 158, 11, 0.16) 0%, transparent 60%)`,
                opacity: tilt.active ? 1 : 0
              }}
            />

            {/* Animated Holographic Laser Scan Line */}
            <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent animate-laser-scan pointer-events-none shadow-[0_0_18px_#F59E0B] z-20" />

            <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

              {/* LEFT COLUMN: BRAND INFO & LIVE TELEMETRY SUPPORT */}
              <div className="lg:col-span-5 space-y-6">

                {/* Status Pill with NLP Audio Waveform Visualizer */}
                <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 shadow-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold">24/7 NLP AI DESK ONLINE</span>

                  {/* Staggered Bouncing Waveform Bars */}
                  <div className="flex items-center space-x-0.5 h-4 ml-1">
                    <span className="w-1 bg-emerald-400 rounded-full animate-wave-1" />
                    <span className="w-1 bg-emerald-400 rounded-full animate-wave-2" />
                    <span className="w-1 bg-emerald-400 rounded-full animate-wave-3" />
                    <span className="w-1 bg-emerald-400 rounded-full animate-wave-4" />
                    <span className="w-1 bg-emerald-400 rounded-full animate-wave-5" />
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Share Your Feedback or Team Formation Queries
                </h2>

                <p className="text-slate-300 text-sm leading-relaxed font-normal">
                  Whether you are a university student dealing with free-rider disputes, a professor coordinating capstone defense, or a hackathon lead looking for members — our team is here to assist you.
                </p>

                {/* Assistance Feature Highlights with Hover Glow */}
                <div className="space-y-3 pt-2 font-normal">
                  <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-200 p-2.5 rounded-xl hover:bg-white/[0.05] transition-all hover:translate-x-1 duration-200">
                    <CheckCircle2 className="h-4 w-4 text-[#F59E0B] shrink-0 mt-0.5" />
                    <span>Personalized squad recommendations & skill gap resolution</span>
                  </div>
                  <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-200 p-2.5 rounded-xl hover:bg-white/[0.05] transition-all hover:translate-x-1 duration-200">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>College campus deployment & custom syllabus integration</span>
                  </div>
                  <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-200 p-2.5 rounded-xl hover:bg-white/[0.05] transition-all hover:translate-x-1 duration-200">
                    <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Average response time under 2 hours</span>
                  </div>
                </div>

                {/* Live Activity Ticker */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center space-x-2.5 text-xs font-mono text-slate-300">
                  <Flame className="h-4 w-4 text-[#F59E0B] animate-pulse" />
                  <span>42 inquiries resolved today • Avg Latency: 1.4s</span>
                </div>

                {/* Direct Support Card with 1-Click Copy Animation */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-[#F59E0B]/40 transition-all space-y-2 shadow-lg group/support">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold flex items-center space-x-1.5">
                      <Activity className="h-3.5 w-3.5 text-[#F59E0B]" />
                      <span>Direct Engineering Support</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">Priority Queue</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-sm sm:text-base font-mono text-white font-bold flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-[#F59E0B]" />
                      <span>support@syncskills.ai</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="p-1.5 px-3 rounded-lg bg-white/[0.06] hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center space-x-1 text-[11px] font-mono shadow-sm"
                      title="Copy Support Email"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400">
                    Department of Computer Science & NLP Research Lab
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: HIGH-TECH FEEDBACK & CONTACT FORM */}
              <div className="lg:col-span-7">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden">

                  {/* Live Form Readiness Progress Bar */}
                  {!isSubmitted && (
                    <div className="mb-5 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="flex items-center space-x-1.5">
                          <CheckCheck className="h-3.5 w-3.5 text-[#F59E0B]" />
                          <span>Form Readiness</span>
                        </span>
                        <span className={`font-bold ${completionProgress === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {completionProgress}% Complete
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-1.5 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${completionProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isSubmitted ? (
                    /* SUBMISSION SUCCESS ANIMATED STATE */
                    <div className="text-center py-10 space-y-5 animate-in fade-in zoom-in-95 duration-500">
                      <div className="relative inline-flex items-center justify-center">
                        <div className="h-20 w-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-2xl shadow-emerald-500/30">
                          <CheckCircle2 className="h-10 w-10 animate-bounce" />
                        </div>
                        <span className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-50" />
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-white">
                        Feedback Received Successfully!
                      </h3>

                      <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                        Thank you <span className="text-[#F59E0B] font-bold">{formData.name}</span>! Your problem report has been ingested into our NLP support queue. Our project mentors will reach out at <span className="text-white font-mono font-bold">{formData.contactNo}</span> shortly.
                      </p>

                      {/* Copyable Ticket ID Pill */}
                      <div className="pt-2">
                        <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-xs font-mono text-slate-300 shadow-lg">
                          <span>Ticket ID:</span>
                          <span className="text-[#F59E0B] font-bold text-sm tracking-wider">{ticketId}</span>
                          <button
                            type="button"
                            onClick={handleCopyTicket}
                            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy Ticket ID"
                          >
                            {copiedTicket ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleReset}
                          className="px-6 py-2.5 rounded-xl btn-amber-gold text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                        >
                          Submit Another Query
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* INTERACTIVE ANIMATED FORM */
                    <form onSubmit={handleSubmit} className="space-y-4">

                      {/* Header bar with pulsing icon */}
                      <div className="border-b border-white/10 pb-3 mb-4 flex items-center justify-between">
                        <div>
                          <div className="text-base font-bold text-white flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4 text-[#F59E0B]" />
                            <span>Send Feedback or Report a Problem</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Fill in your details so our team formation leads can resolve your issue.
                          </p>
                        </div>
                        <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[#F59E0B] text-[10px] font-mono">
                          <Zap className="h-3 w-3 animate-pulse" />
                          <span>Live Dispatch</span>
                        </span>
                      </div>

                      {/* Full Name & Contact Number (Row 1) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Name Field */}
                        <div>
                          <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                            Full Name <span className="text-[#F59E0B]">*</span>
                          </label>
                          <div className={`relative transition-all duration-300 rounded-xl ${activeField === 'name' ? 'ring-2 ring-[#F59E0B]/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : ''}`}>
                            <User className={`h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${activeField === 'name' ? 'text-[#F59E0B]' : 'text-slate-400'}`} />
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onFocus={() => setActiveField('name')}
                              onBlur={() => setActiveField(null)}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="e.g. Jaspreet Singh"
                              className="w-full bg-white/[0.04] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B] transition-all"
                            />
                          </div>
                        </div>

                        {/* Contact Number Field */}
                        <div>
                          <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                            Contact No <span className="text-[#F59E0B]">*</span>
                          </label>
                          <div className={`relative transition-all duration-300 rounded-xl ${activeField === 'phone' ? 'ring-2 ring-[#F59E0B]/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : ''}`}>
                            <Phone className={`h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${activeField === 'phone' ? 'text-[#F59E0B]' : 'text-slate-400'}`} />
                            <input
                              type="tel"
                              required
                              value={formData.contactNo}
                              onFocus={() => setActiveField('phone')}
                              onBlur={() => setActiveField(null)}
                              onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                              placeholder="+91 98765 43210"
                              className="w-full bg-white/[0.04] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B] transition-all"
                            />
                          </div>
                        </div>

                      </div>

                      {/* Email & Role Selection (Row 2) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Email Field */}
                        <div>
                          <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                            Email Address <span className="text-[#F59E0B]">*</span>
                          </label>
                          <div className={`relative transition-all duration-300 rounded-xl ${activeField === 'email' ? 'ring-2 ring-[#F59E0B]/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : ''}`}>
                            <Mail className={`h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${activeField === 'email' ? 'text-[#F59E0B]' : 'text-slate-400'}`} />
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onFocus={() => setActiveField('email')}
                              onBlur={() => setActiveField(null)}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="student@university.edu"
                              className="w-full bg-white/[0.04] border border-white/15 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B] transition-all"
                            />
                          </div>
                        </div>

                        {/* Role Dropdown */}
                        <div>
                          <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                            You Are A <span className="text-[#F59E0B]">*</span>
                          </label>
                          <div className={`transition-all duration-300 rounded-xl ${activeField === 'role' ? 'ring-2 ring-[#F59E0B]/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : ''}`}>
                            <select
                              value={formData.role}
                              onFocus={() => setActiveField('role')}
                              onBlur={() => setActiveField(null)}
                              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                              className="w-full bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#F59E0B] transition-all cursor-pointer"
                            >
                              <option value="Student">Student (Capstone / Project)</option>
                              <option value="Faculty Mentor">Faculty Mentor / Project Coordinator</option>
                              <option value="Hackathon Lead">Hackathon Participant / Lead</option>
                              <option value="Corporate Leader">Corporate Agile Leader / HR</option>
                            </select>
                          </div>
                        </div>

                      </div>

                      {/* Quick Select Issue Presets (Click to Populate with Bounce) */}
                      <div>
                        <div className="text-[10.5px] font-mono text-slate-400 mb-1.5 flex items-center space-x-1.5">
                          <Tag className="h-3 w-3 text-[#F59E0B]" />
                          <span>Quick Issue Tags (Click to insert):</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_PROBLEM_PRESETS.map((preset, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => handlePresetClick(preset)}
                              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/40 text-[10px] font-mono text-amber-200 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
                            >
                              + {preset}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Problem / Feedback Message Field */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-mono text-slate-300 font-semibold">
                            Describe Your Problem or Feedback <span className="text-[#F59E0B]">*</span>
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">
                            {formData.problem.length} chars
                          </span>
                        </div>

                        <div className={`transition-all duration-300 rounded-xl ${activeField === 'problem' ? 'ring-2 ring-[#F59E0B]/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : ''}`}>
                          <textarea
                            required
                            rows={3}
                            value={formData.problem}
                            onFocus={() => setActiveField('problem')}
                            onBlur={() => setActiveField(null)}
                            onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                            placeholder="e.g. In our capstone group, we need an ML engineer who knows PyTorch, but everyone in my class only knows frontend. How can the AI help pair us with the right student?"
                            className="w-full bg-white/[0.04] border border-white/15 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B] transition-all resize-none"
                          />
                        </div>
                      </div>

                      {/* Animated High-Tech Submit Button with Shimmer Sweep */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 px-6 rounded-xl btn-amber-gold text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/25 cursor-pointer disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99] transition-all group/btn relative overflow-hidden"
                        >
                          {/* Shimmering Diagonal Light Beam */}
                          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-light-sweep pointer-events-none" />

                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 border-2 border-[#080B12] border-t-transparent rounded-full animate-spin" />
                              <span>Transmitting Query to Support Queue...</span>
                            </>
                          ) : (
                            <>
                              <span>Submit Feedback & Request Assistance</span>
                              <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                            </>
                          )}
                        </button>
                      </div>

                    </form>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* =========================================================================
            PROFESSIONAL FOOTER NAVIGATION COLUMNS
            ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs border-b border-white/[0.08] pb-12">
          <div>
            <span className="font-mono text-[#F59E0B] uppercase tracking-wider font-bold block mb-3.5">
              For Students
            </span>
            <ul className="space-y-2.5 text-slate-300">
              <li><a href="#simulator" className="hover:text-[#F59E0B] transition-colors">Create Verified Profile</a></li>
              <li><a href="#simulator" className="hover:text-[#F59E0B] transition-colors">Add Skills & Experience</a></li>
              <li><a href="#simulator" className="hover:text-[#F59E0B] transition-colors">Select Preferred Sprint Roles</a></li>
              <li><a href="#simulator" className="hover:text-[#F59E0B] transition-colors">Inspect Team Match Scores</a></li>
            </ul>
          </div>

          <div>
            <span className="font-mono text-[#F59E0B] uppercase tracking-wider font-bold block mb-3.5">
              For Faculty & Mentors
            </span>
            <ul className="space-y-2.5 text-slate-300">
              <li><a href="#how-it-works" className="hover:text-[#F59E0B] transition-colors">Submit Capstone Project Title</a></li>
              <li><a href="#how-it-works" className="hover:text-[#F59E0B] transition-colors">NLP Stack Extraction Engine</a></li>
              <li><a href="#how-it-works" className="hover:text-[#F59E0B] transition-colors">Balanced Workload Matrix</a></li>
              <li><a href="#how-it-works" className="hover:text-[#F59E0B] transition-colors">Department Capstone Portal</a></li>
            </ul>
          </div>

          <div>
            <span className="font-mono text-[#F59E0B] uppercase tracking-wider font-bold block mb-3.5">
              Supported Tracks
            </span>
            <ul className="space-y-2.5 text-slate-300">
              <li><a href="#use-cases" className="hover:text-[#F59E0B] transition-colors">University Capstone Labs</a></li>
              <li><a href="#use-cases" className="hover:text-[#F59E0B] transition-colors">48-Hour Competitive Hackathons</a></li>
              <li><a href="#use-cases" className="hover:text-[#F59E0B] transition-colors">Corporate Agile Engineering Pods</a></li>
              <li><a href="#use-cases" className="hover:text-[#F59E0B] transition-colors">Interdisciplinary AI Research</a></li>
            </ul>
          </div>

          <div>
            <span className="font-mono text-[#F59E0B] uppercase tracking-wider font-bold block mb-3.5">
              NLP Architecture
            </span>
            <ul className="space-y-2.5 text-slate-300">
              <li><a href="#how-it-works" className="hover:text-[#F59E0B] transition-colors">Transformer Latent Vectors</a></li>
              <li><a href="#how-it-works" className="hover:text-[#F59E0B] transition-colors">Cosine Similarity Matcher</a></li>
              <li><a href="#how-it-works" className="hover:text-[#F59E0B] transition-colors">Zero Free-Rider Assurance</a></li>
              <li><a href="#how-it-works" className="hover:text-[#F59E0B] transition-colors">Student Privacy & Data Terms</a></li>
            </ul>
          </div>
        </div>

        {/* =========================================================================
            DEDICATED SOCIAL MEDIA LINE / ROW (WITH FLOATING MAGNETIC HOVER GLOWS)
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">

          {/* Brand Tagline */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Sparkles className="h-4 w-4 text-[#F59E0B] animate-pulse" />
            </div>
            <div>
              <span className="text-base font-black text-white tracking-tight">
                SyncSkills<span className="text-[#F59E0B]">.AI</span>
              </span>
              <span className="text-xs text-slate-400 ml-2">
                • Connect with our engineering community
              </span>
            </div>
          </div>

          {/* SOCIAL MEDIA ICONS ROW (HIGH-TECH HOVER LIFT & NEON BRAND GLOWS) */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-slate-400 hidden md:inline">
              Follow Us:
            </span>
            {socialLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className={`h-10 w-10 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/15 flex items-center justify-center text-slate-300 transition-all duration-300 hover:-translate-y-1.5 hover:scale-110 cursor-pointer shadow-md ${item.color}`}
                  title={item.name}
                >
                  <Icon />
                </a>
              );
            })}
          </div>

        </div>

        {/* =========================================================================
            BOTTOM LEGAL & SYSTEM STATUS BAR
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © 2026 SyncSkills.AI — AI-Based Project Team Formation & Skill Matching System. All rights reserved.
          </div>

          <div className="flex items-center space-x-4 text-[11px] font-mono">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>NLP Matching Core v2.4 (Live)</span>
            </span>
            <span>•</span>
            <span className="text-slate-400">Zero-Bias Protocol</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
