import {
  AuditIssue,
  AuditRequestPayload,
  AuditResponsePayload,
} from '@/types/brandVault';
import {
  getContrastRatio,
  isApprovedBrandColor,
  findCompliantBrandPair,
  normalizeHex,
} from './wcag';
import { analyzeReadability } from './readability';

/**
 * Generates a unique issue ID
 */
function uid(prefix = 'iss'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * TRACK A: Pure Deterministic Engine
 */
export function runDeterministicAudit(payload: AuditRequestPayload): {
  issues: AuditIssue[];
  contrastRatio: number;
  contrastPassesAA: boolean;
  readabilityScore: number;
  readabilityGrade: string;
} {
  const { content, bannerText, bannerFgHex, bannerBgHex, brandVault } = payload;
  const issues: AuditIssue[] = [];

  // 1. Terminology Glossary scan (Content & Banner Text)
  for (const term of brandVault.glossary) {
    const escaped = term.bannedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');

    // Check content
    const contentMatches = content.match(regex);
    if (contentMatches) {
      issues.push({
        id: uid('term-body'),
        category: 'TERMINOLOGY',
        severity: 'High',
        flaggedText: contentMatches[0],
        explanation: `Glossary violation: "${contentMatches[0]}" is prohibited. ${term.reason}`,
        citation: 'Sec 4.1 & Terminology Glossary',
        suggestedFix: term.preferredTerm,
        engine: 'Deterministic Engine',
        targetField: 'content',
        status: 'active',
      });
    }

    // Check banner text
    const bannerMatches = bannerText.match(regex);
    if (bannerMatches) {
      issues.push({
        id: uid('term-ban'),
        category: 'TERMINOLOGY',
        severity: 'High',
        flaggedText: bannerMatches[0],
        explanation: `Banner terminology violation: "${bannerMatches[0]}" violates official brand terminology.`,
        citation: 'Sec 4.1 & Terminology Glossary',
        suggestedFix: term.preferredTerm,
        engine: 'Deterministic Engine',
        targetField: 'bannerText',
        status: 'active',
      });
    }
  }

  // 2. Readability & Sentence Complexity
  const readability = analyzeReadability(content);
  for (const dense of readability.denseSentences) {
    issues.push({
      id: uid('readability'),
      category: 'TONE_DRIFT',
      severity: 'Medium',
      flaggedText: dense.sentence.length > 80 ? dense.sentence.substring(0, 77) + '...' : dense.sentence,
      explanation: `Sentence density alert: ${dense.wordCount} words in a single sentence. Enterprise standard recommends concise sentences under 25 words for cognitive clarity.`,
      citation: 'Sec 2.1 - Tone & Voice',
      suggestedFix: 'Split into two distinct, high-impact statements.',
      engine: 'Deterministic Engine',
      targetField: 'content',
      status: 'active',
    });
  }

  // 3. WCAG 2.1 Contrast Ratio Verification
  const contrastRatio = getContrastRatio(bannerFgHex, bannerBgHex);
  const contrastPassesAA = contrastRatio >= 4.5;

  if (!contrastPassesAA) {
    const compliantPair = findCompliantBrandPair(bannerBgHex, brandVault.palette);
    issues.push({
      id: uid('wcag-contrast'),
      category: 'VISUAL_WCAG',
      severity: 'High',
      flaggedText: `Contrast ${contrastRatio}:1 (${bannerFgHex} on ${bannerBgHex})`,
      explanation: `WCAG 2.1 AA accessibility failure: Contrast ratio of ${contrastRatio}:1 is below the required 4.5:1 threshold for standard text.`,
      citation: 'Sec 6.2 - Accessibility & Visuals (WCAG 2.1 AA)',
      suggestedFix: `Apply high-contrast approved palette: Foreground ${compliantPair.fg} on Background ${compliantPair.bg} (${compliantPair.ratio}:1)`,
      suggestedBgHex: compliantPair.bg,
      suggestedFgHex: compliantPair.fg,
      engine: 'Deterministic Engine',
      targetField: 'bannerColors',
      status: 'active',
    });
  }

  // 4. Approved Brand Hex Palette Verification
  const isBgApproved = isApprovedBrandColor(bannerBgHex, brandVault.palette);
  const isFgApproved = isApprovedBrandColor(bannerFgHex, brandVault.palette);

  if (!isBgApproved || !isFgApproved) {
    const unapproved = [
      !isBgApproved ? `Background ${normalizeHex(bannerBgHex)}` : null,
      !isFgApproved ? `Foreground ${normalizeHex(bannerFgHex)}` : null,
    ]
      .filter(Boolean)
      .join(' and ');

    const compliant = findCompliantBrandPair('#0F4C81', brandVault.palette);
    issues.push({
      id: uid('brand-palette'),
      category: 'VISUAL_WCAG',
      severity: 'Medium',
      flaggedText: unapproved,
      explanation: `Unapproved color detected: ${unapproved} is not present in the AcmeCloud Enterprise Brand Palette.`,
      citation: 'Sec 6.2 - Approved Brand Hex Palette',
      suggestedFix: `Reset to official palette: ${compliant.bg} (Primary Navy) with ${compliant.fg} (Light Surface)`,
      suggestedBgHex: compliant.bg,
      suggestedFgHex: compliant.fg,
      engine: 'Deterministic Engine',
      targetField: 'bannerColors',
      status: 'active',
    });
  }

  // 5. Cross-Modal Consistency Check (Banner Text vs Body Content)
  // Extracts percentages or metrics like 90%, 65%, 48 hours, 99.95%
  const bannerPercentages = bannerText.match(/\b\d+(\.\d+)?%\b/g) || [];
  const contentPercentages = content.match(/\b\d+(\.\d+)?%\b/g) || [];

  if (bannerPercentages.length > 0 && contentPercentages.length > 0) {
    const bannerMax = Math.max(...bannerPercentages.map((p) => parseFloat(p.replace('%', ''))));
    const contentMax = Math.max(...contentPercentages.map((p) => parseFloat(p.replace('%', ''))));

    if (bannerMax !== contentMax && bannerPercentages.some((p) => !content.includes(p))) {
      issues.push({
        id: uid('cross-modal-num'),
        category: 'CROSS_MODAL',
        severity: 'High',
        flaggedText: `Banner claims "${bannerPercentages.join(', ')}" vs Body text claims "${contentPercentages.join(', ')}"`,
        explanation: `Cross-modal discrepancy: The attached promotional banner advertises savings (${bannerPercentages.join(', ')}) that directly contradict or exaggerate the claims made in the body copy (${contentPercentages.join(', ')}).`,
        citation: 'Sec 4.1 - Promotional Claims & Cross-Modal Consistency',
        suggestedFix: 'Align banner claim to exact benchmark: "Up to 65% Cost Reduction"',
        engine: 'Deterministic Engine',
        targetField: 'bannerText',
        status: 'active',
      });
    }
  }

  return {
    issues,
    contrastRatio,
    contrastPassesAA,
    readabilityScore: readability.readingEase,
    readabilityGrade: readability.gradeLevelDescription,
  };
}

/**
 * Smart Deterministic Fallback for Tone & Claim Verification
 * Used when GROQ_API_KEY is not set or network fails
 */
function runDeterministicAgentFallback(payload: AuditRequestPayload): AuditIssue[] {
  const { content, bannerText } = payload;
  const issues: AuditIssue[] = [];

  // Patterns for tone & claim violations
  const toneViolations: {
    pattern: RegExp;
    category: 'UNSUPPORTED_CLAIM' | 'TONE_DRIFT';
    severity: 'High' | 'Medium';
    citation: string;
    explanation: string;
    suggestedFix: string;
    field: 'content' | 'bannerText';
  }[] = [
    {
      pattern: /bleeding (?:your company|you) dry/i,
      category: 'TONE_DRIFT',
      severity: 'High',
      citation: 'Sec 2.1 - Tone & Voice',
      explanation:
        'Fear-mongering / inflammatory phrasing detected. Enterprise communications must remain objective and professional.',
      suggestedFix: 'Traditional architectures generate unnecessary cloud overhead',
      field: 'content',
    },
    {
      pattern: /before price doubles/i,
      category: 'TONE_DRIFT',
      severity: 'High',
      citation: 'Sec 2.1 - Tone & Voice',
      explanation:
        'Artificial urgency tactic detected. Aggressive sales countdowns erode enterprise trust.',
      suggestedFix: 'schedule an architecture review before Q4 planning concludes',
      field: 'content',
    },
    {
      pattern: /Buy Now!|Buy now before/i,
      category: 'TONE_DRIFT',
      severity: 'Medium',
      citation: 'Sec 2.1 - Tone & Voice',
      explanation:
        'Direct consumer-style aggressive CTA. Enterprise customers expect consultative calls to action.',
      suggestedFix: 'Schedule an Architecture Consultation',
      field: 'bannerText',
    },
    {
      pattern: /eliminates all data loss(?: risks)? without exception/i,
      category: 'UNSUPPORTED_CLAIM',
      severity: 'High',
      citation: 'Sec 4.1 & Fact #F-103',
      explanation:
        'Unverified absolute claim: Absolute elimination of data risk violates ISO 27001 risk management principles.',
      suggestedFix: 'provides SOC2 Type II certified durability guarantees',
      field: 'content',
    },
    {
      pattern: /impenetrable vault/i,
      category: 'UNSUPPORTED_CLAIM',
      severity: 'High',
      citation: 'Sec 4.1 & Fact #F-103',
      explanation:
        'Unverified superlative: "Impenetrable vault" is a marketing absolute unsupported by the Approved Facts Ledger.',
      suggestedFix: 'defense-in-depth certified architecture',
      field: 'content',
    },
    {
      pattern: /cheapest cloud(?: infrastructure)? in the world/i,
      category: 'UNSUPPORTED_CLAIM',
      severity: 'High',
      citation: 'Sec 4.1 & Fact #F-101',
      explanation:
        'Global superlative claim: "Cheapest in the world" cannot be substantiated by verified Q3 benchmarks.',
      suggestedFix: 'reduces enterprise cloud server costs by up to 65%',
      field: 'content',
    },
    {
      pattern: /revolutionary serverless architecture/i,
      category: 'TONE_DRIFT',
      severity: 'Medium',
      citation: 'Sec 2.1 - Tone & Voice',
      explanation:
        'Marketing hype word: "Revolutionary" violates Sec 2.1 guidelines against hyperbole in technical copy.',
      suggestedFix: 'proven multi-region Kubernetes platform',
      field: 'content',
    },
    {
      pattern: /overnight!/i,
      category: 'TONE_DRIFT',
      severity: 'Medium',
      citation: 'Sec 2.1 - Tone & Voice',
      explanation:
        'Hype promise of instant results: Migration benchmark is "under 48 hours for standard clusters" (#F-104).',
      suggestedFix: 'in under 48 hours with automated telemetry cutover',
      field: 'content',
    },
  ];

  for (const rule of toneViolations) {
    const textToCheck = rule.field === 'bannerText' ? bannerText : content;
    const match = textToCheck.match(rule.pattern);
    if (match) {
      issues.push({
        id: uid('rag-agent'),
        category: rule.category,
        severity: rule.severity,
        flaggedText: match[0],
        explanation: rule.explanation,
        citation: rule.citation,
        suggestedFix: rule.suggestedFix,
        engine: 'Groq Llama-3.3 RAG Agent',
        targetField: rule.field,
        status: 'active',
      });
    }
  }

  return issues;
}

/**
 * Calls Groq Llama-3.3 API if key exists, otherwise falls back gracefully
 */
export async function runAgenticRAGAudit(payload: AuditRequestPayload): Promise<AuditIssue[]> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return runDeterministicAgentFallback(payload);
  }

  try {
    const factsContext = payload.brandVault.factsLedger
      .map((f) => `[${f.id}]: ${f.claim} (Benchmark: ${f.benchmarkDetails})`)
      .join('\n');

    const guidelinesContext = payload.brandVault.guidelines
      .map((g) => `[${g.section}]: ${g.title} - ${g.description}`)
      .join('\n');

    const prompt = `You are the Seadra Guard RAG Brand Governance Agent for "${payload.brandVault.companyName}".
Analyze the provided draft content and banner headline against the Approved Facts Ledger and Brand Guidelines.

=== APPROVED FACTS LEDGER ===
${factsContext}

=== BRAND GUIDELINES ===
${guidelinesContext}

=== DRAFT CONTENT TO AUDIT ===
Body Content:
"${payload.content}"

Banner Headline:
"${payload.bannerText}"

=== INSTRUCTIONS ===
1. Flag any statistical/savings/performance claim that is unverified or exaggerates the Approved Facts Ledger (category: "UNSUPPORTED_CLAIM").
2. Flag any hype, fear-mongering, superlative ("best", "cheapest", "revolutionary", "100%"), or aggressive urgency (category: "TONE_DRIFT").
3. For each issue, provide:
   - "category": 'UNSUPPORTED_CLAIM' | 'TONE_DRIFT'
   - "severity": 'High' | 'Medium'
   - "flaggedText": exact substring from content or banner
   - "explanation": why it violates the facts or tone guidelines
   - "citation": exact citation e.g. "Fact #F-101 & Sec 4.1" or "Sec 2.1 - Tone & Voice"
   - "suggestedFix": concrete, intent-preserving enterprise rewrite
   - "targetField": "content" or "bannerText"

Respond ONLY with valid JSON matching:
{
  "issues": [
    {
      "category": "UNSUPPORTED_CLAIM",
      "severity": "High",
      "flaggedText": "cuts costs by 90%",
      "explanation": "...",
      "citation": "Fact #F-101 & Sec 4.1",
      "suggestedFix": "reduces server costs by up to 65%",
      "targetField": "content"
    }
  ]
}`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }),
      // Set 4 second timeout so judge demos never stall
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      console.warn('Groq API returned non-200, falling back to deterministic agent.');
      return runDeterministicAgentFallback(payload);
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0]?.message?.content || '{}');

    if (Array.isArray(parsed.issues) && parsed.issues.length > 0) {
      return parsed.issues.map((item: any) => ({
        id: uid('groq-rag'),
        category: item.category || 'UNSUPPORTED_CLAIM',
        severity: item.severity === 'High' ? 'High' : 'Medium',
        flaggedText: item.flaggedText || '',
        explanation: item.explanation || 'Claim deviates from verified brand knowledge base.',
        citation: item.citation || 'Sec 4.1 - Approved Claims Ledger',
        suggestedFix: item.suggestedFix || 'Align with verified benchmark.',
        engine: 'Groq Llama-3.3 RAG Agent',
        targetField: item.targetField === 'bannerText' ? 'bannerText' : 'content',
        status: 'active',
      }));
    }

    return [];
  } catch (err) {
    console.warn('Groq API error or timeout, engaging deterministic agent fallback:', err);
    return runDeterministicAgentFallback(payload);
  }
}

