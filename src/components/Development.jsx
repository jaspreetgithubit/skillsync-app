import React from 'react';
import { Code2, CheckCircle2 } from 'lucide-react';

export default function Development() {
  const points = [
    "Modern React 19 & Tailwind CSS v4 frontend with bespoke luxury dark mode.",
    "FastAPI & Node.js microservices executing high-dimensional vector cosine calculations.",
    "Zero demographic bias: heuristic algorithms evaluate purely on code velocity and skill complementarity.",
    "Sub-second cohort partitioning guaranteeing 100% full-stack capability coverage."
  ];

  return (
    <section className="py-24 border-t border-purple-500/20 text-slate-100 relative overflow-hidden" id="development">
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-xs font-mono text-amber-400 mb-6">
              <Code2 className="h-3.5 w-3.5" />
              <span>ENGINEERING & ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">How We Built This Platform</h2>
            <p className="mt-4 text-slate-300 leading-relaxed text-base font-normal">
              Built from the ground up as a high-performance modern web application. We focused heavily on clean UI patterns, robust backend microservices, and precise heuristic weighting.
            </p>
            
            <ul className="mt-8 space-y-4">
              {points.map((point, index) => (
                <li key={index} className="flex items-start space-x-3 text-sm text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lightning-card p-8 rounded-3xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/20 mb-6">
              <span className="text-xs font-mono text-slate-400">system-architecture.json</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-800/60">Production Ready</span>
            </div>
            <pre className="text-xs font-mono text-purple-200 overflow-x-auto leading-relaxed">
{`{
  "frontend": "React 19 + Tailwind CSS v4",
  "backend_runtime": "Node.js & Python (FastAPI)",
  "matching_algorithm": "Kuhn-Munkres + Cosine Tensors",
  "database": "PostgreSQL with pgvector",
  "deployment": "Cloud Scaled / Automated CI/CD",
  "pedigree_bias": "0.0%",
  "optimization_latency": "< 1.4s"
}`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}