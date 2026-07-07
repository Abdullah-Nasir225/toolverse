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
  runFormatting,
  optionFlags,
  type BulletStyle,
  type FormattingOptions,
  type IndentUnit,
} from "@/lib/formatting";

const BULLETS: BulletStyle[] = ["•", "-", "*", "→"];

export function FormattingView({ slug }: { slug: string }) {
  const { value: input, setValue, undo, redo, reset, canUndo, canRedo } = useHistoryState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [width, setWidth] = useState(80);
  const [indent, setIndent] = useState<IndentUnit>("2sp");
  const [bullet, setBullet] = useState<BulletStyle>("•");

  const flags = optionFlags(slug);
  const showOptions = flags.prefix || flags.suffix || flags.width || flags.indent || flags.bullet;

  const opts: FormattingOptions = { prefix, suffix, width, indent, bullet };

  const output = useMemo(
    () => runFormatting(slug, input, opts),
    [slug, input, prefix, suffix, width, indent, bullet],
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
            setPrefix("");
            setSuffix("");
          }}
        />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <CopyButton value={output} label="Copy output" />
          <DownloadButton value={output} filename={`${slug}.txt`} />
        </div>
      </Toolbar>

      {showOptions && (
        <div className="grid gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 sm:grid-cols-2">
          {flags.prefix && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {slug === "remove-prefix" ? "Prefix to remove" : "Prefix"}
              </label>
              <input
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="e.g. > "
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>
          )}
          {flags.suffix && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {slug === "remove-suffix" ? "Suffix to remove" : "Suffix"}
              </label>
              <input
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder="e.g. ;"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>
          )}
          {flags.width && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Width (characters)
              </label>
              <input
                type="number"
                min={1}
                max={2000}
                value={width}
                onChange={(e) => setWidth(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>
          )}
          {flags.indent && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Indentation
              </label>
              <select
                value={indent}
                onChange={(e) => setIndent(e.target.value as IndentUnit)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              >
                <option value="2sp">2 spaces</option>
                <option value="4sp">4 spaces</option>
                <option value="tab">Tab</option>
              </select>
            </div>
          )}
          {flags.bullet && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Bullet style
              </label>
              <div className="flex flex-wrap gap-2">
                {BULLETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBullet(b)}
                    className={`rounded-lg border px-3 py-2 font-mono text-sm transition ${
                      bullet === b
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
