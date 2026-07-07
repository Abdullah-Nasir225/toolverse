import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { LegalShell } from "./privacy";

const SITE_URL = "https://little-joys-link.lovable.app";
const URL = `${SITE_URL}/terms`;
const TITLE = "Terms & Conditions — Toolverse";
const DESCRIPTION =
  "The terms that govern your use of Toolverse, including acceptable use, availability, intellectual property and limitations of liability.";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
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

function TermsPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Terms & Conditions"
      updated="July 2026"
      icon={<FileText className="h-3.5 w-3.5 text-fuchsia-500" />}
      breadcrumb="Terms"
    >
      <p className="lead">Welcome to Toolverse.</p>
      <p>By using this website you agree to these terms.</p>

      <h2>Use of services</h2>
      <p>All tools are provided for informational and productivity purposes.</p>
      <p>
        Users are responsible for verifying any generated or processed content before using it
        professionally.
      </p>

      <h2>Availability</h2>
      <p>
        We strive to keep all services available but cannot guarantee uninterrupted access.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Users agree not to misuse the website or attempt to damage, overload or interfere with its
        operation.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The website design, branding and original content belong to Toolverse unless otherwise
        stated.
      </p>

      <h2>Limitation of liability</h2>
      <p>Toolverse is provided &ldquo;as is&rdquo; without warranties of any kind.</p>

      <h2>Contact</h2>
      <p>
        <a href="mailto:support@toolverse.app">support@toolverse.app</a> (placeholder)
      </p>
    </LegalShell>
  );
}
