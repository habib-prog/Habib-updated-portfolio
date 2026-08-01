import React from 'react';
import { SectionId } from '../types';
import { AiLogo } from './AiLogo';
import { useSite } from '../context/SiteContext';
import { Github, Linkedin, Twitter } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: SectionId | 'admin') => void;
  darkMode?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, darkMode = false }) => {
  const { profile, footerConfig } = useSite();

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'degraded':
        return {
          text: 'text-amber-500 dark:text-amber-400',
          dot: 'bg-amber-500'
        };
      case 'maintenance':
        return {
          text: 'text-rose-500 dark:text-rose-400',
          dot: 'bg-rose-500'
        };
      case 'operational':
      default:
        return {
          text: 'text-emerald-600 dark:text-emerald-400',
          dot: 'bg-emerald-500'
        };
    }
  };

  const statusStyle = getStatusColor(footerConfig.systemStatusState);

  return (
    <footer className={`py-16 border-t text-xs font-sans transition-colors duration-300 ${
      darkMode ? 'bg-[#0b0c0e] text-slate-400 border-white/10' : 'bg-[#f5f5f7] text-[#86868b] border-gray-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-3">
              <button onClick={() => onNavigate('overview')} className="text-left focus:outline-none">
                <AiLogo
                  size="sm"
                  darkMode={darkMode}
                  showText={true}
                  photoUrl={footerConfig.footerPhotoUrl || profile.photoUrl}
                  name={profile.name}
                />
              </button>
            </div>
            <p className={`leading-relaxed text-[11px] ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
              {footerConfig.tagline}
            </p>

            {/* Social Links Row */}
            <div className="flex items-center space-x-2 pt-1">
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2 rounded-lg border transition-all ${
                    darkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-blue-500/50' : 'bg-white border-gray-200 text-gray-700 hover:text-blue-600'
                  }`}
                  aria-label="LinkedIn"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2 rounded-lg border transition-all ${
                    darkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white' : 'bg-white border-gray-200 text-gray-700 hover:text-black'
                  }`}
                  aria-label="GitHub"
                  title="GitHub Profile"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.mediumUrl && (
                <a
                  href={profile.mediumUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2 rounded-lg border transition-all ${
                    darkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/50' : 'bg-white border-gray-200 text-gray-700 hover:text-emerald-700'
                  }`}
                  aria-label="Medium"
                  title="Medium Profile"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                  </svg>
                </a>
              )}
              {profile.twitterUrl && (
                <a
                  href={profile.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2 rounded-lg border transition-all ${
                    darkMode ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white' : 'bg-white border-gray-200 text-gray-700 hover:text-sky-500'
                  }`}
                  aria-label="Twitter"
                  title="Twitter / X Profile"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Nav */}
          {footerConfig.showNavLinks && (
            <div className="space-y-2">
              <p className={`text-xs font-mono font-semibold uppercase tracking-wider ${
                darkMode ? 'text-slate-200' : 'text-[#1d1d1f]'
              }`}>Navigation</p>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => onNavigate('overview')} className="hover:text-[#0066cc] transition-colors">Overview</button></li>
                <li><button onClick={() => onNavigate('tech-stack')} className="hover:text-[#0066cc] transition-colors">Tech Stack</button></li>
                <li><button onClick={() => onNavigate('projects')} className="hover:text-[#0066cc] transition-colors">Architecture Projects</button></li>
                <li><button onClick={() => onNavigate('research')} className="hover:text-[#0066cc] transition-colors">Research & Whitepapers</button></li>
                <li><button onClick={() => onNavigate('blog')} className="hover:text-[#0066cc] transition-colors">Technical Articles</button></li>
              </ul>
            </div>
          )}

          {/* Management & Tools */}
          {footerConfig.showOpsLinks && (
            <div className="space-y-2">
              <p className={`text-xs font-mono font-semibold uppercase tracking-wider ${
                darkMode ? 'text-slate-200' : 'text-[#1d1d1f]'
              }`}>Management & Ops</p>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => onNavigate('contact')} className="hover:text-[#0066cc] transition-colors">Gateway SLA & Contact</button></li>
                <li><button onClick={() => onNavigate('admin')} className="hover:text-[#0066cc] transition-colors">Admin Management Console</button></li>
              </ul>
            </div>
          )}

          {/* Core Tech Badge Cluster */}
          {footerConfig.showSpecializationTags && (
            <div className="space-y-2">
              <p className={`text-xs font-mono font-semibold uppercase tracking-wider ${
                darkMode ? 'text-slate-200' : 'text-[#1d1d1f]'
              }`}>Specialization Stack</p>
              <div className="flex flex-wrap gap-1">
                {footerConfig.specializationTags.map((t) => (
                  <span key={t} className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    darkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-gray-200 text-[#1d1d1f]'
                  }`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4 ${
          darkMode ? 'border-white/10 text-slate-400' : 'border-gray-200 text-[#86868b]'
        }`}>
          <p>{footerConfig.copyrightText}</p>
          
          <div className="flex items-center space-x-3 font-mono">
            <span className={`inline-flex items-center font-semibold ${statusStyle.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} mr-1.5 animate-pulse`} />
              {footerConfig.systemStatusText}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
