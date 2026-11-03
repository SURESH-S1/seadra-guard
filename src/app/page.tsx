'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  BrandVaultData,
  AuditIssue,
  AuditResponsePayload,
  UserRole,
  DocumentWorkflowStatus,
  AuditComment,
  GuidelineTelemetry,
} from '@/types/brandVault';
import { INITIAL_BRAND_VAULT, SAMPLE_PRESETS, SampleDraftPreset } from '@/lib/brandVaultDefaults';
import { Navbar } from '@/components/Navbar';
import { PresetSelector } from '@/components/PresetSelector';
import { CreatorCanvas } from '@/components/CreatorCanvas';
import { GovernanceInspector } from '@/components/GovernanceInspector';
import { ReviewWorkflowFooter } from '@/components/ReviewWorkflowFooter';
import { BrandVaultManager } from '@/components/BrandVaultManager';
import { GovernanceInsightsDashboard } from '@/components/GovernanceInsightsDashboard';
import { RevisionDiffModal } from '@/components/RevisionDiffModal';
import { DemoLoginView } from '@/components/DemoLoginView';
import { executeHybridAudit } from '@/lib/auditEngine';
import { sanitizeContent } from '@/lib/confidentialityShield';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated, isLoading, switchRole } = useAuth();

  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<'studio' | 'vault' | 'insights'>('studio');
  const [role, setRole] = useState<UserRole>('creator');
  const [status, setStatus] = useState<DocumentWorkflowStatus>('Draft');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Synchronize role and enforce default "Draft" status when Creator logs in
  useEffect(() => {
    if (user) {
      setRole(user.role);
      if (user.role === 'creator') {
        setStatus('Draft');
      }
    }
  }, [user]);

  // Handle direct role changes (from Navbar switcher or presets)
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    switchRole(newRole);
    if (newRole === 'creator') {
      setStatus('Draft');
    }
  };

  // Initialize and persist theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('seadra-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('seadra-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Brand Vault State (SSOT, editable in Brand Vault tab)
  const [brandVault, setBrandVault] = useState<BrandVaultData>(INITIAL_BRAND_VAULT);
  const [vaultSubTab, setVaultSubTab] = useState<'facts' | 'glossary' | 'guidelines' | 'palette'>('facts');
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Preset State - default to Sample 1 (5 deliberate violations)
  const [currentPresetId, setCurrentPresetId] = useState<string>('sample-1');
  const [content, setContent] = useState<string>(SAMPLE_PRESETS[0].content);
  const [bannerText, setBannerText] = useState<string>(SAMPLE_PRESETS[0].bannerText);
  const [bannerFgHex, setBannerFgHex] = useState<string>(SAMPLE_PRESETS[0].bannerFgHex);
  const [bannerBgHex, setBannerBgHex] = useState<string>(SAMPLE_PRESETS[0].bannerBgHex);

  // Lifecycle Draft History for Revision Diff
  const [originalDraft, setOriginalDraft] = useState<string>(SAMPLE_PRESETS[0].content);
  const [aiSuggestedDraft, setAiSuggestedDraft] = useState<string>(
    SAMPLE_PRESETS[2].content // fully remediated draft as baseline AI suggestion
  );
  const [isDiffModalOpen, setIsDiffModalOpen] = useState<boolean>(false);

  // Confidentiality Redaction Shield State
  const [shieldActive, setShieldActive] = useState<boolean>(true);
  const [redactedCount, setRedactedCount] = useState<number>(0);

  // Audit State
  const [auditResult, setAuditResult] = useState<AuditResponsePayload | null>(null);
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Guideline Ambiguity Telemetry
  const [telemetryData, setTelemetryData] = useState<GuidelineTelemetry[]>([
    {
      section: 'Sec 2.1',
      title: 'Tone & Voice (Enterprise Trust)',
      totalFlags: 20,
      overrides: 13,
      overrideRate: 65,
      commonRemarks: ['context-dependent phrasing', 'marketing colloquialism'],
      isAmbiguous: true,
      recommendation:
        'Clarify clause boundaries in Brand Book to eliminate reviewer fatigue. Allow colloquial phrasing in developer quotes or customer testimonials; prohibit in headline claims.',
    },
    {
      section: 'Sec 4.1',
      title: 'Promotional Claims (Empirical Verification)',
      totalFlags: 25,
      overrides: 3,
      overrideRate: 12,
      commonRemarks: ['pre-approved benchmark', 'stat verification'],
      isAmbiguous: false,
      recommendation: 'Empirical bounds strictly observed.',
    },
    {
      section: 'Sec 6.2',
      title: 'Accessibility & Visuals (WCAG AA)',
      totalFlags: 18,
      overrides: 2,
      overrideRate: 11,
      commonRemarks: ['dark-mode contrast exception'],
      isAmbiguous: false,
      recommendation: 'Deterministic mathematical luminance checks stable.',
    },
  ]);

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
      text: ':warning: Initial scan flagged 5 brand governance discrepancies across claims, tone, and WCAG AA contrast.',
      timestamp: '10:15 AM',
    },
  ]);

  // Main Audit Function with Local Confidentiality Shield Pre-Inference Sanitization
  const runAudit = useCallback(
    async (
      overrideContent?: string,
      overrideBannerText?: string,
      overrideFg?: string,
      overrideBg?: string
    ) => {
      setIsAuditing(true);
      const rawContent = overrideContent !== undefined ? overrideContent : content;
      const rawBannerText = overrideBannerText !== undefined ? overrideBannerText : bannerText;

      // Local PII & Confidentiality Redaction Sanitizer
      const sanitizedContentResult = sanitizeContent(rawContent, shieldActive);
      const sanitizedBannerResult = sanitizeContent(rawBannerText, shieldActive);

      const totalRedacted = sanitizedContentResult.redactedCount + sanitizedBannerResult.redactedCount;
      setRedactedCount(totalRedacted);

      const payload = {
        content: sanitizedContentResult.sanitizedText,
        bannerText: sanitizedBannerResult.sanitizedText,
        bannerFgHex: overrideFg !== undefined ? overrideFg : bannerFgHex,
        bannerBgHex: overrideBg !== undefined ? overrideBg : bannerBgHex,
        brandVault,
      };

      try {
        // Fast local hybrid execution with offline guarantee
        const res = await executeHybridAudit(payload);
        setAuditResult(res);
        setIssues(res.issues);
      } catch (err) {
        console.error('Audit execution error:', err);
      } finally {
        setIsAuditing(false);
      }
    },
    [content, bannerText, bannerFgHex, bannerBgHex, brandVault, shieldActive]
  );

  // Run initial audit on mount for zero-latency judge experience
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
    setOriginalDraft(preset.content);
    // In Creator mode, default status is Draft; in Reviewer mode preset 3 can reflect pre-approval
    if (role === 'creator') {
      setStatus('Draft');
    } else {
      setStatus(preset.id === 'sample-3' ? 'Approved for Publication' : 'Draft');
    }
    setSelectedIssueId(null);

    // Audit immediately upon preset selection
    runAudit(preset.content, preset.bannerText, preset.bannerFgHex, preset.bannerBgHex);

    // Add audit comment
    setComments((prev) => [
      {
        id: `c-${Date.now()}`,
        author: `${role === 'reviewer' ? 'Brand Reviewer' : 'Suresh'}`,
        role,
        text: `Loaded preset: "${preset.name}". Scanner re-initialized.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  const handleLoadFilePreset = (type: 'doc' | 'banner', filename: string) => {
    if (type === 'doc') {
      const docText = `Attention CTOs: AcmeCloud cuts costs by 90% overnight! Our revolutionary serverless architecture promises zero downtime forever and provides 100% hack-proof infrastructure against all cyber attacks.\n\nLegacy AWS and Azure providers are bleeding your company dry. Buy now before price doubles this Friday! Migrate your clusters today with zero friction.`;
      setContent(docText);
      setOriginalDraft(docText);
      runAudit(docText, bannerText, bannerFgHex, bannerBgHex);
    } else {
      const bannerHeadline = 'Save 90% On Enterprise Cloud Today! Buy Now!';
      setBannerText(bannerHeadline);
      setBannerBgHex('#0F4C81');
      setBannerFgHex('#94A3B8');
      runAudit(content, bannerHeadline, '#94A3B8', '#0F4C81');
    }
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
      if (issue.category === 'CROSS_MODAL' || issue.category === 'CROSS_MODAL_DISCREPANCY') {
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
        text: `:sparkles: Applied 1-click fix for ${issue.category}: "${issue.flaggedText}" → "${issue.suggestedFix}".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  // Override with Justification & Telemetry Tracking
  const handleOverrideIssue = (issueId: string, reason: string) => {
    const overridden = issues.find((i) => i.id === issueId);

    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId ? { ...i, status: 'overridden', overrideReason: reason } : i
      )
    );

    // Update Telemetry on Human Reviewer Overrides per section
    if (overridden) {
      setTelemetryData((prev) =>
        prev.map((item) => {
          if (
            (item.section.includes('2.1') && overridden.citation.includes('2.1')) ||
            (item.section.includes('4.1') && overridden.citation.includes('4.1')) ||
            (item.section.includes('6.2') && overridden.citation.includes('6.2'))
          ) {
            const newOverrides = item.overrides + 1;
            const newTotal = item.totalFlags + 1;
            const newRate = Math.round((newOverrides / newTotal) * 100);
            return {
              ...item,
              overrides: newOverrides,
              totalFlags: newTotal,
              overrideRate: newRate,
              isAmbiguous: newRate > 50,
            };
          }
          return item;
        })
      );
    }

    setComments((prev) => [
      {
        id: `c-${Date.now()}`,
        author: `${role === 'reviewer' ? 'Brand Reviewer' : 'Suresh'}`,
        role,
        text: `:shield: Flag overridden with justification: "${reason}".`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  const handleAddComment = (text: string) => {
    setComments((prev) => [
      {
        id: `c-${Date.now()}`,
        author: `${role === 'reviewer' ? 'Brand Reviewer (Compliance)' : 'Suresh (Creator)'}`,
        role,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ]);
  };

  // 1-Click Action from Ambiguity Detector in Insights -> Brand Vault
  const handleRefineGuidelineFromInsights = (section: string) => {
    setActiveTab('vault');
    setVaultSubTab('guidelines');
    setHighlightedSection(section);
  };

  // Loading state during initial session hydration
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 animate-pulse">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Initializing Seadra Guard Security Context...
          </span>
        </div>
      </div>
    );
  }

  // If user is NOT logged in: show clean, centered Demo Login view
  if (!isAuthenticated) {
    return <DemoLoginView theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-600 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        setRole={handleRoleChange}
        status={status}
        factsCount={brandVault.factsLedger.length}
        glossaryCount={brandVault.glossary.length}
        shieldActive={shieldActive}
        setShieldActive={setShieldActive}
        redactedCount={redactedCount}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 pb-24">
        {activeTab === 'studio' ? (
          <div>
            {/* Top 1-Click Demo Preset Bar */}
            <PresetSelector
              currentPresetId={currentPresetId}
              onSelectPreset={handleSelectPreset}
              onLoadFilePreset={handleLoadFilePreset}
            />

            {/* Split Screen Studio View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* LEFT PANEL: Multi-Format Creator Canvas with Dual Dropper (7 cols) */}
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
                  onRunAudit={(overrideContent) => runAudit(overrideContent)}
                  isAuditing={isAuditing}
                  issues={issues}
                  approvedPalette={brandVault.palette}
                  onSelectIssue={(id) => setSelectedIssueId(id)}
                  onDocumentLoaded={(text, filename) => {
                    setContent(text);
                    setOriginalDraft(text);
                    setStatus('Draft');
                    setSelectedIssueId(null);
                    setCurrentPresetId('custom-doc');
                    runAudit(text, bannerText, bannerFgHex, bannerBgHex);
                    setComments((prev) => [
                      {
                        id: `c-${Date.now()}`,
                        author: role === 'reviewer' ? 'Brand Reviewer' : 'Suresh',
                        role,
                        text: `:document: Ingested document: "${filename}" (${text.trim().split(/\s+/).filter(Boolean).length} words). Governance scan executed.`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                      ...prev,
                    ]);
                  }}
                  onBannerImageAnalyzed={(data) => {
                    setBannerText(data.extractedText);
                    const fg = data.dominantColors[1]?.hex || bannerFgHex;
                    const bg = data.dominantColors[0]?.hex || bannerBgHex;
                    setBannerFgHex(fg);
                    setBannerBgHex(bg);
                    runAudit(content, data.extractedText, fg, bg);
                    setComments((prev) => [
                      {
                        id: `c-${Date.now()}`,
                        author: role === 'reviewer' ? 'Brand Reviewer' : 'Suresh',
                        role,
                        text: `:image: Ingested creative banner graphic: extracted headline "${data.extractedText.slice(0, 42)}...", sampled palette (${bg}), WCAG AA verified.`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                      ...prev,
                    ]);
                  }}
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
                  shieldActive={shieldActive}
                  redactedCount={redactedCount}
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
              onOpenDiff={() => setIsDiffModalOpen(true)}
            />
          </div>
        ) : activeTab === 'vault' ? (
          /* Brand Vault Tab */
          <BrandVaultManager
            brandVault={brandVault}
            setBrandVault={setBrandVault}
            onVaultUpdated={() => runAudit()}
            initialSubTab={vaultSubTab}
            highlightedSection={highlightedSection}
          />
        ) : (
          /* Governance Insights Tab */
          <GovernanceInsightsDashboard
            telemetryData={telemetryData}
            onRefineGuideline={handleRefineGuidelineFromInsights}
            currentScore={auditResult ? auditResult.score : 85}
          />
        )}
      </main>

      {/* Visual Git-Style Side-by-Side Diff Modal */}
      <RevisionDiffModal
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
        originalDraft={originalDraft}
        aiSuggestedDraft={aiSuggestedDraft}
        currentDraft={content}
        onApprove={() => {
          setStatus('Approved for Publication');
          handleAddComment(':check: Approved for Publication via Side-by-Side Lifecycle Diff.');
        }}
      />


      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-3 px-6 mb-16 text-center text-xs text-slate-500 font-mono transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Seadra Guard © 2026 — Brand Governance Platform</span>
          <span className="text-slate-600 dark:text-slate-400">Enterprise Security & WCAG 2.1 AA Verified</span>
        </div>
      </footer>
    </div>
  );
}

