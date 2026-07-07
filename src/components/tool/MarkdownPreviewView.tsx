import { useMemo, useState } from "react";
import { marked } from "marked";
import { Eye, EyeOff, Undo2, Redo2 } from "lucide-react";
import { TextArea } from "./TextArea";
import { Toolbar } from "./Toolbar";
import { CopyButton } from "./CopyButton";
import { ClearButton } from "./ClearButton";
import { DownloadButton } from "./DownloadButton";
import { UploadButton } from "./UploadButton";
import { Statistics } from "./Statistics";
import { Button } from "@/components/ui/button";
import { useHistoryState } from "@/hooks/use-history-state";

marked.setOptions({ gfm: true, breaks: false });

export function MarkdownPreviewView() {
  const { value: input, setValue, undo, redo, reset, canUndo, canRedo } = useHistoryState("");
  const [showPreview, setShowPreview] = useState(true);

  const html = useMemo(() => {
    try {
      return marked.parse(input) as string;
    } catch {
      return "";
    }
  }, [input]);

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview((v) => !v)}
          aria-label="Toggle preview"
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPreview ? "Hide preview" : "Show preview"}
        </Button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <CopyButton value={input} label="Copy Markdown" />
          <CopyButton value={html} label="Copy HTML" />
          <DownloadButton value={input} filename="markdown.md" />
        </div>
      </Toolbar>

      <div className={`grid gap-4 ${showPreview ? "lg:grid-cols-2" : ""}`}>
        <TextArea
          label="Markdown"
          hint="Paste or type Markdown"
          placeholder="# Hello world"
          value={input}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[320px]"
        />
        {showPreview && (
          <div className="flex h-full flex-col">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Preview</label>
              <span className="text-xs text-muted-foreground">Rendered live</span>
            </div>
            <div
              className="prose prose-sm dark:prose-invert min-h-[280px] max-w-none flex-1 overflow-auto rounded-xl border border-border bg-muted/20 p-4 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  html ||
                  '<span class="text-muted-foreground">Rendered Markdown will appear here…</span>',
              }}
            />
          </div>
        )}
      </div>

      <Statistics text={input} />
    </div>
  );
}
