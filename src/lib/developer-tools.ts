// Developer Tools module: formatters, minifiers, validators, converters.

export const DEVELOPER_SLUGS = [
  "json-formatter",
  "json-minifier",
  "json-validator",
  "json-to-xml",
  "json-to-csv",
  "json-to-yaml",
  "xml-formatter",
  "xml-minifier",
  "xml-validator",
  "html-formatter",
  "html-minifier",
  "css-formatter",
  "css-minifier",
  "javascript-formatter",
  "javascript-minifier",
  "sql-formatter",
  "markdown-preview",
] as const;

export type DeveloperSlug = (typeof DEVELOPER_SLUGS)[number];

export function isDeveloperTool(slug: string): slug is DeveloperSlug {
  return (DEVELOPER_SLUGS as readonly string[]).includes(slug);
}

// ---------- JSON ----------

export function jsonFormat(input: string): string {
  if (!input.trim()) return "";
  try {
    return JSON.stringify(JSON.parse(input), null, 2);
  } catch (e) {
    return `⚠ Invalid JSON: ${(e as Error).message}`;
  }
}

export function jsonMinify(input: string): string {
  if (!input.trim()) return "";
  try {
    return JSON.stringify(JSON.parse(input));
  } catch (e) {
    return `⚠ Invalid JSON: ${(e as Error).message}`;
  }
}

export function jsonValidate(input: string): string {
  if (!input.trim()) return "";
  try {
    JSON.parse(input);
    return "✓ Valid JSON";
  } catch (e) {
    return `✗ Invalid JSON — ${(e as Error).message}`;
  }
}

function xmlEscape(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toXml(value: unknown, tag: string, indent: number): string {
  const pad = "  ".repeat(indent);
  if (value === null || value === undefined) return `${pad}<${tag}/>`;
  if (Array.isArray(value)) {
    return value.map((item) => toXml(item, tag, indent)).join("\n");
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (!entries.length) return `${pad}<${tag}/>`;
    const inner = entries
      .map(([k, v]) => toXml(v, sanitizeTag(k), indent + 1))
      .join("\n");
    return `${pad}<${tag}>\n${inner}\n${pad}</${tag}>`;
  }
  return `${pad}<${tag}>${xmlEscape(String(value))}</${tag}>`;
}

function sanitizeTag(name: string): string {
  const t = name.replace(/[^a-zA-Z0-9_.-]/g, "_");
  return /^[a-zA-Z_]/.test(t) ? t : `_${t}`;
}

export function jsonToXml(input: string): string {
  if (!input.trim()) return "";
  try {
    const parsed = JSON.parse(input);
    return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(parsed, "root", 0)}`;
  } catch (e) {
    return `⚠ Invalid JSON: ${(e as Error).message}`;
  }
}

export function jsonToCsv(input: string): string {
  if (!input.trim()) return "";
  try {
    const data = JSON.parse(input);
    const arr = Array.isArray(data) ? data : [data];
    if (!arr.length) return "";
    const headers = Array.from(
      arr.reduce<Set<string>>((set, row) => {
        if (row && typeof row === "object" && !Array.isArray(row)) {
          Object.keys(row).forEach((k) => set.add(k));
        }
        return set;
      }, new Set()),
    );
    if (!headers.length) {
      return arr.map((v) => csvCell(v)).join("\n");
    }
    const lines = [headers.map(csvCell).join(",")];
    for (const row of arr) {
      const obj = (row ?? {}) as Record<string, unknown>;
      lines.push(headers.map((h) => csvCell(obj[h])).join(","));
    }
    return lines.join("\n");
  } catch (e) {
    return `⚠ Invalid JSON: ${(e as Error).message}`;
  }
}

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toYaml(value: unknown, indent: number): string {
  const pad = "  ".repeat(indent);
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (typeof value === "string") {
    if (value === "" || /[:#\-?&*!|>'"%@`\n]|^\s|\s$/.test(value)) {
      return JSON.stringify(value);
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    return value
      .map((item) => {
        const rendered = toYaml(item, indent + 1);
        if (typeof item === "object" && item !== null) {
          return `${pad}-\n${rendered
            .split("\n")
            .map((l) => "  " + l)
            .join("\n")}`;
        }
        return `${pad}- ${rendered}`;
      })
      .join("\n");
  }
  const entries = Object.entries(value as Record<string, unknown>);
  if (!entries.length) return "{}";
  return entries
    .map(([k, v]) => {
      const key = /^[a-zA-Z_][\w-]*$/.test(k) ? k : JSON.stringify(k);
      if (v !== null && typeof v === "object") {
        return `${pad}${key}:\n${toYaml(v, indent + 1)}`;
      }
      return `${pad}${key}: ${toYaml(v, indent + 1)}`;
    })
    .join("\n");
}

