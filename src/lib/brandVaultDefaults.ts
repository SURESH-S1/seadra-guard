import { BrandVaultData } from '@/types/brandVault';

export const INITIAL_BRAND_VAULT: BrandVaultData = {
  companyName: 'AcmeCloud Enterprise',
  guidelines: [
    {
      id: 'g-1',
      section: 'Sec 2.1 - Tone & Voice',
      title: 'Enterprise Trust & Tone',
      description:
        'Maintain an objective, enterprise-grade, trustworthy tone. Avoid hype, fear-mongering, or aggressive urgency.',
      ruleCategory: 'tone',
    },
    {
      id: 'g-2',
      section: 'Sec 4.1 - Promotional Claims',
      title: 'Empirical Verification',
      description:
        'All statistical or performance claims must exactly match an entry in the Approved Facts Ledger. Unverified superlatives are prohibited.',
      ruleCategory: 'claim',
    },
    {
      id: 'g-3',
      section: 'Sec 6.2 - Accessibility & Visuals',
      title: 'Visual Compliance & WCAG AA',
      description:
        'Promotional assets must maintain a WCAG 2.1 AA contrast ratio of at least 4.5:1 and use approved brand hex codes.',
      ruleCategory: 'visual',
    },
  ],
  factsLedger: [
    {
      id: '#F-101',
      claim: 'Reduces enterprise cloud server costs by up to 65%',
      benchmarkDetails: 'Verified Q3 2024 independent benchmark across 40 Fortune 500 Kubernetes clusters.',
      approvedDate: '2024-09-15',
    },
    {
      id: '#F-102',
      claim: 'Guarantees 99.95% SLA uptime across multi-region deployments',
      benchmarkDetails: 'Backed by tier-4 enterprise SLA contracts with financial credit guarantees.',
      approvedDate: '2024-08-01',
    },
    {
      id: '#F-103',
      claim: 'SOC2 Type II and ISO 27001 certified security architecture',
      benchmarkDetails: 'Audited annually by Ernst & Young, continuous compliance scanning.',
      approvedDate: '2024-07-20',
    },
    {
      id: '#F-104',
      claim: 'Onboarding and migration completed in under 48 hours for standard clusters',
      benchmarkDetails: 'Automated terraform blue/green cutover telemetry.',
      approvedDate: '2024-10-02',
    },
  ],
  glossary: [
    {
      id: 'term-1',
      bannedTerm: 'cuts costs by 90%',
      preferredTerm: 'reduces server costs by up to 65%',
      reason: 'Exaggerated savings claim violates Fact #F-101 (actual benchmark is up to 65%).',
    },
    {
      id: 'term-2',
      bannedTerm: 'zero downtime forever',
      preferredTerm: '99.95% SLA uptime',
      reason: 'Absolute claim impossible under distributed systems laws; violates Fact #F-102.',
    },
    {
      id: 'term-3',
      bannedTerm: '100% hack-proof',
      preferredTerm: 'SOC2 Type II certified security',
      reason: 'Unverified superlative; security guidelines mandate citing concrete certifications (#F-103).',
    },
    {
      id: 'term-4',
      bannedTerm: 'cheapest cloud',
      preferredTerm: 'cost-optimized enterprise cloud',
      reason: 'Cheap implies degraded quality; Sec 2.1 mandates enterprise-grade language.',
    },
    {
      id: 'term-5',
      bannedTerm: 'buy now before price doubles',
      preferredTerm: 'schedule an architecture review',
      reason: 'Aggressive consumer urgency violates Sec 2.1 B2B trust standards.',
    },
  ],
  palette: [
    { name: 'Primary Navy', hex: '#0F4C81', role: 'primary' },
    { name: 'Deep Slate', hex: '#1B263B', role: 'secondary' },
    { name: 'Teal Accent', hex: '#00A896', role: 'accent' },
    { name: 'Light Surface', hex: '#F8FAFC', role: 'surface' },
  ],
};

export interface SampleDraftPreset {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  content: string;
  bannerText: string;
  bannerFgHex: string;
  bannerBgHex: string;
}

export const SAMPLE_PRESETS: SampleDraftPreset[] = [
  {
    id: 'sample-1',
    name: 'Sample 1: Q4 Cloud Launch Post',
    tagline: '5 Deliberate Violations across Claims, Tone, WCAG & Glossary',
    badge: '5 Violations (Default)',
    content: `Attention CTOs: AcmeCloud cuts costs by 90% overnight! Our revolutionary serverless architecture promises zero downtime forever and provides 100% hack-proof infrastructure against all cyber attacks. 

Legacy AWS and Azure providers are bleeding your company dry. Buy now before price doubles this Friday! Migrate your clusters today with zero friction.`,
    bannerText: 'Save 90% On Enterprise Cloud Today! Buy Now!',
    bannerFgHex: '#94A3B8', // low contrast against dark navy (#0F4C81) -> ratio ~ 3.1:1 (< 4.5:1)
    bannerBgHex: '#0F4C81',
  },
  {
    id: 'sample-2',
    name: 'Sample 2: Enterprise Security Announcement',
    tagline: 'Superlatives, Unverified Claims & Unapproved Color Palette',
    badge: '3 Violations',
    content: `AcmeCloud is proud to announce the cheapest cloud infrastructure in the world. Our engineering team has crafted an impenetrable vault that eliminates all data loss risks without exception. 

Don't wait until ransomware destroys your business — buy now before price doubles and lock in your rate.`,
    bannerText: 'Impenetrable Security at the Cheapest Cloud Rates',
    bannerFgHex: '#FF3366', // unapproved neon pink
    bannerBgHex: '#FFDF00', // unapproved yellow, contrast is ~1.5:1
  },
  {
    id: 'sample-3',
    name: 'Sample 3: Compliant Enterprise Draft',
    tagline: '100% Compliant with Facts Ledger, Tone Guidelines & WCAG AA',
    badge: '100% Compliant',
    content: `AcmeCloud announces enhanced multi-region Kubernetes hosting for enterprise workloads. In verified Q3 benchmarks, our intelligent resource scheduling reduces server costs by up to 65% while delivering 99.95% SLA uptime.

Built on SOC2 Type II and ISO 27001 certified security architecture, our migration specialists complete standard cluster cutovers in under 48 hours. Schedule an architecture review with our enterprise engineering team.`,
    bannerText: 'Enterprise Cloud Optimization: Up to 65% Cost Reduction',
    bannerFgHex: '#F8FAFC', // light surface
    bannerBgHex: '#0F4C81', // primary navy -> contrast 8.5:1 (passes AA easily)
  },
];

