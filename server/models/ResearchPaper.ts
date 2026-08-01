import mongoose, { Schema, Document } from 'mongoose';

// ─── Sub-schemas ───────────────────────────────────────────────

const BenchmarkDataPointSchema = new Schema(
  {
    label: { type: String, required: true },
    valueA: { type: Number, required: true },
    valueB: { type: Number, required: true },
  },
  { _id: false }
);

const BenchmarkDataSchema = new Schema(
  {
    metricName: { type: String, required: true },
    dataset: { type: [BenchmarkDataPointSchema], default: [] },
  },
  { _id: false }
);

// ─── Main ResearchPaper Schema ─────────────────────────────────

export interface IResearchPaper extends Document {
  paperId: string;
  title: string;
  subtitle: string;
  abstract: string;
  publishedDate: string;
  category: string;
  tags: string[];
  keyFindings: string[];
  benchmarkData: {
    metricName: string;
    dataset: {
      label: string;
      valueA: number;
      valueB: number;
    }[];
  };
  pdfUrl?: string;
  citation: string;
}

const ResearchPaperSchema = new Schema<IResearchPaper>(
  {
    paperId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    abstract: { type: String, required: true },
    publishedDate: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Vector DB Performance', 'Multi-Agent Graph', 'Microservices Resiliency', 'RAG Optimization'],
    },
    tags: { type: [String], default: [] },
    keyFindings: { type: [String], default: [] },
    benchmarkData: { type: BenchmarkDataSchema, required: true },
    pdfUrl: { type: String },
    citation: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'research_papers',
  }
);

// Index for category-based queries
ResearchPaperSchema.index({ category: 1 });

export const ResearchPaper = mongoose.model<IResearchPaper>('ResearchPaper', ResearchPaperSchema);
