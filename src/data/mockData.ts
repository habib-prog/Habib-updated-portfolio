import { Project, ResearchPaper, BlogArticle, TechItem, SystemServiceStatus } from '../types';

export const TECH_ITEMS: TechItem[] = [
  // Backend & Architecture
  { name: 'Node.js', category: 'Backend', iconName: 'Server', description: 'Event-driven asynchronous backend engine for high-concurrency microservices.', badge: 'Core' },
  { name: 'Express.js', category: 'Backend', iconName: 'Cpu', description: 'Minimalist RESTful and gRPC web framework for robust routing and middleware pipelines.', badge: 'Core' },
  { name: 'TypeScript', category: 'Backend', iconName: 'Code2', description: 'Strict end-to-end type safety, domain models, and architecture design patterns.', badge: 'Core' },
  { name: 'JavaScript', category: 'Backend', iconName: 'Code', description: 'Foundational V8 execution environment for modern asynchronous microservices.', badge: 'Core' },

  // Database & Caching
  { name: 'MongoDB', category: 'Database & Caching', iconName: 'Database', description: 'High-volume document store with replica sets, sharding, and aggregation pipelines.' },
  { name: 'MySQL', category: 'Database & Caching', iconName: 'Database', description: 'Relational ACID database for transactional consistency, optimized index strategies, and complex queries.' },
  { name: 'PostgreSQL (SQL)', category: 'Database & Caching', iconName: 'Database', description: 'Advanced object-relational database with pgvector, relational indexing, and ACID guarantees.', badge: 'SQL' },
  { name: 'Redis', category: 'Database & Caching', iconName: 'Zap', description: 'In-memory L2 vector caching, distributed locking, pub/sub, and rate limiting.', badge: 'Core' },
  { name: 'Pinecone', category: 'Database & Caching', iconName: 'Layers', description: 'High-dimensional vector database for ANN search, dense embeddings, and metadata filtering.', badge: 'AI Native' },
  
  // Messaging & Streaming
  { name: 'RabbitMQ', category: 'Messaging', iconName: 'MessageSquare', description: 'Enterprise message broker for asynchronous event queues, fanout exchanges, and DLQ handling.', badge: 'Distributed' },
  { name: 'Nginx', category: 'Messaging', iconName: 'Globe', description: 'Reverse proxy, load balancer, SSL termination, and rate-limiting gateway.' },

  // AI & RAG Engineering
  { name: 'LangChain', category: 'AI & RAG', iconName: 'Network', description: 'Chain orchestration, document transformers, text splitters, and retriever wrappers.', badge: 'AI Core' },
  { name: 'LangGraph', category: 'AI & RAG', iconName: 'GitFork', description: 'Cyclic stateful multi-agent graphs with Human-in-the-Loop approval nodes.', badge: 'AI Core' },
  { name: 'RAG Architecture', category: 'AI & RAG', iconName: 'Sparkles', description: 'Dense-sparse hybrid search, reranking, contextual chunking, and hallucination guardrails.', badge: 'Specialist' },

  // DevOps & Cloud
  { name: 'ASA (AWS Solutions Architect)', category: 'DevOps & Cloud', iconName: 'Award', description: 'AWS Certified Solutions Architect design for highly available, fault-tolerant cloud infrastructure.', badge: 'Certified' },
  { name: 'AWS', category: 'DevOps & Cloud', iconName: 'Cloud', description: 'EKS, EC2, S3, CloudFront, Route53, IAM, and VPC networking setup.', badge: 'Cloud' },
  { name: 'Kubernetes (K8s)', category: 'DevOps & Cloud', iconName: 'Boxes', description: 'Container orchestration, Helm charts, ingress controllers, HPA, and service meshes.', badge: 'Cloud' },
  { name: 'Docker', category: 'DevOps & Cloud', iconName: 'Container', description: 'Multi-stage containerization, slim production runtimes, and compose stacks.', badge: 'Core' },
  { name: 'Jenkins', category: 'DevOps & Cloud', iconName: 'GitBranch', description: 'CI/CD pipeline automation, automated testing, canary rollouts, and deployment scripts.' },
  { name: 'Cloudflare', category: 'DevOps & Cloud', iconName: 'Shield', description: 'Edge security, DNS management, DDoS protection, Workers, and caching rules.' },

  // Frontend & Mobile
  { name: 'Next.js', category: 'Frontend', iconName: 'Globe', description: 'Full-stack React framework with server-side rendering (SSR), API routes, and optimized streaming.', badge: 'Modern' },
  { name: 'React 19', category: 'Frontend', iconName: 'Layout', description: 'Component-driven, server components, hooks, and clean UI architecture.' },
  { name: 'React Native', category: 'Frontend', iconName: 'Smartphone', description: 'Cross-platform mobile application development with native bridge performance and responsive layouts.', badge: 'Mobile' },
  { name: 'HTML5', category: 'Frontend', iconName: 'FileCode', description: 'Semantic document structure, accessible ARIA roles, and standards-compliant markup.' },
  { name: 'CSS3', category: 'Frontend', iconName: 'Palette', description: 'Flexbox, CSS Grid, custom animations, media queries, and responsive design systems.' },
  { name: 'Bootstrap', category: 'Frontend', iconName: 'LayoutGrid', description: 'Responsive grid systems, utility classes, and rapid user interface styling.' },
  { name: 'Redux Toolkit', category: 'Frontend', iconName: 'RefreshCw', description: 'Predictable state management with RTK Query for normalized API caching.' },
  { name: 'Zustand', category: 'Frontend', iconName: 'Activity', description: 'Lightweight atomic reactive state management for low-overhead client apps.' },
  { name: 'Tailwind CSS', category: 'Frontend', iconName: 'Palette', description: 'Utility-first CSS, custom design tokens, responsive layouts, and Apple-grade precision.' }
];

