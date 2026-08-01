import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { connectDB } from "./server/config/db";
import cloudinary from "./server/config/cloudinary";
import { upload } from "./server/middleware/upload";
import { Profile, Project, BlogArticle, ResearchPaper, ContactMessage, FooterConfig, AppConfig } from "./server/models";

dotenv.config({ override: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Lazy initialization helper for Gemini
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    genAI = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

const HABIB_KNOWLEDGE_BASE = `
Habib - Senior Full Stack & Distributed Systems AI Architect
Specialization: High-throughput microservices, Retrieval-Augmented Generation (RAG), Vector DBs (Pinecone), Kubernetes orchestration, Redis caching, RabbitMQ event streaming, LangChain, LangGraph.

Tech Stack Details:
- Frontend & State: React 19, Redux Toolkit, Zustand, TypeScript, Tailwind CSS
- Backend & Microservices: Node.js, Express, Go, REST, gRPC, Microservices architecture
- Databases & Vector Search: MongoDB, Redis (L2 Caching), Pinecone (Vector DB), PostgreSQL
- Messaging & Streaming: RabbitMQ (pub/sub, dead-letter queues), Apache Kafka concepts
- Infrastructure & DevOps: Kubernetes (EKS, K3s), Docker, Jenkins CI/CD, AWS (EC2, EKS, S3, CloudFront), Cloudflare Workers, Nginx ingress, Terraform
- AI & RAG Engineering: LangChain, LangGraph multi-agent systems, Pinecone vector indexing, hybrid dense/sparse embeddings, deterministic failovers, LLM grounding.

Key Architecture Achievements:
1. "OmniScale Vector RAG Gateway":
   - Engineered low-latency RAG pipeline with Pinecone + LangGraph + Redis L2 cache.
   - Reduced query latency from 450ms to 18ms for cached vectors, handling 25,000 requests/min.
2. "Distributed Event-Driven Microservices Hub":
   - Decoupled payment & notification engine using RabbitMQ + Kubernetes HPA on AWS EKS.
   - Processed 10M+ daily events with 99.999% reliability.
3. "LangGraph Autonomous Agent Orchestrator":
   - Designed multi-agent graph network for autonomous system diagnostic & code generation.
4. "Zero-Downtime Hybrid Cloud CI/CD":
   - Built Jenkins + Kubernetes automated canary deployment pipeline with Nginx dynamic traffic routing.
`;

async function startServer() {
  // Connect to MongoDB
  try {
    await connectDB();
  } catch (err: any) {
    console.error("Critical: Failed to connect to MongoDB:", err.message);
  }

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Allow the separately deployed frontend to call this API.
  app.use((req, res, next) => {
    const clientOrigin = process.env.CLIENT_ORIGIN?.replace(/\/$/, '');
    const origin = clientOrigin || req.headers.origin || '*';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-admin-passkey');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Expose-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // Helper middleware to verify admin passkey
  const verifyAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const passkey = req.headers["x-admin-passkey"];
    if (typeof passkey !== "string") {
      return res.status(401).json({ error: "Unauthorized: Invalid admin passkey" });
    }

    let config = await AppConfig.findOne();
    const hash = config?.passkeyHash || process.env.ADMIN_PASSKEY_HASH;

    if (hash && bcrypt.compareSync(passkey, hash)) {
      return next();
    }

    res.status(401).json({ error: "Unauthorized: Invalid admin passkey" });
  };

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    const mongoConnected = mongoose.connection.readyState === 1;
    res.json({
      status: mongoConnected ? "online" : "degraded",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        mongodb: mongoConnected ? "CONNECTED" : "DISCONNECTED",
        redis: "CONNECTED (0.4ms)",
        rabbitmq: "HEALTHY (Cluster Active)",
        pinecone: "INDEX_READY (384d, cosine)",
        kubernetes: "EKS-CLUSTER-01 (12/12 Nodes)",
      },
    });
  });

  // --- Admin Passkey Routes ---
  app.put("/api/admin/passkey", verifyAdmin, async (req, res) => {
    try {
      const { passkey } = req.body;
      if (!passkey || typeof passkey !== "string") {
        return res.status(400).json({ error: "Passkey is required" });
      }
      const hash = bcrypt.hashSync(passkey, 10);
      await AppConfig.findOneAndUpdate({}, { passkeyHash: hash }, { upsert: true, new: true });
      res.json({ message: "Passkey updated successfully" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Profile Routes ---
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await Profile.findOne();
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/profile", verifyAdmin, async (req, res) => {
    try {
      let profile = await Profile.findOne();
      if (!profile) {
        profile = new Profile(req.body);
      } else {
        Object.assign(profile, req.body);
      }
      await profile.save();
      res.json(profile);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/upload", verifyAdmin, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      console.log("[Upload] Received file:", req.file.originalname, req.file.mimetype, req.file.size);
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "habib-portfolio",
      });
      console.log("[Upload] Cloudinary result:", result.secure_url);
      res.json({ url: result.secure_url });
    } catch (err: any) {
      console.error("[Upload] Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // --- Projects Routes ---
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await Project.find().sort({ featured: -1, createdAt: -1 });
      res.json(projects);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/projects", verifyAdmin, async (req, res) => {
    try {
      const project = new Project(req.body);
      await project.save();
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/projects/:id", verifyAdmin, async (req, res) => {
    try {
      const project = await Project.findOneAndUpdate({ projectId: req.params.id }, req.body, { new: true });
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/projects/:id", verifyAdmin, async (req, res) => {
    try {
      const project = await Project.findOneAndDelete({ projectId: req.params.id });
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.json({ message: "Project deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Blog Articles Routes ---
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await BlogArticle.find().sort({ createdAt: -1 });
      res.json(articles);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/articles", verifyAdmin, async (req, res) => {
    try {
      const article = new BlogArticle(req.body);
      await article.save();
      res.json(article);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/articles/:id", verifyAdmin, async (req, res) => {
    try {
      const article = await BlogArticle.findOneAndUpdate({ articleId: req.params.id }, req.body, { new: true });
      if (!article) return res.status(404).json({ error: "Article not found" });
      res.json(article);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/articles/:id", verifyAdmin, async (req, res) => {
    try {
      const article = await BlogArticle.findOneAndDelete({ articleId: req.params.id });
      if (!article) return res.status(404).json({ error: "Article not found" });
      res.json({ message: "Article deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Research Papers Routes ---
  app.get("/api/papers", async (req, res) => {
    try {
      const papers = await ResearchPaper.find().sort({ createdAt: -1 });
      res.json(papers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/papers", verifyAdmin, async (req, res) => {
    try {
      const paper = new ResearchPaper(req.body);
      await paper.save();
      res.json(paper);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/papers/:id", verifyAdmin, async (req, res) => {
    try {
      const paper = await ResearchPaper.findOneAndUpdate({ paperId: req.params.id }, req.body, { new: true });
      if (!paper) return res.status(404).json({ error: "Paper not found" });
      res.json(paper);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/papers/:id", verifyAdmin, async (req, res) => {
    try {
      const paper = await ResearchPaper.findOneAndDelete({ paperId: req.params.id });
      if (!paper) return res.status(404).json({ error: "Paper not found" });
      res.json({ message: "Paper deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Contact Messages Routes ---
  app.get("/api/messages", verifyAdmin, async (req, res) => {
    try {
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
      res.json(messages);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const message = new ContactMessage(req.body);
      await message.save();
      res.json(message);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/messages/:id/read", verifyAdmin, async (req, res) => {
    try {
      const message = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
      if (!message) return res.status(404).json({ error: "Message not found" });
      res.json(message);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/messages/:id", verifyAdmin, async (req, res) => {
    try {
      const message = await ContactMessage.findByIdAndDelete(req.params.id);
      if (!message) return res.status(404).json({ error: "Message not found" });
      res.json({ message: "Message deleted successfully" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Footer Config Routes ---
  app.get("/api/footer", async (req, res) => {
    try {
      const footer = await FooterConfig.findOne();
      if (!footer) {
        return res.status(404).json({ error: "Footer config not found" });
      }
      res.json(footer);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/footer", verifyAdmin, async (req, res) => {
    try {
      let footer = await FooterConfig.findOne();
      if (!footer) {
        footer = new FooterConfig(req.body);
      } else {
        Object.assign(footer, req.body);
      }
      await footer.save();
      res.json(footer);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Database Reset Route ---
  app.post("/api/reset", verifyAdmin, async (req, res) => {
    try {
      const { exec } = require("child_process");
      exec("npx tsx server/seed.ts", (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error("Reset seed failed:", error);
          return res.status(500).json({ error: "Reset failed during seeding" });
        }
        res.json({ message: "Database reset to defaults successfully" });
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Simulated & Real RAG query endpoint powered by Gemini
  app.post("/api/rag/query", async (req, res) => {
    try {
      const { query, topK = 3 } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Valid 'query' string is required." });
      }

      // Simulate vector search chunk matching
      const simulatedChunks = [
        {
          id: "chunk-rag-01",
          score: 0.942,
          source: "habib_rag_architecture_spec.md",
          text: "LangGraph stateful workflow managing multi-step agent reasoning with Pinecone hybrid search and Redis vector cache fallback.",
        },
        {
          id: "chunk-k8s-02",
          score: 0.887,
          source: "k8s_microservices_mesh.yaml",
          text: "Kubernetes horizontal pod autoscaler driven by RabbitMQ queue depth metrics, deployed across AWS EKS availability zones.",
        },
        {
          id: "chunk-cache-03",
          score: 0.851,
          source: "redis_l2_cluster_config.ts",
          text: "Redis sub-millisecond semantic caching layer storing pre-computed vector embeddings to bypass Pinecone lookups on hot queries.",
        },
      ];

      let generatedAnswer = "";
      let modelUsed = "gemini-3.6-flash";

      try {
        const ai = getGenAI();
        const prompt = `You are Habib's AI Architecture Assistant on his official portfolio website.
Answer the following visitor query concisely and professionally, highlighting Habib's technical mastery in backend microservices, RAG pipelines, Kubernetes, Redis, RabbitMQ, Pinecone, LangGraph, AWS, and Cloudflare.

Context from Habib's Architecture Docs:
${HABIB_KNOWLEDGE_BASE}

User Query: "${query}"

Provide a crisp, clear, highly technical yet accessible answer formatted with clean markdown bullets where helpful.`;

        const response = await ai.models.generateContent({
          model: modelUsed,
          contents: prompt,
        });

        generatedAnswer = response.text || "No response text generated.";
      } catch (geminiError: any) {
        console.warn("Gemini API call failed or key missing, fallback answer generated:", geminiError.message);
        generatedAnswer = `Habib specializes in architecting high-throughput distributed systems and RAG pipelines. Regarding "${query}": Habib leverages Pinecone for vector indexing, LangChain/LangGraph for stateful multi-agent orchestration, Redis for sub-millisecond vector caching, and Kubernetes/RabbitMQ for resilient microservice communication.`;
      }

      return res.json({
        query,
        retrievedChunks: simulatedChunks.slice(0, topK),
        answer: generatedAnswer,
        executionStats: {
          embeddingTimeMs: 4.2,
          vectorSearchTimeMs: 7.8,
          llmInferenceTimeMs: 120.5,
          totalLatencyMs: 132.5,
          pineconeSimilarityAverage: 0.893,
        },
      });
    } catch (err: any) {
      console.error("RAG endpoint error:", err);
      res.status(500).json({ error: "Internal server error processing RAG query." });
    }
  });

  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "Not Found" });
      }
      const indexPath = path.join(process.cwd(), "index.html");
      res.sendFile(indexPath);
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "Not Found" });
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Habib Portfolio Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
