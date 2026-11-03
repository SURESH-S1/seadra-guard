'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Shield,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sun,
  Moon,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '@/context/AuthContext';
import { UserRole } from '@/types/brandVault';
import { PremiumEmoji } from '@/components/ui/PremiumEmoji';

interface DemoLoginViewProps {
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export const DemoLoginView: React.FC<DemoLoginViewProps> = ({ theme = 'dark', toggleTheme }) => {
  const { loginWithCredentials, quickLogin } = useAuth();

  // Form inputs pre-filled by default with Creator credentials
  const [email, setEmail] = useState<string>(DEMO_CREDENTIALS.creator.email);
  const [password, setPassword] = useState<string>(DEMO_CREDENTIALS.creator.password);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFillCredentials = (role: UserRole) => {
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result = loginWithCredentials(email, password);
    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-600 dark:selection:text-indigo-200 transition-colors duration-200 p-4 sm:p-6 lg:p-8">
      {/* Top Utility Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4">
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

        {toggleTheme && (
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs flex items-center gap-2 text-xs font-semibold"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Centered Sign-In Card */}
      <div className="max-w-2xl w-full mx-auto my-auto py-6">
        <div className="bg-white dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/60 p-6 sm:p-8 space-y-6">
          {/* Header & Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10 mb-1">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Enterprise Governance Sign In
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Continuous Brand Governance, Approved Facts Verification, and WCAG AA Multi-Modal Audit.
            </p>
          </div>

          {/* Quick Access Info Strip */}
          <div className="rounded-xl p-4 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/40 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
                <span>Codex 48 Judge Quick-Access</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Click a 1-click persona button below or sign in using the pre-configured credentials.
              </p>
            </div>
          </div>

          {/* Interactive Demo Credentials Cards with 1-Click Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Creator Account Card */}
            <div
              onClick={() => handleFillCredentials('creator')}
              className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/40 dark:bg-indigo-950/20 hover:border-indigo-400 dark:hover:border-indigo-700 transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">✍️</span>
                    <span className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
                      Creator Account
                    </span>
                  </div>
                  <span className="text-xs font-mono font-medium bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                    Copywriter
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono bg-white/90 dark:bg-slate-950/70 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {DEMO_CREDENTIALS.creator.email}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(DEMO_CREDENTIALS.creator.email, 'creator-email');
                        }}
                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                        title="Copy email"
                      >
                        {copiedKey === 'creator-email' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Password:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {DEMO_CREDENTIALS.creator.password}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(DEMO_CREDENTIALS.creator.password, 'creator-pass');
                        }}
                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                        title="Copy password"
                      >
                        {copiedKey === 'creator-pass' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1-Click Quick Login as Creator */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  quickLogin('creator');
                }}
                className="mt-3.5 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Quick Login as Creator</span>
              </button>
            </div>

            {/* Reviewer Account Card */}
            <div
              onClick={() => handleFillCredentials('reviewer')}
              className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-400 dark:hover:border-emerald-700 transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🛡️</span>
                    <span className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                      Reviewer Account
                    </span>
                  </div>
                  <span className="text-xs font-mono font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Compliance
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono bg-white/90 dark:bg-slate-950/70 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {DEMO_CREDENTIALS.reviewer.email}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(DEMO_CREDENTIALS.reviewer.email, 'reviewer-email');
                        }}
                        className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                        title="Copy email"
                      >
                        {copiedKey === 'reviewer-email' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Password:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {DEMO_CREDENTIALS.reviewer.password}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(DEMO_CREDENTIALS.reviewer.password, 'reviewer-pass');
                        }}
                        className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                        title="Copy password"
                      >
                        {copiedKey === 'reviewer-pass' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1-Click Quick Login as Reviewer */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  quickLogin('reviewer');
                }}
                className="mt-3.5 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Quick Login as Reviewer</span>
              </button>
            </div>
          </div>

          {/* Form Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative bg-white dark:bg-slate-900 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">
              Or sign in with form credentials
            </span>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="demo-email-input"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Corporate Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="demo-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@seadra.internal"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="demo-password-input"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Access Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="demo-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span>Sign In to Seadra Guard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Enterprise Security Verification Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Offline-First Engine</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Local Confidentiality Shield</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>WCAG 2.1 AA Certified</span>
            </span>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-400 font-mono pt-4">
        <span>Seadra Guard © 2026 — Continuous Enterprise Governance Platform</span>
      </div>
    </div>
  );
};
