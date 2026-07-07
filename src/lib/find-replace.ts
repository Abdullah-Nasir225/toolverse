// Find & Replace utilities. All operations are pure and run client-side.

export interface FindReplaceOptions {
  matchCase: boolean;
  wholeWord: boolean;
  regex: boolean;
}

export interface FindReplaceResult {
  output: string;
  matches: number;
  error?: string;
}

export const FIND_REPLACE_SLUGS = [
  "find-text",
  "find-and-replace",
  "replace-first-occurrence",
  "replace-last-occurrence",
  "replace-all",
  "remove-text",
  "highlight-matches",
  "regex-find-replace",
] as const;

export type FindReplaceSlug = (typeof FIND_REPLACE_SLUGS)[number];

export function isFindReplaceTool(slug: string): slug is FindReplaceSlug {
  return (FIND_REPLACE_SLUGS as readonly string[]).includes(slug);
}

export function needsReplaceField(slug: string): boolean {
  return (
    slug === "find-and-replace" ||
    slug === "replace-first-occurrence" ||
    slug === "replace-last-occurrence" ||
    slug === "replace-all" ||
    slug === "regex-find-replace"
  );
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildRegex(
  find: string,
  opts: FindReplaceOptions,
  forceRegex = false,
): { re: RegExp | null; error?: string } {
  if (!find) return { re: null };
  try {
    if (opts.regex || forceRegex) {
      const flags = "g" + (opts.matchCase ? "" : "i");
      return { re: new RegExp(find, flags) };
    }
    let pattern = escapeRegex(find);
    if (opts.wholeWord) pattern = `\\b${pattern}\\b`;
    const flags = "g" + (opts.matchCase ? "" : "i");
    return { re: new RegExp(pattern, flags) };
  } catch (e) {
    return { re: null, error: (e as Error).message };
  }
}

function countMatches(text: string, re: RegExp): number {
  re.lastIndex = 0;
  let n = 0;
  while (re.exec(text) !== null) {
    n++;
    // guard against zero-length matches
    if (re.lastIndex === 0) break;
  }
  return n;
}

export function runFindReplace(
  slug: string,
  text: string,
  find: string,
  replace: string,
  opts: FindReplaceOptions,
): FindReplaceResult {
  if (!text || !find) return { output: text, matches: 0 };

  const forceRegex = slug === "regex-find-replace";
  const { re, error } = buildRegex(find, opts, forceRegex);
  if (error) return { output: text, matches: 0, error };
  if (!re) return { output: text, matches: 0 };

  const matches = countMatches(text, re);

  switch (slug) {
    case "find-text":
    case "highlight-matches":
      return { output: text, matches };

    case "find-and-replace":
    case "replace-all":
    case "regex-find-replace":
      return { output: text.replace(re, replace), matches };

    case "remove-text":
      return { output: text.replace(re, ""), matches };

    case "replace-first-occurrence": {
      const single = new RegExp(re.source, re.flags.replace("g", ""));
      return { output: text.replace(single, replace), matches };
    }

    case "replace-last-occurrence": {
      re.lastIndex = 0;
      let last: RegExpExecArray | null = null;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        last = m;
        if (m.index === re.lastIndex) re.lastIndex++;
      }
      if (!last) return { output: text, matches };
      const before = text.slice(0, last.index);
      const after = text.slice(last.index + last[0].length);
      const replaced = last[0].replace(
        new RegExp(re.source, re.flags.replace("g", "")),
        replace,
      );
      return { output: before + replaced + after, matches };
    }

    default:
      return { output: text, matches };
  }
}

export function highlightHTML(
  text: string,
  find: string,
  opts: FindReplaceOptions,
): { html: string; matches: number; error?: string } {
  if (!text) return { html: "", matches: 0 };
  if (!find) return { html: escapeHTML(text), matches: 0 };
  const { re, error } = buildRegex(find, opts);
  if (error) return { html: escapeHTML(text), matches: 0, error };
  if (!re) return { html: escapeHTML(text), matches: 0 };

  let out = "";
  let last = 0;
  let matches = 0;
  re.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    matches++;
    out += escapeHTML(text.slice(last, m.index));
    out += `<mark class="rounded bg-primary/30 px-0.5 text-foreground">${escapeHTML(m[0])}</mark>`;
    last = m.index + m[0].length;
    if (m.index === re.lastIndex) re.lastIndex++;
  }
  out += escapeHTML(text.slice(last));
  return { html: out, matches };
}

function escapeHTML(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
