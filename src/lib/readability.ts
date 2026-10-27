/**
 * Counts syllables in a word using English phonetic rules
 */
export function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  if (clean.length <= 3) return 1;

  const stripped = clean.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  const syllables = stripped.match(/[aeiouy]{1,2}/g);
  return syllables ? Math.max(1, syllables.length) : 1;
}

/**
 * Computes Flesch-Kincaid readability metrics:
 * Reading Ease: 206.835 - 1.015 * (total_words / total_sentences) - 84.6 * (total_syllables / total_words)
 * Grade Level: 0.39 * (total_words / total_sentences) + 11.8 * (total_syllables / total_words) - 15.59
 */
export function analyzeReadability(text: string): {
  readingEase: number;
  gradeLevel: number;
  gradeLevelDescription: string;
  wordCount: number;
  sentenceCount: number;
  denseSentences: { sentence: string; wordCount: number }[];
} {
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const words = text
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);

  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);

  let syllableCount = 0;
  for (const w of words) {
    syllableCount += countSyllables(w);
  }

  const wordsPerSentence = wordCount / sentenceCount;
  const syllablesPerWord = wordCount > 0 ? syllableCount / wordCount : 0;

  let readingEase = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  readingEase = Math.max(0, Math.min(100, Math.round(readingEase * 10) / 10));

  let gradeLevel = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
  gradeLevel = Math.max(1, Math.min(20, Math.round(gradeLevel * 10) / 10));

  let gradeLevelDescription = 'Executive Ready';
  if (readingEase >= 70) gradeLevelDescription = 'Clear & Conversational';
  else if (readingEase >= 50) gradeLevelDescription = 'Executive / Enterprise Grade';
  else if (readingEase >= 30) gradeLevelDescription = 'Dense / Academic';
  else gradeLevelDescription = 'Extremely Difficult';

  // Find sentences longer than 28 words (dense run-on)
  const denseSentences = sentences
    .map((sentence) => {
      const count = sentence.split(/\s+/).filter(Boolean).length;
      return { sentence, wordCount: count };
    })
    .filter((s) => s.wordCount >= 28);

  return {
    readingEase,
    gradeLevel,
    gradeLevelDescription,
    wordCount,
    sentenceCount,
    denseSentences,
  };
}

