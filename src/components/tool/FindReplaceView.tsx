import { useMemo, useState } from "react";
import { Undo2, Redo2 } from "lucide-react";
import { TextArea } from "./TextArea";
import { Toolbar } from "./Toolbar";
import { CopyButton } from "./CopyButton";
import { ClearButton } from "./ClearButton";
import { DownloadButton } from "./DownloadButton";
import { UploadButton } from "./UploadButton";
import { Statistics } from "./Statistics";
import { Button } from "@/components/ui/button";
import { useHistoryState } from "@/hooks/use-history-state";
import {
  highlightHTML,
  needsReplaceField,
  runFindReplace,
  type FindReplaceOptions,
} from "@/lib/find-replace";

export function FindReplaceView({ slug }: { slug: string }) {
  const { value: input, setValue, undo, redo, reset, canUndo, canRedo } = useHistoryState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [useRegex, setUseRegex] = useState(slug === "regex-find-replace");

  const opts: FindReplaceOptions = { matchCase, wholeWord, regex: useRegex };
  const showReplace = needsReplaceField(slug);
  const isHighlight = slug === "find-text" || slug === "highlight-matches";

  const { output, matches, error } = useMemo(
    () => runFindReplace(slug, input, find, replace, opts),
    [slug, input, find, replace, matchCase, wholeWord, useRegex],
  );

  const highlighted = useMemo(
    () => (isHighlight ? highlightHTML(input, find, opts) : null),
    [isHighlight, input, find, matchCase, wholeWord, useRegex],
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
        <ClearButton
          onClear={() => {
            reset("");
            setFind("");
            setReplace("");
          }}
        />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <CopyButton value={output} label="Copy output" />
          <DownloadButton value={output} filename={`${slug}.txt`} />
        </div>
      </Toolbar>

      <div className="grid gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Find {slug === "regex-find-replace" && <span>(regex)</span>}
          </label>
          <input
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder={slug === "regex-find-replace" ? "e.g. \\d+" : "Search for…"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>
        {showReplace && (
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Replace with
            </label>
            <input
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder="Replacement text…"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Match case
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
              disabled={useRegex}
              className="h-4 w-4 rounded border-border"
            />
            Match whole word
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useRegex}
              onChange={(e) => setUseRegex(e.target.checked)}
              disabled={slug === "regex-find-replace"}
              className="h-4 w-4 rounded border-border"
            />
            Use regular expression
          </label>
          <div className="ml-auto text-sm text-muted-foreground">
            {error ? (
              <span className="text-destructive">Invalid pattern: {error}</span>
            ) : (
              <>
                <span className="font-semibold text-foreground tabular-nums">{matches}</span>{" "}
                match{matches === 1 ? "" : "es"}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TextArea
          label="Input"
          hint="Paste, type or upload your text"
          placeholder="Type or paste text here…"
          value={input}
          onChange={(e) => setValue(e.target.value)}
        />
        {isHighlight ? (
          <div className="flex h-full flex-col">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Highlighted</label>
              <span className="text-xs text-muted-foreground">Updates live</span>
            </div>
            <div
              className="min-h-[280px] flex-1 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-muted/20 p-4 font-mono text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  highlighted?.html ||
                  '<span class="text-muted-foreground">Highlighted matches will appear here…</span>',
              }}
            />
          </div>
        ) : (
          <TextArea
            label="Output"
            hint="Updates live as you type"
            placeholder="Output will appear here…"
            value={output}
            readOnly
          />
        )}
      </div>

      <Statistics text={input} />
    </div>
  );
}
