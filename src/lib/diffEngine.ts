export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
  unchanged?: boolean;
}

/**
 * Computes a word-by-word diff between original and modified text
 */
export function computeWordDiff(original: string, modified: string): DiffPart[] {
  const origWords = original.split(/(\s+)/);
  const modWords = modified.split(/(\s+)/);

  // Simple and robust LCS diff for words
  const n = origWords.length;
  const m = modWords.length;

  // Build matrix (clamped to prevent memory spikes if text is huge)
  const maxWords = 500;
  const o = origWords.slice(0, maxWords);
  const mod = modWords.slice(0, maxWords);

  const dp: number[][] = Array(o.length + 1)
    .fill(0)
    .map(() => Array(mod.length + 1).fill(0));

  for (let i = 1; i <= o.length; i++) {
    for (let j = 1; j <= mod.length; j++) {
      if (o[i - 1] === mod[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  let i = o.length;
  let j = mod.length;
  const result: DiffPart[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && o[i - 1] === mod[j - 1]) {
      result.unshift({ value: o[i - 1], unchanged: true });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ value: mod[j - 1], added: true });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({ value: o[i - 1], removed: true });
      i--;
    }
  }

  // Coalesce consecutive parts with the same status
  const coalesced: DiffPart[] = [];
  for (const part of result) {
    const last = coalesced[coalesced.length - 1];
    if (
      last &&
      last.added === part.added &&
      last.removed === part.removed &&
      last.unchanged === part.unchanged
    ) {
      last.value += part.value;
    } else {
      coalesced.push({ ...part });
    }
  }

  return coalesced;
}

