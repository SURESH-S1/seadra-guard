'use client';

import React, { useState } from 'react';
import {
  AuditIssue,
  IssueCategory,
  AuditResponsePayload,
} from '@/types/brandVault';
import {
  ShieldAlert,
  Sparkles,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Bookmark,
  MessageSquare,
  Filter,
  Check,
  XCircle,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';

interface GovernanceInspectorProps {
  auditResult: AuditResponsePayload | null;
  issues: AuditIssue[];
  onApplyFix: (issue: AuditIssue) => void;
  onOverrideIssue: (issueId: string, reason: string) => void;
  selectedIssueId?: string | null;
}

export const GovernanceInspector: React.FC<GovernanceInspectorProps> = ({
  auditResult,
  issues,
  onApplyFix,
  onOverrideIssue,
  selectedIssueId,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [overrideInputId, setOverrideInputId] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState<string>('');

  const activeIssues = issues.filter((i) => i.status === 'active');
  const resolvedIssues = issues.filter((i) => i.status === 'resolved');
  const overriddenIssues = issues.filter((i) => i.status === 'overridden');

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    if (categoryFilter === 'ALL') return true;
    if (categoryFilter === 'ACTIVE') return issue.status === 'active';
    if (categoryFilter === 'RESOLVED') return issue.status === 'resolved';
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

  const getScoreColor = (sc: number) => {
    if (sc >= 90) return 'text-emerald-400 border-emerald-500/40 from-emerald-500/20 to-teal-500/10';
    if (sc >= 70) return 'text-amber-400 border-amber-500/40 from-amber-500/20 to-yellow-500/10';
    return 'text-rose-400 border-rose-500/40 from-rose-500/20 to-red-500/10';
  };

  const categories = [
    { id: 'ALL', label: `All (${issues.length})` },
    { id: 'UNSUPPORTED_CLAIM', label: 'Claims' },
    { id: 'TONE_DRIFT', label: 'Tone' },
    { id: 'TERMINOLOGY', label: 'Glossary' },
    { id: 'VISUAL_WCAG', label: 'Visual/WCAG' },
    { id: 'CROSS_MODAL', label: 'Cross-Modal' },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
      {/* 1. Overall Compliance Score Header */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Score Ring / Gauge */}
            <div
              className={`w-16 h-16 rounded-2xl border-2 bg-gradient-to-br flex flex-col items-center justify-center shadow-lg ${getScoreColor(
                score
              )}`}
            >
              <span className="text-2xl font-black tracking-tight">{score}</span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
                / 100
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Brand Governance Health</h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    score >= 90
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : score >= 70
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {score >= 90 ? 'Compliant' : score >= 70 ? 'Moderate Risk' : 'High Risk'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeIssues.length === 0
                  ? 'All brand governance criteria satisfied.'
                  : `${activeIssues.length} active flag${activeIssues.length === 1 ? '' : 's'} require remediation.`}
              </p>
            </div>
          </div>

          {/* Engine Provenance & Readability Stats */}
          {auditResult && (
            <div className="grid grid-cols-2 gap-2 text-right">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-left">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Deterministic</div>
                <div className="text-xs font-bold text-teal-300 flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  <span>{auditResult.engineBreakdown.deterministicCount} flags</span>
                </div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-left">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Agentic RAG</div>
                <div className="text-xs font-bold text-blue-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{auditResult.engineBreakdown.agenticCount} flags</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Execution Metadata Bar */}
        {auditResult && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Readability: {auditResult.readabilityScore}/100 ({auditResult.readabilityGrade})</span>
            <span>Banner Contrast: {auditResult.contrastRatio}:1 ({auditResult.contrastPassesAA ? '✓ AA' : '✗ Fail'})</span>
            <span>Scan Time: {auditResult.executionTimeMs}ms</span>
          </div>
        )}
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800">
        <Filter className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              categoryFilter === cat.id
                ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Flagged Issues List */}
      <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-emerald-300">No Compliance Issues Detected</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Draft complies with AcmeCloud brand voice, verified facts ledger, WCAG 2.1 AA accessibility, and terminology glossary.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isHigh = issue.severity === 'High';
            const isResolved = issue.status === 'resolved';
            const isOverridden = issue.status === 'overridden';
            const isHighlighted = selectedIssueId === issue.id;

            return (
              <div
                key={issue.id}
                className={`p-4 rounded-xl border transition-all ${
                  isHighlighted
                    ? 'ring-2 ring-teal-500 shadow-lg'
                    : ''
                } ${
                  isResolved
                    ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75'
                    : isOverridden
                    ? 'bg-slate-900/40 border-slate-700/60 opacity-70'
                    : isHigh
                    ? 'bg-slate-950/90 border-rose-500/40 hover:border-rose-500/60'
                    : 'bg-slate-950/90 border-amber-500/40 hover:border-amber-500/60'
                }`}
              >
                {/* Issue Header Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {/* Severity Badge */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {issue.severity} Priority
                    </span>

                    {/* Category */}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {issue.category}
                    </span>
                  </div>

                  {/* Engine Badge */}
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border ${
                      issue.engine === 'Deterministic Engine'
                        ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                        : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                    }`}
                  >
                    {issue.engine === 'Deterministic Engine' ? (
                      <Cpu className="w-2.5 h-2.5" />
                    ) : (
                      <Sparkles className="w-2.5 h-2.5" />
                    )}
                    <span>{issue.engine}</span>
                  </span>
                </div>

                {/* Flagged Text Callout */}
                <div className="bg-slate-900/90 rounded-lg p-2.5 mb-2.5 border border-slate-800/80">
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                    Target: {issue.targetField}
                  </div>
                  <div className="text-xs font-mono font-semibold text-rose-300">
                    "{issue.flaggedText}"
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                  {issue.explanation}
                </p>

                {/* Citation Box */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-teal-400/90 bg-teal-500/5 px-2.5 py-1 rounded-md border border-teal-500/20 mb-3">
                  <Bookmark className="w-3 h-3 flex-shrink-0" />
                  <span>Ref: {issue.citation}</span>
                </div>

                {/* Suggested Fix Box */}
                <div className="bg-slate-900/60 rounded-lg p-2.5 mb-3 border border-slate-800">
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                    Intent-Preserving Suggested Fix:
                  </div>
                  <div className="text-xs text-emerald-300 font-medium">
                    "{issue.suggestedFix}"
                  </div>
                </div>

                {/* Status or Action Buttons */}
                {isResolved ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resolved via 1-Click Fix</span>
                  </div>
                ) : isOverridden ? (
                  <div className="text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <FileCheck2 className="w-4 h-4 text-amber-400" />
                      <span>Overridden with Justification:</span>
                    </div>
                    <p className="text-[11px] italic mt-0.5 text-slate-400 font-sans">
                      "{issue.overrideReason}"
                    </p>
                  </div>
                ) : (
                  <div>
                    {overrideInputId === issue.id ? (
                      <div className="space-y-2 mt-2 pt-2 border-t border-slate-800">
                        <label className="block text-[11px] text-slate-400 font-medium">
                          Authorised Justification for Override:
                        </label>
                        <input
                          type="text"
                          value={overrideReason}
                          onChange={(e) => setOverrideReason(e.target.value)}
                          placeholder="e.g. Legal exception granted for special partnership..."
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleConfirmOverride(issue.id)}
                            className="px-2.5 py-1 rounded text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                          >
                            Confirm Override
                          </button>
                          <button
                            onClick={() => setOverrideInputId(null)}
                            className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-slate-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => onApplyFix(issue)}
                          className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>✨ Accept 1-Click Fix</span>
                        </button>

                        <button
                          onClick={() => handleStartOverride(issue.id)}
                          className="py-1.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
                          title="Override flag with justified human review note"
                        >
                          <span>Override</span>
                        </button>
                      </div>
                    )}
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

