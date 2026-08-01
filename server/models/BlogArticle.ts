import mongoose, { Schema, Document } from 'mongoose';

// ─── Sub-schema ────────────────────────────────────────────────

const AuthorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
  },
  { _id: false }
);

// ─── Main BlogArticle Schema ──────────────────────────────────

export interface IBlogArticle extends Document {
  articleId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
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

const BlogArticleSchema = new Schema<IBlogArticle>(
  {
    articleId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['RAG Architecture', 'Kubernetes & DevOps', 'Distributed Systems', 'Backend Performance'],
    },
    readTime: { type: String, required: true },
    publishedAt: { type: String, required: true },
    author: { type: AuthorSchema, required: true },
    tags: { type: [String], default: [] },
    views: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    collection: 'blog_articles',
  }
);

// Indexes for common query patterns
BlogArticleSchema.index({ category: 1 });
BlogArticleSchema.index({ tags: 1 });

export const BlogArticle = mongoose.model<IBlogArticle>('BlogArticle', BlogArticleSchema);
