import { useMemo } from "react";

interface Props {
  text: string;
}

export function Statistics({ text }: Props) {
  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const sentences = text.trim()
      ? text.split(/[.!?]+/).filter((s) => s.trim()).length
      : 0;
    const paragraphs = text.trim()
      ? text.split(/\n\s*\n+/).filter((p) => p.trim()).length
      : 0;
    return { characters, charactersNoSpaces, words, sentences, lines, paragraphs };
  }, [text]);

  const items = [
    { label: "Characters", value: stats.characters },
    { label: "No spaces", value: stats.charactersNoSpaces },
    { label: "Words", value: stats.words },
    { label: "Sentences", value: stats.sentences },
    { label: "Lines", value: stats.lines },
    { label: "Paragraphs", value: stats.paragraphs },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-xl border border-border/60 bg-card/40 p-3 text-center"
        >
          <div className="text-xl font-semibold tabular-nums">{it.value.toLocaleString()}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}
