import React, { useState } from 'react';
import { SectionId } from '../types';
import { useSite } from '../context/SiteContext';
import { 
  Server, 
  Cpu, 
  Zap, 
  ArrowRight, 
  BookOpen, 
  Terminal,
  Box,
  Database,
  Workflow,
  Linkedin,
  Github,
  Twitter,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onNavigate: (section: SectionId) => void;
  darkMode?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, darkMode = false }) => {
  const { profile } = useSite();
  const [activeSimulationNode, setActiveSimulationNode] = useState<string>('pinecone');
  const [simulationCount, setSimulationCount] = useState<number>(25480);

  const triggerSimulation = (nodeId: string) => {
    setActiveSimulationNode(nodeId);
    setSimulationCount((prev) => prev + Math.floor(Math.random() * 120) + 15);
  };

  return (
    <section className={`relative pt-8 pb-14 md:pt-14 md:pb-20 overflow-hidden transition-colors duration-300 border-b ${
      darkMode 
        ? 'bg-[#0b0c0e] text-white border-white/10' 
        : 'bg-[#f5f5f7] text-[#1d1d1f] border-gray-200/80'
    }`}>
      
      {/* Background Subtle Hardware Grid Glow */}
      <div className={`absolute inset-0 pointer-events-none ${
        darkMode 
          ? 'bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.05),transparent_50%)]' 
          : 'bg-[radial-gradient(circle_at_top_center,rgba(0,102,204,0.06),transparent_50%)]'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Profile Header & Eyebrow Badge */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Profile Avatar Image */}
            <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden p-1 shadow-2xl transition-all ${
              darkMode ? 'bg-gradient-to-tr from-blue-600 to-amber-500 ring-4 ring-white/15' : 'bg-white ring-4 ring-blue-500/20 shadow-gray-300'
            }`}>
              <img
                src={profile.photoUrl}
                alt={`${profile.name} - ${profile.role}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            
            {/* Live Indicator Badge on Avatar */}
            <div className="absolute bottom-1 right-1 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-bold shadow-md border-2 border-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>ONLINE</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-mono backdrop-blur-md shadow-sm border max-w-full text-center leading-tight ${
              darkMode 
                ? 'bg-white/[0.04] border-white/15 text-slate-300' 
                : 'bg-white border-gray-200 text-gray-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
            <span className="truncate sm:whitespace-normal">{profile.role}</span>
          </motion.div>
        </div>

        {/* Main Headline - Apple Clean Minimalism */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center max-w-4xl mx-auto space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.08]">
            {profile.tagline}
          </h1>
          
          <p className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed pt-1 font-normal ${
            darkMode ? 'text-slate-300' : 'text-[#86868b]'
          }`}>
            {profile.bio}
          </p>
        </motion.div>


        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={() => onNavigate('projects')}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-[#0066cc] text-white font-medium text-sm hover:bg-[#0077ed] transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>View Architecture Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('tech-stack')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium text-sm border transition-all ${
              darkMode 
                ? 'bg-white/10 text-white border-white/20 hover:bg-white/15' 
                : 'bg-white text-[#1d1d1f] border-gray-300 hover:bg-gray-100 shadow-sm'
            }`}
          >
            <Cpu className="w-4 h-4 text-[#0066cc]" />
            <span>Examine Tech Stack</span>
          </button>

          <button
            onClick={() => onNavigate('contact')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-full text-sm font-medium hover:underline transition-all ${
              darkMode ? 'text-slate-300 hover:text-white' : 'text-[#0066cc]'
            }`}
          >
            <span>Contact Habib &gt;</span>
          </button>
        </motion.div>

        {/* Social Profiles Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
        >
          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all hover:scale-105 ${
                darkMode
                  ? 'bg-white/5 border-white/10 text-slate-200 hover:bg-blue-600/20 hover:border-blue-500/50 hover:text-white'
                  : 'bg-white border-gray-200 text-gray-800 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 shadow-sm'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-500" />
              <span>LinkedIn</span>
            </a>
          )}

          {profile.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all hover:scale-105 ${
                darkMode
                  ? 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/15 hover:border-white/30 hover:text-white'
                  : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-100 hover:border-gray-400 hover:text-black shadow-sm'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}

          {profile.mediumUrl && (
            <a
              href={profile.mediumUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all hover:scale-105 ${
                darkMode
                  ? 'bg-white/5 border-white/10 text-slate-200 hover:bg-emerald-600/20 hover:border-emerald-500/50 hover:text-white'
                  : 'bg-white border-gray-200 text-gray-800 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 shadow-sm'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-emerald-500">
                <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
              </svg>
              <span>Medium</span>
            </a>
          )}

          {profile.twitterUrl && (
            <a
              href={profile.twitterUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all hover:scale-105 ${
                darkMode
                  ? 'bg-white/5 border-white/10 text-slate-200 hover:bg-sky-600/20 hover:border-sky-500/50 hover:text-white'
                  : 'bg-white border-gray-200 text-gray-800 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-600 shadow-sm'
              }`}
            >
              <Twitter className="w-3.5 h-3.5 text-sky-400" />
              <span>X / Twitter</span>
            </a>
          )}
        </motion.div>

        {/* Interactive Architecture Showcase Card (Apple Hardware Preview) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className={`mt-14 relative rounded-3xl border shadow-xl p-6 sm:p-8 backdrop-blur-xl overflow-hidden transition-colors ${
            darkMode 
              ? 'bg-[#151619] border-white/15 text-white' 
              : 'bg-white border-gray-200/90 text-[#1d1d1f] shadow-gray-200/60'
          }`}
        >
          {/* Top Card Header */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b gap-4 ${
            darkMode ? 'border-white/10' : 'border-gray-100'
          }`}>
            <div>
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs sm:text-sm font-mono font-semibold">
                  HABIB_DISTRIBUTED_MESH_TOPOLOGY.sys
                </h3>
              </div>
              <p className={`text-xs mt-1 font-sans ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                Real-time RAG & microservices topology simulation. Click a node to observe latency & protocol routing.
              </p>
            </div>

            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-mono ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={darkMode ? 'text-slate-400' : 'text-[#86868b]'}>System Throughput:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{simulationCount.toLocaleString()} QPS</span>
            </div>
          </div>

          {/* Microservices Interactive Topology Grid */}
          <div className="py-8 grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 relative">
            
            {/* Node 1: Express API */}
            <button
              onClick={() => triggerSimulation('express')}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group ${
                activeSimulationNode === 'express'
                  ? darkMode ? 'bg-white/10 border-white/40 ring-1 ring-white/20' : 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                  : darkMode ? 'bg-white/[0.02] border-white/10 hover:border-white/25' : 'bg-gray-50/80 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Server className="w-5 h-5 text-blue-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h4 className="text-xs font-mono font-bold">Express / Node</h4>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>API Gateway</p>
              <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-2">1.2ms REST</p>
            </button>

            {/* Node 2: Redis L2 Cache */}
            <button
              onClick={() => triggerSimulation('redis')}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group ${
                activeSimulationNode === 'redis'
                  ? darkMode ? 'bg-white/10 border-white/40 ring-1 ring-white/20' : 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20'
                  : darkMode ? 'bg-white/[0.02] border-white/10 hover:border-white/25' : 'bg-gray-50/80 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h4 className="text-xs font-mono font-bold">Redis L2 Cache</h4>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Semantic Vectors</p>
              <p className="text-[10px] font-mono text-amber-600 dark:text-amber-400 mt-2">0.4ms RESP3</p>
            </button>

            {/* Node 3: Pinecone DB */}
            <button
              onClick={() => triggerSimulation('pinecone')}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group ${
                activeSimulationNode === 'pinecone'
                  ? darkMode ? 'bg-white/10 border-white/40 ring-1 ring-white/20' : 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-500/20'
                  : darkMode ? 'bg-white/[0.02] border-white/10 hover:border-white/25' : 'bg-gray-50/80 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Database className="w-5 h-5 text-purple-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h4 className="text-xs font-mono font-bold">Pinecone Vector</h4>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>384d Cosine Index</p>
              <p className="text-[10px] font-mono text-purple-600 dark:text-purple-400 mt-2">7.8ms gRPC</p>
            </button>

            {/* Node 4: RabbitMQ */}
            <button
              onClick={() => triggerSimulation('rabbitmq')}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group ${
                activeSimulationNode === 'rabbitmq'
                  ? darkMode ? 'bg-white/10 border-white/40 ring-1 ring-white/20' : 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                  : darkMode ? 'bg-white/[0.02] border-white/10 hover:border-white/25' : 'bg-gray-50/80 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Workflow className="w-5 h-5 text-emerald-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h4 className="text-xs font-mono font-bold">RabbitMQ Broker</h4>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Topic Exchange</p>
              <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-2">1.1ms AMQP</p>
            </button>

            {/* Node 5: Kubernetes AWS */}
            <button
              onClick={() => triggerSimulation('k8s')}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group col-span-2 md:col-span-1 ${
                activeSimulationNode === 'k8s'
                  ? darkMode ? 'bg-white/10 border-white/40 ring-1 ring-white/20' : 'bg-cyan-50/80 border-cyan-300 ring-2 ring-cyan-500/20'
                  : darkMode ? 'bg-white/[0.02] border-white/10 hover:border-white/25' : 'bg-gray-50/80 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Box className="w-5 h-5 text-cyan-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h4 className="text-xs font-mono font-bold">K8s EKS Mesh</h4>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Multi-AZ Nodes</p>
              <p className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mt-2">Auto-scaled HPA</p>
            </button>

          </div>

          {/* Active Node Deep-Dive Status Drawer inside hero */}
          <div className={`p-4 rounded-2xl border font-mono text-xs ${
            darkMode ? 'bg-black/70 border-white/10 text-slate-300' : 'bg-gray-50 border-gray-200 text-gray-800'
          }`}>
            {activeSimulationNode === 'pinecone' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">[PINECONE_INDEX]</span> Dense vector similarity search across RAG document embeddings.
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-right">Top Similarity: 0.9482 (7.8ms)</span>
              </div>
            )}
            {activeSimulationNode === 'redis' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">[REDIS_L2_CACHE]</span> Checking semantic hash key <code className="font-bold">vec_cache:8f2a91</code>.
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-right">CACHE HIT (0.4ms)</span>
              </div>
            )}
            {activeSimulationNode === 'express' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">[EXPRESS_GATEWAY]</span> Non-blocking V8 event loop executing microservice middleware pipeline.
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-right">1.2ms Response</span>
              </div>
            )}
            {activeSimulationNode === 'rabbitmq' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">[RABBITMQ_AMQP]</span> Topic channel active. Prefetch: 50. DLQ failover ready.
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-right">Queue Depth: 0 (Normal)</span>
              </div>
            )}
            {activeSimulationNode === 'k8s' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">[K8S_EKS_CLUSTER]</span> 12 Worker nodes active across AWS us-east-1a, us-east-1b.
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-right">Cluster Health: 100%</span>
              </div>
            )}
          </div>

        </motion.div>

        {/* Metrics Ribbon */}
        <div className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t pt-10 ${
          darkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight font-mono">99.999%</p>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Production Cluster Uptime</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight font-mono">&lt; 1.4ms</p>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Redis L2 Cache Latency</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight font-mono">10M+</p>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Daily RabbitMQ Events</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight font-mono">Sub-15ms</p>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Pinecone RAG Retrieval</p>
          </div>
        </div>

      </div>
    </section>
  );
};
