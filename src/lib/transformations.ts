// Text transformation utilities for the Core Text Transformations module.

function splitWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

const cap = (w: string) => (w ? w[0].toUpperCase() + w.slice(1) : w);

export const transformations = {
  uppercase: (t: string) => t.toUpperCase(),

  lowercase: (t: string) => t.toLowerCase(),

  "title-case": (t: string) =>
    t.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),

  "sentence-case": (t: string) => {
    const lower = t.toLowerCase();
    return lower.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p, c) => p + c.toUpperCase());
  },

  "toggle-case": (t: string) =>
    t
      .split("")
      .map((c) =>
        c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase(),
      )
      .join(""),

  "invert-case": (t: string) => {
    let i = 0;
    return t
      .split("")
      .map((c) => {
        if (!/[a-zA-Z]/.test(c)) return c;
        const out = i % 2 === 0 ? c.toLowerCase() : c.toUpperCase();
        i++;
        return out;
      })
      .join("");
  },

  "camel-case": (t: string) => {
    const w = splitWords(t);
    if (!w.length) return "";
    return w[0] + w.slice(1).map(cap).join("");
  },

  "pascal-case": (t: string) => splitWords(t).map(cap).join(""),

  "snake-case": (t: string) => splitWords(t).join("_"),

  "kebab-case": (t: string) => splitWords(t).join("-"),

  "dot-case": (t: string) => splitWords(t).join("."),

  "constant-case": (t: string) => splitWords(t).join("_").toUpperCase(),

  // ===== Text Cleaning =====

  "remove-extra-spaces": (t: string) =>
    t
      .split(/\r?\n/)
      .map((line) => line.replace(/ {2,}/g, " "))
      .join("\n"),

  "remove-duplicate-lines": (t: string) => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const line of t.split(/\r?\n/)) {
      if (!seen.has(line)) {
        seen.add(line);
        out.push(line);
      }
    }
    return out.join("\n");
  },

  "remove-empty-lines": (t: string) =>
    t.split(/\r?\n/).filter((line) => line.trim().length > 0).join("\n"),

  "remove-blank-paragraphs": (t: string) =>
    t.replace(/(?:[ \t]*\r?\n){3,}/g, "\n\n"),

  "remove-tabs": (t: string) => t.replace(/\t/g, " "),

  "trim-spaces": (t: string) =>
    t
      .split(/\r?\n/)
      .map((line) => line.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""))
      .join("\n"),

  "normalize-whitespace": (t: string) =>
    t
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((line) => line.replace(/[\t\f\v\u00A0\u2028\u2029\s]+/g, " ").trim())
      .join("\n"),

  "remove-multiple-line-breaks": (t: string) =>
    t.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n"),

  // ===== Sorting =====

  "sort-lines": (t: string) => {
    const lines = t.replace(/\r\n?/g, "\n").split("\n");
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    return lines.slice().sort((a, b) => a.localeCompare(b)).join("\n");
  },

  "sort-lines-desc": (t: string) => {
    const lines = t.replace(/\r\n?/g, "\n").split("\n");
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    return lines.slice().sort((a, b) => b.localeCompare(a)).join("\n");
  },

  "sort-numbers-asc": (t: string) =>
    t
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .filter((l) => l.trim() !== "")
      .map((l) => ({ l, n: parseFloat(l) }))
      .sort((a, b) => a.n - b.n)
      .map((x) => x.l)
      .join("\n"),

  "sort-numbers-desc": (t: string) =>
    t
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .filter((l) => l.trim() !== "")
      .map((l) => ({ l, n: parseFloat(l) }))
      .sort((a, b) => b.n - a.n)
      .map((x) => x.l)
      .join("\n"),

  "randomize-lines": (t: string) => {
    const lines = t.replace(/\r\n?/g, "\n").split("\n");
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    const arr = lines.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("\n");
  },

  "reverse-line-order": (t: string) => {
    const lines = t.replace(/\r\n?/g, "\n").split("\n");
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    return lines.slice().reverse().join("\n");
  },

  "reverse-characters": (t: string) => Array.from(t).reverse().join(""),

  "reverse-words": (t: string) =>
    t
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((line) => {
        const tokens = line.split(/(\s+)/);
        const words: string[] = [];
        const wordIdx: number[] = [];
        tokens.forEach((tok, i) => {
          if (!/^\s+$/.test(tok) && tok !== "") {
            words.push(tok);
            wordIdx.push(i);
          }
        });
        const reversed = words.slice().reverse();
        wordIdx.forEach((i, k) => {
          tokens[i] = reversed[k];
        });
        return tokens.join("");
      })
      .join("\n"),

  "natural-sort": (t: string) => {
    const lines = t.replace(/\r\n?/g, "\n").split("\n");
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    return lines.slice().sort(collator.compare).join("\n");
  },

  "case-insensitive-sort": (t: string) => {
    const lines = t.replace(/\r\n?/g, "\n").split("\n");
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    return lines
      .slice()
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
      .join("\n");
  },

  // ===== Encoding =====

  "base64-encode": (t: string) => {
    if (!t) return "";
    try {
      return btoa(String.fromCharCode(...new TextEncoder().encode(t)));
    } catch {
      return "⚠ Unable to encode input.";
    }
  },

  "base64-decode": (t: string) => {
    if (!t) return "";
    try {
      const bin = atob(t.replace(/\s+/g, ""));
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch {
      return "⚠ Invalid Base64 input.";
    }
  },

  "url-encode": (t: string) => {
    try {
      return encodeURIComponent(t);
    } catch {
      return "⚠ Unable to URL-encode input.";
    }
  },

  "url-decode": (t: string) => {
    try {
      return decodeURIComponent(t);
    } catch {
      return "⚠ Invalid URL-encoded input.";
    }
  },

  "html-encode": (t: string) =>
    t
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;"),

  "html-decode": (t: string) => {
    const named: Record<string, string> = {
      amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00A0",
    };
    return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, ent: string) => {
      if (ent[0] === "#") {
        const code = ent[1] === "x" || ent[1] === "X"
          ? parseInt(ent.slice(2), 16)
          : parseInt(ent.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : m;
      }
      return named[ent] ?? m;
    });
  },

  "unicode-encode": (t: string) =>
    Array.from(t)
      .map((ch) => {
        const cp = ch.codePointAt(0)!;
        if (cp <= 0xffff) return "\\u" + cp.toString(16).padStart(4, "0").toUpperCase();
        // encode as surrogate pair
        const s = ch;
        return Array.from(s.split(""))
          .map((c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0").toUpperCase())
          .join("");
      })
      .join(""),

  "unicode-decode": (t: string) => {
    try {
      return t
        .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    } catch {
      return "⚠ Invalid Unicode escape sequence.";
    }
  },

  "binary-encode": (t: string) => {
    if (!t) return "";
    const bytes = new TextEncoder().encode(t);
    const out: string[] = [];
    for (const b of bytes) out.push(b.toString(2).padStart(8, "0"));
    return out.join(" ");
  },

  "binary-decode": (t: string) => {
    if (!t.trim()) return "";
    const tokens = t.trim().split(/\s+/);
    if (!tokens.every((tok) => /^[01]+$/.test(tok))) {
      return "⚠ Invalid binary input.";
    }
    try {
      const bytes = new Uint8Array(tokens.length);
      for (let i = 0; i < tokens.length; i++) {
        const n = parseInt(tokens[i], 2);
        if (n > 255) return "⚠ Invalid binary input.";
        bytes[i] = n;
      }
      return new TextDecoder().decode(bytes);
    } catch {
      return "⚠ Invalid binary input.";
    }
  },

  "hex-encode": (t: string) => {
    if (!t) return "";
    const bytes = new TextEncoder().encode(t);
    const out: string[] = [];
    for (const b of bytes) out.push(b.toString(16).padStart(2, "0").toUpperCase());
    return out.join(" ");
  },

  "hex-decode": (t: string) => {
    if (!t.trim()) return "";
    const cleaned = t.replace(/\s+/g, "");
    if (!/^[0-9a-fA-F]+$/.test(cleaned) || cleaned.length % 2 !== 0) {
      return "⚠ Invalid hexadecimal input.";
    }
    try {
      const bytes = new Uint8Array(cleaned.length / 2);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(cleaned.substr(i * 2, 2), 16);
      }
      return new TextDecoder().decode(bytes);
    } catch {
      return "⚠ Invalid hexadecimal input.";
    }
  },
} as const;


export type TransformSlug = keyof typeof transformations;

export function transform(slug: string, text: string): string {
  const fn = (transformations as Record<string, (t: string) => string>)[slug];
  return fn ? fn(text) : text;
}

export function hasTransform(slug: string): boolean {
  return slug in transformations;
}
