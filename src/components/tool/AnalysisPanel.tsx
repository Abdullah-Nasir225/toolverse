import type { StatItem, KeywordRow } from "@/lib/analysis";

interface Props {
  stats: StatItem[];
  keywords?: KeywordRow[];
}

export function AnalysisPanel({ stats, keywords }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border/60 bg-card/40 p-4"
          >
            <div className="text-2xl font-semibold tabular-nums break-words">
              {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {keywords && (
        <div className="rounded-xl border border-border/60 bg-card/40 p-4">
          <div className="mb-3 text-sm font-medium">Top 10 keywords</div>
          {keywords.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Start typing to see the most frequent words.
            </div>
          ) : (
            <div className="space-y-2">
              {keywords.map((k) => (
                <div key={k.word} className="flex items-center gap-3">
                  <div className="w-32 truncate text-sm font-mono">{k.word}</div>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary"
                      style={{ width: `${Math.min(100, k.percent)}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm tabular-nums">
                    {k.count}
                  </div>
                  <div className="w-16 text-right text-xs text-muted-foreground tabular-nums">
                    {k.percent.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
