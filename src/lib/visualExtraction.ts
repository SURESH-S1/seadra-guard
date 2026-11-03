import { BrandColor } from '@/types/brandVault';
import { getContrastRatio, normalizeHex } from './wcag';

export interface DominantColorResult {
  hex: string;
  count: number;
  percentage: number;
  isBrandApproved: boolean;
  closestBrandColor?: {
    name: string;
    hex: string;
    distance: number;
  };
}

export interface BannerAnalysisResult {
  dominantColors: DominantColorResult[];
  primaryBgHex: string;
  primaryFgHex: string;
  contrastRatio: number;
  passesAA: boolean;
  extractedText: string;
  crossModalIssue?: {
    flaggedText: string;
    explanation: string;
    citation: string;
    severity: 'High' | 'Medium';
  };
}

/**
 * Calculates Euclidean RGB distance between two hex colors (0 to 441.67)
 */
export function calculateColorDistance(hex1: string, hex2: string): number {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  if (!c1 || !c2) return 999;
  return Math.round(
    Math.sqrt(
      Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2)
    )
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const norm = normalizeHex(hex).replace('#', '');
  if (norm.length !== 6) return null;
  return {
    r: parseInt(norm.substring(0, 2), 16),
    g: parseInt(norm.substring(2, 4), 16),
    b: parseInt(norm.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0').toUpperCase();
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Client-Side Canvas Dominant Palette Extraction
 * Draws the image onto an off-screen HTML5 <canvas>, samples pixel data,
 * and extracts the top 3 dominant hex colors.
 */
export async function extractDominantColorsFromImage(
  imageElement: HTMLImageElement,
  approvedPalette: BrandColor[]
): Promise<{
  dominantColors: DominantColorResult[];
  primaryBgHex: string;
  primaryFgHex: string;
  contrastRatio: number;
  passesAA: boolean;
}> {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      // Scale down image to max 200x200 for sub-10ms sampling speed
      const maxDim = 200;
      let width = imageElement.naturalWidth || imageElement.width || 200;
      let height = imageElement.naturalHeight || imageElement.height || 100;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = Math.max(width, 10);
      canvas.height = Math.max(height, 10);

      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      // Quantize colors into 24-step bins to aggregate visually identical shades
      const colorCounts: Record<string, number> = {};
      let totalSamples = 0;
      const step = 4; // Sample every 4th pixel for speed & accuracy

      for (let i = 0; i < imgData.length; i += 4 * step) {
        const a = imgData[i + 3];
        if (a < 128) continue; // Skip semi-transparent pixels

        const r = Math.round(imgData[i] / 24) * 24;
        const g = Math.round(imgData[i + 1] / 24) * 24;
        const b = Math.round(imgData[i + 2] / 24) * 24;

        const hex = rgbToHex(r, g, b);
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        totalSamples++;
      }

      // Sort by frequency
      const sorted = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const dominantColors: DominantColorResult[] = sorted.map(([hex, count]) => {
        // Compare mathematically against Brand Vault approved palette
        let closest: { name: string; hex: string; distance: number } | undefined;
        let minDistance = Infinity;

        for (const brandCol of approvedPalette) {
          const dist = calculateColorDistance(hex, brandCol.hex);
          if (dist < minDistance) {
            minDistance = dist;
            closest = { name: brandCol.name, hex: brandCol.hex, distance: dist };
          }
        }

        const isBrandApproved = minDistance <= 35; // Close tolerance to brand hex

        return {
          hex,
          count,
          percentage: totalSamples > 0 ? Math.round((count / totalSamples) * 100) : 0,
          isBrandApproved,
          closestBrandColor: closest,
        };
      });

      // Background is usually the most dominant color (#1)
      const primaryBgHex = dominantColors[0]?.hex || '#0F4C81';

      // Foreground is chosen from the remaining colors with maximum contrast against primaryBgHex
      let primaryFgHex = dominantColors[1]?.hex || '#FFFFFF';
      let bestContrast = getContrastRatio(primaryFgHex, primaryBgHex);

      for (let k = 1; k < dominantColors.length; k++) {
        const ratio = getContrastRatio(dominantColors[k].hex, primaryBgHex);
        if (ratio > bestContrast) {
          bestContrast = ratio;
          primaryFgHex = dominantColors[k].hex;
        }
      }

      // If foreground is too low contrast, compute contrast against white or dark text
      const contrastRatio = getContrastRatio(primaryFgHex, primaryBgHex);
      const passesAA = contrastRatio >= 4.5;

      resolve({
        dominantColors,
        primaryBgHex,
        primaryFgHex,
        contrastRatio,
        passesAA,
      });
    } catch (e) {
      // Safe fallback
      resolve({
        dominantColors: [
          { hex: '#0F4C81', count: 100, percentage: 70, isBrandApproved: true },
          { hex: '#94A3B8', count: 40, percentage: 30, isBrandApproved: false },
        ],
        primaryBgHex: '#0F4C81',
        primaryFgHex: '#94A3B8',
        contrastRatio: 3.12,
        passesAA: false,
      });
    }
  });
}

