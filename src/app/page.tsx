'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BrandVaultData,
  AuditIssue,
  AuditResponsePayload,
  UserRole,
  DocumentWorkflowStatus,
  AuditComment,
} from '@/types/brandVault';
import { INITIAL_BRAND_VAULT, SAMPLE_PRESETS, SampleDraftPreset } from '@/lib/brandVaultDefaults';
import { Navbar } from '@/components/Navbar';
import { PresetSelector } from '@/components/PresetSelector';
import { CreatorCanvas } from '@/components/CreatorCanvas';
import { GovernanceInspector } from '@/components/GovernanceInspector';
import { ReviewWorkflowFooter } from '@/components/ReviewWorkflowFooter';
import { BrandVaultManager } from '@/components/BrandVaultManager';
import { executeHybridAudit } from '@/lib/auditEngine';

export default function Home() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<'studio' | 'vault'>('studio');
  const [role, setRole] = useState<UserRole>('creator');
  const [status, setStatus] = useState<DocumentWorkflowStatus>('Draft');

  // Brand Vault State (SSOT, editable in Brand Vault tab)
  const [brandVault, setBrandVault] = useState<BrandVaultData>(INITIAL_BRAND_VAULT);

  // Preset State - default to Sample 1 (5 deliberate violations)
  const [currentPresetId, setCurrentPresetId] = useState<string>('sample-1');
  const [content, setContent] = useState<string>(SAMPLE_PRESETS[0].content);
  const [bannerText, setBannerText] = useState<string>(SAMPLE_PRESETS[0].bannerText);
  const [bannerFgHex, setBannerFgHex] = useState<string>(SAMPLE_PRESETS[0].bannerFgHex);
  const [bannerBgHex, setBannerBgHex] = useState<string>(SAMPLE_PRESETS[0].bannerBgHex);

  // Audit State
  const [auditResult, setAuditResult] = useState<AuditResponsePayload | null>(null);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Collaborative Comments Thread State
  const [comments, setComments] = useState<AuditComment[]>([
    {
      id: 'c-1',
      author: 'Alex Chen (Content Creator)',
      role: 'creator',
      text: 'Drafted Q4 Cloud Launch campaign post and attached promotional banner mockup.',
      timestamp: '10:14 AM',
    },
    {
      id: 'c-2',
      author: 'Seadra Automated Scanner',
      role: 'reviewer',
      text: '⚠️ Initial scan flagged 5 brand governance discrepancies across claims, tone, and WCAG AA contrast.',
      timestamp: '10:15 AM',
    },
  ]);

  // Main Audit Function
  const runAudit = useCallback(
    async (
      overrideContent?: string,
      overrideBannerText?: string,
      overrideFg?: string,
      overrideBg?: string
    ) => {
      setIsAuditing(true);
      const payload = {
        content: overrideContent !== undefined ? overrideContent : content,
        bannerText: overrideBannerText !== undefined ? overrideBannerText : bannerText,
        bannerFgHex: overrideFg !== undefined ? overrideFg : bannerFgHex,
        bannerBgHex: overrideBg !== undefined ? overrideBg : bannerBgHex,
        brandVault,
      };

      try {
        // Fast local hybrid execution
        const res = await executeHybridAudit(payload);
        setAuditResult(res);
        setIssues(res.issues);
      } catch (err) {
        console.error('Audit execution error:', err);
      } finally {
        setIsAuditing(false);
      }
    },
    [content, bannerText, bannerFgHex, bannerBgHex, brandVault]
  );

  // Run initial audit on mount for zero-empty-state 60-second demo
  useEffect(() => {
    runAudit(
      SAMPLE_PRESETS[0].content,
      SAMPLE_PRESETS[0].bannerText,
      SAMPLE_PRESETS[0].bannerFgHex,
      SAMPLE_PRESETS[0].bannerBgHex
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Preset Switching
  const handleSelectPreset = (preset: SampleDraftPreset) => {
    setCurrentPresetId(preset.id);
    setContent(preset.content);
    setBannerText(preset.bannerText);
    setBannerFgHex(preset.bannerFgHex);
    setBannerBgHex(preset.bannerBgHex);
    setStatus(preset.id === 'sample-3' ? 'Approved for Publication' : 'Draft');
    setSelectedIssueId(null);

    // Audit immediately upon preset selection
    runAudit(preset.content, preset.bannerText, preset.bannerFgHex, preset.bannerBgHex);

    // Add audit comment
    setComments((prev) => [
      {
        id: `c-${Date.now()}`,
        author: `${role === 'reviewer' ? 'Reviewer' : 'Creator'}`,
        role,
        text: `Loaded preset: "${preset.name}". Scanner re-initialized.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  // 1-Click Fix Applicator
  const handleApplyFix = (issue: AuditIssue) => {
    let newContent = content;
    let newBannerText = bannerText;
    let newFg = bannerFgHex;
    let newBg = bannerBgHex;

    if (issue.targetField === 'content') {
      // Replace flaggedText with suggestedFix
      newContent = newContent.replace(issue.flaggedText, issue.suggestedFix);
      setContent(newContent);
    } else if (issue.targetField === 'bannerText') {
      newBannerText = newBannerText.replace(issue.flaggedText, issue.suggestedFix);
      // If it's a cross-modal mismatch or complete rewrite
      if (issue.category === 'CROSS_MODAL') {
        newBannerText = 'Enterprise Cloud Optimization: Up to 65% Cost Reduction';
      }
      setBannerText(newBannerText);
    } else if (issue.targetField === 'bannerColors') {
      if (issue.suggestedBgHex && issue.suggestedFgHex) {
        newBg = issue.suggestedBgHex;
        newFg = issue.suggestedFgHex;
        setBannerBgHex(newBg);
        setBannerFgHex(newFg);
      }
    }

    // Mark issue as resolved locally
    setIssues((prev) =>
      prev.map((i) => (i.id === issue.id ? { ...i, status: 'resolved' } : i))
    );

    // Re-run audit with updated parameters
    runAudit(newContent, newBannerText, newFg, newBg);

    // Log comment
    setComments((prev) => [
      {
        id: `c-${Date.now()}`,
        author: 'Seadra Auto-Fix Engine',
        role: 'creator',
        text: `✨ Applied 1-click fix for ${issue.category}: "${issue.flaggedText}" → "${issue.suggestedFix}".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  // Override with Justification
  const handleOverrideIssue = (issueId: string, reason: string) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId ? { ...i, status: 'overridden', overrideReason: reason } : i
      )
    );

    setComments((prev) => [
      {
        id: `c-${Date.now()}`,
        author: `${role === 'reviewer' ? 'Authorised Reviewer' : 'Creator'}`,
        role,
        text: `🛡️ Flag overridden with justification: "${reason}".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  const handleAddComment = (text: string) => {
    setComments((prev) => [
      {
        id: `c-${Date.now()}`,
        author: `${role === 'reviewer' ? 'Authorised Reviewer' : 'Content Creator'}`,
        role,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        setRole={setRole}
        status={status}
        factsCount={brandVault.factsLedger.length}
        glossaryCount={brandVault.glossary.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {activeTab === 'studio' ? (
          <div>
            {/* Top 1-Click Demo Preset Bar */}
            <PresetSelector
              currentPresetId={currentPresetId}
              onSelectPreset={handleSelectPreset}
            />

            {/* Split Screen Studio View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT PANEL: Multi-Format Creator Canvas (7 cols) */}
              <div className="lg:col-span-7">
                <CreatorCanvas
                  content={content}
                  setContent={setContent}
                  bannerText={bannerText}
                  setBannerText={setBannerText}
                  bannerFgHex={bannerFgHex}
                  setBannerFgHex={setBannerFgHex}
                  bannerBgHex={bannerBgHex}
                  setBannerBgHex={setBannerBgHex}
                  onRunAudit={() => runAudit()}
                  isAuditing={isAuditing}
                  issues={issues}
                  approvedPalette={brandVault.palette}
                  onSelectIssue={(id) => setSelectedIssueId(id)}
                />
              </div>

              {/* RIGHT PANEL: Explainable Governance Inspector (5 cols) */}
              <div className="lg:col-span-5">
                <GovernanceInspector
                  auditResult={auditResult}
                  issues={issues}
                  onApplyFix={handleApplyFix}
                  onOverrideIssue={handleOverrideIssue}
                  selectedIssueId={selectedIssueId}
                />
              </div>
            </div>

            {/* Collaborative Review & Approval Workflow Footer */}
            <ReviewWorkflowFooter
              role={role}
              status={status}
              setStatus={setStatus}
              comments={comments}
              onAddComment={handleAddComment}
              complianceScore={auditResult ? auditResult.score : 0}
            />
          </div>
        ) : (
          /* Brand Vault Tab */
          <BrandVaultManager
            brandVault={brandVault}
            setBrandVault={setBrandVault}
            onVaultUpdated={() => runAudit()}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        Seadra Guard © 2026 — Deterministic & Agentic Multi-Modal Brand Governance Platform
      </footer>
    </div>
  );
}

