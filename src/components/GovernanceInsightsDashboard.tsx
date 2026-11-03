'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  BookOpen,
  Layers,
  Sparkles,
} from 'lucide-react';
import { GuidelineTelemetry } from '@/types/brandVault';

interface GovernanceInsightsDashboardProps {
  telemetryData: GuidelineTelemetry[];
  onRefineGuideline: (section: string) => void;
  currentScore?: number;
}

export const GovernanceInsightsDashboard: React.FC<GovernanceInsightsDashboardProps> = ({
  telemetryData,
  onRefineGuideline,
  currentScore = 88,
}) => {
  // Violation distribution metrics
  const categoryDistribution = [
    { name: 'Unsupported Claims', percentage: 42, color: 'bg-rose-500', count: 19 },
    { name: 'WCAG Contrast & Visuals', percentage: 28, color: 'bg-amber-500', count: 13 },
    { name: 'Tone Drift & Hyperbole', percentage: 18, color: 'bg-indigo-500', count: 8 },
    { name: 'Terminology Glossary', percentage: 12, color: 'bg-emerald-500', count: 5 },
  ];

  // Ambiguous guidelines (overrides > 50%)
  const ambiguousGuidelines = telemetryData.filter((g) => g.overrideRate > 50);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Enterprise Governance Intelligence
                </h2>
                <span className="text-xs font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Real-Time Telemetry
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Continuous compliance health metrics, human reviewer override telemetry, and automated Brand Book ambiguity detection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Last 30 Days (48 Audits)</span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Average Compliance Score */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            <span>Avg Governance Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              84.6
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              +12.4% vs Q3
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '84.6%' }} />
          </div>
        </div>

        {/* Card 2: Total Scans Run */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            <span>Scans Completed</span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              48
            </span>
            <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              100% Deterministic + RAG
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Avg execution latency: 24ms
          </p>
        </div>

        {/* Card 3: Auto-Remediation Acceptance */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            <span>1-Click Fix Acceptance</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              91.2%
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              High Adoption
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Creators accept suggested fixes over manual edits
          </p>
        </div>

        {/* Card 4: Human Reviewer Overrides */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            <span>Human Override Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              22.8%
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              Avg across rules
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sec 2.1 triggers ambiguity threshold
          </p>
        </div>
      </div>

      {/* 3. High-Visibility Ambiguity Detector Alert Card */}
      {ambiguousGuidelines.map((g) => (
        <div
          key={g.section}
          className="bg-amber-50/70 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800/80 rounded-2xl p-6 shadow-sm transition-colors"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                    Ambiguity Detected
                  </span>
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                    Override Rate: <strong className="text-amber-700 dark:text-amber-400">{g.overrideRate}%</strong> (Threshold: &gt;50%)
                  </span>
                </div>

                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                  Guideline Ambiguity Detected in {g.section} ({g.title})
                </h3>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                  Human reviewers override this flag <strong className="text-amber-700 dark:text-amber-400">{g.overrideRate}% of the time</strong> with remarks citing <strong className="text-slate-900 dark:text-white">'{g.commonRemarks.join("', '")}'</strong>.
                </p>

                <div className="bg-white/80 dark:bg-slate-950/80 p-3.5 rounded-xl border border-amber-300 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 font-mono shadow-xs">
                  <strong>Recommendation:</strong> {g.recommendation}
                </div>
              </div>
            </div>

            {/* 1-Click Refine Guideline Button */}
            <button
              onClick={() => onRefineGuideline(g.section)}
              className="w-full lg:w-auto px-5 py-3 rounded-xl font-bold text-sm text-white bg-amber-600 hover:bg-amber-500 active:scale-95 transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>Refine Guideline in Brand Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {/* 4. Violation Category Distribution Breakdown & Telemetry Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Progress Bars Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Violation Distribution
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Recent 48 Scans</span>
          </div>

          <div className="space-y-4">
            {categoryDistribution.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-slate-400">{cat.count} flags</span>
                    <span className="font-bold text-slate-900 dark:text-white">{cat.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`${cat.color} h-full rounded-full transition-all duration-500 shadow-xs`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-200 font-semibold">Governance Insight:</strong> 70% of all audit failures originate in unsupported empirical claims (42%) and visual contrast (28%). Automatic pre-checking prevents over 35 hours of manual legal escalations per month.
          </div>
        </div>

        {/* Right: Reviewer Override Telemetry Table (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ambiguity Telemetry by Section
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Live Reviewer Overrides</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-mono text-xs uppercase">
                  <th className="pb-3 font-semibold">Guideline Section</th>
                  <th className="pb-3 font-semibold text-center">Flags</th>
                  <th className="pb-3 font-semibold text-center">Overrides</th>
                  <th className="pb-3 font-semibold text-center">Override %</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {telemetryData.map((row) => (
                  <tr key={row.section} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-2">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{row.section}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{row.title}</div>
                    </td>
                    <td className="py-3.5 text-center font-mono text-slate-700 dark:text-slate-300">{row.totalFlags}</td>
                    <td className="py-3.5 text-center font-mono text-slate-700 dark:text-slate-300">{row.overrides}</td>
                    <td className="py-3.5 text-center font-mono">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-xs border ${
                          row.overrideRate > 50
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {row.overrideRate}%
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {row.overrideRate > 50 ? (
                        <button
                          onClick={() => onRefineGuideline(row.section)}
                          className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          Refine
                        </button>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs flex items-center justify-end gap-1 font-semibold">
                          <CheckCircle2 className="w-4 h-4" /> Stable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
