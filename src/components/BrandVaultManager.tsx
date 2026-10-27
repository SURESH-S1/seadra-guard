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
} from 'lucide-react';
import { INITIAL_BRAND_VAULT } from '@/lib/brandVaultDefaults';

interface BrandVaultManagerProps {
  brandVault: BrandVaultData;
  setBrandVault: React.Dispatch<React.SetStateAction<BrandVaultData>>;
  onVaultUpdated?: () => void;
}

export const BrandVaultManager: React.FC<BrandVaultManagerProps> = ({
  brandVault,
  setBrandVault,
  onVaultUpdated,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'facts' | 'glossary' | 'guidelines' | 'palette'>('facts');

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
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {brandVault.companyName} Brand Vault & Deterministic Rules Ledger
              </h2>
              <p className="text-xs text-slate-400">
                Single Source of Truth (SSOT). All rules, benchmarked facts, banned terminology, and hex palettes here govern both Track A Deterministic and Track B Agentic audits in real time.
              </p>
            </div>
          </div>

          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to AcmeCloud Defaults</span>
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('facts')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'facts'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Approved Facts Ledger ({brandVault.factsLedger.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('glossary')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'glossary'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Terminology Glossary ({brandVault.glossary.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('guidelines')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'guidelines'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Brand Guidelines ({brandVault.guidelines.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('palette')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'palette'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Approved Brand Palette ({brandVault.palette.length})</span>
          </button>
        </div>
      </div>

      {/* 1. FACTS LEDGER TAB */}
      {activeSubTab === 'facts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Fact Form */}
          <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm h-fit">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Add Verified Empirical Claim</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a certified statistic or performance claim. The scanner immediately permits this claim in copy.
            </p>

            <form onSubmit={handleAddFact} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Empirical Fact Statement *
                </label>
                <input
                  type="text"
                  required
                  value={newFactClaim}
                  onChange={(e) => setNewFactClaim(e.target.value)}
                  placeholder="e.g. Reduces network latency by up to 40%"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Benchmark / Verification Source
                </label>
                <textarea
                  rows={3}
                  value={newFactDetails}
                  onChange={(e) => setNewFactDetails(e.target.value)}
                  placeholder="e.g. Verified by Cloudflare Q3 Telemetry across 200 nodes."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save Fact to Ledger</span>
              </button>
            </form>
          </div>

          {/* List of Facts */}
          <div className="lg:col-span-2 space-y-3">
            {brandVault.factsLedger.map((fact) => (
              <div
                key={fact.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                      {fact.id}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Verified: {fact.approvedDate}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">{fact.claim}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Source: {fact.benchmarkDetails}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteFact(fact.id)}
                  className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                  title="Remove fact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. GLOSSARY TAB */}
      {activeSubTab === 'glossary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Glossary Form */}
          <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm h-fit">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Add Banned & Preferred Pair</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enforces deterministic word replacement. Any occurrence of the banned term will trigger an instant high-priority flag.
            </p>

            <form onSubmit={handleAddGlossary} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Banned Term / Hype Phrase *
                </label>
                <input
                  type="text"
                  required
                  value={newBannedTerm}
                  onChange={(e) => setNewBannedTerm(e.target.value)}
                  placeholder="e.g. cuts costs by 90%"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Approved Preferred Term *
                </label>
                <input
                  type="text"
                  required
                  value={newPreferredTerm}
                  onChange={(e) => setNewPreferredTerm(e.target.value)}
                  placeholder="e.g. reduces server costs by up to 65%"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Governance Reason
                </label>
                <input
                  type="text"
                  value={newTermReason}
                  onChange={(e) => setNewTermReason(e.target.value)}
                  placeholder="e.g. Violates verified benchmark in Fact #F-101"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Terminology Glossary</span>
              </button>
            </form>
          </div>

          {/* List of Glossary Terms */}
          <div className="lg:col-span-2 space-y-3">
            {brandVault.glossary.map((term) => (
              <div
                key={term.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono line-through text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                      "{term.bannedTerm}"
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className="font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      "{term.preferredTerm}"
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{term.reason}</p>
                </div>

                <button
                  onClick={() => handleDeleteGlossary(term.id)}
                  className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                  title="Remove term"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. GUIDELINES TAB */}
      {activeSubTab === 'guidelines' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Guideline Form */}
          <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm h-fit">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Add Brand Guideline Section</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Defines governance criteria for Tone, Voice, Claims, and Visual design.
            </p>

            <form onSubmit={handleAddGuideline} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Section Reference
                </label>
                <input
                  type="text"
                  value={newGuideSection}
                  onChange={(e) => setNewGuideSection(e.target.value)}
                  placeholder="e.g. Sec 5.2 - Comparative Claims"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Guideline Title *
                </label>
                <input
                  type="text"
                  required
                  value={newGuideTitle}
                  onChange={(e) => setNewGuideTitle(e.target.value)}
                  placeholder="e.g. Competitor Comparison Protocol"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Description & Directives *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newGuideDesc}
                  onChange={(e) => setNewGuideDesc(e.target.value)}
                  placeholder="State the directive clearly for both deterministic and agentic inspection..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save Guideline</span>
              </button>
            </form>
          </div>

          {/* List of Guidelines */}
          <div className="lg:col-span-2 space-y-3">
            {brandVault.guidelines.map((guide) => (
              <div
                key={guide.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                      {guide.section}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">{guide.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{guide.description}</p>
                </div>

                <button
                  onClick={() => handleDeleteGuideline(guide.id)}
                  className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                  title="Remove guideline"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PALETTE TAB */}
      {activeSubTab === 'palette' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Color Form */}
          <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm h-fit">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Add Approved Brand Color</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              All promotional banners are checked against this palette. Non-whitelisted colors trigger visual governance flags.
            </p>

            <form onSubmit={handleAddColor} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Color Name *
                </label>
                <input
                  type="text"
                  required
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="e.g. Electric Cyan"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Hex Code *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-9 h-9 rounded border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Color to Palette</span>
              </button>
            </form>
          </div>

          {/* List of Palette Colors */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {brandVault.palette.map((color) => (
              <div
                key={color.hex}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg border border-white/20 shadow-md flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{color.name}</h4>
                    <span className="text-xs font-mono text-teal-400">{color.hex}</span>
                    <span className="block text-[10px] text-slate-500 uppercase">{color.role}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteColor(color.hex)}
                  className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
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

