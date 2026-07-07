// Text analysis utilities for the Counting & Statistics module.
// All functions are pure and safe on very large inputs.

export interface StatItem {
  label: string;
  value: string | number;
}

function words(text: string): string[] {
  const t = text.trim();
  if (!t) return [];
  return t.split(/\s+/);
}

function normalizedWords(text: string): string[] {
  // Lowercased tokens with punctuation stripped, for density/uniqueness.
  const matches = text.toLowerCase().match(/[\p{L}\p{N}']+/gu);
  return matches ?? [];
}

export function analyzeCharacters(text: string): StatItem[] {
  let letters = 0;
  let numbers = 0;
  let spaces = 0;
  let special = 0;
  for (const ch of text) {
    if (/\s/.test(ch)) spaces++;
    else if (/\p{L}/u.test(ch)) letters++;
    else if (/\p{N}/u.test(ch)) numbers++;
    else special++;
  }
  return [
    { label: "Total characters", value: text.length },
    { label: "Without spaces", value: text.length - spaces },
    { label: "Spaces", value: spaces },
    { label: "Letters", value: letters },
    { label: "Numbers", value: numbers },
    { label: "Special", value: special },
  ];
}

export function analyzeWords(text: string): StatItem[] {
  const list = words(text);
  const total = list.length;
  const normalized = normalizedWords(text);
  const unique = new Set(normalized).size;
  let longest = "";
  let shortest = "";
  let totalLen = 0;
  for (const w of list) {
    totalLen += w.length;
    if (w.length > longest.length) longest = w;
    if (!shortest || w.length < shortest.length) shortest = w;
  }
  const avg = total ? totalLen / total : 0;
  return [
    { label: "Total words", value: total },
    { label: "Unique words", value: unique },
    { label: "Avg length", value: avg ? avg.toFixed(2) : 0 },
    { label: "Longest", value: longest || "—" },
    { label: "Shortest", value: shortest || "—" },
  ];
}

export function analyzeLines(text: string): StatItem[] {
  if (!text) return [
    { label: "Total lines", value: 0 },
    { label: "Non-empty", value: 0 },
    { label: "Empty", value: 0 },
  ];
  const lines = text.split(/\r?\n/);
  const nonEmpty = lines.filter((l) => l.trim().length > 0).length;
  return [
    { label: "Total lines", value: lines.length },
    { label: "Non-empty", value: nonEmpty },
    { label: "Empty", value: lines.length - nonEmpty },
  ];
}

export function analyzeParagraphs(text: string): StatItem[] {
  const paragraphs = text
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return [{ label: "Total paragraphs", value: paragraphs.length }];
}

export function analyzeSentences(text: string): StatItem[] {
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const total = sentences.length;
  const totalWords = sentences.reduce((sum, s) => sum + words(s).length, 0);
  const avg = total ? totalWords / total : 0;
  return [
    { label: "Total sentences", value: total },
    { label: "Avg length (words)", value: avg ? avg.toFixed(2) : 0 },
  ];
}

function formatTime(minutes: number, seconds: number): string {
  return `${minutes} min ${seconds} sec`;
}

export function analyzeReadingTime(text: string): StatItem[] {
  const count = words(text).length;
  const totalSeconds = Math.round((count / 200) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return [
    { label: "Words", value: count },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
    { label: "Reading time", value: formatTime(minutes, seconds) },
  ];
}

export function analyzeSpeakingTime(text: string): StatItem[] {
  const count = words(text).length;
  const totalSeconds = Math.round((count / 130) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return [
    { label: "Words", value: count },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
    { label: "Speaking time", value: formatTime(minutes, seconds) },
  ];
}

export interface KeywordRow {
  word: string;
  count: number;
  percent: number;
}

export function analyzeKeywordDensity(text: string): KeywordRow[] {
  const tokens = normalizedWords(text);
  const total = tokens.length;
  if (!total) return [];
  const map = new Map<string, number>();
  for (const t of tokens) map.set(t, (map.get(t) ?? 0) + 1);
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10)
    .map(([word, count]) => ({ word, count, percent: (count / total) * 100 }));
}

export function isAnalysisTool(slug: string): boolean {
  return [
    "character-count",
    "word-count",
    "line-count",
    "paragraph-count",
    "sentence-count",
    "reading-time",
    "speaking-time",
    "keyword-density",
  ].includes(slug);
}
