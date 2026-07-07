import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/tool/Breadcrumbs";
import { getCategory } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

const SITE_URL = "https://little-joys-link.lovable.app";

export const Route = createFileRoute("/tools/$category/")({
  component: CategoryIndexPage,
  head: ({ params }) => {
    const category = getCategory(params.category);
    const name = category?.name ?? "Tools";
    const description =
      category?.description ??
      "Browse Toolverse tools by category — free, private, browser-based text utilities.";
    const title = `${name} — Toolverse`;
    const url = `${SITE_URL}/tools/${params.category}`;
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
});

function CategoryIndexPage() {
  const { category: categorySlug } = Route.useParams();
  const category = getCategory(categorySlug);
  if (!category) return null;
  const Icon = category.icon;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={[{ label: category.name }]} />

      <header className="mt-6 flex items-start gap-4">
        <div
          className={cn(
            "grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
            category.gradient,
          )}
        >
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
          <p className="mt-1 text-muted-foreground">{category.description}</p>
        </div>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {category.tools.map((t, i) => (
          <motion.div
            key={t.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          >
            <Link
              to="/tools/$category/$tool"
              params={{ category: category.slug, tool: t.slug }}
              className="group flex h-full flex-col justify-between rounded-xl border border-border/60 bg-card/40 p-5 transition hover:border-primary/40 hover:bg-card"
            >
              <div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition group-hover:text-primary">
                Open tool <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
