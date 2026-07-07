import { motion } from "framer-motion";
import { Sparkles, Zap, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.15),transparent_50%)]"
      />
      <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-fuchsia-500" />
          <span>50+ tools · Built for speed · Zero tracking</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance text-4xl font-bold tracking-tight sm:text-6xl"
        >
          Transform, Clean & Analyze {" "}
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            Text Instantly
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg"
        >
          Edit, format, clean, convert and analyze text with over 80+ free online text tools. Fast, privacy-friendly, and works directly in your
           browser—no installation or sign-up required.
        </motion.p>
      </div>
    </section>
  );
}
