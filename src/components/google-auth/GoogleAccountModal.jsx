import { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Check, 
  Lock
} from 'lucide-react';
import { DEMO_GOOGLE_ACCOUNTS } from './googleAuthService';

export default function GoogleAccountModal({ isOpen, onClose, onAccountSelected }) {
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (account) => {
    setSelectedAccount(account);
    setIsAuthorizing(true);

    setTimeout(() => {
      onAccountSelected({
        name: account.name,
        email: account.email,
        avatar: account.avatar || '/images/avatars/aditya.jpg',
        role: account.role || 'Full Stack Developer',
        provider: 'google',
        authenticatedAt: new Date().toLocaleTimeString()
      });
      setIsAuthorizing(false);
      onClose();
    }, 900);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) return;
    const namePart = customEmail.split('@')[0];
    const formattedName = namePart
      .split(/[._-]/)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

    handleSelect({
      name: formattedName || 'Google User',
      email: customEmail.trim(),
      avatar: '/images/avatars/aditya.jpg',
      role: 'Full Stack Developer'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0F1420] border border-white/15 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden text-slate-100"
      >
        {/* Top Google Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google Brand SVG */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Sign in with Google</h2>
              <p className="text-xs text-slate-400">Choose an account to continue to <span className="text-amber-400 font-semibold">SyncSkills.AI</span></p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {isAuthorizing ? (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="relative inline-flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-amber-400 opacity-75" />
                <div className="relative h-12 w-12 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                  <Check className="w-6 h-6 text-[#F59E0B]" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Authorizing with Google...</p>
                <p className="text-xs font-mono text-amber-300 mt-1">{selectedAccount?.email}</p>
                <p className="text-[11px] text-slate-400 mt-2">Connecting to SyncSkills Project Workspace</p>
              </div>
            </div>
          ) : (
            <>
              {/* Accounts List */}
              <div className="space-y-2">
                {DEMO_GOOGLE_ACCOUNTS.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(acc)}
                    className="w-full p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-amber-500/40 text-left transition-all duration-200 cursor-pointer flex items-center gap-3 group"
                  >
                    <img 
                      src={acc.avatar} 
                      alt={acc.name} 
                      className="w-10 h-10 rounded-full object-cover border border-white/20 group-hover:border-amber-500/60"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                        {acc.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate">
                        {acc.email}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-slate-400 group-hover:text-white">
                      Select
                    </span>
                  </button>
                ))}
              </div>

              {/* Use Another Account Toggle */}
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-dashed border-white/15 hover:border-amber-500/40 text-xs font-mono text-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Use another Google account</span>
                </button>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-2 pt-1 animate-fade-in">
                  <div className="text-[11px] font-mono text-slate-400">Enter your Google email:</div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="flex-1 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/15 focus:border-[#F59E0B] text-white text-xs font-mono outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-[#F59E0B] text-[#080B12] text-xs font-mono font-bold hover:bg-[#F59E0B]/90 transition-all cursor-pointer"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Privacy & Environment Note */}
          <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>OAuth 2.0 Encrypted</span>
            </span>
            <span className="text-slate-500">
              SyncSkills Identity Provider
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
