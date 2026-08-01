import React, { useState, useEffect } from 'react';
import { SectionId } from '../types';
import { useSite } from '../context/SiteContext';
import { 
  Server, 
  Cpu, 
  Layers, 
  BookOpen, 
  Mail, 
  Menu, 
  X, 
  Activity,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  systemStatus: string;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection,
  darkMode,
  setDarkMode
}) => {
  const { profile } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: SectionId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Server className="w-3.5 h-3.5" /> },
    { id: 'tech-stack', label: 'Tech Stack', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'Projects', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'research', label: 'Research', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'blog', label: 'Articles', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-3.5 h-3.5" /> },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        darkMode 
          ? scrolled 
            ? 'bg-[#0b0c0e]/95 backdrop-blur-md border-b border-white/10 shadow-xl' 
            : 'bg-[#0b0c0e]/90 backdrop-blur-md border-b border-white/10'
          : scrolled 
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-sm' 
            : 'bg-white/90 backdrop-blur-md border-b border-gray-200/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Top Left Nav: profile photo + admin-managed name */}
          <button 
            onClick={() => setActiveSection('overview')}
            className="flex items-center space-x-2.5 sm:space-x-3 group text-left focus:outline-none shrink min-w-0"
          >
            <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0.5 transition-transform duration-300 group-hover:scale-105 shadow-sm overflow-hidden shrink-0 ${
              darkMode ? 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-500 ring-2 ring-white/10' : 'bg-white ring-2 ring-blue-500/20'
            }`}>
              <img
                src={profile.photoUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className={`font-bold tracking-tight font-mono text-sm sm:text-base ${
                  darkMode ? 'text-white' : 'text-[#1d1d1f]'
                }`}>
                  {profile.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-blue-500/10 text-[#0066cc] dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider shrink-0">
                  FULL STACK
                </span>
              </div>
              <span className={`text-[9px] sm:text-[10px] font-mono leading-none truncate ${
                darkMode ? 'text-slate-400' : 'text-[#86868b]'
              }`}>
                RAG AI Specialist & DevOps Enthusiast
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center space-x-1 p-1 rounded-full border backdrop-blur-md transition-colors ${
            darkMode ? 'bg-white/10 border-white/10' : 'bg-gray-100/90 border-gray-200'
          }`}>
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0066cc] text-white font-semibold shadow-sm'
                      : darkMode
                        ? 'text-slate-300 hover:text-white hover:bg-white/10'
                        : 'text-[#424245] hover:text-[#1d1d1f] hover:bg-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium border transition-all ${
                darkMode 
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/15' 
                  : 'bg-gray-100 hover:bg-gray-200 text-[#1d1d1f] border-gray-200'
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border transition-all ${
                darkMode 
                  ? 'bg-white/10 border-white/10 text-white' 
                  : 'bg-gray-100 border-gray-200 text-[#1d1d1f]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 pt-3 pb-6 transition-colors backdrop-blur-2xl ${
          darkMode ? 'bg-[#151619] border-white/10 text-white' : 'bg-white border-gray-200 text-[#1d1d1f]'
        }`}>
          <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                    isActive
                      ? 'bg-[#0066cc] text-white font-semibold'
                      : darkMode
                        ? 'text-slate-200 hover:bg-white/10'
                        : 'text-[#1d1d1f] hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
