'use client';

import React, { useState } from 'react';
import {
  X,
  GitCompare,
  CheckCircle2,
  Columns,
  List,
  Sparkles,
  ArrowRight,
  FileCheck2,
} from 'lucide-react';
import { computeWordDiff } from '@/lib/diffEngine';
import { PremiumEmoji } from '@/components/ui/PremiumEmoji';

interface RevisionDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalDraft: string;
  aiSuggestedDraft: string;
  currentDraft: string;
  onApprove: () => void;
}

export const RevisionDiffModal: React.FC<RevisionDiffModalProps> = ({
  isOpen,
  onClose,
  originalDraft,
  aiSuggestedDraft,
  currentDraft,
  onApprove,
}) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');

  if (!isOpen) return null;

  // Diff between Original Draft and AI Remediation
  const origVsAiDiff = computeWordDiff(originalDraft, aiSuggestedDraft);

  // Diff between Original Draft and Current Final Version
  const origVsFinalDiff = computeWordDiff(originalDraft, currentDraft);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="glass-panel rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/30 dark:shadow-black/80 overflow-hidden border border-slate-200 dark:border-white/[0.1] ring-1 ring-black/[0.05] dark:ring-white/[0.05]">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-md">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Visual Lifecycle Revision Diff</h3>
                <span className="text-xs font-mono uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold shadow-sm">
                  Authorised Reviewer Inspection
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Inspect word-level mutations: Original Creator Draft vs AI Remediation vs Final Candidate before publishing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-200 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-300 dark:border-white/[0.08] shadow-inner">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'side-by-side'
                    ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm border border-slate-300 dark:border-slate-700/80'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>3-Column Split</span>
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'unified'
                    ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm border border-slate-300 dark:border-slate-700/80'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Unified Changelog</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-white/[0.06] flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="text-slate-600 dark:text-slate-400 uppercase font-semibold">Diff Legend:</span>
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/20 border border-rose-500/50" />
            <span>Red Strikethrough = Deleted / Flagged Text</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/20 border border-blue-500/50" />
            <span>Blue Highlight = AI Suggested Fix</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500/50" />
            <span>Green Highlight = Final Approved Phrasing</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {viewMode === 'side-by-side' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Column 1: Original Creator Draft */}
              <div className="glass-panel-subtle border-rose-500/30 rounded-2xl p-4 flex flex-col shadow-lg">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <h4 className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider font-mono">
                      1. Original Creator Draft
                    </h4>
                  </div>
                  <span className="text-xs bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30 font-mono">
                    Pre-Audit
                  </span>
                </div>
                <div className="flex-1 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap bg-slate-950/70 p-3.5 rounded-xl border border-white/[0.06] shadow-inner">
                  {origVsFinalDiff.map((part, idx) => {
                    if (part.removed) {
                      return (
                        <span
                          key={idx}
                          className="bg-rose-500/25 text-rose-300 line-through decoration-rose-500 font-medium px-1 py-0.5 rounded"
                          title="Flagged text removed in remediation"
                        >
                          {part.value}
                        </span>
                      );
                    }
                    if (part.added) {
                      return null; // Don't show added in the original column
                    }
                    return <span key={idx}>{part.value}</span>;
                  })}
                </div>
              </div>

              {/* Column 2: AI Suggested Remediation */}
              <div className="glass-panel-subtle border-blue-500/30 rounded-2xl p-4 flex flex-col shadow-lg">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider font-mono">
                      2. AI Remediation Engine
                    </h4>
                  </div>
                  <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30 font-mono">
                    Deterministic + RAG
                  </span>
                </div>
                <div className="flex-1 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap bg-slate-950/70 p-3.5 rounded-xl border border-white/[0.06] shadow-inner">
                  {origVsAiDiff.map((part, idx) => {
                    if (part.added) {
                      return (
                        <span
                          key={idx}
                          className="bg-blue-500/25 text-blue-200 border-b-2 border-blue-400 font-medium px-1 py-0.5 rounded"
                          title="AI Suggested Replacement"
                        >
                          {part.value}
                        </span>
                      );
                    }
                    if (part.removed) {
                      return (
                        <span
                          key={idx}
                          className="text-slate-500 line-through decoration-slate-600 opacity-60"
                        >
                          {part.value}
                        </span>
                      );
                    }
                    return <span key={idx}>{part.value}</span>;
                  })}
                </div>
              </div>

              {/* Column 3: Final Approved Version */}
              <div className="glass-panel-subtle border-emerald-500/40 rounded-2xl p-4 flex flex-col shadow-lg">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider font-mono">
                      3. Final Approved Version
                    </h4>
                  </div>
                  <span className="text-xs bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono font-semibold">
                    Candidate for Publish
                  </span>
                </div>
                <div className="flex-1 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap bg-slate-950/70 p-3.5 rounded-xl border border-white/[0.06] shadow-inner">
                  {origVsFinalDiff.map((part, idx) => {
                    if (part.added) {
                      return (
                        <span
                          key={idx}
                          className="bg-emerald-500/25 text-emerald-200 border-b-2 border-emerald-400 font-semibold px-1 py-0.5 rounded"
                          title="Verified approved phrasing"
                        >
                          {part.value}
                        </span>
                      );
                    }
                    if (part.removed) {
                      return null; // Don't show deleted in final version
                    }
                    return <span key={idx}>{part.value}</span>;
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Unified Changelog View */
            <div className="glass-panel-subtle rounded-2xl p-5 space-y-4 shadow-lg">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-teal-400" />
                <span>Unified Lifecycle Changelog</span>
              </h4>
              <div className="text-sm text-slate-200 leading-loose font-sans p-4 rounded-xl bg-slate-950/70 border border-white/[0.06] shadow-inner">
                {origVsFinalDiff.map((part, idx) => {
                  if (part.removed) {
                    return (
                      <span
                        key={idx}
                        className="bg-rose-500/20 text-rose-300 line-through decoration-rose-500 font-mono text-xs px-1.5 py-0.5 rounded mx-0.5 border border-rose-500/30"
                      >
                        {part.value}
                      </span>
                    );
                  }
                  if (part.added) {
                    return (
                      <span
                        key={idx}
                        className="bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded mx-0.5 border border-emerald-500/40"
                      >
                        {part.value}
                      </span>
                    );
                  }
                  return <span key={idx}>{part.value}</span>;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono text-center sm:text-left">
            Every token verified against AcmeCloud SSOT Brand Vault & WCAG AA specifications.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-white/[0.08] transition-all cursor-pointer"
            >
              Close Diff
            </button>
            <button
              onClick={() => {
                onApprove();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
            >
              <PremiumEmoji name="check" size="xs" />
              <span>Approve for Publication</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

