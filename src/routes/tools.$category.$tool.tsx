import { useMemo } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Undo2, Redo2 } from "lucide-react";
import { getTool } from "@/lib/tools-data";
import { hasTransform, transform } from "@/lib/transformations";
import {
  analyzeCharacters,
  analyzeKeywordDensity,
  analyzeLines,
  analyzeParagraphs,
  analyzeReadingTime,
  analyzeSentences,
  analyzeSpeakingTime,
  analyzeWords,
  isAnalysisTool,
} from "@/lib/analysis";
import { isFindReplaceTool } from "@/lib/find-replace";
import { isFormattingTool } from "@/lib/formatting";
import { isDeveloperTool } from "@/lib/developer-tools";
import { FindReplaceView } from "@/components/tool/FindReplaceView";
import { FormattingView } from "@/components/tool/FormattingView";
import { DeveloperView } from "@/components/tool/DeveloperView";
import { MarkdownPreviewView } from "@/components/tool/MarkdownPreviewView";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { TextArea } from "@/components/tool/TextArea";
import { Toolbar } from "@/components/tool/Toolbar";
import { CopyButton } from "@/components/tool/CopyButton";
import { ClearButton } from "@/components/tool/ClearButton";
import { DownloadButton } from "@/components/tool/DownloadButton";
import { UploadButton } from "@/components/tool/UploadButton";
import { Statistics } from "@/components/tool/Statistics";
import { AnalysisPanel } from "@/components/tool/AnalysisPanel";
import { Button } from "@/components/ui/button";
import { useHistoryState } from "@/hooks/use-history-state";

export const Route = createFileRoute("/tools/$category/$tool")({
  loader: ({ params }) => {
    const { category, tool } = getTool(params.category, params.tool);
    if (!category || !tool) throw notFound();
  },
  head: ({ params }) => {
    const { category, tool } = getTool(params.category, params.tool);
    if (!category || !tool) return {};
    const title = `${tool.name} — Toolverse`;
    const description = `${tool.description} Free, private, browser-based ${category.name.toLowerCase()} tool from Toolverse.`;
    const url = `https://little-joys-link.lovable.app/tools/${category.slug}/${tool.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ToolPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold">Tool not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The tool you're looking for doesn't exist yet.
      </p>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function ToolPage() {
  const params = Route.useParams();
  const { category, tool } = getTool(params.category, params.tool);
  if (!category || !tool) return null;

  const analysis = isAnalysisTool(tool.slug);
  const findReplace = isFindReplaceTool(tool.slug);
  const formatting = isFormattingTool(tool.slug);
  const developer = isDeveloperTool(tool.slug);
  const markdown = tool.slug === "markdown-preview";

  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      categorySlug={category.slug}
      toolSlug={tool.slug}
      breadcrumbs={[
        { label: category.name, to: "/tools/$category", params: { category: category.slug } },
        { label: tool.name },
      ]}
      faq={[
        {
          q: `What does the ${tool.name} tool do?`,
          a: `${tool.description} Everything runs live in your browser as you type.`,
        },
        {
          q: "Is my text stored anywhere?",
          a: "No. All processing happens locally in your browser — nothing is uploaded.",
        },
        {
          q: "Is there a file size limit?",
          a: "You can process reasonably large files directly in your browser. Very large files may impact performance.",
        },
      ]}
    >
      {markdown ? (
        <MarkdownPreviewView />
      ) : developer ? (
        <DeveloperView slug={tool.slug} />
      ) : findReplace ? (
        <FindReplaceView slug={tool.slug} />
      ) : formatting ? (
        <FormattingView slug={tool.slug} />
      ) : analysis ? (
        <AnalysisView slug={tool.slug} />
      ) : (
        <TransformView slug={tool.slug} />
      )}
    </ToolLayout>
  );
}

function TransformView({ slug }: { slug: string }) {
  const { value: input, setValue, undo, redo, reset, canUndo, canRedo } = useHistoryState("");
  const supported = hasTransform(slug);
  const output = useMemo(
    () => (supported ? transform(slug, input) : input),
    [input, slug, supported],
  );

  return (
    <div className="space-y-4">
      <Toolbar>
        <UploadButton onFile={(text) => setValue(text)} />
        <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo} aria-label="Undo">
          <Undo2 className="h-4 w-4" /> Undo
        </Button>
        <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo} aria-label="Redo">
          <Redo2 className="h-4 w-4" /> Redo
        </Button>
        <ClearButton onClear={() => reset("")} />
        <Button size="sm" onClick={() => setValue(input)} disabled={!input}>
          Process Text
        </Button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <CopyButton value={output} label="Copy output" />
          <DownloadButton value={output} filename={`${slug}.txt`} />
        </div>
      </Toolbar>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea
          label="Input"
          hint="Paste, type or upload your text"
          placeholder="Type or paste text here…"
          value={input}
          onChange={(e) => setValue(e.target.value)}
        />
        <TextArea
          label="Output"
          hint="Updates live as you type"
          placeholder="Output will appear here…"
          value={output}
          readOnly
        />
      </div>

      <Statistics text={input} />
    </div>
  );
}

function AnalysisView({ slug }: { slug: string }) {
  const { value: input, setValue, undo, redo, reset, canUndo, canRedo } = useHistoryState("");

  const { stats, keywords } = useMemo(() => {
    switch (slug) {
      case "character-count":
        return { stats: analyzeCharacters(input) };
      case "word-count":
        return { stats: analyzeWords(input) };
      case "line-count":
        return { stats: analyzeLines(input) };
      case "paragraph-count":
        return { stats: analyzeParagraphs(input) };
      case "sentence-count":
        return { stats: analyzeSentences(input) };
      case "reading-time":
        return { stats: analyzeReadingTime(input) };
      case "speaking-time":
        return { stats: analyzeSpeakingTime(input) };
      case "keyword-density":
        return { stats: [], keywords: analyzeKeywordDensity(input) };
      default:
        return { stats: [] };
    }
  }, [input, slug]);

  return (
    <div className="space-y-4">
      <Toolbar>
        <UploadButton onFile={(text) => setValue(text)} />
        <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo} aria-label="Undo">
          <Undo2 className="h-4 w-4" /> Undo
        </Button>
        <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo} aria-label="Redo">
          <Redo2 className="h-4 w-4" /> Redo
        </Button>
        <ClearButton onClear={() => reset("")} />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <CopyButton value={input} label="Copy input" />
          <DownloadButton value={input} filename={`${slug}.txt`} />
        </div>
      </Toolbar>

      <TextArea
        label="Input"
        hint="Analysis updates live as you type"
        placeholder="Type or paste text here…"
        value={input}
        onChange={(e) => setValue(e.target.value)}
        className="min-h-[300px]"
      />

      <AnalysisPanel stats={stats} keywords={keywords} />
    </div>
  );
}
