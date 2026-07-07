import {
  Type,
  Sparkles,
  Hash,
  ArrowUpDown,
  Search,
  Lock,
  AlignLeft,
  Code2,
  type LucideIcon,
} from "lucide-react";

export type ToolCategorySlug =
  | "core-transformations"
  | "text-cleaning"
  | "counting-statistics"
  | "sorting"
  | "find-replace"
  | "encoding"
  | "formatting"
  | "developer";

export interface Tool {
  slug: string;
  name: string;
  description: string;
}

export interface ToolCategory {
  slug: ToolCategorySlug;
  name: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  tools: Tool[];
}

export const CATEGORIES: ToolCategory[] = [
  {
    slug: "core-transformations",
    name: "Core Text Transformations",
    description: "Change case, reverse, and reshape text instantly.",
    icon: Type,
    gradient: "from-violet-500 to-fuchsia-500",
    tools: [
      { slug: "uppercase", name: "UPPERCASE", description: "Convert text to uppercase." },
      { slug: "lowercase", name: "lowercase", description: "Convert text to lowercase." },
      { slug: "title-case", name: "Title Case", description: "Capitalize the first letter of each word." },
      { slug: "sentence-case", name: "Sentence case", description: "Capitalize the first letter of each sentence." },
      { slug: "toggle-case", name: "tOGGLE cASE", description: "Swap the case of every character." },
      { slug: "invert-case", name: "Invert Case", description: "Alternate letters between lower and upper case." },
      { slug: "camel-case", name: "camelCase", description: "Convert text to camelCase." },
      { slug: "pascal-case", name: "PascalCase", description: "Convert text to PascalCase." },
      { slug: "snake-case", name: "snake_case", description: "Convert text to snake_case." },
      { slug: "kebab-case", name: "kebab-case", description: "Convert text to kebab-case." },
      { slug: "dot-case", name: "dot.case", description: "Convert text to dot.case." },
      { slug: "constant-case", name: "CONSTANT_CASE", description: "Convert text to CONSTANT_CASE." },
    ],
  },
  {
    slug: "text-cleaning",
    name: "Text Cleaning",
    description: "Trim, strip and sanitize noisy text.",
    icon: Sparkles,
    gradient: "from-emerald-500 to-teal-500",
    tools: [
      { slug: "remove-extra-spaces", name: "Remove Extra Spaces", description: "Collapse multiple spaces into a single space." },
      { slug: "remove-duplicate-lines", name: "Remove Duplicate Lines", description: "Delete repeated lines, keep first occurrence." },
      { slug: "remove-empty-lines", name: "Remove Empty Lines", description: "Strip lines that contain no characters." },
      { slug: "remove-blank-paragraphs", name: "Remove Blank Paragraphs", description: "Collapse multiple blank paragraphs into one break." },
      { slug: "remove-tabs", name: "Remove Tabs", description: "Replace every tab character with a single space." },
      { slug: "trim-spaces", name: "Trim Spaces", description: "Remove leading and trailing spaces from each line." },
      { slug: "normalize-whitespace", name: "Normalize Whitespace", description: "Standardize whitespace across the text." },
      { slug: "remove-multiple-line-breaks", name: "Remove Multiple Line Breaks", description: "Collapse 3+ line breaks into one blank line." },
    ],
  },
  {
    slug: "counting-statistics",
    name: "Counting & Statistics",
    description: "Measure characters, words, lines and more.",
    icon: Hash,
    gradient: "from-blue-500 to-indigo-500",
    tools: [
      { slug: "character-count", name: "Character Count", description: "Count characters, letters, numbers and more." },
      { slug: "word-count", name: "Word Count", description: "Count words and analyze word length." },
      { slug: "line-count", name: "Line Count", description: "Count total, empty and non-empty lines." },
      { slug: "paragraph-count", name: "Paragraph Count", description: "Count paragraphs separated by blank lines." },
      { slug: "sentence-count", name: "Sentence Count", description: "Count sentences and average sentence length." },
      { slug: "reading-time", name: "Reading Time", description: "Estimate reading duration at 200 WPM." },
      { slug: "speaking-time", name: "Speaking Time", description: "Estimate speaking duration at 130 WPM." },
      { slug: "keyword-density", name: "Keyword Density", description: "Find the top 10 most frequent words." },
    ],
  },
  {
    slug: "sorting",
    name: "Sorting",
    description: "Order lines and words alphabetically or numerically.",
    icon: ArrowUpDown,
    gradient: "from-orange-500 to-red-500",
    tools: [
      { slug: "sort-lines", name: "Sort Lines A–Z", description: "Sort lines alphabetically ascending." },
      { slug: "sort-lines-desc", name: "Sort Lines Z–A", description: "Sort lines alphabetically descending." },
      { slug: "sort-numbers-asc", name: "Sort Numbers Ascending", description: "Sort numeric lines from smallest to largest." },
      { slug: "sort-numbers-desc", name: "Sort Numbers Descending", description: "Sort numeric lines from largest to smallest." },
      { slug: "randomize-lines", name: "Randomize Lines", description: "Shuffle lines in random order." },
      { slug: "reverse-line-order", name: "Reverse Line Order", description: "Reverse the order of lines." },
      { slug: "reverse-characters", name: "Reverse Characters", description: "Reverse every character in the text." },
      { slug: "reverse-words", name: "Reverse Words", description: "Reverse the order of words per line." },
      { slug: "natural-sort", name: "Natural Sort", description: "Sort using natural ordering (Item 1, Item 2, Item 10)." },
      { slug: "case-insensitive-sort", name: "Case-Insensitive Sort", description: "Alphabetical sort ignoring letter case." },
    ],
  },
  {
    slug: "find-replace",
    name: "Find & Replace",
    description: "Search patterns and swap text at scale.",
    icon: Search,
    gradient: "from-pink-500 to-rose-500",
    tools: [
      { slug: "find-text", name: "Find Text", description: "Locate every occurrence of a search term." },
      { slug: "find-and-replace", name: "Find & Replace", description: "Replace matching text with another value." },
      { slug: "replace-first-occurrence", name: "Replace First Occurrence", description: "Replace only the first match." },
      { slug: "replace-last-occurrence", name: "Replace Last Occurrence", description: "Replace only the final match." },
      { slug: "replace-all", name: "Replace All", description: "Replace every occurrence in the text." },
      { slug: "remove-text", name: "Remove Text", description: "Delete every occurrence of a search term." },
      { slug: "highlight-matches", name: "Highlight Matches", description: "Highlight all matches without changing the text." },
      { slug: "regex-find-replace", name: "Regex Find & Replace", description: "Search and replace using regular expressions." },
    ],
  },
  {
    slug: "encoding",
    name: "Encoding",
    description: "Encode and decode Base64, URL, HTML and more.",
    icon: Lock,
    gradient: "from-amber-500 to-yellow-500",
    tools: [
      { slug: "base64-encode", name: "Base64 Encode", description: "Encode text to Base64." },
      { slug: "base64-decode", name: "Base64 Decode", description: "Decode Base64 back to text." },
      { slug: "url-encode", name: "URL Encode", description: "Percent-encode a string." },
      { slug: "url-decode", name: "URL Decode", description: "Decode a URL-encoded string." },
      { slug: "html-encode", name: "HTML Encode", description: "Escape special characters as HTML entities." },
      { slug: "html-decode", name: "HTML Decode", description: "Convert HTML entities back to text." },
      { slug: "unicode-encode", name: "Unicode Encode", description: "Convert characters to \\uXXXX escape sequences." },
      { slug: "unicode-decode", name: "Unicode Decode", description: "Decode \\uXXXX sequences back to text." },
      { slug: "binary-encode", name: "Binary Encode", description: "Convert text to 8-bit binary." },
      { slug: "binary-decode", name: "Binary Decode", description: "Decode space-separated binary back to text." },
      { slug: "hex-encode", name: "Hex Encode", description: "Convert text to hexadecimal bytes." },
      { slug: "hex-decode", name: "Hex Decode", description: "Decode hexadecimal bytes back to text." },
    ],
  },
  {
    slug: "formatting",
    name: "Formatting",
    description: "Pretty-print, indent and align your text.",
    icon: AlignLeft,
    gradient: "from-cyan-500 to-sky-500",
    tools: [
      { slug: "add-line-numbers", name: "Add Line Numbers", description: "Number every line sequentially." },
      { slug: "remove-line-numbers", name: "Remove Line Numbers", description: "Strip common numbering prefixes like 1., 1), 01." },
      { slug: "indent-text", name: "Indent Text", description: "Add 2 spaces, 4 spaces or a tab to each line." },
      { slug: "outdent-text", name: "Outdent Text", description: "Remove one indentation level from each line." },
      { slug: "align-left", name: "Align Left", description: "Trim leading whitespace so text starts at the margin." },
      { slug: "align-center", name: "Align Center", description: "Center every line within a fixed width." },
      { slug: "align-right", name: "Align Right", description: "Right-align every line within a fixed width." },
      { slug: "justify-text", name: "Justify Text", description: "Wrap and justify text across a fixed width." },
      { slug: "wrap-text", name: "Wrap Text", description: "Wrap long lines at a chosen width." },
      { slug: "unwrap-text", name: "Unwrap Text", description: "Merge wrapped lines while preserving paragraphs." },
      { slug: "add-prefix", name: "Add Prefix", description: "Prepend a custom prefix to every line." },
      { slug: "add-suffix", name: "Add Suffix", description: "Append a custom suffix to every line." },
      { slug: "remove-prefix", name: "Remove Prefix", description: "Strip a prefix from the start of each line." },
      { slug: "remove-suffix", name: "Remove Suffix", description: "Strip a suffix from the end of each line." },
      { slug: "add-bullet-points", name: "Add Bullet Points", description: "Turn every non-empty line into a bulleted list." },
      { slug: "remove-bullet-points", name: "Remove Bullet Points", description: "Strip bullet characters from the start of lines." },
    ],
  },
  {
    slug: "developer",
    name: "Developer Tools",
    description: "Format, minify, validate and convert code and data.",
    icon: Code2,
    gradient: "from-slate-500 to-zinc-600",
    tools: [
      { slug: "json-formatter", name: "JSON Formatter", description: "Pretty-print valid JSON with 2-space indentation." },
      { slug: "json-minifier", name: "JSON Minifier", description: "Compact JSON by removing whitespace." },
      { slug: "json-validator", name: "JSON Validator", description: "Check JSON validity and show parse errors." },
      { slug: "json-to-xml", name: "JSON to XML", description: "Convert JSON into equivalent XML." },
      { slug: "json-to-csv", name: "JSON to CSV", description: "Convert JSON arrays into CSV rows." },
      { slug: "json-to-yaml", name: "JSON to YAML", description: "Convert JSON into YAML." },
      { slug: "xml-formatter", name: "XML Formatter", description: "Beautify XML with indentation." },
      { slug: "xml-minifier", name: "XML Minifier", description: "Strip whitespace between XML tags." },
      { slug: "xml-validator", name: "XML Validator", description: "Validate XML syntax." },
      { slug: "html-formatter", name: "HTML Formatter", description: "Beautify HTML with indentation." },
      { slug: "html-minifier", name: "HTML Minifier", description: "Minify HTML while preserving structure." },
      { slug: "css-formatter", name: "CSS Formatter", description: "Beautify CSS with proper indentation." },
      { slug: "css-minifier", name: "CSS Minifier", description: "Strip comments and whitespace from CSS." },
      { slug: "javascript-formatter", name: "JavaScript Formatter", description: "Beautify JavaScript source." },
      { slug: "javascript-minifier", name: "JavaScript Minifier", description: "Minify JavaScript source." },
      { slug: "sql-formatter", name: "SQL Formatter", description: "Format SQL queries with keyword capitalisation." },
      { slug: "markdown-preview", name: "Markdown Preview", description: "Live preview of rendered Markdown." },
    ],
  },
];

export function getCategory(slug: string): ToolCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getTool(categorySlug: string, toolSlug: string) {
  const category = getCategory(categorySlug);
  const tool = category?.tools.find((t) => t.slug === toolSlug);
  return { category, tool };
}

export interface SearchHit {
  categorySlug: string;
  categoryName: string;
  tool: Tool;
}

export function searchTools(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const c of CATEGORIES) {
    for (const t of c.tools) {
      if (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
      ) {
        hits.push({ categorySlug: c.slug, categoryName: c.name, tool: t });
      }
    }
  }
  return hits.slice(0, 8);
}
