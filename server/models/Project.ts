import mongoose, { Schema, Document } from 'mongoose';

// ─── Sub-schemas ───────────────────────────────────────────────

const MetricSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    change: { type: String },
  },
  { _id: false }
);

const ArchitectureNodeSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['client', 'gateway', 'service', 'cache', 'queue', 'vectordb', 'llm'],
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'standby', 'syncing'],
    },
    latencyMs: { type: Number },
  },
  { _id: false }
);

const ArchitectureLinkSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    label: { type: String },
    protocol: { type: String },
  },
  { _id: false }
);

const DiagramSchema = new Schema(
  {
    nodes: { type: [ArchitectureNodeSchema], default: [] },
    links: { type: [ArchitectureLinkSchema], default: [] },
  },
  { _id: false }
);

const CodeSnippetSchema = new Schema(
  {
    language: { type: String, required: true },
    filename: { type: String, required: true },
    code: { type: String, required: true },
  },
  { _id: false }
);

// ─── Main Project Schema ───────────────────────────────────────

export interface IProject extends Document {
  projectId: string;
  title: string;
  subtitle: string;
  tagline: string;
  summary: string;
  architectureOverview: string;
  category: string;
  techStack: string[];
  metrics: { label: string; value: string; change?: string }[];
  keyHighlights: string[];
  diagram: {
    nodes: {
      id: string;
      label: string;
      type: string;
      status: string;
      latencyMs?: number;
    }[];
    links: {
      from: string;
      to: string;
      label?: string;
      protocol?: string;
    }[];
  };
  codeSnippet: {
    language: string;
    filename: string;
    code: string;
  };
  featured: boolean;
  githubUrl?: string;
  liveDemoUrl?: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    projectId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    architectureOverview: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['RAG & AI', 'Distributed Microservices', 'Cloud Infrastructure', 'Real-time Systems'],
    },
    techStack: { type: [String], default: [] },
    metrics: { type: [MetricSchema], default: [] },
    keyHighlights: { type: [String], default: [] },
    diagram: { type: DiagramSchema, default: { nodes: [], links: [] } },
    codeSnippet: { type: CodeSnippetSchema, required: true },
    featured: { type: Boolean, default: false },
    githubUrl: { type: String },
    liveDemoUrl: { type: String },
  },
  {
    timestamps: true,
    collection: 'projects',
  }
);

// Indexes for common query patterns
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ featured: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
