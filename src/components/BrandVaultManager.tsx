'use client';

import React, { useState } from 'react';
import {
  BrandVaultData,
  ApprovedFact,
  GlossaryTerm,
  BrandGuideline,
  BrandColor,
} from '@/types/brandVault';
import {
  BookOpen,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  FileCheck2,
  Palette,
  CheckCircle2,
  Info,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { INITIAL_BRAND_VAULT } from '@/lib/brandVaultDefaults';

interface BrandVaultManagerProps {
  brandVault: BrandVaultData;
  setBrandVault: React.Dispatch<React.SetStateAction<BrandVaultData>>;
  onVaultUpdated?: () => void;
  initialSubTab?: 'facts' | 'glossary' | 'guidelines' | 'palette';
  highlightedSection?: string | null;
}

export const BrandVaultManager: React.FC<BrandVaultManagerProps> = ({
  brandVault,
  setBrandVault,
  onVaultUpdated,
  initialSubTab = 'facts',
  highlightedSection,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'facts' | 'glossary' | 'guidelines' | 'palette'>(
    initialSubTab
  );

  // Auto-switch sub-tab if initialSubTab changes
  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Fact creation form
  const [newFactClaim, setNewFactClaim] = useState('');
  const [newFactDetails, setNewFactDetails] = useState('');

  // Glossary creation form
  const [newBannedTerm, setNewBannedTerm] = useState('');
  const [newPreferredTerm, setNewPreferredTerm] = useState('');
  const [newTermReason, setNewTermReason] = useState('');

  // Guideline creation form
  const [newGuideSection, setNewGuideSection] = useState('');
  const [newGuideTitle, setNewGuideTitle] = useState('');
  const [newGuideDesc, setNewGuideDesc] = useState('');

  // Palette creation form
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#3B82F6');

  // Handlers
  const handleAddFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactClaim.trim()) return;

    const newId = `#F-${105 + brandVault.factsLedger.length}`;
    const newFact: ApprovedFact = {
      id: newId,
      claim: newFactClaim.trim(),
      benchmarkDetails: newFactDetails.trim() || 'Internally verified operational metric.',
      approvedDate: new Date().toISOString().split('T')[0],
    };

    setBrandVault((prev) => ({
      ...prev,
      factsLedger: [newFact, ...prev.factsLedger],
    }));

    setNewFactClaim('');
    setNewFactDetails('');
    onVaultUpdated?.();
  };

  const handleDeleteFact = (id: string) => {
    setBrandVault((prev) => ({
      ...prev,
      factsLedger: prev.factsLedger.filter((f) => f.id !== id),
    }));
    onVaultUpdated?.();
  };

  const handleAddGlossary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannedTerm.trim() || !newPreferredTerm.trim()) return;

    const newTerm: GlossaryTerm = {
      id: `term-${Date.now()}`,
      bannedTerm: newBannedTerm.trim(),
      preferredTerm: newPreferredTerm.trim(),
      reason: newTermReason.trim() || 'Standardized corporate terminology.',
    };

    setBrandVault((prev) => ({
      ...prev,
      glossary: [newTerm, ...prev.glossary],
    }));

    setNewBannedTerm('');
    setNewPreferredTerm('');
    setNewTermReason('');
    onVaultUpdated?.();
  };

  const handleDeleteGlossary = (id: string) => {
    setBrandVault((prev) => ({
      ...prev,
      glossary: prev.glossary.filter((t) => t.id !== id),
    }));
    onVaultUpdated?.();
  };

  const handleAddGuideline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuideTitle.trim() || !newGuideDesc.trim()) return;

    const newGuide: BrandGuideline = {
      id: `guide-${Date.now()}`,
      section: newGuideSection.trim() || `Sec ${prevGuideSectionNumber(brandVault.guidelines)}`,
      title: newGuideTitle.trim(),
      description: newGuideDesc.trim(),
      ruleCategory: 'tone',
    };

    setBrandVault((prev) => ({
      ...prev,
      guidelines: [...prev.guidelines, newGuide],
    }));

    setNewGuideSection('');
    setNewGuideTitle('');
    setNewGuideDesc('');
    onVaultUpdated?.();
  };

  const handleDeleteGuideline = (id: string) => {
    setBrandVault((prev) => ({
      ...prev,
      guidelines: prev.guidelines.filter((g) => g.id !== id),
    }));
    onVaultUpdated?.();
  };

  const handleAddColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorName.trim()) return;

    const newColor: BrandColor = {
      name: newColorName.trim(),
      hex: newColorHex.toUpperCase(),
      role: 'secondary',
    };

    setBrandVault((prev) => ({
      ...prev,
      palette: [...prev.palette, newColor],
    }));

    setNewColorName('');
    onVaultUpdated?.();
  };

  const handleDeleteColor = (hex: string) => {
    setBrandVault((prev) => ({
      ...prev,
      palette: prev.palette.filter((c) => c.hex !== hex),
    }));
    onVaultUpdated?.();
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset Brand Vault to the official AcmeCloud Enterprise defaults?')) {
      setBrandVault(INITIAL_BRAND_VAULT);
      onVaultUpdated?.();
    }
  };

  function prevGuideSectionNumber(guides: BrandGuideline[]) {
    return `${guides.length + 1}.1 - Corporate Governance`;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {brandVault.companyName} Brand Vault & Rules Ledger
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Single Source of Truth (SSOT). Benchmarked facts, verified terminology, and brand hex palettes governing all audits in real time.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Sub-Tabs: Sleek segmented pills */}
        <div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('facts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeSubTab === 'facts'
                ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-indigo-500" />
            <span>Facts Ledger ({brandVault.factsLedger.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('glossary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeSubTab === 'glossary'
                ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Terminology Glossary ({brandVault.glossary.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('guidelines')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeSubTab === 'guidelines'
                ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Brand Guidelines ({brandVault.guidelines.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('palette')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeSubTab === 'palette'
                ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <Palette className="w-4 h-4 text-emerald-500" />
            <span>Brand Palette ({brandVault.palette.length})</span>
          </button>
        </div>
      </div>

      {/* 2. FACTS LEDGER TAB */}
      {activeSubTab === 'facts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Fact Form */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-fit space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Add Verified Empirical Claim</span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Add a certified benchmark or performance claim. The audit engine immediately permits this claim in copy.
              </p>
            </div>

            <form onSubmit={handleAddFact} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Empirical Fact Statement *
                </label>
                <input
                  type="text"
                  required
                  value={newFactClaim}
                  onChange={(e) => setNewFactClaim(e.target.value)}
                  placeholder="e.g. Reduces network latency by up to 40%"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Benchmark / Verification Source
                </label>
                <textarea
                  rows={3}
                  value={newFactDetails}
                  onChange={(e) => setNewFactDetails(e.target.value)}
                  placeholder="e.g. Verified by Cloudflare Q3 Telemetry across 200 nodes."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Save Fact to Ledger</span>
              </button>
            </form>
          </div>

          {/* List of Facts */}
          <div className="lg:col-span-2 space-y-3.5">
            {brandVault.factsLedger.map((fact) => (
              <div
                key={fact.id}
                className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                      {fact.id}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Verified: {fact.approvedDate}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {fact.claim}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Source:</span> {fact.benchmarkDetails}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteFact(fact.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                  title="Delete fact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TERMINOLOGY GLOSSARY TAB */}
      {activeSubTab === 'glossary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Glossary Term Form */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-fit space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Add Banned & Preferred Pair</span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Enforces deterministic word replacement. Any occurrence of the banned term triggers an instant high-priority remediation flag.
              </p>
            </div>

            <form onSubmit={handleAddGlossary} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Banned Term / Hype Phrase *
                </label>
                <input
                  type="text"
                  required
                  value={newBannedTerm}
                  onChange={(e) => setNewBannedTerm(e.target.value)}
                  placeholder="e.g. cuts costs by 90%"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Approved Preferred Term *
                </label>
                <input
                  type="text"
                  required
                  value={newPreferredTerm}
                  onChange={(e) => setNewPreferredTerm(e.target.value)}
                  placeholder="e.g. reduces costs by up to 65%"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Governance Reason
                </label>
                <input
                  type="text"
                  value={newTermReason}
                  onChange={(e) => setNewTermReason(e.target.value)}
                  placeholder="e.g. Exceeds verified benchmark in Fact #F-101"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Terminology Glossary</span>
              </button>
            </form>
          </div>

          {/* List of Glossary Terms */}
          <div className="lg:col-span-2 space-y-3.5">
            {brandVault.glossary.map((term) => (
              <div
                key={term.id}
                className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                      Banned
                    </span>
                    <span className="line-through text-rose-600 dark:text-rose-400 font-bold text-sm md:text-base">
                      "{term.bannedTerm}"
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">→</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm md:text-base">
                      "{term.preferredTerm}"
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Policy:</span> {term.reason}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteGlossary(term.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                  title="Delete glossary term"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. BRAND GUIDELINES TAB */}
      {activeSubTab === 'guidelines' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Guideline Form */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-fit space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Add Guideline Directive</span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Define organizational brand rules that guide the RAG evaluation agent and automated policy checker.
              </p>
            </div>

            <form onSubmit={handleAddGuideline} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Section Reference
                </label>
                <input
                  type="text"
                  value={newGuideSection}
                  onChange={(e) => setNewGuideSection(e.target.value)}
                  placeholder="e.g. Sec 5.2 - Comparative Claims"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Guideline Title *
                </label>
                <input
                  type="text"
                  required
                  value={newGuideTitle}
                  onChange={(e) => setNewGuideTitle(e.target.value)}
                  placeholder="e.g. Competitor Comparison Protocol"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description & Directives *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newGuideDesc}
                  onChange={(e) => setNewGuideDesc(e.target.value)}
                  placeholder="State the directive clearly for both deterministic and agentic inspection..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Save Guideline to Brand Book</span>
              </button>
            </form>
          </div>

          {/* List of Guidelines */}
          <div className="lg:col-span-2 space-y-3.5">
            {brandVault.guidelines.map((guide) => {
              const isHighlighted = highlightedSection && guide.section.includes(highlightedSection);

              return (
                <div
                  key={guide.id}
                  className={`rounded-2xl p-5 border transition-all shadow-xs ${
                    isHighlighted
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-400 dark:border-amber-700/80 ring-2 ring-amber-400/40'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          {guide.section}
                        </span>
                        {isHighlighted && (
                          <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-300">
                            Ambiguity Target
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {guide.title}
                      </h4>

                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                        {guide.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteGuideline(guide.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                      title="Delete guideline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. BRAND PALETTE TAB */}
      {activeSubTab === 'palette' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Color Form */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-fit space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Add Approved Color</span>
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Add an official corporate hex code. The visual accessibility engine uses these to sample contrast ratios and pass/fail WCAG AA.
              </p>
            </div>

            <form onSubmit={handleAddColor} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Color Name *
                </label>
                <input
                  type="text"
                  required
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="e.g. Electric Cyan"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Hex Code *
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-slate-100 font-mono uppercase focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Color to Palette</span>
              </button>
            </form>
          </div>

          {/* List of Palette Colors */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {brandVault.palette.map((color) => (
              <div
                key={color.hex}
                className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{color.name}</h4>
                    <span className="text-xs font-mono text-indigo-700 dark:text-indigo-400 font-semibold">{color.hex}</span>
                    <span className="block text-xs text-slate-400 uppercase font-mono">{color.role}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteColor(color.hex)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                  title="Remove color"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
