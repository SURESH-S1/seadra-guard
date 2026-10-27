export type IssueCategory =
  | 'UNSUPPORTED_CLAIM'
  | 'TERMINOLOGY'
  | 'TONE_DRIFT'
  | 'VISUAL_WCAG'
  | 'CROSS_MODAL';

export type IssueSeverity = 'High' | 'Medium';

export type EngineType = 'Deterministic Engine' | 'Groq Llama-3.3 RAG Agent';

export interface AuditIssue {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  flaggedText: string;
  explanation: string;
  citation: string; // e.g. "Fact #F-101" or "Sec 2.1 - Tone & Voice"
  suggestedFix: string;
  engine: EngineType;
  targetField: 'content' | 'bannerText' | 'bannerColors';
  suggestedBgHex?: string;
  suggestedFgHex?: string;
  status: 'active' | 'resolved' | 'overridden';
  overrideReason?: string;
}

export interface BrandGuideline {
  id: string;
  section: string; // e.g. "Sec 2.1 - Tone & Voice"
  title: string;
  description: string;
  ruleCategory: 'tone' | 'claim' | 'visual' | 'general';
}

export interface ApprovedFact {
  id: string; // e.g. "#F-101"
  claim: string;
  benchmarkDetails: string;
  approvedDate: string;
}

export interface GlossaryTerm {
  id: string;
  bannedTerm: string;
  preferredTerm: string;
  reason: string;
}

export interface BrandColor {
  name: string;
  hex: string;
  role: 'primary' | 'secondary' | 'accent' | 'surface' | 'neutral';
}

export interface BrandVaultData {
  companyName: string;
  guidelines: BrandGuideline[];
  factsLedger: ApprovedFact[];
  glossary: GlossaryTerm[];
  palette: BrandColor[];
}

export type UserRole = 'creator' | 'reviewer';

export type DocumentWorkflowStatus =
  | 'Draft'
  | 'In Review'
  | 'Changes Requested'
  | 'Approved for Publication';

export interface AuditComment {
  id: string;
  author: string;
  role: UserRole;
  text: string;
  timestamp: string;
}

export interface AuditRequestPayload {
  content: string;
  bannerText: string;
  bannerFgHex: string;
  bannerBgHex: string;
  brandVault: BrandVaultData;
}

export interface AuditResponsePayload {
  success: boolean;
  score: number;
  deterministicScore: number;
  agenticScore: number;
  readabilityScore: number;
  readabilityGrade: string;
  contrastRatio: number;
  contrastPassesAA: boolean;
  issues: AuditIssue[];
  executionTimeMs: number;
  engineBreakdown: {
    deterministicCount: number;
    agenticCount: number;
  };
}