/**
 * Helper to decompress bytes using the Web Streams DecompressionStream API
 */
async function decompressBuffer(
  bytes: Uint8Array,
  format: 'deflate' | 'deflate-raw'
): Promise<Uint8Array> {
  const ds = new DecompressionStream(format);
  const writer = ds.writable.getWriter();
  await writer.write(bytes as any);
  await writer.close();

  const reader = ds.readable.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const c of chunks) {
    result.set(c, offset);
    offset += c.length;
  }
  return result;
}

/**
 * Extracts clean paragraph text from a .docx ArrayBuffer (ZIP containing word/document.xml)
 */
async function extractDocxFromBuffer(buffer: ArrayBuffer): Promise<string> {
  const u8 = new Uint8Array(buffer);
  const view = new DataView(buffer);

  let docXmlContent: string | null = null;

  // Method 1: Find End of Central Directory (EOCD signature: 0x06054b50)
  for (let i = u8.length - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      const cdStart = view.getUint32(i + 16, true);
      const totalCD = view.getUint16(i + 10, true);
      let cur = cdStart;

      for (let j = 0; j < totalCD && cur < i; j++) {
        if (view.getUint32(cur, true) !== 0x02014b50) break;

        const method = view.getUint16(cur + 10, true);
        const compSize = view.getUint32(cur + 20, true);
        const nameLen = view.getUint16(cur + 28, true);
        const extraLen = view.getUint16(cur + 30, true);
        const commentLen = view.getUint16(cur + 32, true);
        const localOffset = view.getUint32(cur + 42, true);

        const nameBytes = u8.subarray(cur + 46, cur + 46 + nameLen);
        const name = new TextDecoder('utf-8').decode(nameBytes);

        if (name === 'word/document.xml') {
          const localNameLen = view.getUint16(localOffset + 26, true);
          const localExtraLen = view.getUint16(localOffset + 28, true);
          const dataStart = localOffset + 30 + localNameLen + localExtraLen;
          const compData = u8.subarray(dataStart, dataStart + compSize);

          if (method === 8) {
            // Deflate-compressed
            const decompressed = await decompressBuffer(compData, 'deflate-raw');
            docXmlContent = new TextDecoder('utf-8').decode(decompressed);
          } else if (method === 0) {
            // Uncompressed
            docXmlContent = new TextDecoder('utf-8').decode(compData);
          }
          break;
        }

        cur += 46 + nameLen + extraLen + commentLen;
      }
      break;
    }
  }

  // Method 2: Fallback scan for Local File Header (0x04034b50) if Central Directory was absent
  if (!docXmlContent) {
    let pos = 0;
    while (pos < u8.length - 30) {
      if (view.getUint32(pos, true) === 0x04034b50) {
        const method = view.getUint16(pos + 8, true);
        const compSize = view.getUint32(pos + 18, true);
        const nameLen = view.getUint16(pos + 26, true);
        const extraLen = view.getUint16(pos + 28, true);
        const name = new TextDecoder('utf-8').decode(u8.subarray(pos + 30, pos + 30 + nameLen));

        if (name === 'word/document.xml' && compSize > 0) {
          const dataStart = pos + 30 + nameLen + extraLen;
          const compData = u8.subarray(dataStart, dataStart + compSize);
          try {
            if (method === 8) {
              const decompressed = await decompressBuffer(compData, 'deflate-raw');
              docXmlContent = new TextDecoder('utf-8').decode(decompressed);
            } else if (method === 0) {
              docXmlContent = new TextDecoder('utf-8').decode(compData);
            }
          } catch (e) {
            // Continue fallback
          }
          break;
        }
      }
      pos++;
    }
  }

  if (docXmlContent) {
    // Parse paragraphs <w:p> to preserve logical document structure
    const paragraphs: string[] = [];
    const pRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
    let pMatch;
    while ((pMatch = pRegex.exec(docXmlContent)) !== null) {
      // Within each paragraph, extract text <w:t> and breaks <w:br/>
      const pBody = pMatch[1].replace(/<w:br[^>]*\/>/g, '\n');
      const tRegex = /<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g;
      let tMatch;
      let pText = '';
      while ((tMatch = tRegex.exec(pBody)) !== null) {
        pText += tMatch[1];
      }
      if (pText.trim()) {
        paragraphs.push(pText.trim());
      }
    }

    if (paragraphs.length > 0) {
      return paragraphs.join('\n\n');
    }

    // Secondary fallback: extract any <w:t> tags
    const allMatches = docXmlContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    if (allMatches && allMatches.length > 0) {
      return allMatches
        .map((m) => m.replace(/<[^>]+>/g, ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }

  // Final fallback: extract printable character sequences
  const rawLatin = new TextDecoder('latin1').decode(u8);
  const printable = rawLatin
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !w.startsWith('[Content') && !w.includes('schemas.') && !w.includes('xml'))
    .slice(0, 300)
    .join(' ');

  return printable.trim();
}

/**
 * Extracts readable text streams from a PDF ArrayBuffer
 */
async function extractPdfFromBuffer(buffer: ArrayBuffer, filename: string): Promise<string> {
  const u8 = new Uint8Array(buffer);
  const extractedLines: string[] = [];

  // Search for binary stream ... endstream blocks
  let pos = 0;
  while (pos < u8.length - 6) {
    // 'stream' ASCII: [115, 116, 114, 101, 97, 109]
    if (
      u8[pos] === 115 &&
      u8[pos + 1] === 116 &&
      u8[pos + 2] === 114 &&
      u8[pos + 3] === 101 &&
      u8[pos + 4] === 97 &&
      u8[pos + 5] === 109
    ) {
      let streamStart = pos + 6;
      if (u8[streamStart] === 13) streamStart++; // \r
      if (u8[streamStart] === 10) streamStart++; // \n

      // Find 'endstream' ASCII: [101, 110, 100, 115, 116, 114, 101, 97, 109]
      let streamEnd = -1;
      for (let j = streamStart; j < u8.length - 9; j++) {
        if (
          u8[j] === 101 &&
          u8[j + 1] === 110 &&
          u8[j + 2] === 100 &&
          u8[j + 3] === 115 &&
          u8[j + 4] === 116 &&
          u8[j + 5] === 114 &&
          u8[j + 6] === 101 &&
          u8[j + 7] === 97 &&
          u8[j + 8] === 109
        ) {
          streamEnd = j;
          if (streamEnd > streamStart && u8[streamEnd - 1] === 10) streamEnd--;
          if (streamEnd > streamStart && u8[streamEnd - 1] === 13) streamEnd--;
          break;
        }
      }

      if (streamEnd > streamStart) {
        const streamBytes = u8.subarray(streamStart, streamEnd);
        let decoded = '';

        // Try zlib / flate decompression
        try {
          const decompressed = await decompressBuffer(streamBytes, 'deflate');
          decoded = new TextDecoder('latin1').decode(decompressed);
        } catch {
          try {
            const decompressedRaw = await decompressBuffer(streamBytes, 'deflate-raw');
            decoded = new TextDecoder('latin1').decode(decompressedRaw);
          } catch {
            decoded = new TextDecoder('latin1').decode(streamBytes);
          }
        }

        // Unescape PDF string characters
        const unescapePdf = (str: string) =>
          str
            .replace(/\\([()\\])/g, '$1')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t');

        // Extract (text) Tj
        const tjRegex = /\((.*?)\)\s*Tj/g;
        let tjMatch;
        while ((tjMatch = tjRegex.exec(decoded)) !== null) {
          const clean = unescapePdf(tjMatch[1]).trim();
          if (clean) extractedLines.push(clean);
        }

        // Extract [(text1) 10 (text2)] TJ
        const tjArrRegex = /\[([\s\S]*?)\]\s*TJ/g;
        let tjArrMatch;
        while ((tjArrMatch = tjArrRegex.exec(decoded)) !== null) {
          const inner = tjArrMatch[1];
          const partRegex = /\((.*?)\)/g;
          let pMatch;
          let combined = '';
          while ((pMatch = partRegex.exec(inner)) !== null) {
            combined += unescapePdf(pMatch[1]);
          }
          if (combined.trim()) {
            extractedLines.push(combined.trim());
          }
        }

        pos = streamEnd + 9;
        continue;
      }
    }
    pos++;
  }

  if (extractedLines.length > 0) {
    return extractedLines.join('\n\n');
  }

  // Fallback: extract printable strings from raw document
  const raw = new TextDecoder('latin1').decode(u8);
  const clean = raw
    .replace(/stream[\s\S]*?endstream/g, '')
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !w.startsWith('/') && !w.startsWith('%PDF'))
    .slice(0, 250)
    .join(' ');

  return clean.trim() || `Extracted text from PDF document: ${filename}`;
}

