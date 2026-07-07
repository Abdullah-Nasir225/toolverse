import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Smartphone, Wand2, RefreshCcw, Heart, Lock } from "lucide-react";
import { Breadcrumbs } from "@/components/tool/Breadcrumbs";

const SITE_URL = "https://little-joys-link.lovable.app";
const URL = `${SITE_URL}/about`;
const TITLE = "About Toolverse — Powerful, Fast and Free Online Text Tools";
const DESCRIPTION =
  "Toolverse is a growing collection of free, privacy-friendly online text tools for writers, developers, students, marketers and businesses.";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
});

const FEATURES = [
  { icon: Zap, label: "Fast browser-based processing" },
  { icon: Wand2, label: "No software installation" },
  { icon: Smartphone, label: "Mobile friendly" },
  { icon: Sparkles, label: "Clean and intuitive interface" },
  { icon: RefreshCcw, label: "Regularly updated with new tools" },
  { icon: Heart, label: "Free to use" },
  { icon: Lock, label: "Privacy focused" },
  { icon: Shield, label: "Zero tracking by default" },
];

const AUDIENCES = [
  "Students",
  "Teachers",
  "Writers",
  "Bloggers",
  "Developers",
  "SEO Specialists",
  "Digital Marketers",
  "Businesses",
  "Content Creators",
];

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.15),transparent_50%)]"
        />
        <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 sm:pt-10">
          <Breadcrumbs items={[{ label: "About" }]} />
        </div>
        <div className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-500" />
            <span>About Toolverse</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance text-4xl font-bold tracking-tight sm:text-6xl"
          >
            About{" "}
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              Toolverse
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg"
          >
            Powerful, fast and free online text tools.
          </motion.p>
        </div>
      </section>

      <article className="mx-auto w-full max-w-3xl px-4 pb-20 sm:px-6">
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            Toolverse is a growing collection of free online tools designed to help writers,
            developers, students, marketers, businesses and everyday users work with text more
            efficiently.
          </p>
          <p>
            Our mission is to provide modern, easy-to-use and privacy-friendly tools that solve
            common text formatting, cleaning, conversion and analysis tasks without requiring
            software installation or account registration.
          </p>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Why choose Toolverse</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-4 transition hover:border-primary/40 hover:bg-card"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Who uses Toolverse</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <span
                key={a}
                className="rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-sm text-foreground"
              >
                {a}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-border/60 bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-pink-500/5 p-8 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Our vision</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            We aim to build one of the largest collections of useful online productivity tools,
            making everyday digital tasks faster and easier for users around the world.
          </p>
        </section>
      </article>
    </>
  );
}
