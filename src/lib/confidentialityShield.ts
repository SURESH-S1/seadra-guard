/**
 * Confidentiality & Local PII Redaction Shield
 * Runs 100% locally on the client BEFORE payloads leave the browser or reach LLM APIs.
 */

export interface RedactedItem {
  type: 'EMAIL' | 'PHONE' | 'API_KEY' | 'CONFIDENTIAL_PROJECT';
  original: string;
  replacement: string;
}

export interface SanitizationResult {
  sanitizedText: string;
  redactedCount: number;
  items: RedactedItem[];
}

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const PHONE_REGEX = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
const API_KEY_REGEX = /\b(?:sk-[a-zA-Z0-9]{20,}|api[_-]?key[_-]?[a-zA-Z0-9]{16,}|ghp_[a-zA-Z0-9]{20,}|Bearer\s+[a-zA-Z0-9._-]{20,})\b/gi;
const CONFIDENTIAL_PROJECTS_REGEX = /\b(?:Project\s+(?:Orion|Titan|Manhattan|Apex|Nebula|Valkyrie|Prometheus|Phoenix)|Codename\s+[A-Za-z0-9]+)\b/gi;

export function sanitizeContent(text: string, shieldActive: boolean = true): SanitizationResult {
  if (!shieldActive || !text) {
    return {
      sanitizedText: text || '',
      redactedCount: 0,
      items: [],
    };
  }

  const items: RedactedItem[] = [];
  let sanitized = text;

  // 1. Redact API Keys
  sanitized = sanitized.replace(API_KEY_REGEX, (match) => {
    items.push({ type: 'API_KEY', original: match, replacement: '[REDACTED_API_KEY]' });
    return '[REDACTED_API_KEY]';
  });

  // 2. Redact Emails
  sanitized = sanitized.replace(EMAIL_REGEX, (match) => {
    items.push({ type: 'EMAIL', original: match, replacement: '[CONFIDENTIAL_EMAIL]' });
    return '[CONFIDENTIAL_EMAIL]';
  });

  // 3. Redact Phone Numbers
  sanitized = sanitized.replace(PHONE_REGEX, (match) => {
    items.push({ type: 'PHONE', original: match, replacement: '[REDACTED_PHONE]' });
    return '[REDACTED_PHONE]';
  });

  // 4. Redact Confidential Project Names / Codenames
  sanitized = sanitized.replace(CONFIDENTIAL_PROJECTS_REGEX, (match) => {
    items.push({ type: 'CONFIDENTIAL_PROJECT', original: match, replacement: '[CONFIDENTIAL_PROJECT]' });
    return '[CONFIDENTIAL_PROJECT]';
  });

  return {
    sanitizedText: sanitized,
    redactedCount: items.length,
    items,
  };
}

