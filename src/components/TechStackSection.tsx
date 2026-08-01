import React, { useState } from 'react';
import { TECH_ITEMS } from '../data/mockData';
import { TechItem } from '../types';
import { 
  Server, 
  Cpu, 
  Code2, 
  Database, 
  Zap, 
  Layers, 
  MessageSquare, 
  Globe, 
  Network, 
  GitFork, 
  Sparkles, 
  Boxes, 
  Container, 
  GitBranch, 
  Cloud, 
  Shield, 
  Layout, 
  RefreshCw, 
  Activity, 
  Palette,
  Award,
  Smartphone,
  FileCode,
  LayoutGrid,
  Code
} from 'lucide-react';
import { motion } from 'motion/react';

interface TechStackSectionProps {
  darkMode?: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Server: <Server className="w-5 h-5 text-blue-500" />,
  Cpu: <Cpu className="w-5 h-5 text-indigo-500" />,
  Code2: <Code2 className="w-5 h-5 text-emerald-500" />,
  Code: <Code className="w-5 h-5 text-emerald-600" />,
  Database: <Database className="w-5 h-5 text-green-600" />,
  Zap: <Zap className="w-5 h-5 text-amber-500" />,
  Layers: <Layers className="w-5 h-5 text-purple-500" />,
  MessageSquare: <MessageSquare className="w-5 h-5 text-rose-500" />,
  Globe: <Globe className="w-5 h-5 text-sky-500" />,
  Network: <Network className="w-5 h-5 text-cyan-500" />,
  GitFork: <GitFork className="w-5 h-5 text-teal-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-500" />,
  Boxes: <Boxes className="w-5 h-5 text-blue-400" />,
  Container: <Container className="w-5 h-5 text-blue-600" />,
  GitBranch: <GitBranch className="w-5 h-5 text-orange-500" />,
  Cloud: <Cloud className="w-5 h-5 text-amber-600" />,
  Shield: <Shield className="w-5 h-5 text-amber-500" />,
  Layout: <Layout className="w-5 h-5 text-cyan-500" />,
  RefreshCw: <RefreshCw className="w-5 h-5 text-violet-500" />,
  Activity: <Activity className="w-5 h-5 text-emerald-500" />,
  Palette: <Palette className="w-5 h-5 text-teal-500" />,
  Award: <Award className="w-5 h-5 text-amber-600" />,
  Smartphone: <Smartphone className="w-5 h-5 text-blue-600" />,
  FileCode: <FileCode className="w-5 h-5 text-rose-500" />,
  LayoutGrid: <LayoutGrid className="w-5 h-5 text-indigo-600" />
};

export const TechStackSection: React.FC<TechStackSectionProps> = ({ darkMode = false }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Backend',
    'Database & Caching',
    'AI & RAG',
    'Messaging',
    'DevOps & Cloud',
    'Frontend'
  ];

  const filteredItems = activeCategory === 'All'
    ? TECH_ITEMS
    : TECH_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="tech-stack" className={`py-24 transition-colors duration-300 border-b ${
      darkMode ? 'bg-[#0b0c0e] text-white border-white/10' : 'bg-[#f5f5f7] text-[#1d1d1f] border-gray-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className={`text-xs font-mono tracking-widest uppercase ${
            darkMode ? 'text-slate-400' : 'text-[#86868b]'
          }`}>
            Engineering Capabilities
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            Tech Stack & Infrastructure
          </h2>
          <p className={`text-sm sm:text-base font-normal ${
            darkMode ? 'text-slate-300' : 'text-[#86868b]'
          }`}>
            Core technologies utilized for building AI-powered systems with RAG and scalable backend solutions using Data Structures & Algorithms.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#0066cc] text-white font-semibold shadow-sm'
                  : darkMode 
                    ? 'bg-white/5 text-slate-300 hover:text-white border border-white/10' 
                    : 'bg-white text-[#1d1d1f] hover:bg-gray-100 border border-gray-200/80 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tech Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              className={`p-6 rounded-2xl border transition-all duration-300 group flex flex-col justify-between ${
                darkMode 
                  ? 'bg-[#151619] border-white/10 hover:border-white/25 hover:shadow-2xl' 
                  : 'bg-white border-gray-200/90 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'
                    }`}>
                      {ICON_MAP[item.iconName] || <Server className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">
                        {item.name}
                      </h3>
                      <span className={`text-[11px] font-mono ${
                        darkMode ? 'text-slate-400' : 'text-[#86868b]'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                      darkMode 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-blue-50 text-[#0066cc] border-blue-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                <p className={`mt-4 text-xs leading-relaxed font-sans ${
                  darkMode ? 'text-slate-300' : 'text-[#424245]'
                }`}>
                  {item.description}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
