import { Link, useRouterState } from "@tanstack/react-router";
import { X, PanelLeftClose, PanelLeftOpen, Home, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { CATEGORIES } from "@/lib/tools-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ mobileOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const renderNav = (isCollapsed: boolean) => (
    <TooltipProvider delayDuration={100}>
      <nav className={cn("flex flex-col gap-1", isCollapsed ? "p-2" : "p-4")}>
        <NavItem
          to="/"
          label="Home"
          active={pathname === "/"}
          collapsed={isCollapsed}
          onClick={onClose}
          icon={<Home className="h-4 w-4 shrink-0" />}
        />

        {!isCollapsed && (
          <div className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categories
          </div>
        )}
        {isCollapsed && <div className="my-2 border-t border-border/60" />}

        {CATEGORIES.map((c) => {
          const active = pathname.startsWith(`/tools/${c.slug}`);
          const Icon = c.icon;
          return (
            <NavItem
              key={c.slug}
              to="/tools/$category"
              params={{ category: c.slug }}
              label={c.name}
              active={active}
              collapsed={isCollapsed}
              onClick={onClose}
              icon={<Icon className="h-4 w-4 shrink-0" />}
            />
          );
        })}
      </nav>
    </TooltipProvider>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "hidden shrink-0 border-r border-border/60 transition-[width] duration-200 lg:block",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className={cn("flex items-center border-b border-border/60 px-2 py-2", collapsed ? "justify-center" : "justify-end")}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>
          {renderNav(collapsed)}
        </div>
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-border/60 bg-background lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <span className="font-semibold">Menu</span>
                <div className="flex items-center gap-1">
                  <ThemeToggleButton />
                  <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {renderNav(false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface NavItemProps {
  to: string;
  params?: Record<string, string>;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

function NavItem({ to, params, label, active, collapsed, onClick, icon }: NavItemProps) {
  const link = (
    <Link
      to={to as any}
      params={params as any}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg text-sm transition",
        collapsed ? "justify-center p-1.5" : "px-3 py-2",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      {icon}
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function ThemeToggleButton() {
  const { theme, toggle } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
