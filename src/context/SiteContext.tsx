import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ProfileData, 
  Project, 
  BlogArticle, 
  ResearchPaper, 
  ContactMessage, 
  SystemServiceStatus,
  FooterConfig
} from '../types';
import { 
  PROJECTS, 
  BLOG_ARTICLES, 
  RESEARCH_PAPERS, 
  SYSTEM_SERVICES_STATUS 
} from '../data/mockData';
import habibProfilePhoto from '../assets/images/habib_profile_photo_1785529159357.jpg';
import { apiRequest, isApiAvailable } from '../lib/api';

export const DEFAULT_PROFILE: ProfileData = {
  name: "Habib",
  role: "Fullstack software engineer - RAG AI Specialist - DevOps enthusiast",
  tagline: "Backend Heavy • Scalable Distributed Microservices • AI RAG",
  bio: "I am a full stack software engineer. I am backend heavy and specialize in architecting highly scalable, distributed microservices with frontend and RAG.",
  photoUrl: habibProfilePhoto,
  email: "habib.architect@systems.io",
  phone: "+1 (555) 019-2831",
  location: "Global Distributed / Remote & On-site",
  responseSla: "< 12 Hours SLA",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  mediumUrl: "https://medium.com",
  twitterUrl: "https://twitter.com",
  skills: [
    'React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 
    'Tailwind CSS', 'Git', 'Zustand', 'DevOps', 'Jenkins', 'Kubernetes', 
    'Docker', 'AWS', 'Cloudflare', 'CI/CD Pipelines', 'Redis', 'RabbitMQ', 
    'Nginx', 'RAG (Retrieval-Augmented Generation)', 'Pinecone Vector DB', 
    'LangChain', 'LangGraph'
  ]
};

export const DEFAULT_FOOTER: FooterConfig = {
  tagline: "Fullstack Software Engineer specializing in distributed microservices, AI RAG, and DevOps automation.",
  copyrightText: "© 2026 Habib. All rights reserved. Crafted with Clean Minimalism.",
  systemStatusText: "All Systems Operational",
  systemStatusState: "operational",
  showNavLinks: true,
  showOpsLinks: true,
  showSpecializationTags: true,
  footerPhotoUrl: "",
  showFooterPhoto: true,
  specializationTags: [
    'Node.js', 'Express', 'MongoDB', 'Redis', 'RabbitMQ', 'Pinecone', 'LangChain', 
    'LangGraph', 'Kubernetes', 'AWS', 'Cloudflare', 'React 19', 'Next.js', 
    'React Native', 'Zustand', 'TypeScript', 'Tailwind', 'Bootstrap', 'MySQL', 
    'PostgreSQL', 'DSA', 'ASA'
  ]
};

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-01',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techventure.com',
    company: 'TechVenture Cloud',
    projectType: 'RAG Pipeline & Vector DB',
    message: 'We are looking to scale our Pinecone vector search latency from 80ms down to sub-15ms for 50k users. Would love to consult with Habib.',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'msg-02',
    name: 'Michael Chen',
    email: 'mchen@distributed.io',
    company: 'Distributed Systems Inc',
    projectType: 'Kubernetes & AWS DevOps',
    message: 'Impressed by your RabbitMQ queue depth HPA implementation. Are you available for a 3-month lead architecture role?',
    timestamp: 'Yesterday',
    read: true
  }
];

interface SiteContextType {
  profile: ProfileData;
  projects: Project[];
  articles: BlogArticle[];
  researchPapers: ResearchPaper[];
  contactMessages: ContactMessage[];
  systemServices: SystemServiceStatus[];
  footerConfig: FooterConfig;
  adminPasskey: string;
  updateAdminPasskey: (newPasskey: string) => void;
  updateFooterConfig: (data: Partial<FooterConfig>) => void;
  updateProfile: (data: Partial<ProfileData>) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addArticle: (article: BlogArticle) => void;
  updateArticle: (id: string, data: Partial<BlogArticle>) => void;
  deleteArticle: (id: string) => void;
  addResearchPaper: (paper: ResearchPaper) => void;
  updateResearchPaper: (id: string, data: Partial<ResearchPaper>) => void;
  deleteResearchPaper: (id: string) => void;
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => void;
  markMessageAsRead: (id: string) => void;
  deleteContactMessage: (id: string) => void;
  resetToDefaults: () => void;
  refreshData: () => Promise<void>;
}

