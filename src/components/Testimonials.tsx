import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    role: "Content Writer",
    review:
      "Toolverse has completely replaced the three formatting sites I used to juggle. Everything is fast and just works in the browser.",
  },
  {
    name: "Priya Nair",
    role: "SEO Specialist",
    review:
      "I use the case converter and word counter every single day. Clean UI, zero ads, and results are instant.",
  },
  {
    name: "Daniel Kim",
    role: "Frontend Developer",
    review:
      "The JSON, Base64 and encoding tools are lifesavers. It's rare to find utilities this polished and this private.",
  },
  {
    name: "Sophia Martinez",
    role: "Digital Marketer",
    review:
      "Love that nothing gets uploaded anywhere. Perfect for cleaning up client copy without worrying about privacy.",
  },
  {
    name: "Rohit Verma",
    role: "Student",
    review:
      "Helps me format essays and count words in seconds. The mobile experience is surprisingly great too.",
  },
  {
    name: "Emily Chen",
    role: "Product Manager",
    review:
      "A beautifully designed toolkit. Toolverse feels premium but is completely free — genuinely impressive.",
  },
];

export function Testimonials() {
  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true }),
  );

  return (
    <section className="mx-auto max-w-[1536px] px-4 pb-20 sm:px-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Loved by writers, developers and marketers
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Real feedback from people using Toolverse every day.
        </p>
      </div>

      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[autoplay.current]}
        className="relative"
      >
        <CarouselContent className="-ml-5">
          {TESTIMONIALS.map((t, i) => (
            <CarouselItem
              key={t.name}
              className="pl-5 sm:basis-1/2 lg:basis-1/3"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative h-full rounded-2xl border border-border/60 bg-card/40 p-6 transition hover:border-primary/40 hover:bg-card"
              >
                <Quote className="h-6 w-6 text-fuchsia-500/60" />
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="mt-5 border-t border-border/50 pt-4">
                  <div className="text-sm font-semibold text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4" />
        <CarouselNext className="hidden sm:flex -right-4" />
      </Carousel>
    </section>
  );
}
