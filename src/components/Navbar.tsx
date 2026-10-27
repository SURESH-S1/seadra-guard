'use client';

import React from 'react';
import {
  ShieldCheck,
  BookOpen,
  UserCheck,
  PenTool,
  Sparkles,
  Cpu,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { UserRole, DocumentWorkflowStatus } from '@/types/brandVault';

interface NavbarProps {
  activeTab: 'studio' | 'vault';
  setActiveTab: (tab: 'studio' | 'vault') => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  status: DocumentWorkflowStatus;
  factsCount: number;
  glossaryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  role,
  setRole,
  status,
  factsCount,
  glossaryCount,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'Approved for Publication':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        };
      case 'In Review':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />,
          classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        };
      case 'Changes Requested':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
          classes: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        };
      case 'Draft':
      default:
        return {
          icon: <RotateCcw className="w-3.5 h-3.5 text-slate-400" />,
          classes: 'bg-slate-800 text-slate-300 border-slate-700',
        };
    }
  };

  const statusStyle = getStatusBadge();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0F19]/90 border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/20 ring-1 ring-white/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">
                Seadra<span className="text-teal-400">Guard</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Hybrid Deterministic + Agentic
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Continuous Brand Governance, Fact Verification & WCAG Scanner
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit & Review Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'vault'
                ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Brand Vault</span>
            <span className="bg-slate-800 text-teal-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono border border-slate-700">
              {factsCount + glossaryCount}
            </span>
          </button>
        </div>

        {/* Right Controls: Role Switcher & Status Badge */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider hidden lg:inline font-mono">
              Status:
            </span>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.classes}`}
            >
              {statusStyle.icon}
              <span>{status}</span>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* Interactive Role Switcher Pill */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setRole('creator')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                role === 'creator'
                  ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Content Creator mode: edit drafts, accept fixes, request review"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Creator</span>
            </button>
            <button
              onClick={() => setRole('reviewer')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                role === 'reviewer'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Authorised Reviewer mode: approve for publication or request changes"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Reviewer</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

