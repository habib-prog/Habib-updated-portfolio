import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Project, ArchitectureNode } from '../types';
import { 
  CheckCircle, 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectsSectionProps {
  darkMode?: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ darkMode = false }) => {
  const { projects } = useSite();
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0] || {} as Project);
  const [activeTab, setActiveTab] = useState<'architecture' | 'code' | 'highlights'>('architecture');
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);

  useEffect(() => {
    if (projects.length > 0 && (!selectedProject.id || !projects.find(p => p.id === selectedProject.id))) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);


  return (
    <section id="projects" className={`py-24 transition-colors duration-300 border-b ${
      darkMode ? 'bg-[#0b0c0e] text-white border-white/10' : 'bg-[#f5f5f7] text-[#1d1d1f] border-gray-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className={`text-xs font-mono tracking-widest uppercase ${
            darkMode ? 'text-slate-400' : 'text-[#86868b]'
          }`}>
            Architectural Case Studies
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            Systems Built for Scale
          </h2>
          <p className={`text-sm sm:text-base font-normal ${
            darkMode ? 'text-slate-300' : 'text-[#86868b]'
          }`}>
            Production-proven RAG gateways, asynchronous event queues, and Kubernetes microservices.
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => {
                setSelectedProject(proj);
                setSelectedNode(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedProject.id === proj.id
                  ? 'bg-[#0066cc] text-white font-semibold shadow-sm'
                  : darkMode 
                    ? 'bg-white/5 text-slate-300 hover:text-white border border-white/10' 
                    : 'bg-white text-[#1d1d1f] hover:bg-gray-100 border border-gray-200/80 shadow-sm'
              }`}
            >
              {proj.title}
            </button>
          ))}
        </div>

        {/* Featured Case Study Card - Apple Clean Minimalism Style */}
        <div className={`mt-12 rounded-3xl border p-6 sm:p-10 shadow-xl backdrop-blur-2xl transition-colors ${
          darkMode 
            ? 'bg-[#151619] border-white/15 text-white' 
            : 'bg-white border-gray-200/90 text-[#1d1d1f] shadow-gray-200/60'
        }`}>
          
          {/* Card Top Banner */}
          <div className={`flex flex-col md:flex-row md:items-center justify-between pb-6 border-b gap-4 ${
            darkMode ? 'border-white/10' : 'border-gray-100'
          }`}>
            <div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium border ${
                darkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-[#0066cc] border-blue-200'
              }`}>
                {selectedProject.category}
              </span>
              <h3 className="text-2xl sm:text-4xl font-semibold tracking-tight mt-2">
                {selectedProject.title}
              </h3>
              <p className={`text-sm font-mono mt-1 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                {selectedProject.subtitle}
              </p>
            </div>

            {/* Sub Nav Tabs inside Project */}
            <div className={`flex items-center space-x-1 p-1 rounded-xl border ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
            }`}>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'architecture' 
                    ? darkMode ? 'bg-white/15 text-white font-semibold' : 'bg-white text-[#1d1d1f] font-semibold shadow-sm' 
                    : darkMode ? 'text-slate-400 hover:text-white' : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                Diagram
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'code' 
                    ? darkMode ? 'bg-white/15 text-white font-semibold' : 'bg-white text-[#1d1d1f] font-semibold shadow-sm' 
                    : darkMode ? 'text-slate-400 hover:text-white' : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                Code Snippet
              </button>
              <button
                onClick={() => setActiveTab('highlights')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'highlights' 
                    ? darkMode ? 'bg-white/15 text-white font-semibold' : 'bg-white text-[#1d1d1f] font-semibold shadow-sm' 
                    : darkMode ? 'text-slate-400 hover:text-white' : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                Highlights
              </button>
            </div>
          </div>

          {/* Project Summary & Stack */}
          <div className={`py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 border-b ${
            darkMode ? 'border-white/10' : 'border-gray-100'
          }`}>
            <div className="lg:col-span-2 space-y-2">
              <h4 className={`text-xs font-mono uppercase tracking-wider ${
                darkMode ? 'text-slate-400' : 'text-[#86868b]'
              }`}>System Summary</h4>
              <p className={`text-sm leading-relaxed ${
                darkMode ? 'text-slate-200' : 'text-[#424245]'
              }`}>
                {selectedProject.summary}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className={`text-xs font-mono uppercase tracking-wider ${
                darkMode ? 'text-slate-400' : 'text-[#86868b]'
              }`}>Technologies</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono border ${
                      darkMode ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-gray-100 text-[#1d1d1f] border-gray-200'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Content View */}
          <div className="pt-8">
            <AnimatePresence mode="wait">
              {activeTab === 'architecture' && (
                <motion.div
                  key="arch"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <p className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                    Click any node in the topology diagram below to inspect protocol specs, status, and latency.
                  </p>

                  {/* Architecture Topology Flow Diagram */}
                  <div className={`p-6 rounded-2xl border min-h-[220px] flex flex-col justify-center ${
                    darkMode ? 'bg-black/90 border-white/10' : 'bg-gray-50 border-gray-200/80'
                  }`}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {selectedProject.diagram.nodes.map((node) => {
                        const isSelected = selectedNode?.id === node.id;
                        return (
                          <button
                            key={node.id}
                            onClick={() => setSelectedNode(node)}
                            className={`p-4 rounded-xl border text-left transition-all relative ${
                              isSelected
                                ? darkMode ? 'bg-white/15 border-white/50 ring-2 ring-white/30' : 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20'
                                : darkMode ? 'bg-white/[0.03] border-white/10 hover:border-white/30' : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              {node.latencyMs && (
                                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">{node.latencyMs}ms</span>
                              )}
                            </div>
                            <h5 className="text-xs font-mono font-bold tracking-tight">{node.label}</h5>
                            <span className={`text-[10px] capitalize block mt-1 ${
                              darkMode ? 'text-slate-400' : 'text-[#86868b]'
                            }`}>{node.type}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Links list / Protocol flow explanation */}
                    <div className={`mt-6 pt-4 border-t flex flex-wrap gap-4 text-xs font-mono ${
                      darkMode ? 'border-white/10 text-slate-400' : 'border-gray-200 text-[#86868b]'
                    }`}>
                      <span className={`font-semibold ${darkMode ? 'text-slate-300' : 'text-[#1d1d1f]'}`}>Active Protocols:</span>
                      {selectedProject.diagram.links.map((link, idx) => (
                        <span key={idx} className={`px-2.5 py-1 rounded-md border ${
                          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                        }`}>
                          {link.from} &rarr; {link.to} {link.protocol && `(${link.protocol})`}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Node Detail Inspector Drawer */}
                  {selectedNode && (
                    <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono ${
                      darkMode ? 'bg-white/5 border-white/15 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-800'
                    }`}>
                      <div>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">NODE_INSPECTOR: {selectedNode.label}</span>
                        <p className="font-sans mt-1">
                          Node Type: <strong className="capitalize">{selectedNode.type}</strong> | Status: <strong className="text-emerald-600 dark:text-emerald-400">{selectedNode.status.toUpperCase()}</strong>
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="text-[#0066cc] underline text-[11px]"
                      >
                        Close Inspector
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className={`flex items-center justify-between font-mono text-xs px-2 ${
                    darkMode ? 'text-slate-400' : 'text-[#86868b]'
                  }`}>
                    <span>File: {selectedProject.codeSnippet.filename}</span>
                    <span>Lang: {selectedProject.codeSnippet.language}</span>
                  </div>
                  <pre className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{selectedProject.codeSnippet.code}</code>
                  </pre>
                </motion.div>
              )}

              {activeTab === 'highlights' && (
                <motion.div
                  key="highlights"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {selectedProject.keyHighlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex items-start space-x-3 ${
                        darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className={`text-xs leading-relaxed font-sans ${
                        darkMode ? 'text-slate-200' : 'text-[#424245]'
                      }`}>{hl}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Project Metrics Grid */}
          <div className={`mt-8 pt-8 border-t grid grid-cols-2 sm:grid-cols-4 gap-4 ${
            darkMode ? 'border-white/10' : 'border-gray-100'
          }`}>
            {selectedProject.metrics.map((m, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${
                darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-gray-50 border-gray-200'
              }`}>
                <span className={`text-[11px] font-mono block ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>{m.label}</span>
                <span className="text-xl sm:text-2xl font-bold font-mono block mt-1">{m.value}</span>
                {m.change && (
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block mt-1">{m.change}</span>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