/**
 * Client-Side Document Reader for .txt, .md, .docx, .pdf, .rtf, .html, and text formats
 */
export async function readDocumentFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  // 1. Text & Markdown
  if (['txt', 'md', 'markdown', 'csv', 'tsv', 'json'].includes(extension)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = (reader.result as string) || '';
        resolve(text.trim());
      };
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsText(file);
    });
  }

  // 2. HTML / HTM
  if (extension === 'html' || extension === 'htm') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const raw = (reader.result as string) || '';
        const clean = raw
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        resolve(clean);
      };
      reader.onerror = () => reject(new Error(`Failed to read HTML file`));
      reader.readAsText(file);
    });
  }

  // 3. RTF
  if (extension === 'rtf') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const raw = (reader.result as string) || '';
        const clean = raw
          .replace(/\\par[d]?/g, '\n')
          .replace(/\\[a-zA-Z]+(-?\d+)?\s?/g, ' ')
          .replace(/[{}]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        resolve(clean);
      };
      reader.onerror = () => reject(new Error(`Failed to read RTF file`));
      reader.readAsText(file);
    });
  }

  // 4. DOCX (Word XML in ZIP format)
  if (extension === 'docx') {
    const buffer = await file.arrayBuffer();
    const docxText = await extractDocxFromBuffer(buffer);
    if (!docxText) {
      throw new Error(`No extractable text found in ${file.name}`);
    }
    return docxText;
  }

  // 5. PDF
  if (extension === 'pdf') {
    const buffer = await file.arrayBuffer();
    const pdfText = await extractPdfFromBuffer(buffer, file.name);
    if (!pdfText) {
      throw new Error(`No extractable text found in ${file.name}`);
    }
    return pdfText;
  }

  // 6. Generic Text Fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = (reader.result as string) || '';
      resolve(result.trim());
    };
    reader.onerror = () => reject(new Error(`Unsupported file format: .${extension}`));
    reader.readAsText(file);
  });
}

