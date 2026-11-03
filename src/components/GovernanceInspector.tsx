'use client';

import React, { useState } from 'react';
import {
  AuditIssue,
  AuditResponsePayload,
} from '@/types/brandVault';
import {
  Sparkles,
  CheckCircle2,
  Bookmark,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface GovernanceInspectorProps {
  auditResult: AuditResponsePayload | null;
  issues: AuditIssue[];
  onApplyFix: (issue: AuditIssue) => void;
  onOverrideIssue: (issueId: string, reason: string) => void;
  selectedIssueId?: string | null;
  shieldActive?: boolean;
  redactedCount?: number;
}

export const GovernanceInspector: React.FC<GovernanceInspectorProps> = ({
  auditResult,
  issues,
  onApplyFix,
  onOverrideIssue,
  selectedIssueId,
  shieldActive = true,
  redactedCount = 0,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [overrideInputId, setOverrideInputId] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  const activeIssues = issues.filter((i) => i.status === 'active');

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    if (categoryFilter === 'ALL') return true;
    if (categoryFilter === 'ACTIVE') return issue.status === 'active';
    if (categoryFilter === 'RESOLVED') return issue.status === 'resolved';
    if (categoryFilter === 'VISUAL_WCAG') {
      return issue.category === 'VISUAL_WCAG';
    }
    if (categoryFilter === 'CROSS_MODAL') {
      return issue.category === 'CROSS_MODAL' || issue.category === 'CROSS_MODAL_DISCREPANCY';
    }
    return issue.category === categoryFilter;
  });

  const handleStartOverride = (id: string) => {
    setOverrideInputId(id);
    setOverrideReason('');
  };

  const handleConfirmOverride = (id: string) => {
    if (overrideReason.trim()) {
      onOverrideIssue(id, overrideReason.trim());
      setOverrideInputId(null);
      setOverrideReason('');
    }
  };

  const score = auditResult ? auditResult.score : 0;

  const categories = [
    { id: 'ALL', label: `All (${issues.length})` },
    { id: 'UNSUPPORTED_CLAIM', label: 'Claims' },
    { id: 'TONE_DRIFT', label: 'Tone' },
    { id: 'VISUAL_WCAG', label: 'Visual & WCAG' },
    { id: 'CROSS_MODAL', label: 'Cross-Modal' },
  ];

  let statusText = 'Requires Remediation';
  let statusColorClass = 'text-rose-600 dark:text-rose-400';
  let gradientClass = 'from-rose-500 to-rose-600';

  if (score >= 90) {
    statusText = 'Compliant';
    statusColorClass = 'text-emerald-600 dark:text-emerald-400';
    gradientClass = 'from-emerald-500 to-teal-500';
  } else if (score >= 70) {
    statusText = 'Moderate Risk';
    statusColorClass = 'text-amber-600 dark:text-amber-400';
    gradientClass = 'from-amber-500 to-orange-500';
  }

  return (
    <div className="space-y-5">
      {/* 1. TOP HEALTH CARD: Prominent Score, Bold Status, Clean Gradient Progress Bar */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {score}
            </span>
            <span className="text-lg font-bold text-slate-400 font-mono">/ 100</span>
          </div>

          <div className="text-right">
            <h3 className={`text-base md:text-lg font-bold ${statusColorClass}`}>
              {statusText}
            </h3>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              {activeIssues.length} {activeIssues.length === 1 ? 'flag' : 'flags'} to resolve
            </p>
          </div>
        </div>

        {/* Clean Gradient Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-700 ease-out`}
            style={{ width: `${Math.max(score, 6)}%` }}
          />
        </div>

        {/* Technical Details Collapsible (Hides clutter cleanly) */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="flex items-center justify-between w-full text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-1.5 font-mono">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              <span>Inspection Engine Telemetry</span>
            </span>
            {showTechnicalDetails ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showTechnicalDetails && (
            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono text-slate-600 dark:text-slate-400 animate-fade-in">
              {auditResult && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Deterministic Rules:</span>{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {auditResult.engineBreakdown.deterministicCount} checks
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Agentic RAG:</span>{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {auditResult.engineBreakdown.agenticCount} checks
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Readability:</span>{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {auditResult.readabilityScore} / 100
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Scan Latency:</span>{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {auditResult.executionTimeMs} ms
                    </span>
                  </div>
                </div>
              )}
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    shieldActive ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
                <span>
                  {shieldActive
                    ? `${redactedCount} sensitive tokens masked prior to inference`
                    : 'Confidentiality Shield inactive'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. FILTER BAR: Sleek Tabs [ All (9) ], [ Claims ], [ Tone ], [ Visual & WCAG ] */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all border cursor-pointer ${
              categoryFilter === cat.id
                ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-700 shadow-xs font-semibold'
                : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. GRAMMARLY-STYLE REMEDIATION CARDS FEED */}
      <div className="space-y-3.5 max-h-[660px] overflow-y-auto pr-1">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              All Clear — 100% Brand Compliant
            </h4>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              No claims, tone drifts, or WCAG accessibility discrepancies found in this draft.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isHigh = issue.severity === 'High';
            const isResolved = issue.status === 'resolved';
            const isOverridden = issue.status === 'overridden';
            const isSelected = selectedIssueId === issue.id;

            return (
              <div
                key={issue.id}
                className={`rounded-2xl border p-5 transition-all duration-200 shadow-xs ${
                  isSelected ? 'ring-2 ring-indigo-500 border-indigo-400' : ''
                } ${
                  isResolved
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/40 opacity-75'
                    : isOverridden
                    ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-75'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header Tag Bar */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                          : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                      }`}
                    >
                      {issue.severity} Priority
                    </span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                      {issue.category}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    {issue.engine === 'Deterministic Engine' ? 'Deterministic' : 'Agentic RAG'}
                  </span>
                </div>

                {/* Big Bold Replacement Comparison */}
                <div className="space-y-1.5 mb-3 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider font-mono">
                      Original:
                    </span>
                    <span className="line-through text-rose-600 dark:text-rose-400 font-bold text-sm md:text-base">
                      "{issue.flaggedText}"
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">
                      Suggested:
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm md:text-base">
                      "{issue.suggestedFix}"
                    </span>
                  </div>
                </div>

                {/* Clear Explanation & Benchmark Citation */}
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                  {issue.explanation}
                </p>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 mb-4">
                  <Bookmark className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>Rule Citation: {issue.citation}</span>
                </div>

                {/* Actions: Primary Apply Fix Button & Secondary Ghost Override */}
                {isResolved ? (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Fix Applied & Verified</span>
                  </div>
                ) : isOverridden ? (
                  <div className="text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                      <FileCheck2 className="w-4 h-4 text-amber-500" />
                      <span>Flag Overridden</span>
                    </div>
                    <p className="text-xs italic mt-1 text-slate-500 font-sans">
                      "{issue.overrideReason}"
                    </p>
                  </div>
                ) : overrideInputId === issue.id ? (
                  <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Reason for human override:
                    </label>
                    <input
                      type="text"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="E.g. Benchmark verified in legal addendum..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleConfirmOverride(issue.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white cursor-pointer shadow-xs"
                      >
                        Confirm Override
                      </button>
                      <button
                        onClick={() => setOverrideInputId(null)}
                        className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer px-2 py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3 pt-1">
                    {/* Primary Action: Vibrant, satisfying button */}
                    <button
                      onClick={() => onApplyFix(issue)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-sm shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Apply Suggested Fix</span>
                    </button>

                    {/* Secondary Action: Quiet ghost button */}
                    <button
                      onClick={() => handleStartOverride(issue.id)}
                      className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-medium px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
                    >
                      Override
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
