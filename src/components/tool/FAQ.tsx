import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  q: string;
  a: string;
}

export function FAQ({ items }: { items: FAQItem[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-14">
      <h2 className="mb-4 text-xl font-semibold">Frequently asked questions</h2>
      <Accordion type="single" collapsible className="rounded-xl border border-border/60 bg-card/40 px-4">
        {items.map((it, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border/60">
            <AccordionTrigger className="text-left text-sm font-medium">{it.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{it.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