const STORAGE_KEY = 'habib_portfolio_site_store_v3';

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`) || localStorage.getItem(`habib_portfolio_site_store_v2_profile`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role && (parsed.role.includes('Senior Systems Architect') || parsed.role.includes('Systems Specialist'))) {
          parsed.role = DEFAULT_PROFILE.role;
        }
        return { ...DEFAULT_PROFILE, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse profile from storage', e);
    }
    return DEFAULT_PROFILE;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse projects from storage', e);
    }
    return PROJECTS;
  });

  const [articles, setArticles] = useState<BlogArticle[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_articles`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse articles from storage', e);
    }
    return BLOG_ARTICLES;
  });

  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_papers`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse papers from storage', e);
    }
    return RESEARCH_PAPERS;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse messages from storage', e);
    }
    return INITIAL_CONTACT_MESSAGES;
  });

  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_footer`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse footer config from storage', e);
    }
    return DEFAULT_FOOTER;
  });

  const [systemServices] = useState<SystemServiceStatus[]>(SYSTEM_SERVICES_STATUS);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_articles`, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_papers`, JSON.stringify(researchPapers));
  }, [researchPapers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_footer`, JSON.stringify(footerConfig));
  }, [footerConfig]);

  const [adminPasskey, setAdminPasskey] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_passkey`);
      if (!saved || saved === 'habib-admin' || saved === 'admin') {
        localStorage.setItem(`${STORAGE_KEY}_passkey`, '123321');
        return '123321';
      }
      return saved;
    } catch {
      return '123321';
    }
  });

  // Load data from Express / MongoDB API on mount
  const loadData = async () => {
    if (!isApiAvailable) return;

    try {
      const profileRes = await apiRequest('/api/profile');
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }
    } catch (e) {
      console.warn('Failed to fetch profile from API, falling back to local/default', e);
    }

    try {
      const projectsRes = await apiRequest('/api/projects');
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.map((p: any) => ({ ...p, id: p.projectId })));
      }
    } catch (e) {
      console.warn('Failed to fetch projects from API, falling back to local/default', e);
    }

    try {
      const articlesRes = await apiRequest('/api/articles');
      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        setArticles(articlesData.map((a: any) => ({ ...a, id: a.articleId })));
      }
    } catch (e) {
      console.warn('Failed to fetch articles from API, falling back to local/default', e);
    }

    try {
      const papersRes = await apiRequest('/api/papers');
      if (papersRes.ok) {
        const papersData = await papersRes.json();
        setResearchPapers(papersData.map((p: any) => ({ ...p, id: p.paperId })));
      }
    } catch (e) {
      console.warn('Failed to fetch papers from API, falling back to local/default', e);
    }

    try {
      const footerRes = await apiRequest('/api/footer');
      if (footerRes.ok) {
        const footerData = await footerRes.json();
        setFooterConfig(footerData);
      }
    } catch (e) {
      console.warn('Failed to fetch footer config from API, falling back to local/default', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = async () => {
    await loadData();
  };

  // Fetch admin-restricted contact messages whenever the passkey changes
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messagesRes = await apiRequest('/api/messages', {
          headers: { 'x-admin-passkey': adminPasskey }
        });
        if (messagesRes.ok) {
          const messagesData = await messagesRes.json();
          setContactMessages(messagesData.map((m: any) => ({ ...m, id: m._id || m.id })));
        }
      } catch (e) {
        console.warn('Failed to fetch messages from API', e);
      }
    };
    if (isApiAvailable && adminPasskey) {
      loadMessages();
    }
  }, [adminPasskey]);

  const updateAdminPasskey = (newPasskey: string) => {
    setAdminPasskey(newPasskey);
    localStorage.setItem(`${STORAGE_KEY}_passkey`, newPasskey);
  };

  const updateFooterConfig = async (data: Partial<FooterConfig>) => {
    setFooterConfig(prev => ({ ...prev, ...data }));
    try {
      await apiRequest('/api/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': adminPasskey
        },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error('Failed to sync footer change with API', e);
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...data }));
    try {
      await apiRequest('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': adminPasskey
        },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error('Failed to sync profile change with API', e);
    }
  };

  const addProject = async (project: Project) => {
    setProjects(prev => [project, ...prev]);
    try {
      const dbProject = { ...project, projectId: project.id };
      await apiRequest('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': adminPasskey
        },
        body: JSON.stringify(dbProject)
      });
    } catch (e) {
      console.error('Failed to sync project creation with API', e);
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    try {
      await apiRequest(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': adminPasskey
        },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error('Failed to sync project update with API', e);
    }
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      await apiRequest(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-passkey': adminPasskey
        }
      });
    } catch (e) {
      console.error('Failed to sync project deletion with API', e);
    }
  };

  const addArticle = async (article: BlogArticle) => {
    setArticles(prev => [article, ...prev]);
    try {
      const dbArticle = { ...article, articleId: article.id };
      await apiRequest('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': adminPasskey
        },
        body: JSON.stringify(dbArticle)
      });
    } catch (e) {
      console.error('Failed to sync article creation with API', e);
    }
  };

  const updateArticle = async (id: string, data: Partial<BlogArticle>) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    try {
      await apiRequest(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': adminPasskey
        },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error('Failed to sync article update with API', e);
    }
  };

  const deleteArticle = async (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    try {
      await apiRequest(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-passkey': adminPasskey
        }
      });
    } catch (e) {
      console.error('Failed to sync article deletion with API', e);
    }
  };

  const addResearchPaper = async (paper: ResearchPaper) => {
    setResearchPapers(prev => [paper, ...prev]);
    try {
      const dbPaper = { ...paper, paperId: paper.id };
      await apiRequest('/api/papers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': adminPasskey
        },
        body: JSON.stringify(dbPaper)
      });
    } catch (e) {
      console.error('Failed to sync paper creation with API', e);
    }
  };

  const updateResearchPaper = async (id: string, data: Partial<ResearchPaper>) => {
    setResearchPapers(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    try {
      await apiRequest(`/api/papers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passkey': adminPasskey
        },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error('Failed to sync paper update with API', e);
    }
  };

  const deleteResearchPaper = async (id: string) => {
    setResearchPapers(prev => prev.filter(p => p.id !== id));
    try {
      await apiRequest(`/api/papers/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-passkey': adminPasskey
        }
      });
    } catch (e) {
      console.error('Failed to sync paper deletion with API', e);
    }
  };

  const addContactMessage = async (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => {
    const tempId = `msg-${Date.now()}`;
    const newMessage: ContactMessage = {
      ...msg,
      id: tempId,
      timestamp: 'Just now',
      read: false
    };
    setContactMessages(prev => [newMessage, ...prev]);
    try {
      const res = await apiRequest('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...msg, read: false })
      });
      if (res.ok) {
        const dbMsg = await res.json();
        setContactMessages(prev => prev.map(m => m.id === tempId ? { ...dbMsg, id: dbMsg._id || dbMsg.id, timestamp: 'Just now' } : m));
      }
    } catch (e) {
      console.error('Failed to sync contact message creation with API', e);
    }
  };

  const markMessageAsRead = async (id: string) => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    try {
      await apiRequest(`/api/messages/${id}/read`, {
        method: 'PUT',
        headers: {
          'x-admin-passkey': adminPasskey
        }
      });
    } catch (e) {
      console.error('Failed to sync message read status with API', e);
    }
  };

  const deleteContactMessage = async (id: string) => {
    setContactMessages(prev => prev.filter(m => m.id !== id));
    try {
      await apiRequest(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-passkey': adminPasskey
        }
      });
    } catch (e) {
      console.error('Failed to sync message deletion with API', e);
    }
  };

  const resetToDefaults = async () => {
    setProfile(DEFAULT_PROFILE);
    setProjects(PROJECTS);
    setArticles(BLOG_ARTICLES);
    setResearchPapers(RESEARCH_PAPERS);
    setContactMessages(INITIAL_CONTACT_MESSAGES);
    setFooterConfig(DEFAULT_FOOTER);
    localStorage.removeItem(`${STORAGE_KEY}_profile`);
    localStorage.removeItem(`${STORAGE_KEY}_projects`);
    localStorage.removeItem(`${STORAGE_KEY}_articles`);
    localStorage.removeItem(`${STORAGE_KEY}_papers`);
    localStorage.removeItem(`${STORAGE_KEY}_messages`);
    localStorage.removeItem(`${STORAGE_KEY}_footer`);

    try {
      await apiRequest('/api/reset', {
        method: 'POST',
        headers: {
          'x-admin-passkey': adminPasskey
        }
      });
    } catch (e) {
      console.error('Failed to trigger database reset', e);
    }
  };

  return (
    <SiteContext.Provider value={{
      profile,
      projects,
      articles,
      researchPapers,
      contactMessages,
      systemServices,
      footerConfig,
      adminPasskey,
      updateAdminPasskey,
      updateFooterConfig,
      updateProfile,
      addProject,
      updateProject,
      deleteProject,
      addArticle,
      updateArticle,
      deleteArticle,
      addResearchPaper,
      updateResearchPaper,
      deleteResearchPaper,
      addContactMessage,
      markMessageAsRead,
      deleteContactMessage,
      resetToDefaults,
      refreshData
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
