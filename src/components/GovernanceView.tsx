import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  BookOpen,
  Layers,
  CheckCircle2,
  ExternalLink,
  Lock,
  GitBranch
} from 'lucide-react';
import { GOVERNANCE_DOCS, GovernanceDoc } from '../data/governanceData';

export const GovernanceView: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<GovernanceDoc>(GOVERNANCE_DOCS[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-white">
              T&F Engineering Standard & Governance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/20">
              Reference Implementation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Architecture documentation, security policy, roadmap, ADRs, and tf-standard-kit governance compliance.
          </p>
        </div>
      </div>

      {/* Main Grid: Doc Selector + Markdown Renderer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Doc List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Governance Documentation
            </h3>
            <p className="text-[11px] text-slate-400">
              tf-standard-kit specifications applied to PropOS
            </p>
          </div>

          <div className="space-y-2">
            {GOVERNANCE_DOCS.map(doc => {
              const isSelected = selectedDoc.id === doc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{doc.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                      {doc.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{doc.summary}</p>
                </div>
              );
            })}
          </div>

          {/* T&F Ecosystem Box */}
          <div className="pt-4 border-t border-slate-800 text-xs space-y-2">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
              T&F Architecture Alignment
            </span>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
              <p>• <strong>Product Layer</strong>: PropOS-v2</p>
              <p>• <strong>Governance Standard</strong>: tf-standard-kit</p>
              <p>• <strong>Parent Organization</strong>: T&F Investments & Holdings LLC</p>
            </div>
          </div>
        </div>

        {/* Right Column: Doc Renderer (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-indigo-400">
                {selectedDoc.filename}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">{selectedDoc.title}</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 font-mono text-xs border border-indigo-500/20">
              Verified Compliant
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 overflow-x-auto text-slate-200 text-xs leading-relaxed space-y-3 font-sans">
            <div className="whitespace-pre-wrap font-mono text-[11px] text-slate-300">
              {selectedDoc.markdownContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
