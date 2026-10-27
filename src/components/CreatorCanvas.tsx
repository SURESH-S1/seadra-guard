'use client';

import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  Zap,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { AuditIssue } from '@/types/brandVault';
import { getContrastRatio, isApprovedBrandColor } from '@/lib/wcag';
import { BrandColor } from '@/types/brandVault';

interface CreatorCanvasProps {
  content: string;
  setContent: (val: string) => void;
  bannerText: string;
  setBannerText: (val: string) => void;
  bannerFgHex: string;
  setBannerFgHex: (val: string) => void;
  bannerBgHex: string;
  setBannerBgHex: (val: string) => void;
  onRunAudit: () => void;
  isAuditing: boolean;
  issues: AuditIssue[];
  approvedPalette: BrandColor[];
  onSelectIssue?: (issueId: string) => void;
}

export const CreatorCanvas: React.FC<CreatorCanvasProps> = ({
  content,
  setContent,
  bannerText,
  setBannerText,
  bannerFgHex,
  setBannerFgHex,
  bannerBgHex,
  setBannerBgHex,
  onRunAudit,
  isAuditing,
  issues,
  approvedPalette,
  onSelectIssue,
}) => {
  const contrastRatio = getContrastRatio(bannerFgHex, bannerBgHex);
  const passesAA = contrastRatio >= 4.5;
  const isFgApproved = isApprovedBrandColor(bannerFgHex, approvedPalette);
  const isBgApproved = isApprovedBrandColor(bannerBgHex, approvedPalette);

  // Active issues targeting content
  const contentIssues = issues.filter((i) => i.targetField === 'content' && i.status === 'active');
  const bannerIssues = issues.filter(
    (i) => (i.targetField === 'bannerText' || i.targetField === 'bannerColors') && i.status === 'active'
  );

  return (
    <div className="space-y-6">
      {/* 1. Body Copy Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-semibold text-white">Body Copy & Marketing Announcement</h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>{content.trim().split(/\s+/).filter(Boolean).length} words</span>
            <span>{content.length} chars</span>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={7}
            placeholder="Draft enterprise marketing copy, technical blog post, or product announcement..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg p-3.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 leading-relaxed font-sans transition-all resize-y"
          />
        </div>

        {/* Flagged Chips below editor */}
        {contentIssues.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Detected Potential Violations in Copy ({contentIssues.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {contentIssues.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => onSelectIssue && onSelectIssue(issue.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition-all text-left ${
                    issue.severity === 'High'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                  }`}
                  title={`${issue.category}: ${issue.explanation}`}
                >
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[180px] font-semibold">"{issue.flaggedText}"</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Attached Promotional Banner Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Attached Promotional Banner Simulator</h3>
          </div>
          <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
            Multi-Modal Check
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Test visual asset compliance before publishing: Seadra Guard cross-references banner claims against body copy and verifies WCAG 2.1 AA mathematical contrast ratio.
        </p>

        {/* Live Visual Banner Preview */}
        <div
          className="w-full rounded-xl p-5 mb-4 border transition-all shadow-md flex flex-col justify-between min-h-[110px]"
          style={{
            backgroundColor: bannerBgHex,
            color: bannerFgHex,
            borderColor: passesAA ? 'rgba(255,255,255,0.1)' : 'rgba(244, 63, 94, 0.4)',
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] tracking-widest uppercase font-bold opacity-80">
              AcmeCloud Official Banner
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold shadow-sm ${
                  passesAA
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-500/40 animate-pulse'
                }`}
              >
                Contrast: {contrastRatio}:1 {passesAA ? '✓ WCAG AA' : '✗ WCAG FAIL'}
              </span>
            </div>
          </div>

          <h4 className="text-lg md:text-xl font-bold tracking-tight mt-2 line-clamp-2">
            {bannerText || 'Enter banner headline text...'}
          </h4>

          <div className="mt-2 text-[11px] opacity-75 font-mono flex items-center justify-between">
            <span>Bg: {bannerBgHex} {!isBgApproved && '(Unapproved)'}</span>
            <span>Fg: {bannerFgHex} {!isFgApproved && '(Unapproved)'}</span>
          </div>
        </div>

        {/* Banner Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Banner Text Input */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Banner Headline Text
            </label>
            <input
              type="text"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="E.g. Save 90% On Enterprise Cloud Today!"
              className="w-full bg-slate-950/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>

          {/* Foreground Color Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Text / FG Color</span>
              <span className={`text-[10px] ${isFgApproved ? 'text-teal-400' : 'text-rose-400'}`}>
                {isFgApproved ? '✓ Brand Hex' : '✗ Non-Palette'}
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bannerFgHex.startsWith('#') && bannerFgHex.length === 7 ? bannerFgHex : '#FFFFFF'}
                onChange={(e) => setBannerFgHex(e.target.value)}
                className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={bannerFgHex}
                onChange={(e) => setBannerFgHex(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono uppercase"
              />
            </div>
          </div>

          {/* Background Color Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Background Color</span>
              <span className={`text-[10px] ${isBgApproved ? 'text-teal-400' : 'text-rose-400'}`}>
                {isBgApproved ? '✓ Brand Hex' : '✗ Non-Palette'}
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bannerBgHex.startsWith('#') && bannerBgHex.length === 7 ? bannerBgHex : '#000000'}
                onChange={(e) => setBannerBgHex(e.target.value)}
                className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={bannerBgHex}
                onChange={(e) => setBannerBgHex(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono uppercase"
              />
            </div>
          </div>

          {/* Quick Approved Swatch Injector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Quick Brand Swatches
            </label>
            <div className="flex items-center gap-1.5 pt-1">
              {approvedPalette.map((col) => (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => {
                    if (col.role === 'surface') {
                      setBannerFgHex(col.hex);
                    } else {
                      setBannerBgHex(col.hex);
                    }
                  }}
                  className="w-7 h-7 rounded border border-white/20 shadow-sm transition-transform hover:scale-110 relative group"
                  style={{ backgroundColor: col.hex }}
                  title={`${col.name} (${col.hex}) - Click to apply`}
                >
                  <span className="sr-only">{col.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Banner issues notice */}
        {bannerIssues.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Banner Governance Flags ({bannerIssues.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {bannerIssues.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => onSelectIssue && onSelectIssue(issue.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{issue.category}: {issue.flaggedText}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Primary CTA Button */}
      <button
        onClick={onRunAudit}
        disabled={isAuditing}
        className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 hover:from-teal-400 hover:to-blue-500 active:scale-[0.99] transition-all shadow-lg shadow-teal-500/20 border border-teal-400/30 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
      >
        <Zap className={`w-5 h-5 text-teal-200 ${isAuditing ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
        <span className="text-sm tracking-wide">
          {isAuditing ? 'Running 2-Track Hybrid Compliance Audit...' : '⚡ Run Hybrid Compliance Audit'}
        </span>
      </button>
    </div>
  );
};