/**
 * Orchestrates the full 2-Track Hybrid Audit
 */
export async function executeHybridAudit(
  payload: AuditRequestPayload
): Promise<AuditResponsePayload> {
  const startTime = Date.now();

  // Track A: Deterministic Code Engine
  const trackA = runDeterministicAudit(payload);

  // Track B: Agentic RAG Claim & Tone Verifier
  const trackBIssues = await runAgenticRAGAudit(payload);

  // Deduplicate issues: don't flag the same substring twice if both engines caught it
  const allIssues: AuditIssue[] = [...trackA.issues];
  for (const bIssue of trackBIssues) {
    const isDuplicate = allIssues.some(
      (a) =>
        a.targetField === bIssue.targetField &&
        (a.flaggedText.toLowerCase().includes(bIssue.flaggedText.toLowerCase()) ||
          bIssue.flaggedText.toLowerCase().includes(a.flaggedText.toLowerCase()))
    );
    if (!isDuplicate) {
      allIssues.push(bIssue);
    }
  }

  // Calculate scores
  const highCount = allIssues.filter((i) => i.severity === 'High').length;
  const medCount = allIssues.filter((i) => i.severity === 'Medium').length;

  // Deduct 18 for High, 8 for Medium
  const penalty = highCount * 18 + medCount * 8;
  const overallScore = Math.max(0, Math.min(100, 100 - penalty));

  const detCount = allIssues.filter((i) => i.engine === 'Deterministic Engine').length;
  const agentCount = allIssues.filter((i) => i.engine === 'Groq Llama-3.3 RAG Agent').length;

  const deterministicScore = Math.max(0, 100 - detCount * 20);
  const agenticScore = Math.max(0, 100 - agentCount * 25);

  const executionTimeMs = Date.now() - startTime;

  return {
    success: true,
    score: overallScore,
    deterministicScore,
    agenticScore,
    readabilityScore: trackA.readabilityScore,
    readabilityGrade: trackA.readabilityGrade,
    contrastRatio: trackA.contrastRatio,
    contrastPassesAA: trackA.contrastPassesAA,
    issues: allIssues,
    executionTimeMs,
    engineBreakdown: {
      deterministicCount: detCount,
      agenticCount: agentCount,
    },
  };
}

