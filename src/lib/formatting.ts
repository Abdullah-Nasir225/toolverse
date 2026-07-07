// Formatting module — reformats text without changing meaning.

export type IndentUnit = "2sp" | "4sp" | "tab";
export type BulletStyle = "•" | "-" | "*" | "→";

export interface FormattingOptions {
  prefix: string;
  suffix: string;
  width: number;
  indent: IndentUnit;
  bullet: BulletStyle;
}

export const FORMATTING_SLUGS = [
  "add-line-numbers",
  "remove-line-numbers",
  "indent-text",
  "outdent-text",
  "align-left",
  "align-center",
  "align-right",
  "justify-text",
  "wrap-text",
  "unwrap-text",
  "add-prefix",
  "add-suffix",
  "remove-prefix",
  "remove-suffix",
  "add-bullet-points",
  "remove-bullet-points",
] as const;

export type FormattingSlug = (typeof FORMATTING_SLUGS)[number];

export function isFormattingTool(slug: string): slug is FormattingSlug {
  return (FORMATTING_SLUGS as readonly string[]).includes(slug);
}

const splitLines = (t: string) => t.replace(/\r\n?/g, "\n").split("\n");
const indentString = (u: IndentUnit) => (u === "tab" ? "\t" : u === "2sp" ? "  " : "    ");

function wrapLine(line: string, width: number): string[] {
  if (width <= 0 || line.length <= width) return [line];
  const out: string[] = [];
  let rest = line;
  while (rest.length > width) {
    let cut = rest.lastIndexOf(" ", width);
    if (cut <= 0) cut = width; // hard break for long token
    out.push(rest.slice(0, cut).replace(/\s+$/, ""));
    rest = rest.slice(cut).replace(/^\s+/, "");
  }
  if (rest.length) out.push(rest);
  return out;
}

function justifyLine(words: string[], width: number): string {
  if (words.length === 1) return words[0];
  const totalChars = words.reduce((s, w) => s + w.length, 0);
  const gaps = words.length - 1;
  const totalSpaces = Math.max(gaps, width - totalChars);
  const base = Math.floor(totalSpaces / gaps);
  let extra = totalSpaces - base * gaps;
  let out = "";
  for (let i = 0; i < words.length; i++) {
    out += words[i];
    if (i < gaps) {
      out += " ".repeat(base + (extra > 0 ? 1 : 0));
      if (extra > 0) extra--;
    }
  }
  return out;
}

function justifyParagraph(paragraph: string, width: number): string {
  const words = paragraph.split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const lines: string[][] = [];
  let cur: string[] = [];
  let curLen = 0;
  for (const w of words) {
    const add = curLen === 0 ? w.length : curLen + 1 + w.length;
    if (add > width && cur.length) {
      lines.push(cur);
      cur = [w];
      curLen = w.length;
    } else {
      cur.push(w);
      curLen = add;
    }
  }
  if (cur.length) lines.push(cur);
  return lines
    .map((ws, i) => (i === lines.length - 1 ? ws.join(" ") : justifyLine(ws, width)))
    .join("\n");
}

const BULLET_RE = /^(\s*)([•\-*+→✓·▪●○])\s+/;
const NUM_PREFIX_RE = /^(\s*)(\d{1,4})[.)\-]\s+/;

export function runFormatting(
  slug: string,
  input: string,
  opts: FormattingOptions,
): string {
  if (input === "") return "";
  const lines = splitLines(input);

  switch (slug) {
    case "add-line-numbers": {
      const w = String(lines.length).length;
      return lines
        .map((l, i) => `${String(i + 1).padStart(w, " ")}. ${l}`)
        .join("\n");
    }

    case "remove-line-numbers":
      return lines.map((l) => l.replace(NUM_PREFIX_RE, "$1")).join("\n");

    case "indent-text": {
      const pad = indentString(opts.indent);
      return lines.map((l) => pad + l).join("\n");
    }

    case "outdent-text":
      return lines
        .map((l) => {
          if (l.startsWith("\t")) return l.slice(1);
          const m = l.match(/^ {1,4}/);
          return m ? l.slice(m[0].length) : l;
        })
        .join("\n");

    case "align-left":
      return lines.map((l) => l.replace(/^\s+/, "")).join("\n");

    case "align-center": {
      const w = Math.max(1, opts.width || 80);
      return lines
        .map((l) => {
          const s = l.trim();
          if (s.length >= w) return s;
          const pad = Math.floor((w - s.length) / 2);
          return " ".repeat(pad) + s;
        })
        .join("\n");
    }

    case "align-right": {
      const w = Math.max(1, opts.width || 80);
      return lines
        .map((l) => {
          const s = l.trim();
          if (s.length >= w) return s;
          return " ".repeat(w - s.length) + s;
        })
        .join("\n");
    }

    case "justify-text": {
      const w = Math.max(1, opts.width || 80);
      const paragraphs = input.replace(/\r\n?/g, "\n").split(/\n{2,}/);
      return paragraphs.map((p) => justifyParagraph(p, w)).join("\n\n");
    }

    case "wrap-text": {
      const w = Math.max(1, opts.width || 80);
      return lines.flatMap((l) => wrapLine(l, w)).join("\n");
    }

    case "unwrap-text": {
      const paragraphs = input.replace(/\r\n?/g, "\n").split(/\n{2,}/);
      return paragraphs
        .map((p) => p.split("\n").map((l) => l.trim()).filter(Boolean).join(" "))
        .join("\n\n");
    }

    case "add-prefix":
      return lines.map((l) => opts.prefix + l).join("\n");

    case "add-suffix":
      return lines.map((l) => l + opts.suffix).join("\n");

    case "remove-prefix":
      if (!opts.prefix) return input;
      return lines
        .map((l) => (l.startsWith(opts.prefix) ? l.slice(opts.prefix.length) : l))
        .join("\n");

    case "remove-suffix":
      if (!opts.suffix) return input;
      return lines
        .map((l) => (l.endsWith(opts.suffix) ? l.slice(0, l.length - opts.suffix.length) : l))
        .join("\n");

    case "add-bullet-points":
      return lines
        .map((l) => (l.trim() === "" ? l : `${opts.bullet} ${l.replace(/^\s+/, "")}`))
        .join("\n");

    case "remove-bullet-points":
      return lines.map((l) => l.replace(BULLET_RE, "$1")).join("\n");

    default:
      return input;
  }
}

export interface OptionFlags {
  prefix: boolean;
  suffix: boolean;
  width: boolean;
  indent: boolean;
  bullet: boolean;
}

export function optionFlags(slug: string): OptionFlags {
  return {
    prefix: slug === "add-prefix" || slug === "remove-prefix",
    suffix: slug === "add-suffix" || slug === "remove-suffix",
    width:
      slug === "align-center" ||
      slug === "align-right" ||
      slug === "justify-text" ||
      slug === "wrap-text",
    indent: slug === "indent-text",
    bullet: slug === "add-bullet-points",
  };
}
