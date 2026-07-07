import { useMemo } from "react";
import { Undo2, Redo2 } from "lucide-react";
import { TextArea } from "./TextArea";
import { Toolbar } from "./Toolbar";
import { CopyButton } from "./CopyButton";
import { ClearButton } from "./ClearButton";
import { DownloadButton } from "./DownloadButton";
import { UploadButton } from "./UploadButton";
import { Button } from "@/components/ui/button";
import { useHistoryState } from "@/hooks/use-history-state";
import { runDeveloperTool, developerStats } from "@/lib/developer-tools";

const EXT: Record<string, string> = {
  "json-formatter": "json",
  "json-minifier": "json",
  "json-validator": "txt",
  "json-to-xml": "xml",
  "json-to-csv": "csv",
  "json-to-yaml": "yaml",
  "xml-formatter": "xml",
  "xml-minifier": "xml",
  "xml-validator": "txt",
  "html-formatter": "html",
  "html-minifier": "html",
  "css-formatter": "css",
  "css-minifier": "css",
  "javascript-formatter": "js",
  "javascript-minifier": "js",
  "sql-formatter": "sql",
};

export function DeveloperView({ slug }: { slug: string }) {
  const { value: input, setValue, undo, redo, reset, canUndo, canRedo } = useHistoryState("");

  const output = useMemo(() => runDeveloperTool(slug, input), [slug, input]);
  const stats = useMemo(() => developerStats(slug, input), [slug, input]);

  const ext = EXT[slug] ?? "txt";

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
          <CopyButton value={output} label="Copy output" />
          <DownloadButton value={output} filename={`${slug}.${ext}`} />
        </div>
      </Toolbar>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea
          label="Input"
          hint="Paste, type or upload your code"
          placeholder="Type or paste input here…"
          value={input}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[320px]"
        />
        <TextArea
          label="Output"
          hint="Updates live as you type"
          placeholder="Output will appear here…"
          value={output}
          readOnly
          className="min-h-[320px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-4">
        <Stat label="Characters" value={stats.characters} />
        <Stat label="Lines" value={stats.lines} />
        <Stat label="Words" value={stats.words} />
        <Stat label="Bytes (UTF-8)" value={stats.bytes} />
        {stats.extras.map((s) => (
          <Stat key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value.toLocaleString()}</div>
    </div>
  );
}
