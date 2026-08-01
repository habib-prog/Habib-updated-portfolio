import React, { useState, useEffect } from 'react';
import { SectionId } from './types';
import { SiteProvider, useSite } from './context/SiteContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TechStackSection } from './components/TechStackSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ResearchSection } from './components/ResearchSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

function AppContent() {
  const { refreshData, loading } = useSite();
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    const path = window.location.pathname;
    return path === '/admin' || path.startsWith('/admin/');
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin' || path.startsWith('/admin/'));
    };

    const handlePushState = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin' || path.startsWith('/admin/'));
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pushstate', handlePushState);
    window.addEventListener('replacestate', handlePushState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pushstate', handlePushState);
      window.removeEventListener('replacestate', handlePushState);
    };
  }, []);

  const handleNavigate = (section: SectionId | 'admin') => {
    if (section === 'admin') {
      navigateToAdmin();
      return;
    }

    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = async () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    await refreshData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0066cc] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-[#86868b]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 antialiased ${
      darkMode ? 'bg-[#0b0c0e] text-white selection:bg-blue-600 selection:text-white' : 'bg-[#f5f5f7] text-[#1d1d1f] selection:bg-[#0066cc] selection:text-white'
    }`}>
      {isAdminRoute ? (
        <AdminDashboard darkMode={darkMode} onBackToSite={navigateToHome} />
      ) : (
        <>
          {/* Navigation */}
          <Navbar 
            activeSection={activeSection}
            setActiveSection={handleNavigate}
            systemStatus="ALL_SYSTEMS_GO"
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          {/* Main Page Layout */}
          <main id="overview" className="pt-16 sm:pt-20">
            {/* Hero Section */}
            <Hero onNavigate={handleNavigate} darkMode={darkMode} />

            {/* Tech Stack Section */}
            <TechStackSection darkMode={darkMode} />

            {/* Case Studies / Projects */}
            <ProjectsSection darkMode={darkMode} />

            {/* Research Whitepapers */}
            <ResearchSection darkMode={darkMode} />

            {/* Technical Articles */}
            <BlogSection darkMode={darkMode} />

            {/* Contact Page */}
            <ContactSection darkMode={darkMode} />
          </main>

          {/* Footer */}
          <Footer onNavigate={handleNavigate} darkMode={darkMode} />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <AppContent />
    </SiteProvider>
  );
}