export function jsonToYaml(input: string): string {
  if (!input.trim()) return "";
  try {
    return toYaml(JSON.parse(input), 0);
  } catch (e) {
    return `⚠ Invalid JSON: ${(e as Error).message}`;
  }
}

// ---------- XML ----------

export function xmlFormat(input: string): string {
  if (!input.trim()) return "";
  const src = input.replace(/>\s+</g, "><").trim();
  const tokens = src.match(/<[^>]+>|[^<]+/g);
  if (!tokens) return input;
  let depth = 0;
  const out: string[] = [];
  for (const raw of tokens) {
    const tok = raw.trim();
    if (!tok) continue;
    if (/^<\?/.test(tok) || /^<!/.test(tok)) {
      out.push("  ".repeat(depth) + tok);
      continue;
    }
    if (/^<\//.test(tok)) {
      depth = Math.max(0, depth - 1);
      out.push("  ".repeat(depth) + tok);
    } else if (/^<[^/][^>]*\/>$/.test(tok)) {
      out.push("  ".repeat(depth) + tok);
    } else if (/^<[^/]/.test(tok)) {
      out.push("  ".repeat(depth) + tok);
      depth++;
    } else {
      out.push("  ".repeat(depth) + tok);
    }
  }
  return out.join("\n");
}

export function xmlMinify(input: string): string {
  if (!input.trim()) return "";
  return input.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
}

export function xmlValidate(input: string): string {
  if (!input.trim()) return "";
  if (typeof DOMParser === "undefined") {
    // Fallback: rudimentary tag balance check
    const stack: string[] = [];
    const re = /<\/?([a-zA-Z_][\w.-]*)[^>]*?(\/?)>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(input))) {
      const [full, name, self] = m;
      if (full.startsWith("</")) {
        if (stack.pop() !== name) return `✗ Invalid XML — mismatched </${name}>`;
      } else if (!self) {
        stack.push(name);
      }
    }
    return stack.length ? `✗ Invalid XML — unclosed <${stack[stack.length - 1]}>` : "✓ Valid XML";
  }
  const doc = new DOMParser().parseFromString(input, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) return `✗ Invalid XML — ${err.textContent?.split("\n")[0] ?? "parse error"}`;
  return "✓ Valid XML";
}

// ---------- HTML ----------

const HTML_VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);
const HTML_INLINE = new Set([
  "a", "span", "strong", "em", "b", "i", "u", "small", "code", "kbd",
  "sub", "sup", "mark", "abbr", "cite", "q", "time", "var",
]);

export function htmlFormat(input: string): string {
  if (!input.trim()) return "";
  const src = input.replace(/>\s+</g, "><").trim();
  const tokens = src.match(/<[^>]+>|[^<]+/g);
  if (!tokens) return input;
  let depth = 0;
  const out: string[] = [];
  for (const raw of tokens) {
    const tok = raw.trim();
    if (!tok) continue;
    if (/^<!--/.test(tok) || /^<!/.test(tok) || /^<\?/.test(tok)) {
      out.push("  ".repeat(depth) + tok);
      continue;
    }
    const tagMatch = tok.match(/^<\/?([a-zA-Z][\w-]*)/);
    const name = tagMatch ? tagMatch[1].toLowerCase() : "";
    if (/^<\//.test(tok)) {
      depth = Math.max(0, depth - 1);
      out.push("  ".repeat(depth) + tok);
    } else if (/^<[^/]/.test(tok)) {
      const selfClosing = /\/>$/.test(tok) || HTML_VOID.has(name);
      out.push("  ".repeat(depth) + tok);
      if (!selfClosing && !HTML_INLINE.has(name)) depth++;
      else if (!selfClosing && HTML_INLINE.has(name)) depth++;
    } else {
      out.push("  ".repeat(depth) + tok);
    }
  }
  return out.join("\n");
}

