import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ToolCategory } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

export function CategoryCard({ category, index = 0 }: { category: ToolCategory; index?: number }) {
  const Icon = category.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <Link
        to="/tools/$category"
        params={{ category: category.slug }}
        className="group relative block h-full overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
      >
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 bg-gradient-to-br opacity-0 transition group-hover:opacity-[0.06]",
            category.gradient,
          )}
        />
        <Icon className="mb-5 h-7 w-7 text-foreground" />
        <h3 className="text-lg font-semibold">{category.name}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{category.description}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{category.tools.length} tools</span>
          <span className="inline-flex items-center gap-1 font-medium text-foreground transition group-hover:text-primary">
            Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
