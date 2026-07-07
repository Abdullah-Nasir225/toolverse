import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Moon, Sun, Menu, Feather, User as UserIcon, Settings as SettingsIcon, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { searchTools } from "@/lib/tools-data";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const hits = searchTools(query);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function goTo(categorySlug: string, toolSlug: string) {
    setQuery("");
    setOpen(false);
    navigate({
      to: "/tools/$category/$tool",
      params: { category: categorySlug, tool: toolSlug },
    });
  }


  return (
    <>
      <div ref={containerRef} className="relative w-full border-b border-border/60 bg-background px-4 pb-2 pt-2 sm:px-6 lg:hidden">
        <SearchField
          query={query}
          setQuery={setQuery}
          open={open}
          setOpen={setOpen}
          hits={hits}
          goTo={goTo}
        />
      </div>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">


      <div className="mx-auto flex h-16 max-w-[1536px] items-center gap-3 px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>


        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20">
            <Feather className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Tool<span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">verse</span>
          </span>
        </Link>

        <div ref={containerRef} className="relative ml-auto hidden min-w-0 flex-1 max-w-md lg:block">
          <SearchField
            query={query}
            setQuery={setQuery}
            open={open}
            setOpen={setOpen}
            hits={hits}
            goTo={goTo}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label="Toggle theme"
          className="ml-auto hidden lg:inline-flex"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>


        {!loading && !user ? (
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/auth/login">Log in</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90"
            >
              <Link to="/auth/signup">Sign up</Link>
            </Button>
          </div>
        ) : null}


        {!loading && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Account menu"
                className="ml-auto rounded-full outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:ml-0"
              >
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src={user.user_metadata?.avatar_url ?? undefined} alt="" />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
                    {(user.email ?? "?").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                <UserIcon className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/", replace: true });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>



    </header>
    </>

  );
}

interface SearchFieldProps {
  query: string;
  setQuery: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  hits: ReturnType<typeof searchTools>;
  goTo: (categorySlug: string, toolSlug: string) => void;
}

function SearchField({ query, setQuery, open, setOpen, hits, goTo }: SearchFieldProps) {
  return (
    <>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <label htmlFor="site-search" className="sr-only">
          Search tools
        </label>
        <input
          id="site-search"
          type="search"
          aria-label="Search tools"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search tools…"
          className="h-10 w-full rounded-full border border-border bg-muted/40 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:bg-background focus:ring-2 focus:ring-ring/40"
        />
      </div>
      <AnimatePresence>
        {open && hits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute left-0 right-0 top-12 z-50 mx-4 overflow-hidden rounded-xl border border-border bg-popover shadow-xl sm:mx-6 lg:mx-0"
          >
            <ul className="max-h-80 overflow-auto py-1">
              {hits.map((h) => (
                <li key={`${h.categorySlug}/${h.tool.slug}`}>
                  <button
                    type="button"
                    onClick={() => goTo(h.categorySlug, h.tool.slug)}
                    className="flex w-full flex-col items-start px-4 py-2.5 text-left transition hover:bg-accent"
                  >
                    <span className="text-sm font-medium">{h.tool.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {h.categoryName} · {h.tool.description}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

