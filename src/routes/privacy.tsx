import { createFileRoute } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { Breadcrumbs } from "@/components/tool/Breadcrumbs";

const SITE_URL = "https://little-joys-link.lovable.app";
const URL = `${SITE_URL}/privacy`;
const TITLE = "Privacy Policy — Toolverse";
const DESCRIPTION =
  "How Toolverse handles your data: most text is processed locally in your browser. Learn what we collect, how cookies are used and how to contact us.";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
});

function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Privacy Policy"
      updated="July 2026"
      icon={<Shield className="h-3.5 w-3.5 text-fuchsia-500" />}
      breadcrumb="Privacy"
    >
      <p className="lead">Your privacy is important to us.</p>
      <p>
        Toolverse is designed to process most text directly within your browser. Whenever
        possible, your data never leaves your device.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Anonymous analytics (if enabled)</li>
        <li>Basic device and browser information</li>
        <li>Cookies for improving user experience</li>
        <li>Theme preference (light or dark mode)</li>
      </ul>
      <p>We do <strong>not</strong> sell personal information.</p>
      <p>
        We do <strong>not</strong> permanently store text you process unless a feature explicitly
        requires cloud storage.
      </p>

      <h2>Cookies</h2>
      <p>Cookies may be used to improve functionality and remember preferences.</p>

      <h2>Third-party services</h2>
      <p>
        Our website may use services such as Google Analytics and Google AdSense. These services
        may collect anonymous usage information according to their own privacy policies.
      </p>

      <h2>Advertising</h2>
      <p>
        Advertisements displayed on this website may be provided by Google AdSense or other
        advertising partners.
      </p>

      <h2>Changes</h2>
      <p>This Privacy Policy may be updated periodically.</p>

      <h2>Contact</h2>
      <p>
        Questions regarding privacy can be directed to{" "}
        <a href="mailto:support@toolverse.app">support@toolverse.app</a>. (This is a placeholder.)
      </p>
    </LegalShell>
  );
}

// Shared legal page shell — kept local since only privacy/terms use it.
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function LegalShell({
  eyebrow,
  title,
  updated,
  icon,
  breadcrumb,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  icon: ReactNode;
  breadcrumb: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.15),transparent_50%)]"
        />
        <div className="mx-auto w-full max-w-3xl px-4 pt-8 sm:px-6 sm:pt-10">
          <Breadcrumbs items={[{ label: breadcrumb }]} />
        </div>
        <div className="mx-auto max-w-3xl px-6 py-14 text-center sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs backdrop-blur"
          >
            {icon}
            <span>{eyebrow}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance text-4xl font-bold tracking-tight sm:text-5xl"
          >
            {title}
          </motion.h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {updated}</p>
        </div>
      </section>

      <article className="prose-legal mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6">
        {children}
      </article>
    </>
  );
}
