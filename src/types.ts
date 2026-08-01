export type SectionId = 
  | 'overview'
  | 'tech-stack'
  | 'projects'
  | 'research'
  | 'blog'
  | 'contact';

export interface TechItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database & Caching' | 'DevOps & Cloud' | 'AI & RAG' | 'Messaging';
  iconName: string;
  description: string;
  proficiency?: number; // Optional
  years?: string; // Optional
  badge?: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'client' | 'gateway' | 'service' | 'cache' | 'queue' | 'vectordb' | 'llm';
  status: 'active' | 'standby' | 'syncing';
  latencyMs?: number;
}

export interface ArchitectureLink {
  from: string;
  to: string;
  label?: string;
  protocol?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  summary: string;
  architectureOverview: string;
  category: 'RAG & AI' | 'Distributed Microservices' | 'Cloud Infrastructure' | 'Real-time Systems';
  techStack: string[];
  metrics: {
    label: string;
    value: string;
    change?: string;
  }[];
  keyHighlights: string[];
  diagram: {
    nodes: ArchitectureNode[];
    links: ArchitectureLink[];
  };
  codeSnippet: {
    language: string;
    filename: string;
    code: string;
  };
  featured?: boolean;
  githubUrl?: string;
  liveDemoUrl?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  subtitle: string;
  abstract: string;
  publishedDate: string;
  category: 'Vector DB Performance' | 'Multi-Agent Graph' | 'Microservices Resiliency' | 'RAG Optimization';
  tags: string[];
  keyFindings: string[];
  benchmarkData: {
    metricName: string;
    dataset: {
      label: string;
      valueA: number; // e.g. Habib's System
      valueB: number; // e.g. Standard Baseline
    }[];
  };
  pdfUrl?: string;
  citation: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'RAG Architecture' | 'Kubernetes & DevOps' | 'Distributed Systems' | 'Backend Performance';
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  views: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  projectType: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface RagRetrievedChunk {
  id: string;
  score: number;
  source: string;
  text: string;
}

export interface RagQueryResult {
  query: string;
  retrievedChunks: RagRetrievedChunk[];
  answer: string;
  executionStats: {
    embeddingTimeMs: number;
    vectorSearchTimeMs: number;
    llmInferenceTimeMs: number;
    totalLatencyMs: number;
    pineconeSimilarityAverage: number;
  };
}

export interface SystemServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'maintenance';
  latency: string;
  detail: string;
  uptime: string;
}

export interface FooterConfig {
  tagline: string;
  copyrightText: string;
  systemStatusText: string;
  systemStatusState: 'operational' | 'degraded' | 'maintenance';
  showNavLinks: boolean;
  showOpsLinks: boolean;
  showSpecializationTags: boolean;
  specializationTags: string[];
  footerPhotoUrl?: string;
  showFooterPhoto?: boolean;
}

export interface ProfileData {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  photoUrl: string;
  email: string;
  phone?: string;
  location: string;
  responseSla: string;
  githubUrl: string;
  linkedinUrl: string;
  mediumUrl?: string;
  twitterUrl?: string;
  skills: string[];
}

