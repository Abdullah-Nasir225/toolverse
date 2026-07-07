import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getCategory } from "@/lib/tools-data";

interface Props {
  categorySlug: string;
  currentToolSlug: string;
}

export function RelatedTools({ categorySlug, currentToolSlug }: Props) {
  const category = getCategory(categorySlug);
  if (!category) return null;
  const related = category.tools.filter((t) => t.slug !== currentToolSlug).slice(0, 4);
  if (!related.length) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-4 text-xl font-semibold">Related tools</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {related.map((t) => (
          <Link
            key={t.slug}
            to="/tools/$category/$tool"
            params={{ category: categorySlug, tool: t.slug }}
            className="group flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-4 transition hover:border-primary/40 hover:bg-card"
          >
            <div className="min-w-0">
              <div className="truncate font-medium">{t.name}</div>
              <div className="truncate text-xs text-muted-foreground">{t.description}</div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </section>
  );
}
