import { BrandColor } from '@/types/brandVault';

/**
 * Converts a 3 or 6 digit hex string to RGB numbers [0..255]
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

/**
 * Calculates WCAG 2.1 relative luminance of an RGB color
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B with gamma correction
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates WCAG 2.1 contrast ratio between two hex colors:
 * Ratio = (L1 + 0.05) / (L2 + 0.05) where L1 is lighter and L2 is darker
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 1.0;

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Normalizes hex to uppercase with #
 */
export function normalizeHex(hex: string): string {
  let clean = hex.trim().toUpperCase();
  if (!clean.startsWith('#')) clean = '#' + clean;
  return clean;
}

/**
 * Checks if a hex is in the approved brand palette (case-insensitive)
 */
export function isApprovedBrandColor(hex: string, palette: BrandColor[]): boolean {
  const norm = normalizeHex(hex);
  return palette.some((p) => normalizeHex(p.hex) === norm);
}

/**
 * Finds a compliant pair of colors from the approved brand palette
 */
export function findCompliantBrandPair(
  bgHex: string,
  palette: BrandColor[]
): { bg: string; fg: string; ratio: number } {
  // If bg is valid brand color, try to find an approved fg that gives >= 4.5:1
  const normBg = normalizeHex(bgHex);
  const bgMatch = palette.find((p) => normalizeHex(p.hex) === normBg) || palette[0];

  let bestFg = palette[3]?.hex || '#F8FAFC';
  let bestRatio = getContrastRatio(bgMatch.hex, bestFg);

  for (const candidate of palette) {
    const ratio = getContrastRatio(bgMatch.hex, candidate.hex);
    if (ratio >= 4.5 && ratio > bestRatio) {
      bestFg = candidate.hex;
      bestRatio = ratio;
    }
  }

  // If still under 4.5:1, pick the best known pair in palette (e.g. Navy and Surface)
  if (bestRatio < 4.5) {
    const navy = palette.find((p) => p.role === 'primary')?.hex || '#0F4C81';
    const surface = palette.find((p) => p.role === 'surface')?.hex || '#F8FAFC';
    return {
      bg: navy,
      fg: surface,
      ratio: getContrastRatio(navy, surface),
    };
  }

  return {
    bg: bgMatch.hex,
    fg: bestFg,
    ratio: bestRatio,
  };
}

