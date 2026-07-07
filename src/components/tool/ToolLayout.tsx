import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { FAQ, type FAQItem } from "./FAQ";
import { RelatedTools } from "./RelatedTools";

interface Props {
  title: string;
  description?: string;
  breadcrumbs: Crumb[];
  categorySlug: string;
  toolSlug: string;
  faq?: FAQItem[];
  children: ReactNode;
}

export function ToolLayout({
  title,
  description,
  breadcrumbs,
  categorySlug,
  toolSlug,
  faq = [],
  children,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs items={breadcrumbs} />
      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        )}
      </header>

      <div className="mt-8">{children}</div>

      <FAQ items={faq} />
      <RelatedTools categorySlug={categorySlug} currentToolSlug={toolSlug} />
    </div>
  );
}
