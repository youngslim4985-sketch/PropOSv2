import React, { useState } from 'react';
import {
  FolderKanban,
  FileText,
  Upload,
  Bot,
  Sparkles,
  CheckCircle2,
  Calendar,
  Eye,
  FileCheck,
  Loader2,
  Search
} from 'lucide-react';
import { store } from '../services/store';
import { PropertyDocument } from '../types';

interface DocumentsViewProps {
  onOpenUploadDocModal: () => void;
  searchTerm: string;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  onOpenUploadDocModal,
  searchTerm
}) => {
  const documents = store.getDocumentsByTenant();
  const [selectedDoc, setSelectedDoc] = useState<PropertyDocument | null>(documents[0] || null);
  const [analyzingDocId, setAnalyzingDocId] = useState<string | null>(null);

  const filteredDocs = documents.filter(
    d =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.propertyName && d.propertyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAnalyzeDocument = async (doc: PropertyDocument) => {
    setAnalyzingDocId(doc.id);
    try {
      const res = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentTitle: doc.title,
          documentText: doc.summary || 'Property lease document'
        })
      });

      const data = await res.json();
      // Update local object
      doc.summary = data.summary;
      if (data.extractedTerms) doc.extractedTerms = data.extractedTerms;
      setSelectedDoc({ ...doc });
    } catch (err) {
      console.error('Error analyzing document:', err);
    } finally {
      setAnalyzingDocId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <FolderKanban className="w-5 h-5 text-indigo-400" />
            <span>Document Repository & AI Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Store property contracts, fire inspection records, insurance policies, and run AI term extraction.
          </p>
        </div>

        <button
          onClick={onOpenUploadDocModal}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Main Grid: Document List + Document Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document List (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Files Repository ({filteredDocs.length})
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Secure Cloud Storage
            </span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredDocs.map(doc => {
              const isSelected = selectedDoc?.id === doc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-950 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        <h3 className="text-sm font-bold text-white">{doc.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400">
                        Category: <strong className="text-slate-200">{doc.category}</strong> • Size: {doc.fileSize}
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                      {doc.uploadedAt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Document Inspector & AI Extractor (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          {selectedDoc ? (
            <>
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold text-indigo-400">
                    File Inspector & Term Extractor
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedDoc.fileSize}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">{selectedDoc.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Uploaded by {selectedDoc.uploadedBy} on {selectedDoc.uploadedAt}
                </p>
              </div>

              {/* AI Extraction Button */}
              <button
                onClick={() => handleAnalyzeDocument(selectedDoc)}
                disabled={analyzingDocId === selectedDoc.id}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all"
              >
                {analyzingDocId === selectedDoc.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                <span>Run Gemini AI Term Extraction</span>
              </button>

              {/* Summary */}
              {selectedDoc.summary && (
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Document Executive Summary
                  </p>
                  <p className="text-xs text-slate-300 bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl leading-relaxed">
                    {selectedDoc.summary}
                  </p>
                </div>
              )}

              {/* Extracted Terms Table */}
              {selectedDoc.extractedTerms && selectedDoc.extractedTerms.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Extracted Contract Clauses & Terms
                  </p>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl divide-y divide-slate-800 text-xs">
                    {selectedDoc.extractedTerms.map((t, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <span className="font-semibold text-slate-400">{t.key}</span>
                        <span className="font-mono text-indigo-300 font-bold">{t.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-400">Select a document to inspect clauses.</p>
          )}
        </div>
      </div>
    </div>
  );
};
