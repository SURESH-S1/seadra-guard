'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  BookOpen,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Check,
  Lock,
  Sparkles,
  PenTool,
} from 'lucide-react';
import { UserRole, DocumentWorkflowStatus } from '@/types/brandVault';
import { useAuth, DEMO_CREDENTIALS } from '@/context/AuthContext';
import { PremiumEmoji } from '@/components/ui/PremiumEmoji';

interface NavbarProps {
  activeTab: 'studio' | 'vault' | 'insights';
  setActiveTab: (tab: 'studio' | 'vault' | 'insights') => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  status: DocumentWorkflowStatus;
  factsCount: number;
  glossaryCount: number;
  shieldActive: boolean;
  setShieldActive: (active: boolean) => void;
  redactedCount: number;
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  role,
  setRole,
  status,
  factsCount,
  glossaryCount,
  shieldActive,
  setShieldActive,
  redactedCount,
  theme = 'dark',
  toggleTheme,
}) => {
  const { user, switchRole, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (newRole: UserRole) => {
    switchRole(newRole);
    setRole(newRole);
    setIsDropdownOpen(false);
  };

  const currentDisplayName = user?.displayName || (role === 'creator' ? 'Suresh (Creator)' : 'Brand Reviewer');
  const currentEmail = user?.email || (role === 'creator' ? 'creator@seadra.internal' : 'reviewer@seadra.internal');
  const currentInitials = user?.avatarInitials || (role === 'creator' ? 'SC' : 'BR');

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 dark:bg-[#090d16]/95 border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 py-3 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Clean Shield icon + "Seadra Guard" in bold font + small subtle pill v3.0 Final */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Shield className="w-4 h-4 fill-white/20" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              Seadra<span className="text-indigo-600 dark:text-indigo-400 ml-0.5">Guard</span>
            </span>
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 px-2 py-0.5 rounded-full">
              v3.0 Final
            </span>
          </div>
        </div>

        {/* Center: 3 clean navigation tabs [ Studio ], [ Brand Vault (9) ], [ Governance Insights ] */}
        <nav className="flex items-center bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'vault'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Brand Vault</span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.2 rounded-md">
              {factsCount + glossaryCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'insights'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Governance Insights</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </button>
        </nav>

        {/* Right: Consolidate controls into a single elegant profile bar */}
        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          {/* Pill 1: [ 🔒 Shield: Active ] */}
          <button
            onClick={() => setShieldActive(!shieldActive)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-xs ${
              shieldActive
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-950/50'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
            title={shieldActive ? 'Local Redaction Shield is Active (Zero Data Exfiltration)' : 'Click to enable local privacy shield'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                shieldActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="font-semibold flex items-center gap-1">
              🔒 Shield:
              <span className={shieldActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}>
                {shieldActive ? 'Active' : 'Off'}
              </span>
            </span>
          </button>

          {/* Pill 2: Clean role switcher: [ ✍️ Creator | 🛡️ Reviewer ] */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => handleSelectRole('creator')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                role === 'creator'
                  ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>✍️</span>
              <span>Creator</span>
            </button>
            <button
              onClick={() => handleSelectRole('reviewer')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                role === 'reviewer'
                  ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>🛡️</span>
              <span>Reviewer</span>
            </button>
          </div>

          {/* Pill 3: User avatar pill: Suresh (Creator) with dropdown arrow */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-xs"
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                  role === 'reviewer'
                    ? 'bg-emerald-600'
                    : 'bg-indigo-600'
                }`}
              >
                {currentInitials}
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {currentDisplayName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu with Accounts and Sign Out */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fade-in divide-y divide-slate-100 dark:divide-slate-800">
                <div className="px-3.5 py-2">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Active Session</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">{currentEmail}</p>
                </div>

                <div className="p-1.5 space-y-1">
                  <button
                    onClick={() => handleSelectRole('creator')}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                      role === 'creator'
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">✍️</span>
                      <div>
                        <div className="text-xs font-semibold">Suresh (Creator)</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Marketing & Content Drafts</div>
                      </div>
                    </div>
                    {role === 'creator' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </button>

                  <button
                    onClick={() => handleSelectRole('reviewer')}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                      role === 'reviewer'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🛡️</span>
                      <div>
                        <div className="text-xs font-semibold">Brand Reviewer</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Governance & Publication Sign-Off</div>
                      </div>
                    </div>
                    {role === 'reviewer' && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={() => {
                      logout();
                      setRole('creator');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme switcher */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
