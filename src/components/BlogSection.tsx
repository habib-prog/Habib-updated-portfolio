import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { BlogArticle } from '../types';
import { 
  Search, 
  Clock, 
  X, 
  ArrowRight, 
  Share2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlogSectionProps {
  darkMode?: boolean;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ darkMode = false }) => {
  const { articles } = useSite();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const allTags = ['All', ...Array.from(new Set(articles.flatMap(a => a.tags || [])))];

  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || (art.tags && art.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });


  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="blog" className={`py-24 transition-colors duration-300 border-b ${
      darkMode ? 'bg-[#0b0c0e] text-white border-white/10' : 'bg-[#f5f5f7] text-[#1d1d1f] border-gray-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className={`text-xs font-mono tracking-widest uppercase ${
            darkMode ? 'text-slate-400' : 'text-[#86868b]'
          }`}>
            Technical Journal
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            Engineering & Architecture Insights
          </h2>
          <p className={`text-sm sm:text-base font-normal ${
            darkMode ? 'text-slate-300' : 'text-[#86868b]'
          }`}>
            Deep-dive articles on RAG orchestration, Kubernetes scaling, and high-concurrency Redis patterns.
          </p>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
              darkMode ? 'text-slate-400' : 'text-[#86868b]'
            }`} />
            <input
              type="text"
              placeholder="Search engineering guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-full text-xs focus:outline-none transition-all border ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-white/30' 
                  : 'bg-white border-gray-200 text-[#1d1d1f] placeholder-gray-400 focus:border-[#0066cc] shadow-sm'
              }`}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 justify-center md:justify-end">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-all ${
                  selectedTag === tag
                    ? 'bg-[#0066cc] text-white font-semibold shadow-sm'
                    : darkMode 
                      ? 'bg-white/5 text-slate-300 hover:text-white border border-white/10' 
                      : 'bg-white text-[#1d1d1f] hover:bg-gray-100 border border-gray-200 shadow-sm'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

        </div>

        {/* Articles Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <motion.article
              key={art.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md ${
                darkMode 
                  ? 'bg-[#151619] border-white/10 hover:border-white/25' 
                  : 'bg-white border-gray-200/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={`px-2.5 py-0.5 rounded-full border ${
                    darkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-[#0066cc] border-blue-200'
                  }`}>
                    {art.category}
                  </span>
                  <div className={`flex items-center space-x-1.5 ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>
                    <Clock className="w-3 h-3" />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold tracking-tight transition-colors line-clamp-2">
                  {art.title}
                </h3>

                <p className={`text-xs leading-relaxed font-sans line-clamp-3 ${
                  darkMode ? 'text-slate-300' : 'text-[#424245]'
                }`}>
                  {art.excerpt}
                </p>
              </div>

              <div className={`mt-6 pt-4 border-t flex items-center justify-between ${
                darkMode ? 'border-white/5' : 'border-gray-100'
              }`}>
                <span className={`text-xs font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>{art.publishedAt}</span>

                <button
                  onClick={() => setActiveArticle(art)}
                  className="flex items-center space-x-1 text-xs font-semibold text-[#0066cc] hover:underline transition-colors"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border p-6 sm:p-10 shadow-2xl relative transition-colors ${
                darkMode ? 'bg-[#151619] border-white/20 text-white' : 'bg-white border-gray-200 text-[#1d1d1f]'
              }`}
            >
              {/* Close button */}
              <button
                onClick={() => setActiveArticle(null)}
                className={`absolute top-6 right-6 p-2 rounded-full transition-all ${
                  darkMode ? 'bg-white/10 hover:bg-white/20 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className={`flex items-center space-x-3 text-xs font-mono ${
                  darkMode ? 'text-slate-400' : 'text-[#86868b]'
                }`}>
                  <span className={`px-3 py-1 rounded-full border ${
                    darkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-[#0066cc] border-blue-200'
                  }`}>
                    {activeArticle.category}
                  </span>
                  <span>{activeArticle.readTime}</span>
                  <span>•</span>
                  <span>{activeArticle.publishedAt}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                  {activeArticle.title}
                </h2>

                <div className={`flex items-center justify-between pt-2 pb-6 border-b ${
                  darkMode ? 'border-white/10' : 'border-gray-100'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-[#0066cc] text-white flex items-center justify-center font-bold text-xs">
                      HB
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{activeArticle.author.name}</p>
                      <p className={`text-[10px] font-mono ${darkMode ? 'text-slate-400' : 'text-[#86868b]'}`}>{activeArticle.author.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleShare}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      darkMode ? 'bg-white/10 border-white/10 text-slate-300' : 'bg-gray-100 border-gray-200 text-[#1d1d1f]'
                    }`}
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
                  </button>
                </div>

                {/* Article Content */}
                <div className={`py-4 space-y-4 text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-line ${
                  darkMode ? 'text-slate-200' : 'text-[#424245]'
                }`}>
                  {activeArticle.content}
                </div>

                {/* Tags */}
                <div className={`pt-6 border-t flex flex-wrap gap-2 ${
                  darkMode ? 'border-white/10' : 'border-gray-100'
                }`}>
                  {activeArticle.tags.map((t) => (
                    <span key={t} className={`px-2.5 py-1 rounded-md border text-[11px] font-mono ${
                      darkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-gray-100 border-gray-200 text-[#86868b]'
                    }`}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