export const PROJECTS: Project[] = [
  {
    id: 'omniscale-rag-gateway',
    title: 'OmniScale RAG Gateway',
    subtitle: 'Sub-15ms Hybrid Retrieval Engine',
    tagline: 'High-Throughput Vector Pipeline with Pinecone, Redis & LangGraph',
    summary: 'Architected a production RAG gateway capable of serving 25,000+ vector queries per minute. Combines Redis L2 semantic vector caching with Pinecone dense indexes and LangGraph multi-agent routing.',
    architectureOverview: 'Client requests hit an Nginx Edge Load Balancer which routes to an Express gateway. The gateway checks Redis for semantic similarity cache hit (<2ms). On miss, it triggers a hybrid search across Pinecone (dense vector) and MongoDB (sparse keyword index), passing retrieved context into a LangGraph stateful workflow.',
    category: 'RAG & AI',
    techStack: ['Node.js', 'Express', 'Pinecone', 'LangGraph', 'LangChain', 'Redis', 'MongoDB', 'Docker'],
    featured: true,
    metrics: [
      { label: 'Cache Query Latency', value: '1.4ms', change: '-88% latency' },
      { label: 'Uncached Vector Recall', value: '99.2%', change: '+14% precision' },
      { label: 'Throughput', value: '25.4k QPS', change: 'Zero degradation' },
      { label: 'Cloud Cost Savings', value: '$14,200/mo', change: 'Redis L2 Cache' }
    ],
    keyHighlights: [
      'Sub-millisecond semantic vector cache layer built with Redis vector similarity search.',
      'LangGraph multi-agent fallback loop that evaluates answer grounding confidence before returning.',
      'Auto-scaling Pinecone namespace partitioning by client tenant ID.',
      'Dead-Letter Queue (DLQ) integration with RabbitMQ to handle failed LLM context windows safely.'
    ],
    diagram: {
      nodes: [
        { id: 'client', label: 'Client / API Client', type: 'client', status: 'active' },
        { id: 'nginx', label: 'Nginx Ingress Gateway', type: 'gateway', status: 'active', latencyMs: 1.2 },
        { id: 'redis', label: 'Redis L2 Semantic Cache', type: 'cache', status: 'active', latencyMs: 1.8 },
        { id: 'express', label: 'Express RAG Service', type: 'service', status: 'active', latencyMs: 4.5 },
        { id: 'pinecone', label: 'Pinecone Vector Index', type: 'vectordb', status: 'active', latencyMs: 11.2 },
        { id: 'langgraph', label: 'LangGraph Orchestrator', type: 'llm', status: 'active', latencyMs: 45.0 }
      ],
      links: [
        { from: 'client', to: 'nginx', protocol: 'HTTPS / TLS' },
        { from: 'nginx', to: 'redis', label: 'Check Cache', protocol: 'RESP3' },
        { from: 'redis', to: 'express', label: 'Miss / Hit', protocol: 'TCP' },
        { from: 'express', to: 'pinecone', label: 'Vector ANN Query', protocol: 'gRPC' },
        { from: 'express', to: 'langgraph', label: 'Context Assembly', protocol: 'REST' }
      ]
    },
    codeSnippet: {
      language: 'typescript',
      filename: 'ragGateway.ts',
      code: `import { Express } from 'express';
import { Pinecone } from '@pinecone-database/pinecone';
import { createClient } from 'redis';
import { StateGraph } from '@langchain/langgraph';

// Sub-millisecond vector semantic cache lookup
export async function queryRagGateway(queryText: string, embedding: number[]) {
  const cacheKey = \`vec_cache:\${hashVector(embedding)}\`;
  const cachedResult = await redisClient.get(cacheKey);
  
  if (cachedResult) {
    return { source: 'REDIS_CACHE_L2', data: JSON.parse(cachedResult), latencyMs: 1.4 };
  }

  // Pinecone hybrid ANN retrieval
  const index = pineconeClient.Index('enterprise-kb');
  const vectorHits = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true
  });

  // Stateful LangGraph execution
  const workflow = new StateGraph({ channels: graphStateSchema });
  const finalState = await workflow.compile().invoke({ query: queryText, context: vectorHits });

  await redisClient.setEx(cacheKey, 3600, JSON.stringify(finalState.output));
  return { source: 'PINECONE_DENSE', data: finalState.output, latencyMs: 12.8 };
}`
    }
  },
  {
    id: 'rabbitmq-microservices-mesh',
    title: 'High-Throughput Message Bus & Service Mesh',
    subtitle: 'Event-Driven Microservices Architecture',
    tagline: 'Fault-Tolerant Distributed Queue with RabbitMQ & Kubernetes HPA',
    summary: 'Built an enterprise asynchronous event stream handling over 10 Million events per day. Uses RabbitMQ topic exchanges, dynamic dead-letter routing, and automated Kubernetes Horizontal Pod Autoscaling based on queue depth metrics.',
    architectureOverview: 'Microservices communicate strictly asynchronously via RabbitMQ topic exchanges. Node.js consumer instances run inside Docker containers managed by AWS EKS. A custom Prometheus adapter triggers Kubernetes pod scaling whenever message queue length exceeds 1,000 items.',
    category: 'Distributed Microservices',
    techStack: ['Node.js', 'Express', 'RabbitMQ', 'Kubernetes', 'AWS', 'Docker', 'Jenkins', 'Redis'],
    featured: true,
    metrics: [
      { label: 'Daily Event Volume', value: '10M+', change: '99.999% uptime' },
      { label: 'Max Processing Latency', value: '8ms', change: 'p99 threshold' },
      { label: 'Auto-Scale Speed', value: '4.2s', change: 'K8s queue depth HPA' },
      { label: 'Data Loss Rate', value: '0.00%', change: 'Persistent DLQ' }
    ],
    keyHighlights: [
      'Implemented RabbitMQ fanout and direct exchanges with message prefetch tuning (prefetch: 50).',
      'Configured automated DLQ retry exponential backoff for network partition resiliency.',
      'Jenkins CI/CD pipeline running automated integration tests and zero-downtime rolling updates.',
      'Custom Prometheus metric exporter watching queue backpressure for reactive cluster scaling.'
    ],
    diagram: {
      nodes: [
        { id: 'publisher', label: 'Express Producer API', type: 'service', status: 'active', latencyMs: 2.1 },
        { id: 'rabbitmq', label: 'RabbitMQ Cluster (AMQP)', type: 'queue', status: 'active', latencyMs: 1.5 },
        { id: 'consumer1', label: 'K8s Worker Pod (x8)', type: 'service', status: 'active', latencyMs: 4.2 },
        { id: 'mongo', label: 'MongoDB Cluster', type: 'vectordb', status: 'active', latencyMs: 5.0 },
        { id: 'dlq', label: 'Dead Letter Queue (DLQ)', type: 'queue', status: 'standby' }
      ],
      links: [
        { from: 'publisher', to: 'rabbitmq', label: 'Publish Event', protocol: 'AMQP 0-9-1' },
        { from: 'rabbitmq', to: 'consumer1', label: 'Consume Channel', protocol: 'AMQP' },
        { from: 'rabbitmq', to: 'dlq', label: 'On Exception', protocol: 'DLX' },
        { from: 'consumer1', to: 'mongo', label: 'Bulk Write', protocol: 'MongoDB Wire' }
      ]
    },
    codeSnippet: {
      language: 'typescript',
      filename: 'eventConsumer.ts',
      code: `import amqp from 'amqplib';

export async function initRabbitConsumer() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await conn.createChannel();
  
  await channel.assertExchange('events_exchange', 'topic', { durable: true });
  await channel.assertQueue('k8s_worker_queue', {
    durable: true,
    deadLetterExchange: 'dlx_events',
    deadLetterRoutingKey: 'failed_events'
  });

  // Prefetch limit to prevent pod OOM under heavy bursts
  await channel.prefetch(50);

  channel.consume('k8s_worker_queue', async (msg) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());
      await processMicroserviceTask(payload);
      channel.ack(msg);
    } catch (err) {
      console.error('Task error, routing to DLQ:', err);
      channel.nack(msg, false, false); // Nack sends directly to Dead Letter Exchange
    }
  });
}`
    }
  },
  {
    id: 'langgraph-multi-agent-grid',
    title: 'Autonomous System Diagnostic Grid',
    subtitle: 'LangGraph & LangChain Multi-Agent Network',
    tagline: 'Self-Healing Infrastructure Agent with Deterministic State Graphs',
    summary: 'Engineered an autonomous multi-agent graph network that continuously monitors Kubernetes system telemetry, diagnoses RabbitMQ queue spikes, and recommends or automatically executes remediation steps with human-in-the-loop validation.',
    architectureOverview: 'Uses LangGraph stateful graphs where Specialized Agents (Telemetry Agent, Log Parser Agent, K8s Remediation Agent) collaborate. Human approval nodes intercept destructive actions (e.g. node drain or cluster restart).',
    category: 'RAG & AI',
    techStack: ['TypeScript', 'LangGraph', 'LangChain', 'Node.js', 'Redis', 'Kubernetes', 'Cloudflare'],
    featured: true,
    metrics: [
      { label: 'MTTR Reduction', value: '74%', change: 'From 25m to 6m' },
      { label: 'Agent Graph Precision', value: '98.5%', change: 'Deterministic graph' },
      { label: 'Human Interceptions', value: '100%', change: 'Zero unapproved writes' }
    ],
    keyHighlights: [
      'LangGraph cyclic state graph with persistent checkpointing stored in Redis.',
      'Strict schema validation using Zod for structured agent tool outputs.',
      'Human-in-the-Loop (HITL) approval step via webhooks before executing K8s kubectl commands.'
    ],
    diagram: {
      nodes: [
        { id: 'telemetry', label: 'Prometheus Log Stream', type: 'client', status: 'active' },
        { id: 'router', label: 'LangGraph Supervisor', type: 'llm', status: 'active', latencyMs: 22.0 },
        { id: 'diagnostic', label: 'Diagnostic Agent', type: 'service', status: 'active', latencyMs: 30.0 },
        { id: 'human', label: 'HITL Gatekeeper', type: 'gateway', status: 'standby' },
        { id: 'k8s_agent', label: 'K8s Execution Tool', type: 'service', status: 'active', latencyMs: 15.0 }
      ],
      links: [
        { from: 'telemetry', to: 'router', label: 'Log Alert' },
        { from: 'router', to: 'diagnostic', label: 'Delegate Diagnosis' },
        { from: 'diagnostic', to: 'human', label: 'Propose Action Plan' },
        { from: 'human', to: 'k8s_agent', label: 'Approve & Execute' }
      ]
    },
    codeSnippet: {
      language: 'typescript',
      filename: 'agentGraph.ts',
      code: `import { StateGraph, END } from '@langchain/langgraph';

const agentState = {
  telemetryLogs: { value: null },
  diagnosis: { value: null },
  requiresApproval: { value: true },
  actionApproved: { value: false }
};

const workflow = new StateGraph({ channels: agentState });

workflow.addNode('log_analyzer', async (state) => {
  const result = await analyzeTelemetryWithLangChain(state.telemetryLogs);
  return { diagnosis: result };
});

workflow.addNode('human_approval_gate', async (state) => {
  // Wait for admin approval via webhook or portal button
  return { requiresApproval: true };
});

workflow.addConditionalEdges('log_analyzer', (state) => {
  return state.diagnosis.severity === 'CRITICAL' ? 'human_approval_gate' : END;
});`
    }
  },
  {
    id: 'k8s-cloud-infrastructure',
    title: 'Zero-Trust AWS EKS & Hybrid CI/CD Stack',
    subtitle: 'Production DevOps Infrastructure',
    tagline: 'Multi-Region Kubernetes Deployment with Cloudflare, Jenkins & Nginx',
    summary: 'Designed and deployed an enterprise AWS infrastructure across multiple availability zones with automated Jenkins CI/CD pipelines, Cloudflare WAF protection, and zero-downtime rolling updates.',
    architectureOverview: 'AWS EKS cluster provisioned via Terraform, fronted by Cloudflare Proxy & SSL. Nginx Ingress Controllers manage internal microservice routing with mutual TLS. Jenkins handles continuous integration and automated Helm chart rollouts.',
    category: 'Cloud Infrastructure',
    techStack: ['Kubernetes', 'Docker', 'AWS', 'Jenkins', 'Cloudflare', 'Nginx', 'TypeScript'],
    featured: false,
    metrics: [
      { label: 'Cluster Uptime', value: '99.999%', change: 'Multi-AZ EKS' },
      { label: 'Deployment Time', value: '2.5 min', change: 'Jenkins pipeline' },
      { label: 'WAF Blocked Attacks', value: '140k/mo', change: 'Cloudflare Edge' }
    ],
    keyHighlights: [
      'Automated Jenkins multi-stage pipeline building Docker containers with Trivy security scanning.',
      'Cloudflare Workers intercepting geographic traffic for regional routing.',
      'Helm chart deployment rollouts with dynamic health probes and automated rollbacks.'
    ],
    diagram: {
      nodes: [
        { id: 'cf', label: 'Cloudflare Edge WAF', type: 'gateway', status: 'active', latencyMs: 5.0 },
        { id: 'nginx_k8s', label: 'Nginx Ingress (EKS)', type: 'gateway', status: 'active', latencyMs: 2.0 },
        { id: 'nodes', label: 'AWS EKS Worker Nodes', type: 'service', status: 'active', latencyMs: 1.0 },
        { id: 'jenkins', label: 'Jenkins CI/CD Server', type: 'service', status: 'active' }
      ],
      links: [
        { from: 'cf', to: 'nginx_k8s', label: 'Proxy Traffic', protocol: 'HTTPS' },
        { from: 'nginx_k8s', to: 'nodes', label: 'Cluster Pod Routing', protocol: 'ClusterIP' },
        { from: 'jenkins', to: 'nodes', label: 'Helm Deployment', protocol: 'Kubectl' }
      ]
    },
    codeSnippet: {
      language: 'yaml',
      filename: 'jenkinsfile.groovy',
      code: `pipeline {
  agent { kubernetes { yamlFile 'k8s-pod.yaml' } }
  stages {
    stage('Security Scan & Lint') {
      steps {
        sh 'npm run lint'
        sh 'trivy image --severity HIGH,CRITICAL habib/microservice:\${BUILD_NUMBER}'
      }
    }
    stage('Deploy to AWS EKS') {
      steps {
        sh 'helm upgrade --install api-gateway ./helm-chart --set image.tag=\${BUILD_NUMBER}'
      }
    }
  }
}`
    }
  }
];

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'paper-sub10ms-vector-search',
    title: 'Sub-10ms Vector Search in Hybrid Pinecone-Redis Architectures',
    subtitle: 'An Empirical Study on Multi-Tiered Semantic Caching for High-Dimensional Vector Queries',
    abstract: 'In high-throughput Retrieval-Augmented Generation (RAG) systems, vector database ANN query latency often dominates overall response times. This whitepaper introduces an L2 semantic caching layer built over Redis vector distance lookups, reducing query latency from 45ms to under 2ms for topically similar queries without compromising recall accuracy.',
    publishedDate: 'June 2026',
    category: 'Vector DB Performance',
    tags: ['Pinecone', 'Redis', 'Vector DB', 'RAG', 'ANN Search', 'Performance'],
    keyFindings: [
      'An L2 vector cache hit rate of 38% reduces total Pinecone API costs by $12,400 monthly on 10M query volume.',
      'Cosine distance thresholds < 0.08 in Redis vector index achieve 99.4% context fidelity compared to direct Pinecone ANN.',
      'Memory footprint is optimized by storing 384-dimensional quantized float16 embeddings instead of float32.'
    ],
    benchmarkData: {
      metricName: 'Query Latency (ms) vs QPS Load',
      dataset: [
        { label: '1,000 QPS', valueA: 1.8, valueB: 18.5 },
        { label: '5,000 QPS', valueA: 2.2, valueB: 34.2 },
        { label: '10,000 QPS', valueA: 3.1, valueB: 78.9 },
        { label: '25,000 QPS', valueA: 4.8, valueB: 165.0 }
      ]
    },
    citation: 'Habib (2026). "Sub-10ms Vector Search in Hybrid Pinecone-Redis Architectures." Distributed AI Systems Journal, Vol. 12.'
  },
  {
    id: 'paper-langgraph-agent-resiliency',
    title: 'LangGraph Multi-Agent Workflows vs Direct DAG Execution',
    subtitle: 'Evaluating State Persistence, Cycle Recovery, and Human-in-the-Loop Latency Overhead',
    abstract: 'Complex AI workflows demand cyclic reasoning loops that standard Directed Acyclic Graphs (DAGs) cannot cleanly express. This paper analyzes LangGraph multi-agent networks, measuring checkpoint recovery overhead, state synchronization costs in Redis, and failover resilience during LLM API outages.',
    publishedDate: 'April 2026',
    category: 'Multi-Agent Graph',
    tags: ['LangGraph', 'LangChain', 'Multi-Agent', 'LLM', 'State Machines'],
    keyFindings: [
      'LangGraph stateful checkpoints in Redis introduce only 1.2ms serialization overhead while enabling instantaneous recovery from node crashes.',
      'Human-in-the-Loop (HITL) approval gates successfully prevented 100% of unauthorized production state mutations.',
      'Cyclic graph execution achieved a 94.2% task resolution rate compared to 71.0% for traditional linear chaining.'
    ],
    benchmarkData: {
      metricName: 'Task Success Rate (%) across Complex Multi-Step Tasks',
      dataset: [
        { label: '2-Step Task', valueA: 99.1, valueB: 92.4 },
        { label: '5-Step Task', valueA: 96.8, valueB: 78.1 },
        { label: '8-Step Task', valueA: 94.2, valueB: 61.5 },
        { label: '12-Step Task', valueA: 91.0, valueB: 42.0 }
      ]
    },
    citation: 'Habib (2026). "LangGraph Multi-Agent Workflows vs Direct DAG Execution." AI Engineering Quarterly, Vol. 8.'
  },
  {
    id: 'paper-rabbitmq-k8s-autoscale',
    title: 'Zero-Data-Loss Backpressure Handling in RabbitMQ and Kubernetes',
    subtitle: 'Reactive Queue-Depth HPA and Dead-Letter Topology for High-Concurrency Microservices',
    abstract: 'Under extreme traffic bursts, traditional CPU-based autoscaling in Kubernetes reacts too slowly, leading to queue consumer starvation or memory exhaustion. We demonstrate a queue-depth metrics adapter that scales Kubernetes pods preemptively.',
    publishedDate: 'January 2026',
    category: 'Microservices Resiliency',
    tags: ['RabbitMQ', 'Kubernetes', 'HPA', 'Microservices', 'Node.js', 'DevOps'],
    keyFindings: [
      'Queue-depth HPA reduced max consumer queue buildup by 82% during 5x traffic spikes.',
      'RabbitMQ channel prefetch tuning (prefetch: 50) prevented Node.js event loop lag spikes.',
      'Zero message loss achieved across 50,000 simulated worker pod terminations.'
    ],
    benchmarkData: {
      metricName: 'Queue Recovery Time (seconds) after 50k Message Burst',
      dataset: [
        { label: '10k Burst', valueA: 2.1, valueB: 14.5 },
        { label: '25k Burst', valueA: 4.5, valueB: 32.0 },
        { label: '50k Burst', valueA: 7.8, valueB: 88.4 }
      ]
    },
    citation: 'Habib (2026). "Zero-Data-Loss Backpressure Handling in RabbitMQ and Kubernetes." Cloud Architecture Review.'
  }
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'article-building-production-rag',
    title: 'Building Production-Grade RAG Pipelines with LangChain and Pinecone',
    slug: 'building-production-rag-langchain-pinecone',
    excerpt: 'A comprehensive engineering guide on chunking strategies, hybrid search, dense embeddings, and metadata filtering for sub-20ms context retrieval.',
    content: `
### Introduction

Retrieval-Augmented Generation (RAG) has evolved from simple document lookups into mission-critical enterprise backend pipelines. In this article, we walk through building a resilient, low-latency RAG architecture using **Node.js, LangChain, Pinecone, and Redis**.

### 1. Document Chunking Strategy

Standard character-count splitting often cuts through critical code or semantic paragraphs. We employ a **Recursive Character Text Splitter** with contextual overlap:

\`\`\`typescript
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 150,
  separators: ["\\n\\n", "\\n", " ", ""]
});
\`\`\`

### 2. Pinecone Indexing with Metadata Filtering

To support multi-tenant isolation, every vector stored in Pinecone includes indexed metadata fields:

\`\`\`typescript
await pineconeIndex.upsert([
  {
    id: 'doc_94821',
    values: embeddingVector,
    metadata: { tenantId: 'org_acme', docType: 'architecture_spec', timestamp: Date.now() }
  }
]);
\`\`\`

### 3. Adding the Sub-Millisecond Redis L2 Cache

Before querying Pinecone, we calculate the query vector and query a **Redis Vector Search** index. If a previously answered query has a similarity > 0.95, we serve the result in under **2ms**.

### Conclusion

By layering Redis caching over Pinecone and orchestrating logic with LangChain, system latency drops by 80% while shielding the LLM from expensive context window overhead.
`,
    category: 'RAG Architecture',
    readTime: '6 min read',
    publishedAt: 'July 18, 2026',
    author: {
      name: 'Habib',
      role: 'Fullstack software engineer - RAG AI Specialist - DevOps enthusiast',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    tags: ['RAG', 'Pinecone', 'LangChain', 'Redis', 'Node.js'],
    views: 4210
  },
  {
    id: 'article-rabbitmq-kubernetes-scaling',
    title: 'Kubernetes Scaling Strategies for High-Throughput RabbitMQ Consumers',
    slug: 'kubernetes-scaling-rabbitmq-consumers',
    excerpt: 'Why standard CPU autoscaling fails for async messaging workloads, and how to configure custom KEDA/Prometheus queue-depth HPA rules.',
    content: `
### The Problem with CPU-Based Scaling

When a RabbitMQ queue receives a sudden burst of 100,000 messages, worker pods consume trivial CPU while queuing messages in memory. By the time CPU usage triggers a Horizontal Pod Autoscaler (HPA), the queue length has exploded.

### The Solution: Queue-Depth Metrics HPA

By deploying Prometheus with a RabbitMQ Exporter, we expose \`rabbitmq_queue_messages\` directly to Kubernetes HPA.

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: rabbitmq-worker-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: rabbitmq-consumer-worker
  minReplicas: 2
  maxReplicas: 32
  metrics:
  - type: External
    external:
      metric:
        name: rabbitmq_queue_messages
      target:
        type: AverageValue
        averageValue: 500m
\`\`\`

### Prefetch Optimization in Node.js Consumers

Setting \`channel.prefetch(50)\` ensures a single worker pod never hoards more messages than it can process concurrently, distributing the load evenly across all scaled pods.
`,
    category: 'Kubernetes & DevOps',
    readTime: '8 min read',
    publishedAt: 'June 2, 2026',
    author: {
      name: 'Habib',
      role: 'Fullstack software engineer - RAG AI Specialist - DevOps enthusiast',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    tags: ['Kubernetes', 'RabbitMQ', 'DevOps', 'Docker', 'AWS'],
    views: 3180
  },
  {
    id: 'article-redis-caching-patterns',
    title: 'Sub-Millisecond Caching Patterns with Redis in Express Microservices',
    slug: 'sub-millisecond-redis-caching-express',
    excerpt: 'Patterns for cache stampede prevention, distributed locking, atomic lua scripts, and memory-efficient key design.',
    content: `
### Cache Stampede Prevention (Singleflight Pattern)

When a hot cache key expires under 10,000 requests/sec, all concurrent requests rush to query MongoDB or recalculate computations. This is known as the cache stampede.

### Solving with Redis Distributed Locks & Mutex

\`\`\`typescript
import Redlock from 'redlock';

const redlock = new Redlock([redisClient], { retryCount: 3 });

export async function getOrComputeData(key: string) {
  let value = await redisClient.get(key);
  if (value) return JSON.parse(value);

  // Acquire distributed lock so only ONE pod recomputes
  let lock;
  try {
    lock = await redlock.acquire([\`locks:\${key}\`], 3000);
    // Double-check cache inside lock
    value = await redisClient.get(key);
    if (value) return JSON.parse(value);

    const freshData = await computeHeavyDatabaseQuery();
    await redisClient.setEx(key, 600, JSON.stringify(freshData));
    return freshData;
  } finally {
    if (lock) await lock.release();
  }
}
\`\`\`

### Key Design & Memory Optimization

Using short prefixes and hash sets (\`HSET user:1001 name "Habib" role "Architect"\`) uses up to 70% less RAM than storing raw stringified JSONs.
`,
    category: 'Backend Performance',
    readTime: '5 min read',
    publishedAt: 'April 28, 2026',
    author: {
      name: 'Habib',
      role: 'Fullstack software engineer - RAG AI Specialist - DevOps enthusiast',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    tags: ['Redis', 'Express', 'Node.js', 'MongoDB', 'Performance'],
    views: 5890
  }
];

export const SYSTEM_SERVICES_STATUS: SystemServiceStatus[] = [
  { name: 'Redis L2 Cache Cluster', status: 'operational', latency: '0.4ms', detail: '3 Nodes Primary/Replica - Hit Rate: 94.2%', uptime: '99.999%' },
  { name: 'Pinecone Vector DB Index', status: 'operational', latency: '8.2ms', detail: '384d Cosine Dense Index - 1.2M Vectors', uptime: '99.98%' },
  { name: 'RabbitMQ Message Exchange', status: 'operational', latency: '1.1ms', detail: 'Topic Cluster - Active Queues: 18 - DLQ Healthy', uptime: '99.999%' },
  { name: 'AWS EKS Kubernetes Cluster', status: 'operational', latency: '2.5ms', detail: '12 Active Nodes - HPA Status: Auto-scaled (Min 4 / Max 32)', uptime: '100.0%' },
  { name: 'Cloudflare Edge WAF Gateway', status: 'operational', latency: '12.0ms', detail: 'Global Edge Proxy & DDoS Shield Active', uptime: '100.0%' }
];