export function htmlMinify(input: string): string {
  if (!input.trim()) return "";
  return input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ---------- CSS ----------

export function cssFormat(input: string): string {
  if (!input.trim()) return "";
  const src = input.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim();
  let out = "";
  let depth = 0;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") {
      out = out.trimEnd() + " {\n";
      depth++;
      out += "  ".repeat(depth);
    } else if (ch === "}") {
      depth = Math.max(0, depth - 1);
      out = out.trimEnd() + "\n" + "  ".repeat(depth) + "}\n";
      if (depth > 0) out += "  ".repeat(depth);
    } else if (ch === ";") {
      out += ";\n" + "  ".repeat(depth);
    } else {
      out += ch;
    }
  }
  return out.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

export function cssMinify(input: string): string {
  if (!input.trim()) return "";
  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------- JavaScript ----------

export function jsFormat(input: string): string {
  if (!input.trim()) return "";
  const src = input.replace(/\r\n?/g, "\n");
  let out = "";
  let depth = 0;
  let i = 0;
  let inString: string | null = null;
  let inLineComment = false;
  let inBlockComment = false;

  const newline = () => {
    out = out.replace(/[ \t]+$/, "") + "\n" + "  ".repeat(depth);
  };

  while (i < src.length) {
    const ch = src[i];
    const next = src[i + 1];

    if (inLineComment) {
      out += ch;
      if (ch === "\n") {
        inLineComment = false;
        out = out.replace(/\n$/, "");
        newline();
      }
      i++;
      continue;
    }
    if (inBlockComment) {
      out += ch;
      if (ch === "*" && next === "/") {
        out += "/";
        inBlockComment = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }
    if (inString) {
      out += ch;
      if (ch === "\\") {
        out += src[i + 1] ?? "";
        i += 2;
        continue;
      }
      if (ch === inString) inString = null;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      out += ch;
      i++;
      continue;
    }
    if (ch === "/" && next === "/") {
      inLineComment = true;
      out += ch;
      i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlockComment = true;
      out += ch;
      i++;
      continue;
    }
    if (ch === "{") {
      out = out.trimEnd() + " {";
      depth++;
      newline();
      i++;
      continue;
    }
    if (ch === "}") {
      depth = Math.max(0, depth - 1);
      out = out.replace(/[ \t]+$/, "").replace(/\n[ \t]*$/, "\n" + "  ".repeat(depth));
      if (!out.endsWith("\n" + "  ".repeat(depth))) {
        out = out.trimEnd() + "\n" + "  ".repeat(depth);
      }
      out += "}";
      i++;
      // avoid trailing indent right after closing when followed by newline
      continue;
    }
    if (ch === ";") {
      out += ";";
      newline();
      i++;
      continue;
    }
    if (ch === "\n") {
      i++;
      continue; // handled by ; and { }
    }
    out += ch;
    i++;
  }
  return out.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

export function jsMinify(input: string): string {
  if (!input.trim()) return "";
  let out = "";
  let i = 0;
  let inString: string | null = null;
  const src = input.replace(/\r\n?/g, "\n");
  while (i < src.length) {
    const ch = src[i];
    const next = src[i + 1];
    if (inString) {
      out += ch;
      if (ch === "\\") {
        out += src[i + 1] ?? "";
        i += 2;
        continue;
      }
      if (ch === inString) inString = null;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      out += ch;
      i++;
      continue;
    }
    if (ch === "/" && next === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    if (/\s/.test(ch)) {
      const prev = out[out.length - 1] ?? "";
      const upcoming = src[i + 1] ?? "";
      if (/[\w$]/.test(prev) && /[\w$]/.test(upcoming)) out += " ";
      i++;
      continue;
    }
    out += ch;
    i++;
  }
  return out.trim();
}

// ---------- SQL ----------

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT",
  "OFFSET", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
  "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "JOIN", "ON",
  "UNION ALL", "UNION", "AS", "AND", "OR", "NOT", "IN", "IS", "NULL",
  "CASE", "WHEN", "THEN", "ELSE", "END", "CREATE TABLE", "DROP TABLE",
  "ALTER TABLE", "WITH",
];
const SQL_BREAK = new Set([
  "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT",
  "OFFSET", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
  "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "JOIN", "UNION",
  "UNION ALL", "ON", "AND", "OR", "WITH",
]);

export function sqlFormat(input: string): string {
  if (!input.trim()) return "";
  let src = input.replace(/\s+/g, " ").trim();
  // Uppercase keywords (longest first)
  const sorted = [...SQL_KEYWORDS].sort((a, b) => b.length - a.length);
  for (const kw of sorted) {
    const re = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
    src = src.replace(re, kw);
  }
  // Insert line breaks before major keywords
  const breakList = [...SQL_BREAK].sort((a, b) => b.length - a.length);
  for (const kw of breakList) {
    const re = new RegExp(`\\s(${kw.replace(/ /g, "\\s+")})\\b`, "g");
    src = src.replace(re, `\n$1`);
  }
  // Indent secondary clauses
  return src
    .split("\n")
    .map((line, i) => {
      const trimmed = line.trim();
      if (i === 0) return trimmed;
      if (/^(AND|OR|ON)\b/.test(trimmed)) return "  " + trimmed;
      return trimmed;
    })
    .join("\n");
}

// ---------- Stats helpers ----------

export interface DevStats {
  characters: number;
  lines: number;
  words: number;
  bytes: number;
  extras: Array<{ label: string; value: number }>;
}

export function developerStats(slug: string, text: string): DevStats {
  const characters = text.length;
  const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const bytes = new TextEncoder().encode(text).length;
  const extras: Array<{ label: string; value: number }> = [];

  if (slug.startsWith("json-")) {
    try {
      const parsed = JSON.parse(text);
      let objects = 0;
      let arrays = 0;
      let keys = 0;
      const walk = (v: unknown) => {
        if (Array.isArray(v)) {
          arrays++;
          v.forEach(walk);
        } else if (v && typeof v === "object") {
          objects++;
          for (const [, val] of Object.entries(v)) {
            keys++;
            walk(val);
          }
        }
      };
      walk(parsed);
      extras.push(
        { label: "Objects", value: objects },
        { label: "Arrays", value: arrays },
        { label: "Keys", value: keys },
      );
    } catch {
      /* ignore */
    }
  } else if (slug.startsWith("xml-")) {
    const matches = text.match(/<[a-zA-Z][^!/>][^>]*?>/g);
    extras.push({ label: "Elements", value: matches ? matches.length : 0 });
  } else if (slug.startsWith("html-")) {
    const matches = text.match(/<[a-zA-Z][^!/>][^>]*?>/g);
    extras.push({ label: "Elements", value: matches ? matches.length : 0 });
  }
  return { characters, lines, words, bytes, extras };
}

// ---------- Dispatcher ----------

export function runDeveloperTool(slug: string, input: string): string {
  switch (slug) {
    case "json-formatter": return jsonFormat(input);
    case "json-minifier": return jsonMinify(input);
    case "json-validator": return jsonValidate(input);
    case "json-to-xml": return jsonToXml(input);
    case "json-to-csv": return jsonToCsv(input);
    case "json-to-yaml": return jsonToYaml(input);
    case "xml-formatter": return xmlFormat(input);
    case "xml-minifier": return xmlMinify(input);
    case "xml-validator": return xmlValidate(input);
    case "html-formatter": return htmlFormat(input);
    case "html-minifier": return htmlMinify(input);
    case "css-formatter": return cssFormat(input);
    case "css-minifier": return cssMinify(input);
    case "javascript-formatter": return jsFormat(input);
    case "javascript-minifier": return jsMinify(input);
    case "sql-formatter": return sqlFormat(input);
    default: return input;
  }
}
