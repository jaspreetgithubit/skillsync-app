import React from 'react';

/**
 * FloatingBadge Component
 * Implements high-tech floating element for Hero and Showcase sections.
 * Features gentle sine-wave levitation, frosted glass, amber/yellow glow accents.
 */
export default function FloatingBadge({
  icon: Icon,
  title,
  subtitle,
  badgeText = null,
  badgeColor = 'amber', // 'amber' | 'emerald' | 'cyan' | 'purple'
  className = '',
  animationClass = 'animate-float-slow',
  style = {}
}) {
  const colorMap = {
    amber: 'bg-amber-500/20 border-amber-400/40 text-amber-300',
    emerald: 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300',
    cyan: 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300',
    purple: 'bg-purple-500/20 border-purple-400/40 text-purple-300',
  };

  return (
    <div
      style={style}
      className={`hidden lg:flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.6)] pointer-events-none select-none z-20 ${animationClass} ${className}`}
    >
      {Icon && (
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[#F59E0B] shadow-inner shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className="text-left">
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono font-bold text-white tracking-wide">
            {title}
          </p>
          {badgeText && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${colorMap[badgeColor] || colorMap.amber}`}>
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] font-sans text-slate-300 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

