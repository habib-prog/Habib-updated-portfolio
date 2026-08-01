import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { ResearchPaper } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  CartesianGrid 
} from 'recharts';
import { 
  Download, 
  Copy, 
  Check, 
  Activity
} from 'lucide-react';

interface ResearchSectionProps {
  darkMode?: boolean;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({ darkMode = false }) => {
  const { researchPapers } = useSite();
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper>(researchPapers[0] || {} as ResearchPaper);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  useEffect(() => {
    if (researchPapers.length > 0 && (!selectedPaper.id || !researchPapers.find(p => p.id === selectedPaper.id))) {
      setSelectedPaper(researchPapers[0]);
    }
  }, [researchPapers]);


  const handleCopyCitation = () => {
    navigator.clipboard.writeText(selectedPaper.citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <section id="research" className={`py-24 transition-colors duration-300 border-b ${
      darkMode ? 'bg-[#0b0c0e] text-white border-white/10' : 'bg-[#f5f5f7] text-[#1d1d1f] border-gray-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className={`text-xs font-mono tracking-widest uppercase ${
            darkMode ? 'text-slate-400' : 'text-[#86868b]'
          }`}>
            Systems & AI Research
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            Benchmarks & Whitepapers
          </h2>
          <p className={`text-sm sm:text-base font-normal ${
            darkMode ? 'text-slate-300' : 'text-[#86868b]'
          }`}>
            Rigorous quantitative evaluations on vector search recall, multi-agent graph topologies, and queue autoscaling.
          </p>
        </div>

        {/* Paper Selector Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {researchPapers.map((paper) => (
            <button
              key={paper.id}
              onClick={() => setSelectedPaper(paper)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedPaper.id === paper.id
                  ? 'bg-[#0066cc] text-white font-semibold shadow-sm'
                  : darkMode 
                    ? 'bg-white/5 text-slate-300 hover:text-white border border-white/10' 
                    : 'bg-white text-[#1d1d1f] hover:bg-gray-100 border border-gray-200/80 shadow-sm'
              }`}
            >
              {paper.title}
            </button>
          ))}
        </div>

        {/* Selected Paper Details Card */}
        <div className={`mt-12 rounded-3xl border p-6 sm:p-10 shadow-xl backdrop-blur-xl transition-colors ${
          darkMode 
            ? 'bg-[#151619] border-white/15 text-white' 
            : 'bg-white border-gray-200/90 text-[#1d1d1f] shadow-gray-200/60'
        }`}>
          
          <div className={`flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b gap-4 ${
            darkMode ? 'border-white/10' : 'border-gray-100'
          }`}>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-medium border ${
                  darkMode ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200'
                }`}>
                  {selectedPaper.category}
                </span>
                <span className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                  {selectedPaper.publishedDate}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-2">
                {selectedPaper.title}
              </h3>
              <p className={`text-xs font-mono mt-1 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                {selectedPaper.subtitle}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyCitation}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  darkMode ? 'bg-white/5 text-slate-300 border-white/10 hover:text-white' : 'bg-gray-100 text-[#1d1d1f] border-gray-200 hover:bg-gray-200'
                }`}
              >
                {copiedCitation ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCitation ? 'Copied' : 'Cite Paper'}</span>
              </button>

              <a
                href={`#download-${selectedPaper.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading Whitepaper PDF: "${selectedPaper.title}.pdf"`);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#0066cc] text-white text-xs font-medium hover:bg-[#0077ed] transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>PDF Download</span>
              </a>
            </div>
          </div>

          {/* Abstract */}
          <div className={`py-6 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
            <h4 className={`text-xs font-mono uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Abstract</h4>
            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${darkMode ? 'text-slate-200' : 'text-[#424245]'}`}>
              {selectedPaper.abstract}
            </p>
          </div>

          {/* Benchmark Interactive Chart */}
          <div className={`py-8 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`text-xs font-mono uppercase tracking-wider flex items-center space-x-2 ${
                darkMode ? 'text-slate-300' : 'text-[#1d1d1f]'
              }`}>
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Benchmark Evaluation: {selectedPaper.benchmarkData.metricName}</span>
              </h4>
              <span className={`text-[11px] font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                Habib's Architecture vs Baseline
              </span>
            </div>

            <div className={`h-64 sm:h-80 w-full p-4 rounded-2xl border ${
              darkMode ? 'bg-black/60 border-white/10' : 'bg-gray-50 border-gray-200'
            }`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedPaper.benchmarkData.dataset}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#ffffff15" : "#e5e7eb"} />
                  <XAxis dataKey="label" stroke={darkMode ? "#888888" : "#6b7280"} fontSize={11} tickLine={false} />
                  <YAxis stroke={darkMode ? "#888888" : "#6b7280"} fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#090a0f' : '#ffffff', 
                      borderColor: darkMode ? '#ffffff20' : '#e5e7eb', 
                      borderRadius: '8px', 
                      color: darkMode ? '#fff' : '#111827', 
                      fontSize: '12px' 
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar name="Habib's Optimized Architecture" dataKey="valueA" fill="#0066cc" radius={[4, 4, 0, 0]} />
                  <Bar name="Standard Baseline Architecture" dataKey="valueB" fill={darkMode ? "#475569" : "#9ca3af"} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Findings List */}
          <div className="pt-6">
            <h4 className={`text-xs font-mono uppercase tracking-wider mb-3 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>Key Empirical Findings</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedPaper.keyFindings.map((finding, idx) => (
                <div key={idx} className={`p-4 rounded-xl border space-y-1 ${
                  darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 block font-semibold">Finding 0{idx + 1}</span>
                  <p className={`text-xs leading-relaxed font-sans ${darkMode ? 'text-slate-200' : 'text-[#424245]'}`}>{finding}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
