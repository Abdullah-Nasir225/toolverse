import { Link } from "@tanstack/react-router";
import { Feather, Github, Twitter } from "lucide-react";
import { CATEGORIES } from "@/lib/tools-data";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-[1536px] px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
                <Feather className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">Toolverse</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              A premium suite of text transformation tools crafted for writers, developers and power users.
            </p>
            <div className="mt-4 flex gap-2">
              <a href="#" className="rounded-md p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-md p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {CATEGORIES.slice(0, 6).map((c) => (
              <div key={c.slug}>
                <Link
                  to="/tools/$category"
                  params={{ category: c.slug }}
                  className="text-sm font-semibold hover:text-primary"
                >
                  {c.name}
                </Link>
                <ul className="mt-2 space-y-1">
                  {c.tools.slice(0, 3).map((t) => (
                    <li key={t.slug}>
                      <Link
                        to="/tools/$category/$tool"
                        params={{ category: c.slug, tool: t.slug }}
                        className="text-xs text-muted-foreground transition hover:text-foreground"
                      >
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <div className="text-sm font-semibold">Company</div>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li><Link to="/about" className="transition hover:text-foreground">About</Link></li>
              <li><Link to="/privacy" className="transition hover:text-foreground">Privacy</Link></li>
              <li><Link to="/terms" className="transition hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Toolverse. All rights reserved.</p>
          <p>Design & Develop by <a href='https://abdullahdev.zya.me'>Abdullah Nasir.</a></p>
        </div>
      </div>
    </footer>
  );
}
