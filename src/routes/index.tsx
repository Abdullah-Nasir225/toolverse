import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { Testimonials } from "@/components/Testimonials";
import { CATEGORIES } from "@/lib/tools-data";

const SITE_URL = "https://little-joys-link.lovable.app";
const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/99504128-fb3b-4942-b258-885ee3d163aa/id-preview-f6049423--cb96adb7-8145-410c-a5be-edbbe5b158fb.lovable.app-1783320814939.png";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Toolverse — 50+ browser-based text transformation tools" },
      {
        name: "description",
        content:
          "Transform, clean, count, sort, encode and format text with 50+ free browser-based tools. No sign-up, no tracking — everything runs locally.",
      },
      { property: "og:title", content: "Toolverse — 50+ browser-based text transformation tools" },
      {
        property: "og:description",
        content:
          "Transform, clean, count, sort, encode and format text with 50+ free browser-based tools. No sign-up, no tracking — everything runs locally.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
});

function Home() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-[1536px] px-4 pb-16 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Explore Tools</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a category to explore its tools.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <CategoryCard key={c.slug} category={c} index={i} />
          ))}
        </div>
      </section>
      <Testimonials />
    </>
  );
}
