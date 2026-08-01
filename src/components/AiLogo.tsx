import React from 'react';

interface AiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  darkMode?: boolean;
  showText?: boolean;
  photoUrl?: string;
  name?: string;
}

export const AiLogo: React.FC<AiLogoProps> = ({ 
  size = 'md', 
  darkMode = false,
  showText = true,
  photoUrl,
  name = 'Habib'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  }[size];

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm sm:text-base',
    lg: 'text-lg sm:text-xl'
  }[size];

  return (
    <div className="flex items-center space-x-2.5 group">
      {/* Profile Photo Emblem */}
      <div className={`relative ${sizeClasses} rounded-full p-0.5 transition-transform duration-300 group-hover:scale-105 shadow-md ${
        darkMode 
          ? 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-500 ring-1 ring-white/20' 
          : 'bg-gradient-to-tr from-[#0066cc] via-indigo-600 to-purple-500 ring-2 ring-blue-500/20'
      }`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center relative">
          {photoUrl && (
            <img 
              src={photoUrl} 
              alt={`${name} logo`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Live Signal Ping Dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-black"></span>
        </span>
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-1.5">
            <span className={`font-bold tracking-tight font-mono ${textSizeClasses} ${
              darkMode ? 'text-white' : 'text-[#1d1d1f]'
            }`}>
              {name}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-blue-500/10 text-[#0066cc] dark:text-blue-400 border border-blue-500/20 uppercase tracking-widest">
              FULL STACK
            </span>
          </div>
          <span className={`text-[9px] font-mono leading-none tracking-wide ${
            darkMode ? 'text-slate-400' : 'text-[#86868b]'
          }`}>
            RAG AI SPECIALIST & DEVOPS ENTHUSIAST
          </span>
        </div>
      )}
    </div>
  );
};
